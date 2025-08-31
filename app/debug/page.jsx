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
              <th style={{textAlign:"left",borderBottom:"1px solid #2b3444"}}>Code</th>
              <th style={{textAlign:"left",borderBottom:"1px solid #2b3444"}}>Name</th>
              <th style={{textAlign:"left",borderBottom:"1px solid #2b3444"}}>Source</th>
              <th style={{textAlign:"left",borderBottom:"1px solid #2b3444"}}>PrevQ</th>
              <th style={{textAlign:"left",borderBottom:"1px solid #2b3444"}}>LastQ</th>
              <th style={{textAlign:"left",borderBottom:"1px solid #2b3444"}}>Start €</th>
              <th style={{textAlign:"left",borderBottom:"1px solid #2b3444"}}>End €</th>
              <th style={{textAlign:"left",borderBottom:"1px solid #2b3444"}}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.code}>
                <td className="mono">{r.code}</td>
                <td>{r.name}</td>
                <td className="tag">{r.source}</td>
                <td className="mono">{r.prevQ}</td>
                <td className="mono">{r.lastQ}</td>
                <td className="mono">€{fmt(r.start)}</td>
                <td className="mono">€{fmt(r.end)}</td>
                <td className="mono" style={{color: r.trend>0 ? "var(--bad)" : r.trend<0 ? "var(--ok)" : "#9ca3af"}}>
                  {r.trend>0 ? "↑ rising" : r.trend<0 ? "↓ falling" : "→ flat"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
