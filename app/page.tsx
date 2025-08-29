"use client";
import EuropeMap from "@/components/EuropeMap";
import CookieConsent from "@/components/CookieConsent";
import AdSlot from "@/components/AdSlot";
import { countries } from "@/lib/data";
import Link from "next/link";
import { useState } from "react";

export default function HomePage(){
  const [consent,setConsent] = useState<"accepted"|"rejected"|null>(null);
  const client="ca-pub-9252617114074571";

  const rows = Object.values(countries).map(c=>{
    const delta = c.last_value_eur - c.prev_value_eur;
    const dir = delta>=0 ? "↑" : "↓";
    return { code2:c.code2, name:c.name, last:c.last_value_eur, delta, dir };
  }).sort((a,b)=> a.name.localeCompare(b.name));

  return (
    <main className="container">
      <CookieConsent onChange={setConsent} />

      <section className="ad-card card">
        <AdSlot client={client} format="auto" fullWidthResponsive show={consent!=="rejected"} />
      </section>

      <div className="grid">
        <section>
          <h1>EU Debt Map</h1>
          <p className="small">Click a country to see its live, estimated debt meter and recent trend. Colors show change from the previous period. Data are estimates between official releases.</p>
          <EuropeMap />
        </section>

        <aside className="card">
          <h2>Countries</h2>
          <table className="table small">
            <thead><tr><th>Country</th><th style={{textAlign:"right"}}>Latest (€)</th><th>Trend</th></tr></thead>
            <tbody>
              {rows.map(r=> (
                <tr key={r.code2}>
                  <td><Link href={`/country/${r.code2}`}>{r.name}</Link></td>
                  <td style={{textAlign:"right"}}>{Math.round(r.last).toLocaleString()}</td>
                  <td>
                    <span className={r.delta>=0 ? "badge bad": "badge good"}>
                      {r.dir} {Math.abs(r.delta/Math.max(1,r.last)*100).toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>
      </div>

      <section className="ad-card card">
        <AdSlot client={client} format="auto" fullWidthResponsive show={consent!=="rejected"} />
      </section>
    </main>
  );
}
