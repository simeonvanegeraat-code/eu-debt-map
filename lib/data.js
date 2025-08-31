export const countries = [
  { code: "NL", name: "Nederland", flag: "🇳🇱",
    prev_value_eur: 420_000_000_000, prev_date: "2023-12-31",
    last_value_eur: 415_000_000_000, last_date: "2024-06-30" },
  { code: "DE", name: "Duitsland", flag: "🇩🇪",
    prev_value_eur: 2_400_000_000_000, prev_date: "2023-12-31",
    last_value_eur: 2_450_000_000_000, last_date: "2024-06-30" },
  { code: "FR", name: "Frankrijk", flag: "🇫🇷",
    prev_value_eur: 2_950_000_000_000, prev_date: "2023-12-31",
    last_value_eur: 2_970_000_000_000, last_date: "2024-06-30" },
  { code: "IT", name: "Italië", flag: "🇮🇹",
    prev_value_eur: 2_800_000_000_000, prev_date: "2023-12-31",
    last_value_eur: 2_790_000_000_000, last_date: "2024-06-30" },
  { code: "ES", name: "Spanje", flag: "🇪🇸",
    prev_value_eur: 1_550_000_000_000, prev_date: "2023-12-31",
    last_value_eur: 1_565_000_000_000, last_date: "2024-06-30" }
];

export function trendFor(c){
  return c.last_value_eur - c.prev_value_eur;
}

export function interpolateDebt(c, atMs){
  const t0 = new Date(c.prev_date).getTime();
  const t1 = new Date(c.last_date).getTime();
  if(atMs <= t0) return c.prev_value_eur;
  if(atMs >= t1) return c.last_value_eur;
  const r = (atMs - t0) / Math.max(1, t1 - t0);
  return c.prev_value_eur + (c.last_value_eur - c.prev_value_eur) * r;
}
