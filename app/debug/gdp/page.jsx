// app/debug/gdp/page.jsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function loadEurostatModule() {
  try {
    return await import("@/lib/eurostat.gen.js");
  } catch {}
  try {
    return await import("@/lib/eurostat.gen");
  } catch {}
  throw new Error("Cannot import '@/lib/eurostat.gen(.js)'");
}

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
  let first = { valueEUR: null, period: null };
  try {
    const mod = await loadEurostatModule();
    const getLatest =
      mod.getLatestGDPForGeoEUR ||
      (mod.default && mod.default.getLatestGDPForGeoEUR);
    if (typeof getLatest === "function") {
      first = await getLatest("NL");
    }
  } catch {}

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
    </main>
  );
}
