// lib/eurostat.gen.js
//
// Eurostat GDP (nama_10_gdp) helpers — robuuste JSON-stat parsing + cache
// MET Live Extrapolator om "Debt-to-GDP" eerlijker te maken.

export const EUROSTAT_UPDATED_AT = new Date().toISOString();

// -------------------------------------------------------
// Config
// -------------------------------------------------------
const EUROSTAT_BASE =
  "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data";
const DATASET_GDP = "nama_10_gdp";
const GDP_ITEM = "B1GQ";      // GDP
const GDP_UNIT = "CP_MEUR";   // current prices, million EUR

// ANNUAL_GROWTH_ESTIMATE:
// Conservatieve schatting voor Nominaal GDP groei (Inflatie + Reële groei).
// 0.055 (5.5%) is realistisch in tijden van inflatieherstel.
// Dit voorkomt dat we oude GDP cijfers delen door live schuld.
const ANNUAL_GROWTH_ESTIMATE = 0.055; 

const DEFAULT_TTL_MS =
  Number(process.env.EUROSTAT_CACHE_TTL_MS || "") > 0
    ? Number(process.env.EUROSTAT_CACHE_TTL_MS)
    : 6 * 60 * 60 * 1000; // 6h

const _gdpCache = new Map(); // geo -> { valueEUR, period, fetchedAt, ttlMs }

// -------------------------------------------------------
// Utils
// -------------------------------------------------------
function now() { return Date.now(); }
function normalizeGeo(geo) { return String(geo || "").trim().toUpperCase(); }
function isFresh(entry) { return !!entry && now() - entry.fetchedAt < (entry.ttlMs ?? DEFAULT_TTL_MS); }

async function fetchJSON(url, { timeoutMs = 12000 } = {}) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

/**
 * Helpt om een Eurostat periode (bijv "2024-Q3" of "2024") om te zetten naar een JS Date.
 * We pakken het EINDE van die periode voor conservatieve extrapolatie.
 */
function parsePeriodToDate(periodStr) {
  if (!periodStr) return new Date();
  const s = String(periodStr).trim();

  // Kwartaal: "2024-Q3"
  if (s.match(/^\d{4}-Q\d$/)) {
    const [year, q] = s.split("-Q");
    // Q1 = eind maart (3), Q2 = eind juni (6), etc.
    const month = parseInt(q) * 3; 
    // Laatste dag van die maand (ongeveer)
    return new Date(parseInt(year), month, 0); 
  }
  
  // Jaar: "2024"
  if (s.match(/^\d{4}$/)) {
    // Eind van het jaar
    return new Date(parseInt(s), 11, 31);
  }

  return new Date(); // Fallback
}

/**
 * Berekent de "Live" GDP waarde door de oude waarde te extrapoleren naar NU.
 * Formule: Oud * (1 + groei)^(jaren_verschil)
 */
function extrapolateGDP(valueEUR, periodStr) {
  if (!valueEUR || !periodStr) return valueEUR;

  const dateData = parsePeriodToDate(periodStr);
  const dateNow = new Date();
  
  // Verschil in jaren (milliseconden / ms_per_jaar)
  const diffTime = dateNow - dateData;
  const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
  const diffYears = diffTime / msPerYear;

  // Als data uit de toekomst komt (onwaarschijnlijk) of vandaag is, niets doen
  if (diffYears <= 0) return valueEUR;

  // Extrapoleren: Compound Interest formule
  const factor = Math.pow(1 + ANNUAL_GROWTH_ESTIMATE, diffYears);
  
  return valueEUR * factor;
}


