const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { EU27 } = require("../lib/fiscal/indicators");
const { ACCOUNTS, accountPoints, accountChange, accountRows, accountBand, edpComparison } = require("../lib/fiscal/accounts");
const { annualRequestUrl, parseAnnualSource } = require("./eurostat-annual-source");
const { KINDS, requestUrl, buildSnapshot, validateSnapshot } = require("./eurostat-accounts-core");
const { updateAccounts } = require("./update-eurostat-accounts");
const { trendSegments } = require("../lib/fiscal/growth");
const saved = require("../lib/fiscal/accounts.gen.json");
const edp = require("../lib/fiscal/balance.gen.json");
const NOW = "2026-09-06T20:00:00Z", UPDATED = "2026-07-21T11:00:00+0200";
const years = Array.from({ length: 11 }, (_, i) => String(2015 + i));
function value(kind, i, j) {
  const expenditure = 400 + i * 10 + j, revenue = 380 + i * 9 + j;
  return (kind.startsWith("expenditure") ? expenditure : kind.startsWith("revenue") ? revenue : revenue - expenditure) / (kind.endsWith("Ratio") ? 10 : 1);
}
function fixture(kind) {
  const def = ACCOUNTS.sources[kind], geos = ACCOUNTS.geographies;
  const categories = { time: years, geo: geos.map(c => c === "GR" ? "EL" : c), ...Object.fromEntries(Object.entries(def.filters).map(([k, v]) => [k, [v]])) };
  return { source: "ESTAT", extension: { id: "GOV_10A_MAIN" }, updated: UPDATED, id: Object.keys(categories), size: Object.values(categories).map(v => v.length),
    dimension: Object.fromEntries(Object.entries(categories).map(([k, v]) => [k, { category: { index: Object.fromEntries(v.map((x, i) => [x, i])) } }])),
    value: Object.fromEntries(years.flatMap((year, i) => geos.map((c, j) => [i * geos.length + j, c === "EU27_2020" ? EU27.reduce((s, code, n) => s + value(kind, i, n), 0) / (kind.endsWith("Ratio") ? 27 : 1) : value(kind, i, j)]))), status: { 280: "p" },
  };
}
const fixtures = () => Object.fromEntries(KINDS.map(k => [k, fixture(k)]));
const make = () => buildSnapshot(fixtures(), NOW);

test("government accounts use TE/TR/B9 with annual S13 euro/GDP data and explicit EU geography", () => {
  for (const kind of KINDS) {
    const u = new URL(requestUrl(kind)); assert.equal(u.searchParams.get("sector"), "S13"); assert.equal(u.searchParams.get("freq"), "A");
    assert.equal(u.searchParams.get("unit"), kind.endsWith("Ratio") ? "PC_GDP" : "MIO_EUR");
    assert.equal(u.searchParams.get("na_item"), kind.startsWith("expenditure") ? "TE" : kind.startsWith("revenue") ? "TR" : "B9");
    assert.equal(u.searchParams.getAll("geo").length, 28); assert.ok(u.searchParams.getAll("geo").includes("EL")); assert.ok(u.searchParams.getAll("geo").includes("EU27_2020"));
  }
  assert.equal(new URL(annualRequestUrl(ACCOUNTS.sources.revenue, 11)).searchParams.getAll("geo").length, 27);
  assert.throws(() => parseAnnualSource(fixture("expenditure"), ACCOUNTS.sources.expenditure, NOW), /geography/);
  assert.throws(() => requestUrl("other"));
});

test("government accounts decode shuffled dimensions and preserve Greece, negative balances and flags", () => {
  const s = make(); assert.equal(s.countries.GR.expenditure[0], value("expenditure", 0, EU27.indexOf("GR")));
  assert.equal(s.countries.AT.balance[0], -20); assert.equal(s.countries.AT.expenditureStatus[10], "p");
  assert.equal(s.eu.expenditure.length, 11); assert.equal(Object.keys(s.countries).length, 27);
});

test("government accounts reject wrong source identity, units, sector, frequency and item", () => {
  for (const [axis, wrong] of [["unit", "MIO_NAC"], ["sector", "S1311"], ["freq", "Q"], ["na_item", "D41PAY"]]) {
    const f = fixtures(); f.expenditure.dimension[axis].category.index = { [wrong]: 0 }; assert.throws(() => buildSnapshot(f, NOW), /filter/);
  }
  for (const change of [d => d.source = "OTHER", d => d.extension.id = "GOV_10DD_EDPT1", d => d.updated = "2027-01-01", d => d.id[0] = "unexpected"]) { const f = fixtures(); change(f.expenditure); assert.throws(() => buildSnapshot(f, NOW)); }
});

