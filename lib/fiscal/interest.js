const { EU27 } = require("./indicators");

const accounts = (na_item, unit) => ({ dataset: "gov_10a_main", filters: { freq: "A", sector: "S13", na_item, unit } });
const INTEREST = Object.freeze({
  id: "interest-cost", reviewedAt: "2026-09-06T00:00:00Z", points: 11,
  sources: {
    amount: accounts("D41PAY", "MIO_EUR"),
    ratio: accounts("D41PAY", "PC_GDP"),
    revenue: accounts("TR", "MIO_EUR"),
    population: { dataset: "demo_gind", filters: { freq: "A", indic_de: "AVG" } },
  },
  metadata: "https://ec.europa.eu/eurostat/cache/metadata/en/gov_10a_main_esms.htm",
  populationMetadata: "https://ec.europa.eu/eurostat/cache/metadata/en/demo_gind_esms.htm",
  accounting: "https://eur-lex.europa.eu/eli/reg/2013/549/oj/eng",
  modes: ["ratio", "amount", "perCapita", "revenueShare"],
});

const round = (value, digits = 1) => Number.isFinite(value) ? Number(value.toFixed(digits)) : null;
const flags = (...values) => [...new Set(values.join("").split(""))].sort().join("");
const divide = (numerator, denominator, factor = 1) => Number.isFinite(numerator) && Number.isFinite(denominator) && denominator > 0 ? numerator / denominator * factor : null;

function interestPoints(snapshot, code) {
  const row = snapshot.countries[code];
  return snapshot.years.map((year, i) => {
    const amount = Number.isFinite(row?.amount[i]) ? row.amount[i] * 1e6 : null;
    const revenue = Number.isFinite(row?.revenue[i]) ? row.revenue[i] * 1e6 : null;
    const amountStatus = row?.amountStatus[i] || "";
    return { year, amount, ratio: row?.ratio[i] ?? null, revenue, population: row?.population[i] ?? null,
      perCapita: divide(amount, row?.population[i]), revenueShare: divide(amount, revenue, 100),
      amountStatus, ratioStatus: row?.ratioStatus[i] || "", revenueStatus: row?.revenueStatus[i] || "", populationStatus: row?.populationStatus[i] || "",
      perCapitaStatus: flags(amountStatus, row?.populationStatus[i] || ""), revenueShareStatus: flags(amountStatus, row?.revenueStatus[i] || ""),
    };
  });
}

function interestChange(points, endYear, years = 1, metric = "amount") {
  if (!INTEREST.modes.includes(metric) || !Number.isInteger(years) || years < 1) throw new Error("Invalid interest comparison");
  const startYear = String(Number(endYear) - years);
  const first = points.find(p => p.year === startYear), last = points.find(p => p.year === endYear);
  const selected = points.filter(p => p.year >= startYear && p.year <= endYear);
  const status = flags(...selected.map(p => p[`${metric}Status`] || ""));
  const comparable = Number.isFinite(first?.[metric]) && Number.isFinite(last?.[metric]) && !/[bdf]/i.test(status);
  const rawChange = comparable ? last[metric] - first[metric] : null;
  return { startYear, endYear, first: first?.[metric] ?? null, last: last?.[metric] ?? null, status,
    change: round(rawChange, metric === "amount" || metric === "perCapita" ? 0 : 1),
    percent: round(divide(rawChange, first?.[metric], 100)),
  };
}

function interestRows(snapshot, mode = "ratio") {
  if (!INTEREST.modes.includes(mode)) throw new Error("Invalid interest ranking");
  const rows = EU27.map(code => {
    const points = interestPoints(snapshot, code), latest = points.at(-1);
    return { code, ...latest, previous: points.at(-2), annualChange: interestChange(points, snapshot.latestYear),
      ratioChange: interestChange(points, snapshot.latestYear, 1, "ratio"),
      sortValue: round(latest[mode], ["amount", "perCapita"].includes(mode) ? 0 : 1) };
  }).sort((a, b) => (b.sortValue ?? -Infinity) - (a.sortValue ?? -Infinity) || a.code.localeCompare(b.code, "en"));
  let rank = null;
  return rows.map((row, i) => {
    if (row.sortValue !== null && (i === 0 || row.sortValue !== rows[i - 1].sortValue)) rank = i + 1;
    return { ...row, rank: row.sortValue === null ? null : rank };
  });
}

function interestAggregate(snapshot) {
  const rows = interestRows(snapshot);
  if (rows.some(row => !Number.isFinite(row.amount) || !Number.isFinite(row.population) || !Number.isFinite(row.revenue))) return null;
  const amount = rows.reduce((sum, row) => sum + row.amount, 0);
  const population = rows.reduce((sum, row) => sum + row.population, 0);
  const revenue = rows.reduce((sum, row) => sum + row.revenue, 0);
  return { amount, population, revenue, perCapita: divide(amount, population), revenueShare: divide(amount, revenue, 100),
    amountStatus: flags(...rows.map(row => row.amountStatus)), perCapitaStatus: flags(...rows.map(row => row.perCapitaStatus)), revenueShareStatus: flags(...rows.map(row => row.revenueShareStatus)) };
}

// Descriptive GDP bands, without a legal or sustainability threshold.
function interestBand(ratio) {
  if (!Number.isFinite(ratio)) return "missing";
  return ratio < 1 ? "low" : ratio < 2 ? "medium" : ratio < 3 ? "high" : "highest";
}
module.exports = { INTEREST, interestPoints, interestChange, interestRows, interestAggregate, interestBand };
