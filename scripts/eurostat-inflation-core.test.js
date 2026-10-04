const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { INFLATION, GEOGRAPHIES, monthIndex, shiftMonth, euroMembers, observation, inflationRows, trendSegments, inflationColor } = require("../lib/inflation/indicators");
const { requestUrl, buildSnapshot, validateSnapshot } = require("./eurostat-inflation-core");
const { updateInflation } = require("./update-eurostat-inflation");
const { inflationMetadata } = require("../lib/inflation/metadata");
const { COPY, formatMonth, formatRate, formatPoints } = require("../components/inflation/copy");
const saved = require("../lib/inflation/inflation.gen.json");
const { readSelection, selectionSearch, monthInYear, inflationCountryPath } = require("../lib/inflation/selection");
const NOW = "2026-10-04T12:00:00Z";

test("shared selections round-trip and reject unavailable or invalid values", () => {
  const selection = { country: "RO", month: "2022-12", area: "EU27_2020", years: 10, sort: "alphabetical" };
  for (const lang of ["en", "nl", "de", "fr"]) assert.deepEqual(readSelection(selectionSearch(selection), saved, lang), selection);
  assert.deepEqual(readSelection("?country=invalid&month=2099-01&area=invalid&years=99&sort=invalid", saved, "de"), {
    country: "DE", month: saved.latestMonth, area: "EU27_2020", years: 5, sort: "descending",
  });
  assert.equal(readSelection("", saved).area, "EU27_2020");
  assert.equal(readSelection("?country=de", saved).area, "EU27_2020");
  assert.equal(readSelection("?country=ro", saved).area, "EU27_2020");
  assert.equal(readSelection("?country=bg&month=2025-12", saved).area, "EU27_2020");
  assert.equal(readSelection("?country=bg&month=2026-01&area=EA", saved).country, "BG");
  assert.equal(readSelection("?country=ro&area=EA", saved).country, "NL");
});

test("year changes clamp to available months and country links preserve locale", () => {
  const periods = ["2024-11", "2024-12", "2025-01", "2025-02"];
  assert.equal(monthInYear("2024-12", "2025", periods), "2025-02");
  assert.equal(monthInYear("2025-01", "2024", periods), "2024-11");
  assert.equal(monthInYear("2024-12", "2099", periods), "2024-12");
  for (const lang of ["en", "nl", "de", "fr"]) {
    assert.equal(inflationCountryPath("RO", lang), `${lang === "en" ? "" : `/${lang}`}/inflation?country=ro#inflation-explorer`);
  }
  assert.throws(() => inflationCountryPath("XX"));
});

function fixture() {
  // Reordered dimensions ensure parsing uses coordinates, not assumed offsets.
  const months = Array.from({ length: 141 }, (_, i) => shiftMonth("2015-01", i));
  const axes = { time: months, geo: GEOGRAPHIES.map(code => code === "GR" ? "EL" : code), unit: ["RCH_M", "RCH_A"], coicop18: ["TOTAL"], freq: ["M"] };
  const id = Object.keys(axes), value = {}, status = {};
  for (let i = 0; i < months.length; i++) for (let j = 0; j < GEOGRAPHIES.length; j++) {
    value[i * 58 + j * 2] = .3;
    value[i * 58 + j * 2 + 1] = 2.5;
    if (i === months.length - 1) { status[i * 58 + j * 2] = "e"; status[i * 58 + j * 2 + 1] = "e"; }
  }
  return { source: "ESTAT", updated: "2026-10-02T09:00:00Z", extension: { id: "PRC_HICP_MINR", status: { label: { e: "estimated", b: "break", p: "provisional", f: "forecast" } } }, id,
    size: id.map(key => axes[key].length), dimension: Object.fromEntries(id.map(key => [key, { category: { index: Object.fromEntries(axes[key].map((v, i) => [v, i])) } }])), value, status };
}
const make = () => buildSnapshot(fixture(), NOW);
const offset = (month, code, metric = "annual") => (monthIndex(month) - monthIndex("2015-01")) * 58 + GEOGRAPHIES.indexOf(code) * 2 + (metric === "annual" ? 1 : 0);

