const fs = require("node:fs/promises");
const path = require("node:path");
const { requestUrl, buildSnapshot, validateSnapshot } = require("./eurostat-per-capita-core");

async function updatePerCapita({
  target = path.join(__dirname, "../lib/fiscal/per-capita.gen.json"),
  fetchImpl = fetch, now = () => new Date().toISOString(),
} = {}) {
  const previous = await fs.readFile(target, "utf8").then(JSON.parse).catch((error) => {
    if (error.code === "ENOENT") return null;
    throw error;
  });
  const responses = Object.fromEntries(await Promise.all(["debt", "ratio", "population"].map(async (kind) => {
    const response = await fetchImpl(requestUrl(kind), { signal: AbortSignal.timeout(60000) });
    if (!response.ok) throw new Error(`${kind}: Eurostat HTTP ${response.status}`);
    return [kind, await response.json()];
  })));
  const snapshot = buildSnapshot(responses, now());
  validateSnapshot(snapshot, previous);
  const temporary = `${target}.${process.pid}.tmp`;
  try {
    await fs.writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
    validateSnapshot(JSON.parse(await fs.readFile(temporary, "utf8")), previous);
    await fs.rename(temporary, target);
  } finally { await fs.rm(temporary, { force: true }); }
  console.log(`Saved EU27 debt per resident inputs: debt ${snapshot.debtDate}, population ${snapshot.populationDate}`);
  return snapshot;
}
if (require.main === module) updatePerCapita().catch((error) => { console.error(error); process.exitCode = 1; });
module.exports = { updatePerCapita };
