// lib/eurostat.live.js
//
// Eurostat GDP (namq_10_gdp) helpers — robuuste JSON-stat parsing + cache
// VERSIE 2.0: Quarterly Run Rate + Greece Alias fix.
//
// Dit is de enige bron van waarheid voor "Live GDP".

export const EUROSTAT_UPDATED_AT = new Date().toISOString();

// Config: Gebruik Quarterly Data (namq) ipv Annual (nama)
const EUROSTAT_BASE =
  "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data";
const DATASET_GDP = "namq_10_gdp"; 
const GDP_ITEM = "B1GQ";      // GDP
const GDP_UNIT = "CP_MEUR";   // Current Prices, Million EUR
const GDP_S_ADJ = "SCA";      // Seasonally and calendar adjusted data

const DEFAULT_TTL_MS =
  Number(process.env.EUROSTAT_CACHE_TTL_MS || "") > 0
    ? Number(process.env.EUROSTAT_CACHE_TTL_MS)
    : 6 * 60 * 60 * 1000; // 6h

const _gdpCache = new Map(); // key: input-geo (bv "GR") -> { valueEUR, period, fetchedAt, ttlMs }

// -------------------------------------------------------
// Utils
// -------------------------------------------------------
function now() { return Date.now(); }
function normalizeIso2(geo) { return String(geo || "").trim().toUpperCase(); }

// Eurostat alias: Greece gebruikt "EL" i.p.v. ISO2 "GR"
function mapToEurostatGeo(iso2) {
  if (iso2 === "GR") return "EL";
  // Voeg eventueel UK toe als "UK" vs "GB" nodig is, maar voor EU is EL de belangrijkste
  return iso2;
}

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

// -------------------------------------------------------
// JSON-stat 2.0 parsing (Robust)
// -------------------------------------------------------
function parseLatestTimepoint(json) {
  if (!json || !json.dimension || !json.dimension.time) {
    throw new Error("Eurostat JSON-stat: missing time dimension");
  }
  const timeDim = json.dimension.time;
  const idOrder = Array.isArray(json.id) ? json.id : json.dimension.id;
  const size = Array.isArray(json.size) ? json.size : json.dimension.size;

  // tijdsleutels bepalen
  let timeKeys = null;
  const cat = timeDim.category || {};
  if (Array.isArray(cat.index)) timeKeys = cat.index.slice();
  else if (cat.index && typeof cat.index === "object") {
    const pairs = Object.entries(cat.index).map(([k, i]) => [k, Number(i)]);
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
  const getValueAtIndex = (i) => {
    if (Array.isArray(valueRaw)) return Number.isFinite(valueRaw[i]) ? Number(valueRaw[i]) : null;
    if (valueRaw && typeof valueRaw === "object") {
      const v = valueRaw[String(i)];
      return Number.isFinite(v) ? Number(v) : null;
    }
    return null;
  };

  // Alleen TIME-dimensie
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

  // Safety voor meerdimensionaal
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
// Fetch Quarterly GDP Logic
// -------------------------------------------------------
async function fetchLatestGDP_MioEUR(geoInput) {
  // Mapping toepassen (GR -> EL) VOOR de fetch
  const eurostatGeo = mapToEurostatGeo(geoInput);

  const qs = new URLSearchParams({
    na_item: GDP_ITEM,
    unit: GDP_UNIT,
    s_adj: GDP_S_ADJ, // SCA (Seasonally Adjusted)
    geo: eurostatGeo,
    format: "JSON",
    lang: "EN",
  });
  const url = `${EUROSTAT_BASE}/${DATASET_GDP}?${qs.toString()}`;
  const json = await fetchJSON(url);
  const { periodKey, valueMio } = parseLatestTimepoint(json);
  
  if (!Number.isFinite(valueMio)) return { valueEUR: null, period: null };

  // CALCULATION: Quarterly Run Rate -> Annualized
  // Eurostat geeft 1 kwartaal. We doen x4 voor jaarbasis.
  const annualizedGDP = valueMio * 4 * 1_000_000;

  return { valueEUR: annualizedGDP, period: periodKey };
}

// -------------------------------------------------------
// Public API
// -------------------------------------------------------
export async function getLatestGDPForGeoEUR(geo) {
  const iso2 = normalizeIso2(geo);        // bij ons: "NL", "GR", etc.
  const cacheKey = iso2;                  // cache onder inputcode
  const hit = _gdpCache.get(cacheKey);
  
  if (isFresh(hit)) {
    return { valueEUR: hit.valueEUR, period: hit.period, cached: true };
  }

  let out = { valueEUR: null, period: null };
  try {
    out = await fetchLatestGDP_MioEUR(iso2); // mapToEurostatGeo zit nu intern in de fetch functie
  } catch (err) {
    console.error(`[Eurostat Live] GDP Fetch failed for ${iso2}:`, err);
    out = { valueEUR: null, period: null };
  }

  const entry = {
    valueEUR: out.valueEUR ?? null,
    period: out.period ?? null,
    fetchedAt: now(),
    ttlMs: DEFAULT_TTL_MS,
  };
  _gdpCache.set(cacheKey, entry);

  return { valueEUR: entry.valueEUR, period: entry.period, cached: false };
}

export async function getDebtToGDP({ debtAbsEUR, geo }) {
  const iso2 = normalizeIso2(geo);
  const { valueEUR: gdpEUR, period } = await getLatestGDPForGeoEUR(iso2);
  
  if (!Number.isFinite(debtAbsEUR) || !Number.isFinite(gdpEUR) || gdpEUR <= 0) {
    return { 
      ratioPct: null, 
      meta: { 
        gdpEUR: Number.isFinite(gdpEUR) ? gdpEUR : null, 
        period: period || null, 
        geo: iso2 
      } 
    };
  }
  return { 
    ratioPct: (debtAbsEUR / gdpEUR) * 100, 
    meta: { 
      gdpEUR, 
      period: period || null, 
      geo: iso2 
    } 
  };
}

export async function warmupGDPForCountries(geos = []) {
  const out = {};
  for (const g of Array.isArray(geos) ? geos : []) {
    const iso2 = normalizeIso2(g);
    try { out[iso2] = await getLatestGDPForGeoEUR(iso2); }
    catch { out[iso2] = { valueEUR: null, period: null, cached: false }; }
  }
  return out;
}

export function getGDPCachedUnsafe(geo) {
  const iso2 = normalizeIso2(geo);
  const hit = _gdpCache.get(iso2);
  if (!isFresh(hit)) return null;
  return { valueEUR: hit.valueEUR, period: hit.period };
}

export const EUROSTAT_SERIES = {}; // compat

const Eurostat = {
  EUROSTAT_UPDATED_AT,
  EUROSTAT_SERIES,
  getLatestGDPForGeoEUR,
  getDebtToGDP,
  warmupGDPForCountries,
  getGDPCachedUnsafe,
};
export default Eurostat;