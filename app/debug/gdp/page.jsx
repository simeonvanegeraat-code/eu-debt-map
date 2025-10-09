// app/debug/gdp/page.jsx
import * as Eurostat from "@/lib/eurostat.gen";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EU27 = [
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR",
  "DE","GR","HU","IE","IT","LV","LT","LU","MT","NL",
  "PL","PT","RO","SK","SI","ES","SE"
];

function fmtEUR(n){
  if (!Number.isFinite(n)) return "—";
  return "€ " + new Intl.NumberFormat("en-GB").format(Math.round(n));
}

export default async function DebugGDPPage() {
  const getLatest =
    Eurostat.getLatestGDPForGeoEUR ||
    (Eurostat.default && Eurostat.default.getLatestGDPForGeoEUR);

  const initialGeo = "NL";
  let first = { valueEUR: null, period: null, cached: false };
  if (typeof getLatest === "function") {
    first = await getLatest(initialGeo);
  }

  return (
    <main className="container card">
      <h1 style={{marginTop:0}}>Eurostat GDP Debug</h1>
      <p className="tag">Test live GDP via Eurostat (nama_10_gdp, B1GQ, CP_MEUR)</p>

      <div style={{margin:"12px 0"}}>
        <strong>Server check (NL):</strong>{" "}
        <span>{fmtEUR(first?.valueEUR)} — period: {first?.period || "?"}</span>
      </div>

      <form
        action="/api/gdp"
        method="get"
        style={{display:"flex", gap:8, alignItems:"center", flexWrap:"wrap"}}
        target="_blank"
      >
        <label htmlFor="geo">Open API for: </label>
        <select id="geo" name="geo" defaultValue="NL" className="btn" style={{padding:"8px 10px"}}>
          {EU27.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <button className="btn" type="submit">Open /api/gdp</button>
      </form>

      <p className="tag" style={{marginTop:12}}>
        Als de API een geldige <code>gdp_eur</code> teruggeeft maar de landpagina niets toont,
        zit het probleem in props-doorvoer/render. Als de API <em>geen</em> waarde geeft,
        is er een fetch/parsing/runtime-issue.
      </p>
    </main>
  );
}
