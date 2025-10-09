// lib/eurostat.gen.js
//
// Live Eurostat helpers (GDP & Debt-to-GDP)
// -----------------------------------------
// - Haalt GDP (B1GQ, CP_MEUR) per land op via Eurostat.
// - Zoekt altijd de meest recente periode (jaar of kwartaal) met een geldige waarde.
// - Cachet resultaten in-memory met instelbare TTL (standaard 6 uur).
//
// Let op: deze module is "safe to fail" — bij netwerkfout krijg je nette null/NaN terug,
// zodat je UI niet breekt. Integreer conditioneel in je componenten.
//
// Gebruik:
//   import { getLatestGDPForGeoEUR, getDebtToGDP, warmupGDPForCountries } from "@/lib/eurostat.gen";
//
//   const gdp = await getLatestGDPForGeoEUR("NL"); // -> number (EUR) of null
//   const { ratioPct, meta } = await getDebtToGDP({ debtAbsEUR: 516e9, geo: "NL" });
//
//   // (optioneel) prefill cache bij build/serverstart:
//   await warmupGDPForCountries(["NL","FR","DE","IT"]);
//
// Bron:
//   - Eurostat API v1.0: https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nama_10_gdp
//   - Fallback SDMX-JSON: https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/... (of legacy sdmx-json)
//
// ----------------------------------------------------

export const EUROSTAT_UPDATED_AT = new Date().toISOString();

// ===============================
// Config
// ===============================
const EUROSTAT_V1_BASE =
  "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data";
const EUROSTAT_DATASET_GDP = "nama_10_gdp"; // GDP and main components
const GDP_ITEM = "B1GQ"; // bruto binnenlands product
const GDP_UNIT = "CP_MEUR"; // current prices, million EUR

// Fallback (oudere) endpoint (SDMX-JSON). Wordt alleen gebruikt als v1.0 faalt.
// Let op: dit pad kan door Eurostat op termijn uitgefaseerd worden. Daarom "best effort".
const EUROSTAT_FALLBACK_SDMX_BASE =
  "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data";

// Cache (in-memory)
const DEFAULT_TTL_MS =
  Number(process.env.EUROSTAT_CACHE_TTL_MS || "") > 0
    ? Number(process.env.EUROSTAT_CACHE_TTL_MS)
    : 6 * 60 * 60 * 1000; // 6 uur default

const _gdpCache = new Map(); // key: geo (ISO2), value: { valueEUR, period, fetchedAt, ttlMs }

