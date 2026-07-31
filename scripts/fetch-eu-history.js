// Backwards-compatible entry point. History is intentionally updated together
// with current country data so both files always describe the same snapshot.
const { runUpdate } = require("./update-eurostat-debt");

runUpdate().catch((error) => {
  console.error("[fetch-eu-history] ERROR — last-known-good files were kept", error);
  process.exitCode = 1;
});
