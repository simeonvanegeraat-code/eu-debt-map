const path = require("node:path");

const {
  periodSummary,
  readRatioGenerated,
  validateRatioSeries,
} = require("./eurostat-ratio-core");

function validateStoredRatios({
  ratioFile = path.join(process.cwd(), "lib", "eurostat.ratio.gen.js"),
} = {}) {
  const stored = readRatioGenerated(ratioFile);
  validateRatioSeries(stored.series);

  if (!stored.snapshotId || !stored.updatedAt) {
    throw new Error("Debt-to-GDP snapshot has no valid snapshot ID or update time");
  }
  if (stored.report?.sourceUnit !== "PC_GDP") {
    throw new Error("Debt-to-GDP snapshot does not identify Eurostat unit PC_GDP");
  }

  const summary = periodSummary(stored.series);
  if (
    stored.report?.dominantLatestTime !== summary.dominantLatestTime ||
    Number(stored.report?.dominantCoverage) !== summary.dominantCoverage
  ) {
    throw new Error("Debt-to-GDP update report does not match its country periods");
  }

  console.log(
    `[validate-eurostat-ratios] OK — 27 countries; ${summary.dominantLatestTime} ` +
      `covers ${summary.dominantCoverage}/27`
  );
  return { stored, summary };
}

if (require.main === module) {
  try {
    validateStoredRatios();
  } catch (error) {
    console.error("[validate-eurostat-ratios] ERROR", error);
    process.exitCode = 1;
  }
}

module.exports = { validateStoredRatios };