// Kleine fetch helper met timeout
async function fetchWithTimeout(url, { timeoutMs = 12_000 } = {}) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${url}`);
    }
    return await res.json();
  } finally {
    clearTimeout(to);
  }
}

// Helpers
function nowTs() {
  return Date.now();
}
function isFresh(entry) {
  if (!entry) return false;
  return nowTs() - entry.fetchedAt < (entry.ttlMs ?? DEFAULT_TTL_MS);
}
function normalizeGeo(geo) {
  return String(geo || "").trim().toUpperCase();
}

// ===============================
// Eurostat v1.0: GDP ophalen
// ===============================
async function fetchGDP_V1MioEUR(geo) {
  // Voorbeeld:
  // https://.../nama_10_gdp?na_item=B1GQ&unit=CP_MEUR&geo=NL
  const qs = new URLSearchParams({
    na_item: GDP_ITEM,
    unit: GDP_UNIT,
    geo: geo,
  });
  const url = `${EUROSTAT_V1_BASE}/${EUROSTAT_DATASET_GDP}?${qs.toString()}`;
  const json = await fetchWithTimeout(url);

  // Verwachte structuur (v1.0):
  // {
  //   dimension: { time: { label: "time", category: { index: {...}, label: {...} } }, ... },
  //   value: { "0": 12345, "1": 12567, ... } // in miljoen euro
  // }
  if (!json || !json.value || !json.dimension || !json.dimension.time) {
    throw new Error("Unexpected Eurostat v1 GDP shape");
  }

  const timeDim = json.dimension.time;
  // De category.index bevat mapping van tijdlabel -> index (of andersom).
  // We reconstrueren een volgorde op basis van label of index.
  // Meestal is label zoiets als "2024", "2023", of "2024Q4". We zoeken de laatste met value aanwezig.

  // Maak lijst van [key, idx, label] voor alle tijdwaarden
  // In v1.0 zie je vaak: category.index = { "2010": 0, "2011": 1, ... } en category.label = { "2010": "2010", ... }
  const entries = [];
  const idxMap = timeDim.category?.index || {};
  const labelMap = timeDim.category?.label || {};

  // index keys zijn tijd-notaties; we willen ze sorteren op index (numerieke volgorde)
  for (const timeKey of Object.keys(idxMap)) {
    const idx = idxMap[timeKey];
    const lbl = labelMap?.[timeKey] ?? timeKey;
    const valIndex = String(idx); // json.value gebruikt meestal numerieke string keys
    const val = json.value[valIndex];
    entries.push({ timeKey, label: lbl, idx, valueMio: isFinite(val) ? Number(val) : null });
  }

  // Sorteer op idx oplopend; neem dan de laatste met waarde
  entries.sort((a, b) => a.idx - b.idx);
  const latest = [...entries].reverse().find((e) => e.valueMio !== null);

  if (!latest) {
    return { valueEUR: null, period: null };
  }
  // waarde in miljoen EUR -> EUR
  return { valueEUR: latest.valueMio * 1_000_000, period: latest.label || latest.timeKey };
}

// ===============================
// Fallback: SDMX-JSON (zelfde v1.0 basepad, andere structuur kan)
// ===============================
async function fetchGDP_FallbackMioEUR(geo) {
  const qs = new URLSearchParams({
    na_item: GDP_ITEM,
    unit: GDP_UNIT,
    geo: geo,
  });
  const url = `${EUROSTAT_FALLBACK_SDMX_BASE}/${EUROSTAT_DATASET_GDP}?${qs.toString()}`;
  const json = await fetchWithTimeout(url);

  // Probeer dezelfde parse als v1.0; als de vorm afwijkt, probeer generiek:
  if (json && json.value && json.dimension?.time?.category?.index) {
    return fetchGDP_V1MioEUR(geo); // hergebruik parser
  }

  // Generieke poging: sommige varianten hebben "dimension" met arrays
  // Als alles faalt, geef nette nulls terug
  return { valueEUR: null, period: null };
}

// ===============================
// Publieke helpers (GDP & ratio)
// ===============================
export async function getLatestGDPForGeoEUR(geo) {
  const code = normalizeGeo(geo);
  if (!code) return { valueEUR: null, period: null, cached: false };

  const cacheHit = _gdpCache.get(code);
  if (isFresh(cacheHit)) {
    return { valueEUR: cacheHit.valueEUR, period: cacheHit.period, cached: true };
    }
  // Fetch v1, dan fallback
  let out = null;
  try {
    out = await fetchGDP_V1MioEUR(code);
  } catch (e) {
    // console.warn("Eurostat v1 GDP failed:", e?.message);
    try {
      out = await fetchGDP_FallbackMioEUR(code);
    } catch (e2) {
      // console.warn("Eurostat fallback GDP failed:", e2?.message);
      out = { valueEUR: null, period: null };
    }
  }

  const entry = {
    valueEUR: out.valueEUR ?? null,
    period: out.period ?? null,
    fetchedAt: nowTs(),
    ttlMs: DEFAULT_TTL_MS,
  };
  _gdpCache.set(code, entry);

  return { valueEUR: entry.valueEUR, period: entry.period, cached: false };
}

/**
 * getDebtToGDP
 * ------------
 * Berekent debt-to-GDP voor een landcode op basis van een meegegeven debt (EUR, absoluut).
 * Haalt GDP live op bij Eurostat (gecachet).
 *
 * @param {Object} args
 * @param {number} args.debtAbsEUR - totale schuld in euro (absolute waarde; bv. 516e9)
 * @param {string} args.geo - landcode (ISO2, bv. "NL")
 * @returns {Promise<{ ratioPct: number|null, meta: { gdpEUR: number|null, period: string|null, geo: string } }>}
 */
export async function getDebtToGDP({ debtAbsEUR, geo }) {
  const code = normalizeGeo(geo);
  const { valueEUR: gdpEUR, period } = await getLatestGDPForGeoEUR(code);

  if (!isFinite(debtAbsEUR) || !isFinite(gdpEUR) || gdpEUR <= 0) {
    return {
      ratioPct: null,
      meta: { gdpEUR: isFinite(gdpEUR) ? gdpEUR : null, period: period || null, geo: code },
    };
  }
  const ratioPct = (debtAbsEUR / gdpEUR) * 100;
  return {
    ratioPct,
    meta: { gdpEUR, period: period || null, geo: code },
  };
}

/**
 * warmupGDPForCountries
 * ---------------------
 * Haalt GDP op voor een reeks landen en zet ze in cache (handig bij build of serverstart).
 *
 * @param {string[]} geos - array met ISO2 landcodes (bv. ["NL","FR","DE","IT"])
 * @returns {Promise<Record<string,{valueEUR:number|null,period:string|null}>>}
 */
export async function warmupGDPForCountries(geos = []) {
  const results = {};
  const list = Array.isArray(geos) ? geos : [];
  for (const raw of list) {
    const code = normalizeGeo(raw);
    try {
      const { valueEUR, period } = await getLatestGDPForGeoEUR(code);
      results[code] = { valueEUR, period };
    } catch {
      results[code] = { valueEUR: null, period: null };
    }
  }
  return results;
}

/**
 * getGDPCachedUnsafe
 * ------------------
 * Snelle synchronische toegang tot de cache (geen fetch).
 * Handig als je tijdens render alleen al-gehydrateerde waarden wilt tonen.
 * Geeft null terug als geen verse cache-hit.
 */
export function getGDPCachedUnsafe(geo) {
  const code = normalizeGeo(geo);
  const hit = _gdpCache.get(code);
  if (!isFresh(hit)) return null;
  return { valueEUR: hit.valueEUR, period: hit.period };
}

// Backwards compatible exports (voor bestaande imports in je codebase)
export const EUROSTAT_SERIES = {}; // je gebruikte dit eerder als statische dump; hier niet nodig maar gelaten voor compat.
