const fs = require("node:fs");
const path = require("node:path");

const {
  buildRatioEurostatUrl,
  buildRatioSeries,
  parseEurostatDataset,
  readRatioGenerated,
  renderRatioGenerated,
  validateRatioSeries,
} = require("./eurostat-ratio-core");

function replaceGeneratedFile({ file, source }) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const suffix = `.tmp-${process.pid}-${Date.now()}`;
  const temp = `${file}${suffix}`;
  const probe = `${file}.probe-${process.pid}-${Date.now()}`;

  try {
    fs.writeFileSync(probe, source, "utf8");
    const parsed = readRatioGenerated(probe);
    validateRatioSeries(parsed.series);

    fs.writeFileSync(temp, source, "utf8");
    fs.renameSync(temp, file);
  } finally {
    if (fs.existsSync(probe)) fs.rmSync(probe, { force: true });
    if (fs.existsSync(temp)) fs.rmSync(temp, { force: true });
  }
}

async function runRatioUpdate({
  fetchImpl = globalThis.fetch,
  ratioFile = path.join(process.cwd(), "lib", "eurostat.ratio.gen.js"),
  now = () => new Date(),
} = {}) {
  if (typeof fetchImpl !== "function") throw new Error("No fetch implementation available");

  const previous = readRatioGenerated(ratioFile);
  const url = buildRatioEurostatUrl();
  console.log("[update-eurostat-ratios] GET", url);

  const response = await fetchImpl(url, { headers: { accept: "application/json" } });
  if (!response?.ok) {
    throw new Error(
      `Eurostat ratio fetch failed: ${response?.status ?? "unknown"} ${
        response?.statusText || ""
      }`.trim()
    );
  }

  const parsed = parseEurostatDataset(await response.json());
  const current = buildRatioSeries(parsed, previous.series);
  validateRatioSeries(current.series);

  const updatedAt = now().toISOString();
  const snapshotId = `${updatedAt}|${parsed.latestAvailableQuarter || "unknown"}|PC_GDP`;
  const report = {
    fetchedAt: updatedAt,
    sourceLatestAvailableQuarter: parsed.latestAvailableQuarter,
    sourceUnit: "PC_GDP",
    ...current.report,
  };
  const source = renderRatioGenerated({
    snapshotId,
    updatedAt,
    report,
    series: current.series,
  });

  replaceGeneratedFile({ file: ratioFile, source });

  console.log(
    `[update-eurostat-ratios] saved ${Object.keys(current.series).length} countries; ` +
      `${report.dominantLatestTime} covers ${report.dominantCoverage}/27`
  );
  if (report.carriedForwardCodes.length > 0) {
    console.warn(
      `[update-eurostat-ratios] kept last-known-good ratios for: ${report.carriedForwardCodes.join(
        ", "
      )}`
    );
  }

  return { snapshotId, updatedAt, report, series: current.series };
}

async function main() {
  try {
    await runRatioUpdate();
  } catch (error) {
    console.error(
      "[update-eurostat-ratios] ERROR — last-known-good ratio file was kept",
      error
    );
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = { replaceGeneratedFile, runRatioUpdate };
