const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { EU27, BALANCE } = require("../lib/fiscal/indicators");
const { fiscalPath } = require("../lib/fiscal/paths");
const { decodeJsonStat } = require("./eurostat-jsonstat");
const { parseAnnualDataset, buildSnapshot, validateSnapshot, requestUrl } = require("./eurostat-balance-core");
const { balanceRows, balanceBand, percentagePointChange } = require("../lib/fiscal/balance-core");
const snapshot = require("../lib/fiscal/balance.gen.json");
const { updateBalance } = require("./update-eurostat-balance");
const os = require("node:os");

function dataset(item = "B9", years = ["2023", "2024", "2025"]) {
  const geos = [...EU27.map((geo) => geo === "GR" ? "EL" : geo), "EU27_2020"];
  const dimensions = { time: years, geo: geos, na_item: [item], sector: ["S13"], unit: ["PC_GDP"], freq: ["A"] };
  const id = Object.keys(dimensions); // Time first deliberately tests stride independence.
  return {
    id, size: Object.values(dimensions).map((keys) => keys.length), source: "ESTAT",
    updated: "2026-04-22T11:00:00+0200", extension: { id: "GOV_10DD_EDPT1" },
    dimension: Object.fromEntries(Object.entries(dimensions).map(([key, values]) => [key, { category: { index: Object.fromEntries(values.map((v, i) => [v, i])) } }])),
    value: Object.fromEntries(Array.from({ length: geos.length * years.length }, (_, i) => [i, item === "B9" ? -2 : 80])),
  };
}
const clone = (value) => structuredClone(value);
const read = (file) => fs.readFileSync(path.join(__dirname, "..", file), "utf8");

test("JSON-stat retains signed/zero/missing observations and flags with reordered dimensions", () => {
  const data = dataset();
  data.value[0] = 0; data.value[1] = -4.3; data.value[2] = 1.5;
  data.value[3] = null; delete data.value[4]; data.status = { 1: "p", 4: "b" };
  const observations = decodeJsonStat(data);
  assert.deepEqual(observations.slice(0, 5).map((o) => o.value), [0, -4.3, 1.5, null, null]);
  assert.equal(observations[1].status, "p"); assert.equal(observations[4].status, "b");
  assert.equal(observations[28].dimensions.time, "2024");
  const annual = parseAnnualDataset(data, BALANCE.filters, "2026-09-05T10:00:00Z");
  assert.equal(annual.series.GR["2025"].value, -2);
  assert.equal(annual.series.AT["2023"].value, 0);
});

test("JSON-stat accepts dense arrays and rejects malformed axes, dimensions and values", () => {
  const data = dataset(); data.value = Object.values(data.value); data.status = "e";
  for (const dimension of Object.values(data.dimension)) dimension.category.index = Object.keys(dimension.category.index);
  assert.equal(decodeJsonStat(data)[40].status, "e");
  const invalidAxis = dataset(); invalidAxis.dimension.geo.category.index.AT = 40;
  assert.throws(() => decodeJsonStat(invalidAxis), /category positions/);
  const stringValue = dataset(); stringValue.value[0] = "";
  assert.throws(() => decodeJsonStat(stringValue), /numeric observation/);
  const outOfBounds = dataset(); outOfBounds.value[10000] = 1;
  assert.throws(() => decodeJsonStat(outOfBounds), /observation index/);
  const wrongFilter = dataset(); wrongFilter.dimension.sector.category.index = { S1311: 0 };
  assert.throws(() => parseAnnualDataset(wrongFilter, BALANCE.filters, "2026-09-05"), /filter sector/);
  assert.throws(() => parseAnnualDataset(dataset("GD"), BALANCE.filters, "2026-09-05"), /filter na_item/);
  const wrongUnit = dataset(); wrongUnit.dimension.unit.category.index = { MIO_EUR: 0 };
  assert.throws(() => parseAnnualDataset(wrongUnit, BALANCE.filters, "2026-09-05"), /filter unit/);
});

test("official annual observations exclude current years and explicit forecasts", () => {
  const data = dataset("B9", ["2024", "2025", "2026"]); data.status = { 0: "f", 1: "p" };
  const parsed = parseAnnualDataset(data, BALANCE.filters, "2026-09-05");
  assert.deepEqual(parsed.years, ["2024", "2025"]);
  assert.equal(parsed.series.AT["2024"].value, null);
  assert.equal(parsed.series.AT["2024"].status, "f");
  assert.equal(parsed.series.BE["2024"].value, -2);
  assert.equal(parsed.series.BE["2024"].status, "p");
});

test("snapshot rejects missing latest countries, mismatched vintages and period regressions", () => {
  const b = dataset(); const d = dataset("GD");
  const valid = buildSnapshot(b, d, "2026-09-05T10:00:00Z");
  assert.equal(valid.latestCompleteYear, "2025"); assert.equal(valid.series.EU27_2020["2025"].balance, -2);
  const missing = clone(b); delete missing.value[56];
  assert.throws(() => buildSnapshot(missing, d, valid.fetchedAt), /incomplete latest comparison/);
  const revision = clone(d); revision.updated = "2026-04-23T11:00:00+0200";
  assert.throws(() => buildSnapshot(b, revision, valid.fetchedAt), /same source vintage/);
  const old = buildSnapshot(dataset("B9", ["2022", "2023", "2024"]), dataset("GD", ["2022", "2023", "2024"]), valid.fetchedAt);
  assert.throws(() => validateSnapshot(old, valid), /regression/);
  const invalid = clone(valid); invalid.series.AT["2025"].balance = undefined;
  assert.throws(() => validateSnapshot(invalid), /invalid balance/);
  const missingOld = clone(valid); missingOld.series.AT["2023"].balance = null;
  assert.equal(validateSnapshot(missingOld), missingOld);
});

