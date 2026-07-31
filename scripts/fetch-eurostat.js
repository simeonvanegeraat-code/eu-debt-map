// Backwards-compatible entry point. The shared updater now creates both
// current and historical debt files from one validated Eurostat response.
const { runUpdate } = require("./update-eurostat-debt");

runUpdate().catch((error) => {
  console.error("[fetch-eurostat] ERROR — last-known-good files were kept", error);
  process.exitCode = 1;
});
