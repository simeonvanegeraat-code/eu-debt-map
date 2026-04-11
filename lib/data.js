// lib/data.js — EU-27 + Eurostat debt override + robuuste €/s & datumfallback
import { EUROSTAT_SERIES } from "@/lib/eurostat.debt.gen";

// Meta
const META = {
  AT:{name:"Austria",flag:"🇦🇹"}, BE:{name:"Belgium",flag:"🇧🇪"}, BG:{name:"Bulgaria",flag:"🇧🇬"},
  HR:{name:"Croatia",flag:"🇭🇷"}, CY:{name:"Cyprus",flag:"🇨🇾"}, CZ:{name:"Czechia",flag:"🇨🇿"},
  DK:{name:"Denmark",flag:"🇩🇰"}, EE:{name:"Estonia",flag:"🇪🇪"}, FI:{name:"Finland",flag:"🇫🇮"},
  FR:{name:"France",flag:"🇫🇷"},  DE:{name:"Germany",flag:"🇩🇪"},  GR:{name:"Greece",flag:"🇬🇷"},
  HU:{name:"Hungary",flag:"🇭🇺"},  IE:{name:"Ireland",flag:"🇮🇪"},  IT:{name:"Italy",flag:"🇮🇹"},
  LV:{name:"Latvia",flag:"🇱🇻"},   LT:{name:"Lithuania",flag:"🇱🇹"}, LU:{name:"Luxembourg",flag:"🇱🇺"},
  MT:{name:"Malta",flag:"🇲🇹"},    NL:{name:"Netherlands",flag:"🇳🇱"}, PL:{name:"Poland",flag:"🇵🇱"},
  PT:{name:"Portugal",flag:"🇵🇹"},  RO:{name:"Romania",flag:"🇷🇴"},  SK:{name:"Slovakia",flag:"🇸🇰"},
  SI:{name:"Slovenia",flag:"🇸🇮"},  ES:{name:"Spain",flag:"🇪🇸"},   SE:{name:"Sweden",flag:"🇸🇪"},
};

const DEMO = {
  NL:{prev_value_eur:420_000_000_000,prev_date:"2023-12-31",last_value_eur:415_000_000_000,last_date:"2024-06-30"},
  DE:{prev_value_eur:2_400_000_000_000,prev_date:"2023-12-31",last_value_eur:2_450_000_000_000,last_date:"2024-06-30"},
  FR:{prev_value_eur:2_950_000_000_000,prev_date:"2023-12-31",last_value_eur:2_970_000_000_000,last_date:"2024-06-30"},
  IT:{prev_value_eur:2_800_000_000_000,prev_date:"2023-12-31",last_value_eur:2_790_000_000_000,last_date:"2024-06-30"},
  ES:{prev_value_eur:1_550_000_000_000,prev_date:"2023-12-31",last_value_eur:1_565_000_000_000,last_date:"2024-06-30"},
};

const EU27 = Object.keys(META);
const QUARTER_MS = 91 * 24 * 60 * 60 * 1000; // ~1 kwartaal als fallback
const HARD_CAP = 50_000; // €/s, hoog genoeg voor grote landen maar nog steeds bescherming tegen runaway tickers

function clampPerSecond(x) {
  if (!Number.isFinite(x)) return 0;
  return Math.max(-HARD_CAP, Math.min(HARD_CAP, x));
}

function computePerSecondFromSpan(v0, v1, t0, t1) {
  const seconds = Math.max(1, Math.floor((t1 - t0) / 1000));
  return clampPerSecond((v1 - v0) / seconds);
}

function quarterKeyToISO(key) {
  const m = /^(\d{4})Q([1-4])$/i.exec(String(key || "").trim());
  if (!m) return null;
  const y = Number(m[1]);
  const q = Number(m[2]);
  const end = {
    1: [2, 31],
    2: [5, 30],
    3: [8, 30],
    4: [11, 31],
  };
  const [mo, d] = end[q];
  return new Date(Date.UTC(y, mo, d, 23, 59, 59)).toISOString().slice(0, 10);
}

// Heuristiek om generator-waarde te normaliseren en te sanity-checken
function normalizePerSecond(genPerSec, v0, v1, t0, t1) {
  let T0 = t0;
  let T1 = t1;

  if (!isFinite(T0) || !isFinite(T1) || T0 === T1) {
    T1 = isFinite(t1) ? t1 : Date.now();
    T0 = T1 - QUARTER_MS;
  }

  const safe = computePerSecondFromSpan(v0, v1, T0, T1);

  if (!Number.isFinite(genPerSec)) return safe;

  let perSec = genPerSec;

  // €/ms vs €/s detectie
  if (Math.abs(perSec) > Math.max(1, Math.abs(safe)) * 100) {
    perSec = perSec / 1000;
  }

  // Nog steeds bizar
  if (Math.abs(perSec) > Math.abs(safe) * 20) {
    perSec = safe;
  }

  return clampPerSecond(perSec);
}