test("government accounts require aligned releases and complete latest country and EU values", () => {
  const mismatch = fixtures(); mismatch.revenue.updated = "2026-07-20T11:00:00+0200"; assert.throws(() => buildSnapshot(mismatch, NOW), /vintage/);
  for (const [kind, offset] of [["revenue", 280], ["expenditureRatio", 307], ["balance", 290]]) { const f = fixtures(); delete f[kind].value[offset]; assert.throws(() => buildSnapshot(f, NOW), /incomplete/); }
  const forecast = fixtures(); forecast.revenue.status[280] = "f"; assert.throws(() => buildSnapshot(forecast, NOW), /incomplete/);
  const unfinished = make(); unfinished.latestYear = "2026"; assert.throws(() => validateSnapshot(unfinished), /period/);
});

test("government accounts validate revenue minus expenditure with bounded rounding tolerance", () => {
  const small = make(); small.countries.AT.balance[0] += 1.5; small.countries.AT.balanceRatio[0] += .15; validateSnapshot(small);
  for (const [key, amount] of [["balance", 1.51], ["balanceRatio", .151]]) { const wrong = make(); wrong.countries.AT[key][0] += amount; assert.throws(() => validateSnapshot(wrong), /identity/); }
  const eu = make(); eu.eu.expenditure[0] += 100; eu.eu.revenue[0] += 100; assert.throws(() => validateSnapshot(eu), /EU aggregate/);
});

test("government accounts calculate exact annual and five-year changes with input uncertainty", () => {
  const points = accountPoints(make(), "AT"); assert.equal(points[0].expenditure, 400e6);
  assert.equal(accountChange(points, "2025", "expenditure").change, 10e6);
  assert.equal(accountChange(points, "2025", "expenditureRatio", 5).change, 5);
  assert.equal(accountChange(points, "2025", "balanceRatio").change, -.1);
  assert.equal(accountChange(points, "2025", "revenue").status, "p");
  assert.equal(accountChange(points.filter(p => p.year !== "2024"), "2025", "expenditure").change, null);
  assert.throws(() => accountChange(points, "2025", "GDP")); assert.throws(() => accountChange(points, "2025", "revenue", 0));
});

test("government accounts keep gaps null and break only affected history and comparisons", () => {
  const s = make(); s.countries.AT.expenditure[4] = null; validateSnapshot(s);
  s.countries.AT.revenueRatioStatus[8] = "b"; const p = accountPoints(s, "AT");
  assert.equal(p[4].expenditure, null); assert.equal(trendSegments(p, "expenditure").length, 2);
  assert.equal(trendSegments(p, "revenueRatio").length, 2); assert.equal(trendSegments(p, "expenditureRatio").length, 1);
  assert.equal(accountChange(p, "2025", "revenueRatio", 5).change, null); assert.equal(accountChange(p, "2025", "expenditureRatio", 5).change, 5);
});

test("government accounts rankings use displayed ties, omit EU from ranks and use its published comparison", () => {
  const s = make(); s.countries.AT.expenditureRatio[10] = 99.01; s.countries.BE.expenditureRatio[10] = 99.04;
  const rows = accountRows(s); assert.equal(rows[0].rank, 1); assert.equal(rows[1].rank, 1); assert.equal(rows[2].rank, 3); assert.equal(rows.length, 27);
  assert.equal(rows[0].euGap, Number((99.01 - s.eu.expenditureRatio[10]).toFixed(1)));
  for (const mode of ACCOUNTS.modes) assert.equal(accountRows(s, mode).length, 27);
  assert.deepEqual([null, 34.9, 35, 44.9, 45, 54.9, 55].map(v => accountBand(v, "expenditureRatio")), ["missing", "low", "medium", "medium", "high", "high", "highest"]);
  assert.deepEqual([0, -3, -3.1].map(v => accountBand(v, "balanceRatio")), ["surplus", "deficit", "largeDeficit"]);
});

