// lib/data.js — EU-27 + Eurostat override + robuuste per-second snelheid
import { EUROSTAT_SERIES } from "@/lib/eurostat.gen";

// Meta: namen en vlaggen
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

// Kleine demo fallback (alleen als Eurostat voor een land ontbreekt)
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

// Override met Eurostat & bereken per-second snelheid
for (const c of countries) {
  const row = EUROSTAT_SERIES?.[c.code];
  if (row) {
    c.prev_value_eur = row.startValue;
    c.last_value_eur = row.endValue;
    c.prev_date = row.startDateISO.slice(0,10);
    c.last_date = row.endDateISO.slice(0,10);
    c._perSecond = Number.isFinite(row.perSecond) ? row.perSecond : null; // euro/seconde
  }

  // Als perSecond ontbreekt, bereken zelf (euro/seconde)
  if (!Number.isFinite(c._perSecond)) {
    const t0 = new Date(c.prev_date).getTime();
    const t1 = new Date(c.last_date).getTime();
    const v0 = c.prev_value_eur;
    const v1 = c.last_value_eur;
    const seconds = Math.floor((t1 - t0) / 1000);
    c._perSecond = seconds > 0 ? (v1 - v0) / seconds : 0;
  }
}

export function trendFor(c){ return c.last_value_eur - c.prev_value_eur; }

/**
 * Interpolatie & extrapolatie:
 * - voor nu < prev_date: lineair terug
 * - tussen prev & last: lineair tussen de twee punten
 * - na last: ga door met _perSecond (zichtbaar tikkend bedrag)
 */
export function interpolateDebt(c, atMs){
  const t0 = new Date(c.prev_date).getTime();
  const t1 = new Date(c.last_date).getTime();
  const v0 = c.prev_value_eur;
  const v1 = c.last_value_eur;

  if (!isFinite(t0) || !isFinite(t1)) {
    const perSec = Number(c._perSecond) || 0;
    return v1 + perSec * ((atMs - atMs) / 1000);
  }

  if (t1 === t0) {
    const perSec = Number(c._perSecond) || 0;
    return v1 + perSec * ((atMs - t1) / 1000);
  }

  // lineair tussen prev en last
  if (atMs <= t0) {
    const perMs = (v1 - v0) / (t1 - t0);
    return v0 + perMs * (atMs - t0);
  }
  if (atMs <= t1) {
    const perMs = (v1 - v0) / (t1 - t0);
    return v0 + perMs * (atMs - t0);
  }

  // na last: ga door met perSecond
  const perSec = Number(c._perSecond) || ((v1 - v0) / ((t1 - t0) / 1000));
  return v1 + perSec * ((atMs - t1) / 1000);
}
