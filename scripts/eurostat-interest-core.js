const { EU27 } = require("../lib/fiscal/indicators");
const { INTEREST } = require("../lib/fiscal/interest");
const { annualRequestUrl, parseAnnualSource } = require("./eurostat-annual-source");
const KINDS = Object.keys(INTEREST.sources);

function requestUrl(kind) {
  if (!KINDS.includes(kind)) throw new Error("Unknown interest source");
  // Demography exposes an empty current year: retain one additional year of coverage.
  return annualRequestUrl(INTEREST.sources[kind], INTEREST.points + (kind === "population" ? 1 : 0));
}

function buildSnapshot(responses, fetchedAt = new Date().toISOString()) {
  const parsed = Object.fromEntries(KINDS.map(kind => [kind, parseAnnualSource(responses[kind], INTEREST.sources[kind], fetchedAt)]));
  const latestYear = Object.keys(parsed.amount.series).sort().at(-1);
  if (!latestYear || ["ratio", "revenue"].some(kind => Object.keys(parsed[kind].series).sort().at(-1) !== latestYear || parsed[kind].updated !== parsed.amount.updated)) throw new Error("Interest accounts must share a reporting year and vintage");
  const years = Array.from({ length: INTEREST.points }, (_, i) => String(Number(latestYear) - INTEREST.points + 1 + i));
  return validateSnapshot({ schemaVersion: 1, fetchedAt, latestYear, years,
    sources: Object.fromEntries(KINDS.map(kind => [kind, { ...INTEREST.sources[kind], updated: parsed[kind].updated, url: requestUrl(kind) }])),
    countries: Object.fromEntries(EU27.map(code => [code, Object.fromEntries(KINDS.flatMap(kind => [
      [kind, years.map(year => parsed[kind].series[year]?.[code]?.value ?? null)],
      [`${kind}Status`, years.map(year => parsed[kind].series[year]?.[code]?.status || "")],
    ]))])),
  });
}

function validateSnapshot(snapshot, previous = null) {
  const fail = message => { throw new Error(`Interest snapshot: ${message}`); };
  if (snapshot?.schemaVersion !== 1 || !Number.isFinite(Date.parse(snapshot.fetchedAt)) || !/^\d{4}$/.test(snapshot.latestYear) || Number(snapshot.latestYear) >= new Date(snapshot.fetchedAt).getUTCFullYear()) fail("invalid schema or dates");
  const years = Array.from({ length: INTEREST.points }, (_, i) => String(Number(snapshot.latestYear) - INTEREST.points + 1 + i));
  if (JSON.stringify(years) !== JSON.stringify(snapshot.years)) fail("11 consecutive annual periods required");
  if (previous && (snapshot.latestYear < previous.latestYear || Date.parse(snapshot.fetchedAt) < Date.parse(previous.fetchedAt))) fail("period/access regression");
  for (const kind of KINDS) {
    const source = snapshot.sources?.[kind], expected = INTEREST.sources[kind];
    if (source?.dataset !== expected.dataset || JSON.stringify(source.filters) !== JSON.stringify(expected.filters) || source.url !== requestUrl(kind)) fail(`invalid ${kind} source definition`);
    if (!Number.isFinite(Date.parse(source.updated)) || Date.parse(source.updated) > Date.parse(snapshot.fetchedAt) || (previous && Date.parse(source.updated) < Date.parse(previous.sources[kind].updated))) fail("invalid source date/regression");
  }
  if (["ratio", "revenue"].some(kind => snapshot.sources[kind].updated !== snapshot.sources.amount.updated)) fail("accounts vintage mismatch");
  if (Object.keys(snapshot.countries || {}).sort().join() !== [...EU27].sort().join()) fail("EU27 coverage required");
  for (const code of EU27) for (const kind of KINDS) {
    const values = snapshot.countries[code]?.[kind], flags = snapshot.countries[code]?.[`${kind}Status`];
    if (!Array.isArray(values) || !Array.isArray(flags) || values.length !== years.length || flags.length !== years.length) fail(`invalid history: ${code} ${kind}`);
    for (let i = 0; i < years.length; i++) {
      const value = values[i];
      const min = ["revenue", "population"].includes(kind) ? 1 : 0;
      const max = kind === "ratio" ? 100 : kind === "population" ? 200000000 : 100000000;
      if (typeof flags[i] !== "string" || (value !== null && (!Number.isFinite(value) || value < min || value > max || /f/i.test(flags[i])))) fail(`invalid ${kind} observation: ${code} ${years[i]}`);
      if (kind === "population" && value !== null && !Number.isSafeInteger(value)) fail(`population must be a count of persons: ${code}`);
    }
    if (!Number.isFinite(values.at(-1))) fail(`incomplete latest ${kind}: ${code}`);
    if (previous) years.forEach((year, i) => {
      const old = previous.years.indexOf(year);
      if (old >= 0 && Number.isFinite(previous.countries[code][kind][old]) && values[i] === null) fail(`lost previous observation: ${code} ${kind} ${year}`);
    });
  }
  return snapshot;
}
module.exports = { KINDS, requestUrl, buildSnapshot, validateSnapshot };