test("government account refreshes cannot lose valid data or regress source/access dates", () => {
  const before = make(), lost = structuredClone(before); lost.countries.AT.revenue[0] = null; assert.throws(() => validateSnapshot(lost, before), /lost previous/);
  assert.throws(() => validateSnapshot({ ...before, fetchedAt: "2026-08-01" }, before), /regression/);
  const outdated = structuredClone(before); for (const source of Object.values(outdated.sources)) source.updated = "2026-07-20T11:00:00+0200"; assert.throws(() => validateSnapshot(outdated, before), /regression/);
  assert.throws(() => validateSnapshot({ ...before, eu: null }), /series/);
});

test("stored government accounts reconcile internally, retain EDP differences and agree with interest revenue", () => {
  validateSnapshot(saved); const interest = require("../lib/fiscal/interest.gen.json");
  if (saved.latestYear === "2025" && saved.sources.expenditure.updated.startsWith("2026-07-21")) {
    const nl = accountPoints(saved, "NL").at(-1), eu = accountPoints(saved, "EU27_2020").at(-1);
    assert.equal(nl.expenditure, 529090e6); assert.equal(nl.revenue, 510195e6); assert.equal(nl.balance, -18895e6);
    assert.equal(eu.expenditureRatio, 49.5); assert.equal(eu.revenueRatio, 46.4); assert.equal(eu.balanceRatio, -3.1);
    if (edp.sourceUpdated.startsWith("2026-04-22")) { const fi = edpComparison(saved, edp, "FI"); assert.equal(fi.accounts, -3.9); assert.equal(fi.edp, -3.4); assert.equal(fi.difference, -.5); assert.equal(edpComparison(saved, edp, "NL").difference, 0); }
  }
  if (interest.sources.revenue.updated === saved.sources.revenue.updated) for (const c of EU27) for (const [i, year] of saved.years.entries()) { const j = interest.years.indexOf(year); if (j >= 0) assert.equal(saved.countries[c].revenue[i], interest.countries[c].revenue[j]); }
  assert.equal(edpComparison(saved, { series: {} }, "NL").difference, null);
  const flagged = structuredClone(saved); flagged.countries.NL.balanceRatioStatus[10] = "p";
  const comparison = edpComparison(flagged, { series: { NL: { [flagged.latestYear]: { balance: 0, balanceStatus: "e" } } } }, "NL");
  assert.equal(comparison.accountsStatus, "p"); assert.equal(comparison.edpStatus, "e"); assert.equal(comparison.differenceStatus, "ep");
});

test("government account updater atomically preserves old data on network or validation failure", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "accounts-update-test-")), target = path.join(dir, "accounts.json"), initial = JSON.stringify(make());
  await fs.writeFile(target, initial);
  const mock = data => async url => { const kind = KINDS.find(k => requestUrl(k) === url); return { ok: true, json: async () => data[kind] }; };
  try {
    await assert.rejects(updateAccounts({ target, now: () => NOW, fetchImpl: async () => ({ ok: false, status: 503 }) })); assert.equal(await fs.readFile(target, "utf8"), initial);
    const bad = fixtures(); bad.balance.value[280] = 500; await assert.rejects(updateAccounts({ target, now: () => NOW, fetchImpl: mock(bad) })); assert.equal(await fs.readFile(target, "utf8"), initial);
    await updateAccounts({ target, now: () => NOW, fetchImpl: mock(fixtures()) }); validateSnapshot(JSON.parse(await fs.readFile(target, "utf8"))); assert.deepEqual(await fs.readdir(dir), ["accounts.json"]);
  } finally { await fs.unlink(target); await fs.rmdir(dir); }
});

test("government accounts integrate four locale routes, country slots and sources with SEO contracts", async () => {
  const read = file => fs.readFile(path.join(__dirname, "..", file), "utf8");
  for (const lang of ["en", "nl", "de", "fr"]) {
    const root = lang === "en" ? "app" : `app/${lang}`;
    assert.match(await read(`${root}/government-spending/page.jsx`), new RegExp(`accountsMetadata\\("${lang}"\\)`));
    assert.match(await read(`${root}/country/[code]/page.jsx`), /CountryPublicPage/);
  }
  assert.match(await read("components/country-preview/CountryPreviewExperience.jsx"), /fiscalPath\("\/government-spending", lang\)/);
  const page = await read("components/fiscal/AccountsPage.jsx"); assert.match(page, /canonical: url/); assert.match(page, /"x-default"/); assert.match(page, /edpComparison/);
  assert.match(await read("components/methodology-preview/MethodologyPreviewPage.jsx"), /<AccountsSource lang={lang} methodology/);
  assert.match(await read("app/sitemap.js"), /urlFor\("\/government-spending", lang\)/);
});
