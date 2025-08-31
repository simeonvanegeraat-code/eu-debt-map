// scripts/fetch-eurostat.js
const fs = require("node:fs");
const path = require("node:path");

const OUT_FILE = path.join(process.cwd(), "lib", "eurostat.gen.js");

const EU27 = [
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT",
  "LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"
];

const geoForEurostat = (code) => (code === "GR" ? "EL" : code);

const qEndDate = (timeStr) => {
  const m = /^(\d{4})Q([1-4])$/.exec(timeStr || "");
  if (!m) return new Date();
  const year = Number(m[1]);
  const q = Number(m[2]);
  const monthEnds = {1:[2,31],2:[5,30],3:[8,30],4:[11,31]};
  const [monthIdx, day] = monthEnds[q];
  return new Date(Date.UTC(year, monthIdx, day, 23, 59, 59));
};

const orderFromIndex = (indexMap) =>
  Object.entries(indexMap).sort((a,b)=>a[1]-b[1]).map(([k])=>k);

const buildUrl = () => {
  const base = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt";
  const fixed = "lang=EN&format=JSON&freq=Q&sector=S13&na_item=GD&unit=MIO_EUR&lastTimePeriod=2";
  const geos = EU27.map(c => "geo=" + geoForEurostat(c)).join("&");
  return `${base}?${fixed}&${geos}`;
};

async function main() {
  const url = buildUrl();
  console.log("[fetch-eurostat] GET", url);
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`Eurostat fetch failed: ${res.status} ${res.statusText}`);
  const data = await res.json();

  const ids = data.id || data.dataset?.id;
  const size = data.size || data.dataset?.size;
  const dim = data.dimension || data.dataset?.dimension;
  if (!ids || !size || !dim) throw new Error("Unexpected JSON-stat format");

  const idxGeo = ids.indexOf("geo");
  const idxTime = ids.indexOf("time");
  if (idxGeo === -1 || idxTime === -1) throw new Error("geo/time dimension missing");

  const geoKeys = orderFromIndex(dim.geo.category.index);
  const timeKeys = orderFromIndex(dim.time.category.index);

  const strides = [];
  let acc = 1;
  for (let i = ids.length - 1; i >= 0; i--) {
    strides[i] = acc;
    acc *= size[i];
  }
  const at = (coords) => {
    let flat = 0;
    for (let i = 0; i < coords.length; i++) flat += coords[i] * strides[i];
    return data.value[flat] ?? null;
  };

  const out = {};
  for (let g = 0; g < geoKeys.length; g++) {
    const euroGeo = geoKeys[g];
    const appGeo = euroGeo === "EL" ? "GR" : euroGeo;
    if (!EU27.includes(appGeo)) continue;
    const coords = new Array(ids.length).fill(0);
    coords[idxGeo] = g;
    if (timeKeys.length < 1) continue;
    const lastIndex = timeKeys.length - 1;
    const prevIndex = timeKeys.length - 2;
    coords[idxTime] = lastIndex;
    const vCurrMio = at(coords);
    let vPrevMio = null;
    let prevKey = null;
    if (prevIndex >= 0) {
      coords[idxTime] = prevIndex;
      vPrevMio = at(coords);
      prevKey = timeKeys[prevIndex];
    }
    const currKey = timeKeys[lastIndex];
    if (vCurrMio == null) continue;
    const currEUR = vCurrMio * 1_000_000;
    const prevEUR = vPrevMio != null ? vPrevMio * 1_000_000 : currEUR;
    const currDate = qEndDate(currKey);
    const prevDate = qEndDate(prevKey ?? currKey);
    const seconds = Math.max(1, Math.floor((currDate - prevDate) / 1000));
    const delta = currEUR - prevEUR;
    const perSecond = delta / seconds;
    const trend = Math.abs(delta) < 1 ? "flat" : (delta > 0 ? "rising" : "falling");
    out[appGeo] = {
      latestTime: currKey,
      previousTime: prevKey ?? currKey,
      startValue: prevEUR,
      endValue: currEUR,
      startDateISO: prevDate.toISOString(),
      endDateISO: currDate.toISOString(),
      perSecond,
      trend
    };
  }

  const fileContent =
`// Auto-generated
export const EUROSTAT_UPDATED_AT = ${JSON.stringify(new Date().toISOString())};
export const EUROSTAT_SERIES = ${JSON.stringify(out, null, 2)};
`;

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, fileContent, "utf8");
  console.log("[fetch-eurostat] wrote", OUT_FILE);
}

main().catch(err => {
  console.error("ERROR", err);
  const fallback =
`export const EUROSTAT_UPDATED_AT = null;
export const EUROSTAT_SERIES = {};
`;
  fs.mkdirSync(path.join(process.cwd(),"lib"), { recursive: true });
  fs.writeFileSync(OUT_FILE, fallback, "utf8");
  process.exit(0);
});
