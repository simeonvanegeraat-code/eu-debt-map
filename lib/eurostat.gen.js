// lib/eurostat.gen.js
//
// Eurostat GDP (nama_10_gdp) helpers — robuuste JSON-stat 2.0 parsing
// - Filters: na_item=B1GQ, unit=CP_MEUR, geo=<ISO2>
// - Werkt met value als array OF object en met time-index als array OF mapping.
// - Cachet in-memory (default 6 uur).
//
// Gebruik:
//   const { valueEUR, period } = await getLatestGDPForGeoEUR("NL");
//   const { ratioPct } = await getDebtToGDP({ debtAbsEUR: 516e9, geo: "NL" });

export const EUROSTAT_UPDATED_AT = new Date().toISOString();

// -------------------------------------------------------
// Config
// -------------------------------------------------------
const EUROSTAT_BASE =
  "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data";
const DATASET_GDP = "nama_10_gdp";
const GDP_ITEM = "B1GQ";      // GDP
const GDP_UNIT = "CP_MEUR";   // current prices, million EUR

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

// -------------------------------------------------------
// JSON-stat 2.0 parsing (robuust)
// -------------------------------------------------------
function parseLatestTimepoint(json) {
  // Verwachte velden in JSON-stat:
  // - json.dimension.id (volgorde), json.dimension.time.category.index (array OF mapping)
  // - json.value (array OF object met "0","1",...)
  if (!json || !json.dimension || !json.dimension.time) {
    throw new Error("Eurostat JSON-stat: missing time dimension");
  }

  const timeDim = json.dimension.time;
  const idOrder = Array.isArray(json.id) ? json.id : json.dimension.id; // sommige varianten hebben json.id
  const size = Array.isArray(json.size) ? json.size : json.dimension.size;

  // 1) Bepaal de tijd-indexvolgorde (array van keys zoals "2019" of "2024Q4")
  let timeKeys = null;
  const cat = timeDim.category || {};
  if (Array.isArray(cat.index)) {
    // index als array → dat is de gewenste volgorde
    timeKeys = cat.index.slice();
  } else if (cat.index && typeof cat.index === "object") {
    // mapping "key" -> position
    // maak array op basis van positie (positie 0..N-1)
    const pairs = Object.entries(cat.index).map(([k, idx]) => [k, Number(idx)]);
    pairs.sort((a, b) => a[1] - b[1]);
    timeKeys = pairs.map(([k]) => k);
  } else {
    // geen duidelijke index → probeer label keys
    if (cat.label && typeof cat.label === "object") {
      timeKeys = Object.keys(cat.label);
    }
  }
  if (!Array.isArray(timeKeys) || !timeKeys.length) {
    throw new Error("Eurostat JSON-stat: cannot resolve time keys");
  }

  // 2) Controleer dat alleen TIME overblijft na filters (na_item, unit, geo)
  //    In dat geval correspondeert value direct met de TIME-indexen.
  //    Als er tóch meerdere dimensies zijn, val terug op een generieke indexer.
  const dimIds = Array.isArray(idOrder) ? idOrder : Object.keys(json.dimension || {});
  const timeIdx = dimIds.indexOf("time");
  if (timeIdx === -1) throw new Error("Eurostat JSON-stat: time index not found");

  const valueRaw = json.value;

  // Helper: generieke indexer voor multi-dimensionele value-array
  function getValueAt(coord) {
    // coord: indices per dimensie in volgorde dimIds
    // value-array index = coord[0]
    //   + coord[1] * size[0]
    //   + coord[2] * (size[0]*size[1]) + ...
    const multipliers = [];
    for (let i = 0; i < size.length; i++) {
      const prev = i === 0 ? 1 : multipliers[i - 1] * size[i - 1];
      multipliers.push(prev);
    }
    const idx =
      coord.reduce((acc, c, i) => acc + c * multipliers[i], 0);
    if (Array.isArray(valueRaw)) {
      const val = valueRaw[idx];
      return Number.isFinite(val) ? Number(val) : null;
    } else if (valueRaw && typeof valueRaw === "object") {
      const val = valueRaw[String(idx)];
      return Number.isFinite(val) ? Number(val) : null;
    }
    return null;
  }

  // Als alleen TIME over is (na filters), is size.length === 1
  if (Array.isArray(size) && size.length === 1) {
    // value in volgorde van timeKeys
    const len = Math.min(timeKeys.length, Array.isArray(valueRaw) ? valueRaw.length : Object.keys(valueRaw || {}).length);
    for (let i = len - 1; i >= 0; i--) {
      const v = Array.isArray(valueRaw)
        ? valueRaw[i]
        : (valueRaw ? valueRaw[String(i)] : null);
      if (Number.isFinite(v)) {
        return { periodKey: timeKeys[i], valueMio: Number(v) };
      }
    }
    return { periodKey: null, valueMio: null };
  }

  // Meerdere dimensies → we nemen aan dat NA_ITEM, UNIT en GEO door filters 1 waarde hebben.
  // Dan variëert alleen TIME (positie timeIdx). We zetten alle andere coord = 0.
  const baseCoord = new Array(size.length).fill(0);
  for (let i = timeKeys.length - 1; i >= 0; i--) {
    const coord = baseCoord.slice();
    coord[timeIdx] = i;
    const v = getValueAt(coord);
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
    format: "JSON", // expliciet (optioneel)
    lang: "EN",     // expliciet (optioneel)
  });
  const url = `${EUROSTAT_BASE}/${DATASET_GDP}?${qs.toString()}`;
  const json = await fetchJSON(url);

  const { periodKey, valueMio } = parseLatestTimepoint(json);
  if (!Number.isFinite(valueMio)) {
    return { valueEUR: null, period: null };
  }
  return { valueEUR: valueMio * 1_000_000, period: periodKey };
}

