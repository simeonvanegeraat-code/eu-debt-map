const fs = require("node:fs");
const path = require("node:path");

const {
  buildCurrentSeries,
  buildEurostatUrl,
  buildHistory,
  parseEurostatDataset,
  readCurrentGenerated,
  readHistoryGenerated,
  renderCurrentGenerated,
  renderHistoryGenerated,
  validateCurrentSeries,
  validateHistory,
} = require("./eurostat-debt-core");

function replaceGeneratedPair({ currentFile, historyFile, currentSource, historySource, previous }) {
  fs.mkdirSync(path.dirname(currentFile), { recursive: true });
  fs.mkdirSync(path.dirname(historyFile), { recursive: true });

  const suffix = `.tmp-${process.pid}-${Date.now()}`;
  const currentTemp = `${currentFile}${suffix}`;
  const historyTemp = `${historyFile}${suffix}`;

  fs.writeFileSync(currentTemp, currentSource, "utf8");
  fs.writeFileSync(historyTemp, historySource, "utf8");

  try {
    fs.renameSync(currentTemp, currentFile);
    fs.renameSync(historyTemp, historyFile);
  } catch (error) {
    if (previous.currentSource != null) {
      fs.writeFileSync(currentFile, previous.currentSource, "utf8");
    }
    if (previous.historySource != null) {
      fs.writeFileSync(historyFile, previous.historySource, "utf8");
    }
    if (fs.existsSync(currentTemp)) fs.rmSync(currentTemp, { force: true });
    if (fs.existsSync(historyTemp)) fs.rmSync(historyTemp, { force: true });
    throw error;
  }
}

async function runUpdate({
  fetchImpl = globalThis.fetch,
  currentFile = path.join(process.cwd(), "lib", "eurostat.debt.gen.js"),
  historyFile = path.join(process.cwd(), "lib", "eurostat.debt.history.gen.js"),
  now = () => new Date(),
} = {}) {
  if (typeof fetchImpl !== "function") throw new Error("No fetch implementation available");

  const previousCurrent = readCurrentGenerated(currentFile);
  const previousHistory = readHistoryGenerated(historyFile);
  const url = buildEurostatUrl();
  console.log("[update-eurostat-debt] GET", url);

  const response = await fetchImpl(url, { headers: { accept: "application/json" } });
  if (!response?.ok) {
    throw new Error(
      `Eurostat fetch failed: ${response?.status ?? "unknown"} ${response?.statusText || ""}`.trim()
    );
  }

  const parsed = parseEurostatDataset(await response.json());
  const current = buildCurrentSeries(parsed, previousCurrent.series);
  const history = buildHistory(parsed, previousHistory.history);
  validateCurrentSeries(current.series);
  validateHistory(history);

  const updatedAt = now().toISOString();
  const snapshotId = `${updatedAt}|${parsed.latestAvailableQuarter || "unknown"}`;
  const report = {
    fetchedAt: updatedAt,
    sourceLatestAvailableQuarter: parsed.latestAvailableQuarter,
    ...current.report,
    latestCompleteHistoryQuarter: history.latestCompleteQuarter,
    latestAvailableHistoryQuarter: history.latestAvailableQuarter,
  };

  const currentSource = renderCurrentGenerated({
    snapshotId,
    updatedAt,
    report,
    series: current.series,
  });
  const historySource = renderHistoryGenerated({ snapshotId, updatedAt, history });

  // Parse and validate the exact strings before replacing either last-known-good file.
  const currentProbe = `${currentFile}.probe-${process.pid}`;
  const historyProbe = `${historyFile}.probe-${process.pid}`;
  try {
    fs.writeFileSync(currentProbe, currentSource, "utf8");
    fs.writeFileSync(historyProbe, historySource, "utf8");
    const parsedCurrentOutput = readCurrentGenerated(currentProbe);
    const parsedHistoryOutput = readHistoryGenerated(historyProbe);
    validateCurrentSeries(parsedCurrentOutput.series);
    validateHistory(parsedHistoryOutput.history);
    if (
      parsedCurrentOutput.snapshotId !== snapshotId ||
      parsedHistoryOutput.snapshotId !== snapshotId
    ) {
      throw new Error("Generated debt files do not share the same snapshot ID");
    }
  } finally {
    if (fs.existsSync(currentProbe)) fs.rmSync(currentProbe, { force: true });
    if (fs.existsSync(historyProbe)) fs.rmSync(historyProbe, { force: true });
  }

  replaceGeneratedPair({
    currentFile,
    historyFile,
    currentSource,
    historySource,
    previous: {
      currentSource: previousCurrent.source,
      historySource: previousHistory.source,
    },
  });

  console.log(
    `[update-eurostat-debt] saved ${Object.keys(current.series).length} countries; ` +
      `${report.dominantLatestTime} covers ${report.dominantCoverage}/27; ` +
      `history complete through ${history.latestCompleteQuarter}`
  );
  if (report.carriedForwardCodes.length > 0) {
    console.warn(
      `[update-eurostat-debt] kept last-known-good data for: ${report.carriedForwardCodes.join(", ")}`
    );
  }
  if (history.updateReport.partialQuarters.length > 0) {
    console.warn(
      "[update-eurostat-debt] incomplete history quarters are stored separately and not shown as EU-27 totals:",
      history.updateReport.partialQuarters
        .map((row) => `${row.quarter} (${row.countriesWithData}/27)`)
        .join(", ")
    );
  }

  return { snapshotId, updatedAt, report, history };
}

async function main() {
  try {
    await runUpdate();
  } catch (error) {
    console.error("[update-eurostat-debt] ERROR — last-known-good files were kept", error);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = { runUpdate };
