const { EU27 } = require("../fiscal/indicators");
const { euroMembers } = require("./indicators");

function readSelection(search, snapshot, lang = "en") {
  const params = new URLSearchParams(search);
  const month = snapshot.periods.includes(params.get("month")) ? params.get("month") : snapshot.latestMonth;
  const requested = (params.get("country") || "").toUpperCase();
  let country = EU27.includes(requested) ? requested : ({ de: "DE", fr: "FR" }[lang] || "NL");
  const members = euroMembers(month);
  const area = params.get("area") === "EA" ? "EA" : "EU27_2020";
  if (area === "EA" && !members.includes(country)) country = "NL";
  return { month, country, area,
    years: [1, 5, 10].includes(Number(params.get("years"))) ? Number(params.get("years")) : 5,
    sort: ["ascending", "descending", "alphabetical"].includes(params.get("sort")) ? params.get("sort") : "descending" };
}
function selectionSearch(selection) {
  return new URLSearchParams({ country: selection.country.toLowerCase(), month: selection.month,
    area: selection.area, years: String(selection.years), sort: selection.sort }).toString();
}
function monthInYear(month, year, periods) {
  const available = periods.filter(period => period.startsWith(`${year}-`));
  if (!available.length) return month;
  const desired = `${year}-${month.slice(5)}`;
  return available.includes(desired) ? desired : desired < available[0] ? available[0] : available.at(-1);
}
function inflationCountryPath(code, lang = "en") {
  const prefix = ["nl", "de", "fr"].includes(lang) ? `/${lang}` : "";
  if (!EU27.includes(code.toUpperCase())) throw new Error("Unknown inflation country");
  return `${prefix}/inflation?country=${code.toLowerCase()}#inflation-explorer`;
}
module.exports = { readSelection, selectionSearch, monthInYear, inflationCountryPath };
