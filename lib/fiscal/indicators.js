// Shared metadata for official fiscal indicators. No network or filesystem access.
const EU27 = Object.freeze([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE",
  "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
]);
const BALANCE = Object.freeze({
  id: "balance",
  dataset: "gov_10dd_edpt1",
  filters: { freq: "A", sector: "S13", na_item: "B9", unit: "PC_GDP" },
  debtFilters: { freq: "A", sector: "S13", na_item: "GD", unit: "PC_GDP" },
  datasetUrl: "https://ec.europa.eu/eurostat/databrowser/view/gov_10dd_edpt1/default/table?lang=en",
  metadataUrl: "https://ec.europa.eu/eurostat/cache/metadata/en/gov_10dd_esms.htm",
  referenceUrl: "https://www.consilium.europa.eu/en/policies/excessive-deficit-procedure/",
  apiBase: "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10dd_edpt1",
  referenceValue: -3,
  historyLimit: 11,
  contentReviewedAt: "2026-09-08T00:00:00Z",
});
module.exports = { EU27, BALANCE };
