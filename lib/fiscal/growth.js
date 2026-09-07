const { EU27 } = require("./indicators");

const GROWTH = Object.freeze({
  id: "debt-growth", dataset: "gov_10q_ggdebt", reviewedAt: "2026-09-06T00:00:00Z",
  filters: { freq: "Q", sector: "S13", na_item: "GD" },
  units: { debt: "MIO_EUR", ratio: "PC_GDP" },
  metadata: "https://ec.europa.eu/eurostat/cache/metadata/en/gov_10q_ggdebt_esms.htm",
  horizons: [1, 5, 10], points: 41,
});
function quarterIndex(quarter) {
  const match = /^(\d{4})-Q([1-4])$/.exec(quarter || "");
  return match ? Number(match[1]) * 4 + Number(match[2]) - 1 : null;
}
function shiftQuarter(quarter, steps) {
  const index = quarterIndex(quarter);
  if (index === null || !Number.isInteger(steps)) return null;
  const shifted = index + steps;
  return `${Math.floor(shifted / 4)}-Q${shifted % 4 + 1}`;
}
function quarterEnd(quarter) {
  const index = quarterIndex(quarter);
  if (index === null) return null;
  return new Date(Date.UTC(Math.floor(index / 4), (index % 4 + 1) * 3, 0)).toISOString().slice(0, 10);
}
const rounded = (value, digits = 1) => Number.isFinite(value) ? Number(value.toFixed(digits)) : null;

function countryGrowthPoints(snapshot, code) {
  const row = snapshot.countries[code];
  return snapshot.periods.map((quarter, i) => ({ quarter,
    debt: Number.isFinite(row?.debt[i]) ? row.debt[i] * 1e6 : null,
    ratio: row?.ratio[i] ?? null,
    debtStatus: row?.debtStatus[i] || "", ratioStatus: row?.ratioStatus[i] || "",
  }));
}
function endpointChange(points, end, years, metric) {
  const start = shiftQuarter(end, -4 * years);
  const selected = points.filter(p => p.quarter >= start && p.quarter <= end);
  const first = selected.find(p => p.quarter === start);
  const last = selected.find(p => p.quarter === end);
  const flagKey = `${metric}Status`;
  const reason = !first || !last || !Number.isFinite(first[metric]) || !Number.isFinite(last[metric])
    ? "missing" : selected.some(p => /[bdf]/i.test(p[flagKey] || "")) ? "break" : null;
  const change = reason ? null : metric === "ratio" ? rounded(last[metric] - first[metric]) : Math.round(last[metric] - first[metric]);
  return { start, end, first: first?.[metric] ?? null, last: last?.[metric] ?? null, change,
    firstStatus: first?.[flagKey] || "", lastStatus: last?.[flagKey] || "",
    percent: metric === "debt" && change !== null && first.debt > 0 ? rounded(change / first.debt * 100) : null,
    status: [...new Set(selected.flatMap(p => (p[flagKey] || "").split("")))].sort().join(""), reason };
}
function growthRows(snapshot, years = 5, mode = "percent") {
  if (!GROWTH.horizons.includes(years) || !["percent", "absolute", "ratioUp", "ratioDown"].includes(mode)) throw new Error("Invalid growth comparison");
  const rows = EU27.map(code => {
    const points = countryGrowthPoints(snapshot, code);
    const debt = endpointChange(points, snapshot.latestQuarter, years, "debt");
    const ratio = endpointChange(points, snapshot.latestQuarter, years, "ratio");
    const value = mode === "absolute" ? debt.change : mode === "percent" ? debt.percent : ratio.change;
    return { code, debt, ratio, value, divergence: debt.change > 0 && ratio.change < 0 };
  });
  const direction = mode === "ratioDown" ? 1 : -1;
  rows.sort((a, b) => (a.value === null) - (b.value === null) ||
    (a.value !== null && b.value !== null ? direction * (a.value - b.value) : 0) || a.code.localeCompare(b.code, "en"));
  let rank = null;
  return rows.map((row, i) => {
    if (row.value !== null && (i === 0 || row.value !== rows[i - 1].value)) rank = i + 1;
    return { ...row, rank: row.value === null ? null : rank };
  });
}

// A compact, server-prepared projection for existing five-year charts.
function fiveYearOverview(snapshot) {
  const start = shiftQuarter(snapshot.latestQuarter, -20);
  const indexes = snapshot.periods.map((q, i) => [q, i]).filter(([q]) => q >= start);
  if (indexes.length !== 21 || indexes[0][0] !== start) throw new Error("Five-year overview needs 21 exact quarters");
  const quarters = indexes.map(([quarter, i]) => {
    if (EU27.some(c => !Number.isFinite(snapshot.countries[c].debt[i]) || /[bdf]/i.test(snapshot.countries[c].debtStatus[i]))) throw new Error("Incomplete or non-comparable EU debt overview");
    return { quarter, totalDebtEUR: EU27.reduce((sum, c) => sum + snapshot.countries[c].debt[i] * 1e6, 0) };
  });
  const latest = quarters.at(-1);
  const lastIndex = snapshot.periods.indexOf(latest.quarter);
  const latestBreakdown = EU27.map(code => ({ code, valueEUR: snapshot.countries[code].debt[lastIndex] * 1e6 }))
    .map(row => ({ ...row, sharePct: row.valueEUR / latest.totalDebtEUR * 100 })).sort((a, b) => b.valueEUR - a.valueEUR);
  return { quarters, latestQuarter: latest.quarter, latestTotalDebtEUR: latest.totalDebtEUR, latestBreakdown,
    provisional: indexes.some(([, i]) => EU27.some(c => /[pe]/i.test(snapshot.countries[c].debtStatus[i]))) };
}
function trendSegments(points, metric) {
  const segments = [];
  let current = [];
  points.forEach((point, index) => {
    if (!Number.isFinite(point[metric]) || /[bdf]/i.test(point[`${metric}Status`] || "")) {
      if (current.length) segments.push(current);
      current = [];
    }
    if (Number.isFinite(point[metric]) && !/f/i.test(point[`${metric}Status`] || "")) current.push({ index, value: point[metric] });
  });
  if (current.length) segments.push(current);
  return segments;
}
module.exports = { GROWTH, quarterIndex, shiftQuarter, quarterEnd, countryGrowthPoints, endpointChange, growthRows, fiveYearOverview, trendSegments };
