const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const {
  EU27,
  buildCurrentSeries,
  buildHistory,
  parseEurostatDataset,
  quarterEndDate,
  readCurrentGenerated,
  readHistoryGenerated,
  renderCurrentGenerated,
  renderHistoryGenerated,
  validateCurrentSeries,
  validateHistory,
} = require("./eurostat-debt-core");
const { runUpdate } = require("./update-eurostat-debt");
const { validateStoredData } = require("./validate-eurostat-data");

const eurostatGeo = (code) => (code === "GR" ? "EL" : code);

function makeDataset({ quarters, valuesByCountry, includedCodes = EU27 }) {
  const geoIndex = {};
  const timeIndex = {};
  includedCodes.forEach((code, index) => {
    geoIndex[eurostatGeo(code)] = index;
  });
  quarters.forEach((quarter, index) => {
    timeIndex[quarter] = index;
  });

  const value = [];
  for (const code of includedCodes) {
    for (const quarter of quarters) {
      const point = valuesByCountry?.[code]?.[quarter];
      value.push(point == null ? null : point);
    }
  }

  return {
    id: ["geo", "time"],
    size: [includedCodes.length, quarters.length],
    dimension: {
      geo: { category: { index: geoIndex } },
      time: { category: { index: timeIndex } },
    },
    value,
  };
}

function valuesFor(quarters, { missing = {} } = {}) {
  const result = {};
  EU27.forEach((code, countryIndex) => {
    result[code] = {};
    quarters.forEach((quarter, quarterIndex) => {
      if (missing?.[code]?.includes(quarter)) return;
      result[code][quarter] = 100_000 + countryIndex * 1_000 + quarterIndex * 100;
    });
  });
  return result;
}

function oldCurrentSeries() {
  const quarters = ["2025-Q3", "2025-Q4"];
  return buildCurrentSeries(
    parseEurostatDataset(makeDataset({ quarters, valuesByCountry: valuesFor(quarters) })),
    {}
  ).series;
}

function oldHistory() {
  const quarters = [];
  for (let year = 2021; year <= 2025; year += 1) {
    for (let quarter = 1; quarter <= 4; quarter += 1) quarters.push(`${year}-Q${quarter}`);
  }
  return buildHistory(
    parseEurostatDataset(makeDataset({ quarters, valuesByCountry: valuesFor(quarters) })),
    {}
  );
}

function writeStoredSnapshot(directory) {
  const currentFile = path.join(directory, "eurostat.debt.gen.js");
  const historyFile = path.join(directory, "eurostat.debt.history.gen.js");
  const snapshotId = "old-snapshot";
  const updatedAt = "2026-04-24T00:00:00.000Z";
  const history = oldHistory();
  const latestRows = history.quarters.slice(-2);
  const currentValues = {};
  for (const code of EU27) {
    currentValues[code] = Object.fromEntries(
      latestRows.map((row) => [row.quarter, row.countries[code] / 1_000_000])
    );
  }
  const series = buildCurrentSeries(
    parseEurostatDataset(
      makeDataset({
        quarters: latestRows.map((row) => row.quarter),
        valuesByCountry: currentValues,
      })
    ),
    {}
  ).series;

  fs.writeFileSync(
    currentFile,
    renderCurrentGenerated({ snapshotId, updatedAt, report: {}, series }),
    "utf8"
  );
  fs.writeFileSync(
    historyFile,
    renderHistoryGenerated({ snapshotId, updatedAt, history }),
    "utf8"
  );
  return { currentFile, historyFile };
}

test("partial current data updates valid countries and retains the missing country", () => {
  const previous = oldCurrentSeries();
  const quarters = ["2025-Q4", "2026-Q1"];
  const missing = { MT: ["2025-Q4", "2026-Q1"] };
  const parsed = parseEurostatDataset(
    makeDataset({ quarters, valuesByCountry: valuesFor(quarters, { missing }) })
  );

  const result = buildCurrentSeries(parsed, previous);
  validateCurrentSeries(result.series);

  assert.equal(Object.keys(result.series).length, 27);
  assert.equal(result.series.NL.latestTime, "2026-Q1");
  assert.equal(result.series.MT.latestTime, "2025-Q4");
  assert.equal(result.report.dominantLatestTime, "2026-Q1");
  assert.equal(result.report.dominantCoverage, 26);
  assert.deepEqual(result.report.carriedForwardCodes, ["MT"]);
  assert.deepEqual(result.report.staleCodes, ["MT"]);
});

