const fs = require("node:fs/promises");
const path = require("node:path");
const { requestUrl, buildSnapshot, validateSnapshot } = require("./eurostat-inflation-core");

async function updateInflation({ target = path.join(__dirname, "../lib/inflation/inflation.gen.json"), fetchImpl = fetch, now = () => new Date().toISOString() } = {}) {
  const previous = await fs.readFile(target, "utf8").then(JSON.parse).catch(error => {
    if (error.code === "ENOENT") return null;
    throw error;
  });
  if (previous) validateSnapshot(previous);
  const response = await fetchImpl(requestUrl(), { signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw new Error(`Inflation: HTTP ${response.status}`);
  const snapshot = validateSnapshot(buildSnapshot(await response.json(), now()), previous);
  const temporary = `${target}.${process.pid}.tmp`;
  try {
    await fs.writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`);
    validateSnapshot(JSON.parse(await fs.readFile(temporary, "utf8")), previous);
    await fs.rename(temporary, target);
  } finally { await fs.rm(temporary, { force: true }); }
  console.log(`Saved inflation: ${snapshot.periods[0]} to ${snapshot.latestMonth}; EU27 + official euro area and EU aggregates`);
  return snapshot;
}
if (require.main === module) updateInflation().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { updateInflation };
