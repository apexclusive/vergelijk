const allowedOrigins = new Set([
  'https://apexclusive.nl',
  'https://www.apexclusive.nl',
  'https://vergelijk.apexclusive.nl',
  'http://localhost:4173',
  'http://localhost:3000',
  'http://127.0.0.1:8765'
]);

function setCors(req, res) {
  const origin = req.headers.origin;
  const localOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');
  if (origin && !allowedOrigins.has(origin) && !localOrigin) return false;
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return true;
}

function clean(value, maxLength) {
  return String(value ?? '').trim().slice(0, maxLength);
}

export default async function handler(req, res) {
  if (!setCors(req, res)) return res.status(403).json({ error: 'Origin niet toegestaan' });
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Alleen POST toegestaan' });

  const contentType = String(req.headers?.['content-type'] || '').toLowerCase();
  if (contentType && !contentType.startsWith('application/json')) {
    return res.status(415).json({ error: 'Gebruik application/json' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    if (body.length > 20000) return res.status(413).json({ error: 'Aanvraag is te groot' });
    try {
      body = JSON.parse(body || '{}');
    } catch {
      return res.status(400).json({ error: 'Ongeldige aanvraag' });
    }
  }

  // Honeypot: silently accept bots without sending an email.
  if (clean(body.website, 120)) return res.status(204).end();

  const lead = {
    name: clean(body.name, 120),
    email: clean(body.email, 240),
    phone: clean(body.phone, 80),
    request: clean(body.request, 4000)
  };
  if (!lead.name || !lead.email || !lead.request) {
    return res.status(400).json({ error: 'Vul naam, e-mailadres en aanvraag in.' });
  }
  if (!/^\S+@\S+\.\S+$/.test(lead.email)) {
    return res.status(400).json({ error: 'Vul een geldig e-mailadres in.' });
  }

  const apiKey = process.env.APEX_RESEND_API_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'Online verzending is nog niet geconfigureerd.' });

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.APEX_CONTACT_FROM || 'APEXclusive <onboarding@resend.dev>',
        to: [process.env.APEX_CONTACT_TO || 'info@apexclusive.nl'],
        reply_to: lead.email,
        subject: 'Nieuwe aanvraag via APEXclusive',
        text: [
          `Naam: ${lead.name}`,
          `E-mail: ${lead.email}`,
          `Telefoon: ${lead.phone || '-'}`,
          '',
          'Aanvraag:',
          lead.request
        ].join('\n')
      })
    });
    if (!response.ok) return res.status(502).json({ error: 'Verzenden is tijdelijk niet gelukt.' });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('APEXclusive lead error:', error.message);
    return res.status(502).json({ error: 'Verzenden is tijdelijk niet gelukt.' });
  }
}
