const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const { EU27 } = require("../lib/fiscal/indicators");
const { INTEREST, interestPoints, interestChange, interestRows, interestAggregate, interestBand } = require("../lib/fiscal/interest");
const { annualRequestUrl, parseAnnualSource } = require("./eurostat-annual-source");
const { KINDS, requestUrl, buildSnapshot, validateSnapshot } = require("./eurostat-interest-core");
const { updateInterest } = require("./update-eurostat-interest");
const { trendSegments } = require("../lib/fiscal/growth");
const saved = require("../lib/fiscal/interest.gen.json");
const NOW = "2026-09-06T10:00:00Z", UPDATED = "2026-07-21T11:00:00+0200";
const years = Array.from({ length: 11 }, (_, i) => String(2015 + i));

function fixture(kind) {
  const definition = INTEREST.sources[kind];
  // Time is deliberately first, rather than relying on Eurostat's usual axis order.
  const categories = { time: years, geo: EU27.map(code => code === "GR" ? "EL" : code), ...Object.fromEntries(Object.entries(definition.filters).map(([key, value]) => [key, [value]])) };
  const id = Object.keys(categories), size = Object.values(categories).map(values => values.length);
  return { source: "ESTAT", extension: { id: definition.dataset.toUpperCase() }, updated: UPDATED, id, size,
    dimension: Object.fromEntries(Object.entries(categories).map(([key, values]) => [key, { category: { index: Object.fromEntries(values.map((value, i) => [value, i])) } }])),
    value: Object.fromEntries(years.flatMap((year, i) => EU27.map((code, j) => [i * 27 + j, kind === "amount" ? 100 + i * 10 + j : kind === "ratio" ? 1 + i * .1 : kind === "revenue" ? 1000 + i * 20 : 1000000 + i * 1000]))), status: { 270: "p" },
  };
}
const fixtures = () => Object.fromEntries(KINDS.map(kind => [kind, fixture(kind)]));
const make = () => buildSnapshot(fixtures(), NOW);

test("interest definitions use annual consolidated accounts and same-year average population", () => {
  for (const kind of KINDS) {
    const url = new URL(requestUrl(kind));
    assert.equal(url.searchParams.get("freq"), "A");
    assert.equal(url.searchParams.getAll("geo").length, 27);
    assert.ok(url.searchParams.getAll("geo").includes("EL"));
    assert.equal(url.searchParams.get("lastTimePeriod"), kind === "population" ? "12" : "11");
  }
  assert.equal(new URL(requestUrl("population")).searchParams.get("indic_de"), "AVG");
  assert.equal(new URL(requestUrl("revenue")).searchParams.get("na_item"), "TR");
  assert.equal(new URL(requestUrl("amount")).searchParams.get("na_item"), "D41PAY");
  assert.throws(() => requestUrl("other"));
  assert.equal(annualRequestUrl(INTEREST.sources.amount, 11), requestUrl("amount"));
});

test("annual adapter decodes dimension coordinates, zero, Greece, flags and unfinished/forecast years", () => {
  const data = fixture("amount"); data.value[0] = 0; data.status[1] = "ep"; data.status[2] = "f";
  const parsed = parseAnnualSource(data, INTEREST.sources.amount, NOW);
  assert.equal(parsed.series[2015].AT.value, 0); assert.equal(parsed.series[2015].BE.status, "ep"); assert.equal(parsed.series[2015].BG.value, null); assert.ok(parsed.series[2015].GR);
  const afterYearEnd = structuredClone(data); afterYearEnd.updated = "2026-01-01T00:00:00Z";
  assert.equal(Object.keys(parseAnnualSource(afterYearEnd, INTEREST.sources.amount, "2026-01-02T00:00:00Z").series).at(-1), "2025");
  const current = fixture("amount"); current.updated = "2025-07-21T11:00:00+0200";
  assert.equal(Object.keys(parseAnnualSource(current, INTEREST.sources.amount, "2025-09-06T10:00:00Z").series).at(-1), "2024");
});

