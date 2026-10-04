const { decodeJsonStat } = require("./eurostat-jsonstat");
const { INFLATION, GEOGRAPHIES, monthIndex, shiftMonth } = require("../lib/inflation/indicators");

function requestUrl() {
  const url = new URL(`https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/${INFLATION.dataset}`);
  for (const [key, value] of Object.entries({ lang: "EN", ...INFLATION.filters, sinceTimePeriod: INFLATION.firstMonth })) url.searchParams.set(key, value);
  for (const unit of Object.values(INFLATION.units)) url.searchParams.append("unit", unit);
  for (const code of GEOGRAPHIES) url.searchParams.append("geo", code === "GR" ? "EL" : code);
  return url.href;
}
function buildSnapshot(data, fetchedAt = new Date().toISOString()) {
  if (data?.source !== "ESTAT" || data.extension?.id?.toLowerCase() !== INFLATION.dataset ||
      !Number.isFinite(Date.parse(fetchedAt)) || !Number.isFinite(Date.parse(data.updated)) ||
      Date.parse(data.updated) > Date.parse(fetchedAt)) throw new Error("Invalid inflation source metadata");
  if ([...(data.id || [])].sort().join() !== ["coicop18", "freq", "geo", "time", "unit"].join()) throw new Error("Invalid inflation dimensions");
  const observations = {};
  for (const { dimensions: d, value, status } of decodeJsonStat(data)) {
    if (Object.entries(INFLATION.filters).some(([key, expected]) => d[key] !== expected)) throw new Error("Invalid inflation filters");
    const metric = Object.keys(INFLATION.units).find(key => INFLATION.units[key] === d.unit);
    const code = d.geo === "EL" ? "GR" : d.geo;
    if (!metric || !GEOGRAPHIES.includes(code) || monthIndex(d.time) === null || d.time < INFLATION.firstMonth) throw new Error("Invalid inflation coordinates");
    if (d.time >= fetchedAt.slice(0, 7)) continue;
    observations[d.time] ||= {};
    observations[d.time][code] ||= {};
    if (observations[d.time][code][metric]) throw new Error("Duplicate inflation observation");
    observations[d.time][code][metric] = { value: /f/i.test(status) ? null : value, status };
  }
  // One common month for both indicators and all 29 geographies. Exclude
  // estimates/provisional/forecast observations from the headline release.
  const completeMonths = Object.keys(observations).sort().filter(month => GEOGRAPHIES.every(code =>
    Object.keys(INFLATION.units).every(metric => {
      const point = observations[month][code]?.[metric];
      return Number.isFinite(point?.value) && !/[epf]/i.test(point.status);
    })));
  const latestMonth = completeMonths.at(-1);
  if (!latestMonth) throw new Error("No complete inflation release without estimates/provisional data");
  const periods = Array.from({ length: monthIndex(latestMonth) - monthIndex(INFLATION.firstMonth) + 1 }, (_, i) => shiftMonth(INFLATION.firstMonth, i));
  const snapshot = {
    schemaVersion: 1, fetchedAt, latestMonth, periods,
    source: { dataset: INFLATION.dataset, filters: { ...INFLATION.filters, unit: Object.values(INFLATION.units) },
      updated: data.updated, url: requestUrl() },
    statusLabels: data.extension.status?.label || {},
    series: Object.fromEntries(GEOGRAPHIES.map(code => [code, Object.fromEntries(Object.keys(INFLATION.units).flatMap(metric => [
      [metric, periods.map(month => observations[month]?.[code]?.[metric]?.value ?? null)],
      [`${metric}Status`, periods.map(month => observations[month]?.[code]?.[metric]?.status || "")],
    ]))])),
  };
  return validateSnapshot(snapshot);
}
function validateSnapshot(snapshot, previous = null) {
  const fail = message => { throw new Error(`Inflation snapshot: ${message}`); };
  if (snapshot?.schemaVersion !== 1 || !Number.isFinite(Date.parse(snapshot.fetchedAt)) || monthIndex(snapshot.latestMonth) === null ||
      snapshot.latestMonth < INFLATION.firstMonth || snapshot.latestMonth >= snapshot.fetchedAt.slice(0, 7)) fail("invalid schema or dates");
  const expected = Array.from({ length: monthIndex(snapshot.latestMonth) - monthIndex(INFLATION.firstMonth) + 1 }, (_, i) => shiftMonth(INFLATION.firstMonth, i));
  if (JSON.stringify(snapshot.periods) !== JSON.stringify(expected)) fail("non-consecutive months");
  const source = snapshot.source;
  if (source?.dataset !== INFLATION.dataset || source.url !== requestUrl() ||
      JSON.stringify(source.filters) !== JSON.stringify({ ...INFLATION.filters, unit: Object.values(INFLATION.units) })) fail("invalid source definition");
  if (!Number.isFinite(Date.parse(source.updated)) || Date.parse(source.updated) > Date.parse(snapshot.fetchedAt)) fail("invalid source date");
  if (previous && (snapshot.latestMonth < previous.latestMonth || Date.parse(snapshot.fetchedAt) < Date.parse(previous.fetchedAt) ||
      Date.parse(source.updated) < Date.parse(previous.source.updated))) fail("period/source/access regression");
  if (Object.keys(snapshot.series || {}).sort().join() !== [...GEOGRAPHIES].sort().join()) fail("EU27 and official aggregates required");
  if (!snapshot.statusLabels || typeof snapshot.statusLabels !== "object" || Array.isArray(snapshot.statusLabels)) fail("invalid status labels");
  for (const code of GEOGRAPHIES) for (const metric of Object.keys(INFLATION.units)) {
    const values = snapshot.series[code]?.[metric], flags = snapshot.series[code]?.[`${metric}Status`];
    if (!Array.isArray(values) || !Array.isArray(flags) || values.length !== expected.length || flags.length !== expected.length) fail(`invalid history: ${code}`);
    values.forEach((value, i) => {
      const flag = flags[i];
      if (typeof flag !== "string" || !/^[a-z ]*$/i.test(flag)) fail(`invalid status: ${code}`);
      if ([...flag.replace(/ /g, "")].some(key => typeof snapshot.statusLabels[key] !== "string")) fail(`unknown status: ${flag}`);
      if (value !== null && (!Number.isFinite(value) || value <= -100 || value > 1000 || /f/i.test(flag))) fail(`invalid ${metric} observation: ${code}`);
      if (previous && Number.isFinite(previous.series[code]?.[metric]?.[i]) && value === null) fail(`lost observation: ${code} ${expected[i]}`);
    });
    if (!Number.isFinite(values.at(-1)) || /[epf]/i.test(flags.at(-1))) fail(`incomplete latest release: ${code}`);
  }
  return snapshot;
}
module.exports = { requestUrl, buildSnapshot, validateSnapshot };