test("an older Eurostat response cannot regress a country", () => {
  const previous = oldCurrentSeries();
  const quarters = ["2025-Q2", "2025-Q3"];
  const parsed = parseEurostatDataset(
    makeDataset({ quarters, valuesByCountry: valuesFor(quarters) })
  );

  const result = buildCurrentSeries(parsed, previous);
  assert.deepEqual(result.series.NL, previous.NL);
  assert.ok(result.report.regressedSourceCodes.includes("NL"));
  assert.equal(result.report.dominantLatestTime, "2025-Q4");
});

test("an incomplete new history quarter is not presented as a complete EU-27 total", () => {
  const previous = oldHistory();
  const quarters = ["2025-Q4", "2026-Q1"];
  const missing = { MT: ["2026-Q1"] };
  const parsed = parseEurostatDataset(
    makeDataset({ quarters, valuesByCountry: valuesFor(quarters, { missing }) })
  );

  const result = buildHistory(parsed, previous);
  validateHistory(result);

  assert.equal(result.latestAvailableQuarter, "2026-Q1");
  assert.equal(result.latestCompleteQuarter, "2025-Q4");
  assert.equal(result.latestQuarter, "2025-Q4");
  assert.equal(result.partialQuarters.at(-1).quarter, "2026-Q1");
  assert.equal(result.partialQuarters.at(-1).countriesWithData, 26);
  assert.equal(result.quarters.at(-1).countriesWithData, 27);
});

test("a failed fetch leaves both stored files byte-for-byte unchanged", async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eudebt-update-failure-"));
  try {
    const files = writeStoredSnapshot(directory);
    const beforeCurrent = fs.readFileSync(files.currentFile, "utf8");
    const beforeHistory = fs.readFileSync(files.historyFile, "utf8");

    await assert.rejects(
      runUpdate({
        ...files,
        fetchImpl: async () => {
          throw new Error("simulated network failure");
        },
      }),
      /simulated network failure/
    );

    assert.equal(fs.readFileSync(files.currentFile, "utf8"), beforeCurrent);
    assert.equal(fs.readFileSync(files.historyFile, "utf8"), beforeHistory);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("a successful update writes one shared validated snapshot", async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eudebt-update-success-"));
  try {
    const files = writeStoredSnapshot(directory);
    const quarters = ["2025-Q4", "2026-Q1"];
    const dataset = makeDataset({ quarters, valuesByCountry: valuesFor(quarters) });

    const result = await runUpdate({
      ...files,
      fetchImpl: async () => ({ ok: true, status: 200, json: async () => dataset }),
      now: () => new Date("2026-07-21T12:00:00.000Z"),
    });

    const current = readCurrentGenerated(files.currentFile);
    const history = readHistoryGenerated(files.historyFile);
    validateCurrentSeries(current.series);
    validateHistory(history.history);

    assert.equal(current.snapshotId, result.snapshotId);
    assert.equal(history.snapshotId, result.snapshotId);
    assert.equal(current.updatedAt, history.updatedAt);
    assert.equal(current.report.dominantLatestTime, "2026-Q1");
    assert.equal(current.report.dominantCoverage, 27);
    assert.equal(history.history.latestQuarter, "2026-Q1");
    assert.equal(history.history.partialQuarters.length, 0);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("the generated date for a quarter is its UTC quarter end", () => {
  assert.equal(quarterEndDate("2026-Q1").toISOString(), "2026-03-31T23:59:59.000Z");
  assert.equal(quarterEndDate("2026Q2").toISOString(), "2026-06-30T23:59:59.000Z");
});

test("validation rejects a snapshot that loses a country", () => {
  const series = oldCurrentSeries();
  delete series.MT;
  assert.throws(() => validateCurrentSeries(series), /missing: MT/);
});

test("stored validation rejects a current value that disagrees with history", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eudebt-validation-mismatch-"));
  try {
    const files = writeStoredSnapshot(directory);
    const current = readCurrentGenerated(files.currentFile);
    current.series.NL.endValue += 1_000_000;
    fs.writeFileSync(
      files.currentFile,
      renderCurrentGenerated({
        snapshotId: current.snapshotId,
        updatedAt: current.updatedAt,
        report: {
          ...current.report,
          dominantLatestTime: "2025-Q4",
          dominantCoverage: 27,
        },
        series: current.series,
      }),
      "utf8"
    );

    assert.throws(() => validateStoredData(files), /does not match history for NL/);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