test("interest source validation rejects wrong units, sector, item, population definition, geography and metadata", () => {
  for (const [kind, axis, wrong] of [["amount", "unit", "MIO_NAC"], ["ratio", "sector", "S1311"], ["amount", "na_item", "D41REC"], ["population", "indic_de", "JAN"], ["amount", "freq", "Q"]]) {
    const data = fixture(kind); data.dimension[axis].category.index = { [wrong]: 0 };
    assert.throws(() => parseAnnualSource(data, INTEREST.sources[kind], NOW), /filter/);
  }
  for (const change of [data => data.source = "OTHER", data => data.extension.id = "gov_10dd_edpt1", data => data.updated = "2027-01-01", data => data.id[0] = "unexpected"]) {
    const data = fixture("amount"); change(data); assert.throws(() => parseAnnualSource(data, INTEREST.sources.amount, NOW));
  }
  const geo = fixture("amount"); delete geo.dimension.geo.category.index.AT; geo.dimension.geo.category.index.US = 0;
  assert.throws(() => parseAnnualSource(geo, INTEREST.sources.amount, NOW), /geography/);
  const period = fixture("amount"); delete period.dimension.time.category.index[2015]; period.dimension.time.category.index["2015-Q1"] = 0;
  assert.throws(() => parseAnnualSource(period, INTEREST.sources.amount, NOW), /period/);
});

test("interest snapshot requires aligned accounts and complete same-year EU27 denominators", () => {
  for (const kind of KINDS) { const f = fixtures(); delete f[kind].value[270]; assert.throws(() => buildSnapshot(f, NOW), /incomplete latest/); }
  for (const kind of ["ratio", "revenue"]) { const f = fixtures(); f[kind].updated = "2026-07-20"; assert.throws(() => buildSnapshot(f, NOW), /vintage/); }
  const forecast = fixtures(); forecast.amount.status[270] = "f"; assert.throws(() => buildSnapshot(forecast, NOW), /incomplete/);
  const jan = fixtures(); jan.population.dimension.indic_de.category.index = { JAN: 0 }; assert.throws(() => buildSnapshot(jan, NOW));
  const zero = make(); zero.countries.AT.population[10] = 0; assert.throws(() => validateSnapshot(zero), /population/);
  const revenue = make(); revenue.countries.AT.revenue[10] = 0; assert.throws(() => validateSnapshot(revenue), /revenue/);
  const count = make(); count.countries.AT.population[10] = 100.5; assert.throws(() => validateSnapshot(count), /count/);
  const separate = fixtures(); separate.population.updated = "2026-07-22T11:00:00+0200"; assert.equal(buildSnapshot(separate, NOW).latestYear, "2025");
});

test("interest calculations distinguish euros, published GDP ratios, population and revenue", () => {
  const points = interestPoints(make(), "AT"), latest = points.at(-1);
  assert.equal(latest.amount, 200e6); assert.equal(latest.ratio, 2);
  assert.equal(latest.perCapita, 200e6 / 1010000); assert.equal(latest.revenueShare, 200 / 1200 * 100);
  assert.equal(latest.perCapitaStatus, "p");
  const change = interestChange(points, "2025"); assert.equal(change.change, 10e6); assert.equal(change.percent, 5.3);
  assert.equal(interestChange(points, "2025", 1, "ratio").change, .1);
  assert.equal(interestChange(points, "2025", 5).change, 50e6);
  const zero = make(); zero.countries.AT.amount[9] = 0; const z = interestChange(interestPoints(zero, "AT"), "2025"); assert.equal(z.percent, null); assert.equal(z.change, 200e6);
});

test("interest gaps and breaks suppress only affected comparisons without nearby-year substitution", () => {
  const data = make(); data.countries.AT.amount[9] = null; validateSnapshot(data);
  const points = interestPoints(data, "AT"); assert.equal(interestChange(points, "2025").change, null); assert.equal(interestChange(points, "2025", 1, "ratio").change, .1);
  const broken = make(); broken.countries.AT.populationStatus[8] = "b"; const rows = interestPoints(broken, "AT");
  assert.equal(interestChange(rows, "2025", 5, "perCapita").change, null); assert.equal(interestChange(rows, "2025", 5).change, 50e6);
  assert.equal(trendSegments(rows, "perCapita").length, 2); assert.equal(trendSegments(rows, "amount").length, 1);
  assert.equal(interestChange(rows.filter(p => p.year !== "2024"), "2025").change, null);
});

test("interest rankings use displayed precision and distinguish economic scale from cash amounts", () => {
  const data = make(); data.countries.AT.amount[10] = 400; data.countries.AT.ratio[10] = .5;
  data.countries.BE.ratio[10] = 3.01; data.countries.BG.ratio[10] = 3.04;
  assert.equal(interestRows(data, "amount")[0].code, "AT");
  const ranked = interestRows(data, "ratio"); assert.equal(ranked.find(r => r.code === "BE").rank, 1); assert.equal(ranked.find(r => r.code === "BG").rank, 1); assert.equal(ranked[2].rank, 3);
  for (const mode of INTEREST.modes) assert.equal(interestRows(data, mode).length, 27);
  assert.throws(() => interestRows(data, "other"));
  assert.deepEqual([null, 0, .9, 1, 1.9, 2, 2.9, 3].map(interestBand), ["missing", "low", "low", "medium", "medium", "high", "high", "highest"]);
});

