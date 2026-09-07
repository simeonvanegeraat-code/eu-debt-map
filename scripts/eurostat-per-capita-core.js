const { EU27 } = require("../lib/fiscal/indicators");
const { PER_CAPITA } = require("../lib/fiscal/per-capita");
const { decodeJsonStat } = require("./eurostat-jsonstat");
const KINDS = ["debt", "ratio", "population"];

function requestUrl(kind) {
  const definition = PER_CAPITA[kind];
  if (!KINDS.includes(kind)) throw new Error("Unknown per-capita source");
  const url = new URL(`https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/${definition.dataset}`);
  for (const [key, value] of Object.entries({ lang: "EN", ...definition.filters, lastTimePeriod: "3" })) url.searchParams.set(key, value);
  for (const code of EU27) url.searchParams.append("geo", code === "GR" ? "EL" : code);
  return url.href;
}

function parseSource(data, kind, fetchedAt) {
  const definition = PER_CAPITA[kind];
  if (data?.source !== "ESTAT" || data?.extension?.id?.toLowerCase() !== definition.dataset ||
      !Number.isFinite(Date.parse(data.updated)) || Date.parse(data.updated) > Date.parse(fetchedAt)) throw new Error(`Invalid ${kind} source metadata`);
  const expectedAxes = [...Object.keys(definition.filters), "geo", "time"].sort();
  if (JSON.stringify([...(data.id || [])].sort()) !== JSON.stringify(expectedAxes)) throw new Error(`Invalid ${kind} dimensions`);
  const series = {};
  for (const { dimensions, value, status } of decodeJsonStat(data)) {
    for (const [filter, expected] of Object.entries(definition.filters)) {
      if (dimensions[filter] !== expected) throw new Error(`Incorrect ${kind} ${filter}`);
    }
    if (!/^\d{4}$/.test(dimensions.time)) throw new Error(`Invalid ${kind} annual period`);
    const year = dimensions.time;
    const code = dimensions.geo === "EL" ? "GR" : dimensions.geo;
    if (!EU27.includes(code)) throw new Error(`Unexpected geography: ${code}`);
    // January population can refer to the current year; debt must be a finished calendar year.
    const maxYear = new Date(fetchedAt).getUTCFullYear() - (kind === "population" ? 0 : 1);
    if (Number(year) > maxYear) continue;
    series[year] ||= {};
    if (series[year][code]) throw new Error(`Duplicate ${kind} observation`);
    series[year][code] = { value: /f/i.test(status) ? null : value, status };
  }
  return { series, updated: data.updated };
}

function buildSnapshot(responses, fetchedAt = new Date().toISOString()) {
  const parsed = Object.fromEntries(KINDS.map((kind) => [kind, parseSource(responses[kind], kind, fetchedAt)]));
  const debtYear = Object.keys(parsed.debt.series).sort().at(-1);
  if (!debtYear) throw new Error("No completed debt year");
  const populationYear = String(Number(debtYear) + 1);
  if (parsed.debt.updated !== parsed.ratio.updated || Object.keys(parsed.ratio.series).sort().at(-1) !== debtYear) throw new Error("Debt amounts and ratios must share a vintage and reporting year");
  const snapshot = {
    schemaVersion: 1, fetchedAt, debtYear, populationYear,
    debtDate: `${debtYear}-12-31`, populationDate: `${populationYear}-01-01`,
    sources: Object.fromEntries(KINDS.map((kind) => [kind, { ...PER_CAPITA[kind], updated: parsed[kind].updated, url: requestUrl(kind) }])),
    countries: Object.fromEntries(EU27.map((code) => [code, {
      debtMioEur: parsed.debt.series[debtYear]?.[code]?.value ?? null,
      debtRatio: parsed.ratio.series[debtYear]?.[code]?.value ?? null,
      population: parsed.population.series[populationYear]?.[code]?.value ?? null,
      debtStatus: parsed.debt.series[debtYear]?.[code]?.status || "",
      ratioStatus: parsed.ratio.series[debtYear]?.[code]?.status || "",
      populationStatus: parsed.population.series[populationYear]?.[code]?.status || "",
    }])),
  };
  validateSnapshot(snapshot);
  return snapshot;
}

function validateSnapshot(snapshot, previous = null) {
  const fail = (message) => { throw new Error(`Per-capita snapshot: ${message}`); };
  if (snapshot?.schemaVersion !== 1 || !Number.isFinite(Date.parse(snapshot.fetchedAt))) fail("invalid schema/date");
  if (!/^\d{4}$/.test(snapshot.debtYear) || snapshot.populationYear !== String(Number(snapshot.debtYear) + 1) ||
      snapshot.debtDate !== `${snapshot.debtYear}-12-31` || snapshot.populationDate !== `${snapshot.populationYear}-01-01` ||
      Number(snapshot.populationYear) > new Date(snapshot.fetchedAt).getUTCFullYear()) fail("incompatible stock dates");
  if (previous && (snapshot.debtYear < previous.debtYear || Date.parse(snapshot.fetchedAt) < Date.parse(previous.fetchedAt))) fail("period/access regression");
  for (const kind of KINDS) {
    const source = snapshot.sources?.[kind];
    if (source?.dataset !== PER_CAPITA[kind].dataset || JSON.stringify(source.filters) !== JSON.stringify(PER_CAPITA[kind].filters) || source.url !== requestUrl(kind)) fail(`incorrect ${kind} definition`);
    if (!Number.isFinite(Date.parse(source.updated)) || Date.parse(source.updated) > Date.parse(snapshot.fetchedAt)) fail(`invalid ${kind} update date`);
    if (previous && Date.parse(source.updated) < Date.parse(previous.sources[kind].updated)) fail(`${kind} source regression`);
  }
  if (snapshot.sources.debt.updated !== snapshot.sources.ratio.updated) fail("debt vintage mismatch");
  if (Object.keys(snapshot.countries || {}).sort().join() !== [...EU27].sort().join()) fail("EU27 coverage required");
  for (const code of EU27) {
    const row = snapshot.countries[code];
    for (const [key, flag, min, max] of [["debtMioEur", "debtStatus", 0, 100000000], ["debtRatio", "ratioStatus", 0, 500], ["population", "populationStatus", 1, 200000000]]) {
      if (!Number.isFinite(row?.[key]) || row[key] < min || row[key] > max || typeof row[flag] !== "string" || /f/i.test(row[flag])) fail(`incomplete/invalid ${key}: ${code}`);
    }
    if (!Number.isSafeInteger(row.population)) fail(`population is not a count of persons: ${code}`);
  }
  return snapshot;
}
module.exports = { requestUrl, parseSource, buildSnapshot, validateSnapshot };
