const { EU27 } = require("./indicators");
const { countryGrowthPoints, endpointChange } = require("./growth");
const { perCapitaRows } = require("./per-capita");
const { interestPoints, interestChange, interestAggregate } = require("./interest");
const { accountPoints, accountChange, edpComparison } = require("./accounts");

const COUNTRY_DASHBOARD_REVIEWED = "2026-09-07T00:00:00Z";
const PEER_CODES = ["DE", "FR", "IT", "ES"];
const flags = (...values) => [...new Set(values.join("").split(""))].sort().join("");
const usable = point => Number.isFinite(point?.value) && !/[bdf]/i.test(point.status || "");
const point = (value, status = "") => ({ value: Number.isFinite(value) ? value : null, status });
const round = value => Number.isFinite(value) ? Number(value.toFixed(1)) : null;

function rankPoints(points, code) {
  const rows = points.filter(usable).map(row => ({ ...row, value: round(row.value) }));
  const current = rows.find(row => row.code === code);
  return { rank: current ? rows.filter(row => row.value > current.value).length + 1 : null, count: rows.length };
}

// Every comparison carries its own period and source. No common year is inferred.
function countryDashboard(code, { growth, balance, interest, accounts, perCapita }) {
  if (!EU27.includes(code)) throw new Error("Unknown EU country");
  const debtPoints = countryGrowthPoints(growth, code), debt = debtPoints.at(-1);
  const debtRanks = rankPoints(EU27.map(c => ({ code: c, ...point(growth.countries[c]?.ratio.at(-1), growth.countries[c]?.ratioStatus.at(-1)) })), code);
  const annual = accountPoints(accounts, code).at(-1), annualEu = accountPoints(accounts, "EU27_2020").at(-1);
  const interestSeries = interestPoints(interest, code), cost = interestSeries.at(-1), interestEu = interestAggregate(interest);
  const capita = perCapitaRows(perCapita).find(row => row.code === code);
  const edp = balance.series[code]?.[balance.latestCompleteYear] || {};
  const edpEu = balance.series.EU27_2020?.[balance.latestCompleteYear] || {};
  const edpPoints = balance.years.map(year => ({ year, balanceRatio: balance.series[code]?.[year]?.balance ?? null, balanceRatioStatus: balance.series[code]?.[year]?.balanceStatus || "" }));
  const sources = {
    debt: { dataset: "gov_10q_ggdebt", accessed: growth.fetchedAt, method: "debt-growth-methodology" },
    balance: { dataset: "gov_10dd_edpt1", accessed: balance.fetchedAt, method: "budget-balance-methodology" },
    perCapita: { dataset: "gov_10dd_edpt1 + demo_gind", accessed: perCapita.fetchedAt, method: "debt-per-capita-methodology" },
    interest: { dataset: "gov_10a_main", accessed: interest.fetchedAt, method: "interest-cost-methodology" },
    accounts: { dataset: "gov_10a_main", accessed: accounts.fetchedAt, method: "government-accounts-methodology" },
  };
  const metrics = [
    { key: "debt", ...point(debt.debt, debt.debtStatus), type: "compact", period: growth.latestQuarter, source: sources.debt },
    { key: "debtRatio", ...point(debt.ratio, debt.ratioStatus), type: "percent", period: growth.latestQuarter, source: sources.debt },
    { key: "perCapita", ...point(capita?.displayValue, capita?.status), type: "eur", period: perCapita.debtDate, source: sources.perCapita, calculated: true },
    { key: "balance", ...point(edp.balance, edp.balanceStatus), type: "percent", period: balance.latestCompleteYear, source: sources.balance },
    { key: "interest", ...point(cost.amount, cost.amountStatus), type: "compact", secondary: point(cost.ratio, cost.ratioStatus), period: interest.latestYear, source: sources.interest },
    { key: "expenditure", ...point(annual.expenditureRatio, annual.expenditureRatioStatus), type: "percent", secondary: point(annual.expenditure, annual.expenditureStatus), period: accounts.latestYear, source: sources.accounts },
    { key: "revenue", ...point(annual.revenueRatio, annual.revenueRatioStatus), type: "percent", secondary: point(annual.revenue, annual.revenueStatus), period: accounts.latestYear, source: sources.accounts },
  ];
  const comparisonDefinitions = [
    { key: "annualDebtRatio", period: balance.latestCompleteYear, source: sources.balance, eu: point(edpEu.debtRatio, edpEu.debtStatus), get: c => point(balance.series[c]?.[balance.latestCompleteYear]?.debtRatio, balance.series[c]?.[balance.latestCompleteYear]?.debtStatus) },
    { key: "balance", period: balance.latestCompleteYear, source: sources.balance, eu: point(edpEu.balance, edpEu.balanceStatus), get: c => point(balance.series[c]?.[balance.latestCompleteYear]?.balance, balance.series[c]?.[balance.latestCompleteYear]?.balanceStatus) },
    ...["expenditure", "revenue"].map(key => ({ key, period: accounts.latestYear, source: sources.accounts, eu: point(annualEu[`${key}Ratio`], annualEu[`${key}RatioStatus`]), get: c => { const row = accountPoints(accounts, c).at(-1); return point(row[`${key}Ratio`], row[`${key}RatioStatus`]); } })),
    { key: "interestRevenue", period: interest.latestYear, source: sources.interest, calculated: true, eu: point(interestEu?.revenueShare, interestEu?.revenueShareStatus), get: c => { const row = interestPoints(interest, c).at(-1); return point(row.revenueShare, row.revenueShareStatus); } },
  ];
  const comparisons = comparisonDefinitions.map(def => {
    const current = def.get(code), rows = EU27.map(c => ({ code: c, ...def.get(c) }));
    return { key: def.key, period: def.period, source: def.source, calculated: Boolean(def.calculated), current, eu: def.eu,
      gap: usable(current) && usable(def.eu) ? round(current.value - def.eu.value) : null,
      status: flags(current.status, def.eu.status), ...rankPoints(rows, code) };
  });
  const peers = [code, ...PEER_CODES.filter(c => c !== code)].map(c => ({ code: c, values: comparisonDefinitions.map(def => def.get(c)) }));
  return { code, metrics, comparisons, peers, debtRanks,
    ratioChange: endpointChange(debtPoints, growth.latestQuarter, 5, "ratio"),
    debtChange: endpointChange(debtPoints, growth.latestQuarter, 5, "debt"),
    balanceChange: accountChange(edpPoints, balance.latestCompleteYear, "balanceRatio"),
    interestChange: interestChange(interestSeries, interest.latestYear),
    sourceDifference: edpComparison(accounts, balance, code),
  };
}
module.exports = { COUNTRY_DASHBOARD_REVIEWED, PEER_CODES, rankPoints, countryDashboard };
