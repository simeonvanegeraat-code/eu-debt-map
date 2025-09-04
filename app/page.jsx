import Link from "next/link";
import EuropeMap from "@/components/EuropeMap";
import QuickList from "@/components/QuickList";
import { countries, trendFor } from "@/lib/data";

// --- SEO / Metadata (EN) ---
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

  const quickItems = valid.map((c) => ({
    code: c.code,
    name: c.name,
    flag: c.flag,
    trend: trendFor(c),
  }));

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      {/* Intro */}
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
          <li className="tag" aria-label="Method note">
            Based on the two latest Eurostat reference dates.
          </li>
        </ul>
      </section>

      {/* Map */}
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
        </div>

        {/* Context */}
        <div style={{ marginTop: 12 }} className="tag">
          Why does debt matter? Government debt influences interest rates,
          inflation, and the stability of the EU economy. This project makes
          those big numbers visible at a glance.
        </div>
      </section>

      {/* Collapsible Quick list */}
      <QuickList
        items={quickItems}
        initialCount={8}
        strings={{
          title: "Quick list",
          showAll: "Show all",
          showLess: "Show less",
          rising: "↑ rising",
          falling: "↓ falling",
          flat: "→ flat",
          more: "more",
        }}
      />
    </main>
  );
}
