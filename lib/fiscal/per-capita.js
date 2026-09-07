const { EU27 } = require("./indicators");

const PER_CAPITA = Object.freeze({
  id: "debt-per-capita", reviewedAt: "2026-09-05T00:00:00Z",
  debt: { dataset: "gov_10dd_edpt1", filters: { freq: "A", sector: "S13", na_item: "GD", unit: "MIO_EUR" } },
  ratio: { dataset: "gov_10dd_edpt1", filters: { freq: "A", sector: "S13", na_item: "GD", unit: "PC_GDP" } },
  population: { dataset: "demo_gind", filters: { freq: "A", indic_de: "JAN" } },
  debtMetadata: "https://ec.europa.eu/eurostat/cache/metadata/en/gov_10dd_esms.htm",
  populationMetadata: "https://ec.europa.eu/eurostat/cache/metadata/en/demo_pop_esms.htm",
});

function perResident(debtMioEur, population) {
  return Number.isFinite(debtMioEur) && debtMioEur >= 0 && Number.isFinite(population) && population > 0
    ? debtMioEur * 1000000 / population : null;
}

function perCapitaRows(snapshot) {
  const rows = EU27.map((code) => {
    const row = snapshot.countries[code] || {};
    const value = perResident(row.debtMioEur, row.population);
    return { code, ...row, debtEur: Number.isFinite(row.debtMioEur) ? row.debtMioEur * 1000000 : null,
      value, displayValue: Number.isFinite(value) ? Math.round(value) : null,
      status: [...new Set(`${row.debtStatus || ""}${row.populationStatus || ""}`)].sort().join("") };
  }).sort((a, b) => (b.displayValue ?? -Infinity) - (a.displayValue ?? -Infinity) || a.code.localeCompare(b.code, "en"));
  let rank = null;
  return rows.map((row, i) => {
    if (row.displayValue !== null && (i === 0 || row.displayValue !== rows[i - 1].displayValue)) rank = i + 1;
    return { ...row, rank: row.displayValue === null ? null : rank };
  });
}

// Sum of national debts / sum of the same countries' populations, not the consolidated EU debt aggregate.
function perCapitaAggregate(snapshot) {
  const rows = perCapitaRows(snapshot);
  if (rows.some((row) => row.value === null)) return null;
  const debtEur = rows.reduce((sum, row) => sum + row.debtEur, 0);
  const population = rows.reduce((sum, row) => sum + row.population, 0);
  return { debtEur, population, value: debtEur / population,
    status: [...new Set(rows.map((row) => row.status).filter(Boolean))].join(", ") };
}

function perCapitaBand(value) {
  if (!Number.isFinite(value)) return "missing";
  if (value < 15000) return "low";
  if (value < 30000) return "medium";
  if (value < 45000) return "high";
  return "highest";
}
module.exports = { PER_CAPITA, perResident, perCapitaRows, perCapitaAggregate, perCapitaBand };
