import EuropeMap from "@/components/EuropeMap";
import { countries, trendFor } from "@/lib/data";

function formatEUR(v) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(
    Math.round(v)
  );
}

export default function HomePageDE() {
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
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Willkommen bei EU Debt Map</h2>
        <p style={{ margin: 0 }}>
          Entdecken Sie die Staatsverschuldung aller EU-Länder.{" "}
          <strong>Klicken Sie auf ein Land auf der Karte</strong>, um eine
          Live-Schätzung für dieses Land zu sehen.
        </p>
        <ul style={{ marginTop: 10, marginBottom: 0 }}>
          <li>
            <span className="tag">Rot</span> = Schulden steigen •{" "}
            <span className="tag">Grün</span> = Schulden sinken
          </li>
          <li className="tag">
            Zahlen sind vereinfachte Demo-Schätzungen für das MVP (keine
            offiziellen Statistiken).
          </li>
        </ul>
      </section>

      {/* Karte */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>EU-Überblick</h3>
        <p className="tag">
          Grün = Schulden sinken • Rot = Schulden steigen (basierend auf den
          letzten zwei Referenzzeiträumen)
        </p>
        <div className="mapWrap">
          <EuropeMap />
        </div>
      </section>

      {/* Highlights */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Highlights zur EU-Verschuldung</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 12,
            marginTop: 8,
          }}
        >
          {/* Größte Verschuldung */}
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #1f2b3a",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div className="tag">Größte Verschuldung</div>
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

          {/* Am schnellsten wachsend */}
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #1f2b3a",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div className="tag">Am schnellsten wachsend</div>
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

          {/* Schulden sinken */}
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #1f2b3a",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div className="tag">Schulden sinken</div>
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
                {fallingMore > 0 && <span className="tag">+{fallingMore} weitere</span>}
              </div>
            ) : (
              <div className="tag">Keine Länder mit sinkender Verschuldung.</div>
            )}
          </div>
        </div>

        {/* Info */}
        <div style={{ marginTop: 12 }} className="tag">
          Warum ist Verschuldung wichtig? Staatsschulden beeinflussen Zinssätze,
          Inflation und die Stabilität der EU-Wirtschaft. Dieses Projekt macht
          große Zahlen auf einen Blick sichtbar.
        </div>
      </section>

      {/* Schnellliste */}
      <section className="card">
        <h3>Schnellliste</h3>
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
                    {t > 0 ? "↑ steigend" : t < 0 ? "↓ sinkend" : "→ stabil"}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Hinweis */}
      <section className="card">
        <div className="tag">
          Hinweis: Dieses MVP verwendet Demo-Zahlen. Offizielle Daten
          (Eurostat/ECB) werden später angebunden.
        </div>
      </section>
    </main>
  );
}
