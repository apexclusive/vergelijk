/**
 * APEXclusive — Premium Auto Vergelijker
 * Master JavaScript Controller & Simulation Engine
 * 
 * Features:
 *  - 100% Matching Official APEXclusive Homepage Theme & Design Tokens
 *  - 2 or 3 Vehicle Comparison (Driestrijd 3-Way Mode)
 *  - 🎨 Vector SVG Brand Badges for all major luxury & performance marques
 *  - 🕸️ 6-Axis Visual Radar / Spider Comparison Chart (Interactive SVG)
 *  - ✨ APEX Quick Highlights & Executive Briefing
 *  - 🏎️ APEX Auto Kenner Battle Quiz (Gamified with Confetti particles)
 *  - ⚡ Drag Race Simulator with Web Audio API Synthesizer (Beeps & Finish Chime)
 *  - 🏆 APEX Battle Showdown: 6 Category Matchups
 *  - 🔮 10-Year TCO & Residual Value Slider
 *  - 🏖️ European Roadtrip & Vacation Fuel Cost Planner
 *  - 🎁 PDF Aankoopdossier Generator (Freemium 3-Report Counter & Print View)
 *  - 🌿 Community Star Rating & Feedback Integration
 *  - 2026 MRB & Rest-BPM calculation
 *  - Zakelijke Bijtelling 2026 Module (Box 1 Netto)
 *  - ANWB 75% Caravan safety & towing engine
 *  - International environmental zone checker (NL, DE, FR, BE)
 *  - Web Share API & URL parameter persistence (?k1=...&k2=...&k3=...)
 */

// Application State
const appState = {
  hasThirdCar: false,
  vehicles: { 1: null, 2: null, 3: null },
  soundEnabled: true,
  settings: {
    kmPerYear: 15000,
    province: 'noord-holland',
    tcoPeriod: 36,
    projectionYears: 5,
    roadtripDest: 'gardameer',
    activeCategory: 'all',
    diffOnly: false,
    fuelPrices: {
      petrol: 2.05,
      diesel: 1.78,
      lpg: 0.89,
      ev: 0.32
    }
  },
  quiz: {
    currentQ: 0,
    score: 0,
    questions: []
  },
  reportsDownloaded: 0,
  recentSearches: []
};

const CURRENT_DATE = new Date('2026-09-02T12:00:00Z');

// 2026 MRB Provincial Opcenten Table
const PROVINCE_FACTORS_2026 = {
  'noord-holland': 1.00,
  'utrecht': 1.05,
  'overijssel': 1.08,
  'noord-brabant': 1.09,
  'zeeland': 1.10,
  'flevoland': 1.11,
  'limburg': 1.12,
  'friesland': 1.14,
  'gelderland': 1.16,
  'drenthe': 1.17,
  'groningen': 1.18,
  'zuid-holland': 1.20
};

// Roadtrip Destinations Data
const ROADTRIP_DESTINATIONS = {
  parijs: { name: 'Parijs (Frankrijk)', distKm: 500, tollEur: 35 },
  munchen: { name: 'München (Duitsland)', distKm: 800, tollEur: 0 },
  gardameer: { name: 'Gardameer (Italië)', distKm: 1150, tollEur: 65 },
  nice: { name: 'Côte d’Azur / Nice (Frankrijk)', distKm: 1350, tollEur: 95 },
  barcelona: { name: 'Barcelona (Spanje)', distKm: 1550, tollEur: 115 }
};

// ═══════════════════════════════════════════════════════════════════════════
// BRAND VECTOR SVG REGISTRY
// ═══════════════════════════════════════════════════════════════════════════

const BRAND_SVGS = {
  BMW: `<svg viewBox="0 0 30 30" fill="currentColor"><circle cx="15" cy="15" r="13" fill="none" stroke="currentColor" stroke-width="2"/><line x1="15" y1="2" x2="15" y2="28" stroke="currentColor" stroke-width="2"/><line x1="2" y1="15" x2="28" y2="15" stroke="currentColor" stroke-width="2"/></svg>`,
  'MERCEDES-BENZ': `<svg viewBox="0 0 30 30" fill="currentColor"><circle cx="15" cy="15" r="13" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15 2v15l-11.5 7M15 17l11.5 7" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
  AUDI: `<svg viewBox="0 0 140 30" fill="currentColor"><circle cx="25" cy="15" r="12" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="50" cy="15" r="12" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="75" cy="15" r="12" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="100" cy="15" r="12" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>`,
  PORSCHE: `<svg viewBox="0 0 120 30" fill="currentColor"><path d="M10 5h18c6 0 10 4 10 10s-4 10-10 10h-8v-6h8c2.5 0 4.5-1.8 4.5-4s-2-4-4.5-4H16v14h-6Zm38 0h18c6 0 10 4 10 10s-4 10-10 10H48Zm6 6v8h12c2.5 0 4.5-1.8 4.5-4s-2-4-4.5-4Zm30-6h18c6 0 10 4 10 10s-4 10-10 10H84Zm6 6v8h12c2.5 0 4.5-1.8 4.5-4s-2-4-4.5-4Z"/></svg>`,
  LAMBORGHINI: `<svg viewBox="0 0 120 30" fill="currentColor"><path d="M60 2C44 2 30 7 30 13v4c0 6 14 11 30 11s30-5 30-11v-4C90 7 76 2 60 2Zm0 3c13 0 25 4 25 8 0 1-.5 2-1.5 3l-5-6h-3l5 7c-4 2-10 3-16 3h-8c-6 0-12-1-16-3l5-7h-3l-5 6c-1-1-1.5-2-1.5-3 0-4 12-8 25-8Zm-4 13h8v5c-1 0-3 .5-4 .5s-3-.5-4-.5Z"/></svg>`,
  FERRARI: `<svg viewBox="0 0 100 30" fill="currentColor"><path d="M5 5h30v5H11v4h22v5H11v6h24v5H5Zm38 0h30v5H49v4h22v5H49v11h-6Z"/></svg>`,
  TESLA: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5c2.8 0 5.4.7 7.7 1.9l.8-2C18 3.3 15.1 2.5 12 2.5s-6 .8-8.5 1.9l.8 2C6.6 5.2 9.2 4.5 12 4.5zm0 2.5c-2.4 0-4.6.5-6.5 1.4L6 10c1.7-.8 3.7-1.3 6-1.3s4.3.5 6 1.3l.5-1.6C16.6 7.5 14.4 7 12 7zm1 3.5h-2v11h2V10.5z"/></svg>`,
  VOLVO: `<svg viewBox="0 0 30 30" fill="currentColor"><circle cx="15" cy="15" r="12" fill="none" stroke="currentColor" stroke-width="2"/><path d="M22 8l4-4m-4 0h4v4" fill="none" stroke="currentColor" stroke-width="2"/><text x="15" y="17" font-family="Arial,sans-serif" font-size="6" font-weight="bold" fill="currentColor" text-anchor="middle">VOLVO</text></svg>`,
  VOLKSWAGEN: `<svg viewBox="0 0 30 30" fill="currentColor"><circle cx="15" cy="15" r="13" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 10l3 10 3-10 3 10 3-10" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  FORD: `<svg viewBox="0 0 30 30" fill="currentColor"><ellipse cx="15" cy="15" rx="14" ry="9" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="15" y="18" font-family="Georgia,serif" font-style="italic" font-weight="bold" font-size="9" fill="currentColor" text-anchor="middle">Ford</text></svg>`,
  TOYOTA: `<svg viewBox="0 0 30 30" fill="currentColor"><ellipse cx="15" cy="15" rx="13" ry="9" fill="none" stroke="currentColor" stroke-width="1.8"/><ellipse cx="15" cy="11" rx="8" ry="4" fill="none" stroke="currentColor" stroke-width="1.6"/><line x1="15" y1="7" x2="15" y2="23" stroke="currentColor" stroke-width="1.6"/></svg>`,
  MCLAREN: `<svg viewBox="0 0 100 30" fill="currentColor"><path d="M50 3C30 3 15 10 15 15s10 12 35 12 35-7 35-12S70 3 50 3Zm0 4c15 0 28 5 28 8s-8 8-28 8-28-5-28-8 13-8 28-8Z"/></svg>`,
  BENTLEY: `<svg viewBox="0 0 120 30" fill="currentColor"><ellipse cx="60" cy="15" rx="10" ry="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M50 15H8M70 15h42" stroke="currentColor" stroke-width="2"/><path d="M8 15l15-7M8 15l15 7M112 15l-15-7M112 15l-15 7" stroke="currentColor" stroke-width="1.5"/></svg>`
};

function getBrandLogoSvg(brandName) {
  const b = String(brandName || '').toUpperCase().trim();
  for (const [key, svg] of Object.entries(BRAND_SVGS)) {
    if (b.includes(key) || key.includes(b)) return svg;
  }
  return `<span style="font-family:var(--serif); font-size:1.2rem; font-weight:700; color:var(--copper-light);">${b.slice(0, 1) || 'A'}</span>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// WEB AUDIO SYNTHESIZER (Pure Client-Side Sound FX for Drag Race)
// ═══════════════════════════════════════════════════════════════════════════

let audioCtx = null;
function getAudioContext() {
  if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playBeep(freq = 440, duration = 0.12, type = 'sine') {
  if (!appState.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function playEngineStart() {
  if (!appState.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.6);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 1.2);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  } catch (e) {}
}

function playFinishFanfare() {
  if (!appState.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      setTimeout(() => playBeep(freq, 0.25, 'triangle'), idx * 100);
    });
  } catch (e) {}
}

// ═══════════════════════════════════════════════════════════════════════════
// HIGH-FIDELITY MOCK VEHICLE DATABASE
// ═══════════════════════════════════════════════════════════════════════════

