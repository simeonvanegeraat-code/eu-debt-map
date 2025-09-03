// app/page.jsx
import Link from "next/link";
import EuropeMap from "@/components/EuropeMap";
import { countries, trendFor } from "@/lib/data";

// --- SEO / Metadata (site default = EN) ---
export const metadata = {
  title: "EU Debt Map | Explore national debts across the EU-27",
  description:
    "Interactive EU map with live, ticking estimates of government debt for EU-27 countries. Based on the last two Eurostat reference periods.",
  openGraph: {
    title: "EU Debt Map",
    description:
      "Explore government debt across the EU-27 with a live, ticking estimate per country.",
    url: "https://eudebtmap.com/",
    siteName: "EU Debt Map",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EU Debt Map",
    description:
      "Live, ticking estimates of EU government debt based on Eurostat.",
  },
  metadataBase: new URL("https://eudebtmap.com"),
  alternates: {
    canonical: "https://eudebtmap.com/",
    languages: {
      en: "https://eudebtmap.com/",
      nl: "https://eudebtmap.com/nl",
      de: "https://eudebtmap.com/de",
      fr: "https://eudebtmap.com/fr",
      "x-default": "https://eudebtmap.com/",
    },
  },
};

function formatEUR(v) {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(
    Math.round(v)
  );
}

export default function HomePage() {
  // Alleen landen met echte waarden voor highlights
  const valid = countries.filter(
    (c) => c && c.last_value_eur > 0 && c.prev_value_eur > 0
  );

  // Largest debt (op basis van last_value_eur)
  const largestDebt =
    valid.length > 0
      ? valid.reduce((a, b) => (a.last_value_eur > b.last_value_eur ? a : b))
      : null;

  // Fastest growing (grootste positieve delta)
  const withDelta = valid.map((c) => ({
    ...c,
    delta: c.last_value_eur - c.prev_value_eur,
  }));
  const fastestGrowing =
    withDelta.length > 0
      ? withDelta.reduce((a, b) => (a.delta > b.delta ? a : b))
      : null;

  // Landen waar schuld daalt
  const falling = valid.filter((c) => c.last_value_eur < c.prev_value_eur);
  const fallingPreview = falling.slice(0, 6); // eerste 6 tonen
  const fallingMore = Math.max(falling.length - fallingPreview.length, 0);

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      {/* Intro / uitleg */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Welcome to EU Debt Map</h2>
        <p style={{ margin: 0 }}>
          Explore the government debt of all EU countries.{" "}
          <strong>Click a country on the map</strong> to see a live, ticking
          estimate for that country.
        </p>
        <ul style={{ marginTop: 10, marginBottom: 0 }}>
          <li>
            <span className="tag">Red</span> = debt rising •{" "}
            <span className="tag">Green</span> = debt falling
          </li>
          <li className="tag" aria-label="Disclaimer">
            Figures are simplified demo estimates for the MVP (not official
            statistics).
          </li>
        </ul>
      </section>

      {/* Kaart */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>EU overview</h3>
        <p className="tag">
          Green = debt falling • Red = debt rising (based on the last two
          reference dates)
        </p>
        <div className="mapWrap" role="region" aria-label="Interactive EU map">
          <EuropeMap />
        </div>
      </section>

      {/* Highlights */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>EU debt highlights</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 12,
            marginTop: 8,
          }}
        >
          {/* Largest debt */}
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #1f2b3a",
              borderRadius: 12,
              padding: 12,
            }}
            aria-label="Largest debt card"
          >
            <div className="tag">Largest debt</div>
            {largestDebt ? (
              <div style={{ marginTop: 6 }}>
                <strong>
                  {largestDebt.flag} {largestDebt.name}
                </strong>
                <div className="mono" aria-live="polite">
                  €{formatEUR(largestDebt.last_value_eur)}
                </div>
              </div>
            ) : (
              <div className="tag">—</div>
            )}
          </div>

          {/* Fastest growing */}
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #1f2b3a",
              borderRadius: 12,
              padding: 12,
            }}
            aria-label="Fastest growing debt card"
          >
            <div className="tag">Fastest growing</div>
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

          {/* Falling list */}
          <div
            style={{
              background: "#0f172a",
              border: "1px solid "#1f2b3a",
              borderRadius: 12,
              padding: 12,
            }}
            aria-label="Debt falling list"
          >
            <div className="tag">Debt falling</div>
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
                    aria-label={`${c.name} falling`}
                  >
                    {c.code}
                  </span>
                ))}
                {fallingMore > 0 && <span className="tag">+{fallingMore} more</span>}
              </div>
            ) : (
              <div className="tag">No countries currently falling.</div>
            )}
          </div>
        </div>

        {/* Educatieve hook */}
        <div style={{ marginTop: 12 }} className="tag">
          Why does debt matter? Government debt influences interest rates,
          inflation, and the stability of the EU economy. This project makes
          those big numbers visible at a glance.
        </div>
      </section>

      {/* Quick list (handig + SEO) */}
      <section className="card" aria-label="Quick list of countries">
        <h3>Quick list</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {countries.map((c) => {
            const t = trendFor(c);
            const trendLabel = t > 0 ? "↑ rising" : t < 0 ? "↓ falling" : "→ flat";
            const trendColor = t > 0 ? "var(--bad)" : t < 0 ? "var(--ok)" : "#9ca3af";
            return (
              <li
                key={c.code}
                style={{ padding: "8px 0", borderBottom: "1px dashed #2b3444" }}
              >
                <Link
                  className="mono"
                  href={`/country/${c.code.toLowerCase()}`}
                  aria-label={`${c.name} — ${trendLabel}`}
                  prefetch
                >
                  {c.flag} {c.name} —{" "}
                  <span style={{ color: trendColor }}>{trendLabel}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Disclaimer onderaan, unobtrusive */}
      <section className="card">
        <div className="tag" role="note">
          Note: This MVP uses demo figures. Official data (Eurostat/ECB) will be
          connected in a future update.
        </div>
      </section>
    </main>
  );
}