// -------------------------------------------------------
// Public API
// -------------------------------------------------------
export async function getLatestGDPForGeoEUR(geo) {
  const code = normalizeGeo(geo);
  if (!code) return { valueEUR: null, period: null, cached: false };

  const hit = _gdpCache.get(code);
  if (isFresh(hit)) {
    return { valueEUR: hit.valueEUR, period: hit.period, cached: true };
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

  return { valueEUR: entry.valueEUR, period: entry.period, cached: false };
}

/**
 * Berekent debt-to-GDP (in %) op basis van meegegeven schuld (EUR) en geo.
 */
export async function getDebtToGDP({ debtAbsEUR, geo }) {
  const code = normalizeGeo(geo);
  const { valueEUR: gdpEUR, period } = await getLatestGDPForGeoEUR(code);

  if (!Number.isFinite(debtAbsEUR) || !Number.isFinite(gdpEUR) || gdpEUR <= 0) {
    return { ratioPct: null, meta: { gdpEUR: Number.isFinite(gdpEUR) ? gdpEUR : null, period: period || null, geo: code } };
  }
  return {
    ratioPct: (debtAbsEUR / gdpEUR) * 100,
    meta: { gdpEUR, period: period || null, geo: code },
  };
}

/**
 * Prefill cache voor een lijst landcodes (handig bij build/startup).
 */
export async function warmupGDPForCountries(geos = []) {
  const out = {};
  for (const g of Array.isArray(geos) ? geos : []) {
    const code = normalizeGeo(g);
    try {
      const { valueEUR, period } = await getLatestGDPForGeoEUR(code);
      out[code] = { valueEUR, period };
    } catch {
      out[code] = { valueEUR: null, period: null };
    }
  }
  return out;
}

/**
 * Sync cache getter: null als geen verse cache.
 */
export function getGDPCachedUnsafe(geo) {
  const code = normalizeGeo(geo);
  const hit = _gdpCache.get(code);
  if (!isFresh(hit)) return null;
  return { valueEUR: hit.valueEUR, period: hit.period };
}

// Backwards-compat compat export
export const EUROSTAT_SERIES = {};