test("rankings preserve zero, null, ties and previous-calendar-year comparisons", () => {
  const data = buildSnapshot(dataset(), dataset("GD"), "2026-09-05T10:00:00Z");
  data.series.AT["2025"].balance = 2;
  data.series.BE["2025"].balance = 2;
  data.series.BG["2025"].balance = 0;
  data.series.HR["2025"].balance = null;
  data.series.AT["2024"].balance = null;
  const rows = balanceRows(data);
  assert.equal(rows.length, 27); assert.ok(!rows.some((row) => row.code === "EU27_2020"));
  assert.deepEqual(rows.slice(0, 3).map((row) => row.rank), [1, 1, 3]);
  assert.equal(rows.find((row) => row.code === "HR").rank, null);
  assert.equal(rows.find((row) => row.code === "AT").change, null);
  assert.equal(rows.filter((row) => row.code === "BG")[0].rank, 3);
  assert.equal(percentagePointChange(-3, -5.2), 2.2);
  assert.equal(percentagePointChange(-3.1, -3), -0.1);
  assert.equal(percentagePointChange(0, -1), 1);
  assert.equal(percentagePointChange(null, 0), null);
  assert.deepEqual([null, 0, .1, -2.9, -3, -3.1].map(balanceBand), ["missing", "balanced", "surplus", "smallDeficit", "smallDeficit", "largeDeficit"]);
});

test("checked-in snapshot is valid and uses the existing EU27 identity set", () => {
  validateSnapshot(snapshot);
  assert.deepEqual([...EU27].sort(), [...require("./eurostat-debt-core").EU27].sort());
  assert.equal(balanceRows(snapshot).filter((row) => Number.isFinite(row.balance)).length, 27);
  const url = new URL(requestUrl(BALANCE.filters));
  assert.equal(url.searchParams.get("unit"), "PC_GDP");
  assert.ok(url.searchParams.getAll("geo").includes("EL"));
  assert.equal(url.searchParams.getAll("geo").length, 28);
});

test("balance changes retain provisional flags and suppress non-comparable annual observations", () => {
  const fixture = clone(snapshot);
  const year = fixture.latestCompleteYear, previous = String(Number(year) - 1);
  fixture.series.FR[year].balance = -3;
  fixture.series.FR[previous].balance = -5;
  fixture.series.FR[year].balanceStatus = "p";
  fixture.series.FR[previous].balanceStatus = "e";
  const row = () => balanceRows(fixture).find(item => item.code === "FR");
  assert.equal(row().change, 2);
  assert.equal(row().changeStatus, "ep");
  for (const flag of ["b", "d", "f"]) {
    for (const period of [previous, year]) {
      fixture.series.FR[previous].balanceStatus = "";
      fixture.series.FR[year].balanceStatus = "";
      fixture.series.FR[period].balanceStatus = flag;
      assert.equal(row().change, null, `${flag} at ${period}`);
      assert.equal(row().changeStatus, flag);
      assert.equal(row().balance, -3);
    }
  }
});

test("fiscal routes preserve root English, four translations and methodology anchors", () => {
  for (const lang of ["en", "nl", "de", "fr"]) {
    const prefix = lang === "en" ? "" : `/${lang}`;
    assert.equal(fiscalPath("/deficit", lang), `${prefix}/deficit`);
    assert.equal(fiscalPath("/methodology#budget-balance-methodology", lang), `${prefix}/methodology#budget-balance-methodology`);
    const route = read(`app${prefix}/deficit/page.jsx`);
    assert.match(route, new RegExp(`balanceMetadata\\("${lang}"\\)`));
    assert.match(read(`app${prefix}/country/[code]/page.jsx`), /CountryPublicPage/);
  }
  assert.match(read("app/sitemap.js"), /urlFor\("\/deficit", lang\)/);
  assert.match(read("components/country-preview/CountryPreviewExperience.jsx"), /fiscalPath\("\/deficit", lang\)/);
  assert.match(read("components/fiscal/BalancePage.jsx"), /"x-default"/);
  assert.match(read("components/fiscal/BalancePage.jsx"), /"@type": "Dataset"/);
});

test("failed, partial and successful API updates preserve atomic snapshot replacement", async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eu-balance-test-"));
  const target = path.join(directory, "balance.gen.json");
  const previous = buildSnapshot(dataset(), dataset("GD"), "2026-09-05T09:00:00Z");
  const original = `${JSON.stringify(previous)}\n`;
  fs.writeFileSync(target, original);
  const now = () => "2026-09-05T10:00:00Z";
  try {
    await assert.rejects(updateBalance({ target, now, fetchImpl: async () => { throw Error("offline"); } }), /offline/);
    assert.equal(fs.readFileSync(target, "utf8"), original);
    await assert.rejects(updateBalance({ target, now, fetchImpl: async () => ({ ok: false, status: 503 }) }), /HTTP 503/);
    assert.equal(fs.readFileSync(target, "utf8"), original);
    const fixtureFetch = (partial) => async (url) => {
      const data = dataset(new URL(url).searchParams.get("na_item"));
      if (partial) delete data.value[56];
      return { ok: true, json: async () => data };
    };
    await assert.rejects(updateBalance({ target, now, fetchImpl: fixtureFetch(true) }), /incomplete latest/);
    assert.equal(fs.readFileSync(target, "utf8"), original);
    const result = await updateBalance({ target, now, fetchImpl: fixtureFetch(false) });
    assert.deepEqual(JSON.parse(fs.readFileSync(target, "utf8")), result);
    assert.equal(result.fetchedAt, now());
    assert.deepEqual(fs.readdirSync(directory), ["balance.gen.json"]);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});