// -------------------------------------------------------
// JSON-stat 2.0 parsing (robuust)
// -------------------------------------------------------
function parseLatestTimepoint(json) {
  if (!json || !json.dimension || !json.dimension.time) {
    throw new Error("Eurostat JSON-stat: missing time dimension");
  }

  const timeDim = json.dimension.time;
  const idOrder = Array.isArray(json.id) ? json.id : json.dimension.id;
  const size = Array.isArray(json.size) ? json.size : json.dimension.size;

  // tijdsleutels bepalen (array of mapping)
  let timeKeys = null;
  const cat = timeDim.category || {};
  if (Array.isArray(cat.index)) {
    timeKeys = cat.index.slice();
  } else if (cat.index && typeof cat.index === "object") {
    const pairs = Object.entries(cat.index).map(([k, idx]) => [k, Number(idx)]);
    pairs.sort((a, b) => a[1] - b[1]);
    timeKeys = pairs.map(([k]) => k);
  } else if (cat.label && typeof cat.label === "object") {
    timeKeys = Object.keys(cat.label);
  }
  if (!Array.isArray(timeKeys) || !timeKeys.length) {
    throw new Error("Eurostat JSON-stat: cannot resolve time keys");
  }

  const dimIds = Array.isArray(idOrder) ? idOrder : Object.keys(json.dimension || {});
  const timeIdx = dimIds.indexOf("time");
  if (timeIdx === -1) throw new Error("Eurostat JSON-stat: time index not found");

  const valueRaw = json.value;

  function getValueAtIndex(i) {
    if (Array.isArray(valueRaw)) {
      const v = valueRaw[i];
      return Number.isFinite(v) ? Number(v) : null;
    } else if (valueRaw && typeof valueRaw === "object") {
      const v = valueRaw[String(i)];
      const parsed = Number(v);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  }

  // Alleen TIME-dimensie over
  if (Array.isArray(size) && size.length === 1) {
    const len = Math.min(
      timeKeys.length,
      Array.isArray(valueRaw) ? valueRaw.length : Object.keys(valueRaw || {}).length
    );
    for (let i = len - 1; i >= 0; i--) {
      const v = getValueAtIndex(i);
      if (Number.isFinite(v)) {
        return { periodKey: timeKeys[i], valueMio: Number(v) };
      }
    }
    return { periodKey: null, valueMio: null };
  }

  // Meerdimensionaal
  const multipliers = [];
  for (let i = 0; i < size.length; i++) {
    multipliers[i] = i === 0 ? 1 : multipliers[i - 1] * size[i - 1];
  }
  const baseCoord = new Array(size.length).fill(0);
  for (let i = timeKeys.length - 1; i >= 0; i--) {
    const coord = baseCoord.slice();
    coord[timeIdx] = i;
    const idx = coord.reduce((acc, c, d) => acc + c * multipliers[d], 0);
    const v = getValueAtIndex(idx);
    if (Number.isFinite(v)) {
      return { periodKey: timeKeys[i], valueMio: Number(v) };
    }
  }
  return { periodKey: null, valueMio: null };
}

// -------------------------------------------------------
// Fetch GDP (laatste punt) voor 1 land
// -------------------------------------------------------
async function fetchLatestGDP_MioEUR(geo) {
  const qs = new URLSearchParams({
    na_item: GDP_ITEM,
    unit: GDP_UNIT,
    geo: geo,
    format: "JSON",
    lang: "EN",
  });
  const url = `${EUROSTAT_BASE}/${DATASET_GDP}?${qs.toString()}`;
  const json = await fetchJSON(url);

  const { periodKey, valueMio } = parseLatestTimepoint(json);
  if (!Number.isFinite(valueMio)) return { valueEUR: null, period: null };
  return { valueEUR: valueMio * 1_000_000, period: periodKey };
}

// -------------------------------------------------------
// Public API (named)
// -------------------------------------------------------
export async function getLatestGDPForGeoEUR(geo) {
  const code = normalizeGeo(geo);
  if (!code) return { valueEUR: null, period: null, cached: false };

  const hit = _gdpCache.get(code);
  if (isFresh(hit)) {
    // Hier voegen we ook de extrapolatie toe bij cache hit, 
    // zodat de datum altijd 'vers' berekend wordt t.o.v. nu.
    const extrapolated = extrapolateGDP(hit.valueEUR, hit.period);
    
    // [DEBUG LOG] Zodat je in Vercel ziet wat er gebeurt
    console.log(`[GDP-FIX] ${code}: Raw Period=${hit.period}, Extrapolated=${(extrapolated/1e9).toFixed(1)}B (was ${(hit.valueEUR/1e9).toFixed(1)}B)`);

    return { 
        valueEUR: extrapolated, // DIT IS DE LIVE GDP
        rawEUR: hit.valueEUR,   // Dit is de 'echte' Eurostat waarde (voor debug)
        period: hit.period, 
        cached: true,
        isExtrapolated: extrapolated !== hit.valueEUR 
    };
  }

  let out = { valueEUR: null, period: null };
  try {
    out = await fetchLatestGDP_MioEUR(code);
  } catch {
    out = { valueEUR: null, period: null };
  }

  const entry = {
    valueEUR: out.valueEUR ?? null,
    period: out.period ?? null,
    fetchedAt: now(),
    ttlMs: DEFAULT_TTL_MS,
  };
  _gdpCache.set(code, entry);

  // Extrapoleer direct na fetch
  const extrapolated = extrapolateGDP(entry.valueEUR, entry.period);

  console.log(`[GDP-FIX] ${code} (NEW FETCH): Raw Period=${entry.period}, Extrapolated=${(extrapolated/1e9).toFixed(1)}B`);

  return { 
      valueEUR: extrapolated, 
      rawEUR: entry.valueEUR,
      period: entry.period, 
      cached: false,
      isExtrapolated: extrapolated !== entry.valueEUR
  };
}

export async function getDebtToGDP({ debtAbsEUR, geo }) {
  const code = normalizeGeo(geo);
  // Deze functie gebruikt nu automatisch de Ge-extrapoleerde GDP
  const { valueEUR: gdpEUR, period, isExtrapolated } = await getLatestGDPForGeoEUR(code);

  if (!Number.isFinite(debtAbsEUR) || !Number.isFinite(gdpEUR) || gdpEUR <= 0) {
    return { ratioPct: null, meta: { gdpEUR: Number.isFinite(gdpEUR) ? gdpEUR : null, period: period || null, geo: code } };
  }
  
  // Ratio is nu: Live Schuld / Live GDP (geschat)
  return { 
      ratioPct: (debtAbsEUR / gdpEUR) * 100, 
      meta: { 
          gdpEUR, 
          period: period || null, 
          geo: code,
          isExtrapolated 
      } 
  };
}

export async function warmupGDPForCountries(geos = []) {
  const out = {};
  for (const g of Array.isArray(geos) ? geos : []) {
    const code = normalizeGeo(g);
    try {
      const res = await getLatestGDPForGeoEUR(code);
      out[code] = { valueEUR: res.valueEUR, period: res.period };
    } catch {
      out[code] = { valueEUR: null, period: null };
    }
  }
  return out;
}

export function getGDPCachedUnsafe(geo) {
  const code = normalizeGeo(geo);
  const hit = _gdpCache.get(code);
  if (!isFresh(hit)) return null;
  // Let op: ook unsafe cache moet extrapoleren om consistent te blijven
  const extrapolated = extrapolateGDP(hit.valueEUR, hit.period);
  return { valueEUR: extrapolated, period: hit.period };
}

// Backwards compat
export const EUROSTAT_SERIES = {};

const Eurostat = {
  EUROSTAT_UPDATED_AT,
  EUROSTAT_SERIES,
  getLatestGDPForGeoEUR,
  getDebtToGDP,
  warmupGDPForCountries,
  getGDPCachedUnsafe,
};
export default Eurostat;