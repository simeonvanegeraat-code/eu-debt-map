import EuropeMap from "@/components/EuropeMap";
import { countries, trendFor } from "@/lib/data";

function formatEUR(v) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(
    Math.round(v)
  );
}

export default function HomePageFR() {
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
      {/* Intro */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Bienvenue sur EU Debt Map</h2>
        <p style={{ margin: 0 }}>
          Explorez la dette publique de tous les pays de l’UE.{" "}
          <strong>Cliquez sur un pays de la carte</strong> pour voir une
          estimation en temps réel pour ce pays.
        </p>
        <ul style={{ marginTop: 10, marginBottom: 0 }}>
          <li>
            <span className="tag">Rouge</span> = dette en hausse •{" "}
            <span className="tag">Vert</span> = dette en baisse
          </li>
          <li className="tag">
            Les chiffres sont des estimations de démonstration simplifiées pour
            le MVP (pas des statistiques officielles).
          </li>
        </ul>
      </section>

      {/* Carte */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Vue d’ensemble de l’UE</h3>
        <p className="tag">
          Vert = dette en baisse • Rouge = dette en hausse (d’après les deux
          dernières périodes de référence)
        </p>
        <div className="mapWrap">
          <EuropeMap />
        </div>
      </section>

      {/* Faits marquants */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Faits marquants sur la dette de l’UE</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 12,
            marginTop: 8,
          }}
        >
          {/* Dette la plus élevée */}
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #1f2b3a",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div className="tag">Dette la plus élevée</div>
            {largestDebt ? (
              <div style={{ marginTop: 6 }}>
                <strong>
                  {largestDebt.flag} {largestDebt.name}
                </strong>
                <div className="mono">€{formatEUR(largestDebt.last_value_eur)}</div>
              </div>
            ) : (
              <div className="tag">—</div>
            )}
          </div>

          {/* Croissance la plus rapide */}
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #1f2b3a",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div className="tag">Croissance la plus rapide</div>
            {fastestGrowing ? (
              <div style={{ marginTop: 6 }}>
                <strong>
                  {fastestGrowing.flag} {fastestGrowing.name}
                </strong>
                <div className="mono" style={{ color: "var(--bad)" }}>
                  ↑ +€{formatEUR(fastestGrowing.delta)}
                </div>
              </div>
            ) : (
              <div className="tag">—</div>
            )}
          </div>

          {/* Dette en baisse */}
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #1f2b3a",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div className="tag">Dette en baisse</div>
            {falling.length > 0 ? (
              <div style={{ marginTop: 6 }}>
                {fallingPreview.map((c) => (
                  <span
                    key={c.code}
                    className="mono"
                    style={{
                      background: "#0b2b1d",
                      border: "1px solid #1f5d43",
                      color: "#7efab2",
                      borderRadius: 10,
                      padding: "2px 8px",
                      marginRight: 6,
                      display: "inline-block",
                      marginBottom: 6,
                      fontSize: 12,
                    }}
                  >
                    {c.code}
                  </span>
                ))}
                {fallingMore > 0 && <span className="tag">+{fallingMore} de plus</span>}
              </div>
            ) : (
              <div className="tag">Aucun pays actuellement en baisse.</div>
            )}
          </div>
        </div>

        {/* Accroche éducative */}
        <div style={{ marginTop: 12 }} className="tag">
          Pourquoi la dette compte-t-elle ? La dette publique influence les taux
          d’intérêt, l’inflation et la stabilité de l’économie de l’UE. Ce
          projet rend ces grands chiffres visibles en un coup d’œil.
        </div>
      </section>

      {/* Liste rapide */}
      <section className="card">
        <h3>Liste rapide</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {countries.map((c) => {
            const t = trendFor(c);
            return (
              <li
                key={c.code}
                style={{ padding: "8px 0", borderBottom: "1px dashed #2b3444" }}
              >
                <a className="mono" href={`/country/${c.code.toLowerCase()}`}>
                  {c.flag} {c.name} —{" "}
                  <span
                    style={{
                      color:
                        t > 0 ? "var(--bad)" : t < 0 ? "var(--ok)" : "#9ca3af",
                    }}
                  >
                    {t > 0 ? "↑ en hausse" : t < 0 ? "↓ en baisse" : "→ stable"}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Avertissement */}
      <section className="card">
        <div className="tag">
          Remarque : ce MVP utilise des chiffres de démonstration. Les données
          officielles (Eurostat/BCE) seront connectées ultérieurement.
        </div>
      </section>
    </main>
  );
}
