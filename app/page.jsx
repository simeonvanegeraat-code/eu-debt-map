import EuropeMap from "@/components/EuropeMap";
import { countries, trendFor } from "@/lib/data";

export default function HomePage(){
  return (
    <main className="container grid" style={{alignItems:"start"}}>
      <section className="card" style={{gridColumn:"1 / -1"}}>
        <h2>EU overview</h2>
        <p className="tag">Green = debt falling • Red = debt rising (based on the last two reference dates)</p>
        <div className="mapWrap"><EuropeMap /></div>
      </section>

      <section className="card">
        <h3>Quick list</h3>
        <ul style={{listStyle:"none",padding:0,margin:0}}>
          {countries.map(c=>{
            const t = trendFor(c);
            return (
              <li key={c.code} style={{padding:"8px 0",borderBottom:"1px dashed #2b3444"}}>
                <a className="mono" href={`/country/${c.code.toLowerCase()}`}>
                  {c.flag} {c.name} — <span style={{color: t>0 ? "var(--bad)" : t<0 ? "var(--ok)" : "#9ca3af"}}>
                    {t>0 ? "↑ rising" : t<0 ? "↓ falling" : "→ flat"}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card">
        <h3>Note</h3>
        <p className="tag">This is an MVP using simplified demo values. Later we’ll hook up official data for accuracy.</p>
      </section>
    </main>
  );
}
