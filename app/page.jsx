import EuropeMap from "@/components/EuropeMap";
import { countries, trendFor } from "@/lib/data";

export default function HomePage(){
  return (
    <main className="container grid" style={{alignItems:"start"}}>
      <section className="card" style={{gridColumn:"1 / -1"}}>
        <h2>Europa overzicht</h2>
        <p className="tag">Groen = schuld daalt • Rood = schuld stijgt (op basis van laatste 2 peildata)</p>
        <div className="mapWrap"><EuropeMap /></div>
      </section>

      <section className="card">
        <h3>Snelle lijst</h3>
        <ul style={{listStyle:"none",padding:0,margin:0}}>
          {countries.map(c=>{
            const t = trendFor(c);
            return (
              <li key={c.code} style={{padding:"8px 0",borderBottom:"1px dashed #2b3444"}}>
                <a className="mono" href={`/country/${c.code.toLowerCase()}`}>
                  {c.flag} {c.name} — <span style={{color: t>0 ? "var(--bad)" : t<0 ? "var(--ok)" : "#9ca3af"}}>
                    {t>0 ? "↑ stijgt" : t<0 ? "↓ daalt" : "→ vlak"}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card">
        <h3>Let op</h3>
        <p className="tag">Dit is een MVP met fictieve/vereenvoudigde cijfers als voorbeeld. Koppel later echte data (Eurostat/ECB) voor productie.</p>
      </section>
    </main>
  );
}
