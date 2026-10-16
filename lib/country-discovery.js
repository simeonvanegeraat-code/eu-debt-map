// Editorial discovery order, not a ranking. Keep it identical across locales.
const COUNTRY_DISCOVERY_ORDER = [
  "NL", "DE", "FR", "IT", "ES", "PL", "BE", "SE", "AT", "DK",
  "FI", "IE", "PT", "GR", "CZ", "RO", "HU", "SK", "HR", "BG",
  "SI", "LT", "LV", "EE", "LU", "CY", "MT",
];

function nextDiscoveryCountries(currentCode) {
  const index = COUNTRY_DISCOVERY_ORDER.indexOf(String(currentCode || "").toUpperCase());
  if (index < 0) return [];
  return [1, 2].map(offset => COUNTRY_DISCOVERY_ORDER[(index + offset) % COUNTRY_DISCOVERY_ORDER.length]);
}

module.exports = { COUNTRY_DISCOVERY_ORDER, nextDiscoveryCountries };
