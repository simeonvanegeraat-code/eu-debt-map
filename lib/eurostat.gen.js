// lib/eurostat.gen.js
//
// Eurostat GDP (nama_10_gdp) helpers — robuuste JSON-stat parsing + cache
// Exporteert zowel named als default (zodat elke importstijl werkt).
//
// Gebruik (serverside):
//   import { getLatestGDPForGeoEUR } from "@/lib/eurostat.gen";
//   // of
//   import Eurostat from "@/lib/eurostat.gen";
//   const { valueEUR } = await Eurostat.getLatestGDPForGeoEUR("NL");

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
      return Number.isFinite(v) ? Number(v) : null;
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

  // Meerdimensionaal (zou zelden voorkomen na filters, maar dekken we af)
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

export async function getDebtToGDP({ debtAbsEUR, geo }) {
  const code = normalizeGeo(geo);
  const { valueEUR: gdpEUR, period } = await getLatestGDPForGeoEUR(code);

  if (!Number.isFinite(debtAbsEUR) || !Number.isFinite(gdpEUR) || gdpEUR <= 0) {
    return { ratioPct: null, meta: { gdpEUR: Number.isFinite(gdpEUR) ? gdpEUR : null, period: period || null, geo: code } };
  }
  return { ratioPct: (debtAbsEUR / gdpEUR) * 100, meta: { gdpEUR, period: period || null, geo: code } };
}

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

export function getGDPCachedUnsafe(geo) {
  const code = normalizeGeo(geo);
  const hit = _gdpCache.get(code);
  if (!isFresh(hit)) return null;
  return { valueEUR: hit.valueEUR, period: hit.period };
}

// Backwards compat (bestond in jouw stub)
export const EUROSTAT_SERIES = {};

// -------------------------------------------------------
// Default export (zodat import Eurostat from "@/lib/eurostat.gen" ook werkt)
// -------------------------------------------------------
const Eurostat = {
  EUROSTAT_UPDATED_AT,
  EUROSTAT_SERIES,
  getLatestGDPForGeoEUR,
  getDebtToGDP,
  warmupGDPForCountries,
  getGDPCachedUnsafe,
};
export default Eurostat;
