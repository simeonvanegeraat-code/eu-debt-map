// lib/data.js — EU-27 + Eurostat override + robuuste €/s snelheid
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

// Demo fallback als Eurostat voor een land ontbreekt (mag je verwijderen)
const DEMO = {
  NL:{prev_value_eur:420_000_000_000,prev_date:"2023-12-31",last_value_eur:415_000_000_000,last_date:"2024-06-30"},
  DE:{prev_value_eur:2_400_000_000_000,prev_date:"2023-12-31",last_value_eur:2_450_000_000_000,last_date:"2024-06-30"},
  FR:{prev_value_eur:2_950_000_000_000,prev_date:"2023-12-31",last_value_eur:2_970_000_000_000,last_date:"2024-06-30"},
  IT:{prev_value_eur:2_800_000_000_000,prev_date:"2023-12-31",last_value_eur:2_790_000_000_000,last_date:"2024-06-30"},
  ES:{prev_value_eur:1_550_000_000_000,prev_date:"2023-12-31",last_value_eur:1_565_000_000_000,last_date:"2024-06-30"},
};

const EU27 = Object.keys(META);

export const countries = EU27.map(code => {
  const base = DEMO[code] ?? {
    prev_value_eur: 0,
    last_value_eur: 0,
    prev_date: "2024-06-30",
    last_date: "2024-06-30",
  };
  return { code, name: META[code].name, flag: META[code].flag, ...base };
});

// ————————————————————————————————————————————————————————————————
// Helpers
// ————————————————————————————————————————————————————————————————

// Veilige €/s uit twee kwartalen
function computePerSecondSafe(v0, v1, t0, t1) {
  const seconds = Math.max(1, Math.floor((t1 - t0) / 1000));
  const raw = (v1 - v0) / seconds; // €/s
  if (!Number.isFinite(raw)) return 0;
  // Conservatieve clamp ±10k €/s (≈ €864M per dag max)
  const LIMIT = 1e4;
  return Math.max(-LIMIT, Math.min(LIMIT, raw));
}

// Normaliseer generator-waarde naar €/s en sanity-check vs. safe
function normalizePerSecond(rowPerSecond, v0, v1, t0, t1) {
  const safe = computePerSecondSafe(v0, v1, t0, t1);
  if (!Number.isFinite(rowPerSecond)) return safe;

  let perSec = rowPerSecond;

  // Heuristiek: als het ~100× of meer groter is dan safe,
  // is het waarschijnlijk €/ms → deel door 1000.
  if (Math.abs(perSec) > Math.max(1, Math.abs(safe)) * 100) {
    perSec = perSec / 1000;
  }

  // Als het nog steeds buitensporig is, val terug op safe
  if (Math.abs(perSec) > Math.abs(safe) * 20) {
    perSec = safe;
  }

  // Laatste hard clamp
  const HARD_LIMIT = 1e4;
  return Math.max(-HARD_LIMIT, Math.min(HARD_LIMIT, perSec));
}

// ————————————————————————————————————————————————————————————————
// Eurostat overrides
// ————————————————————————————————————————————————————————————————
for (const c of countries) {
  const row = EUROSTAT_SERIES?.[c.code];

  if (row) {
    c.prev_value_eur = row.startValue;
    c.last_value_eur = row.endValue;

    // Gebruik uitsluitend de datums uit Eurostat; nooit "vandaag".
    const startISO = typeof row.startDateISO === "string" ? row.startDateISO : "";
    const endISO = typeof row.endDateISO === "string" ? row.endDateISO : "";
    c.prev_date = startISO.slice(0, 10) || c.prev_date;
    c.last_date = endISO.slice(0, 10) || c.last_date;
  }

  const t0 = new Date(c.prev_date).getTime();
  const t1 = new Date(c.last_date).getTime();
  const v0 = c.prev_value_eur;
  const v1 = c.last_value_eur;

  // Finale €/s — normaliseer en sanity-check altijd
  const gen = row?.perSecond;
  c._perSecond = normalizePerSecond(gen, v0, v1, t0, t1);
}

export function trendFor(c){ return c.last_value_eur - c.prev_value_eur; }

// ————————————————————————————————————————————————————————————————
// Interpolatie & extrapolatie
// ————————————————————————————————————————————————————————————————
/**
 * - vóór prev: lineair terug
 * - tussen prev & last: lineair interpoleren
 * - na last: v1 + _perSecond * (t - t1)
 */
export function interpolateDebt(c, atMs){
  const t0 = new Date(c.prev_date).getTime();
  const t1 = new Date(c.last_date).getTime();
  const v0 = c.prev_value_eur;
  const v1 = c.last_value_eur;

  // Als datums onbruikbaar of identiek → alleen veilige €/s gebruiken
  if (!isFinite(t0) || !isFinite(t1) || t1 === t0) {
    const perSec = Number(c._perSecond) || 0;
    const anchor = isFinite(t1) ? t1 : atMs; // voorkom NaN
    return v1 + perSec * ((atMs - anchor) / 1000);
  }

  // Lineaire interpolatie tussen de kwartalen
  const perMs = (v1 - v0) / (t1 - t0); // €/ms
  if (atMs <= t0) return v0 + perMs * (atMs - t0);
  if (atMs <= t1) return v0 + perMs * (atMs - t0);

  // Na last → door met €/s (robuuste waarde)
  const perSec = Number(c._perSecond) || (perMs * 1000);
  return v1 + perSec * ((atMs - t1) / 1000);
}
