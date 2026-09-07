const { EU27 } = require("./indicators");

const source = (na_item, unit) => ({ dataset: "gov_10a_main", filters: { freq: "A", sector: "S13", na_item, unit } });
const ACCOUNTS = Object.freeze({
  id: "government-spending", reviewedAt: "2026-09-06T00:00:00Z", points: 11,
  geographies: [...EU27, "EU27_2020"],
  sources: {
    expenditure: source("TE", "MIO_EUR"), expenditureRatio: source("TE", "PC_GDP"),
    revenue: source("TR", "MIO_EUR"), revenueRatio: source("TR", "PC_GDP"),
    balance: source("B9", "MIO_EUR"), balanceRatio: source("B9", "PC_GDP"),
  },
  metadata: "https://ec.europa.eu/eurostat/cache/metadata/en/gov_10a_main_esms.htm",
  overview: "https://ec.europa.eu/eurostat/web/government-finance-statistics",
  modes: ["expenditureRatio", "revenueRatio", "balanceRatio"],
  // Half a published unit per term: conservatively allow whole-million euro reporting.
  amountIdentityTolerance: 1.5, ratioIdentityTolerance: .15,
});
const round = value => Number.isFinite(value) ? Number(value.toFixed(1)) : null;
const combineFlags = (...flags) => [...new Set(flags.join("").split(""))].sort().join("");

function accountPoints(snapshot, code) {
  const row = code === "EU27_2020" ? snapshot.eu : snapshot.countries[code];
  return snapshot.years.map((year, i) => ({ year, ...Object.fromEntries(Object.keys(ACCOUNTS.sources).flatMap(key => [
    [key, Number.isFinite(row?.[key]?.[i]) ? row[key][i] * (key.endsWith("Ratio") ? 1 : 1e6) : null],
    [`${key}Status`, row?.[`${key}Status`]?.[i] || ""],
  ])) }));
}
function accountChange(points, year, metric, years = 1) {
  if (!ACCOUNTS.sources[metric] || !Number.isInteger(years) || years < 1) throw new Error("Invalid account comparison");
  const startYear = String(Number(year) - years), first = points.find(p => p.year === startYear), last = points.find(p => p.year === year);
  const status = combineFlags(...points.filter(p => p.year >= startYear && p.year <= year).map(p => p[`${metric}Status`]));
  const valid = Number.isFinite(first?.[metric]) && Number.isFinite(last?.[metric]) && !/[bdf]/i.test(status);
  const delta = valid ? last[metric] - first[metric] : null;
  return { startYear, endYear: year, change: metric.endsWith("Ratio") ? round(delta) : Number.isFinite(delta) ? Math.round(delta) : null, status };
}
function accountRows(snapshot, mode = "expenditureRatio") {
  if (!ACCOUNTS.modes.includes(mode)) throw new Error("Invalid account ranking");
  const eu = accountPoints(snapshot, "EU27_2020").at(-1);
  let rank = null;
  return EU27.map(code => {
    const points = accountPoints(snapshot, code), row = points.at(-1), change = accountChange(points, snapshot.latestYear, mode);
    return { code, ...row, previous: points.at(-2)?.[mode] ?? null, previousStatus: points.at(-2)?.[`${mode}Status`] || "", change,
      euGap: Number.isFinite(row[mode]) && Number.isFinite(eu[mode]) ? round(row[mode] - eu[mode]) : null,
      euGapStatus: combineFlags(row[`${mode}Status`], eu[`${mode}Status`]), sortValue: round(row[mode]) };
  }).sort((a, b) => (b.sortValue ?? -Infinity) - (a.sortValue ?? -Infinity) || a.code.localeCompare(b.code, "en")).map((row, i, rows) => {
    if (row.sortValue !== null && (!i || row.sortValue !== rows[i - 1].sortValue)) rank = i + 1;
    return { ...row, rank: row.sortValue === null ? null : rank };
  });
}
function accountBand(value, mode) {
  if (!Number.isFinite(value)) return "missing";
  if (mode === "balanceRatio") return value >= 0 ? "surplus" : value >= -3 ? "deficit" : "largeDeficit";
  return value < 35 ? "low" : value < 45 ? "medium" : value < 55 ? "high" : "highest";
}
function edpComparison(snapshot, edp, code, year = snapshot.latestYear) {
  const accounts = accountPoints(snapshot, code).find(p => p.year === year), official = edp.series[code]?.[year];
  const value = official?.balance ?? null;
  return { year, accounts: accounts?.balanceRatio ?? null, accountsStatus: accounts?.balanceRatioStatus || "", edp: value, edpStatus: official?.balanceStatus || "",
    differenceStatus: combineFlags(accounts?.balanceRatioStatus || "", official?.balanceStatus || ""),
    difference: Number.isFinite(accounts?.balanceRatio) && Number.isFinite(value) ? round(accounts.balanceRatio - value) : null };
}
module.exports = { ACCOUNTS, accountPoints, accountChange, accountRows, accountBand, edpComparison };
