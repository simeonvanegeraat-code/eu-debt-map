const fs = require("node:fs/promises");
const path = require("node:path");
const { BALANCE } = require("../lib/fiscal/indicators");
const { requestUrl, buildSnapshot, validateSnapshot } = require("./eurostat-balance-core");

async function updateBalance({
  target = path.join(__dirname, "../lib/fiscal/balance.gen.json"),
  fetchImpl = fetch,
  now = () => new Date().toISOString(),
} = {}) {
  const previous = await fs.readFile(target, "utf8").then(JSON.parse).catch((error) => {
    if (error.code === "ENOENT") return null;
    throw error;
  });
  const responses = await Promise.all([BALANCE.filters, BALANCE.debtFilters].map(async (filters) => {
    const response = await fetchImpl(requestUrl(filters), { signal: AbortSignal.timeout(60000) });
    if (!response.ok) throw new Error(`Eurostat HTTP ${response.status}`);
    return response.json();
  }));
  const snapshot = buildSnapshot(...responses, now());
  validateSnapshot(snapshot, previous);
  const temporary = `${target}.${process.pid}.tmp`;
  try {
    await fs.writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
    validateSnapshot(JSON.parse(await fs.readFile(temporary, "utf8")), previous);
    await fs.rename(temporary, target);
  } finally {
    await fs.rm(temporary, { force: true });
  }
  console.log(`Saved annual balance and matched debt: EU27 + EU aggregate, ${snapshot.years[0]}–${snapshot.latestCompleteYear}; source ${snapshot.sourceUpdated}`);
  return snapshot;
}
if (require.main === module) {
  updateBalance().catch((error) => { console.error(error); process.exitCode = 1; });
}
module.exports = { updateBalance };
