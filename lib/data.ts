import raw from "@/data/eu.json";
import type {Countries, Country} from "./types";

export const countries: Countries = raw as Countries;
export const EU_CODES = Object.keys(countries);

export function getCountry(code2: string): Country | null {
  return countries[code2.toUpperCase()] ?? null;
}

export function trend(country: Country): "up"|"down"|"flat" {
  const d = country.last_value_eur - country.prev_value_eur;
  if (Math.abs(d) < Math.max(1e-6, country.last_value_eur * 1e-6)) return "flat";
  return d >= 0 ? "up" : "down";
}

export function perSecondRate(country: Country): number {
  const t0 = new Date(country.prev_date).getTime();
  const t1 = new Date(country.last_date).getTime();
  const seconds = Math.max(1, (t1 - t0) / 1000);
  return (country.last_value_eur - country.prev_value_eur) / seconds;
}

export function projectedNow(country: Country): number {
  const t1 = new Date(country.last_date).getTime();
  const now = Date.now();
  const dt = Math.max(0, (now - t1) / 1000);
  return country.last_value_eur + perSecondRate(country) * dt;
}
