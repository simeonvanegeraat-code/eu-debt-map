const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { countryDashboard, rankPoints, PEER_CODES } = require("../lib/fiscal/country-dashboard");
const { EU27 } = require("../lib/fiscal/indicators");
const data = Object.fromEntries(["growth", "balance", "interest", "accounts", "per-capita"].map(name => [name === "per-capita" ? "perCapita" : name, require(`../lib/fiscal/${name}.gen.json`)]));
const read = file => fs.readFileSync(path.join(__dirname, "..", file), "utf8");

test("country dashboard exposes seven sourced metrics without mixing stock dates and annual flows", () => {
  const before = JSON.stringify(data), fr = countryDashboard("FR", data);
  assert.equal(fr.metrics.length, 7);
  assert.deepEqual(fr.metrics.map(m => m.period), ["2026-Q1", "2026-Q1", "2025-12-31", "2025", "2025", "2025", "2025"]);
  assert.equal(fr.metrics[0].value, 3536067700000);
  assert.equal(fr.metrics[1].value, 117.6);
  assert.equal(fr.metrics[2].value, 50070);
  assert.equal(fr.metrics[3].value, -5.1);
  assert.equal(Math.round(fr.metrics[4].value), 66635900000);
  assert.equal(fr.metrics[5].value, 57.2);
  assert.equal(fr.metrics[6].value, 52.1);
  for (const metric of fr.metrics) {
    assert(metric.source.dataset && metric.source.method);
    assert(Number.isFinite(Date.parse(metric.source.accessed)));
  }
  assert.equal(JSON.stringify(data), before);
  assert.throws(() => countryDashboard("UK", data), /Unknown EU/);
});

test("annual EU comparisons use published aggregates and exact same-source periods", () => {
  const fr = countryDashboard("FR", data);
  const [debt, balance, expenditure, revenue, interest] = fr.comparisons;
  assert.deepEqual([debt.current.value, debt.eu.value, debt.gap, debt.period], [115.6, 81.7, 33.9, "2025"]);
  assert.notEqual(debt.current.value, fr.metrics[1].value);
  assert.equal(balance.gap, -2);
  assert.equal(expenditure.eu.value, 49.5);
  assert.equal(revenue.eu.value, 46.4);
  const totalCost = EU27.reduce((sum, code) => sum + data.interest.countries[code].amount.at(-1), 0);
  const totalRevenue = EU27.reduce((sum, code) => sum + data.interest.countries[code].revenue.at(-1), 0);
  assert(Math.abs(interest.eu.value - totalCost / totalRevenue * 100) < 1e-10);
  assert.equal(interest.calculated, true);
  assert.equal(interest.status, "p");
  assert.equal(debt.calculated, false);
});

test("dashboard ranks use published precision, preserve ties and exclude missing/non-comparable values", () => {
  const points = [{ code: "A", value: 5.12 }, { code: "B", value: 5.11 }, { code: "C", value: 0 }, { code: "D", value: null }, { code: "E", value: 8, status: "d" }];
  assert.deepEqual(rankPoints(points, "A"), { rank: 1, count: 3 });
  assert.deepEqual(rankPoints(points, "B"), { rank: 1, count: 3 });
  assert.deepEqual(rankPoints(points, "C"), { rank: 3, count: 3 });
  assert.deepEqual(rankPoints(points, "E"), { rank: null, count: 3 });
  const fixture = structuredClone(data);
  fixture.accounts.countries.FR.expenditureRatioStatus[10] = "d";
  const spending = countryDashboard("FR", fixture).comparisons.find(row => row.key === "expenditure");
  assert.equal(spending.current.value, 57.2);
  assert.equal(spending.gap, null);
  assert.equal(spending.rank, null);
  assert.equal(spending.count, 26);
});

