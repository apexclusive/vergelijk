const defaultKmPerYear = 12000;
const defaultFuelPrice = 2.20;
const vehicleState = { 1: {}, 2: {} };
const plateTimers = { 1: null, 2: null };

const plateFields = {
  1: document.getElementById('vehicle1-plate'),
  2: document.getElementById('vehicle2-plate')
};

function normalizePlate(value) {
  return String(value || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

function formatPlateDisplay(raw) {
  const s = String(raw || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (!s) return '';
  if (s.length <= 2) return s;
  if (s.length === 3) return `${s.slice(0,1)}-${s.slice(1)}`;
  if (s.length === 4) return `${s.slice(0,2)}-${s.slice(2)}`;
  if (s.length === 5) return `${s.slice(0,2)}-${s.slice(2)}`;
  if (s.length === 6) {
    if (/^[0-9][A-Z]{3}[0-9]{2}$/.test(s)) return `${s.slice(0,1)}-${s.slice(1,4)}-${s.slice(4)}`;
    if (/^[A-Z]{3}[0-9]{2}[A-Z]$/.test(s)) return `${s.slice(0,3)}-${s.slice(3,5)}-${s.slice(5)}`;
    if (/^[A-Z]{2}[0-9]{2}[A-Z]{2}$/.test(s) || /^[0-9]{2}[A-Z]{2}[0-9]{2}$/.test(s)) return `${s.slice(0,2)}-${s.slice(2,4)}-${s.slice(4)}`;
    if (/^[A-Z]{2}[0-9]{3}[A-Z]$/.test(s)) return `${s.slice(0,2)}-${s.slice(2,5)}-${s.slice(5)}`;
    if (/^[A-Z][0-9]{3}[A-Z]{2}$/.test(s)) return `${s.slice(0,1)}-${s.slice(1,4)}-${s.slice(4)}`;
    return `${s.slice(0,2)}-${s.slice(2,4)}-${s.slice(4)}`;
  }
  if (s.length === 7) {
    if (/^[A-Z]{2}[0-9]{3}[A-Z]{2}$/.test(s) || /^[0-9]{2}[A-Z]{3}[0-9]$/.test(s)) return `${s.slice(0,2)}-${s.slice(2,5)}-${s.slice(5)}`;
    if (/^[A-Z]{3}[0-9]{2}[A-Z]$/.test(s)) return `${s.slice(0,3)}-${s.slice(3,5)}-${s.slice(5)}`;
    if (/^[A-Z][0-9]{4}[A-Z]{2}$/.test(s)) return `${s.slice(0,1)}-${s.slice(1,5)}-${s.slice(5)}`;
    return `${s.slice(0,2)}-${s.slice(2,5)}-${s.slice(5)}`;
  }
  return `${s.slice(0,2)}-${s.slice(2,4)}-${s.slice(4,6)}-${s.slice(6,8)}`.trim();
}

function getVehicleBody(side) {
  return document.getElementById(`vehicle${side}-body`);
}

function splitMakeModel(text) {
  const raw = String(text || '').trim();
  if (!raw) return { make: '', model: '' };
  const parts = raw.split(/\s+/);
  if (parts.length === 1) return { make: raw, model: '' };
  return { make: parts[0], model: parts.slice(1).join(' ') };
}

function toggleVehicleBody(side, visible) {
  const body = getVehicleBody(side);
  if (!body) return;
  body.classList.toggle('expanded', visible);
}

function showProgress() {
  const progress = document.getElementById('progress');
  if (!progress) return;
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
}

function getElement(side, name) {
  return document.getElementById(`vehicle${side}-${name}`);
}

function getCompareElement(name) {
  return document.getElementById(name);
}

function setBadge(side, source) {
  const badge = getElement(side, 'badge');
  const note = getElement(side, 'note');
  if (!badge) return;
  if (source === 'kenteken') {
    badge.hidden = false;
    badge.textContent = 'Gevonden via kenteken';
    if (note) note.textContent = 'Waarde automatisch aangevuld via kenteken';
  } else if (source === 'estimate') {
    badge.hidden = false;
    badge.textContent = 'Schatting merk/model';
    if (note) note.textContent = 'Geschatte waarde op basis van beschikbare info';
  } else {
    badge.hidden = true;
    if (note) note.textContent = 'Vul een geldig kenteken in; zodra het compleet is, wordt het automatisch opgezocht.';
  }
}

function updateSummaryBoxes(side, data) {
  const catEl = document.getElementById(`vehicle${side}-catalogue-value-box`);
  if (catEl) catEl.querySelector('strong').textContent = data.catalogueValue ? new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(data.catalogueValue) : 'Niet beschikbaar';
}

function estimateValueFromMakeModel(make, year) {
  const base = 12000;
  const age = Math.max(0, new Date().getFullYear() - Number(year));
  let mult = 1;
  if (/BMW|AUDI|MERC|PORSCHE|VOLVO/i.test(make)) mult = 1.6;
  else if (/VOLKSWAGEN|TOYOTA|HONDA|NISSAN/i.test(make)) mult = 1.0;
  else if (/RENAULT|PEUGEOT|CITROEN/i.test(make)) mult = 0.85;
  const value = Math.max(600, Math.round(base * mult * Math.max(0.25, 1 - age * 0.06)));
  return value;
}

function estimateCosts(vehicle) {
  const market = Number(vehicle.catalogueValue || vehicle.estValue || 0);
  const year = Number(vehicle.year) || (new Date().getFullYear() - 5);
  const age = Math.max(0, new Date().getFullYear() - year);
  const depreciationRate = Math.max(0.08, Math.min(0.16, 0.12 + (age - 4) * 0.005));
  const depreciation = Math.round(market * depreciationRate / 12);
  let insurance = Math.round(market * 0.009 + Math.max(0, 8 - age) * 2.5);
  insurance = Math.max(40, insurance);
  let tax = 28 + (age > 12 ? 8 : age > 8 ? 5 : 0) + (market > 28000 ? 10 : 0);
  const fuel = Math.round(defaultKmPerYear * 0.065 * defaultFuelPrice / 12);
  const maintenance = Math.round(Math.max(30, market * 0.02 / 12 + (age > 8 ? 14 : 0)));
  const total = depreciation + insurance + tax + fuel + maintenance;
  return { depreciation, insurance, tax, fuel, maintenance, total };
}

function formatEuro(value) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

function applyVehicleData(side, data, source = 'auto') {
  vehicleState[side] = { ...vehicleState[side], ...data };
  const nameEl = getElement(side, 'name');
  const makeEl = getElement(side, 'make');
  const modelEl = getElement(side, 'model');
  const yearEl = getElement(side, 'year');
  const sourceMake = data.make || '';
  const split = splitMakeModel(sourceMake);
  if (nameEl) nameEl.textContent = sourceMake || '';
  if (makeEl) makeEl.textContent = split.make || '—';
  if (modelEl) modelEl.textContent = data.model || split.model || '—';
  if (yearEl) yearEl.textContent = data.year || '—';
  updateBrandIcon(side, sourceMake);
  updateSummaryBoxes(side, data);
  setBadge(side, source);
  updateVehicleCosts(side);
  const plateUi = document.getElementById(`vehicle${side}-plate-ui`);
  if (plateUi) {
    plateUi.classList.add('ready');
    plateUi.classList.remove('empty');
  }
  toggleVehicleBody(side, !!(data && (data.make || data.estValue)));
  compareVehicles();
}

function updateVehicleCosts(side) {
  const state = vehicleState[side];
  if (!state || !state.estValue) {
    ['depreciation','insurance','tax','fuel','maintenance','total'].forEach(field => {
      const el = getElement(side, field);
      if (el) el.textContent = '—';
    });
    return;
  }
  const costs = estimateCosts(state);
  ['depreciation','insurance','tax','fuel','maintenance','total'].forEach(field => {
    const el = getElement(side, field);
    if (el) el.textContent = formatEuro(costs[field]);
  });
}

function compareVehicles() {
  const total1 = vehicleState[1] && (estimateCosts(vehicleState[1]).total || 0);
  const total2 = vehicleState[2] && (estimateCosts(vehicleState[2]).total || 0);
  const compareTotal1 = getCompareElement('compare-total1');
  const compareTotal2 = getCompareElement('compare-total2');
  const compareDifference = getCompareElement('compare-difference');
  const compareWinner = getCompareElement('compare-winner');
  const compareLabel1 = document.getElementById('compare-label-1');
  const compareLabel2 = document.getElementById('compare-label-2');
  const compareCard1 = document.getElementById('compare-card-1');
  const compareCard2 = document.getElementById('compare-card-2');
  const totalBox1 = document.getElementById('vehicle1-total-box');
  const totalBox2 = document.getElementById('vehicle2-total-box');

  if (!compareTotal1 || !compareTotal2 || !compareDifference || !compareWinner) return;
  const compareSection = document.getElementById('compare-summary');
  const compareAdvice = document.querySelector('.compare-advice');
  const bothLoaded = !!(vehicleState[1].estValue && vehicleState[2].estValue);
  if (compareSection) compareSection.hidden = !bothLoaded;
  if (compareAdvice) compareAdvice.hidden = !bothLoaded;

  const label1 = vehicleState[1].make ? `Totaal ${vehicleState[1].make}` : 'Totaal auto 1';
  const label2 = vehicleState[2].make ? `Totaal ${vehicleState[2].make}` : 'Totaal auto 2';
  if (compareLabel1) compareLabel1.textContent = label1;
  if (compareLabel2) compareLabel2.textContent = label2;

  if (!bothLoaded) {
    clearMetricHighlights();
    compareTotal1.textContent = '—';
    compareTotal2.textContent = '—';
    compareDifference.textContent = 'Wanneer beide voertuigen zijn geladen, tonen wij het verschil in kosten.';
    compareWinner.textContent = 'Vul beide kentekens in om te vergelijken.';
    if (compareCard1) compareCard1.classList.remove('best', 'worst');
    if (compareCard2) compareCard2.classList.remove('best', 'worst');
    if (totalBox1) totalBox1.classList.remove('best', 'worst');
    if (totalBox2) totalBox2.classList.remove('best', 'worst');
    return;
  }

  compareTotal1.textContent = formatEuro(total1);
  compareTotal2.textContent = formatEuro(total2);
  const diff = Math.abs(total1 - total2);
  const cheaper = total1 < total2 ? 1 : 2;
  const expensive = total1 < total2 ? 2 : 1;
  const cheapestName = vehicleState[cheaper].make || `Auto ${cheaper}`;
  const expensiveName = vehicleState[expensive].make || `Auto ${expensive}`;

  if (diff === 0) {
    compareDifference.textContent = `Beide voertuigen hebben vrijwel gelijke maandlasten.`;
    compareWinner.textContent = `Resultaat: kies op basis van voorkeur; kosten zijn vergelijkbaar.`;
  } else {
    compareDifference.textContent = `De ${cheapestName} is bij deze vergelijking ${formatEuro(diff)} per maand goedkoper dan de ${expensiveName}.`;
    compareWinner.textContent = `Resultaat: ${cheapestName} is de voordeligere keuze met lagere maandlasten.`;
  }

  if (compareCard1 && compareCard2) {
    compareCard1.classList.toggle('best', cheaper === 1);
    compareCard1.classList.toggle('worst', expensive === 1);
    compareCard2.classList.toggle('best', cheaper === 2);
    compareCard2.classList.toggle('worst', expensive === 2);
  }
  if (totalBox1 && totalBox2) {
    totalBox1.classList.toggle('best', cheaper === 1);
    totalBox1.classList.toggle('worst', expensive === 1);
    totalBox2.classList.toggle('best', cheaper === 2);
    totalBox2.classList.toggle('worst', expensive === 2);
  }
  updateMetricHighlights();
}

function clearMetricHighlights() {
  document.querySelectorAll('.cost-row').forEach(row => row.classList.remove('metric-best', 'metric-worst'));
}

function updateMetricHighlights() {
  const metrics = ['depreciation', 'insurance', 'tax', 'fuel', 'maintenance'];
  const costs1 = estimateCosts(vehicleState[1]);
  const costs2 = estimateCosts(vehicleState[2]);

  metrics.forEach(metric => {
    const row1 = document.querySelector(`#vehicle1-body .cost-row[data-metric="${metric}"]`);
    const row2 = document.querySelector(`#vehicle2-body .cost-row[data-metric="${metric}"]`);
    if (!row1 || !row2) return;
    row1.classList.remove('metric-best', 'metric-worst');
    row2.classList.remove('metric-best', 'metric-worst');
    const v1 = Number(costs1[metric] || 0);
    const v2 = Number(costs2[metric] || 0);
    if (!v1 || !v2) return;
    if (v1 < v2) {
      row1.classList.add('metric-best');
      row2.classList.add('metric-worst');
    } else if (v2 < v1) {
      row2.classList.add('metric-best');
      row1.classList.add('metric-worst');
    }
  });
}

function clearVehicleData(side) {
  vehicleState[side] = {};
  toggleVehicleBody(side, false);
  const nameEl = getElement(side, 'name');
  const makeEl = getElement(side, 'make');
  const yearEl = getElement(side, 'year');
  const logoEl = document.getElementById(`vehicle${side}-logo`);
  const catBox = document.getElementById(`vehicle${side}-catalogue-value-box`);
  const plateUi = document.getElementById(`vehicle${side}-plate-ui`);
  if (nameEl) nameEl.textContent = '';
  if (makeEl) makeEl.textContent = '—';
  if (yearEl) yearEl.textContent = '—';
  if (logoEl) {
    logoEl.textContent = '';
    logoEl.className = 'brand-icon';
  }
  if (plateUi) {
    plateUi.classList.add('empty');
    plateUi.classList.remove('ready');
  }
  if (catBox) catBox.querySelector('strong').textContent = '—';
  setBadge(side, null);
  updateVehicleCosts(side);
  compareVehicles();
}

function showVehicleStatus(side, message) {
  const status = getElement(side, 'status');
  if (status) status.textContent = message;
}

function mockLookupByPlate(plate) {
  const key = normalizePlate(plate);
  const mockPlateDB = {
    '25RKZ3': { make: 'Volkswagen Golf', year: 2018, estValue: 14500 },
    'AB123C': { make: 'Toyota Corolla', year: 2015, estValue: 9200 },
    '24RPLV': { make: 'BMW 3-Serie', year: 2020, estValue: 32500 },
    '04HGLB': { make: 'Volvo V60', year: 2017, estValue: 21500 }
  };
  return mockPlateDB[key] || null;
}

function parseRdwYear(candidate) {
  if (candidate == null) return null;
  const raw = String(candidate).trim();
  if (!raw) return null;
  if (/^\d{4}$/.test(raw)) return Number(raw);
  if (/^\d{8}$/.test(raw)) return Number(raw.slice(0, 4));
  if (/^\d{4}[-\.]\d{2}[-\.]\d{2}$/.test(raw)) return Number(raw.slice(0, 4));
  if (/^\d{4}\s*\/\s*\d{2}$/.test(raw)) return Number(raw.slice(0, 4));
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.getFullYear();
}

async function fetchRdwByPlate(plate) {
  const key = normalizePlate(plate);
  if (!key) return null;
  const proxyPorts = [5000, 5001];
  for (const port of proxyPorts) {
    const url = `http://127.0.0.1:${port}/rdw?kenteken=${encodeURIComponent(key)}`;
    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (response.ok) {
        const json = await response.json();
        const row = json && json.data ? json.data : Array.isArray(json) && json.length ? json[0] : json;
        if (row) return parseRdwRow(row);
      }
    } catch (error) {
      console.warn('RDW proxy miss:', error);
    }
  }
  try {
    const res = await fetch(`https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=${encodeURIComponent(key)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return parseRdwRow(data[0]);
  } catch (error) {
    console.warn('RDW direct miss:', error);
    return null;
  }
}

function parseRdwRow(row) {
  const make = row.merk || row.handelsbenaming || row.handelsbenaming_merk || row.voertuigsoort || row.opmerkingen || 'Onbekend';
  let year = null;
  const candidates = [
    row.bouwjaar,
    row.bouwjaar_veh,
    row.bouwjaar_voertuig,
    row.datum_eerste_toelating,
    row.datum_eerste_eerste_toelating,
    row.datum_eerste_tenaamstelling_in_nederland,
    row.datum_eerste_tenaamstelling_in_nederland_dt
  ].filter(Boolean);
  for (const candidate of candidates) {
    const parsed = parseRdwYear(candidate);
    if (Number.isInteger(parsed) && parsed >= 1900 && parsed <= new Date().getFullYear() + 1) {
      year = Number(String(parsed).slice(0, 4));
      break;
    }
  }
  const finalYear = year || (new Date().getFullYear() - 5);
  const catalogueValue = extractPriceFromRdwRow(row);
  const estValue = catalogueValue || estimateValueFromMakeModel(make, finalYear);
  return { make, year: finalYear, estValue, catalogueValue };
}

function extractPriceFromRdwRow(row) {
  if (!row || typeof row !== 'object') return null;
  const candidates = Object.entries(row).flatMap(([key, value]) => {
    if (value == null) return [];
    const digits = String(value).replace(/[^0-9]/g, '');
    if (!digits) return [];
    const num = Number(digits);
    return Number.isFinite(num) && num > 500 ? [{ key: key.toLowerCase(), value: num }] : [];
  });
  if (candidates.length === 0) return null;
  const prefer = candidates.find(item => /catalog|prijs|catalogus|catalogusprijs/.test(item.key));
  let value = (prefer || candidates.sort((a,b) => b.value - a.value)[0]).value;
  if (value > 1000000) value = Math.round(value / 100);
  if (value > 1000000) value = Math.round(value / 10);
  if (value < 500 || value > 2000000) return null;
  return Math.round(value);
}

async function attemptAutoLookup(side, normalized) {
  if (!normalized) return;
  const valid = /^[A-Z0-9]{4,8}$/.test(normalized) && /[0-9]/.test(normalized) && /[A-Z]/.test(normalized);
  if (!valid) {
    showVehicleStatus(side, 'Kenteken is nog niet compleet.');
    return;
  }
  showVehicleStatus(side, 'Kenteken wordt opgezocht...');
  const cacheKey = `vehicle-compare-${normalized}`;
  const cached = getCachedPlate(cacheKey);
  if (cached) {
    applyVehicleData(side, cached, 'kenteken');
    showVehicleStatus(side, 'Gegevens geladen uit cache');
    return;
  }
  let rdwData = null;
  try { rdwData = await fetchRdwByPlate(normalized); } catch (error) { rdwData = null; }
  if (rdwData) {
    applyVehicleData(side, rdwData, 'kenteken');
    cachePlateResult(cacheKey, rdwData);
    showVehicleStatus(side, 'Voertuiggegevens gevonden via RDW');
    return;
  }
  const fallback = mockLookupByPlate(normalized);
  if (fallback) {
    const estimate = { make: fallback.make, year: fallback.year, estValue: fallback.estValue, catalogueValue: null };
    applyVehicleData(side, estimate, 'kenteken');
    cachePlateResult(cacheKey, estimate);
    showVehicleStatus(side, 'Voertuiggegevens gevonden via kenteken');
    return;
  }
  const estimated = { make: 'Onbekend', year: new Date().getFullYear() - 5, estValue: estimateValueFromMakeModel('', new Date().getFullYear() - 5), catalogueValue: null };
  applyVehicleData(side, estimated, 'estimate');
  showVehicleStatus(side, 'Geen exacte match; waarden zijn geschat');
}

function cachePlateResult(key, data) {
  try {
    const raw = localStorage.getItem('vehicleCompareCache') || '{}';
    const obj = JSON.parse(raw);
    obj[key] = { data, ts: Date.now() };
    localStorage.setItem('vehicleCompareCache', JSON.stringify(obj));
  } catch (error) {
    console.warn('Cache save failed', error);
  }
}

function getCachedPlate(key) {
  try {
    const raw = localStorage.getItem('vehicleCompareCache') || '{}';
    const obj = JSON.parse(raw);
    const item = obj[key];
    if (!item) return null;
    if (Date.now() - (item.ts || 0) > 1000 * 60 * 60 * 24 * 30) return null;
    return item.data;
  } catch (error) {
    return null;
  }
}

function bindPlateInput(side) {
  const plateInput = plateFields[side];
  if (!plateInput) return;
  const plateUi = document.getElementById(`vehicle${side}-plate-ui`);
  if (plateUi) plateUi.addEventListener('click', () => plateInput.focus());
  plateInput.addEventListener('input', (event) => {
    const raw = String(event.target.value || '');
    const normalized = normalizePlate(raw);
    event.target.value = formatPlateDisplay(normalized);
    if (plateUi) {
      plateUi.classList.toggle('empty', normalized.length === 0);
      plateUi.classList.toggle('filled', normalized.length >= 4);
      plateUi.classList.remove('ready');
    }
    clearVehicleData(side);
    if (plateTimers[side]) clearTimeout(plateTimers[side]);
    plateTimers[side] = setTimeout(() => attemptAutoLookup(side, normalized), 450);
  });
  if (plateUi) {
    plateUi.classList.add('empty');
    plateUi.classList.remove('filled');
  }
}

function updateBrandIcon(side, make) {
  const iconEl = document.getElementById(`vehicle${side}-logo`);
  if (!iconEl) return;
  const normalized = String(make || '').toLowerCase();
  const logos = {
    audi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="12" r="3.2"/><circle cx="12" cy="12" r="3.2"/><circle cx="18" cy="12" r="3.2"/></svg>',
    vw: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 6l5 6 5-6"/><path d="M7 18l5-6 5 6"/></svg>',
    volkswagen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 6l5 6 5-6"/><path d="M7 18l5-6 5 6"/></svg>',
    bmw: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="M3 12h18"/><path d="M7 7l5 5"/><path d="M17 17l-5-5"/></svg>',
    mercedes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3l3.5 8.5L12 12 8.5 11.5 12 3z"/><path d="M12 12l-3.5 8.5L12 21 15.5 20.5 12 12z"/></svg>',
    'mercedes-benz': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3l3.5 8.5L12 12 8.5 11.5 12 3z"/><path d="M12 12l-3.5 8.5L12 21 15.5 20.5 12 12z"/></svg>',
    porsche: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12l1.5 6-1.5 6H6L4.5 9 6 3z"/><path d="M9 9h6"/><path d="M9 15h6"/></svg>',
    lamborghini: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8l3-3 2 1 1-1 2 1 2-1 2 1 3 3v4l-1 3-3 2-4 1-4-1-3-2-1-3V8z"/></svg>',
    volvo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M16 8l4-4"/><path d="M14 10h6"/><path d="M10 14l-3 3"/></svg>',
    toyota: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="12" rx="8" ry="5"/><ellipse cx="12" cy="11" rx="4" ry="2.5"/></svg>',
    renault: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 12l6-8 6 8-6 8-6-8z"/></svg>',
    peugeot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 19s6-3 10-8c2-3 0-7 0-7s-4 0-7 4c-4 3-3 11-3 11z"/></svg>',
    citroen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16l8-8 8 8"/><path d="M4 12l8-8 8 8"/></svg>'
  };
  const match = Object.keys(logos).find(key => normalized.includes(key));
  if (match) {
    iconEl.innerHTML = logos[match];
    iconEl.classList.add('has-logo');
  } else {
    iconEl.textContent = '';
    iconEl.classList.remove('has-logo');
  }
}

function apexToggle() {
  const win = document.getElementById('apex-chat-win');
  if (!win) return;
  win.classList.toggle('open');
}

function apexSend() {
  const toast = document.getElementById('apex-toast');
  if (toast) toast.textContent = 'Chat werkt in deze demo nog niet volledig.';
}

function apexSubmitContact() {
  const toast = document.getElementById('apex-toast');
  if (toast) toast.textContent = 'Contactgegevens zijn geregistreerd. We nemen snel contact op.';
}

function apexQuick(query) {
  const msgs = document.getElementById('apex-msgs');
  if (msgs) msgs.textContent = `Vraag: ${query}`;
}

function apexRequestTransfer() {
  const toast = document.getElementById('apex-toast');
  if (toast) toast.textContent = 'Een adviseur schakelt u binnenkort in.';
}

function init() {
  bindPlateInput(1);
  bindPlateInput(2);
  compareVehicles();
  window.addEventListener('scroll', showProgress, { passive:true });
  showProgress();
}

window.addEventListener('DOMContentLoaded', init);
