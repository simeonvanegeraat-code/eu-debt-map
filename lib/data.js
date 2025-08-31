// lib/data.js
import { EUROSTAT_SERIES } from "@/lib/eurostat.gen";

export const countries = [
  { code:"NL", name:"Netherlands", flag:"🇳🇱", prev_value_eur:420_000_000_000, prev_date:"2023-12-31", last_value_eur:415_000_000_000, last_date:"2024-06-30" },
  { code:"DE", name:"Germany", flag:"🇩🇪", prev_value_eur:2_400_000_000_000, prev_date:"2023-12-31", last_value_eur:2_450_000_000_000, last_date:"2024-06-30" },
  { code:"FR", name:"France", flag:"🇫🇷", prev_value_eur:2_950_000_000_000, prev_date:"2023-12-31", last_value_eur:2_970_000_000_000, last_date:"2024-06-30" },
  { code:"IT", name:"Italy", flag:"🇮🇹", prev_value_eur:2_800_000_000_000, prev_date:"2023-12-31", last_value_eur:2_790_000_000_000, last_date:"2024-06-30" },
  { code:"ES", name:"Spain", flag:"🇪🇸", prev_value_eur:1_550_000_000_000, prev_date:"2023-12-31", last_value_eur:1_565_000_000_000, last_date:"2024-06-30" }
];

for(const c of countries){
  const row = EUROSTAT_SERIES?.[c.code];
  if(row){
    c.prev_value_eur = row.startValue;
    c.last_value_eur = row.endValue;
    c.prev_date = row.startDateISO.slice(0,10);
    c.last_date = row.endDateISO.slice(0,10);
  }
}

export function trendFor(c){ return c.last_value_eur - c.prev_value_eur; }

export function interpolateDebt(c, atMs){
  const t0 = new Date(c.prev_date).getTime();
  const t1 = new Date(c.last_date).getTime();
  const v0 = c.prev_value_eur;
  const v1 = c.last_value_eur;
  if(t1 <= t0) return v1;
  const rate = (v1-v0)/(t1-t0);
  if(atMs<=t0) return v0+rate*(atMs-t0);
  if(atMs<=t1) return v0+rate*(atMs-t0);
  return v1+rate*(atMs-t1);
}
