import { EUROSTAT_UPDATED_AT, EUROSTAT_SERIES } from "@/lib/eurostat.gen";
import { countries } from "@/lib/data";

function fmt(v) {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(Math.round(v));
}

export default function DebugEurostat() {
  const merged = countries.map((c) => {
    const es = EUROSTAT_SERIES?.[c.code];
    const usedEurostat = !!es;
    return {
      code: c.code,
      name: c.name,
      usedEurostat,
      latestTime: es?.latestTime ?? "—",
      previousTime: es?.previousTime ?? "—",
      startValue: es?.startValue ?? c.prev_value_eur,
      endValue: es?.endValue ?? c.last_value_eur,
      trend: es?.trend ?? (c.last_value_eur > c.prev_value_eur ? "rising" : (c.last_value_eur < c.prev_value_eur ? "falling" : "flat")),
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
              <th style={{textAlign:"left",borderBottom:"1px solid #2b3444"}}>Prev (q)</th>
              <th style={{textAlign:"left",borderBottom:"1px solid #2b3444"}}>Last (q)</th>
              <th style={{textAlign:"left",borderBottom:"1px solid #2b3444"}}>Start €</th>
              <th style={{textAlign:"left",borderBottom:"1px solid #2b3444"}}>End €</th>
              <th style={{textAlign:"left",borderBottom:"1px solid #2b3444"}}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {merged.map((row) => (
              <tr key={row.code}>
                <td className="mono">{row.code}</td>
                <td>{row.name}</td>
                <td className="tag">{row.usedEurostat ? "Eurostat ✅" : "Baseline"}</td>
                <td className="mono">{row.previousTime}</td>
                <td className="mono">{row.latestTime}</td>
                <td className="mono">€{fmt(row.startValue)}</td>
                <td className="mono">€{fmt(row.endValue)}</td>
                <td style={{color: row.trend === "rising" ? "var(--bad)" : row.trend === "falling" ? "var(--ok)" : "#9ca3af"}}>
                  {row.trend}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="tag" style={{marginTop:12}}>
        Tip: Als “Source” = Eurostat ✅ voor de meeste landen, dan draait je integratie goed. Je kunt deze pagina later gewoon verwijderen.
      </p>
    </main>
  );
}
