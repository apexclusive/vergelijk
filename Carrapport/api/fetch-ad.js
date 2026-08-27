const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const dns = require('node:dns').promises;
const net = require('node:net');

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const isPrivateAddress = (address) => {
  if (net.isIP(address) === 4) {
    const octets = address.split('.').map(Number);
    return octets[0] === 10
      || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31)
      || (octets[0] === 192 && octets[1] === 168)
      || octets[0] === 127
      || octets[0] === 169 && octets[1] === 254;
  }

  return net.isIP(address) === 6 && (
    address === '::1'
    || address.startsWith('fc')
    || address.startsWith('fd')
    || address.startsWith('fe8')
    || address.startsWith('fe9')
    || address.startsWith('fea')
    || address.startsWith('feb')
  );
};

const isAllowedUrl = async (value) => {
  const parsed = new URL(value);
  if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname) return false;
  if (parsed.hostname === 'localhost' || parsed.hostname.endsWith('.localhost')) return false;
  const addresses = await dns.lookup(parsed.hostname, { all: true });
  return addresses.length > 0 && !addresses.some(({ address }) => isPrivateAddress(address));
};

module.exports = async function fetchImage(request, response) {
  if (request.method !== 'GET') {
    response.status(405).send('Method not allowed');
    return;
  }

  const imageUrl = request.query && request.query.img;

  if (!imageUrl || !/^https?:\/\//i.test(imageUrl)) {
    response.status(400).send('A valid image URL is required');
    return;
  }

  try {
    if (!await isAllowedUrl(imageUrl)) {
      response.status(400).send('This image host is not allowed');
      return;
    }
  } catch {
    response.status(400).send('A valid image URL is required');
    return;
  }

  let browser;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/123 Safari/537.36'
    );
    await page.setRequestInterception(true);
    page.on('request', async (pageRequest) => {
      try {
        if (await isAllowedUrl(pageRequest.url())) pageRequest.continue();
        else pageRequest.abort();
      } catch {
        pageRequest.abort();
      }
    });

    const imageResponse = await page.goto(imageUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    if (!imageResponse || !imageResponse.ok()) {
      response.status(502).send('Unable to fetch image');
      return;
    }

    const contentType = (imageResponse.headers()['content-type'] || '').split(';')[0].trim().toLowerCase();
    const contentLength = Number(imageResponse.headers()['content-length'] || 0);
    if (!contentType.startsWith('image/') || contentLength > MAX_IMAGE_BYTES) {
      response.status(415).send('The URL must point to an image of at most 10 MB');
      return;
    }

    const image = await imageResponse.buffer();
    if (image.length > MAX_IMAGE_BYTES) {
      response.status(413).send('The image is larger than 10 MB');
      return;
    }

    response.setHeader('Content-Type', contentType);
    response.setHeader('Cache-Control', 'public, max-age=86400');
    response.status(200).send(image);
  } catch (error) {
    console.error('Image proxy failed:', error.message);
    response.status(502).send('Unable to fetch image');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};