test("inflation request uses the current dataset, exact measures and official changing-composition aggregate", () => {
  const url = new URL(requestUrl());
  assert.equal(url.pathname.split("/").at(-1), "prc_hicp_minr");
  assert.equal(url.searchParams.get("coicop18"), "TOTAL");
  assert.equal(url.searchParams.get("coicop"), null);
  assert.deepEqual(url.searchParams.getAll("unit"), ["RCH_A", "RCH_M"]);
  assert.equal(url.searchParams.get("freq"), "M");
  assert.equal(url.searchParams.get("sinceTimePeriod"), "2015-01");
  assert.equal(url.searchParams.getAll("geo").length, 29);
  assert(url.searchParams.getAll("geo").includes("EL"));
  assert(url.searchParams.getAll("geo").includes("EA"));
  assert(!url.searchParams.getAll("geo").includes("EA21"));
});

test("all headline countries and both rates share a complete month, excluding flash estimates", () => {
  const snapshot = make();
  assert.equal(snapshot.latestMonth, "2026-08");
  assert.equal(snapshot.periods.length, 140);
  assert.equal(snapshot.periods.at(-1), "2026-08");
  assert.equal(snapshot.series.GR.annual.at(-1), 2.5);
  const data = fixture();
  delete data.value[offset("2026-08", "RO", "monthly")];
  assert.equal(buildSnapshot(data, NOW).latestMonth, "2026-07");
  for (const flag of ["e", "p", "f"]) {
    const flagged = fixture();
    flagged.status[offset("2026-08", "EA")] = flag;
    assert.equal(buildSnapshot(flagged, NOW).latestMonth, "2026-07");
  }
  const estimates = fixture(); estimates.status = "e";
  assert.throws(() => buildSnapshot(estimates, NOW), /No complete/);
});

test("zero, negative, missing and flagged observations remain distinct", () => {
  const data = fixture();
  data.value[offset("2015-01", "NL")] = 0;
  data.value[offset("2015-02", "NL")] = -1.2;
  delete data.value[offset("2015-03", "NL")];
  data.status[offset("2015-04", "NL")] = "p";
  data.status[offset("2015-05", "NL")] = "f";
  const snapshot = buildSnapshot(data, NOW);
  assert.deepEqual(snapshot.series.NL.annual.slice(0, 5), [0, -1.2, null, 2.5, null]);
  assert.equal(snapshot.series.NL.annualStatus[3], "p");
  assert.equal(snapshot.series.NL.annualStatus[4], "f");
  assert.deepEqual(observation(snapshot, "NL", "2014-12"), { value: null, status: "" });
  assert.notEqual(inflationColor(null), inflationColor(0));
  assert.notEqual(inflationColor(-.1), inflationColor(0));
});

test("parsing rejects wrong sources, units, category, frequency, dates and geography", () => {
  for (const [axis, invalid] of [["unit", "I25"], ["coicop18", "CP01"], ["freq", "A"], ["geo", "UK"], ["time", "2026-13"]]) {
    const data = fixture(), index = data.dimension[axis].category.index;
    const first = Object.keys(index)[0]; index[invalid] = index[first]; delete index[first];
    assert.throws(() => buildSnapshot(data, NOW));
  }
  for (const mutate of [data => { data.source = "OTHER"; }, data => { data.extension.id = "prc_hicp_manr"; },
    data => { data.updated = "2027-01-01"; }, data => { data.id.push("unknown"); },
    data => { data.value[0] = "3"; }, data => { data.status[0] = "x"; }]) {
    const data = fixture(); mutate(data); assert.throws(() => buildSnapshot(data, NOW));
  }
});

test("euro area membership and country rankings follow the selected month", () => {
  assert.equal(euroMembers("2022-12").length, 19);
  assert.equal(euroMembers("2023-01").length, 20);
  assert.equal(euroMembers("2026-01").length, 21);
  assert(!euroMembers("2025-12").includes("BG"));
  assert(euroMembers("2026-01").includes("BG"));
  assert.equal(shiftMonth("2026-01", -1), "2025-12");
  assert.equal(shiftMonth("2026-08", -60), "2021-08");
  assert.equal(monthIndex("2026-00"), null);
  const snapshot = make();
  snapshot.series.NL.annual[0] = null;
  snapshot.series.FR.annual[0] = 0;
  snapshot.series.DE.annual[0] = -1;
  const rows = inflationRows(snapshot, "2015-01", "EU27_2020");
  assert.equal(rows.length, 27);
  assert.equal(rows.at(-1).code, "NL");
  assert.equal(rows.at(-2).code, "DE");
  assert.equal(inflationRows(snapshot, "2022-12").length, 19);
});