test("interest EU sum and derived aggregate ratios use complete weighted denominators", () => {
  const data = make(), aggregate = interestAggregate(data), rows = interestRows(data);
  assert.equal(aggregate.amount, rows.reduce((sum, row) => sum + row.amount, 0));
  assert.equal(aggregate.perCapita, aggregate.amount / aggregate.population);
  assert.equal(aggregate.revenueShare, aggregate.amount / aggregate.revenue * 100);
  data.countries.AT.population[10] = null; assert.equal(interestAggregate(data), null);
});

test("saved interest snapshot validates source flags, actual endpoints and refresh non-regression", () => {
  validateSnapshot(saved); assert.equal(saved.years.length, 11);
  if (saved.latestYear === "2025" && saved.sources.amount.updated.startsWith("2026-07-21")) {
    const nl = interestRows(saved).find(row => row.code === "NL");
    assert.equal(nl.amount, 8496e6); assert.equal(nl.ratio, .7); assert.equal(nl.population, 18087118); assert.equal(nl.revenue, 510195e6); assert.equal(nl.annualChange.change, 614e6); assert.equal(nl.annualChange.percent, 7.8); assert.equal(Math.round(nl.perCapita), 470);
  }
  const before = make(), lost = structuredClone(before); lost.countries.AT.revenue[0] = null; assert.throws(() => validateSnapshot(lost, before), /lost previous/);
  assert.throws(() => validateSnapshot({ ...before, fetchedAt: "2026-08-01" }, before), /regression/);
  assert.throws(() => validateSnapshot({ ...before, years: before.years.slice(1) }), /consecutive/);
});

test("interest updater preserves previous snapshot on failure and commits one validated bundle", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "interest-update-test-")), target = path.join(dir, "interest.json");
  const initial = JSON.stringify(make()); await fs.writeFile(target, initial);
  const fetchFor = data => async url => { const params = new URL(url).searchParams; const kind = params.has("indic_de") ? "population" : params.get("na_item") === "TR" ? "revenue" : params.get("unit") === "PC_GDP" ? "ratio" : "amount"; return { ok: true, json: async () => data[kind] }; };
  try {
    await assert.rejects(updateInterest({ target, now: () => NOW, fetchImpl: async () => ({ ok: false, status: 503 }) })); assert.equal(await fs.readFile(target, "utf8"), initial);
    const bad = fixtures(); delete bad.population.value[270]; await assert.rejects(updateInterest({ target, now: () => NOW, fetchImpl: fetchFor(bad) })); assert.equal(await fs.readFile(target, "utf8"), initial);
    await updateInterest({ target, now: () => NOW, fetchImpl: fetchFor(fixtures()) }); validateSnapshot(JSON.parse(await fs.readFile(target, "utf8"))); assert.deepEqual(await fs.readdir(dir), ["interest.json"]);
  } finally { await fs.unlink(target); await fs.rmdir(dir); }
});

test("interest routes preserve locale metadata and integrate server country/methodology slots", async () => {
  for (const lang of ["en", "nl", "de", "fr"]) {
    const root = lang === "en" ? "app" : `app/${lang}`;
    assert.match(await fs.readFile(path.join(__dirname, "..", root, "interest-cost/page.jsx"), "utf8"), new RegExp(`interestMetadata\\("${lang}"\\)`));
    assert.match(await fs.readFile(path.join(__dirname, "..", root, "country/[code]/page.jsx"), "utf8"), /CountryPublicPage/);
  }
  assert.match(await fs.readFile(path.join(__dirname, "../components/country-preview/CountryPreviewExperience.jsx"), "utf8"), /fiscalPath\("\/interest-cost", lang\)/);
  const page = await fs.readFile(path.join(__dirname, "../components/fiscal/InterestPage.jsx"), "utf8");
  assert.match(page, /canonical: url/); assert.match(page, /"x-default"/); assert.match(page, /debtSnapshot.debtYear === snapshot.latestYear/);
  assert.match(await fs.readFile(path.join(__dirname, "../components/methodology-preview/MethodologyPreviewPage.jsx"), "utf8"), /<InterestSource lang={lang} methodology/);
  assert.match(await fs.readFile(path.join(__dirname, "../app/sitemap.js"), "utf8"), /urlFor\("\/interest-cost", lang\)/);
});
