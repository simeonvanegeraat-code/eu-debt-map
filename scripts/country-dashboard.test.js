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
  assert.deepEqual(fr.metrics.map(m => m.period), [data.growth.latestQuarter, data.growth.latestQuarter,
    data.perCapita.debtDate, data.balance.latestCompleteYear, data.interest.latestYear,
    data.accounts.latestYear, data.accounts.latestYear]);
  assert.equal(fr.metrics[0].value, data.growth.countries.FR.debt.at(-1) * 1e6);
  assert.equal(fr.metrics[1].value, data.growth.countries.FR.ratio.at(-1));
  assert.equal(fr.metrics[2].value, Math.round(data.perCapita.countries.FR.debtMioEur * 1e6 / data.perCapita.countries.FR.population));
  assert.equal(fr.metrics[3].value, data.balance.series.FR[data.balance.latestCompleteYear].balance);
  assert.equal(fr.metrics[4].value, data.interest.countries.FR.amount.at(-1) * 1e6);
  assert.equal(fr.metrics[5].value, data.accounts.countries.FR.expenditureRatio.at(-1));
  assert.equal(fr.metrics[6].value, data.accounts.countries.FR.revenueRatio.at(-1));
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
  const year = data.balance.latestCompleteYear;
  const annual = data.balance.series.FR[year], eu = data.balance.series.EU27_2020[year];
  assert.deepEqual([debt.current.value, debt.eu.value, debt.gap, debt.period],
    [annual.debtRatio, eu.debtRatio, Number((annual.debtRatio - eu.debtRatio).toFixed(1)), year]);
  assert.equal(balance.gap, Number((annual.balance - eu.balance).toFixed(1)));
  assert.equal(expenditure.eu.value, data.accounts.eu.expenditureRatio.at(-1));
  assert.equal(revenue.eu.value, data.accounts.eu.revenueRatio.at(-1));
  const totalCost = EU27.reduce((sum, code) => sum + data.interest.countries[code].amount.at(-1), 0);
  const totalRevenue = EU27.reduce((sum, code) => sum + data.interest.countries[code].revenue.at(-1), 0);
  assert(Math.abs(interest.eu.value - totalCost / totalRevenue * 100) < 1e-10);
  assert.equal(interest.calculated, true);
  const interestFlags = [...new Set(EU27.flatMap(code =>
    `${data.interest.countries[code].amountStatus.at(-1)}${data.interest.countries[code].revenueStatus.at(-1)}`.split("")))].sort().join("");
  assert.equal(interest.status, interestFlags);
  assert.equal(debt.calculated, false);
});

test("dashboard ranks use published precision, preserve ties and exclude missing/non-comparable values", () => {
  const points = [{ code: "A", value: 5.12 }, { code: "B", value: 5.11 }, { code: "C", value: 0 }, { code: "D", value: null }, { code: "E", value: 8, status: "d" }];
  assert.deepEqual(rankPoints(points, "A"), { rank: 1, count: 3 });
  assert.deepEqual(rankPoints(points, "B"), { rank: 1, count: 3 });
  assert.deepEqual(rankPoints(points, "C"), { rank: 3, count: 3 });
  assert.deepEqual(rankPoints(points, "E"), { rank: null, count: 3 });
  const fixture = structuredClone(data);
  fixture.accounts.countries.FR.expenditureRatioStatus[fixture.accounts.years.length - 1] = "d";
  const spending = countryDashboard("FR", fixture).comparisons.find(row => row.key === "expenditure");
  assert.equal(spending.current.value, fixture.accounts.countries.FR.expenditureRatio.at(-1));
  assert.equal(spending.gap, null);
  assert.equal(spending.rank, null);
  assert.equal(spending.count, 26);
});

