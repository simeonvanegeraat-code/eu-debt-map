// EU-27 countries only
export const countries = [
  // Demo values — replace with real later:
  { code: "NL", name: "Netherlands", flag: "🇳🇱",
    prev_value_eur: 420_000_000_000, prev_date: "2023-12-31",
    last_value_eur: 415_000_000_000,  last_date: "2024-06-30" },
  { code: "DE", name: "Germany", flag: "🇩🇪",
    prev_value_eur: 2_400_000_000_000, prev_date: "2023-12-31",
    last_value_eur: 2_450_000_000_000,  last_date: "2024-06-30" },
  { code: "FR", name: "France", flag: "🇫🇷",
    prev_value_eur: 2_950_000_000_000, prev_date: "2023-12-31",
    last_value_eur: 2_970_000_000_000,  last_date: "2024-06-30" },
  { code: "IT", name: "Italy", flag: "🇮🇹",
    prev_value_eur: 2_800_000_000_000, prev_date: "2023-12-31",
    last_value_eur: 2_790_000_000_000,  last_date: "2024-06-30" },
  { code: "ES", name: "Spain", flag: "🇪🇸",
    prev_value_eur: 1_550_000_000_000, prev_date: "2023-12-31",
    last_value_eur: 1_565_000_000_000,  last_date: "2024-06-30" },

  // Placeholders for the rest of EU-27 (grey until filled):
  { code: "AT", name: "Austria", flag: "🇦🇹", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "BE", name: "Belgium", flag: "🇧🇪", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "HR", name: "Croatia", flag: "🇭🇷", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "CZ", name: "Czechia", flag: "🇨🇿", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "DK", name: "Denmark", flag: "🇩🇰", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "EE", name: "Estonia", flag: "🇪🇪", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "FI", name: "Finland", flag: "🇫🇮", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "GR", name: "Greece", flag: "🇬🇷", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "HU", name: "Hungary", flag: "🇭🇺", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "IE", name: "Ireland", flag: "🇮🇪", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "LV", name: "Latvia", flag: "🇱🇻", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "MT", name: "Malta", flag: "🇲🇹", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "PL", name: "Poland", flag: "🇵🇱", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "RO", name: "Romania", flag: "🇷🇴", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", prev_value_eur: 0, prev_date: "2023-12-31", last_value_eur: 0, last_date: "2024-06-30" }
];

export function trendFor(c){
  return c.last_value_eur - c.prev_value_eur;
}

export function interpolateDebt(c, atMs){
  const t0 = new Date(c.prev_date).getTime();
  const t1 = new Date(c.last_date).getTime();
  const v0 = c.prev_value_eur;
  const v1 = c.last_value_eur;
  if (t1 <= t0) return v1;

  const rate = (v1 - v0) / (t1 - t0);

  if (atMs <= t0) return v0;
  if (atMs <= t1) return v0 + rate * (atMs - t0);

  // Extrapolate after last_date (capped to 180 days)
  const MAX_FWD_MS = 180 * 24 * 3600 * 1000;
  const dt = Math.min(atMs - t1, MAX_FWD_MS);
  return v1 + rate * dt;
}
