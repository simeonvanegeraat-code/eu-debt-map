import { EUROSTAT_UPDATED_AT, EUROSTAT_SERIES } from "@/lib/eurostat.gen";
import { countries } from "@/lib/data";

function fmt(v) {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(Math.round(v));
}

export default function DebugEurostat() {
  const rows = countries.map((c) => {
    const es = EUROSTAT_SERIES?.[c.code];
    return {
      code: c.code,
      name: c.name,
      source: es ? "Eurostat ✅" : "Baseline",
      prevQ: es?.previousTime ?? "—",
      lastQ: es?.latestTime ?? "—",
      start: es?.startValue ?? c.prev_value_eur,
      end: es?.endValue ?? c.last_value_eur,
      trend: (es?.endValue ?? c.last_value_eur) - (es?.startValue ?? c.prev_value_eur),
    };
  });

  return (
    <main className="container card">
      <h2>Eurostat Debug</h2>
      <p className="tag">
        Updated at: {EUROSTAT_UPDATED_AT ? new Date(EUROSTAT_UPDATED_AT).toLocaleString("en-GB") : "no data"}
      </p>
      <div style={{overflowX:"auto"}}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr>
              <th>Code</th><th>Name</th><th>Source</th><th>PrevQ</th><th>LastQ</th><th>Start €</th><th>End €</th><th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.code}>
                <td>{r.code}</td>
                <td>{r.name}</td>
                <td>{r.source}</td>
                <td>{r.prevQ}</td>
                <td>{r.lastQ}</td>
                <td>€{fmt(r.start)}</td>
                <td>€{fmt(r.end)}</td>
                <td>{r.trend>0 ? "↑ rising" : r.trend<0 ? "↓ falling" : "→ flat"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
