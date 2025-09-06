// app/page.jsx
import Link from "next/link";
import EuropeMap from "@/components/EuropeMap";
import QuickList from "@/components/QuickList";
import { countries, trendFor } from "@/lib/data";
import EUTotalTicker from "@/components/EUTotalTicker"; // EU-27 live teller

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
  // Alleen landen met echte waarden voor highlights/quick list
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

  // inline style helpers (donker thema, subtiele borders)
  const s = {
    mapFooter: {
      marginTop: 12,
      border: "1px solid #203044",
      borderRadius: 12,
      padding: 12,
      background: "rgba(15,23,42,0.6)",
    },
    legend: { fontSize: 14, lineHeight: 1.5 },
    pill: {
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 999,
      fontWeight: 600,
      fontSize: 12,
      border: "1px solid transparent",
      marginRight: 4,
      marginLeft: 4,
    },
    pillOk: {
      color: "var(--ok)",
      borderColor: "#1f4d3a",
      background: "rgba(34,197,94,.08)",
    },
    pillBad: {
      color: "var(--bad)",
      borderColor: "#5a1f2a",
      background: "rgba(239,68,68,.08)",
    },
    sep: { margin: "0 8px", color: "#2b3444" },
    muted: { color: "#9ca3af" },
    cta: {
      marginTop: 10,
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 12px",
      borderRadius: 10,
      background: "rgba(255,255,255,0.03)",
      border: "1px dashed #2a3a4f",
      textAlign: "center",
      justifyContent: "center",
      fontSize: 14,
      lineHeight: 1.6,
      fontWeight: 600,
    },
    ctaIcon: { fontSize: 16, opacity: 0.9, transform: "translateY(1px)" },
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      {/* === HERO (kort & krachtig, zonder legend) === */}
      <section
        className="card"
        style={{
          gridColumn: "1 / -1",
          display: "grid",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <h2 style={{ margin: 0 }}>See EU Government Debt, live</h2>
          <p className="tag" style={{ margin: 0 }}>
            Interactive map with per-country ticking estimates based on the last
            two Eurostat quarters.
          </p>
          <p className="tag" style={{ margin: 0 }}>
            Source: Eurostat (gov_10q_ggdebt). Educational visualization, not an
            official statistic.
          </p>
        </div>

        {/* EU-27 Total (live) */}
        <EUTotalTicker />
      </section>

      {/* === MAP === */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>EU overview</h3>

        <div className="mapWrap" role="region" aria-label="Interactive EU map">
          <EuropeMap />
        </div>

        {/* Legend + CTA in één nette map-footer */}
        <div role="note" aria-label="Map legend and action" style={s.mapFooter}>
          <div style={s.legend}>
            <strong>Legend:</strong>
            <span style={{ ...s.pill, ...s.pillOk }}>Green</span>= debt falling
            <span style={s.sep}>•</span>
            <span style={{ ...s.pill, ...s.pillBad }}>Red</span>= debt rising
            <span style={s.sep}>•</span>
            <span style={s.muted}>Based on the last two reference dates.</span>
          </div>

          <div style={s.cta}>
            <span aria-hidden style={s.ctaIcon}>
              ➜
            </span>
            <span>
              <strong>Click any country</strong> on the map to see its live debt
              ticker.
            </span>
          </div>
        </div>
      </section>

      {/* === HIGHLIGHTS === */}
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

      {/* === QUICK LIST (collapsible) === */}
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
