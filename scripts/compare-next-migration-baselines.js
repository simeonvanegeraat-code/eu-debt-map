const fs = require("node:fs");
const path = require("node:path");

function readSnapshot(file) {
  return JSON.parse(fs.readFileSync(path.resolve(file), "utf8"));
}

function normalizeTwitterImage(value) {
  if (typeof value !== "string" || !value.includes("/twitter-image?")) return value;
  return value.replace(/\?.*$/, "?<build-hash>");
}

function normalizeStaticCacheControl(value) {
  if (value === "s-maxage=31536000, stale-while-revalidate") return "s-maxage=31536000";
  return value;
}

function comparableRoute(snapshot) {
  const route = structuredClone(snapshot);
  if (route.headers?.["cache-control"]) {
    route.headers["cache-control"] = normalizeStaticCacheControl(
      route.headers["cache-control"],
    );
  }
  if (route.route === "/rss.xml") delete route.headers?.["cache-control"];

  const twitter = route.html?.metadata?.twitter;
  if (twitter?.["twitter:image"]) {
    twitter["twitter:image"] = normalizeTwitterImage(twitter["twitter:image"]);
  }

  return route;
}

function comparableSnapshot(snapshot) {
  return {
    fileIntegrity: snapshot.fileIntegrity,
    sitemap: snapshot.sitemap,
    routes: snapshot.routes.map(comparableRoute),
  };
}

function assertPostMigrationInvariants(snapshot) {
  const rss = snapshot.routes.find((route) => route.route === "/rss.xml");
  const rssCacheControl = rss?.headers?.["cache-control"] || "";
  if (!/^s-maxage=1800(?:,|$)/.test(rssCacheControl)) {
    throw new Error(`RSS cache is not explicitly set to 30 minutes: ${rssCacheControl || "missing"}`);
  }
}

function collectDifferences(left, right, currentPath = "baseline", differences = []) {
  if (differences.length >= 200) return differences;

  if (Object.is(left, right)) return differences;

  const leftIsObject = left !== null && typeof left === "object";
  const rightIsObject = right !== null && typeof right === "object";

  if (!leftIsObject || !rightIsObject || Array.isArray(left) !== Array.isArray(right)) {
    differences.push({ path: currentPath, before: left, after: right });
    return differences;
  }

  if (Array.isArray(left)) {
    if (left.length !== right.length) {
      differences.push({
        path: `${currentPath}.length`,
        before: left.length,
        after: right.length,
      });
    }

    for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
      collectDifferences(left[index], right[index], `${currentPath}[${index}]`, differences);
    }
    return differences;
  }

  const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])].sort();
  for (const key of keys) {
    collectDifferences(left[key], right[key], `${currentPath}.${key}`, differences);
  }

  return differences;
}

const [beforeFile, afterFile] = process.argv.slice(2);
if (!beforeFile || !afterFile) {
  console.error("Usage: node scripts/compare-next-migration-baselines.js <before.json> <after.json>");
  process.exit(1);
}

const before = readSnapshot(beforeFile);
const after = readSnapshot(afterFile);
assertPostMigrationInvariants(after);
const differences = collectDifferences(
  comparableSnapshot(before),
  comparableSnapshot(after),
);

if (!differences.length) {
  console.log(
    `[migration-baseline] MATCH: ${before.sitemap.routeCount} sitemap URLs and ${before.routes.length} captured routes`,
  );
  process.exit(0);
}

console.error(`[migration-baseline] ${differences.length} difference(s) found:`);
for (const difference of differences) {
  console.error(`- ${difference.path}`);
  console.error(`  before: ${JSON.stringify(difference.before)}`);
  console.error(`  after:  ${JSON.stringify(difference.after)}`);
}
process.exit(1);
