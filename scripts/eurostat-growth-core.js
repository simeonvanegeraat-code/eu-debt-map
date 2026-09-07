const { EU27 } = require("../lib/fiscal/indicators");
const { GROWTH, quarterIndex, shiftQuarter, quarterEnd, fiveYearOverview } = require("../lib/fiscal/growth");
const { decodeJsonStat } = require("./eurostat-jsonstat");
function requestUrl(kind) {
  if (!Object.hasOwn(GROWTH.units, kind)) throw new Error("Unknown growth source");
  const url = new URL(`https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/${GROWTH.dataset}`);
  for (const [key, value] of Object.entries({ lang: "EN", ...GROWTH.filters, unit: GROWTH.units[kind], lastTimePeriod: String(GROWTH.points) })) url.searchParams.set(key, value);
  for (const code of EU27) url.searchParams.append("geo", code === "GR" ? "EL" : code);
  return url.href;
}
function parseSource(data, kind, fetchedAt) {
  if (data?.source !== "ESTAT" || data?.extension?.id?.toLowerCase() !== GROWTH.dataset ||
      !Number.isFinite(Date.parse(data.updated)) || Date.parse(data.updated) > Date.parse(fetchedAt)) throw new Error("Invalid growth source metadata");
  if (JSON.stringify([...(data.id || [])].sort()) !== JSON.stringify(["freq", "geo", "na_item", "sector", "time", "unit"])) throw new Error("Invalid growth dimensions");
  const series = {};
  for (const { dimensions, value, status } of decodeJsonStat(data)) {
    for (const [key, expected] of Object.entries({ ...GROWTH.filters, unit: GROWTH.units[kind] })) if (dimensions[key] !== expected) throw new Error(`Invalid growth filter: ${key}`);
    const quarter = dimensions.time;
    if (quarterIndex(quarter) === null) throw new Error("Invalid growth quarter");
    const code = dimensions.geo === "EL" ? "GR" : dimensions.geo;
    if (!EU27.includes(code)) throw new Error("Unexpected growth geography");
    if (quarterEnd(quarter) >= fetchedAt.slice(0, 10)) continue;
    series[quarter] ||= {};
    if (series[quarter][code]) throw new Error("Duplicate growth observation");
    series[quarter][code] = { value: /f/i.test(status) ? null : value, status };
  }
  return { series, updated: data.updated };
}
function buildSnapshot(responses, fetchedAt = new Date().toISOString()) {
  const parsed = Object.fromEntries(["debt", "ratio"].map(kind => [kind, parseSource(responses[kind], kind, fetchedAt)]));
  const latestQuarter = Object.keys(parsed.debt.series).sort().at(-1);
  if (!latestQuarter || latestQuarter !== Object.keys(parsed.ratio.series).sort().at(-1) || parsed.debt.updated !== parsed.ratio.updated) throw new Error("Growth sources must share period and vintage");
  const periods = Array.from({ length: GROWTH.points }, (_, i) => shiftQuarter(latestQuarter, i - GROWTH.points + 1));
  const snapshot = { schemaVersion: 1, fetchedAt, latestQuarter, periods,
    sources: Object.fromEntries(["debt", "ratio"].map(kind => [kind, { dataset: GROWTH.dataset, filters: { ...GROWTH.filters, unit: GROWTH.units[kind] }, updated: parsed[kind].updated, url: requestUrl(kind) }])),
    countries: Object.fromEntries(EU27.map(code => [code, Object.fromEntries(["debt", "ratio"].flatMap(kind => [
      [kind, periods.map(q => parsed[kind].series[q]?.[code]?.value ?? null)],
      [`${kind}Status`, periods.map(q => parsed[kind].series[q]?.[code]?.status || "")],
    ]))])),
  };
  return validateSnapshot(snapshot);
}
function validateSnapshot(snapshot, previous = null) {
  const fail = message => { throw new Error(`Growth snapshot: ${message}`); };
  if (snapshot?.schemaVersion !== 1 || !Number.isFinite(Date.parse(snapshot.fetchedAt)) || quarterIndex(snapshot.latestQuarter) === null || quarterEnd(snapshot.latestQuarter) >= snapshot.fetchedAt.slice(0, 10)) fail("invalid schema or dates");
  const expected = Array.from({ length: GROWTH.points }, (_, i) => shiftQuarter(snapshot.latestQuarter, i - GROWTH.points + 1));
  if (JSON.stringify(snapshot.periods) !== JSON.stringify(expected)) fail("41 consecutive quarter keys required");
  if (previous && (snapshot.latestQuarter < previous.latestQuarter || Date.parse(snapshot.fetchedAt) < Date.parse(previous.fetchedAt))) fail("period/access regression");
  for (const kind of ["debt", "ratio"]) {
    const source = snapshot.sources?.[kind];
    if (source?.dataset !== GROWTH.dataset || source.url !== requestUrl(kind) || JSON.stringify(source.filters) !== JSON.stringify({ ...GROWTH.filters, unit: GROWTH.units[kind] })) fail(`invalid ${kind} definition`);
    if (!Number.isFinite(Date.parse(source.updated)) || Date.parse(source.updated) > Date.parse(snapshot.fetchedAt) || (previous && Date.parse(source.updated) < Date.parse(previous.sources[kind].updated))) fail("source date regression/invalid date");
  }
  if (snapshot.sources.debt.updated !== snapshot.sources.ratio.updated) fail("source vintage mismatch");
  if (Object.keys(snapshot.countries || {}).sort().join() !== [...EU27].sort().join()) fail("EU27 coverage required");
  for (const code of EU27) for (const kind of ["debt", "ratio"]) {
    const values = snapshot.countries[code]?.[kind];
    const flags = snapshot.countries[code]?.[`${kind}Status`];
    if (!Array.isArray(values) || !Array.isArray(flags) || values.length !== GROWTH.points || flags.length !== GROWTH.points) fail(`invalid history: ${code}`);
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      if (typeof flags[i] !== "string" || (value !== null && (!Number.isFinite(value) || value < 0 || value > (kind === "debt" ? 1e8 : 500) || /f/i.test(flags[i])))) fail(`invalid ${kind} observation: ${code}`);
    }
    if (!Number.isFinite(values.at(-1))) fail(`incomplete latest ${kind}: ${code}`);
    if (previous) snapshot.periods.forEach((q, i) => {
      const old = previous.periods.indexOf(q);
      if (old >= 0 && Number.isFinite(previous.countries[code][kind][old]) && values[i] === null) fail(`lost existing observation: ${code} ${q}`);
    });
  }
  fiveYearOverview(snapshot);
  return snapshot;
}
module.exports = { requestUrl, parseSource, buildSnapshot, validateSnapshot };
