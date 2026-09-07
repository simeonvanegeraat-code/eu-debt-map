const { EU27, BALANCE } = require("../lib/fiscal/indicators");
const { decodeJsonStat } = require("./eurostat-jsonstat");
const GEOS = [...EU27, "EU27_2020"];

function requestUrl(filters) {
  const url = new URL(BALANCE.apiBase);
  for (const [key, value] of Object.entries({ lang: "EN", ...filters, lastTimePeriod: String(BALANCE.historyLimit) })) {
    url.searchParams.set(key, value);
  }
  for (const geo of GEOS) url.searchParams.append("geo", geo === "GR" ? "EL" : geo);
  return url.href;
}

function parseAnnualDataset(data, filters, fetchedAt) {
  if (data?.extension?.id?.toLowerCase() !== BALANCE.dataset || data?.source !== "ESTAT" ||
      !Number.isFinite(Date.parse(data.updated))) throw new Error("Unexpected source metadata");
  if (data.id?.length !== 6 || !data.id.includes("geo") || !data.id.includes("time")) {
    throw new Error("Unexpected dataset dimensions");
  }
  const series = {};
  const years = new Set();
  for (const observation of decodeJsonStat(data)) {
    const dimensions = observation.dimensions;
    for (const [key, expected] of Object.entries(filters)) {
      if (dimensions[key] !== expected) throw new Error(`Unexpected filter ${key}: ${dimensions[key]}`);
    }
    const year = dimensions.time;
    if (!/^\d{4}$/.test(year)) throw new Error(`Not an annual period: ${year}`);
    // Current/future calendar years and explicit forecasts cannot enter the official view.
    if (Number(year) >= new Date(fetchedAt).getUTCFullYear()) continue;
    const code = dimensions.geo === "EL" ? "GR" : dimensions.geo;
    if (!GEOS.includes(code)) throw new Error(`Unexpected geography: ${code}`);
    years.add(year);
    series[code] ||= {};
    if (series[code][year]) throw new Error(`Duplicate observation: ${code} ${year}`);
    series[code][year] = { value: /f/i.test(observation.status) ? null : observation.value, status: observation.status };
  }
  return { series, years: [...years].sort(), updated: data.updated };
}

function buildSnapshot(balanceData, debtData, fetchedAt = new Date().toISOString()) {
  const balance = parseAnnualDataset(balanceData, BALANCE.filters, fetchedAt);
  const debt = parseAnnualDataset(debtData, BALANCE.debtFilters, fetchedAt);
  if (balance.updated !== debt.updated || JSON.stringify(balance.years) !== JSON.stringify(debt.years)) {
    throw new Error("Balance and annual debt must have the same source vintage and years");
  }
  const snapshot = {
    schemaVersion: 1, dataset: BALANCE.dataset,
    filters: { balance: BALANCE.filters, debt: BALANCE.debtFilters },
    fetchedAt, sourceUpdated: balance.updated,
    sourceUrls: { balance: requestUrl(BALANCE.filters), debt: requestUrl(BALANCE.debtFilters) },
    years: balance.years, latestCompleteYear: balance.years.at(-1), series: {},
  };
  for (const code of GEOS) {
    snapshot.series[code] = {};
    for (const year of snapshot.years) {
      const b = balance.series[code]?.[year];
      const d = debt.series[code]?.[year];
      snapshot.series[code][year] = {
        balance: b?.value ?? null, debtRatio: d?.value ?? null,
        balanceStatus: b?.status || "", debtStatus: d?.status || "",
      };
    }
  }
  validateSnapshot(snapshot);
  return snapshot;
}

function validateSnapshot(snapshot, previous = null) {
  const fail = (message) => { throw new Error(`Fiscal snapshot: ${message}`); };
  if (snapshot?.schemaVersion !== 1 || snapshot.dataset !== BALANCE.dataset) fail("invalid schema/dataset");
  for (const [kind, expected] of Object.entries({ balance: BALANCE.filters, debt: BALANCE.debtFilters })) {
    if (JSON.stringify(snapshot.filters?.[kind]) !== JSON.stringify(expected)) fail(`incorrect ${kind} filters`);
    if (snapshot.sourceUrls?.[kind] !== requestUrl(expected)) fail(`incorrect ${kind} provenance`);
  }
  if (![snapshot.fetchedAt, snapshot.sourceUpdated].every((date) => Number.isFinite(Date.parse(date)))) fail("invalid dates");
  if (Date.parse(snapshot.sourceUpdated) > Date.parse(snapshot.fetchedAt)) fail("source update after access date");
  const years = snapshot.years;
  if (!Array.isArray(years) || years.length < 2 || years.length > BALANCE.historyLimit ||
      years.some((y, i) => !/^\d{4}$/.test(y) || (i > 0 && Number(y) !== Number(years[i - 1]) + 1))) fail("invalid annual periods");
  if (snapshot.latestCompleteYear !== years.at(-1) || Number(years.at(-1)) >= new Date(snapshot.fetchedAt).getUTCFullYear()) fail("invalid reporting year");
  if (previous && (snapshot.latestCompleteYear < previous.latestCompleteYear || Date.parse(snapshot.sourceUpdated) < Date.parse(previous.sourceUpdated))) fail("source regression");
  if (Object.keys(snapshot.series || {}).sort().join() !== [...GEOS].sort().join()) fail("expected EU27 and official EU aggregate");
  for (const code of GEOS) {
    if (Object.keys(snapshot.series[code]).sort().join() !== years.join()) fail(`incorrect periods: ${code}`);
    for (const year of years) {
      const row = snapshot.series[code][year];
      if (!row || typeof row.balanceStatus !== "string" || typeof row.debtStatus !== "string") fail(`missing flags: ${code}/${year}`);
      for (const [key, flag, min, max] of [["balance", "balanceStatus", -100, 100], ["debtRatio", "debtStatus", 0, 500]]) {
        const value = row[key];
        if (value !== null && (!Number.isFinite(value) || value < min || value > max || /f/i.test(row[flag]))) fail(`invalid ${key}: ${code}/${year}`);
        // Fail closed on partial latest releases. Keep the previous snapshot on disk.
        if (years.slice(-2).includes(year) && value === null) fail(`incomplete latest comparison: ${code}/${year}/${key}`);
      }
    }
  }
  return snapshot;
}
module.exports = { requestUrl, parseAnnualDataset, buildSnapshot, validateSnapshot };