test("chart segments stop at missing, forecast and series-break observations", () => {
  const points = [{ value: 0 }, { value: -1 }, { value: null }, { value: 3 }, { value: 4, valueStatus: "b" }, { value: 5 }, { value: 6, valueStatus: "f" }];
  assert.deepEqual(trendSegments(points, "value").map(segment => segment.map(p => p.index)), [[0, 1], [3], [4, 5]]);
});

test("saved data and provenance validate; corrupted snapshots cannot replace them", () => {
  validateSnapshot(saved);
  assert.equal(Object.keys(saved.series).length, 29);
  for (const mutate of [s => { s.periods.pop(); }, s => { s.series.NL.annual.pop(); },
    s => { s.series.NL.annual[0] = null; }, s => { s.source.updated = "2020-01-01"; },
    s => { s.source.filters.unit = ["I25"]; }, s => { s.series.EA.annualStatus[s.periods.length - 1] = "e"; },
    s => { s.fetchedAt = "2020-01-01"; }]) {
    const snapshot = make(), changed = structuredClone(snapshot); mutate(changed);
    assert.throws(() => validateSnapshot(changed, snapshot));
  }
});

test("failed or regressive imports preserve existing bytes; valid updates replace atomically", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "inflation-test-"));
  const target = path.join(dir, "snapshot.json"), initial = JSON.stringify(make());
  await fs.writeFile(target, initial);
  try {
    await assert.rejects(updateInflation({ target, now: () => NOW, fetchImpl: async () => ({ ok: false, status: 503 }) }));
    assert.equal(await fs.readFile(target, "utf8"), initial);
    const incomplete = fixture(); delete incomplete.value[offset("2026-08", "RO")];
    await assert.rejects(updateInflation({ target, now: () => NOW, fetchImpl: async () => ({ ok: true, json: async () => incomplete }) }), /regression/);
    assert.equal(await fs.readFile(target, "utf8"), initial);
    await updateInflation({ target, now: () => NOW, fetchImpl: async () => ({ ok: true, json: async () => fixture() }) });
    validateSnapshot(JSON.parse(await fs.readFile(target, "utf8")));
    assert.deepEqual(await fs.readdir(dir), ["snapshot.json"]);
  } finally { await fs.unlink(target); await fs.rmdir(dir); }
});

test("localized routes, metadata and translations share one independent inflation section", async () => {
  const keys = Object.keys(COPY.en).sort();
  for (const lang of ["en", "nl", "de", "fr"]) {
    assert.deepEqual(Object.keys(COPY[lang]).sort(), keys);
    const prefix = lang === "en" ? "" : `/${lang}`;
    const route = await fs.readFile(path.join(__dirname, `../app${prefix}/inflation/page.jsx`), "utf8");
    assert(route.includes(`inflationMetadata("${lang}")`));
    assert(route.includes("components/inflation/InflationPage"));
    const metadata = inflationMetadata(lang);
    assert.equal(metadata.alternates.canonical, `https://www.eudebtmap.com${prefix}/inflation`);
    assert.equal(metadata.alternates.languages[lang], metadata.alternates.canonical);
    assert.equal(Object.keys(metadata.alternates.languages).length, 5);
    assert.equal(metadata.alternates.languages["x-default"], "https://www.eudebtmap.com/inflation");
    assert(metadata.title.includes(formatMonth(saved.latestMonth, lang)));
    assert.equal(metadata.description, COPY[lang].description);
    assert.equal(formatRate(null, lang), "—");
    assert.notEqual(formatRate(0, lang), "—");
  }
  assert.equal(formatPoints(2.8 - 3.2, "nl"), "-0,4 pp");
  const sitemap = await fs.readFile(path.join(__dirname, "../app/sitemap.js"), "utf8");
  assert.match(sitemap, /urlFor\("\/inflation", lang\)/);
  assert.match(sitemap, /lastModified: new Date\(inflationModified\(\)\)/);
  const page = await fs.readFile(path.join(__dirname, "../components/inflation/InflationPage.jsx"), "utf8");
  assert.doesNotMatch(page, /\/country\//);
  assert.equal(INFLATION.dataset, saved.source.dataset);
});