test("deterministic insights carry exact periods and suppress broken or missing comparisons", () => {
  const fixture = structuredClone(data);
  const last = fixture.growth.periods.length - 1, start = last - 20;
  const year = fixture.balance.latestCompleteYear, previousYear = String(Number(year) - 1);
  const interestLast = fixture.interest.years.length - 1;
  fixture.growth.countries.FR.ratio[start] = 117.7;
  fixture.growth.countries.FR.ratio[last] = 117.6;
  fixture.growth.countries.FR.ratioStatus.fill("p");
  fixture.balance.series.FR[year].balance = -5.1;
  fixture.balance.series.FR[previousYear].balance = -5.8;
  fixture.balance.series.FR[year].balanceStatus = "p";
  fixture.balance.series.FR[previousYear].balanceStatus = "";
  fixture.interest.countries.FR.amount[interestLast - 1] = 100;
  fixture.interest.countries.FR.amount[interestLast] = 110.8;
  fixture.interest.countries.FR.amountStatus.fill("");
  const fr = countryDashboard("FR", fixture);
  assert.deepEqual(fr.debtRanks, rankPoints(EU27.map(code => ({ code,
    value: fixture.growth.countries[code].ratio.at(-1), status: fixture.growth.countries[code].ratioStatus.at(-1) })), "FR"));
  assert.equal(fr.ratioChange.start, fixture.growth.periods[start]);
  assert.equal(fr.ratioChange.end, fixture.growth.latestQuarter);
  assert.equal(fr.ratioChange.change, -0.1);
  assert.equal(fr.ratioChange.status, "p");
  assert.equal(fr.balanceChange.change, 0.7);
  assert.equal(fr.interestChange.percent, 10.8);
  fixture.growth.countries.FR.ratioStatus[start + 1] = "b";
  fixture.balance.series.FR[previousYear].balanceStatus = "d";
  fixture.interest.countries.FR.amount[interestLast - 1] = 0;
  const changed = countryDashboard("FR", fixture);
  assert.equal(changed.ratioChange.change, null);
  assert.equal(changed.balanceChange.change, null);
  assert.equal(changed.interestChange.percent, null);
  fixture.balance.series.FR[previousYear].balance = null;
  assert.equal(countryDashboard("FR", fixture).balanceChange.change, null);
});

test("dashboard preserves EDP balance and visibly carries annual-account reconciliation", () => {
  const fixture = structuredClone(data);
  const year = fixture.accounts.latestYear, previousYear = String(Number(year) - 1);
  fixture.balance.series.FI[year].balance = -3.4;
  fixture.accounts.countries.FI.balanceRatio[fixture.accounts.years.length - 1] = -3.9;
  const fi = countryDashboard("FI", fixture);
  assert.equal(fi.metrics.find(m => m.key === "balance").value, -3.4);
  assert.equal(fi.sourceDifference.accounts, -3.9);
  assert.equal(fi.sourceDifference.edp, -3.4);
  assert.equal(fi.sourceDifference.difference, -0.5);
  assert.equal(fi.sourceDifference.year, year);
  fixture.accounts.latestYear = previousYear;
  fixture.accounts.years = fixture.accounts.years.map(year => String(Number(year) - 1));
  const mixed = countryDashboard("FI", fixture);
  assert.equal(mixed.metrics.find(m => m.key === "balance").period, fixture.balance.latestCompleteYear);
  assert.equal(mixed.comparisons.find(m => m.key === "expenditure").period, previousYear);
  assert.equal(mixed.sourceDifference.year, previousYear);
  assert.equal(mixed.sourceDifference.edp, fixture.balance.series.FI[previousYear].balance);
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

test("localized country routes use the compact server-rendered dashboard and retain topic functionality", () => {
  for (const lang of ["en", "nl", "de", "fr"]) {
    const root = lang === "en" ? "app" : `app/${lang}`;
    const route = read(`${root}/country/[code]/page.jsx`);
    assert.match(route, /<CountryPublicPage/);
    assert.doesNotMatch(route, /createCountryFiscalSlots/);
    assert(route.includes("generateMetadata") && route.includes("generateStaticParams") && route.includes("notFound()"));
  }
  const publicPage = read("components/country/CountryPublicPage.jsx");
  const experience = read("components/country-preview/CountryPreviewExperience.jsx");
  assert.doesNotMatch(publicPage, /^"use client"/);
  assert.match(publicPage, /CountryPreviewExperience/);
  assert.match(publicPage, /animateSnapshotMetrics/);
  assert.match(publicPage, /animateCountryNavigation/);
  assert.match(experience, /formattedValue=/);
  assert.match(experience, /metricValue\(officialDebt/);
  assert.match(experience, /metricValue\(quarterChange/);
  assert.match(experience, /metricValue\(pace/);
  assert.match(experience, /animateMetrics=\{animateSnapshotMetrics\}/);
  assert.match(read("components/country-preview/CountryDebtTrend.jsx"), /<AnimatedMetricValue/);
  for (const route of ["debt-per-capita", "debt-growth", "deficit", "interest-cost", "government-spending", "debt-to-gdp"]) {
    assert.match(experience, new RegExp(route));
  }
  assert.match(read("app/sitemap.js"), /COUNTRY_DASHBOARD_REVIEWED/);
});

test("country profiles retain their localized debt-first SEO framing", () => {
  const publicPage = read("components/country/CountryPublicPage.jsx");
  const experience = read("components/country-preview/CountryPreviewExperience.jsx");
  const hero = read("components/country-preview/CountryPreviewHero.jsx");
  assert.match(publicPage, /titleOverride \|\| pageTitleFor/);
  assert.match(publicPage, /title=\{title\}/);
  assert.match(hero, /<h1 id="country-page-title">\{title\}<\/h1>/);
  assert.match(hero, /<p className=\{styles\.heroIntro\}>\{copy\.lede\}<\/p>/);
  assert.match(experience, /introSlot \|\| <CountryIntro/);
});
