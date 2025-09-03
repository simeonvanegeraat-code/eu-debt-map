import EuropeMap from "@/components/EuropeMap";
import { countries, trendFor } from "@/lib/data";

function formatEUR(v) {
  return new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 0 }).format(
    Math.round(v)
  );
}

export default function HomePageNL() {
  const valid = countries.filter(
    (c) => c && c.last_value_eur > 0 && c.prev_value_eur > 0
  );

  const largestDebt =
    valid.length > 0
      ? valid.reduce((a, b) => (a.last_value_eur > b.last_value_eur ? a : b))
      : null;

  const withDelta = valid.map((c) => ({
    ...c,
    delta: c.last_value_eur - c.prev_value_eur,
  }));
  const fastestGrowing =
    withDelta.length > 0
      ? withDelta.reduce((a, b) => (a.delta > b.delta ? a : b))
      : null;

  const falling = valid.filter((c) => c.last_value_eur < c.prev_value_eur);
  const fallingPreview = falling.slice(0, 6);
  const fallingMore = Math.max(falling.length - fallingPreview.length, 0);

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2>Welkom bij EU Debt Map</h2>
        <p>
          Ontdek de staatsschuld van alle EU-landen.{" "}
          <strong>Klik op een land op de kaart</strong> om een live, tikkende
          schatting voor dat land te zien.
        </p>
        <ul>
          <li>
            <span className="tag">Rood</span> = schuld stijgt •{" "}
            <span className="tag">Groen</span> = schuld daalt
          </li>
          <li className="tag">
            Cijfers zijn vereenvoudigde demo-schattingen voor de MVP (niet de
            officiële statistieken).
          </li>
        </ul>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3>EU-overzicht</h3>
        <p className="tag">
          Groen = schuld daalt • Rood = schuld stijgt (gebaseerd op de laatste
          twee referentieperiodes)
        </p>
        <div className="mapWrap">
          <EuropeMap />
        </div>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3>Hoogtepunten EU-schuld</h3>
        <div className="highlight-grid">
          <div>
            <div className="tag">Grootste schuld</div>
            {largestDebt ? (
              <>
                <strong>{largestDebt.flag} {largestDebt.name}</strong>
                <div className="mono">€{formatEUR(largestDebt.last_value_eur)}</div>
              </>
            ) : <div className="tag">—</div>}
          </div>
          <div>
            <div className="tag">Snelst groeiend</div>
            {fastestGrowing ? (
              <>
                <strong>{fastestGrowing.flag} {fastestGrowing.name}</strong>
                <div className="mono" style={{ color: "var(--bad)" }}>
                  ↑ +€{formatEUR(fastestGrowing.delta)}
                </div>
              </>
            ) : <div className="tag">—</div>}
          </div>
          <div>
            <div className="tag">Schuld dalend</div>
            {falling.length > 0 ? (
              <>
                {fallingPreview.map((c) => (
                  <span key={c.code} className="mono chip">{c.code}</span>
                ))}
                {fallingMore > 0 && <span className="tag">+{fallingMore} meer</span>}
              </>
            ) : <div className="tag">Geen landen met dalende schuld.</div>}
          </div>
        </div>
        <div className="tag" style={{ marginTop: 12 }}>
          Waarom is schuld belangrijk? Overheidsschuld beïnvloedt rente,
          inflatie en de stabiliteit van de EU-economie. Dit project maakt die
          grote cijfers in één oogopslag zichtbaar.
        </div>
      </section>

      <section className="card">
        <h3>Snelle lijst</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {countries.map((c) => {
            const t = trendFor(c);
            return (
              <li key={c.code}>
                <a className="mono" href={`/country/${c.code.toLowerCase()}`}>
                  {c.flag} {c.name} —{" "}
                  <span style={{ color: t > 0 ? "var(--bad)" : t < 0 ? "var(--ok)" : "#9ca3af" }}>
                    {t > 0 ? "↑ stijgend" : t < 0 ? "↓ dalend" : "→ stabiel"}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card">
        <div className="tag">
          Let op: deze MVP gebruikt demo-cijfers. Officiële data (Eurostat/ECB)
          wordt later gekoppeld.
        </div>
      </section>
    </main>
  );
}
