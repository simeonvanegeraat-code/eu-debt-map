// lib/data.js — EU-27 + Eurostat override + robuuste €/s & datumfallback
import { EUROSTAT_SERIES } from "@/lib/eurostat.gen";

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
const HARD_CAP = 2_000; // €/s, tegen runaway tickers

function clampPerSecond(x) {
  if (!Number.isFinite(x)) return 0;
  return Math.max(-HARD_CAP, Math.min(HARD_CAP, x));
}

function computePerSecondFromSpan(v0, v1, t0, t1) {
  const seconds = Math.max(1, Math.floor((t1 - t0) / 1000));
  return clampPerSecond((v1 - v0) / seconds);
}

// Heuristiek om generator-waarde te normaliseren en te sanity-checken
function normalizePerSecond(genPerSec, v0, v1, t0, t1) {
  // Als we geen bruikbare datums hebben, simuleer een kwartaalspan
  let T0 = t0, T1 = t1;
  if (!isFinite(T0) || !isFinite(T1) || T0 === T1) {
    T1 = isFinite(t1) ? t1 : Date.now();
    T0 = T1 - QUARTER_MS;
  }
  const safe = computePerSecondFromSpan(v0, v1, T0, T1);
  if (!Number.isFinite(genPerSec)) return safe;

  let perSec = genPerSec;
  // €/ms vs €/s detectie: veel groter dan safe → /1000
  if (Math.abs(perSec) > Math.max(1, Math.abs(safe)) * 100) {
    perSec = perSec / 1000;
  }
  // Nog steeds bizar → vervang door safe
  if (Math.abs(perSec) > Math.abs(safe) * 20) {
    perSec = safe;
  }
  return clampPerSecond(perSec);
}

export const countries = EU27.map(code => {
  const base = DEMO[code] ?? {
    prev_value_eur: 0,
    last_value_eur: 0,
    prev_date: "2024-06-30",
    last_date: "2024-06-30",
  };
  return { code, name: META[code].name, flag: META[code].flag, ...base };
});

// Eurostat override + datums fixen + €/s robuust
for (const c of countries) {
  const row = EUROSTAT_SERIES?.[c.code];

  if (row) {
    c.prev_value_eur = row.startValue;
    c.last_value_eur = row.endValue;

    const startISO = typeof row.startDateISO === "string" ? row.startDateISO : "";
    const endISO   = typeof row.endDateISO   === "string" ? row.endDateISO   : "";
    let prevISO = startISO.slice(0,10);
    let lastISO = endISO.slice(0,10);

    // Als generator identieke of lege datums levert → synthese
    const t0raw = Date.parse(prevISO);
    const t1raw = Date.parse(lastISO);
    if (!isFinite(t0raw) || !isFinite(t1raw) || t0raw === t1raw) {
      const t1 = isFinite(t1raw) ? t1raw : Date.now();
      const t0 = t1 - QUARTER_MS;
      prevISO = new Date(t0).toISOString().slice(0,10);
      lastISO = new Date(t1).toISOString().slice(0,10);
    }
    c.prev_date = prevISO;
    c.last_date = lastISO;
  }

  const t0 = Date.parse(c.prev_date);
  const t1 = Date.parse(c.last_date);
  const v0 = c.prev_value_eur;
  const v1 = c.last_value_eur;

  c._perSecond = normalizePerSecond(row?.perSecond, v0, v1, t0, t1);
}

export function trendFor(c){ return c.last_value_eur - c.prev_value_eur; }

/**
 * Interpolatie/extrapolatie over tijd.
 * - vóór prev: lineair terug
 * - tussen prev & last: lineair
 * - na last: v1 + _perSecond * (t - t1)
 */
export function interpolateDebt(c, atMs){
  let t0 = Date.parse(c.prev_date);
  let t1 = Date.parse(c.last_date);
  const v0 = c.prev_value_eur;
  const v1 = c.last_value_eur;

  // Herstel als t0/t1 onbruikbaar of gelijk
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