export const countries = EU27.map((code) => ({
  code,
  name: META[code].name,
  flag: META[code].flag,

  prev_value_eur: 0,
  last_value_eur: 0,
  prev_date: "2024-06-30",
  last_date: "2024-09-30",

  official_previous_time: null,
  official_latest_time: null,
  official_prev_date: null,
  official_last_date: null,
  hasOfficialDebtSeries: false,

  ...(DEMO[code] || {}),
}));

// Eurostat debt override + officiële reference periods bewaren
for (const c of countries) {
  const row = EUROSTAT_SERIES?.[c.code];

  if (row && Number.isFinite(row.startValue) && Number.isFinite(row.endValue)) {
    c.prev_value_eur = row.startValue;
    c.last_value_eur = row.endValue;

    const prevISO =
      (typeof row.startDateISO === "string" && row.startDateISO.slice(0, 10)) ||
      quarterKeyToISO(row.previousTime) ||
      c.prev_date;

    const lastISO =
      (typeof row.endDateISO === "string" && row.endDateISO.slice(0, 10)) ||
      quarterKeyToISO(row.latestTime) ||
      c.last_date;

    c.prev_date = prevISO;
    c.last_date = lastISO;

    c.official_previous_time = row.previousTime || null;
    c.official_latest_time = row.latestTime || null;
    c.official_prev_date = prevISO;
    c.official_last_date = lastISO;
    c.hasOfficialDebtSeries = true;
  }

  const t0 = Date.parse(c.prev_date);
  const t1 = Date.parse(c.last_date);
  const v0 = c.prev_value_eur;
  const v1 = c.last_value_eur;

  c._perSecond = normalizePerSecond(row?.perSecond, v0, v1, t0, t1);
}

/* ---------- DEV-FALLBACK ----------
   Als EUROSTAT_SERIES lokaal ontbreekt of nauwelijks gevuld is,
   vullen we ALLE landen met DEMO-achtige waarden, zodat UI/kaart/quick list
   volledig werkt tijdens development. In productie verandert niets. */
const EUROSTAT_ROWS =
  EUROSTAT_SERIES && typeof EUROSTAT_SERIES === "object"
    ? Object.keys(EUROSTAT_SERIES).length
    : 0;

if (process.env.NODE_ENV !== "production" && EUROSTAT_ROWS < 10) {
  console.warn("[dev] EUROSTAT_SERIES ontbreekt of is minimaal; gebruik DEMO-fallback voor alle landen");
  const demoKeys = Object.keys(DEMO);
  let i = 0;

  for (const c of countries) {
    if (c.prev_value_eur > 0 && c.last_value_eur > 0) continue;

    const k = demoKeys[i % demoKeys.length];
    const d = DEMO[k];

    c.prev_value_eur = d.prev_value_eur;
    c.last_value_eur = d.last_value_eur;
    c.prev_date = d.prev_date;
    c.last_date = d.last_date;

    const t0 = Date.parse(c.prev_date);
    const t1 = Date.parse(c.last_date);

    c._perSecond = normalizePerSecond(undefined, c.prev_value_eur, c.last_value_eur, t0, t1);
    i++;
  }
}
// ---------- /DEV-FALLBACK ----------

export function trendFor(c) {
  return c.last_value_eur - c.prev_value_eur;
}

export function livePerSecondFor(c) {
  if (!c) return 0;
  if (Number.isFinite(c._perSecond)) return c._perSecond;

  const v0 = Number(c.prev_value_eur) || 0;
  const v1 = Number(c.last_value_eur) || 0;

  let t0 = Date.parse(c.prev_date);
  let t1 = Date.parse(c.last_date);

  if (!isFinite(t0) || !isFinite(t1) || t0 === t1) {
    t1 = Date.now();
    t0 = t1 - QUARTER_MS;
  }

  return computePerSecondFromSpan(v0, v1, t0, t1);
}

/**
 * Interpolatie/extrapolatie over tijd.
 * - vóór prev: lineair terug
 * - tussen prev & last: lineair
 * - na last: v1 + _perSecond * (t - t1)
 */
export function interpolateDebt(c, atMs) {
  let t0 = Date.parse(c.prev_date);
  let t1 = Date.parse(c.last_date);
  const v0 = c.prev_value_eur;
  const v1 = c.last_value_eur;

  if (!isFinite(t0) || !isFinite(t1) || t0 === t1) {
    t1 = isFinite(t1) ? t1 : Date.now();
    t0 = t1 - QUARTER_MS;
  }

  const perMs = (v1 - v0) / Math.max(1, (t1 - t0)); // €/ms

  if (atMs <= t0) return v0 + perMs * (atMs - t0);
  if (atMs <= t1) return v0 + perMs * (atMs - t0);

  const perSec = Number(c._perSecond) || (perMs * 1000);
  return v1 + perSec * ((atMs - t1) / 1000);
}