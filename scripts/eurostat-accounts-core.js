const { EU27 } = require("../lib/fiscal/indicators");
const { ACCOUNTS } = require("../lib/fiscal/accounts");
const { annualRequestUrl, parseAnnualSource } = require("./eurostat-annual-source");
const KINDS = Object.keys(ACCOUNTS.sources);
function requestUrl(kind) {
  if (!KINDS.includes(kind)) throw new Error("Unknown government account source");
  return annualRequestUrl(ACCOUNTS.sources[kind], ACCOUNTS.points, ACCOUNTS.geographies);
}
function buildSnapshot(responses, fetchedAt = new Date().toISOString()) {
  const parsed = Object.fromEntries(KINDS.map(kind => [kind, parseAnnualSource(responses[kind], ACCOUNTS.sources[kind], fetchedAt, ACCOUNTS.geographies)]));
  const latestYear = Object.keys(parsed.expenditure.series).sort().at(-1);
  if (!latestYear || KINDS.some(kind => Object.keys(parsed[kind].series).sort().at(-1) !== latestYear || parsed[kind].updated !== parsed.expenditure.updated)) throw new Error("Government accounts must share a reporting year and source vintage");
  const years = Array.from({ length: ACCOUNTS.points }, (_, i) => String(Number(latestYear) - ACCOUNTS.points + 1 + i));
  const row = code => Object.fromEntries(KINDS.flatMap(kind => [
    [kind, years.map(year => parsed[kind].series[year]?.[code]?.value ?? null)],
    [`${kind}Status`, years.map(year => parsed[kind].series[year]?.[code]?.status || "")],
  ]));
  return validateSnapshot({ schemaVersion: 1, fetchedAt, latestYear, years,
    sources: Object.fromEntries(KINDS.map(kind => [kind, { ...ACCOUNTS.sources[kind], updated: parsed[kind].updated, url: requestUrl(kind) }])),
    countries: Object.fromEntries(EU27.map(code => [code, row(code)])), eu: row("EU27_2020"),
  });
}
function validateSnapshot(snapshot, previous = null) {
  const fail = message => { throw new Error(`Government accounts: ${message}`); };
  if (snapshot?.schemaVersion !== 1 || !Number.isFinite(Date.parse(snapshot.fetchedAt)) || !/^\d{4}$/.test(snapshot.latestYear) || Number(snapshot.latestYear) >= new Date(snapshot.fetchedAt).getUTCFullYear()) fail("invalid schema or completed annual period");
  const years = Array.from({ length: ACCOUNTS.points }, (_, i) => String(Number(snapshot.latestYear) - ACCOUNTS.points + 1 + i));
  if (JSON.stringify(years) !== JSON.stringify(snapshot.years)) fail("11 consecutive annual periods required");
  if (previous && (snapshot.latestYear < previous.latestYear || Date.parse(snapshot.fetchedAt) < Date.parse(previous.fetchedAt))) fail("period/access regression");
  if (Object.keys(snapshot.countries || {}).sort().join() !== [...EU27].sort().join()) fail("EU27 coverage required");
  for (const kind of KINDS) {
    const source = snapshot.sources?.[kind], expected = ACCOUNTS.sources[kind];
    if (source?.dataset !== expected.dataset || JSON.stringify(source.filters) !== JSON.stringify(expected.filters) || source.url !== requestUrl(kind)) fail(`invalid ${kind} source`);
    if (!Number.isFinite(Date.parse(source.updated)) || Date.parse(source.updated) > Date.parse(snapshot.fetchedAt) || source.updated !== snapshot.sources.expenditure.updated || (previous && Date.parse(source.updated) < Date.parse(previous.sources[kind].updated))) fail("source vintage/date mismatch or regression");
  }
  for (const code of ACCOUNTS.geographies) {
    const row = code === "EU27_2020" ? snapshot.eu : snapshot.countries[code];
    const old = code === "EU27_2020" ? previous?.eu : previous?.countries[code];
    for (const kind of KINDS) {
      const values = row?.[kind], flags = row?.[`${kind}Status`];
      if (!Array.isArray(values) || !Array.isArray(flags) || values.length !== years.length || flags.length !== years.length) fail(`invalid ${code} ${kind} series`);
      for (let i = 0; i < years.length; i++) {
        const value = values[i], limit = kind.endsWith("Ratio") ? 200 : 100000000;
        if (typeof flags[i] !== "string" || (value !== null && (!Number.isFinite(value) || Math.abs(value) > limit || (!kind.startsWith("balance") && value < 0) || /f/i.test(flags[i])))) fail(`invalid observation: ${code} ${kind} ${years[i]}`);
        const oldIndex = previous?.years.indexOf(years[i]);
        if (old && oldIndex >= 0 && Number.isFinite(old[kind][oldIndex]) && value === null) fail(`lost previous observation: ${code} ${kind} ${years[i]}`);
      }
      if (!Number.isFinite(values.at(-1))) fail(`incomplete latest ${code} ${kind}`);
    }
    years.forEach((year, i) => {
      for (const suffix of ["", "Ratio"]) {
        const [revenue, expenditure, balance] = ["revenue", "expenditure", "balance"].map(key => row[`${key}${suffix}`][i]);
        if ([revenue, expenditure, balance].every(Number.isFinite)) {
          const tolerance = suffix ? ACCOUNTS.ratioIdentityTolerance : ACCOUNTS.amountIdentityTolerance;
          if (Math.abs(revenue - expenditure - balance) > tolerance + 1e-7) fail(`revenue minus expenditure identity: ${code} ${year} ${suffix || "MIO_EUR"}`);
        }
      }
    });
  }
  // The official EU monetary aggregate is checked, never replaced with our own sum.
  for (const kind of ["expenditure", "revenue", "balance"]) years.forEach((year, i) => {
    const countries = EU27.map(code => snapshot.countries[code][kind][i]), aggregate = snapshot.eu[kind][i];
    if (countries.every(Number.isFinite) && Number.isFinite(aggregate) && Math.abs(countries.reduce((a, b) => a + b, 0) - aggregate) > (EU27.length + 1) * .5 + 1e-7) fail(`EU aggregate differs from countries: ${kind} ${year}`);
  });
  return snapshot;
}
module.exports = { KINDS, requestUrl, buildSnapshot, validateSnapshot };