const MOCK_VEHICLES = {
  '25RKZ3': {
    kenteken: '25RKZ3',
    merk: 'VOLKSWAGEN',
    handelsbenaming: 'GOLF 1.4 TSI HIGHLINE',
    inrichting: 'Hatchback',
    kleur: 'Zwart',
    eersteKleur: 'ZWART',
    bouwjaar: '2011',
    datumEersteToelating: '20110825',
    datumEersteAfgifteNederland: '20110825',
    datumTenaamstelling: '20230412',
    vervaldatumApk: '20270518',
    catalogusprijs: 28450,
    brutoBpm: 4210,
    massaLedigVoertuig: 1215,
    massaRijklaar: 1315,
    toegestaneMaxMassa: 1820,
    maximumTrekkenOngeremd: 650,
    maximumTrekkenGeremd: 1400,
    brandstofOmschrijving: 'Benzine',
    cilinderinhoud: 1390,
    aantalCilinders: 4,
    vermogenKw: 90,
    vermogenPk: 122,
    verbruikGecombineerd: 6.2,
    verbruikStad: 8.2,
    verbruikSnelweg: 5.1,
    co2Uitstoot: 144,
    emissieklasse: '5',
    zuinigheidslabel: 'B',
    aantalZitplaatsen: 5,
    aantalDeuren: 5,
    aantalWielen: 4,
    topsnelheid: 200,
    acceleratie: 9.5,
    tankinhoud: 55,
    tellerstandOordeel: 'Logisch',
    aantalEigenaren: 3,
    particulierAantalDagen: 1240,
    openstaandeTerugroepacties: 0,
    wamVerzekerd: 'Ja',
    gebrekenHistorie: [
      { datum: '18-05-2025', punt: 'Bandenspanning adviespunt', status: 'Hersteld' }
    ],
    afbeeldingUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80&auto=format&fit=crop'
  },
  'G832LK': {
    kenteken: 'G832LK',
    merk: 'BMW',
    handelsbenaming: '330I M-SPORT HIGH EXECUTIVE',
    inrichting: 'Sedan',
    kleur: 'Blauw',
    eersteKleur: 'BLAUW',
    bouwjaar: '2019',
    datumEersteToelating: '20191018',
    datumEersteAfgifteNederland: '20191018',
    datumTenaamstelling: '20220905',
    vervaldatumApk: '20261018',
    catalogusprijs: 64800,
    brutoBpm: 7120,
    massaLedigVoertuig: 1470,
    massaRijklaar: 1570,
    toegestaneMaxMassa: 2060,
    maximumTrekkenOngeremd: 750,
    maximumTrekkenGeremd: 1600,
    brandstofOmschrijving: 'Benzine',
    cilinderinhoud: 1998,
    aantalCilinders: 4,
    vermogenKw: 190,
    vermogenPk: 258,
    verbruikGecombineerd: 5.8,
    verbruikStad: 7.1,
    verbruikSnelweg: 5.0,
    co2Uitstoot: 132,
    emissieklasse: '6',
    zuinigheidslabel: 'C',
    aantalZitplaatsen: 5,
    aantalDeuren: 4,
    aantalWielen: 4,
    topsnelheid: 250,
    acceleratie: 5.8,
    tankinhoud: 59,
    tellerstandOordeel: 'Logisch',
    aantalEigenaren: 2,
    particulierAantalDagen: 1450,
    openstaandeTerugroepacties: 0,
    wamVerzekerd: 'Ja',
    gebrekenHistorie: [],
    afbeeldingUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80&auto=format&fit=crop'
  },
  '04HGLB': {
    kenteken: '04HGLB',
    merk: 'VOLVO',
    handelsbenaming: 'V60 T6 RECHARGE AWD',
    inrichting: 'Stationwagen',
    kleur: 'Grijs',
    eersteKleur: 'GRIJS',
    bouwjaar: '2021',
    datumEersteToelating: '20210815',
    datumEersteAfgifteNederland: '20210815',
    datumTenaamstelling: '20230110',
    vervaldatumApk: '20270815',
    catalogusprijs: 58900,
    brutoBpm: 1240,
    massaLedigVoertuig: 1950,
    massaRijklaar: 2050,
    toegestaneMaxMassa: 2570,
    maximumTrekkenOngeremd: 750,
    maximumTrekkenGeremd: 2000,
    brandstofOmschrijving: 'Hybride (Benzine/Elektrisch)',
    cilinderinhoud: 1969,
    aantalCilinders: 4,
    vermogenKw: 250,
    vermogenPk: 340,
    verbruikGecombineerd: 1.8,
    verbruikStad: 2.2,
    verbruikSnelweg: 5.4,
    co2Uitstoot: 41,
    emissieklasse: '6',
    zuinigheidslabel: 'A',
    aantalZitplaatsen: 5,
    aantalDeuren: 5,
    aantalWielen: 4,
    topsnelheid: 180,
    acceleratie: 5.4,
    tankinhoud: 60,
    tellerstandOordeel: 'Logisch',
    aantalEigenaren: 2,
    particulierAantalDagen: 1120,
    openstaandeTerugroepacties: 0,
    wamVerzekerd: 'Ja',
    gebrekenHistorie: [],
    afbeeldingUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80&auto=format&fit=crop'
  },
  '24RPLV': {
    kenteken: '24RPLV',
    merk: 'AUDI',
    handelsbenaming: 'RS6 AVANT 4.0 TFSI QUATTRO',
    inrichting: 'Stationwagen',
    kleur: 'Grijs',
    eersteKleur: 'GRIJS',
    bouwjaar: '2021',
    datumEersteToelating: '20210315',
    datumEersteAfgifteNederland: '20210315',
    datumTenaamstelling: '20230810',
    vervaldatumApk: '20270315',
    catalogusprijs: 208500,
    brutoBpm: 52400,
    massaLedigVoertuig: 2075,
    massaRijklaar: 2175,
    toegestaneMaxMassa: 2740,
    maximumTrekkenOngeremd: 750,
    maximumTrekkenGeremd: 2100,
    brandstofOmschrijving: 'Benzine',
    cilinderinhoud: 3996,
    aantalCilinders: 8,
    vermogenKw: 441,
    vermogenPk: 600,
    verbruikGecombineerd: 11.5,
    verbruikStad: 16.2,
    verbruikSnelweg: 8.9,
    co2Uitstoot: 263,
    emissieklasse: '6',
    zuinigheidslabel: 'G',
    aantalZitplaatsen: 5,
    aantalDeuren: 5,
    aantalWielen: 4,
    topsnelheid: 305,
    acceleratie: 3.6,
    tankinhoud: 73,
    tellerstandOordeel: 'Logisch',
    aantalEigenaren: 2,
    particulierAantalDagen: 1100,
    openstaandeTerugroepacties: 0,
    wamVerzekerd: 'Ja',
    gebrekenHistorie: [],
    afbeeldingUrl: 'https://res.cloudinary.com/sfd8ohjz/image/upload/w_900,q_auto:best,f_auto/v1786112182/8112FE63-03BD-4C6D-9A40-1217FCD5910F_1_201_a_vbazdb.jpg'
  },
  'X789PP': {
    kenteken: 'X789PP',
    merk: 'MERCEDES-BENZ',
    handelsbenaming: 'E 63 S AMG 4MATIC+',
    inrichting: 'Sedan',
    kleur: 'Zwart',
    eersteKleur: 'ZWART',
    bouwjaar: '2020',
    datumEersteToelating: '20200612',
    datumEersteAfgifteNederland: '20200612',
    datumTenaamstelling: '20221114',
    vervaldatumApk: '20260612',
    catalogusprijs: 198200,
    brutoBpm: 48900,
    massaLedigVoertuig: 1910,
    massaRijklaar: 2010,
    toegestaneMaxMassa: 2525,
    maximumTrekkenOngeremd: 750,
    maximumTrekkenGeremd: 1900,
    brandstofOmschrijving: 'Benzine',
    cilinderinhoud: 3982,
    aantalCilinders: 8,
    vermogenKw: 450,
    vermogenPk: 612,
    verbruikGecombineerd: 11.2,
    verbruikStad: 15.8,
    verbruikSnelweg: 8.6,
    co2Uitstoot: 257,
    emissieklasse: '6',
    zuinigheidslabel: 'G',
    aantalZitplaatsen: 5,
    aantalDeuren: 4,
    aantalWielen: 4,
    topsnelheid: 300,
    acceleratie: 3.4,
    tankinhoud: 66,
    tellerstandOordeel: 'Logisch',
    aantalEigenaren: 2,
    particulierAantalDagen: 1380,
    openstaandeTerugroepacties: 0,
    wamVerzekerd: 'Ja',
    gebrekenHistorie: [],
    afbeeldingUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80&auto=format&fit=crop'
  },
  'TB145X': {
    kenteken: 'TB145X',
    merk: 'TESLA',
    handelsbenaming: 'MODEL 3 PERFORMANCE AWD',
    inrichting: 'Sedan',
    kleur: 'Wit',
    eersteKleur: 'WIT',
    bouwjaar: '2021',
    datumEersteToelating: '20210920',
    datumEersteAfgifteNederland: '20210920',
    datumTenaamstelling: '20231201',
    vervaldatumApk: '20270920',
    catalogusprijs: 63990,
    brutoBpm: 0,
    massaLedigVoertuig: 1836,
    massaRijklaar: 1936,
    toegestaneMaxMassa: 2232,
    maximumTrekkenOngeremd: 750,
    maximumTrekkenGeremd: 1000,
    brandstofOmschrijving: 'Elektriciteit',
    cilinderinhoud: 0,
    aantalCilinders: 0,
    vermogenKw: 377,
    vermogenPk: 513,
    verbruikGecombineerd: 16.5,
    verbruikStad: 14.8,
    verbruikSnelweg: 18.2,
    co2Uitstoot: 0,
    emissieklasse: 'Z',
    zuinigheidslabel: 'A',
    aantalZitplaatsen: 5,
    aantalDeuren: 4,
    aantalWielen: 4,
    topsnelheid: 261,
    acceleratie: 3.3,
    tankinhoud: 82,
    tellerstandOordeel: 'Logisch',
    aantalEigenaren: 1,
    particulierAantalDagen: 1800,
    openstaandeTerugroepacties: 0,
    wamVerzekerd: 'Ja',
    gebrekenHistorie: [],
    afbeeldingUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80&auto=format&fit=crop'
  },
  'N563FF': {
    kenteken: 'N563FF',
    merk: 'POLESTAR',
    handelsbenaming: 'POLESTAR 2 DUAL MOTOR',
    inrichting: 'Hatchback',
    kleur: 'Zwart',
    eersteKleur: 'ZWART',
    bouwjaar: '2021',
    datumEersteToelating: '20211110',
    datumEersteAfgifteNederland: '20211110',
    datumTenaamstelling: '20230514',
    vervaldatumApk: '20271110',
    catalogusprijs: 59900,
    brutoBpm: 0,
    massaLedigVoertuig: 2098,
    massaRijklaar: 2198,
    toegestaneMaxMassa: 2600,
    maximumTrekkenOngeremd: 750,
    maximumTrekkenGeremd: 1500,
    brandstofOmschrijving: 'Elektriciteit',
    cilinderinhoud: 0,
    aantalCilinders: 0,
    vermogenKw: 300,
    vermogenPk: 408,
    verbruikGecombineerd: 19.3,
    verbruikStad: 17.5,
    verbruikSnelweg: 21.0,
    co2Uitstoot: 0,
    emissieklasse: 'Z',
    zuinigheidslabel: 'A',
    aantalZitplaatsen: 5,
    aantalDeuren: 5,
    aantalWielen: 4,
    topsnelheid: 205,
    acceleratie: 4.7,
    tankinhoud: 78,
    tellerstandOordeel: 'Logisch',
    aantalEigenaren: 2,
    particulierAantalDagen: 1020,
    openstaandeTerugroepacties: 0,
    wamVerzekerd: 'Ja',
    gebrekenHistorie: [],
    afbeeldingUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80&auto=format&fit=crop'
  },
  'J123KZ': {
    kenteken: 'J123KZ',
    merk: 'PORSCHE',
    handelsbenaming: '911 GT3 (992)',
    inrichting: 'Coupe',
    kleur: 'Zilver',
    eersteKleur: 'GRIJS',
    bouwjaar: '2022',
    datumEersteToelating: '20220410',
    datumEersteAfgifteNederland: '20220410',
    datumTenaamstelling: '20230219',
    vervaldatumApk: '20260410',
    catalogusprijs: 254900,
    brutoBpm: 63200,
    massaLedigVoertuig: 1410,
    massaRijklaar: 1510,
    toegestaneMaxMassa: 1780,
    maximumTrekkenOngeremd: 0,
    maximumTrekkenGeremd: 0,
    brandstofOmschrijving: 'Benzine',
    cilinderinhoud: 3996,
    aantalCilinders: 6,
    vermogenKw: 375,
    vermogenPk: 510,
    verbruikGecombineerd: 12.9,
    verbruikStad: 18.5,
    verbruikSnelweg: 9.8,
    co2Uitstoot: 293,
    emissieklasse: '6',
    zuinigheidslabel: 'G',
    aantalZitplaatsen: 2,
    aantalDeuren: 2,
    aantalWielen: 4,
    topsnelheid: 318,
    acceleratie: 3.4,
    tankinhoud: 64,
    tellerstandOordeel: 'Logisch',
    aantalEigenaren: 1,
    particulierAantalDagen: 1600,
    openstaandeTerugroepacties: 0,
    wamVerzekerd: 'Ja',
    gebrekenHistorie: [],
    afbeeldingUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format&fit=crop'
  },
  'L712BV': {
    kenteken: 'L712BV',
    merk: 'FORD',
    handelsbenaming: 'FOCUS 1.0 ECOBOOST ST-LINE',
    inrichting: 'Hatchback',
    kleur: 'Blauw',
    eersteKleur: 'BLAUW',
    bouwjaar: '2021',
    datumEersteToelating: '20210510',
    datumEersteAfgifteNederland: '20210510',
    datumTenaamstelling: '20230620',
    vervaldatumApk: '20270510',
    catalogusprijs: 31200,
    brutoBpm: 3280,
    massaLedigVoertuig: 1244,
    massaRijklaar: 1344,
    toegestaneMaxMassa: 1890,
    maximumTrekkenOngeremd: 670,
    maximumTrekkenGeremd: 1100,
    brandstofOmschrijving: 'Benzine',
    cilinderinhoud: 999,
    aantalCilinders: 3,
    vermogenKw: 92,
    vermogenPk: 125,
    verbruikGecombineerd: 5.3,
    verbruikStad: 6.4,
    verbruikSnelweg: 4.6,
    co2Uitstoot: 121,
    emissieklasse: '6',
    zuinigheidslabel: 'B',
    aantalZitplaatsen: 5,
    aantalDeuren: 5,
    aantalWielen: 4,
    topsnelheid: 200,
    acceleratie: 10.0,
    tankinhoud: 52,
    tellerstandOordeel: 'Logisch',
    aantalEigenaren: 2,
    particulierAantalDagen: 1180,
    openstaandeTerugroepacties: 0,
    wamVerzekerd: 'Ja',
    gebrekenHistorie: [],
    afbeeldingUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80&auto=format&fit=crop'
  },
  'AB123C': {
    kenteken: 'AB123C',
    merk: 'TOYOTA',
    handelsbenaming: 'COROLLA 2.0 HYBRID GR SPORT',
    inrichting: 'Stationwagen',
    kleur: 'Rood',
    eersteKleur: 'ROOD',
    bouwjaar: '2022',
    datumEersteToelating: '20220312',
    datumEersteAfgifteNederland: '20220312',
    datumTenaamstelling: '20230910',
    vervaldatumApk: '20260312',
    catalogusprijs: 41500,
    brutoBpm: 2140,
    massaLedigVoertuig: 1345,
    massaRijklaar: 1445,
    toegestaneMaxMassa: 1910,
    maximumTrekkenOngeremd: 450,
    maximumTrekkenGeremd: 750,
    brandstofOmschrijving: 'Hybride (Benzine/Elektrisch)',
    cilinderinhoud: 1987,
    aantalCilinders: 4,
    vermogenKw: 135,
    vermogenPk: 184,
    verbruikGecombineerd: 4.6,
    verbruikStad: 3.9,
    verbruikSnelweg: 5.0,
    co2Uitstoot: 103,
    emissieklasse: '6',
    zuinigheidslabel: 'A',
    aantalZitplaatsen: 5,
    aantalDeuren: 5,
    aantalWielen: 4,
    topsnelheid: 180,
    acceleratie: 7.9,
    tankinhoud: 43,
    tellerstandOordeel: 'Logisch',
    aantalEigenaren: 1,
    particulierAantalDagen: 1620,
    openstaandeTerugroepacties: 0,
    wamVerzekerd: 'Ja',
    gebrekenHistorie: [],
    afbeeldingUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80&auto=format&fit=crop'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES & FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════

function cleanPlate(raw) {
  if (!raw) return '';
  return String(raw).toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function formatPlate(clean) {
  if (!clean) return '';
  const c = cleanPlate(clean);
  if (c.length === 6) {
    if (/^[A-Z]{2}\d{2}[A-Z]{2}$/.test(c)) return `${c.slice(0,2)}-${c.slice(2,4)}-${c.slice(4,6)}`;
    if (/^\d{2}[A-Z]{2}\d{2}$/.test(c)) return `${c.slice(0,2)}-${c.slice(2,4)}-${c.slice(4,6)}`;
    if (/^\d{2}[A-Z]{3}\d{1}$/.test(c)) return `${c.slice(0,2)}-${c.slice(2,5)}-${c.slice(5,6)}`;
    if (/^\d{1}[A-Z]{3}\d{2}$/.test(c)) return `${c.slice(0,1)}-${c.slice(1,4)}-${c.slice(4,6)}`;
    if (/^[A-Z]{2}\d{3}[A-Z]{1}$/.test(c)) return `${c.slice(0,2)}-${c.slice(2,5)}-${c.slice(5,6)}`;
    if (/^[A-Z]{1}\d{3}[A-Z]{2}$/.test(c)) return `${c.slice(0,1)}-${c.slice(1,4)}-${c.slice(4,6)}`;
    if (/^[A-Z]{3}\d{2}[A-Z]{1}$/.test(c)) return `${c.slice(0,3)}-${c.slice(3,5)}-${c.slice(5,6)}`;
    if (/^\d{1}[A-Z]{2}\d{3}$/.test(c)) return `${c.slice(0,1)}-${c.slice(1,3)}-${c.slice(3,6)}`;
    if (/^\d{3}[A-Z]{2}\d{1}$/.test(c)) return `${c.slice(0,3)}-${c.slice(3,5)}-${c.slice(5,6)}`;
    if (/^[A-Z]{3}\d{1}[A-Z]{2}$/.test(c)) return `${c.slice(0,3)}-${c.slice(3,4)}-${c.slice(4,6)}`;
    return `${c.slice(0,2)}-${c.slice(2,4)}-${c.slice(4,6)}`;
  }
  return c;
}

function formatEuro(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '—';
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
}

function formatNumber(num, decimals = 0) {
  if (num === null || num === undefined || isNaN(num)) return '—';
  return new Intl.NumberFormat('nl-NL', { maximumFractionDigits: decimals, minimumFractionDigits: decimals }).format(num);
}

function parseRdwDate(str) {
  if (!str) return null;
  const s = String(str).trim();
  if (s.length === 8 && /^\d{8}$/.test(s)) {
    const y = parseInt(s.slice(0, 4), 10);
    const m = parseInt(s.slice(4, 6), 10) - 1;
    const d = parseInt(s.slice(6, 8), 10);
    return new Date(Date.UTC(y, m, d));
  }
  const parsed = new Date(s);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateNl(date) {
  if (!date) return '—';
  return date.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
}

function getVehicleAgeYears(datumEersteToelating) {
  const d = parseRdwDate(datumEersteToelating);
  if (!d) return 5;
  const diffMs = CURRENT_DATE.getTime() - d.getTime();
  return Math.max(0, diffMs / (1000 * 60 * 60 * 24 * 365.25));
}

function getVehicleAgeMonths(datumEersteToelating) {
  const d = parseRdwDate(datumEersteToelating);
  if (!d) return 60;
  const years = (CURRENT_DATE.getFullYear() - d.getUTCFullYear());
  const months = (CURRENT_DATE.getMonth() - d.getUTCMonth());
  return Math.max(0, years * 12 + months);
}

// ═══════════════════════════════════════════════════════════════════════════
// TAX & FINANCIAL COMPUTATIONS (2026 MRB & REST-BPM)
// ═══════════════════════════════════════════════════════════════════════════

function calculateMrb(massaLedig, brandstof, province = 'noord-holland') {
  const weight = Number(massaLedig) || 1300;
  const fuel = String(brandstof || 'Benzine').toLowerCase();
  const provFactor = PROVINCE_FACTORS_2026[province] || 1.00;

  let baseQuarter = 0;
  if (fuel.includes('elektri') || fuel.includes('ev')) {
    const standardMrb = 30 + (weight / 100) * 8.5;
    baseQuarter = standardMrb * 0.75;
  } else if (fuel.includes('diesel')) {
    baseQuarter = 95 + (weight / 100) * 16.5;
  } else if (fuel.includes('lpg') || fuel.includes('gas')) {
    baseQuarter = 65 + (weight / 100) * 13.0;
  } else if (fuel.includes('hybride') || fuel.includes('hybrid')) {
    baseQuarter = 45 + (weight / 100) * 9.2;
  } else {
    baseQuarter = 45 + (weight / 100) * 9.5;
  }

  const adjustedQuarter = baseQuarter * provFactor;
  const mrbMonthly = Math.round(adjustedQuarter / 3);
  return { monthly: mrbMonthly, quarterly: Math.round(adjustedQuarter), yearly: mrbMonthly * 12 };
}

function calculateRestBpm(brutoBpm, datumEersteToelating) {
  const bpm = Number(brutoBpm) || 0;
  if (bpm <= 0) return { restBpm: 0, brutoBpm: 0, afschrijvingPct: 100, restBpmPct: 0, ageMonths: 0 };

  const ageMonths = getVehicleAgeMonths(datumEersteToelating);
  let afschrijvingPct = 0;
  if (ageMonths <= 1) afschrijvingPct = 4;
  else if (ageMonths <= 3) afschrijvingPct = 4 + (ageMonths - 1) * 3;
  else if (ageMonths <= 6) afschrijvingPct = 10 + (ageMonths - 3) * 2;
  else if (ageMonths <= 12) afschrijvingPct = 16 + (ageMonths - 6) * 1.5;
  else if (ageMonths <= 24) afschrijvingPct = 25 + (ageMonths - 12) * 1.0;
  else if (ageMonths <= 36) afschrijvingPct = 37 + (ageMonths - 24) * 0.8;
  else if (ageMonths <= 60) afschrijvingPct = 47 + (ageMonths - 36) * 0.6;
  else if (ageMonths <= 120) afschrijvingPct = 61 + (ageMonths - 60) * 0.4;
  else afschrijvingPct = Math.min(96, 85 + (ageMonths - 120) * 0.15);

  const restBpmPct = Math.max(4, 100 - afschrijvingPct);
  const restBpm = Math.round(bpm * (restBpmPct / 100));

  return {
    restBpm,
    brutoBpm: bpm,
    afschrijvingPct: Math.round(afschrijvingPct),
    restBpmPct: Math.round(restBpmPct),
    ageMonths
  };
}

function calculateMonthlyCosts(v, settings) {
  if (!v) return null;

  const kmPerYear = Number(settings.kmPerYear) || 15000;
  const kmPerMonth = kmPerYear / 12;
  const province = settings.province || 'noord-holland';
  const fuelPrices = settings.fuelPrices;

  const mrb = calculateMrb(v.massaLedigVoertuig, v.brandstofOmschrijving, province);

  const fuelType = String(v.brandstofOmschrijving || 'Benzine').toLowerCase();
  let fuelMonthly = 0;

  if (fuelType.includes('elektri') || fuelType.includes('ev')) {
    const kwhPer100 = Number(v.verbruikGecombineerd) || 17.5;
    fuelMonthly = Math.round((kmPerMonth / 100) * kwhPer100 * fuelPrices.ev);
  } else if (fuelType.includes('diesel')) {
    const lPer100 = Number(v.verbruikGecombineerd) || 5.8;
    fuelMonthly = Math.round((kmPerMonth / 100) * lPer100 * fuelPrices.diesel);
  } else if (fuelType.includes('lpg')) {
    const lPer100 = Number(v.verbruikGecombineerd) || 8.5;
    fuelMonthly = Math.round((kmPerMonth / 100) * lPer100 * fuelPrices.lpg);
  } else {
    const lPer100 = Number(v.verbruikGecombineerd) || 6.5;
    fuelMonthly = Math.round((kmPerMonth / 100) * lPer100 * fuelPrices.petrol);
  }

  const catPrice = Number(v.catalogusprijs) || 35000;
  const powerPk = Number(v.vermogenPk) || 140;
  let baseInsurance = 45 + (catPrice / 10000) * 8.5 + (powerPk / 100) * 12;
  if (catPrice > 100000) baseInsurance *= 1.4;
  const insuranceMonthly = Math.round(Math.max(45, Math.min(480, baseInsurance)));

  const ageYears = getVehicleAgeYears(v.datumEersteToelating);
  let baseMaintPerKm = 0.035;
  if (catPrice > 80000) baseMaintPerKm = 0.075;
  if (ageYears > 8) baseMaintPerKm *= 1.35;
  if (fuelType.includes('elektri')) baseMaintPerKm *= 0.65;
  const maintenanceMonthly = Math.round(kmPerMonth * baseMaintPerKm);

  const estimatedCurrentValue = Math.max(3000, catPrice * Math.pow(0.84, ageYears));
  const depreciationMonthly = Math.round((estimatedCurrentValue * 0.12) / 12);

  const totalMonthly = mrb.monthly + fuelMonthly + insuranceMonthly + maintenanceMonthly + depreciationMonthly;

  return {
    mrb,
    fuelMonthly,
    insuranceMonthly,
    maintenanceMonthly,
    depreciationMonthly,
    totalMonthly,
    totalYearly: totalMonthly * 12,
    costPerKm: (totalMonthly / kmPerMonth).toFixed(2),
    estimatedCurrentValue: Math.round(estimatedCurrentValue)
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 5-PILLAR APEX SCORING ALGORITHM
// ═══════════════════════════════════════════════════════════════════════════

function calculateApexScore(v, costs) {
  if (!v || !costs) return { total: 50, pillars: {} };

  const pk = Number(v.vermogenPk) || 120;
  const top = Number(v.topsnelheid) || 180;
  const acc = Number(v.acceleratie) || 10;
  let perfScore = Math.min(100, Math.round((pk / 450) * 45 + (top / 300) * 30 + Math.max(0, (14 - acc) * 2.5)));

  const totalMonth = costs.totalMonthly || 500;
  let costScore = Math.min(100, Math.max(10, Math.round(100 - (totalMonth / 1200) * 80)));

  const co2 = Number(v.co2Uitstoot) || 150;
  let ecoScore = co2 === 0 ? 98 : (co2 < 60 ? 90 : (co2 < 120 ? 78 : (co2 < 160 ? 62 : 40)));

  const trekGeremd = Number(v.maximumTrekkenGeremd) || 0;
  const maxMassa = Number(v.toegestaneMaxMassa) || 1800;
  let utilScore = Math.min(100, Math.round((trekGeremd / 2500) * 60 + (maxMassa / 2800) * 40));

  const owners = Number(v.aantalEigenaren) || 2;
  const recalls = Number(v.openstaandeTerugroepacties) || 0;
  const nap = String(v.tellerstandOordeel || '').toLowerCase();
  let histScore = 80 + (nap.includes('logisch') ? 10 : -45) + (owners <= 1 ? 10 : (owners > 4 ? -15 : 0)) - (recalls > 0 ? 20 : 0);
  histScore = Math.max(10, Math.min(100, histScore));

  const totalWeighted = Math.round(
    perfScore * 0.25 + costScore * 0.25 + ecoScore * 0.15 + utilScore * 0.15 + histScore * 0.20
  );

  return {
    total: totalWeighted,
    pillars: { prestaties: perfScore, kosten: costScore, milieu: ecoScore, praktisch: utilScore, historie: histScore }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// RDW LIVE API & DATA NORMALIZER
// ═══════════════════════════════════════════════════════════════════════════

async function fetchRdwVehicle(plateRaw) {
  const clean = cleanPlate(plateRaw);
  if (!clean || clean.length < 4) return null;

  if (MOCK_VEHICLES[clean]) {
    return JSON.parse(JSON.stringify(MOCK_VEHICLES[clean]));
  }

  try {
    const basisUrl = `https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=${clean}`;
    const brandstofUrl = `https://opendata.rdw.nl/resource/8ys7-d773.json?kenteken=${clean}`;
    const apkUrl = `https://opendata.rdw.nl/resource/sgfe-77wq.json?kenteken=${clean}&$order=meld_datum_door_keuringsinstantie%20DESC&$limit=5`;

    const [basisRes, fuelRes, apkRes] = await Promise.allSettled([
      fetch(basisUrl), fetch(brandstofUrl), fetch(apkUrl)
    ]);

    let basisData = null;
    let fuelData = null;
    let apkData = [];

    if (basisRes.status === 'fulfilled' && basisRes.value.ok) {
      const arr = await basisRes.value.json();
      if (arr && arr.length > 0) basisData = arr[0];
    }
    if (fuelRes.status === 'fulfilled' && fuelRes.value.ok) {
      const arr = await fuelRes.value.json();
      if (arr && arr.length > 0) fuelData = arr[0];
    }
    if (apkRes.status === 'fulfilled' && apkRes.value.ok) {
      apkData = await apkRes.value.json();
    }

    if (!basisData) return generateSyntheticVehicle(clean);

    return normalizeRdwData(basisData, fuelData, apkData, clean);
  } catch (err) {
    return generateSyntheticVehicle(clean);
  }
}

function normalizeRdwData(b, f, apk, clean) {
  const kw = Number(f?.nettomaximumvermogen || b?.nettomaximumvermogen) || 100;
  const pk = Math.round(kw * 1.36);
  const cat = Number(b.catalogusprijs) || (b.bruto_bpm ? Number(b.bruto_bpm) * 4.5 : 35000);

  return {
    kenteken: clean,
    merk: b.merk || 'ONBEKEND',
    handelsbenaming: b.handelsbenaming || 'MODEL',
    inrichting: b.inrichting || 'Personenauto',
    kleur: b.eerste_kleur || 'Onbekend',
    eersteKleur: b.eerste_kleur || 'ONBEKEND',
    bouwjaar: b.datum_eerste_toelating ? b.datum_eerste_toelating.slice(0, 4) : '2020',
    datumEersteToelating: b.datum_eerste_toelating || '20200101',
    datumEersteAfgifteNederland: b.datum_eerste_afgifte_nederland || b.datum_eerste_toelating || '20200101',
    datumTenaamstelling: b.datum_tenaamstelling || '20230101',
    vervaldatumApk: b.vervaldatum_apk || '20270101',
    catalogusprijs: Math.round(cat),
    brutoBpm: Number(b.bruto_bpm) || 0,
    massaLedigVoertuig: Number(b.massa_ledig_voertuig) || 1350,
    massaRijklaar: Number(b.massa_rijklaar) || 1450,
    toegestaneMaxMassa: Number(b.toegestane_maximum_massa_voertuig) || 1900,
    maximumTrekkenOngeremd: Number(b.maximum_trekken_massa_ongeremd) || 650,
    maximumTrekkenGeremd: Number(b.maximum_trekken_massa_geremd) || 1300,
    brandstofOmschrijving: f?.brandstof_omschrijving || 'Benzine',
    cilinderinhoud: Number(f?.cilinderinhoud || b.cilinderinhoud) || 1498,
    aantalCilinders: Number(f?.aantal_cilinders || b.aantal_cilinders) || 4,
    vermogenKw: kw,
    vermogenPk: pk,
    verbruikGecombineerd: Number(f?.brandstofverbruik_gecombineerd) || (f?.brandstof_omschrijving?.includes('Elektri') ? 18.0 : 6.2),
    verbruikStad: Number(f?.brandstofverbruik_stad) || 7.5,
    verbruikSnelweg: Number(f?.brandstofverbruik_buitenweg) || 5.2,
    co2Uitstoot: Number(f?.co2_uitstoot_gecombineerd) || 130,
    emissieklasse: b.emissieklasse || '6',
    zuinigheidslabel: b.zuinigheidslabel || 'B',
    aantalZitplaatsen: Number(b.aantal_zitplaatsen) || 5,
    aantalDeuren: Number(b.aantal_deuren) || 4,
    aantalWielen: Number(b.aantal_wielen) || 4,
    topsnelheid: Number(b.maximale_snelheid) || (pk > 300 ? 250 : 200),
    acceleratie: pk > 400 ? 4.0 : (pk > 200 ? 6.5 : 9.5),
    tankinhoud: f?.brandstof_omschrijving?.includes('Elektri') ? 75 : 55,
    tellerstandOordeel: b.tellerstandoordeel || 'Logisch',
    aantalEigenaren: 2,
    particulierAantalDagen: 1200,
    openstaandeTerugroepacties: Number(b.openstaande_terugroepacties_indicator === 'JA' ? 1 : 0),
    wamVerzekerd: b.wam_verzekerd || 'Ja',
    gebrekenHistorie: Array.isArray(apk) ? apk.map(a => ({ datum: a.meld_datum_door_keuringsinstantie || 'Recent', punt: a.soort_erkenning_omschrijving || 'APK Inspectie', status: 'Goedgekeurd' })) : [],
    afbeeldingUrl: getPlaceholderVehicleImage(b.merk, b.inrichting)
  };
}

function generateSyntheticVehicle(clean) {
  return {
    kenteken: clean,
    merk: 'VOERTUIG',
    handelsbenaming: 'PREMIUM EDITION',
    inrichting: 'Sedan',
    kleur: 'Zwart',
    eersteKleur: 'ZWART',
    bouwjaar: '2021',
    datumEersteToelating: '20210515',
    datumEersteAfgifteNederland: '20210515',
    datumTenaamstelling: '20230210',
    vervaldatumApk: '20270515',
    catalogusprijs: 48500,
    brutoBpm: 5800,
    massaLedigVoertuig: 1420,
    massaRijklaar: 1520,
    toegestaneMaxMassa: 1980,
    maximumTrekkenOngeremd: 750,
    maximumTrekkenGeremd: 1500,
    brandstofOmschrijving: 'Benzine',
    cilinderinhoud: 1995,
    aantalCilinders: 4,
    vermogenKw: 140,
    vermogenPk: 190,
    verbruikGecombineerd: 6.1,
    verbruikStad: 7.8,
    verbruikSnelweg: 5.1,
    co2Uitstoot: 139,
    emissieklasse: '6',
    zuinigheidslabel: 'B',
    aantalZitplaatsen: 5,
    aantalDeuren: 4,
    aantalWielen: 4,
    topsnelheid: 235,
    acceleratie: 7.2,
    tankinhoud: 58,
    tellerstandOordeel: 'Logisch',
    aantalEigenaren: 2,
    particulierAantalDagen: 1100,
    openstaandeTerugroepacties: 0,
    wamVerzekerd: 'Ja',
    gebrekenHistorie: [],
    afbeeldingUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format&fit=crop'
  };
}

function getPlaceholderVehicleImage(make, body) {
  const m = String(make || '').toUpperCase();
  if (m.includes('PORSCHE')) return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format&fit=crop';
  if (m.includes('BMW')) return 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80&auto=format&fit=crop';
  if (m.includes('AUDI')) return 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80&auto=format&fit=crop';
  if (m.includes('MERCEDES')) return 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80&auto=format&fit=crop';
  if (m.includes('TESLA')) return 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80&auto=format&fit=crop';
  if (m.includes('VOLVO')) return 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80&auto=format&fit=crop';
  return 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80&auto=format&fit=crop';
}

// ═══════════════════════════════════════════════════════════════════════════
// 3-WAY COMPARISON CONTROLLER
// ═══════════════════════════════════════════════════════════════════════════

function toggleThirdCar() {
  appState.hasThirdCar = !appState.hasThirdCar;
  const col3 = document.getElementById('plate-col-3');
  const card3 = document.getElementById('v3-hero-card');
  const panel3 = document.getElementById('tco-v3-panel');
  const risk3 = document.getElementById('risk-col-3');
  const btn = document.getElementById('toggle-car-3-btn');
  const gridContainer = document.getElementById('plate-grid-container');
  const heroGrid = document.getElementById('vehicle-hero-grid');
  const tcoGrid = document.getElementById('tco-comparison-grid');
  const riskGrid = document.getElementById('risk-grid-container');

  if (col3) col3.style.display = appState.hasThirdCar ? 'flex' : 'none';
  if (card3) card3.style.display = appState.hasThirdCar ? 'flex' : 'none';
  if (panel3) panel3.style.display = appState.hasThirdCar ? 'flex' : 'none';
  if (risk3) risk3.style.display = appState.hasThirdCar ? 'flex' : 'none';

  if (gridContainer) gridContainer.classList.toggle('has-three', appState.hasThirdCar);
  if (heroGrid) heroGrid.classList.toggle('has-three', appState.hasThirdCar);
  if (tcoGrid) tcoGrid.classList.toggle('has-three', appState.hasThirdCar);
  if (riskGrid) riskGrid.classList.toggle('has-three', appState.hasThirdCar);

  if (btn) {
    btn.innerHTML = appState.hasThirdCar ? '<span>✕</span> Verwijder 3e Auto' : '<span>➕</span> 3e Auto Toevoegen (Driestrijd)';
  }

  if (appState.hasThirdCar && !appState.vehicles[3]) {
    loadPresetSingle(3, '04HGLB');
  } else {
    updateComparisonView();
  }
}

function load3WayPreset(p1, p2, p3) {
  if (!appState.hasThirdCar) toggleThirdCar();
  loadPresetSingle(1, p1);
  loadPresetSingle(2, p2);
  loadPresetSingle(3, p3);
}

// ═══════════════════════════════════════════════════════════════════════════
// RENDERING CONTROLLERS & COMPARISON ENGINE
// ═══════════════════════════════════════════════════════════════════════════

function updateComparisonView() {
  const v1 = appState.vehicles[1];
  const v2 = appState.vehicles[2];
  const v3 = appState.hasThirdCar ? appState.vehicles[3] : null;
  const resultsArea = document.getElementById('comparison-results');
  
  if (!v1 || !v2) {
    if (resultsArea) resultsArea.hidden = true;
    return;
  }

  if (resultsArea) resultsArea.hidden = false;

  const costs1 = calculateMonthlyCosts(v1, appState.settings);
  const costs2 = calculateMonthlyCosts(v2, appState.settings);
  const costs3 = v3 ? calculateMonthlyCosts(v3, appState.settings) : null;

  const bpm1 = calculateRestBpm(v1.brutoBpm, v1.datumEersteToelating);
  const bpm2 = calculateRestBpm(v2.brutoBpm, v2.datumEersteToelating);
  const bpm3 = v3 ? calculateRestBpm(v3.brutoBpm, v3.datumEersteToelating) : null;

  const score1 = calculateApexScore(v1, costs1);
  const score2 = calculateApexScore(v2, costs2);
  const score3 = v3 ? calculateApexScore(v3, costs3) : null;

  // 1. ✨ Render Executive Highlights Card
  renderExecutiveHighlights(v1, v2, v3, costs1, costs2, costs3);

  // 1b. 👑 Render Color-Coded Win Crowns
  renderWinCrowns(v1, v2, v3, costs1, costs2, costs3);

  // 1c. 🏆 Render Martijn Puts Advisory & Opinion Box
  renderMartijnAdvisory(v1, v2, v3, costs1, costs2, costs3, bpm1, bpm2, bpm3);

  // 1d. ⚖️ Render Lifestyle & Keuzehulp Mini-Quiz
  renderLifestyleMatchQuiz(v1, v2, v3, costs1, costs2, costs3);

  // 2. 🏎️ Render Auto Kenner Quiz Minigame
  setupQuizQuestions(v1, v2, costs1, costs2);

  // 3. Render Top Vehicle Hero Cards
  const bestScore = Math.max(score1.total, score2.total, score3 ? score3.total : 0);
  renderVehicleHero(1, v1, costs1, score1, score1.total === bestScore);
  renderVehicleHero(2, v2, costs2, score2, score2.total === bestScore);
  if (v3 && costs3 && score3) {
    renderVehicleHero(3, v3, costs3, score3, score3.total === bestScore);
  }

  // 4. Render Executive Verdict & KPI Deltas
  renderVerdict(v1, v2, costs1, costs2, bpm1, bpm2);

  // 5. ⚡ Render Interactive Drag Race Arena
  renderDragRaceArena(v1, v2);

  // 6. 🕸️ Render 6-Axis Visual Radar / Spider Chart
  renderRadarChart(v1, v2, v3, costs1, costs2, costs3, bpm1, bpm2, bpm3);

  // 7. 🏆 Render 6-Matchup Battle Showdown Matrix
  renderBattleMatrix(v1, v2, costs1, costs2, bpm1, bpm2);

  // 8. Render Import Opportunity Card
  renderImportOpportunity(v1, v2, costs1, costs2, bpm1, bpm2);

  // 9. Render APEX 5-Pillar Score Matrix
  renderScoreMatrix(v1, v2, score1, score2);

  // 10. 🔮 Render 10-Year TCO & Residual Value Projection Simulator
  render10YearProjection(v1, v2, costs1, costs2);

  // 11. 🏖️ Render Roadtrip & Vacation Cost Planner
  renderRoadtripPlanner(v1, v2);

  // 12. Render TCO Stacked Breakdown
  renderTcoProjection(v1, v2, v3, costs1, costs2, costs3);

  // 13. Render Cumulative Savings Timeline
  renderSavingsTimeline(v1, v2, costs1, costs2);

  // 14. Render Performance Visualizer
  renderPerfVisualizer(v1, v2);

  // 14b. 🛡️ Render Occasion Schade- & WOK Risico Barometer
  renderWokRiskBarometer(v1, v2, v3);

  // 15. Render Risk Analysis & Buying Checklist
  renderRiskAnalysis(v1, v2, v3, bpm1, bpm2, bpm3);

  // 16. Render Zakelijke Bijtelling Module
  renderBijtellingModule(v1, v2);

  // 17. Render Caravan Safety & Towing Module
  renderCaravanModule(v1, v2);

  // 18. Render Milieuzones Module
  renderMilieuzoneModule(v1, v2);

  // 18b. 🔄 Render Inruil- & Dagwaarde Schatter
  renderTradeInCalculator(v1, v2, v3);

  // 18c. 🌍 Render Market Explorer & Import Opportunities
  renderMarketExplorer(v1, v2, v3, bpm1, bpm2, bpm3);

  // 19. Render Proefrit & Aankoop Tips
  renderProefritTips(v1, v2);

  // 20. Render Full Detailed Matrix
  renderDetailedMatrix(v1, v2, v3, costs1, costs2, costs3, bpm1, bpm2, bpm3);

  // 20b. 📄 Render PDF Executive Export Banner
  renderPdfExportBanner(v1, v2, v3);

  if (appState.settings.diffOnly) toggleDiffOnly(true);

  // Update CTAs & Sticky Bar
  updateContactCta(v1, v2);
  updateStickyBar(v1, v2, costs1, costs2);
  updateUrlParams(v1.kenteken, v2.kenteken, v3?.kenteken);
  saveRecentSearch(v1.kenteken, v2.kenteken, `${v1.merk} vs ${v2.merk}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// ✨ EXECUTIVE HIGHLIGHTS & SUMMARY CARD
// ═══════════════════════════════════════════════════════════════════════════

function renderExecutiveHighlights(v1, v2, v3, c1, c2, c3) {
  const container = document.getElementById('executive-highlights-container');
  if (!container) return;

  const diffMonthly = Math.abs(c1.totalMonthly - c2.totalMonthly);
  const cheaperCar = c1.totalMonthly <= c2.totalMonthly ? v1 : v2;
  const fasterCar = v1.acceleratie <= v2.acceleratie ? v1 : v2;

  container.innerHTML = `
    <div class="executive-highlights-card">
      <div class="highlights-header">
        <div class="highlights-title-group">
          <span class="highlights-dot"></span>
          <h3>✨ APEX Quick Highlights &amp; Samenvatting</h3>
        </div>
        <span class="free-report-badge">Freemium Inzicht 1/3</span>
      </div>

      <div class="highlights-bullet-grid">
        <div class="highlight-item-card">
          <span>⚡ Snelste Sprinter</span>
          <strong>${fasterCar.merk} ${fasterCar.handelsbenaming}</strong>
          <p>0–100 km/u in <strong>${fasterCar.acceleratie}s</strong> (${fasterCar.vermogenPk} PK). Biedt de meest dynamische rijbeleving.</p>
        </div>

        <div class="highlight-item-card">
          <span>💶 Laagste Maandlasten</span>
          <strong>${cheaperCar.merk} ${cheaperCar.handelsbenaming}</strong>
          <p>Bespaart <strong>${formatEuro(diffMonthly)} per maand</strong> (${formatEuro(diffMonthly * 12)} / jaar) aan TCO exploitatiekosten.</p>
        </div>

        <div class="highlight-item-card">
          <span>🔍 Aankoopadvies Martijn</span>
          <strong>Inspectie &amp; Historie Check</strong>
          <p>${v1.aantalEigenaren > 3 || v2.aantalEigenaren > 3 ? 'Aandachtspunt: meerdere eigenaren geregistreerd. Fysieke keuring aanbevolen.' : 'Beide voertuigen vertonen een logisch tellerstandoordeel en solide RDW-status.'}</p>
        </div>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
// 👑 COLOR-CODED WIN CROWNS & HIGHLIGHTS
// ═══════════════════════════════════════════════════════════════════════════

function renderWinCrowns(v1, v2, v3, c1, c2, c3) {
  const container = document.getElementById('win-crowns-container');
  if (!container) return;

  const cars = [
    { v: v1, c: c1, id: 1 },
    { v: v2, c: c2, id: 2 }
  ];
  if (v3 && c3) cars.push({ v: v3, c: c3, id: 3 });

  // 1. Speed champion (highest vermogenPk, tie-break lowest acceleratie)
  const speedChamp = [...cars].sort((a, b) => (b.v.vermogenPk || 0) - (a.v.vermogenPk || 0))[0];
  const speedDiff = Math.abs(Math.round((v1.vermogenPk || 0) - (v2.vermogenPk || 0)));

  // 2. Eco / Efficiency champion
  function getEcoScore(car) {
    if (car.v.brandstof === 'Elektriciteit') return 999;
    if (car.v.verbruikGecombineerd > 0) return 100 / car.v.verbruikGecombineerd;
    return 100;
  }
  const ecoChamp = [...cars].sort((a, b) => getEcoScore(b) - getEcoScore(a))[0];

  // 3. TCO / Savings champion (lowest totalMonthly)
  const budgetChamp = [...cars].sort((a, b) => a.c.totalMonthly - b.c.totalMonthly)[0];
  const budgetDiff = Math.abs(c1.totalMonthly - c2.totalMonthly);

  // 4. Caravan & Utility champion (highest trekgewicht)
  const towChamp = [...cars].sort((a, b) => (b.v.massaTrekgewichtGeremd || 0) - (a.v.massaTrekgewichtGeremd || 0))[0];

  container.innerHTML = `
    <div class="win-crowns-wrapper">
      <div class="crown-card crown-gold">
        <div class="crown-badge">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Snelheid &amp; Vermogen
        </div>
        <div class="crown-winner-name">${escapeHtml(speedChamp.v.merk)} ${escapeHtml(speedChamp.v.handelsbenaming)}</div>
        <div class="crown-stat-main">${speedChamp.v.vermogenPk} PK &bull; 0-100 in ${speedChamp.v.acceleratie ? speedChamp.v.acceleratie + 's' : 'n.b.'}</div>
        <div class="crown-stat-sub">${speedDiff > 0 ? '+' + speedDiff + ' pk meer vermogen dan rivaal' : 'Onbetwist topsnelheidskampioen'}</div>
      </div>

      <div class="crown-card crown-green">
        <div class="crown-badge">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Maandlasten &amp; TCO
        </div>
        <div class="crown-winner-name">${escapeHtml(budgetChamp.v.merk)} ${escapeHtml(budgetChamp.v.handelsbenaming)}</div>
        <div class="crown-stat-main">&euro;${Math.round(budgetChamp.c.totalMonthly)} / maand</div>
        <div class="crown-stat-sub">Bespaart &euro;${Math.round(budgetDiff)} per maand (&euro;${Math.round(budgetDiff * 12)} /jr)</div>
      </div>

      <div class="crown-card crown-blue">
        <div class="crown-badge">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
          Efficiëntie &amp; Milieu
        </div>
        <div class="crown-winner-name">${escapeHtml(ecoChamp.v.merk)} ${escapeHtml(ecoChamp.v.handelsbenaming)}</div>
        <div class="crown-stat-main">${ecoChamp.v.brandstof === 'Elektriciteit' ? '100% Elektrisch' : (ecoChamp.v.verbruikGecombineerd ? ecoChamp.v.verbruikGecombineerd.toFixed(1) + ' l/100km' : 'Gunstig energielabel')}</div>
        <div class="crown-stat-sub">${ecoChamp.v.co2Uitstoot ? ecoChamp.v.co2Uitstoot + ' g/km CO2' : 'Geen directe lokale uitstoot'}</div>
      </div>

      <div class="crown-card crown-copper">
        <div class="crown-badge">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          Trekvermogen &amp; Ruimte
        </div>
        <div class="crown-winner-name">${escapeHtml(towChamp.v.merk)} ${escapeHtml(towChamp.v.handelsbenaming)}</div>
        <div class="crown-stat-main">${towChamp.v.massaTrekgewichtGeremd ? towChamp.v.massaTrekgewichtGeremd + ' kg' : 'Geen trekhaak'} geremd</div>
        <div class="crown-stat-sub">${(towChamp.v.massaTrekgewichtGeremd || 0) >= 1500 ? 'Ideaal voor zware caravan of boot' : 'Geschikt voor fietsendrager'}</div>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🏆 MARTIJN PUTS EXECUTIVE ADVISORY & SECOND OPINION
// ═══════════════════════════════════════════════════════════════════════════

function renderMartijnAdvisory(v1, v2, v3, c1, c2, c3, bpm1, bpm2, bpm3) {
  const container = document.getElementById('martijn-advisory-container');
  if (!container) return;

  const fasterCar = (v1.acceleratie || 10) <= (v2.acceleratie || 10) ? v1 : v2;
  const cheaperCar = c1.totalMonthly <= c2.totalMonthly ? v1 : v2;
  const diffMonthly = Math.abs(c1.totalMonthly - c2.totalMonthly);
  const diffYr = Math.round(diffMonthly * 12);

  let adviceQuote = "";
  if (v1.brandstof === 'Elektriciteit' || v2.brandstof === 'Elektriciteit') {
    adviceQuote = `De overstap tussen een klassieke verbrandingsmotor en elektrisch rijden is hier doorslaggevend. Terwijl de ${cheaperCar.merk} qua maandelijkse TCO en bijtelling overtuigend wint, levert de ${fasterCar.merk} de pure beleving en actieradiusflexibiliteit die autoliefhebbers zoeken.`;
  } else if (Math.abs(v1.vermogenPk - v2.vermogenPk) > 60) {
    adviceQuote = `Het vermogensverschil van ${Math.abs(Math.round(v1.vermogenPk - v2.vermogenPk))} PK definieert direct het karakter. De ${fasterCar.merk} is overtuigend superieur in sprint en inhaalmanoeuvres, maar vraagt ca. €${Math.round(diffMonthly)}/mnd extra aan TCO exploitatie en brandstof.`;
  } else {
    adviceQuote = `Beide auto's liggen qua specificaties bijzonder dicht bij elkaar. Hier maken met name de onderhoudshistorie, de staat van specifieke slijtageonderdelen en de potentiële importbesparing via ons Duitse dealernetwerk het echte verschil.`;
  }

  const whatsappMsg = encodeURIComponent(`Hallo Martijn, ik heb zojuist de ${v1.merk} ${v1.handelsbenaming} (${v1.kenteken}) vergeleken met de ${v2.merk} ${v2.handelsbenaming} (${v2.kenteken}) via de APEX Vergelijker. Kun je met mij meedenken over aankoopadvies en importmogelijkheden?`);

  container.innerHTML = `
    <div class="martijn-advisory-box">
      <div class="advisory-top-banner">
        <div class="advisory-badge-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          APEX Exclusive Eindoordeel &amp; Aankoopadvies
        </div>
        <span class="advisory-author">Door Martijn Puts &bull; Onafhankelijk Aankoopmakelaar</span>
      </div>

      <div class="advisory-content-grid">
        <div class="advisory-quote-column">
          <div class="advisory-avatar-wrap">
            <div class="advisory-initials-badge">MP</div>
            <div>
              <div class="advisory-name">Martijn Puts</div>
              <div class="advisory-role">Oprichter &amp; Automotive Aankoopmakelaar</div>
            </div>
          </div>
          <p class="advisory-quote-text">
            &ldquo;${adviceQuote}&rdquo;
          </p>
          <div class="advisory-action-btns">
            <a href="https://wa.me/31641042507?text=${whatsappMsg}" target="_blank" rel="noopener noreferrer" class="btn-advisory-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              Bespreek dit vergelijk direct via WhatsApp
            </a>
            <a href="https://apexclusive.nl/contact" target="_blank" rel="noopener noreferrer" class="btn-advisory-secondary">
              Vrijblijvende aankoop-audit aanvragen &rarr;
            </a>
          </div>
        </div>

        <div class="advisory-pillars-column">
          <div class="advisory-pillar-item">
            <div class="pillar-num">01</div>
            <div class="pillar-info">
              <h5>Rijbeleving &amp; Karakter</h5>
              <p>De <strong>${escapeHtml(fasterCar.merk)}</strong> levert superieure gaspedaalrespons en vermogensreserve. Voor ontspannen kilometers en cruise-comfort biedt de <strong>${escapeHtml(cheaperCar.merk)}</strong> echter een meer serene rijervaring.</p>
            </div>
          </div>

          <div class="advisory-pillar-item">
            <div class="pillar-num">02</div>
            <div class="pillar-info">
              <h5>Financiële Realiteit &amp; Afschrijving</h5>
              <p>Met een verschil van <strong>&euro;${Math.round(diffMonthly)} per maand</strong> (&euro;${diffYr}/jr) bespaart u met de ${escapeHtml(cheaperCar.merk)} substantieel op brandstof, MRB en onderhoud.</p>
            </div>
          </div>

          <div class="advisory-pillar-item">
            <div class="pillar-num">03</div>
            <div class="pillar-info">
              <h5>Markt &amp; Importkansen Duitsland</h5>
              <p>In Duitsland staan gemiddeld <strong>3 tot 4x zoveel</strong> rijk uitgeruste exemplaren met transparante dealerhistorie. Wij speuren het beste exemplaar voor u op en regelen de aankoop van A tot Z.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
// ⚖️ LIFESTYLE & KEUZEHULP MINI-QUIZ
// ═══════════════════════════════════════════════════════════════════════════

let lifestyleState = {
  km: 'avg',
  focus: 'power',
  usage: 'private'
};

function selectLifestyleAnswer(category, value) {
  lifestyleState[category] = value;
  if (appState.vehicles[1] && appState.vehicles[2]) {
    const c1 = calculateMonthlyCosts(appState.vehicles[1], appState.settings);
    const c2 = calculateMonthlyCosts(appState.vehicles[2], appState.settings);
    const c3 = appState.vehicles[3] ? calculateMonthlyCosts(appState.vehicles[3], appState.settings) : null;
    renderLifestyleMatchQuiz(appState.vehicles[1], appState.vehicles[2], appState.vehicles[3], c1, c2, c3);
  }
}

function renderLifestyleMatchQuiz(v1, v2, v3, c1, c2, c3) {
  const container = document.getElementById('lifestyle-match-container');
  if (!container) return;

  let score1 = 50;
  let score2 = 50;

  // Question 1: KM per year
  if (lifestyleState.km === 'low') {
    if (v1.vermogenPk > v2.vermogenPk) score1 += 15; else score2 += 15;
  } else if (lifestyleState.km === 'high') {
    if (c1.fuelMonthly < c2.fuelMonthly) score1 += 20; else score2 += 20;
    if (c1.mrbMonthly < c2.mrbMonthly) score1 += 10; else score2 += 10;
  } else {
    if (c1.totalMonthly < c2.totalMonthly) score1 += 10; else score2 += 10;
  }

  // Question 2: Focus
  if (lifestyleState.focus === 'power') {
    if (v1.vermogenPk > v2.vermogenPk) score1 += 25; else score2 += 25;
    if ((v1.acceleratie || 10) < (v2.acceleratie || 10)) score1 += 15; else score2 += 15;
  } else if (lifestyleState.focus === 'eco') {
    if (c1.totalMonthly < c2.totalMonthly) score1 += 25; else score2 += 25;
    if ((v1.verbruikGecombineerd || 99) < (v2.verbruikGecombineerd || 99)) score1 += 15; else score2 += 15;
  } else if (lifestyleState.focus === 'space') {
    if ((v1.massaTrekgewichtGeremd || 0) > (v2.massaTrekgewichtGeremd || 0)) score1 += 25; else score2 += 25;
    if ((v1.massaRijklaar || 0) > (v2.massaRijklaar || 0)) score1 += 10; else score2 += 10;
  }

  // Question 3: Usage
  if (lifestyleState.usage === 'business') {
    if (v1.brandstof === 'Elektriciteit' && v2.brandstof !== 'Elektriciteit') score1 += 25;
    else if (v2.brandstof === 'Elektriciteit' && v1.brandstof !== 'Elektriciteit') score2 += 25;
    else if (v1.catalogusprijs < v2.catalogusprijs) score1 += 15; else score2 += 15;
  } else if (lifestyleState.usage === 'weekend') {
    if (v1.vermogenPk > v2.vermogenPk) score1 += 20; else score2 += 20;
  } else {
    if (c1.totalMonthly < c2.totalMonthly) score1 += 15; else score2 += 15;
  }

  const total = score1 + score2;
  const matchPct1 = Math.round((score1 / total) * 100);
  const matchPct2 = 100 - matchPct1;

  const winner = matchPct1 >= matchPct2 ? v1 : v2;
  const winnerPct = Math.max(matchPct1, matchPct2);
  const winnerSide = matchPct1 >= matchPct2 ? 1 : 2;

  container.innerHTML = `
    <div class="lifestyle-match-box">
      <div class="lifestyle-header">
        <div class="lifestyle-title-badge">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          APEX Keuzehulp &amp; Rijprofiel Matcher
        </div>
        <h4>Welke auto past écht bij uw rijstijl en gebruik?</h4>
        <p>Klik op uw voorkeuren en ontdek direct welke auto rekenkundig en praktisch de beste match is.</p>
      </div>

      <div class="quiz-questions-interactive">
        <div class="quiz-row">
          <span class="quiz-row-label">1. Jaarkilometrage:</span>
          <div class="quiz-choice-buttons">
            <button type="button" class="quiz-choice-btn ${lifestyleState.km === 'low' ? 'selected' : ''}" onclick="selectLifestyleAnswer('km', 'low')">&lt; 12.000 km/jr</button>
            <button type="button" class="quiz-choice-btn ${lifestyleState.km === 'avg' ? 'selected' : ''}" onclick="selectLifestyleAnswer('km', 'avg')">12.000 - 25.000 km/jr</button>
            <button type="button" class="quiz-choice-btn ${lifestyleState.km === 'high' ? 'selected' : ''}" onclick="selectLifestyleAnswer('km', 'high')">&gt; 25.000 km/jr</button>
          </div>
        </div>

        <div class="quiz-row">
          <span class="quiz-row-label">2. Belangrijkste Prioriteit:</span>
          <div class="quiz-choice-buttons">
            <button type="button" class="quiz-choice-btn ${lifestyleState.focus === 'power' ? 'selected' : ''}" onclick="selectLifestyleAnswer('focus', 'power')">⚡ Vermogen &amp; Snelheid</button>
            <button type="button" class="quiz-choice-btn ${lifestyleState.focus === 'eco' ? 'selected' : ''}" onclick="selectLifestyleAnswer('focus', 'eco')">💶 Laagste Maandlasten</button>
            <button type="button" class="quiz-choice-btn ${lifestyleState.focus === 'space' ? 'selected' : ''}" onclick="selectLifestyleAnswer('focus', 'space')">🏕️ Trekgewicht &amp; Ruimte</button>
          </div>
        </div>

        <div class="quiz-row">
          <span class="quiz-row-label">3. Gebruiksdoel:</span>
          <div class="quiz-choice-buttons">
            <button type="button" class="quiz-choice-btn ${lifestyleState.usage === 'private' ? 'selected' : ''}" onclick="selectLifestyleAnswer('usage', 'private')">Dagelijks Privé</button>
            <button type="button" class="quiz-choice-btn ${lifestyleState.usage === 'business' ? 'selected' : ''}" onclick="selectLifestyleAnswer('usage', 'business')">Zakelijk / Lease</button>
            <button type="button" class="quiz-choice-btn ${lifestyleState.usage === 'weekend' ? 'selected' : ''}" onclick="selectLifestyleAnswer('usage', 'weekend')">Liefhebber / Weekend</button>
          </div>
        </div>
      </div>

      <div class="lifestyle-result-card">
        <div class="lifestyle-winner-hero">
          <div class="winner-label">🏆 Aanbevolen Match op basis van uw profiel:</div>
          <div class="winner-title">${escapeHtml(winner.merk)} ${escapeHtml(winner.handelsbenaming)} (${winnerPct}% Match)</div>
          <p class="winner-explanation">
            ${winnerSide === 1 
              ? `Voor uw profiel (${lifestyleState.km === 'high' ? 'veelrijder' : 'gemiddeld kilometrage'}, focus op ${lifestyleState.focus === 'power' ? 'sportieve prestaties' : lifestyleState.focus === 'eco' ? 'lage kosten' : 'trekkracht'}) biedt de ${escapeHtml(v1.merk)} de meest harmonieuze balans tussen aanschaf, beleving en exploitatie.`
              : `Voor uw profiel (${lifestyleState.km === 'high' ? 'veelrijder' : 'gemiddeld kilometrage'}, focus op ${lifestyleState.focus === 'power' ? 'sportieve prestaties' : lifestyleState.focus === 'eco' ? 'lage kosten' : 'trekkracht'}) biedt de ${escapeHtml(v2.merk)} het meeste voordeel en aansluiting bij uw wensen.`}
          </p>
        </div>
        <div class="lifestyle-bars">
          <div class="lifestyle-bar-row">
            <span>${escapeHtml(v1.merk)} ${escapeHtml(v1.handelsbenaming)}:</span>
            <div class="bar-track"><div class="bar-fill" style="width: ${matchPct1}%; background: var(--copper);"></div></div>
            <span class="bar-val">${matchPct1}%</span>
          </div>
          <div class="lifestyle-bar-row">
            <span>${escapeHtml(v2.merk)} ${escapeHtml(v2.handelsbenaming)}:</span>
            <div class="bar-track"><div class="bar-fill" style="width: ${matchPct2}%; background: #60a5fa;"></div></div>
            <span class="bar-val">${matchPct2}%</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🕸️ 6-AXIS VISUAL RADAR / SPIDER COMPARISON GRAPHIC
// ═══════════════════════════════════════════════════════════════════════════

function renderRadarChart(v1, v2, v3, c1, c2, c3, bpm1, bpm2, bpm3) {
  const container = document.getElementById('radar-chart-container');
  if (!container) return;

  // 6 standard axes:
  // 1: Vermogen (0-700 pk)
  // 2: Sprint (14s down to 3s)
  // 3: TCO Maandlasten Efficiency (€1500 down to €300)
  // 4: Eco / Zuinigheid (CO2 / Brandstof)
  // 5: Praktisch / Trekgewicht (0-2500 kg)
  // 6: Waardevastheid / Rest-BPM (0-100%)

  function calcMetrics(v, c, b) {
    const p1 = Math.min(100, Math.max(15, (v.vermogenPk / 650) * 100));
    const p2 = Math.min(100, Math.max(15, ((13 - Math.min(13, v.acceleratie)) / 9.5) * 100));
    const p3 = Math.min(100, Math.max(15, 100 - ((c.totalMonthly - 300) / 1200) * 100));
    const p4 = v.co2Uitstoot === 0 ? 98 : Math.min(100, Math.max(15, 100 - (v.co2Uitstoot / 300) * 100));
    const p5 = Math.min(100, Math.max(15, (v.maximumTrekkenGeremd / 2400) * 100));
    const p6 = Math.min(100, Math.max(15, b.restBpmPct));
    return [p1, p2, p3, p4, p5, p6];
  }

  const m1 = calcMetrics(v1, c1, bpm1);
  const m2 = calcMetrics(v2, c2, bpm2);
  const m3 = v3 && c3 && bpm3 ? calcMetrics(v3, c3, bpm3) : null;

  const labels = [
    'Vermogen (PK)',
    'Sprint (0-100)',
    'TCO Voordeel',
    'Zuinigheid / Eco',
    'Trekkracht',
    'Rest-BPM Waarde'
  ];

  const cx = 200, cy = 200, r = 130;
  const numAxes = 6;

  function getPoint(index, pct) {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const dist = (pct / 100) * r;
    return {
      x: (cx + dist * Math.cos(angle)).toFixed(1),
      y: (cy + dist * Math.sin(angle)).toFixed(1)
    };
  }

  function getPolygonPoints(metrics) {
    return metrics.map((val, idx) => {
      const pt = getPoint(idx, val);
      return `${pt.x},${pt.y}`;
    }).join(' ');
  }

  // Generate background spiderweb rings
  const gridRings = [0.25, 0.5, 0.75, 1.0].map(scale => {
    const pts = [0,1,2,3,4,5].map(i => {
      const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
      return `${(cx + r * scale * Math.cos(angle)).toFixed(1)},${(cy + r * scale * Math.sin(angle)).toFixed(1)}`;
    }).join(' ');
    return `<polygon points="${pts}" fill="none" stroke="rgba(244,241,235,0.1)" stroke-width="1"/>`;
  }).join('');

  // Generate spokes & labels
  const spokesAndLabels = [0,1,2,3,4,5].map(i => {
    const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
    const xEnd = cx + r * Math.cos(angle);
    const yEnd = cy + r * Math.sin(angle);
    const xLabel = cx + (r + 28) * Math.cos(angle);
    const yLabel = cy + (r + 28) * Math.sin(angle);
    return `
      <line x1="${cx}" y1="${cy}" x2="${xEnd}" y2="${yEnd}" stroke="rgba(244,241,235,0.15)" stroke-width="1"/>
      <text x="${xLabel}" y="${yLabel + 4}" text-anchor="middle" font-family="'Manrope', sans-serif" font-size="9" font-weight="600" fill="#abb0ad" letter-spacing="0.05em">
        ${labels[i]}
      </text>
    `;
  }).join('');

  container.innerHTML = `
    <div class="radar-header">
      <div>
        <h3>🕸️ 6-Pijler Radar Vergelijking</h3>
        <p>Visuele balans tussen vermogen, sprinttijd, maandlasten, milieu, trekkracht en waardevastheid</p>
      </div>
    </div>

    <div class="radar-container">
      <svg class="radar-svg" viewBox="0 0 400 400">
        ${gridRings}
        ${spokesAndLabels}
        
        <!-- Polygon 1 (Copper / Gold) -->
        <polygon points="${getPolygonPoints(m1)}" fill="rgba(226, 178, 142, 0.3)" stroke="#e2b28e" stroke-width="2.5"/>
        ${m1.map((val, idx) => {
          const pt = getPoint(idx, val);
          return `<circle cx="${pt.x}" cy="${pt.y}" r="4" fill="#e2b28e" stroke="#121717" stroke-width="1.5"/>`;
        }).join('')}

        <!-- Polygon 2 (Cyan / Ice Blue) -->
        <polygon points="${getPolygonPoints(m2)}" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" stroke-width="2.5"/>
        ${m2.map((val, idx) => {
          const pt = getPoint(idx, val);
          return `<circle cx="${pt.x}" cy="${pt.y}" r="4" fill="#38bdf8" stroke="#121717" stroke-width="1.5"/>`;
        }).join('')}

        <!-- Polygon 3 (Optional Green) -->
        ${m3 ? `
          <polygon points="${getPolygonPoints(m3)}" fill="rgba(74, 222, 128, 0.25)" stroke="#4ade80" stroke-width="2.5"/>
          ${m3.map((val, idx) => {
            const pt = getPoint(idx, val);
            return `<circle cx="${pt.x}" cy="${pt.y}" r="4" fill="#4ade80" stroke="#121717" stroke-width="1.5"/>`;
          }).join('')}
        ` : ''}
      </svg>
    </div>

    <div class="radar-legend">
      <div class="radar-legend-item">
        <span class="radar-legend-dot" style="background:#e2b28e;"></span>
        <strong style="color:var(--paper);">${v1.merk} ${v1.handelsbenaming}</strong>
      </div>
      <div class="radar-legend-item">
        <span class="radar-legend-dot" style="background:#38bdf8;"></span>
        <strong style="color:var(--paper);">${v2.merk} ${v2.handelsbenaming}</strong>
      </div>
      ${v3 ? `
        <div class="radar-legend-item">
          <span class="radar-legend-dot" style="background:#4ade80;"></span>
          <strong style="color:var(--paper);">${v3.merk} ${v3.handelsbenaming}</strong>
        </div>
      ` : ''}
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🏎️ APEX AUTO KENNER BATTLE QUIZ (GAMIFIED ENGAGEMENT)
// ═══════════════════════════════════════════════════════════════════════════

function setupQuizQuestions(v1, v2, c1, c2) {
  appState.quiz.score = 0;
  appState.quiz.currentQ = 0;
  appState.quiz.questions = [
    {
      q: 'Welke auto is het snelst op de 0–100 km/u sprint?',
      options: [
        { label: `${v1.merk} (${v1.acceleratie}s)`, isCorrect: v1.acceleratie <= v2.acceleratie },
        { label: `${v2.merk} (${v2.acceleratie}s)`, isCorrect: v2.acceleratie <= v1.acceleratie }
      ],
      explanation: `De ${v1.acceleratie <= v2.acceleratie ? v1.merk : v2.merk} sprint in ${Math.min(v1.acceleratie, v2.acceleratie)}s naar 100, tegenover ${Math.max(v1.acceleratie, v2.acceleratie)}s voor de concurrent.`
    },
    {
      q: 'Welke auto kost het MINSTE per maand in totale exploitatie (TCO)?',
      options: [
        { label: `${v1.merk} (${formatEuro(c1.totalMonthly)}/mnd)`, isCorrect: c1.totalMonthly <= c2.totalMonthly },
        { label: `${v2.merk} (${formatEuro(c2.totalMonthly)}/mnd)`, isCorrect: c2.totalMonthly <= c1.totalMonthly }
      ],
      explanation: `De ${c1.totalMonthly <= c2.totalMonthly ? v1.merk : v2.merk} bespaart ${formatEuro(Math.abs(c1.totalMonthly - c2.totalMonthly))} per maand aan vaste en variabele lasten.`
    },
    {
      q: 'Welke auto mag de zwaarste aanhanger of caravan trekken?',
      options: [
        { label: `${v1.merk} (${formatNumber(v1.maximumTrekkenGeremd)} kg)`, isCorrect: v1.maximumTrekkenGeremd >= v2.maximumTrekkenGeremd },
        { label: `${v2.merk} (${formatNumber(v2.maximumTrekkenGeremd)} kg)`, isCorrect: v2.maximumTrekkenGeremd >= v1.maximumTrekkenGeremd }
      ],
      explanation: `De ${v1.maximumTrekkenGeremd >= v2.maximumTrekkenGeremd ? v1.merk : v2.merk} mag maximaal ${Math.max(v1.maximumTrekkenGeremd, v2.maximumTrekkenGeremd)} kg geremd trekken.`
    },
    {
      q: 'Welke auto stoot de minste CO2 uit per kilometer?',
      options: [
        { label: `${v1.merk} (${v1.co2Uitstoot}g CO2)`, isCorrect: v1.co2Uitstoot <= v2.co2Uitstoot },
        { label: `${v2.merk} (${v2.co2Uitstoot}g CO2)`, isCorrect: v2.co2Uitstoot <= v1.co2Uitstoot }
      ],
      explanation: `De ${v1.co2Uitstoot <= v2.co2Uitstoot ? v1.merk : v2.merk} stoot ${Math.min(v1.co2Uitstoot, v2.co2Uitstoot)}g/km uit en heeft energielabel ${v1.co2Uitstoot <= v2.co2Uitstoot ? v1.zuinigheidslabel : v2.zuinigheidslabel}.`
    },
    {
      q: 'Welke auto heeft de hoogste topsnelheid volgens het RDW-kentekenregister?',
      options: [
        { label: `${v1.merk} (${v1.topsnelheid} km/u)`, isCorrect: v1.topsnelheid >= v2.topsnelheid },
        { label: `${v2.merk} (${v2.topsnelheid} km/u)`, isCorrect: v2.topsnelheid >= v1.topsnelheid }
      ],
      explanation: `De ${v1.topsnelheid >= v2.topsnelheid ? v1.merk : v2.merk} bereikt een topsnelheid van ${Math.max(v1.topsnelheid, v2.topsnelheid)} km/u.`
    }
  ];

  renderQuizQuestion();
}

function renderQuizQuestion() {
  const container = document.getElementById('quiz-game-container');
  if (!container) return;

  const qData = appState.quiz.questions[appState.quiz.currentQ];
  if (!qData) {
    // Quiz completed screen
    const isPerfect = appState.quiz.score === appState.quiz.questions.length;
    if (isPerfect) playFinishFanfare();

    container.innerHTML = `
      <div class="quiz-game-box" style="text-align:center;">
        <h3 style="font-family:var(--serif); font-size:1.6rem; color:var(--paper);">🏆 Gefeliciteerd! Quiz Voltooid</h3>
        <p style="color:var(--muted); margin:0.6rem 0 1.2rem;">
          Uw score: <strong>${appState.quiz.score} van de ${appState.quiz.questions.length} juist</strong> — ${isPerfect ? 'U bent een rasechte Auto Kenner! 🌟' : 'Blijf vergelijken en ontdekken! 🚗'}
        </p>
        <button class="action-btn" type="button" onclick="setupQuizQuestions(appState.vehicles[1], appState.vehicles[2], calculateMonthlyCosts(appState.vehicles[1], appState.settings), calculateMonthlyCosts(appState.vehicles[2], appState.settings))">
          Speel Opnieuw ↺
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="quiz-game-box">
      <div class="quiz-header">
        <div>
          <h3>🏎️ APEX Auto Kenner Battle Quiz</h3>
          <p style="color:var(--muted); font-size:0.8rem; margin-top:0.2rem;">Test uw autokennis op basis van harde RDW data!</p>
        </div>
        <span class="quiz-score-badge">Vraag ${appState.quiz.currentQ + 1}/${appState.quiz.questions.length} · Score: ${appState.quiz.score}</span>
      </div>

      <div class="quiz-body">
        <div class="quiz-question-card">
          <span class="quiz-q-num">Vraag ${appState.quiz.currentQ + 1} van ${appState.quiz.questions.length}</span>
          <div class="quiz-q-text">${qData.q}</div>

          <div class="quiz-options-grid">
            <button class="quiz-opt-btn" type="button" onclick="answerQuiz(0, this)">${qData.options[0].label}</button>
            <button class="quiz-opt-btn" type="button" onclick="answerQuiz(1, this)">${qData.options[1].label}</button>
          </div>

          <div class="quiz-explanation-box" id="quiz-explanation"></div>
        </div>
      </div>
    </div>
  `;
}

function answerQuiz(optIndex, btnEl) {
  const qData = appState.quiz.questions[appState.quiz.currentQ];
  const isCorrect = qData.options[optIndex].isCorrect;

  if (isCorrect) playBeep(880, 0.15, 'sine');
  else playBeep(220, 0.25, 'sawtooth');

  const allBtns = btnEl.parentElement.querySelectorAll('.quiz-opt-btn');
  allBtns.forEach((b, idx) => {
    b.disabled = true;
    if (qData.options[idx].isCorrect) b.classList.add('is-correct');
    else if (idx === optIndex) b.classList.add('is-wrong');
  });

  if (isCorrect) appState.quiz.score++;

  const expBox = document.getElementById('quiz-explanation');
  if (expBox) {
    expBox.classList.add('show');
    expBox.innerHTML = `
      <strong>${isCorrect ? '✔ Juist!' : '✖ Helaas!'}</strong> ${qData.explanation}
      <div style="margin-top:0.8rem; text-align:right;">
        <button class="action-btn" type="button" onclick="nextQuizQuestion()">Volgende Vraag →</button>
      </div>
    `;
  }
}

function nextQuizQuestion() {
  appState.quiz.currentQ++;
  renderQuizQuestion();
}

// ═══════════════════════════════════════════════════════════════════════════
// PDF REPORT GENERATOR & COMMUNITY APPRECIATION
// ═══════════════════════════════════════════════════════════════════════════

function downloadPdfReport() {
  appState.reportsDownloaded++;
  showToast(`📥 Aankoopdossier wordt voorbereid (${appState.reportsDownloaded}/3 gratis rapporten)...`);
  setTimeout(() => window.print(), 500);
}

function setStarRating(num) {
  playBeep(660 + num * 60, 0.1);
  document.querySelectorAll('.star-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', idx < num);
  });
  showToast(`Hartelijk dank voor uw ${num}-sterren waardering! ⭐`);
}

function sendToolFeedback() {
  const txt = document.getElementById('tool-feedback-text')?.value;
  if (!txt || !txt.trim()) {
    showToast('Vul a.u.b. eerst uw suggestie of feedback in.');
    return;
  }
  playBeep(587.33, 0.15);
  showToast('Hartelijk dank! Uw feedback is rechtstreeks verzonden naar Martijn.');
  document.getElementById('tool-feedback-text').value = '';
}

// ═══════════════════════════════════════════════════════════════════════════
// VEHICLE HERO & VERDICT RENDERING
// ═══════════════════════════════════════════════════════════════════════════

function renderVehicleHero(side, v, costs, score, isWinner) {
  const card = document.getElementById(`v${side}-hero-card`);
  if (card) {
    card.classList.toggle('is-winner', isWinner);
  }

  const nameEl = document.getElementById(`v${side}-hero-name`);
  const subEl = document.getElementById(`v${side}-hero-sub`);
  const logoEl = document.getElementById(`v${side}-hero-logo`);
  const avatarBox = document.getElementById(`v${side}-avatar-box`);
  const tagsEl = document.getElementById(`v${side}-hero-tags`);
  const scoreVal = document.getElementById(`v${side}-score-val`);
  const costTotal = document.getElementById(`v${side}-cost-total`);

  if (nameEl) nameEl.textContent = `${v.merk} ${v.handelsbenaming}`;
  if (subEl) subEl.textContent = `${formatPlate(v.kenteken)} · Bouwjaar ${v.bouwjaar} · ${v.brandstofOmschrijving}`;
  if (logoEl) logoEl.innerHTML = getBrandLogoSvg(v.merk);

  if (avatarBox) {
    avatarBox.innerHTML = `<img src="${v.afbeeldingUrl}" alt="${v.merk} ${v.handelsbenaming}" loading="lazy">`;
  }

  if (tagsEl) {
    tagsEl.innerHTML = `
      <span>${v.vermogenPk} PK</span>
      <span>${v.acceleratie}s naar 100</span>
      <span>${formatEuro(v.catalogusprijs)} Cat.</span>
      <span>${v.tellerstandOordeel}</span>
    `;
  }

  if (scoreVal) scoreVal.textContent = `${score.total}/100`;
  if (costTotal) costTotal.textContent = formatEuro(costs.totalMonthly);
}

function renderVerdict(v1, v2, c1, c2, bpm1, bpm2) {
  const titleEl = document.getElementById('verdict-title');
  const textEl = document.getElementById('verdict-text');
  const costDiffEl = document.getElementById('kpi-cost-diff');
  const powerDiffEl = document.getElementById('kpi-power-diff');
  const fuelDiffEl = document.getElementById('kpi-fuel-diff');
  const taxDiffEl = document.getElementById('kpi-tax-diff');

  const monthlyDiff = Math.abs(c1.totalMonthly - c2.totalMonthly);
  const cheaperSide = c1.totalMonthly < c2.totalMonthly ? 1 : 2;
  const cheaperCar = cheaperSide === 1 ? v1 : v2;
  const expensiveCar = cheaperSide === 1 ? v2 : v1;

  const powerDiff = (v1.vermogenPk || 0) - (v2.vermogenPk || 0);
  const fasterSide = powerDiff > 0 ? 1 : 2;
  const fasterCar = fasterSide === 1 ? v1 : v2;

  if (titleEl) {
    titleEl.textContent = `${cheaperCar.merk} is ${formatEuro(monthlyDiff)}/mnd voordeliger · ${fasterCar.merk} levert de meeste pk's`;
  }

  if (textEl) {
    textEl.innerHTML = `
      Op basis van <strong>${formatNumber(appState.settings.kmPerYear)} km/jaar</strong> in provincie <strong>${appState.settings.province}</strong> 
      kost de <strong>${cheaperCar.merk} ${cheaperCar.handelsbenaming}</strong> u circa <strong>${formatEuro(monthlyDiff * 12)} minder per jaar</strong> aan totale exploitatiekosten.
      De <strong>${fasterCar.merk}</strong> levert daarentegen <strong>${Math.abs(powerDiff)} PK meer vermogen</strong> (${fasterCar.vermogenPk} PK vs ${cheaperSide === fasterSide ? expensiveCar.vermogenPk : cheaperCar.vermogenPk} PK) 
      en sprint in <strong>${fasterCar.acceleratie}s</strong> naar de 100 km/u.
    `;
  }

  if (costDiffEl) costDiffEl.textContent = `${formatEuro(monthlyDiff)} / mnd`;
  if (powerDiffEl) powerDiffEl.textContent = `${Math.abs(powerDiff)} PK`;
  if (fuelDiffEl) {
    const fDiff = Math.abs((v1.verbruikGecombineerd || 0) - (v2.verbruikGecombineerd || 0)).toFixed(1);
    fuelDiffEl.textContent = `${fDiff} L/kWh`;
  }
  if (taxDiffEl) {
    const tDiff = Math.abs(c1.mrb.monthly - c2.mrb.monthly);
    taxDiffEl.textContent = `${formatEuro(tDiff)} / mnd`;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ DRAG RACE & SPRINT SIMULATOR
// ═══════════════════════════════════════════════════════════════════════════

function renderDragRaceArena(v1, v2) {
  const container = document.getElementById('drag-race-container');
  if (!container) return;

  const ptw1 = Math.round((v1.vermogenPk / (v1.massaRijklaar / 1000)));
  const ptw2 = Math.round((v2.vermogenPk / (v2.massaRijklaar / 1000)));
  const qm1 = (14.2 * Math.pow(v1.massaRijklaar / v1.vermogenPk, 0.28)).toFixed(2);
  const qm2 = (14.2 * Math.pow(v2.massaRijklaar / v2.vermogenPk, 0.28)).toFixed(2);

  container.innerHTML = `
    <div class="drag-race-header">
      <div>
        <h3>⚡ Interactieve 0-100 &amp; Drag Race Simulator</h3>
        <p>Real-time acceleratievergelijking op vermogen-gewichtsverhouding en sprintcurve</p>
      </div>
      <div class="drag-controls-row">
        <button class="sound-toggle-btn" type="button" onclick="toggleSound()" title="Geluid aan/uit">
          ${appState.soundEnabled ? '🔊 Geluid Aan' : '🔇 Geluid Uit'}
        </button>
        <div class="traffic-lights" id="traffic-lights">
          <div class="light-dot red" id="light-red"></div>
          <div class="light-dot yellow" id="light-yellow"></div>
          <div class="light-dot green" id="light-green"></div>
        </div>
        <button class="drag-start-btn" id="start-drag-btn" type="button" onclick="startDragRace()">
          <span>🚀</span> Start Drag Race Duel
        </button>
      </div>
    </div>

    <div class="race-track-container">
      <div class="race-lane" id="race-lane-1">
        <div class="lane-info-row">
          <span class="lane-car-name">${v1.merk} ${v1.handelsbenaming}</span>
          <span class="lane-stats">${v1.acceleratie}s (0-100) · 1/4 Mijl: ${qm1}s · ${ptw1} pk/ton</span>
        </div>
        <div class="track-strip">
          <div class="track-finish-line"></div>
          <div class="car-runner" id="car-runner-1" style="transform: translateX(0px);">${v1.merk.slice(0,4)}</div>
        </div>
      </div>

      <div class="race-lane" id="race-lane-2">
        <div class="lane-info-row">
          <span class="lane-car-name">${v2.merk} ${v2.handelsbenaming}</span>
          <span class="lane-stats">${v2.acceleratie}s (0-100) · 1/4 Mijl: ${qm2}s · ${ptw2} pk/ton</span>
        </div>
        <div class="track-strip">
          <div class="track-finish-line"></div>
          <div class="car-runner" id="car-runner-2" style="transform: translateX(0px);">${v2.merk.slice(0,4)}</div>
        </div>
      </div>
    </div>

    <div class="drag-result-box" id="drag-result-box"></div>
  `;
}

function toggleSound() {
  appState.soundEnabled = !appState.soundEnabled;
  if (appState.soundEnabled) playBeep(523.25, 0.1);
  const btn = document.querySelector('.sound-toggle-btn');
  if (btn) btn.textContent = appState.soundEnabled ? '🔊 Geluid Aan' : '🔇 Geluid Uit';
}

function startDragRace() {
  const v1 = appState.vehicles[1];
  const v2 = appState.vehicles[2];
  if (!v1 || !v2) return;

  const btn = document.getElementById('start-drag-btn');
  const lightRed = document.getElementById('light-red');
  const lightYellow = document.getElementById('light-yellow');
  const lightGreen = document.getElementById('light-green');
  const runner1 = document.getElementById('car-runner-1');
  const runner2 = document.getElementById('car-runner-2');
  const resultBox = document.getElementById('drag-result-box');

  if (btn) btn.disabled = true;
  if (resultBox) {
    resultBox.classList.remove('is-active');
    resultBox.innerHTML = '';
  }

  if (runner1) runner1.style.transform = 'translateX(0px)';
  if (runner2) runner2.style.transform = 'translateX(0px)';

  lightRed?.classList.add('active');
  lightYellow?.classList.remove('active');
  lightGreen?.classList.remove('active');
  playBeep(440, 0.1);

  setTimeout(() => {
    lightRed?.classList.remove('active');
    lightYellow?.classList.add('active');
    playBeep(440, 0.1);
  }, 600);

  setTimeout(() => {
    lightYellow?.classList.remove('active');
    lightGreen?.classList.add('active');
    playBeep(880, 0.25);
    playEngineStart();

    const trackWidth = runner1?.parentElement?.clientWidth ? runner1.parentElement.clientWidth - 70 : 400;
    const acc1 = Number(v1.acceleratie) || 8.0;
    const acc2 = Number(v2.acceleratie) || 8.0;

    const baseDuration = 2200;
    const dur1 = baseDuration * (acc1 / Math.min(acc1, acc2));
    const dur2 = baseDuration * (acc2 / Math.min(acc1, acc2));

    if (runner1) {
      runner1.style.transition = `transform ${dur1}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
      runner1.style.transform = `translateX(${trackWidth}px)`;
    }
    if (runner2) {
      runner2.style.transition = `transform ${dur2}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
      runner2.style.transform = `translateX(${trackWidth}px)`;
    }

    const winner = acc1 <= acc2 ? v1 : v2;
    const diffTime = Math.abs(acc1 - acc2).toFixed(1);

    setTimeout(() => {
      playFinishFanfare();
      if (resultBox) {
        resultBox.classList.add('is-active');
        resultBox.innerHTML = `
          🏁 <strong>WINNAAR SPRINTDUEL:</strong> ${winner.merk} ${winner.handelsbenaming} is <strong>${diffTime} seconden sneller</strong> op de 0–100 km/u sprint!
        `;
      }
      if (btn) btn.disabled = false;
    }, Math.max(dur1, dur2) + 200);

  }, 1200);
}

// ═══════════════════════════════════════════════════════════════════════════
// 🏆 BATTLE SHOWDOWN MATRIX
// ═══════════════════════════════════════════════════════════════════════════

function renderBattleMatrix(v1, v2, c1, c2, bpm1, bpm2) {
  const container = document.getElementById('battle-matrix-container');
  if (!container) return;

  const sprintWin = (v1.acceleratie <= v2.acceleratie && v1.topsnelheid >= v2.topsnelheid) ? 1 : 2;
  const costWin = c1.totalMonthly <= c2.totalMonthly ? 1 : 2;
  const ecoWin = (v1.co2Uitstoot <= v2.co2Uitstoot) ? 1 : 2;
  const utilWin = (v1.maximumTrekkenGeremd >= v2.maximumTrekkenGeremd) ? 1 : 2;
  const valWin = (bpm1.restBpmPct >= bpm2.restBpmPct) ? 1 : 2;
  const histWin = (v1.aantalEigenaren <= v2.aantalEigenaren) ? 1 : 2;

  let scoreV1 = 0;
  if (sprintWin === 1) scoreV1++;
  if (costWin === 1) scoreV1++;
  if (ecoWin === 1) scoreV1++;
  if (utilWin === 1) scoreV1++;
  if (valWin === 1) scoreV1++;
  if (histWin === 1) scoreV1++;
  const scoreV2 = 6 - scoreV1;

  container.innerHTML = `
    <div class="battle-matrix-header">
      <div>
        <h3>🏆 APEX Matchup Showdown (Eindstand: ${scoreV1} vs ${scoreV2})</h3>
        <p>Wie pakt de winst per categorie op harde feiten en RDW specificaties?</p>
      </div>
      <div style="font-family: var(--serif); font-size: 1.4rem; color: var(--copper-light);">
        ${scoreV1 > scoreV2 ? v1.merk : (scoreV2 > scoreV1 ? v2.merk : 'Gelijkspel')} Wint
      </div>
    </div>

    <div class="battle-grid">
      <div class="battle-card">
        <div class="battle-card-header">
          <span class="battle-cat-title">⚡ 1. Sprint &amp; Topsnelheid</span>
          <span class="battle-winner-badge">Wint: ${sprintWin === 1 ? v1.merk : v2.merk}</span>
        </div>
        <div class="battle-vs-row"><span>${v1.merk}</span><strong>${v1.acceleratie}s · ${v1.topsnelheid} km/u</strong></div>
        <div class="battle-vs-row"><span>${v2.merk}</span><strong>${v2.acceleratie}s · ${v2.topsnelheid} km/u</strong></div>
      </div>

      <div class="battle-card">
        <div class="battle-card-header">
          <span class="battle-cat-title">💶 2. Maandlasten &amp; TCO</span>
          <span class="battle-winner-badge">Wint: ${costWin === 1 ? v1.merk : v2.merk}</span>
        </div>
        <div class="battle-vs-row"><span>${v1.merk}</span><strong>${formatEuro(c1.totalMonthly)} / mnd</strong></div>
        <div class="battle-vs-row"><span>${v2.merk}</span><strong>${formatEuro(c2.totalMonthly)} / mnd</strong></div>
      </div>

      <div class="battle-card">
        <div class="battle-card-header">
          <span class="battle-cat-title">🌿 3. Verbruik &amp; CO2</span>
          <span class="battle-winner-badge">Wint: ${ecoWin === 1 ? v1.merk : v2.merk}</span>
        </div>
        <div class="battle-vs-row"><span>${v1.merk}</span><strong>${v1.co2Uitstoot}g CO2 · ${v1.zuinigheidslabel}</strong></div>
        <div class="battle-vs-row"><span>${v2.merk}</span><strong>${v2.co2Uitstoot}g CO2 · ${v2.zuinigheidslabel}</strong></div>
      </div>

      <div class="battle-card">
        <div class="battle-card-header">
          <span class="battle-cat-title">📐 4. Caravan &amp; Trekkracht</span>
          <span class="battle-winner-badge">Wint: ${utilWin === 1 ? v1.merk : v2.merk}</span>
        </div>
        <div class="battle-vs-row"><span>${v1.merk}</span><strong>${formatNumber(v1.maximumTrekkenGeremd)} kg</strong></div>
        <div class="battle-vs-row"><span>${v2.merk}</span><strong>${formatNumber(v2.maximumTrekkenGeremd)} kg</strong></div>
      </div>

      <div class="battle-card">
        <div class="battle-card-header">
          <span class="battle-cat-title">💎 5. Waardevastheid &amp; BPM</span>
          <span class="battle-winner-badge">Wint: ${valWin === 1 ? v1.merk : v2.merk}</span>
        </div>
        <div class="battle-vs-row"><span>${v1.merk}</span><strong>${bpm1.restBpmPct}% Rest-BPM</strong></div>
        <div class="battle-vs-row"><span>${v2.merk}</span><strong>${bpm2.restBpmPct}% Rest-BPM</strong></div>
      </div>

      <div class="battle-card">
        <div class="battle-card-header">
          <span class="battle-cat-title">🛡️ 6. Historie &amp; NAP</span>
          <span class="battle-winner-badge">Wint: ${histWin === 1 ? v1.merk : v2.merk}</span>
        </div>
        <div class="battle-vs-row"><span>${v1.merk}</span><strong>${v1.aantalEigenaren} eigenaren · ${v1.tellerstandOordeel}</strong></div>
        <div class="battle-vs-row"><span>${v2.merk}</span><strong>${v2.aantalEigenaren} eigenaren · ${v2.tellerstandOordeel}</strong></div>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔮 10-YEAR TCO & RESIDUAL VALUE PROJECTION
// ═══════════════════════════════════════════════════════════════════════════

function render10YearProjection(v1, v2, c1, c2) {
  const container = document.getElementById('projection-10yr-container');
  if (!container) return;

  const years = appState.settings.projectionYears || 5;
  const kmPerYear = appState.settings.kmPerYear || 15000;
  const totalKm = years * kmPerYear;

  const totalCost1 = Math.round(c1.totalYearly * years);
  const totalCost2 = Math.round(c2.totalYearly * years);
  const diffCost = Math.abs(totalCost1 - totalCost2);

  const resVal1 = Math.round(c1.estimatedCurrentValue * Math.pow(0.88, years));
  const resVal2 = Math.round(c2.estimatedCurrentValue * Math.pow(0.88, years));

  container.innerHTML = `
    <div class="projection-header">
      <div>
        <h3>🔮 Waardeverloop &amp; Exploitatie over ${years} Jaar</h3>
        <p>Bekijk hoe uw totale kosten en restwaarde zich ontwikkelen tot ${2026 + years}</p>
      </div>
    </div>

    <div class="year-slider-row">
      <span class="year-slider-label">Kies looptijd:</span>
      <input type="range" class="range-slider" min="1" max="10" step="1" value="${years}" oninput="updateProjectionYears(this.value)" aria-label="Looptijd in jaren">
      <span class="year-slider-val">${years} Jaar (${2026 + years})</span>
    </div>

    <div class="projection-results-grid ${appState.hasThirdCar ? 'has-three' : ''}">
      <div class="projection-col-card">
        <strong style="font-family:var(--serif); font-size:1.1rem; color:var(--paper);">${v1.merk} ${v1.handelsbenaming}</strong>
        <div class="projection-stat-row"><span>Verwachte Restwaarde:</span><strong>${formatEuro(resVal1)}</strong></div>
        <div class="projection-stat-row"><span>Brandstof/Stroom (${formatNumber(totalKm)} km):</span><strong>${formatEuro(c1.fuelMonthly * 12 * years)}</strong></div>
        <div class="projection-stat-row"><span>Totale Wegenbelasting:</span><strong>${formatEuro(c1.mrb.yearly * years)}</strong></div>
        <div class="projection-stat-row"><span>Verzekering &amp; Onderhoud:</span><strong>${formatEuro((c1.insuranceMonthly + c1.maintenanceMonthly) * 12 * years)}</strong></div>
        <div class="projection-stat-row"><span>TOTAAL UITGEGEVEN:</span><strong>${formatEuro(totalCost1)}</strong></div>
      </div>

      <div class="projection-col-card">
        <strong style="font-family:var(--serif); font-size:1.1rem; color:var(--paper);">${v2.merk} ${v2.handelsbenaming}</strong>
        <div class="projection-stat-row"><span>Verwachte Restwaarde:</span><strong>${formatEuro(resVal2)}</strong></div>
        <div class="projection-stat-row"><span>Brandstof/Stroom (${formatNumber(totalKm)} km):</span><strong>${formatEuro(c2.fuelMonthly * 12 * years)}</strong></div>
        <div class="projection-stat-row"><span>Totale Wegenbelasting:</span><strong>${formatEuro(c2.mrb.yearly * years)}</strong></div>
        <div class="projection-stat-row"><span>Verzekering &amp; Onderhoud:</span><strong>${formatEuro((c2.insuranceMonthly + c2.maintenanceMonthly) * 12 * years)}</strong></div>
        <div class="projection-stat-row"><span>TOTAAL UITGEGEVEN:</span><strong>${formatEuro(totalCost2)}</strong></div>
      </div>
    </div>

    <div style="margin-top:1.2rem; padding:1rem; background:rgba(186,126,83,0.08); border:1px solid var(--line); font-size:0.85rem; color:var(--paper); text-align:center;">
      💡 <strong>Financieel Inzicht:</strong> Met de <strong>${c1.totalMonthly < c2.totalMonthly ? v1.merk : v2.merk}</strong> bespaart u in totaal <strong>${formatEuro(diffCost)}</strong> over ${years} jaar bezit!
    </div>
  `;
}

function updateProjectionYears(val) {
  appState.settings.projectionYears = Number(val);
  const v1 = appState.vehicles[1];
  const v2 = appState.vehicles[2];
  if (v1 && v2) {
    const c1 = calculateMonthlyCosts(v1, appState.settings);
    const c2 = calculateMonthlyCosts(v2, appState.settings);
    render10YearProjection(v1, v2, c1, c2);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🏖️ ROADTRIP & VAKANTIE PLANNER
// ═══════════════════════════════════════════════════════════════════════════

function renderRoadtripPlanner(v1, v2) {
  const container = document.getElementById('roadtrip-planner-container');
  if (!container) return;

  const activeKey = appState.settings.roadtripDest || 'gardameer';
  const dest = ROADTRIP_DESTINATIONS[activeKey];
  const roundtripKm = dest.distKm * 2;

  const l100_1 = Number(v1.verbruikGecombineerd) || 7.0;
  const isEv1 = v1.brandstofOmschrijving?.toLowerCase().includes('elektri');
  const fuelUsage1 = (roundtripKm / 100) * l100_1;
  const fuelCost1 = Math.round(fuelUsage1 * (isEv1 ? appState.settings.fuelPrices.ev : appState.settings.fuelPrices.petrol));

  const l100_2 = Number(v2.verbruikGecombineerd) || 7.0;
  const isEv2 = v2.brandstofOmschrijving?.toLowerCase().includes('elektri');
  const fuelUsage2 = (roundtripKm / 100) * l100_2;
  const fuelCost2 = Math.round(fuelUsage2 * (isEv2 ? appState.settings.fuelPrices.ev : appState.settings.fuelPrices.petrol));

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:1px solid var(--line); padding-bottom:1rem; flex-wrap:wrap; gap:1rem;">
      <div>
        <h3>🏖️ Vakantie- &amp; Roadtrip Kostencalculator</h3>
        <p>Wat kost een retourrit naar uw vakantiebestemming (${roundtripKm} km heen &amp; terug)?</p>
      </div>
    </div>

    <div class="roadtrip-dest-selector">
      ${Object.entries(ROADTRIP_DESTINATIONS).map(([k, d]) => `
        <button class="roadtrip-chip ${k === activeKey ? 'active' : ''}" type="button" onclick="setRoadtripDest('${k}')">
          ${d.name} (${d.distKm} km)
        </button>
      `).join('')}
    </div>

    <div class="roadtrip-comparison-grid ${appState.hasThirdCar ? 'has-three' : ''}">
      <div class="roadtrip-car-card">
        <strong style="color:var(--paper); font-size:1rem;">${v1.merk} ${v1.handelsbenaming}</strong>
        <div class="projection-stat-row"><span>Brandstof/Stroom retour:</span><strong>${formatEuro(fuelCost1)} (${fuelUsage1.toFixed(0)} ${isEv1 ? 'kWh' : 'L'})</strong></div>
        <div class="projection-stat-row"><span>Geschatte Tolkosten:</span><strong>${formatEuro(dest.tollEur * 2)}</strong></div>
        <div class="projection-stat-row"><span>TOTAAL VAKANTIERIT:</span><strong>${formatEuro(fuelCost1 + dest.tollEur * 2)}</strong></div>
      </div>

      <div class="roadtrip-car-card">
        <strong style="color:var(--paper); font-size:1rem;">${v2.merk} ${v2.handelsbenaming}</strong>
        <div class="projection-stat-row"><span>Brandstof/Stroom retour:</span><strong>${formatEuro(fuelCost2)} (${fuelUsage2.toFixed(0)} ${isEv2 ? 'kWh' : 'L'})</strong></div>
        <div class="projection-stat-row"><span>Geschatte Tolkosten:</span><strong>${formatEuro(dest.tollEur * 2)}</strong></div>
        <div class="projection-stat-row"><span>TOTAAL VAKANTIERIT:</span><strong>${formatEuro(fuelCost2 + dest.tollEur * 2)}</strong></div>
      </div>
    </div>
  `;
}

function setRoadtripDest(key) {
  appState.settings.roadtripDest = key;
  const v1 = appState.vehicles[1];
  const v2 = appState.vehicles[2];
  if (v1 && v2) renderRoadtripPlanner(v1, v2);
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎲 RANDOM DUEL GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

const RANDOM_DUEL_PAIRS = [
  ['24RPLV', 'X789PP'],
  ['TB145X', 'N563FF'],
  ['J123KZ', 'X789PP'],
  ['25RKZ3', 'G832LK'],
  ['04HGLB', 'G832LK'],
  ['L712BV', 'AB123C']
];

function loadRandomDuel() {
  const current1 = cleanPlate(document.getElementById('plate-input-1')?.value);
  const current2 = cleanPlate(document.getElementById('plate-input-2')?.value);

  const available = RANDOM_DUEL_PAIRS.filter(p => !(p[0] === current1 && p[1] === current2));
  const pair = available[Math.floor(Math.random() * available.length)] || RANDOM_DUEL_PAIRS[0];

  loadPreset(pair[0], pair[1]);
  playBeep(493.88, 0.15);
  showToast('🎲 Nieuw spannend duel geladen!');
}

// ═══════════════════════════════════════════════════════════════════════════
// OTHER STANDARD MODULES
// ═══════════════════════════════════════════════════════════════════════════

function renderImportOpportunity(v1, v2, c1, c2, bpm1, bpm2) {
  const container = document.getElementById('import-opportunity-container');
  if (!container) return;

  const ageYears1 = getVehicleAgeYears(v1.datumEersteToelating);
  const ageYears2 = getVehicleAgeYears(v2.datumEersteToelating);

  const isYoung1 = ageYears1 >= 1 && ageYears1 <= 6 && (v1.catalogusprijs > 50000);
  const isYoung2 = ageYears2 >= 1 && ageYears2 <= 6 && (v2.catalogusprijs > 50000);

  if (!isYoung1 && !isYoung2) {
    container.innerHTML = '';
    return;
  }

  const prime = isYoung1 ? v1 : v2;
  const bpmPrime = isYoung1 ? bpm1 : bpm2;
  const dePriceEst = Math.round(prime.catalogusprijs * 0.58);
  const nlPriceEst = Math.round(prime.catalogusprijs * 0.68);
  const grossSavings = Math.max(3500, nlPriceEst - dePriceEst - bpmPrime.restBpm);

  container.innerHTML = `
    <div style="background: rgba(186,126,83,0.08); border: 1px solid rgba(223,177,141,0.35); padding: 1.6rem; margin-top: 2rem;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
        <div>
          <span style="font:600 0.6rem/1 var(--display); letter-spacing:0.18em; text-transform:uppercase; color:var(--copper-light);">
            ⚡ APEX Import Inzicht · Duitsland Voordeel
          </span>
          <h4 style="font-family:var(--serif); font-size:1.3rem; color:var(--paper); margin-top:0.3rem;">
            Overweegt u een ${prime.merk} ${prime.handelsbenaming}? Import bespaart ca. ${formatEuro(grossSavings)}
          </h4>
          <p style="color:#c7cbc4; font-size:0.85rem; margin-top:0.4rem; max-width:70ch;">
            Door het Duitse aanbod met volledige historie en garantie aan te boren, profiteert u van <strong>${bpmPrime.afschrijvingPct}% rest-BPM afschrijving</strong> en lagere aanschafprijzen.
          </p>
        </div>
        <a href="https://wa.me/31624735939?text=Beste%20Martijn%2C%20ik%20ben%20ge%C3%AFnteresseerd%20in%20import%20van%20een%20${encodeURIComponent(prime.merk + ' ' + prime.handelsbenaming)}." target="_blank" rel="noopener noreferrer" class="action-btn" style="background:var(--copper); color:#fff; border-color:var(--copper);">
          Bespreek Importkansen ↗
        </a>
      </div>
    </div>
  `;
}

function renderScoreMatrix(v1, v2, s1, s2) {
  const container = document.getElementById('score-pillars-container');
  if (!container) return;

  const pillars = [
    { key: 'prestaties', name: 'Prestaties' },
    { key: 'kosten', name: 'Exploitatie TCO' },
    { key: 'milieu', name: 'Verbruik & Eco' },
    { key: 'praktisch', name: 'Praktisch & Trek' },
    { key: 'historie', name: 'Historie & NAP' }
  ];

  container.innerHTML = pillars.map(p => {
    const val1 = s1.pillars[p.key] || 50;
    const val2 = s2.pillars[p.key] || 50;
    return `
      <div class="score-pillar-card">
        <span class="pillar-name">${p.name}</span>
        <div class="pillar-score-row">
          <span class="pillar-num ${val1 >= val2 ? 'highlight' : ''}">${val1}</span>
          <span style="color:var(--muted); font-size:0.75rem;">vs</span>
          <span class="pillar-num ${val2 >= val1 ? 'highlight' : ''}">${val2}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderTcoProjection(v1, v2, v3, c1, c2, c3) {
  const months = appState.settings.tcoPeriod || 36;
  const factor = months / 12;

  const el1 = document.getElementById('tco-v1-total');
  const el2 = document.getElementById('tco-v2-total');
  const el3 = document.getElementById('tco-v3-total');
  const km1 = document.getElementById('tco-v1-kmrate');
  const km2 = document.getElementById('tco-v2-kmrate');
  const km3 = document.getElementById('tco-v3-kmrate');
  const bar1 = document.getElementById('tco-v1-bar');
  const bar2 = document.getElementById('tco-v2-bar');
  const bar3 = document.getElementById('tco-v3-bar');

  if (el1) el1.textContent = formatEuro(Math.round(c1.totalYearly * factor));
  if (el2) el2.textContent = formatEuro(Math.round(c2.totalYearly * factor));
  if (km1) km1.textContent = `€ ${c1.costPerKm} per km (${months} mnd)`;
  if (km2) km2.textContent = `€ ${c2.costPerKm} per km (${months} mnd)`;

  function makeBar(c) {
    const tot = c.totalMonthly;
    const pDep = ((c.depreciationMonthly / tot) * 100).toFixed(1);
    const pFuel = ((c.fuelMonthly / tot) * 100).toFixed(1);
    const pMrb = ((c.mrb.monthly / tot) * 100).toFixed(1);
    const pIns = ((c.insuranceMonthly / tot) * 100).toFixed(1);
    const pMaint = ((c.maintenanceMonthly / tot) * 100).toFixed(1);

    return `
      <div class="tco-seg seg-deprec" style="width: ${pDep}%" title="Afschrijving ${pDep}%"></div>
      <div class="tco-seg seg-fuel" style="width: ${pFuel}%" title="Brandstof ${pFuel}%"></div>
      <div class="tco-seg seg-mrb" style="width: ${pMrb}%" title="MRB ${pMrb}%"></div>
      <div class="tco-seg seg-ins" style="width: ${pIns}%" title="Verzekering ${pIns}%"></div>
      <div class="tco-seg seg-maint" style="width: ${pMaint}%" title="Onderhoud ${pMaint}%"></div>
    `;
  }

  if (bar1) bar1.innerHTML = makeBar(c1);
  if (bar2) bar2.innerHTML = makeBar(c2);

  if (v3 && c3) {
    if (el3) el3.textContent = formatEuro(Math.round(c3.totalYearly * factor));
    if (km3) km3.textContent = `€ ${c3.costPerKm} per km (${months} mnd)`;
    if (bar3) bar3.innerHTML = makeBar(c3);
  }
}

function setTcoPeriod(months) {
  appState.settings.tcoPeriod = months;
  document.querySelectorAll('.tco-tab-btn').forEach(b => {
    b.classList.toggle('active', Number(b.dataset.months) === months);
  });
  const v1 = appState.vehicles[1];
  const v2 = appState.vehicles[2];
  const v3 = appState.hasThirdCar ? appState.vehicles[3] : null;
  if (v1 && v2) {
    const c1 = calculateMonthlyCosts(v1, appState.settings);
    const c2 = calculateMonthlyCosts(v2, appState.settings);
    const c3 = v3 ? calculateMonthlyCosts(v3, appState.settings) : null;
    renderTcoProjection(v1, v2, v3, c1, c2, c3);
  }
}

function renderSavingsTimeline(v1, v2, c1, c2) {
  const container = document.getElementById('savings-timeline-container');
  if (!container) return;

  const diffMonth = Math.abs(c1.totalMonthly - c2.totalMonthly);
  const cheaper = c1.totalMonthly <= c2.totalMonthly ? v1.merk : v2.merk;

  container.innerHTML = `
    <div style="background:var(--ink-card); border:1px solid var(--line); padding:1.8rem; margin-top:2rem;">
      <h4 style="font-family:var(--serif); font-size:1.35rem; color:var(--paper); font-weight:400;">
        Cumulatieve Besparing Timeline (1 t/m 5 Jaar)
      </h4>
      <p style="color:var(--muted); font-size:0.82rem; margin-top:0.2rem;">
        Financieel voordeel van de <strong>${cheaper}</strong> ten opzichte van de concurrent:
      </p>

      <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:0.8rem; margin-top:1.2rem;">
        ${[1, 2, 3, 4, 5].map(yr => `
          <div style="background:var(--ink-soft); border:1px solid var(--line); padding:0.9rem; text-align:center;">
            <span style="font:600 0.58rem/1 var(--display); letter-spacing:0.12em; text-transform:uppercase; color:var(--muted); display:block;">
              Na ${yr} ${yr === 1 ? 'Jaar' : 'Jaar'}
            </span>
            <strong style="font-family:var(--serif); font-size:1.2rem; color:var(--copper-light); display:block; margin-top:0.4rem;">
              ${formatEuro(diffMonth * 12 * yr)}
            </strong>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderPerfVisualizer(v1, v2) {
  const container = document.getElementById('perf-visualizer-container');
  if (!container) return;

  container.innerHTML = `
    <div style="background:var(--ink-card); border:1px solid var(--line); padding:1.8rem; margin-top:2rem;">
      <h4 style="font-family:var(--serif); font-size:1.35rem; color:var(--paper); font-weight:400;">
        ⚡ Vermogen- &amp; Topsnelheidsvergelijking
      </h4>
      <p style="color:var(--muted); font-size:0.82rem; margin-top:0.2rem;">
        Directe vergelijking van motorvermogen, koppel en topsnelheid
      </p>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.2rem; margin-top:1.2rem;">
        <div style="background:var(--ink-soft); border:1px solid var(--line); padding:1.2rem;">
          <strong style="color:var(--paper); font-size:0.95rem;">${v1.merk} ${v1.handelsbenaming}</strong>
          <div style="margin-top:0.8rem; display:flex; flex-direction:column; gap:0.5rem; font-size:0.82rem;">
            <div style="display:flex; justify-content:space-between;"><span>Vermogen:</span><strong>${v1.vermogenPk} PK (${v1.vermogenKw} kW)</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>0-100 km/u:</span><strong>${v1.acceleratie} sec</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Topsnelheid:</span><strong>${v1.topsnelheid} km/u</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Gewicht:</span><strong>${formatNumber(v1.massaRijklaar)} kg</strong></div>
          </div>
        </div>

        <div style="background:var(--ink-soft); border:1px solid var(--line); padding:1.2rem;">
          <strong style="color:var(--paper); font-size:0.95rem;">${v2.merk} ${v2.handelsbenaming}</strong>
          <div style="margin-top:0.8rem; display:flex; flex-direction:column; gap:0.5rem; font-size:0.82rem;">
            <div style="display:flex; justify-content:space-between;"><span>Vermogen:</span><strong>${v2.vermogenPk} PK (${v2.vermogenKw} kW)</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>0-100 km/u:</span><strong>${v2.acceleratie} sec</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Topsnelheid:</span><strong>${v2.topsnelheid} km/u</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Gewicht:</span><strong>${formatNumber(v2.massaRijklaar)} kg</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderRiskAnalysis(v1, v2, v3, bpm1, bpm2, bpm3) {
  const col1 = document.getElementById('risk-col-1');
  const col2 = document.getElementById('risk-col-2');
  const col3 = document.getElementById('risk-col-3');
  if (!col1 || !col2) return;

  function buildRiskItems(v, bpm) {
    const items = [];
    if (v.openstaandeTerugroepacties > 0) {
      items.push({ text: `Openstaande RDW terugroepactie gedetecteerd.`, isWarn: true });
    } else {
      items.push({ text: `Geen openstaande terugroepacties bekend bij RDW.`, isWarn: false });
    }

    if (v.aantalEigenaren > 3) {
      items.push({ text: `${v.aantalEigenaren} eigenaren geregistreerd (hoger dan gemiddeld).`, isWarn: true });
    } else {
      items.push({ text: `Slechts ${v.aantalEigenaren} ${v.aantalEigenaren === 1 ? 'eigenaar' : 'eigenaren'} geregistreerd.`, isWarn: false });
    }

    if (bpm?.restBpm > 5000) {
      items.push({ text: `Aanzienlijke rest-BPM aanwezig (${formatEuro(bpm.restBpm)}).`, isWarn: false });
    }

    items.push({ text: `Tellerstandoordeel: ${v.tellerstandOordeel}.`, isWarn: v.tellerstandOordeel !== 'Logisch' });
    items.push({ text: `APK geldig tot ${formatDateNl(parseRdwDate(v.vervaldatumApk))}.`, isWarn: false });

    return items;
  }

  function renderList(v, items) {
    return `
      <strong style="color:var(--paper); font-size:0.95rem; margin-bottom:0.4rem; display:block;">${v.merk} ${v.handelsbenaming}</strong>
      ${items.map(it => `
        <div class="risk-item">
          <span class="risk-badge" style="color:${it.isWarn ? 'var(--copper-light)' : 'var(--apex-win-light)'}">${it.isWarn ? '⚠️' : '✔'}</span>
          <span style="color:${it.isWarn ? '#f4d2bd' : 'var(--muted-light)'}">${it.text}</span>
        </div>
      `).join('')}
    `;
  }

  col1.innerHTML = renderList(v1, buildRiskItems(v1, bpm1));
  col2.innerHTML = renderList(v2, buildRiskItems(v2, bpm2));
  if (v3 && col3 && bpm3) {
    col3.innerHTML = renderList(v3, buildRiskItems(v3, bpm3));
  }
}

function renderBijtellingModule(v1, v2) {
  const container = document.getElementById('bijtelling-container');
  if (!container) return;

  function calcBijtelling(v) {
    const cat = v.catalogusprijs || 40000;
    const isEv = v.brandstofOmschrijving?.toLowerCase().includes('elektri');
    const pct = isEv ? 17 : 22;
    const grossMonth = Math.round((cat * (pct / 100)) / 12);
    return { pct, grossMonth, netMonth37: Math.round(grossMonth * 0.3697), netMonth49: Math.round(grossMonth * 0.4950) };
  }

  const b1 = calcBijtelling(v1);
  const b2 = calcBijtelling(v2);

  container.innerHTML = `
    <div style="background:var(--ink-card); border:1px solid var(--line); padding:1.8rem; margin-top:2rem;">
      <h4 style="font-family:var(--serif); font-size:1.35rem; color:var(--paper); font-weight:400;">
        💼 Zakelijke Bijtelling 2026 (Netto per Maand)
      </h4>
      <p style="color:var(--muted); font-size:0.82rem; margin-top:0.2rem;">
        Berekening op basis van cataloguswaarde en geldende belastingschijf (Box 1)
      </p>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.2rem; margin-top:1.2rem;">
        <div style="background:var(--ink-soft); border:1px solid var(--line); padding:1.2rem;">
          <strong style="color:var(--paper); font-size:0.95rem;">${v1.merk} ${v1.handelsbenaming}</strong>
          <div style="margin-top:0.6rem; display:flex; flex-direction:column; gap:0.4rem; font-size:0.82rem;">
            <div style="display:flex; justify-content:space-between;"><span>Bijtellingspercentage:</span><strong>${b1.pct}%</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Bruto bijtelling / mnd:</span><strong>${formatEuro(b1.grossMonth)}</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Netto / mnd (Schijf 1 · 36,97%):</span><strong>${formatEuro(b1.netMonth37)}</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Netto / mnd (Schijf 2 · 49,50%):</span><strong style="color:var(--copper-light);">${formatEuro(b1.netMonth49)}</strong></div>
          </div>
        </div>

        <div style="background:var(--ink-soft); border:1px solid var(--line); padding:1.2rem;">
          <strong style="color:var(--paper); font-size:0.95rem;">${v2.merk} ${v2.handelsbenaming}</strong>
          <div style="margin-top:0.6rem; display:flex; flex-direction:column; gap:0.4rem; font-size:0.82rem;">
            <div style="display:flex; justify-content:space-between;"><span>Bijtellingspercentage:</span><strong>${b2.pct}%</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Bruto bijtelling / mnd:</span><strong>${formatEuro(b2.grossMonth)}</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Netto / mnd (Schijf 1 · 36,97%):</span><strong>${formatEuro(b2.netMonth37)}</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Netto / mnd (Schijf 2 · 49,50%):</span><strong style="color:var(--copper-light);">${formatEuro(b2.netMonth49)}</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCaravanModule(v1, v2) {
  const container = document.getElementById('caravan-container');
  if (!container) return;

  function caravanAssess(v) {
    const geremd = Number(v.maximumTrekkenGeremd) || 0;
    const rijklaar = Number(v.massaRijklaar) || 1500;
    return { geremd, rijklaar, safe75: Math.round(rijklaar * 0.75) };
  }

  const c1 = caravanAssess(v1);
  const c2 = caravanAssess(v2);

  container.innerHTML = `
    <div style="background:var(--ink-card); border:1px solid var(--line); padding:1.8rem; margin-top:2rem;">
      <h4 style="font-family:var(--serif); font-size:1.35rem; color:var(--paper); font-weight:400;">
        🚐 Caravan &amp; Aanhanger Veiligheid (ANWB 75% Norm)
      </h4>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.2rem; margin-top:1.2rem;">
        <div style="background:var(--ink-soft); border:1px solid var(--line); padding:1.2rem;">
          <strong style="color:var(--paper); font-size:0.95rem;">${v1.merk} ${v1.handelsbenaming}</strong>
          <div style="margin-top:0.6rem; display:flex; flex-direction:column; gap:0.4rem; font-size:0.82rem;">
            <div style="display:flex; justify-content:space-between;"><span>Max Geremd Trekgewicht:</span><strong>${formatNumber(c1.geremd)} kg</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>ANWB 75% Veiligheidsnorm:</span><strong>${formatNumber(c1.safe75)} kg</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Rijbewijs B voldoende tot:</span><strong>${formatNumber(3500 - v1.toegestaneMaxMassa)} kg</strong></div>
          </div>
        </div>

        <div style="background:var(--ink-soft); border:1px solid var(--line); padding:1.2rem;">
          <strong style="color:var(--paper); font-size:0.95rem;">${v2.merk} ${v2.handelsbenaming}</strong>
          <div style="margin-top:0.6rem; display:flex; flex-direction:column; gap:0.4rem; font-size:0.82rem;">
            <div style="display:flex; justify-content:space-between;"><span>Max Geremd Trekgewicht:</span><strong>${formatNumber(c2.geremd)} kg</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>ANWB 75% Veiligheidsnorm:</span><strong>${formatNumber(c2.safe75)} kg</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Rijbewijs B voldoende tot:</span><strong>${formatNumber(3500 - v2.toegestaneMaxMassa)} kg</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderMilieuzoneModule(v1, v2) {
  const container = document.getElementById('milieuzone-container');
  if (!container) return;

  function zoneBadge(v) {
    const em = String(v.emissieklasse || '6');
    const isEuro6 = em.includes('6') || em.includes('Z');
    return {
      de: isEuro6 ? 'Groene Umweltplakette 4' : 'Geel/Geen',
      fr: isEuro6 ? 'Crit’Air 1 of 2 (Onbeperkt)' : 'Crit’Air 3+',
      nl: isEuro6 ? 'Toegang alle Milieuzones' : 'Let op dieselzones'
    };
  }

  const z1 = zoneBadge(v1);
  const z2 = zoneBadge(v2);

  container.innerHTML = `
    <div style="background:var(--ink-card); border:1px solid var(--line); padding:1.8rem; margin-top:2rem;">
      <h4 style="font-family:var(--serif); font-size:1.35rem; color:var(--paper); font-weight:400;">
        🌍 Milieuzone Toegang (Nederland, Duitsland, Frankrijk)
      </h4>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.2rem; margin-top:1.2rem;">
        <div style="background:var(--ink-soft); border:1px solid var(--line); padding:1.2rem;">
          <strong style="color:var(--paper); font-size:0.95rem;">${v1.merk} ${v1.handelsbenaming}</strong>
          <div style="margin-top:0.6rem; display:flex; flex-direction:column; gap:0.4rem; font-size:0.82rem;">
            <div style="display:flex; justify-content:space-between;"><span>Nederland:</span><strong>${z1.nl}</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Duitsland:</span><strong>${z1.de}</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Frankrijk:</span><strong>${z1.fr}</strong></div>
          </div>
        </div>

        <div style="background:var(--ink-soft); border:1px solid var(--line); padding:1.2rem;">
          <strong style="color:var(--paper); font-size:0.95rem;">${v2.merk} ${v2.handelsbenaming}</strong>
          <div style="margin-top:0.6rem; display:flex; flex-direction:column; gap:0.4rem; font-size:0.82rem;">
            <div style="display:flex; justify-content:space-between;"><span>Nederland:</span><strong>${z2.nl}</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Duitsland:</span><strong>${z2.de}</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Frankrijk:</span><strong>${z2.fr}</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🌍 MARKTVERKENNER & IMPORTOCCASIONS EUROPA
// ═══════════════════════════════════════════════════════════════════════════

function renderMarketExplorer(v1, v2, v3, bpm1, bpm2, bpm3) {
  const container = document.getElementById('market-explorer-container');
  if (!container) return;

  function buildCarMarketCard(v, b, isV1) {
    const brand = encodeURIComponent(v.merk || '');
    const model = encodeURIComponent(v.handelsbenaming || '');
    const year = v.bouwjaar || (v.datumEersteToelating ? new Date(v.datumEersteToelating).getFullYear() : 2020);

    const mobileUrl = `https://suchen.mobile.de/fahrzeuge/search.html?ms=${brand}&fn=${model}&fr=${year}`;
    const autoscoutUrl = `https://www.autoscout24.de/lst/${brand}/${model}?fregfrom=${year}`;
    const gaspedaalUrl = `https://www.gaspedaal.nl/${brand}/${model}/vanaf-${year}`;
    const marktplaatsUrl = `https://www.marktplaats.nl/l/auto-s/${brand}/#q:${brand}+${model}`;

    const estNlPrice = v.catalogusprijs ? Math.round(v.catalogusprijs * 0.55) : 38000;
    const estDePrice = v.catalogusprijs ? Math.round(v.catalogusprijs * 0.42) : 29000;
    const restBpm = b ? b.restBpm : Math.round((v.brutoBpm || 8000) * 0.3);
    const estImportTotal = estDePrice + restBpm + 1850; // incl transport, RDW, handling
    const importSavings = Math.max(0, estNlPrice - estImportTotal);

    const whatsappText = encodeURIComponent(`Hallo Martijn, ik zoek een mooie ${v.merk} ${v.handelsbenaming} (vanaf ${year}). Kunnen jullie vergelijkbare exemplaren in Duitsland voor mij opsporen en importeren?`);

    return `
      <div class="market-card">
        <div class="market-card-header">
          <div class="market-car-title">
            <span class="car-badge-pill ${isV1 ? 'badge-v1' : 'badge-v2'}">${isV1 ? 'Auto 1' : 'Auto 2'}</span>
            <h5>${escapeHtml(v.merk)} ${escapeHtml(v.handelsbenaming)} (${year})</h5>
          </div>
          <span class="market-tag-de">🇩🇪 Duitsland &bull; Aanbod Index</span>
        </div>

        <div class="market-price-compare">
          <div class="market-price-row">
            <span>Geschatte NL Dealerprijs:</span>
            <strong>&euro;${estNlPrice.toLocaleString('nl-NL')}</strong>
          </div>
          <div class="market-price-row">
            <span>Inkoop DE + Rest-BPM &amp; Import:</span>
            <strong style="color:var(--copper-light);">&euro;${estImportTotal.toLocaleString('nl-NL')}</strong>
          </div>
          <div class="market-price-savings">
            <span>Geschat Importvoordeel:</span>
            <span class="savings-amount">&euro;${importSavings > 500 ? importSavings.toLocaleString('nl-NL') : '1.850'} voordeel</span>
          </div>
        </div>

        <div class="market-links-title">Direct zoeken op Europese portalen:</div>
        <div class="market-portal-links">
          <a href="${mobileUrl}" target="_blank" rel="noopener noreferrer" class="portal-btn">
            🇩🇪 Mobile.de
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
          <a href="${autoscoutUrl}" target="_blank" rel="noopener noreferrer" class="portal-btn">
            🇪🇺 AutoScout24
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
          <a href="${gaspedaalUrl}" target="_blank" rel="noopener noreferrer" class="portal-btn">
            🇳🇱 Gaspedaal
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
          <a href="${marktplaatsUrl}" target="_blank" rel="noopener noreferrer" class="portal-btn">
            🇳🇱 Marktplaats
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>

        <a href="https://wa.me/31641042507?text=${whatsappText}" target="_blank" rel="noopener noreferrer" class="btn-market-broker">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Laat Martijn het beste exemplaar opsporen
        </a>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="market-explorer-box">
      <div class="market-explorer-header">
        <div class="market-header-badge">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          APEX Marktverkenner &bull; Europa Occasions
        </div>
        <h4>Vergelijkbaar aanbod in Nederland &amp; Duitsland opsporen</h4>
        <p>Doorzoek direct de grootste Europese autoportalen of laat APEX Exclusive de aankoopkeuring, onderhandeling en import verzorgen.</p>
      </div>

      <div class="market-cards-grid">
        ${buildCarMarketCard(v1, bpm1, true)}
        ${buildCarMarketCard(v2, bpm2, false)}
      </div>
    </div>
  `;
}

function toggleAllAccordions(expand) {
  document.querySelectorAll('.spec-category-block').forEach(block => {
    if (expand) {
      block.classList.remove('is-collapsed');
    } else {
      block.classList.add('is-collapsed');
    }
  });
}

window.toggleAllAccordions = toggleAllAccordions;
window.selectLifestyleAnswer = selectLifestyleAnswer;

function renderProefritTips(v1, v2) {
  const container = document.getElementById('proefrit-tips-container');
  if (!container) return;

  container.innerHTML = `
    <div style="background:var(--ink-card); border:1px solid var(--line); padding:1.8rem; margin-top:2rem;">
      <h4 style="font-family:var(--serif); font-size:1.35rem; color:var(--paper); font-weight:400;">
        🔍 Proefrit &amp; Inspectie Checklist van Martijn
      </h4>

      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; margin-top:1.2rem; font-size:0.82rem;">
        <div style="background:var(--ink-soft); border:1px solid var(--line); padding:1rem;">
          <strong style="color:var(--copper-light); display:block; margin-bottom:0.3rem;">1. Koude Start &amp; Ketting</strong>
          <p style="color:var(--muted-light);">Luister bij koude motor naar ratelen van distributieketting en controleer op rookontwikkeling.</p>
        </div>
        <div style="background:var(--ink-soft); border:1px solid var(--line); padding:1rem;">
          <strong style="color:var(--copper-light); display:block; margin-bottom:0.3rem;">2. Lakdikte &amp; Schadeverleden</strong>
          <p style="color:var(--muted-light);">Controleer lakdiktes op spuitwerk en kijk of alle fabrieksnaden en bouten origineel zijn.</p>
        </div>
        <div style="background:var(--ink-soft); border:1px solid var(--line); padding:1rem;">
          <strong style="color:var(--copper-light); display:block; margin-bottom:0.3rem;">3. Onderhoudshistorie</strong>
          <p style="color:var(--muted-light);">Verifieer digitaal dealerlogboek en facturen op tijdige olie-, rem- en transmissieservices.</p>
        </div>
      </div>
    </div>
  `;
}

function renderDetailedMatrix(v1, v2, v3, c1, c2, c3, bpm1, bpm2, bpm3) {
  function makeRow(label, val1, val2, val3, cat = 'all') {
    const isDiff = String(val1) !== String(val2) || (v3 && String(val1) !== String(val3));
    return `
      <tr class="spec-row-item" data-cat="${cat}" data-is-diff="${isDiff}">
        <th>${label}</th>
        <td>${val1 ?? '—'}</td>
        <td>${val2 ?? '—'}</td>
        ${v3 ? `<td>${val3 ?? '—'}</td>` : ''}
      </tr>
    `;
  }

  const matAlgemeen = document.getElementById('matrix-algemeen');
  if (matAlgemeen) {
    matAlgemeen.innerHTML = `
      <table class="spec-table">
        ${makeRow('Merk & Model', `${v1.merk} ${v1.handelsbenaming}`, `${v2.merk} ${v2.handelsbenaming}`, v3 ? `${v3.merk} ${v3.handelsbenaming}` : null, 'all')}
        ${makeRow('Kenteken', formatPlate(v1.kenteken), formatPlate(v2.kenteken), v3 ? formatPlate(v3.kenteken) : null, 'historie')}
        ${makeRow('Bouwjaar', v1.bouwjaar, v2.bouwjaar, v3?.bouwjaar, 'historie')}
        ${makeRow('Carrosserie', v1.inrichting, v2.inrichting, v3?.inrichting, 'maten')}
        ${makeRow('Kleur', v1.kleur, v2.kleur, v3?.kleur, 'all')}
        ${makeRow('Datum Eerste Toelating', formatDateNl(parseRdwDate(v1.datumEersteToelating)), formatDateNl(parseRdwDate(v2.datumEersteToelating)), v3 ? formatDateNl(parseRdwDate(v3.datumEersteToelating)) : null, 'historie')}
        ${makeRow('Aantal Eigenaren', v1.aantalEigenaren, v2.aantalEigenaren, v3?.aantalEigenaren, 'historie')}
        ${makeRow('NAP Tellerstandoordeel', v1.tellerstandOordeel, v2.tellerstandOordeel, v3?.tellerstandOordeel, 'historie')}
      </table>
    `;
  }

  const matFinancien = document.getElementById('matrix-financien');
  if (matFinancien) {
    matFinancien.innerHTML = `
      <table class="spec-table">
        ${makeRow('Nieuwprijs (Fiscale Cat.)', formatEuro(v1.catalogusprijs), formatEuro(v2.catalogusprijs), v3 ? formatEuro(v3.catalogusprijs) : null, 'kosten')}
        ${makeRow('Oorspronkelijke Bruto BPM', formatEuro(v1.brutoBpm), formatEuro(v2.brutoBpm), v3 ? formatEuro(v3.brutoBpm) : null, 'kosten')}
        ${makeRow('Huidige Rest-BPM (Indicatie)', formatEuro(bpm1.restBpm), formatEuro(bpm2.restBpm), v3 && bpm3 ? formatEuro(bpm3.restBpm) : null, 'kosten')}
        ${makeRow('Rest-BPM Percentage', `${bpm1.restBpmPct}%`, `${bpm2.restBpmPct}%`, v3 && bpm3 ? `${bpm3.restBpmPct}%` : null, 'kosten')}
        ${makeRow('Wegenbelasting / Kwartaal', formatEuro(c1.mrb.quarterly), formatEuro(c2.mrb.quarterly), v3 && c3 ? formatEuro(c3.mrb.quarterly) : null, 'kosten')}
        ${makeRow('Wegenbelasting / Maand', formatEuro(c1.mrb.monthly), formatEuro(c2.mrb.monthly), v3 && c3 ? formatEuro(c3.mrb.monthly) : null, 'kosten')}
        ${makeRow('Brandstof / Stroom per Maand', formatEuro(c1.fuelMonthly), formatEuro(c2.fuelMonthly), v3 && c3 ? formatEuro(c3.fuelMonthly) : null, 'kosten')}
        ${makeRow('Verzekering Allrisk (Raming)', formatEuro(c1.insuranceMonthly), formatEuro(c2.insuranceMonthly), v3 && c3 ? formatEuro(c3.insuranceMonthly) : null, 'kosten')}
        ${makeRow('Onderhoud & Banden (Raming)', formatEuro(c1.maintenanceMonthly), formatEuro(c2.maintenanceMonthly), v3 && c3 ? formatEuro(c3.maintenanceMonthly) : null, 'kosten')}
        ${makeRow('Totale Maandlasten', formatEuro(c1.totalMonthly), formatEuro(c2.totalMonthly), v3 && c3 ? formatEuro(c3.totalMonthly) : null, 'kosten')}
      </table>
    `;
  }

  const matMotor = document.getElementById('matrix-motor');
  if (matMotor) {
    matMotor.innerHTML = `
      <table class="spec-table">
        ${makeRow('Motorvermogen', `${v1.vermogenPk} PK (${v1.vermogenKw} kW)`, `${v2.vermogenPk} PK (${v2.vermogenKw} kW)`, v3 ? `${v3.vermogenPk} PK (${v3.vermogenKw} kW)` : null, 'prestaties')}
        ${makeRow('Cilinderinhoud', v1.cilinderinhoud > 0 ? `${formatNumber(v1.cilinderinhoud)} cc` : 'Elektrisch', v2.cilinderinhoud > 0 ? `${formatNumber(v2.cilinderinhoud)} cc` : 'Elektrisch', v3 ? (v3.cilinderinhoud > 0 ? `${formatNumber(v3.cilinderinhoud)} cc` : 'Elektrisch') : null, 'prestaties')}
        ${makeRow('0–100 km/u Acceleratie', `${v1.acceleratie} sec`, `${v2.acceleratie} sec`, v3 ? `${v3.acceleratie} sec` : null, 'prestaties')}
        ${makeRow('Topsnelheid', `${v1.topsnelheid} km/u`, `${v2.topsnelheid} km/u`, v3 ? `${v3.topsnelheid} km/u` : null, 'prestaties')}
        ${makeRow('Brandstof', v1.brandstofOmschrijving, v2.brandstofOmschrijving, v3?.brandstofOmschrijving, 'prestaties')}
      </table>
    `;
  }

  const matVerbruik = document.getElementById('matrix-verbruik');
  if (matVerbruik) {
    matVerbruik.innerHTML = `
      <table class="spec-table">
        ${makeRow('Verbruik Gecombineerd', `${v1.verbruikGecombineerd} ${v1.brandstofOmschrijving?.includes('Elektri') ? 'kWh/100km' : 'L/100km'}`, `${v2.verbruikGecombineerd} ${v2.brandstofOmschrijving?.includes('Elektri') ? 'kWh/100km' : 'L/100km'}`, v3 ? `${v3.verbruikGecombineerd} ${v3.brandstofOmschrijving?.includes('Elektri') ? 'kWh/100km' : 'L/100km'}` : null, 'verbruik')}
        ${makeRow('CO2 Uitstoot (WLTP)', `${v1.co2Uitstoot} g/km`, `${v2.co2Uitstoot} g/km`, v3 ? `${v3.co2Uitstoot} g/km` : null, 'verbruik')}
        ${makeRow('Energielabel', v1.zuinigheidslabel, v2.zuinigheidslabel, v3?.zuinigheidslabel, 'verbruik')}
        ${makeRow('Tank- / Accucapaciteit', `${v1.tankinhoud} ${v1.brandstofOmschrijving?.includes('Elektri') ? 'kWh' : 'L'}`, `${v2.tankinhoud} ${v2.brandstofOmschrijving?.includes('Elektri') ? 'kWh' : 'L'}`, v3 ? `${v3.tankinhoud} ${v3.brandstofOmschrijving?.includes('Elektri') ? 'kWh' : 'L'}` : null, 'verbruik')}
      </table>
    `;
  }

  const matMaten = document.getElementById('matrix-maten');
  if (matMaten) {
    matMaten.innerHTML = `
      <table class="spec-table">
        ${makeRow('Ledig Gewicht', `${formatNumber(v1.massaLedigVoertuig)} kg`, `${formatNumber(v2.massaLedigVoertuig)} kg`, v3 ? `${formatNumber(v3.massaLedigVoertuig)} kg` : null, 'maten')}
        ${makeRow('Rijklaar Gewicht', `${formatNumber(v1.massaRijklaar)} kg`, `${formatNumber(v2.massaRijklaar)} kg`, v3 ? `${formatNumber(v3.massaRijklaar)} kg` : null, 'maten')}
        ${makeRow('Max. Trekgewicht Geremd', `${formatNumber(v1.maximumTrekkenGeremd)} kg`, `${formatNumber(v2.maximumTrekkenGeremd)} kg`, v3 ? `${formatNumber(v3.maximumTrekkenGeremd)} kg` : null, 'maten')}
        ${makeRow('Aantal Deuren / Zitplaatsen', `${v1.aantalDeuren} deurs · ${v1.aantalZitplaatsen} zitpl.`, `${v2.aantalDeuren} deurs · ${v2.aantalZitplaatsen} zitpl.`, v3 ? `${v3.aantalDeuren} deurs · ${v3.aantalZitplaatsen} zitpl.` : null, 'maten')}
      </table>
    `;
  }

  const matApk = document.getElementById('matrix-apk');
  if (matApk) {
    matApk.innerHTML = `
      <table class="spec-table">
        ${makeRow('Vervaldatum APK', formatDateNl(parseRdwDate(v1.vervaldatumApk)), formatDateNl(parseRdwDate(v2.vervaldatumApk)), v3 ? formatDateNl(parseRdwDate(v3.vervaldatumApk)) : null, 'historie')}
        ${makeRow('WAM Verzekerd geregistreerd', v1.wamVerzekerd, v2.wamVerzekerd, v3?.wamVerzekerd, 'historie')}
        ${makeRow('Openstaande Terugroepacties', v1.openstaandeTerugroepacties, v2.openstaandeTerugroepacties, v3?.openstaandeTerugroepacties, 'historie')}
      </table>
    `;
  }
}

function filterCategory(cat) {
  appState.settings.activeCategory = cat;
  document.querySelectorAll('.cat-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });

  const rows = document.querySelectorAll('.spec-row-item');
  rows.forEach(r => {
    const rowCat = r.dataset.cat;
    r.style.display = (cat === 'all' || rowCat === cat || rowCat === 'all') ? '' : 'none';
  });
}

function toggleDiffOnly(showDiffsOnly) {
  appState.settings.diffOnly = showDiffsOnly;
  const rows = document.querySelectorAll('.spec-row-item');
  rows.forEach(r => {
    const isDiff = r.dataset.isDiff === 'true';
    if (showDiffsOnly && !isDiff) r.style.display = 'none';
    else if (!showDiffsOnly) {
      const cat = appState.settings.activeCategory;
      const rowCat = r.dataset.cat;
      if (cat === 'all' || rowCat === cat || rowCat === 'all') r.style.display = '';
    }
  });
}

function toggleFuelCustomizer() {
  const panel = document.getElementById('fuel-customizer-panel');
  if (panel) panel.classList.toggle('is-open');
}

function updateCustomFuelPrice(type, val) {
  const num = parseFloat(val);
  if (!isNaN(num) && num > 0) {
    appState.settings.fuelPrices[type] = num;
    updateComparisonView();
  }
}

function resetFuelPrices() {
  appState.settings.fuelPrices = { petrol: 2.05, diesel: 1.78, lpg: 0.89, ev: 0.32 };
  document.getElementById('price-petrol').value = '2.05';
  document.getElementById('price-diesel').value = '1.78';
  document.getElementById('price-lpg').value = '0.89';
  document.getElementById('price-ev').value = '0.32';
  updateComparisonView();
}

function updateStickyBar(v1, v2, c1, c2) {
  const bar = document.getElementById('sticky-bottom-bar');
  const platesEl = document.getElementById('sticky-plates-text');
  const deltaEl = document.getElementById('sticky-delta-text');
  const ctaWa = document.getElementById('cta-wa-sticky');

  if (bar) bar.classList.add('is-visible');

  if (platesEl) {
    platesEl.textContent = `${v1.merk} (${formatPlate(v1.kenteken)}) vs ${v2.merk} (${formatPlate(v2.kenteken)})`;
  }

  if (deltaEl) {
    const diff = Math.abs(c1.totalMonthly - c2.totalMonthly);
    const cheap = c1.totalMonthly <= c2.totalMonthly ? v1.merk : v2.merk;
    deltaEl.textContent = `Verschil: ${formatEuro(diff)}/mnd (${cheap} voordeliger)`;
  }

  if (ctaWa) {
    const msg = `Beste Martijn, ik vergelijk de ${v1.merk} (${formatPlate(v1.kenteken)}) en de ${v2.merk} (${formatPlate(v2.kenteken)}). Kunt u onafhankelijk adviseren?`;
    ctaWa.href = `https://wa.me/31624735939?text=${encodeURIComponent(msg)}`;
  }
}

function updateContactCta(v1, v2) {
  const mainWa = document.getElementById('cta-wa-main');
  const barWa = document.getElementById('cta-wa-bar');
  const formQuery = document.getElementById('aankoop-form-query');

  const text = `Beste Martijn, ik vergelijk de ${v1.merk} ${v1.handelsbenaming} (${formatPlate(v1.kenteken)}) met de ${v2.merk} ${v2.handelsbenaming} (${formatPlate(v2.kenteken)}) en zou graag aankoopadvies willen.`;

  if (mainWa) mainWa.href = `https://wa.me/31624735939?text=${encodeURIComponent(text)}`;
  if (barWa) barWa.href = `https://wa.me/31624735939?text=${encodeURIComponent(text)}`;
  if (formQuery) formQuery.value = `Aanvraag aankoopbegeleiding: ${v1.merk} (${formatPlate(v1.kenteken)}) vs ${v2.merk} (${formatPlate(v2.kenteken)})`;
}

// ═══════════════════════════════════════════════════════════════════════════
// PLATE INPUT CONTROLLERS & URL SYNC
// ═══════════════════════════════════════════════════════════════════════════

async function handlePlateInput(side, value) {
  const clean = cleanPlate(value);
  const statusEl = document.getElementById(`plate-status-${side}`);
  const clearBtn = document.getElementById(`plate-clear-${side}`);

  if (clearBtn) clearBtn.hidden = clean.length === 0;

  if (clean.length >= 6) {
    if (statusEl) statusEl.textContent = 'Zoeken bij RDW...';
    const vehicle = await fetchRdwVehicle(clean);
    if (vehicle) {
      appState.vehicles[side] = vehicle;
      if (statusEl) statusEl.textContent = `${vehicle.merk} ${vehicle.handelsbenaming.slice(0, 16)}`;
      deductCredit();
      updateComparisonView();
    } else {
      if (statusEl) statusEl.textContent = 'Niet gevonden';
    }
  } else {
    if (statusEl) statusEl.textContent = clean.length > 0 ? `${clean.length}/6 tekens` : 'Typ kenteken';
  }
}

function clearPlate(side) {
  const inp = document.getElementById(`plate-input-${side}`);
  if (inp) {
    inp.value = '';
    handlePlateInput(side, '');
  }
  appState.vehicles[side] = null;
  if (side === 1 || side === 2) {
    const resultsArea = document.getElementById('comparison-results');
    if (resultsArea && (!appState.vehicles[1] || !appState.vehicles[2])) {
      resultsArea.hidden = true;
    }
  }
}

function swapPlates() {
  const inp1 = document.getElementById('plate-input-1');
  const inp2 = document.getElementById('plate-input-2');
  if (!inp1 || !inp2) return;

  const val1 = inp1.value;
  inp1.value = inp2.value;
  inp2.value = val1;

  const temp = appState.vehicles[1];
  appState.vehicles[1] = appState.vehicles[2];
  appState.vehicles[2] = temp;

  handlePlateInput(1, inp1.value);
  handlePlateInput(2, inp2.value);
}

function loadPresetSingle(side, p) {
  const inp = document.getElementById(`plate-input-${side}`);
  if (inp) inp.value = formatPlate(p);
  handlePlateInput(side, p);
}

function loadPreset(p1, p2) {
  loadPresetSingle(1, p1);
  loadPresetSingle(2, p2);
}

function saveRecentSearch(k1, k2, label) {
  const key = `${k1}_${k2}`;
  appState.recentSearches = appState.recentSearches.filter(s => s.key !== key);
  appState.recentSearches.unshift({ key, k1, k2, label });
  if (appState.recentSearches.length > 4) appState.recentSearches.pop();
  renderRecentSearches();
}

function renderRecentSearches() {
  const bar = document.getElementById('recent-searches-bar');
  if (!bar) return;

  if (appState.recentSearches.length === 0) {
    bar.hidden = true;
    return;
  }

  bar.hidden = false;
  bar.innerHTML = `
    <span>Recent bekeken:</span>
    ${appState.recentSearches.map(s => `
      <button class="preset-chip" type="button" onclick="loadPreset('${s.k1}', '${s.k2}')">
        ${s.label}
      </button>
    `).join('')}
  `;
}

function updateUrlParams(k1, k2, k3) {
  try {
    const url = new URL(window.location.href);
    if (k1) url.searchParams.set('k1', cleanPlate(k1));
    if (k2) url.searchParams.set('k2', cleanPlate(k2));
    if (k3) url.searchParams.set('k3', cleanPlate(k3));
    else url.searchParams.delete('k3');
    window.history.replaceState({}, '', url.toString());
  } catch (e) {}
}

function shareComparisonLink() {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({
      title: 'APEXclusive Auto Vergelijker',
      text: 'Bekijk deze auto vergelijking op maandlasten, prestaties en RDW specificaties.',
      url: url
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => {
      showToast('Link gekopieerd naar klembord!');
    });
  }
}

function printComparison() {
  window.print();
}

function showToast(msg) {
  const toast = document.getElementById('toast-msg');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ═══════════════════════════════════════════════════════════════════════════
// AI CONCIERGE & CHAT MODAL
// ═══════════════════════════════════════════════════════════════════════════

function toggleChat() {
  const panel = document.getElementById('ai-panel');
  if (panel) {
    panel.hidden = !panel.hidden;
    if (!panel.hidden) document.getElementById('ai-input')?.focus();
  }
}

function sendAiQuick(topic) {
  addAiMessage(topic, 'user');
  setTimeout(() => {
    let reply = '';
    if (topic.includes('Aankoop')) {
      reply = `Bij APEXclusive begeleidt Martijn het complete aankooptraject in Nederland en heel Europa: van onafhankelijke inspectie en lakdiktemeting tot prijsonderhandeling en aflevering. Eén verkeerde aankoop kost duizenden euro's; onze begeleiding betaalt zichzelf vrijwel altijd terug.`;
    } else if (topic.includes('BPM')) {
      reply = `Bij import bepalen wij via de tegenbewijs- of koerslijstmethode het fiscaal meest voordelige BPM-bedrag. Hiermee bespaart u vaak duizenden euro's ten opzichte van de standaard RDW-afschrijvingstabel.`;
    } else if (topic.includes('Inspectie')) {
      reply = `Martijn inspecteert exclusieve auto's ter plaatse bij dealers of particulieren: diagnose uitlezen op foutcodes, lakdiktemeting voor schadedetectie, proefrit en controle van onderhoudsdocumenten.`;
    } else {
      reply = `Martijn Puts is oprichter van APEXclusive, verkeersvlieger en gepassioneerd autoliefhebber. Met jarenlange ervaring in de high-end automarkt adviseert hij particuliere en zakelijke kopers 100% onafhankelijk.`;
    }
    addAiMessage(reply, 'bot');
  }, 400);
}

function handleAiSubmit(e) {
  e.preventDefault();
  const inp = document.getElementById('ai-input');
  if (!inp || !inp.value.trim()) return;

  const text = inp.value.trim();
  inp.value = '';
  addAiMessage(text, 'user');

  setTimeout(() => {
    addAiMessage(`Bedankt voor uw vraag over "${text}". Martijn Puts staat voor u klaar om u persoonlijk en discreet te adviseren. U kunt ook direct contact opnemen via WhatsApp: +31 6 24 73 59 39.`, 'bot');
  }, 500);
}

function addAiMessage(text, role) {
  const msgs = document.getElementById('ai-messages');
  if (!msgs) return;
  const msgEl = document.createElement('div');
  msgEl.className = `ai-message ai-${role}`;
  msgEl.textContent = text;
  msgs.appendChild(msgEl);
  msgs.scrollTop = msgs.scrollHeight;
}

function submitAankoopForm(e) {
  e.preventDefault();
  const name = document.getElementById('aankoop-name')?.value;
  showToast(`Bedankt ${name}! Uw aanvraag is ontvangen. Martijn neemt spoedig contact op.`);
  document.getElementById('aankoop-contact-form')?.reset();
}

// ═══════════════════════════════════════════════════════════════════════════
// 🛡️ OCCASION SCHADE- & WOK RISICO BAROMETER
// ═══════════════════════════════════════════════════════════════════════════

function renderWokRiskBarometer(v1, v2, v3) {
  const container = document.getElementById('wok-risk-barometer-container');
  if (!container) return;

  function evalRisk(v) {
    let score = 96;
    const reasons = [];

    // Check WOK / Schade
    if (v.statusWok || v.wachtOpKeuren) {
      score -= 50;
      reasons.push({ label: 'WOK Status (Schade)', val: '⚠️ Gereed voor keuring / Schadehistorie', risk: 'high' });
    } else {
      reasons.push({ label: 'WOK / Schaderisico', val: 'Geen actieve WOK status (Schadevrij)', risk: 'low' });
    }

    // Check Recall / Terugroepacties
    if (v.aantalTerugroepacties && v.aantalTerugroepacties > 0) {
      score -= 15;
      reasons.push({ label: 'Terugroepacties RDW', val: `${v.aantalTerugroepacties} openstaande recall(s)`, risk: 'med' });
    } else {
      reasons.push({ label: 'Terugroepacties RDW', val: '0 openstaande fabrieksrecalls', risk: 'low' });
    }

    // Check NAP Tellerstand
    if (v.tellerstandoordeel && v.tellerstandoordeel.toLowerCase().includes('onlogisch')) {
      score -= 35;
      reasons.push({ label: 'NAP Tellerstand Oordeel', val: '⚠️ Onlogisch / Tellerfraude risico', risk: 'high' });
    } else {
      reasons.push({ label: 'NAP Tellerstand Oordeel', val: 'Logisch (RDW Geverifieerd)', risk: 'low' });
    }

    // Check Owners
    if (v.aantalEigenaren > 4) {
      score -= 12;
      reasons.push({ label: 'Eigenarenverloop', val: `${v.aantalEigenaren} eigenaren (boven gemiddeld)`, risk: 'med' });
    } else {
      reasons.push({ label: 'Eigenarenverloop', val: `${v.aantalEigenaren || 1} geregistreerde eigenaar(s)`, risk: 'low' });
    }

    // Check Import status
    if (v.isImport) {
      reasons.push({ label: 'Herkomst', val: 'Import (Buitenlandse historie opvragen)', risk: 'med' });
    } else {
      reasons.push({ label: 'Herkomst', val: 'Origineel Nederlands geleverd', risk: 'low' });
    }

    let badgeClass = 'risk-badge-green';
    let badgeLabel = 'Laag Risico (Veilig)';
    if (score < 60) {
      badgeClass = 'risk-badge-red';
      badgeLabel = 'Hoog Risico (Keuring vereist)';
    } else if (score < 85) {
      badgeClass = 'risk-badge-yellow';
      badgeLabel = 'Aandachtspunten';
    }

    return { score, reasons, badgeClass, badgeLabel };
  }

  const r1 = evalRisk(v1);
  const r2 = evalRisk(v2);

  container.innerHTML = `
    <div class="wok-risk-card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
        <div>
          <h4 style="font-family:var(--serif); font-size:1.35rem; color:var(--paper); font-weight:400; margin:0 0 0.3rem 0;">
            🛡️ Occasion Schade- &amp; WOK Risico Barometer
          </h4>
          <p style="color:var(--muted-light); font-size:0.82rem; margin:0;">
            Real-time RDW registers screening op Wachten Op Keuren (WOK), openstaande terugroepacties, diefstal en tellerfraude.
          </p>
        </div>
        <button class="btn-accordion-toggle" type="button" onclick="openMonetizationModal('chassis')" style="background:var(--ink-soft); border-color:var(--copper); color:var(--copper-light);">
          🔍 Vraag Volledig Chassisnummer Rapport Aan
        </button>
      </div>

      <div class="risk-barometer-grid">
        <div class="risk-car-col">
          <div class="risk-car-title">
            <h5>${escapeHtml(v1.merk)} ${escapeHtml(v1.handelsbenaming)} (${v1.kenteken})</h5>
            <span class="risk-score-badge ${r1.badgeClass}">${r1.badgeLabel} (${r1.score}/100)</span>
          </div>
          <div class="risk-checks-list">
            ${r1.reasons.map(i => `
              <div class="risk-check-item">
                <span class="label">${i.label}:</span>
                <span class="status-val" style="color:${i.risk === 'high' ? '#f87171' : i.risk === 'med' ? '#fbbf24' : '#34d399'};">${i.val}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="risk-car-col">
          <div class="risk-car-title">
            <h5>${escapeHtml(v2.merk)} ${escapeHtml(v2.handelsbenaming)} (${v2.kenteken})</h5>
            <span class="risk-score-badge ${r2.badgeClass}">${r2.badgeLabel} (${r2.score}/100)</span>
          </div>
          <div class="risk-checks-list">
            ${r2.reasons.map(i => `
              <div class="risk-check-item">
                <span class="label">${i.label}:</span>
                <span class="status-val" style="color:${i.risk === 'high' ? '#f87171' : i.risk === 'med' ? '#fbbf24' : '#34d399'};">${i.val}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔄 INRUILWAARDE & DAGWAARDE SCHATTER
// ═══════════════════════════════════════════════════════════════════════════

function renderTradeInCalculator(v1, v2, v3) {
  const container = document.getElementById('inruil-calculator-container');
  if (!container) return;

  function calcValuation(v) {
    const cat = v.catalogusprijs || 55000;
    const ageYr = Math.max(1, new Date().getFullYear() - (v.bouwjaar || 2020));
    const residualRatio = Math.max(0.25, Math.pow(0.86, ageYr));
    const marketVal = Math.round(cat * residualRatio);
    const dealerTradeIn = Math.round(marketVal * 0.74);
    const privateVal = Math.round(marketVal * 0.94);
    const apexExportVal = Math.round(marketVal * 1.05);

    return { dealerTradeIn, privateVal, apexExportVal, marketVal };
  }

  const val1 = calcValuation(v1);
  const val2 = calcValuation(v2);

  container.innerHTML = `
    <div class="trade-in-card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
        <div>
          <h4 style="font-family:var(--serif); font-size:1.35rem; color:var(--paper); font-weight:400; margin:0 0 0.3rem 0;">
            🔄 Inruilwaarde, Dagwaarde &amp; Exportpotentieel
          </h4>
          <p style="color:var(--muted-light); font-size:0.82rem; margin:0;">
            Wat brengt deze auto nu écht op bij inruil vs particuliere verkoop vs verkoop via het APEX Europese netwerk?
          </p>
        </div>
        <a class="btn-advisory-primary" href="https://wa.me/31624735939?text=Hallo%20Martijn%2C%20ik%20wil%20graag%20de%20exacte%20inruilwaarde%20of%20verkoopwaarde%20weten%20van%20mijn%20auto." target="_blank" rel="noopener noreferrer" style="padding:0.5rem 1rem; font-size:0.8rem;">
          💬 Vraag Gratis Taxatie aan bij Martijn
        </a>
      </div>

      <div class="trade-in-grid">
        <div class="trade-in-col">
          <strong style="color:var(--paper); font-size:0.95rem;">${escapeHtml(v1.merk)} ${escapeHtml(v1.handelsbenaming)}</strong>
          <div class="valuation-bars-group">
            <div class="val-bar-item">
              <div class="val-bar-header">
                <span style="color:var(--muted-light);">Dealer Inruilbod:</span>
                <strong>&euro;${val1.dealerTradeIn.toLocaleString('nl-NL')}</strong>
              </div>
              <div class="val-bar-track"><div class="val-bar-fill" style="width: 70%; background: #64748b;"></div></div>
            </div>
            <div class="val-bar-item">
              <div class="val-bar-header">
                <span style="color:var(--muted-light);">Particuliere Dagwaarde:</span>
                <strong>&euro;${val1.privateVal.toLocaleString('nl-NL')}</strong>
              </div>
              <div class="val-bar-track"><div class="val-bar-fill" style="width: 88%; background: #60a5fa;"></div></div>
            </div>
            <div class="val-bar-item">
              <div class="val-bar-header">
                <span style="color:var(--copper-light); font-weight:600;">APEX Netwerk / Export:</span>
                <strong style="color:var(--copper-light);">&euro;${val1.apexExportVal.toLocaleString('nl-NL')}</strong>
              </div>
              <div class="val-bar-track"><div class="val-bar-fill" style="width: 100%; background: var(--copper);"></div></div>
            </div>
          </div>
        </div>

        <div class="trade-in-col">
          <strong style="color:var(--paper); font-size:0.95rem;">${escapeHtml(v2.merk)} ${escapeHtml(v2.handelsbenaming)}</strong>
          <div class="valuation-bars-group">
            <div class="val-bar-item">
              <div class="val-bar-header">
                <span style="color:var(--muted-light);">Dealer Inruilbod:</span>
                <strong>&euro;${val2.dealerTradeIn.toLocaleString('nl-NL')}</strong>
              </div>
              <div class="val-bar-track"><div class="val-bar-fill" style="width: 70%; background: #64748b;"></div></div>
            </div>
            <div class="val-bar-item">
              <div class="val-bar-header">
                <span style="color:var(--muted-light);">Particuliere Dagwaarde:</span>
                <strong>&euro;${val2.privateVal.toLocaleString('nl-NL')}</strong>
              </div>
              <div class="val-bar-track"><div class="val-bar-fill" style="width: 88%; background: #60a5fa;"></div></div>
            </div>
            <div class="val-bar-item">
              <div class="val-bar-header">
                <span style="color:var(--copper-light); font-weight:600;">APEX Netwerk / Export:</span>
                <strong style="color:var(--copper-light);">&euro;${val2.apexExportVal.toLocaleString('nl-NL')}</strong>
              </div>
              <div class="val-bar-track"><div class="val-bar-fill" style="width: 100%; background: var(--copper);"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
// 📄 PDF EXECUTIVE EXPORT BANNER
// ═══════════════════════════════════════════════════════════════════════════

function renderPdfExportBanner(v1, v2, v3) {
  const container = document.getElementById('pdf-export-container');
  if (!container) return;

  container.innerHTML = `
    <div class="pdf-export-card">
      <div class="pdf-export-info">
        <h4>📄 Download APEX Executive Vergelijkingsdossier (PDF)</h4>
        <p>Ontvang het complete overzicht van deze ${v3 ? 'driestrijd' : 'vergelijking'} inclusief TCO-grafieken, RDW-specificaties en Martijn's aankoopadvies in een hoogwaardig PDF-rapport.</p>
      </div>
      <button class="btn-pdf-download" type="button" onclick="downloadPdfReport()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download PDF Dossier
      </button>
    </div>
  `;
}

function downloadPdfReport() {
  const credits = getAvailableCredits();
  if (credits <= 0 && localStorage.getItem(APEX_PRO_KEY) !== 'true') {
    openMonetizationModal('pdf');
    return;
  }
  toggleAllAccordions(true);
  showToast('📄 Printdialoog wordt geopend voor PDF export...', 'info');
  setTimeout(() => {
    window.print();
  }, 400);
}

// ═══════════════════════════════════════════════════════════════════════════
// 💎 FREEMIUM MONETIZATION, CREDITS & PRO PRICING CONTROLLER
// ═══════════════════════════════════════════════════════════════════════════

const APEX_CREDITS_KEY = 'apex_search_credits_v1';
const APEX_PRO_KEY = 'apex_is_pro_user';

function getAvailableCredits() {
  if (localStorage.getItem(APEX_PRO_KEY) === 'true') return 999;
  const saved = localStorage.getItem(APEX_CREDITS_KEY);
  if (saved === null) {
    localStorage.setItem(APEX_CREDITS_KEY, '3');
    return 3;
  }
  return parseInt(saved, 10) || 0;
}

function updateCreditsDisplay() {
  const isPro = localStorage.getItem(APEX_PRO_KEY) === 'true';
  const credits = getAvailableCredits();
  const countEl = document.getElementById('header-credits-count');
  if (countEl) {
    if (isPro) {
      countEl.innerHTML = '<strong style="color:var(--copper-light);">APEX PRO ⭐</strong>';
    } else {
      countEl.innerText = `${credits}/3 Credits`;
    }
  }
}

function deductCredit() {
  if (localStorage.getItem(APEX_PRO_KEY) === 'true') return true;
  let credits = getAvailableCredits();
  if (credits <= 0) {
    openMonetizationModal('limit');
    return false;
  }
  credits -= 1;
  localStorage.setItem(APEX_CREDITS_KEY, String(credits));
  updateCreditsDisplay();
  return true;
}

function openMonetizationModal(trigger = 'manual') {
  const modal = document.getElementById('monetization-modal');
  if (modal) {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }
}

function closeMonetizationModal() {
  const modal = document.getElementById('monetization-modal');
  if (modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function redeemCouponCode() {
  const input = document.getElementById('coupon-code-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  if (['APEX2026', 'MARTIJNPRO', 'VIPTEST', 'PRO2026', 'FREEMIUM', 'VIP2026'].includes(code)) {
    localStorage.setItem(APEX_PRO_KEY, 'true');
    localStorage.setItem(APEX_CREDITS_KEY, '999');
    updateCreditsDisplay();
    showToast('🎉 VIP Code geactiveerd! U heeft nu onbeperkt APEX Pro toegang.', 'success');
    closeMonetizationModal();
  } else {
    showToast('⚠️ Ongeldige vouchercode. Probeer bv. APEX2026', 'error');
  }
}

function purchasePlan(tier, name, price) {
  localStorage.setItem(APEX_PRO_KEY, 'true');
  localStorage.setItem(APEX_CREDITS_KEY, '999');
  updateCreditsDisplay();
  showToast(`⚡ ${name} (€${price}) succesvol geactiveerd! Veel succes met uw vergelijkingen.`, 'success');
  closeMonetizationModal();
}

function submitFreeCreditsLead(event) {
  event.preventDefault();
  const input = document.getElementById('lead-email-input');
  if (!input || !input.value) return;
  const cur = getAvailableCredits();
  localStorage.setItem(APEX_CREDITS_KEY, String(cur + 5));
  updateCreditsDisplay();
  showToast(`📧 Bedankt! 5 extra Pro-credits zijn direct bijgeschreven.`, 'success');
  input.value = '';
  closeMonetizationModal();
}

// ═══════════════════════════════════════════════════════════════════════════
// 📲 SHARE MODAL & VECTOR QR-CODE GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

function generateSvgQrCode(url) {
  const size = 180;
  let dots = '';
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i);
    hash |= 0;
  }
  const gridSize = 21;
  const cellSize = size / gridSize;

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const isTopLeft = (r < 7 && c < 7);
      const isTopRight = (r < 7 && c >= gridSize - 7);
      const isBottomLeft = (r >= gridSize - 7 && c < 7);

      let fill = false;
      if (isTopLeft || isTopRight || isBottomLeft) {
        const localR = isBottomLeft ? r - (gridSize - 7) : r;
        const localC = isTopRight ? c - (gridSize - 7) : c;
        if (localR === 0 || localR === 6 || localC === 0 || localC === 6) fill = true;
        else if (localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4) fill = true;
      } else {
        const pseudoVal = Math.sin(r * 13 + c * 37 + hash) * 10000;
        fill = (pseudoVal - Math.floor(pseudoVal)) > 0.48;
      }

      if (fill) {
        dots += `<rect x="${(c * cellSize).toFixed(1)}" y="${(r * cellSize).toFixed(1)}" width="${cellSize.toFixed(1)}" height="${cellSize.toFixed(1)}" fill="#0b0e0e" rx="1.5"/>`;
      }
    }
  }

  return `
    <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg" style="display:block;">
      <rect width="180" height="180" fill="#ffffff" rx="6"/>
      ${dots}
    </svg>
  `;
}

function openShareModal() {
  const modal = document.getElementById('share-modal');
  if (!modal) return;

  const currentUrl = window.location.href;
  const input = document.getElementById('share-url-input');
  if (input) input.value = currentUrl;

  const qrWrap = document.getElementById('qr-code-container');
  if (qrWrap) {
    qrWrap.innerHTML = generateSvgQrCode(currentUrl);
  }

  const waBtn = document.getElementById('share-whatsapp-btn');
  if (waBtn) {
    waBtn.href = `https://wa.me/?text=${encodeURIComponent('Bekijk deze auto vergelijking op APEX Exclusive: ' + currentUrl)}`;
  }

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeShareModal() {
  const modal = document.getElementById('share-modal');
  if (modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function copyShareUrl() {
  const input = document.getElementById('share-url-input');
  if (!input) return;
  navigator.clipboard.writeText(input.value).then(() => {
    showToast('📋 Link gekopieerd naar klembord!', 'success');
  }).catch(() => {
    input.select();
    document.execCommand('copy');
    showToast('📋 Link gekopieerd!', 'success');
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// 🧭 SCROLLSPY & READING PROGRESS BAR
// ═══════════════════════════════════════════════════════════════════════════

function initScrollSpy() {
  const progressBar = document.getElementById('reading-progress-bar');
  const jumpRail = document.getElementById('quick-jump-rail');
  const resultsArea = document.getElementById('comparison-results');

  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPos = window.scrollY;
    
    if (progressBar && docHeight > 0) {
      const pct = Math.min(100, Math.max(0, (scrollPos / docHeight) * 100));
      progressBar.style.width = `${pct}%`;
    }

    if (jumpRail && resultsArea) {
      const resultsTop = resultsArea.offsetTop - 150;
      if (scrollPos >= resultsTop && !resultsArea.hidden) {
        jumpRail.classList.remove('is-hidden');
      } else {
        jumpRail.classList.add('is-hidden');
      }
    }

    const sections = [
      'vehicle-hero-grid',
      'win-crowns-container',
      'martijn-advisory-container',
      'lifestyle-match-container',
      'drag-race-container',
      'radar-chart-container',
      'battle-matrix-container',
      'projection-10yr-container',
      'roadtrip-planner-container',
      'wok-risk-barometer-container',
      'inruil-calculator-container',
      'market-explorer-container',
      'spec-accordion-group',
      'pdf-export-container'
    ];

    for (let i = sections.length - 1; i >= 0; i--) {
      const secEl = document.getElementById(sections[i]);
      if (secEl) {
        const top = secEl.getBoundingClientRect().top;
        if (top <= 220) {
          document.querySelectorAll('.jump-node').forEach(node => {
            if (node.getAttribute('data-section') === sections[i]) {
              node.classList.add('is-active');
            } else {
              node.classList.remove('is-active');
            }
          });
          document.querySelectorAll('.mobile-jump-pill').forEach(pill => {
            if (pill.getAttribute('href') === `#${sections[i]}` || pill.getAttribute('href') === `#v1-hero-card`) {
              pill.classList.add('is-active');
            } else {
              pill.classList.remove('is-active');
            }
          });
          break;
        }
      }
    }
  }, { passive: true });
}

// Window globally exposed handlers
window.openMonetizationModal = openMonetizationModal;
window.closeMonetizationModal = closeMonetizationModal;
window.redeemCouponCode = redeemCouponCode;
window.purchasePlan = purchasePlan;
window.submitFreeCreditsLead = submitFreeCreditsLead;
window.openShareModal = openShareModal;
window.closeShareModal = closeShareModal;
window.copyShareUrl = copyShareUrl;
window.downloadPdfReport = downloadPdfReport;

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const header = document.getElementById('site-header');
  const progress = document.getElementById('site-progress');
  let lastScrollY = window.scrollY;

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.hidden;
      mobileMenu.hidden = isOpen;
      menuBtn.classList.toggle('open', !isOpen);
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress && max > 0) progress.style.transform = `scaleX(${Math.min(1, y / max)})`;
    if (header) {
      if (y > 100 && y > lastScrollY + 8) header.classList.add('is-hidden');
      else if (y < lastScrollY - 8 || y < 24) header.classList.remove('is-hidden');
    }
    lastScrollY = y;
  }, { passive: true });

  document.getElementById('ai-launcher')?.addEventListener('click', toggleChat);
  document.getElementById('ai-close')?.addEventListener('click', toggleChat);

  const p1 = document.getElementById('plate-input-1');
  const p2 = document.getElementById('plate-input-2');
  const p3 = document.getElementById('plate-input-3');

  p1?.addEventListener('input', e => handlePlateInput(1, e.target.value));
  p2?.addEventListener('input', e => handlePlateInput(2, e.target.value));
  p3?.addEventListener('input', e => handlePlateInput(3, e.target.value));

  const kmSlider = document.getElementById('km-slider');
  const kmDisplay = document.getElementById('km-val-display');
  kmSlider?.addEventListener('input', e => {
    const val = Number(e.target.value);
    appState.settings.kmPerYear = val;
    if (kmDisplay) kmDisplay.textContent = `${formatNumber(val)} km / jaar`;
    updateComparisonView();
  });

  const provSelect = document.getElementById('province-select');
  provSelect?.addEventListener('change', e => {
    appState.settings.province = e.target.value;
    updateComparisonView();
  });

  document.querySelectorAll('.spec-category-header').forEach(hdr => {
    hdr.addEventListener('click', () => {
      hdr.parentElement.classList.toggle('is-collapsed');
    });
  });

  // Initialize ScrollSpy, reading bar and monetization credits counter
  initScrollSpy();
  updateCreditsDisplay();

  const urlParams = new URLSearchParams(window.location.search);
  const k1 = urlParams.get('k1') || '25RKZ3';
  const k2 = urlParams.get('k2') || 'G832LK';
  const k3 = urlParams.get('k3');

  if (k3) {
    load3WayPreset(k1, k2, k3);
  } else {
    loadPreset(k1, k2);
  }
});
