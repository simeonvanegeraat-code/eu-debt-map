// lib/countries.js
// EU-27 landnamen per locale. Fallback = Engels.
export const COUNTRY_NAMES = {
  AT: { en: "Austria",     nl: "Oostenrijk",  de: "Österreich", fr: "Autriche" },
  BE: { en: "Belgium",     nl: "België",      de: "Belgien",    fr: "Belgique" },
  BG: { en: "Bulgaria",    nl: "Bulgarije",   de: "Bulgarien",  fr: "Bulgarie" },
  HR: { en: "Croatia",     nl: "Kroatië",     de: "Kroatien",   fr: "Croatie" },
  CY: { en: "Cyprus",      nl: "Cyprus",      de: "Zypern",     fr: "Chypre" },
  CZ: { en: "Czechia",     nl: "Tsjechië",    de: "Tschechien", fr: "Tchéquie" },
  DK: { en: "Denmark",     nl: "Denemarken",  de: "Dänemark",   fr: "Danemark" },
  EE: { en: "Estonia",     nl: "Estland",     de: "Estland",    fr: "Estonie" },
  FI: { en: "Finland",     nl: "Finland",     de: "Finnland",   fr: "Finlande" },
  FR: { en: "France",      nl: "Frankrijk",   de: "Frankreich", fr: "France" },
  DE: { en: "Germany",     nl: "Duitsland",   de: "Deutschland",fr: "Allemagne" },
  GR: { en: "Greece",      nl: "Griekenland", de: "Griechenland", fr: "Grèce" },
  HU: { en: "Hungary",     nl: "Hongarije",   de: "Ungarn",     fr: "Hongrie" },
  IE: { en: "Ireland",     nl: "Ierland",     de: "Irland",     fr: "Irlande" },
  IT: { en: "Italy",       nl: "Italië",      de: "Italien",    fr: "Italie" },
  LV: { en: "Latvia",      nl: "Letland",     de: "Lettland",   fr: "Lettonie" },
  LT: { en: "Lithuania",   nl: "Litouwen",    de: "Litauen",    fr: "Lituanie" },
  LU: { en: "Luxembourg",  nl: "Luxemburg",   de: "Luxemburg",  fr: "Luxembourg" },
  MT: { en: "Malta",       nl: "Malta",       de: "Malta",      fr: "Malte" },
  NL: { en: "Netherlands", nl: "Nederland",   de: "Niederlande",fr: "Pays-Bas" },
  PL: { en: "Poland",      nl: "Polen",       de: "Polen",      fr: "Pologne" },
  PT: { en: "Portugal",    nl: "Portugal",    de: "Portugal",   fr: "Portugal" },
  RO: { en: "Romania",     nl: "Roemenië",    de: "Rumänien",   fr: "Roumanie" },
  SK: { en: "Slovakia",    nl: "Slowakije",   de: "Slowakei",   fr: "Slovaquie" },
  SI: { en: "Slovenia",    nl: "Slovenië",    de: "Slowenien",  fr: "Slovénie" },
  ES: { en: "Spain",       nl: "Spanje",      de: "Spanien",    fr: "Espagne" },
  SE: { en: "Sweden",      nl: "Zweden",      de: "Schweden",   fr: "Suède" },
};

export function countryName(code, locale = "en") {
  const row = COUNTRY_NAMES[code?.toUpperCase()];
  if (!row) return code || "";
  return row[locale] || row.en;
}