test("deterministic insights carry exact periods and suppress broken or missing comparisons", () => {
  const fr = countryDashboard("FR", data);
  assert.deepEqual(fr.debtRanks, { rank: 3, count: 27 });
  assert.equal(fr.ratioChange.start, "2021-Q1");
  assert.equal(fr.ratioChange.end, "2026-Q1");
  assert.equal(fr.ratioChange.change, -0.1);
  assert.equal(fr.ratioChange.status, "p");
  assert.equal(fr.balanceChange.change, 0.7);
  assert.equal(fr.interestChange.percent, 10.8);
  const fixture = structuredClone(data);
  fixture.growth.countries.FR.ratioStatus[25] = "b";
  fixture.balance.series.FR["2024"].balanceStatus = "d";
  fixture.interest.countries.FR.amount[9] = 0;
  const changed = countryDashboard("FR", fixture);
  assert.equal(changed.ratioChange.change, null);
  assert.equal(changed.balanceChange.change, null);
  assert.equal(changed.interestChange.percent, null);
  fixture.balance.series.FR["2024"].balance = null;
  assert.equal(countryDashboard("FR", fixture).balanceChange.change, null);
});

test("dashboard preserves EDP balance and visibly carries annual-account reconciliation", () => {
  const fi = countryDashboard("FI", data);
  assert.equal(fi.metrics.find(m => m.key === "balance").value, -3.4);
  assert.equal(fi.sourceDifference.accounts, -3.9);
  assert.equal(fi.sourceDifference.edp, -3.4);
  assert.equal(fi.sourceDifference.difference, -0.5);
  assert.equal(fi.sourceDifference.year, "2025");
  const fixture = structuredClone(data);
  fixture.accounts.latestYear = "2024";
  fixture.accounts.years = fixture.accounts.years.map(year => String(Number(year) - 1));
  const mixed = countryDashboard("FI", fixture);
  assert.equal(mixed.metrics.find(m => m.key === "balance").period, "2025");
  assert.equal(mixed.comparisons.find(m => m.key === "expenditure").period, "2024");
  assert.equal(mixed.sourceDifference.year, "2024");
  assert.equal(mixed.sourceDifference.edp, data.balance.series.FI["2024"].balance);
});

test("all EU profiles have a stable peer group without duplicate current countries or EU ranks", () => {
  for (const code of EU27) {
    const result = countryDashboard(code, data);
    assert.equal(result.peers[0].code, code);
    assert.equal(new Set(result.peers.map(p => p.code)).size, result.peers.length);
    assert.deepEqual(result.peers.slice(1).map(p => p.code), PEER_CODES.filter(p => p !== code));
    assert(result.comparisons.every(row => row.count === 27 && row.rank >= 1 && row.rank <= 27));
  }
});

test("localized routes compose the dashboard on the server and retain previous indicator functionality", () => {
  for (const lang of ["en", "nl", "de", "fr"]) {
    const root = lang === "en" ? "app" : `app/${lang}`;
    const route = read(`${root}/country/[code]/page.jsx`);
    assert.match(route, new RegExp(`createCountryFiscalSlots\\(country.code, "${lang}"\\)`));
    for (const prop of ["fiscalOverviewSlot", "fiscalTrendsSlot", "fiscalComparisonSlot"]) assert(route.includes(`${prop}={fiscal.`));
    assert(route.includes("generateMetadata") && route.includes("generateStaticParams") && route.includes("notFound()"));
  }
  const dashboard = read("components/country/CountryFiscalDashboard.jsx");
  assert(!dashboard.includes('"use client"'));
  for (const feature of ["CountryGrowth", "CountryBalance", "CountryInterest", "CountryAccounts", "CountryPerCapita", "AccountSourceDifference"]) assert(dashboard.includes(`<${feature}`));
  assert.match(dashboard, /<CountryGrowth[^>]+showHistory/);
  assert.match(dashboard, /<CountryInterest[^>]+showHistory/);
  assert.match(read("app/sitemap.js"), /COUNTRY_DASHBOARD_REVIEWED/);
});
