const { EU27 } = require("../lib/fiscal/indicators");
const { decodeJsonStat } = require("./eurostat-jsonstat");

// Shared adapter for explicitly defined annual fiscal sources and their denominators.
function annualRequestUrl(definition, points, geographies = EU27) {
  const url = new URL(`https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/${definition.dataset}`);
  for (const [key, value] of Object.entries({ lang: "EN", ...definition.filters, lastTimePeriod: String(points) })) url.searchParams.set(key, value);
  for (const code of geographies) url.searchParams.append("geo", code === "GR" ? "EL" : code);
  return url.href;
}

function parseAnnualSource(data, definition, fetchedAt, geographies = EU27) {
  if (!Number.isFinite(Date.parse(fetchedAt)) || data?.source !== "ESTAT" || data?.extension?.id?.toLowerCase() !== definition.dataset ||
      !Number.isFinite(Date.parse(data.updated)) || Date.parse(data.updated) > Date.parse(fetchedAt)) throw new Error("Invalid annual source metadata");
  const axes = [...Object.keys(definition.filters), "geo", "time"].sort();
  if (JSON.stringify([...(data.id || [])].sort()) !== JSON.stringify(axes)) throw new Error("Invalid annual dimensions");
  const series = {};
  for (const { dimensions, value, status } of decodeJsonStat(data)) {
    for (const [key, expected] of Object.entries(definition.filters)) if (dimensions[key] !== expected) throw new Error(`Invalid annual filter: ${key}`);
    const year = dimensions.time, code = dimensions.geo === "EL" ? "GR" : dimensions.geo;
    if (!/^\d{4}$/.test(year)) throw new Error("Invalid annual reporting period");
    if (!geographies.includes(code)) throw new Error("Unexpected annual geography");
    // All sources here describe completed annual flows or annual-average population.
    if (Number(year) >= new Date(fetchedAt).getUTCFullYear()) continue;
    series[year] ||= {};
    if (series[year][code]) throw new Error("Duplicate annual observation");
    series[year][code] = { value: /f/i.test(status) ? null : value, status };
  }
  return { series, updated: data.updated };
}
module.exports = { annualRequestUrl, parseAnnualSource };
