const fs = require("node:fs/promises");
const path = require("node:path");
const { KINDS, requestUrl, buildSnapshot, validateSnapshot } = require("./eurostat-accounts-core");

async function updateAccounts({ target = path.join(__dirname, "../lib/fiscal/accounts.gen.json"), fetchImpl = fetch, now = () => new Date().toISOString() } = {}) {
  const previous = await fs.readFile(target, "utf8").then(JSON.parse).catch(error => { if (error.code === "ENOENT") return null; throw error; });
  const responses = Object.fromEntries(await Promise.all(KINDS.map(async kind => {
    const response = await fetchImpl(requestUrl(kind), { signal: AbortSignal.timeout(60000) });
    if (!response.ok) throw new Error(`Government accounts ${kind}: HTTP ${response.status}`);
    return [kind, await response.json()];
  })));
  const snapshot = validateSnapshot(buildSnapshot(responses, now()), previous);
  const temporary = `${target}.${process.pid}.tmp`;
  try {
    await fs.writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`);
    validateSnapshot(JSON.parse(await fs.readFile(temporary, "utf8")), previous);
    await fs.rename(temporary, target);
  } finally { await fs.rm(temporary, { force: true }); }
  console.log(`Saved government accounts: ${snapshot.years[0]}–${snapshot.latestYear}, EU27 and official EU aggregate, TR − TE = B9 validated`);
  return snapshot;
}
if (require.main === module) updateAccounts().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { updateAccounts };
