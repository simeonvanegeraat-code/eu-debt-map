const { EU27 } = require("../fiscal/indicators");

const INFLATION = Object.freeze({
  dataset: "prc_hicp_minr",
  filters: { freq: "M", coicop18: "TOTAL" },
  units: { annual: "RCH_A", monthly: "RCH_M" },
  firstMonth: "2015-01",
  reviewedAt: "2026-10-04T00:00:00Z",
  datasetUrl: "https://ec.europa.eu/eurostat/databrowser/view/prc_hicp_minr/default/table?lang=en",
  metadataUrl: "https://ec.europa.eu/eurostat/cache/metadata/en/prc_hicp_esms.htm",
  informationUrl: "https://ec.europa.eu/eurostat/web/hicp/information-data",
  membershipUrl: "https://www.ecb.europa.eu/euro/intro/html/index.en.html",
});
const GEOGRAPHIES = Object.freeze([...EU27, "EA", "EU27_2020"]);

// Euro adoption dates; the filter follows membership in the displayed month.
// Source: INFLATION.membershipUrl, reviewed 2026-10-04.
const EURO_ADOPTION = Object.freeze({
  AT: "1999-01", BE: "1999-01", DE: "1999-01", ES: "1999-01", FI: "1999-01",
  FR: "1999-01", IE: "1999-01", IT: "1999-01", LU: "1999-01", NL: "1999-01",
  PT: "1999-01", GR: "2001-01", SI: "2007-01", CY: "2008-01", MT: "2008-01",
  SK: "2009-01", EE: "2011-01", LV: "2014-01", LT: "2015-01", HR: "2023-01", BG: "2026-01",
});

function monthIndex(month) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month || "")) return null;
  return Number(month.slice(0, 4)) * 12 + Number(month.slice(5)) - 1;
}
function shiftMonth(month, offset) {
  const index = monthIndex(month);
  if (index === null || !Number.isInteger(offset)) throw new Error("Invalid month or offset");
  const next = index + offset;
  return `${Math.floor(next / 12)}-${String(next % 12 + 1).padStart(2, "0")}`;
}
function euroMembers(month) {
  return EU27.filter(code => EURO_ADOPTION[code] && EURO_ADOPTION[code] <= month);
}
function observation(snapshot, code, month, metric = "annual") {
  const index = snapshot.periods.indexOf(month);
  const series = snapshot.series[code];
  return { value: index < 0 ? null : series?.[metric]?.[index] ?? null,
    status: index < 0 ? "" : series?.[`${metric}Status`]?.[index] || "" };
}
function inflationRows(snapshot, month, area = "EA", metric = "annual") {
  return (area === "EA" ? euroMembers(month) : EU27).map(code => ({ code,
    ...observation(snapshot, code, month, metric),
  })).sort((a, b) => {
    if (a.value === null) return b.value === null ? a.code.localeCompare(b.code) : 1;
    if (b.value === null) return -1;
    return b.value - a.value || a.code.localeCompare(b.code);
  });
}
function trendSegments(points, key) {
  const segments = [];
  let current = [];
  points.forEach((point, index) => {
    const value = point[key], flag = point[`${key}Status`] || "";
    if (!Number.isFinite(value) || /[bf]/i.test(flag)) {
      if (current.length) segments.push(current);
      current = [];
    }
    if (Number.isFinite(value) && !/f/i.test(flag)) current.push({ index, value });
  });
  if (current.length) segments.push(current);
  return segments;
}
const COLOR_BANDS = Object.freeze([
  { max: 0, color: "#2b7180" }, { max: 2, color: "#9bc8c5" },
  { max: 4, color: "#efd69f" }, { max: 6, color: "#de985e" },
  { max: Infinity, color: "#a6473c" },
]);
function inflationColor(value) {
  return Number.isFinite(value) ? COLOR_BANDS.find(band => value < band.max).color : "#d7dee6";
}

module.exports = { INFLATION, GEOGRAPHIES, EURO_ADOPTION, monthIndex, shiftMonth, euroMembers,
  observation, inflationRows, trendSegments, COLOR_BANDS, inflationColor };
