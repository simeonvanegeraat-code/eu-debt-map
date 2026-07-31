const path = require("node:path");

const {
  periodSummary,
  readCurrentGenerated,
  readHistoryGenerated,
  validateCurrentSeries,
  validateHistory,
} = require("./eurostat-debt-core");

function validateStoredData({
  currentFile = path.join(process.cwd(), "lib", "eurostat.debt.gen.js"),
  historyFile = path.join(process.cwd(), "lib", "eurostat.debt.history.gen.js"),
} = {}) {
  const current = readCurrentGenerated(currentFile);
  const history = readHistoryGenerated(historyFile);

  validateCurrentSeries(current.series);
  validateHistory(history.history);

  if (!current.snapshotId || !history.snapshotId || current.snapshotId !== history.snapshotId) {
    throw new Error("Current and historical debt files do not share a valid snapshot ID");
  }
  if (!current.updatedAt || !history.updatedAt || current.updatedAt !== history.updatedAt) {
    throw new Error("Current and historical debt files do not share the same update time");
  }

  const summary = periodSummary(current.series);
  if (
    current.report?.dominantLatestTime !== summary.dominantLatestTime ||
    Number(current.report?.dominantCoverage) !== summary.dominantCoverage
  ) {
    throw new Error("The current debt update report does not match its country periods");
  }

  const historyRows = [
    ...(history.history.quarters || []),
    ...(history.history.partialQuarters || []),
  ];
  const historyByQuarter = new Map(historyRows.map((row) => [row.quarter, row]));
  let matchedCountries = 0;
  for (const [code, row] of Object.entries(current.series)) {
    const historicalRow = historyByQuarter.get(row.latestTime);
    const historicalValue = Number(historicalRow?.countries?.[code]);
    if (!Number.isFinite(historicalValue)) continue;
    matchedCountries += 1;

    const tolerance = Math.max(1, historicalValue * 1e-12);
    if (Math.abs(Number(row.endValue) - historicalValue) > tolerance) {
      throw new Error(
        `Current debt value does not match history for ${code} in ${row.latestTime}`
      );
    }
  }
  if (matchedCountries === 0) {
    throw new Error("Current and historical debt files have no matching country periods");
  }

  console.log(
    `[validate-eurostat-data] OK — 27 countries; ${summary.dominantLatestTime} ` +
      `covers ${summary.dominantCoverage}/27; history complete through ${history.history.latestQuarter}`
  );
  return { current, history, summary };
}

if (require.main === module) {
  try {
    validateStoredData();
  } catch (error) {
    console.error("[validate-eurostat-data] ERROR", error);
    process.exitCode = 1;
  }
}

module.exports = { validateStoredData };
