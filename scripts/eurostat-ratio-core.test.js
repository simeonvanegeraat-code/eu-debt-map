const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { EU27 } = require("./eurostat-debt-core");
const {
  buildRatioEurostatUrl,
  buildRatioSeries,
  parseEurostatDataset,
  readRatioGenerated,
  renderRatioGenerated,
  validateRatioSeries,
} = require("./eurostat-ratio-core");
const { runRatioUpdate } = require("./update-eurostat-ratios");
const { validateStoredRatios } = require("./validate-eurostat-ratios");

const eurostatGeo = (code) => (code === "GR" ? "EL" : code);

function makeDataset({ quarters, missing = {}, offset = 0 }) {
  const geoIndex = {};
  const timeIndex = {};
  EU27.forEach((code, index) => {
    geoIndex[eurostatGeo(code)] = index;
  });
  quarters.forEach((quarter, index) => {
    timeIndex[quarter] = index;
  });

  const value = [];
  EU27.forEach((code, countryIndex) => {
    quarters.forEach((quarter, quarterIndex) => {
      value.push(
        missing?.[code]?.includes(quarter)
          ? null
          : 20 + countryIndex * 2 + quarterIndex / 10 + offset
      );
    });
  });

  return {
    id: ["geo", "time"],
    size: [EU27.length, quarters.length],
    dimension: {
      geo: { category: { index: geoIndex } },
      time: { category: { index: timeIndex } },
    },
    value,
  };
}

function makePrevious() {
  return buildRatioSeries(
    parseEurostatDataset(makeDataset({ quarters: ["2025-Q3", "2025-Q4"] })),
    {}
  ).series;
}

function writeSnapshot(directory) {
  const ratioFile = path.join(directory, "eurostat.ratio.gen.js");
  const series = makePrevious();
  fs.writeFileSync(
    ratioFile,
    renderRatioGenerated({
      snapshotId: "old-ratio-snapshot",
      updatedAt: "2026-04-24T00:00:00.000Z",
      report: {
        sourceUnit: "PC_GDP",
        dominantLatestTime: "2025-Q4",
        dominantCoverage: 27,
      },
      series,
    }),
    "utf8"
  );
  return { ratioFile };
}

test("ratio URL requests Eurostat's official percentage-of-GDP unit", () => {
  const url = new URL(buildRatioEurostatUrl());
  assert.equal(url.searchParams.get("unit"), "PC_GDP");
  assert.equal(url.searchParams.getAll("geo").length, 27);
  assert.ok(url.searchParams.getAll("geo").includes("EL"));
});

test("partial ratio data updates valid countries and retains a missing country", () => {
  const previous = makePrevious();
  const parsed = parseEurostatDataset(
    makeDataset({
      quarters: ["2025-Q4", "2026-Q1"],
      missing: { MT: ["2025-Q4", "2026-Q1"] },
      offset: 1,
    })
  );
  const result = buildRatioSeries(parsed, previous);
  validateRatioSeries(result.series);

  assert.equal(result.series.NL.latestTime, "2026-Q1");
  assert.equal(result.series.MT.latestTime, "2025-Q4");
  assert.equal(result.report.dominantCoverage, 26);
  assert.deepEqual(result.report.carriedForwardCodes, ["MT"]);
  assert.deepEqual(result.report.staleCodes, ["MT"]);
});

test("an older ratio response cannot regress a country", () => {
  const previous = makePrevious();
  const parsed = parseEurostatDataset(
    makeDataset({ quarters: ["2025-Q1", "2025-Q2"], offset: 2 })
  );
  const result = buildRatioSeries(parsed, previous);

  assert.deepEqual(result.series.NL, previous.NL);
  assert.ok(result.report.regressedSourceCodes.includes("NL"));
});

test("a failed ratio fetch leaves the stored file byte-for-byte unchanged", async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eudebt-ratio-failure-"));
  try {
    const files = writeSnapshot(directory);
    const before = fs.readFileSync(files.ratioFile, "utf8");

    await assert.rejects(
      runRatioUpdate({
        ...files,
        fetchImpl: async () => {
          throw new Error("simulated ratio network failure");
        },
      }),
      /simulated ratio network failure/
    );
    assert.equal(fs.readFileSync(files.ratioFile, "utf8"), before);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("a successful ratio update writes and validates all 27 countries", async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eudebt-ratio-success-"));
  try {
    const files = writeSnapshot(directory);
    const dataset = makeDataset({ quarters: ["2025-Q4", "2026-Q1"], offset: 3 });
    const result = await runRatioUpdate({
      ...files,
      fetchImpl: async () => ({ ok: true, status: 200, json: async () => dataset }),
      now: () => new Date("2026-07-21T12:00:00.000Z"),
    });

    const stored = readRatioGenerated(files.ratioFile);
    validateRatioSeries(stored.series);
    validateStoredRatios(files);
    assert.equal(stored.snapshotId, result.snapshotId);
    assert.equal(stored.report.dominantLatestTime, "2026-Q1");
    assert.equal(Object.keys(stored.series).length, 27);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("ratio validation rejects a snapshot that loses a country", () => {
  const series = makePrevious();
  delete series.MT;
  assert.throws(() => validateRatioSeries(series), /missing: MT/);
});
