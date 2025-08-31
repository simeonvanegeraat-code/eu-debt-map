// lib/data.js
// Full EU-27 country list with flags + robust Eurostat override.
// Shows *all* EU-27 on the homepage even if Eurostat response misses a country.

import { EUROSTAT_SERIES } from "@/lib/eurostat.gen";

// --- EU-27 dictionary (name + flag) ---
const META = {
  AT: { name: "Austria", flag: "🇦🇹" },
  BE: { name: "Belgium", flag: "🇧🇪" },
  BG: { name: "Bulgaria", flag: "🇧🇬" },
  HR: { name: "Croatia", flag: "🇭🇷" },
  CY: { name: "Cyprus", flag: "🇨🇾" },
  CZ: { name: "Czechia", flag: "🇨🇿" },
  DK: { name: "Denmark", flag: "🇩🇰" },
  EE: { name: "Estonia", flag: "🇪🇪" },
  FI: { name: "Finland", flag: "🇫🇮" },
  FR: { name: "France", flag: "🇫🇷" },
  DE: { name: "Germany", flag: "🇩🇪" },
  GR: { name: "Greece", flag: "🇬🇷" },
  HU: { name: "Hungary", flag: "🇭🇺" },
  IE: { name: "Ireland", flag: "🇮🇪" },
  IT: { name: "Italy", flag: "🇮🇹" },
  LV: { name: "Latvia", flag: "🇱🇻" },
  LT: { name: "Lithuania", flag: "🇱🇹" },
  LU: { name: "Luxembourg", flag: "🇱🇺" },
  MT: { name: "Malta", flag: "🇲🇹" },
  NL: { name: "Netherlands", flag: "🇳🇱" },
  PL: { name: "Poland", flag: "🇵🇱" },
  PT: { name: "Portugal", flag: "🇵🇹" },
  RO: { name: "Romania", flag: "🇷🇴" },
  SK: { name: "Slovakia", flag: "🇸🇰" },
  SI: { name: "Slovenia", flag: "🇸🇮" },
  ES: { name: "Spain", flag: "🇪🇸" },
  SE: { name: "Sweden", flag: "🇸🇪" },
};

// --- Small demo baselines for 5 big countries (keeps the site lively if Eurostat fails) ---
const DEMO = {
  NL: { prev_value_eur: 420_000_000_000, prev_date: "2023-12-31", last_value_eur: 415_000_000_000, last_date: "2024-06-30" },
  DE: { prev_value_eur: 2_400_000_000_000, prev_date: "2023-12-31", last_value_eur: 2_450_000_000_000, last_date: "2024-06-30" },
  FR: { prev_value_eur: 2_950_000_000_000, prev_date: "2023-12-31", last_value_eur: 2_970_000_000_000, last_date: "2024-06-30" },
  IT: { prev_value_eur: 2_800_000_000_000, prev_date: "2023-12-31", last_value_eur: 2_790_000_000_000, last_date: "2024-06-30" },
  ES: { prev_value_eur: 1_550_000_000_000, prev_date: "2023-12-31", last_value_eur: 1_565_000_000_000, last_date: "2024-06-30" },
};

// --- Build full countries array (ensure every EU-27 code exists) ---
const EU27_CODES = Object.keys(META);

export const countries = EU27_CODES.map((code) => {
  const demo = DEMO[code];
  // default placeholder (flat) to ensure country shows up in lists/maps
  const base = demo ?? {
    prev_value_eur: 0,
    last_value_eur: 0,
    prev_date: "2024-06-30",
    last_date: "2024-06-30",
  };
  return {
    code,
    name: META[code].name,
    flag: META[code].flag,
    ...base,
  };
});

// --- Override with Eurostat if present ---
for (const c of countries) {
  const row = EUROSTAT_SERIES?.[c.code];
  if (!row) continue;
  c.prev_value_eur = row.startValue;
  c.last_value_eur = row.endValue;
  c.prev_date = row.startDateISO.slice(0, 10);
  c.last_date = row.endDateISO.slice(0, 10);
}

// --- Helpers (used by the pages) ---
export function trendFor(c) {
  return c.last_value_eur - c.prev_value_eur;
}

// Live interpolation (keeps ticking after the last known quarter)
export function interpolateDebt(c, atMs) {
  const t0 = new Date(c.prev_date).getTime();
  const t1 = new Date(c.last_date).getTime();
  const v0 = c.prev_value_eur;
  const v1 = c.last_value_eur;
  if (!isFinite(t0) || !isFinite(t1) || t1 <= t0) return v1;
  const rate = (v1 - v0) / (t1 - t0); // euro per ms
  if (atMs <= t0) return v0 + rate * (atMs - t0);
  if (atMs <= t1) return v0 + rate * (atMs - t0);
  return v1 + rate * (atMs - t1);
}
