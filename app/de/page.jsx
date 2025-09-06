// app/de/page.jsx
import Link from "next/link";
import EuropeMap from "@/components/EuropeMap";
import QuickList from "@/components/QuickList";
import { countries, trendFor } from "@/lib/data";
import EUTotalTicker from "@/components/EUTotalTicker";

// --- SEO / Metadata (DE) ---
export const metadata = {
  title: "EU Debt Map | Staatsverschuldung in der EU-27 erkunden",
  description:
    "Interaktive EU-Karte mit live aktualisierten Schätzungen der Staatsverschuldung pro Land. Basierend auf den letzten zwei Eurostat-Referenzquartalen.",
  openGraph: {
    title: "EU Debt Map",
    description:
      "Erkunde die Staatsverschuldung in der EU-27 mit einer live tickenden Schätzung pro Land.",
    url: "https://eudebtmap.com/de",
    siteName: "EU Debt Map",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EU Debt Map",
    description:
      "Live-Schätzungen der EU-Staatsverschuldung auf Basis von Eurostat.",
  },
  metadataBase: new URL("https://eudebtmap.com"),
  alternates: {
    canonical: "https://eudebtmap.com/de",
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

  const quickItems = valid.map((c) => ({
    code: c.code,
    name: c.name,
    flag: c.flag,
    trend: trendFor(c),
  }));

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
      {/* HERO */}
      <section className="card" style={{ gridColumn: "1 / -1", display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <h2 style={{ margin: 0 }}>EU-Staatsverschuldung live sehen</h2>
          <p className="tag" style={{ margin: 0 }}>
            Interaktive Karte mit tickenden Schätzungen pro Land, basierend auf den letzten zwei Eurostat-Quartalen.
          </p>
          <p className="tag" style={{ margin: 0 }}>
            Quelle: Eurostat (gov_10q_ggdebt). Bildungsvisualisierung, keine offizielle Statistik.
          </p>
        </div>
        <EUTotalTicker />
      </section>

      {/* MAP */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>EU-Übersicht</h3>
        <div className="mapWrap" role="region" aria-label="Interaktive EU-Karte">
          <EuropeMap />
        </div>

        {/* Legend + CTA */}
        <div role="note" aria-label="Legende und Aktion" style={s.mapFooter}>
          <div style={s.legend}>
            <strong>Legende:</strong>
            <span style={{ ...s.pill, ...s.pillOk }}>Grün</span>= sinkende Schulden
            <span style={s.sep}>•</span>
            <span style={{ ...s.pill, ...s.pillBad }}>Rot</span>= steigende Schulden
            <span style={s.sep}>•</span>
            <span style={s.muted}>Basiert auf den letzten zwei Referenzdaten.</span>
          </div>

          <div style={s.cta}>
            <span aria-hidden style={s.ctaIcon}>➜</span>
            <span>
              <strong>Klicke auf ein Land</strong> auf der Karte, um den Live-Schuldenzähler zu sehen.
            </span>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>EU-Schulden-Highlights</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginTop: 8 }}>
          {/* Höchste Verschuldung */}
          <div style={{ background: "#0f172a", border: "1px solid #1f2b3a", borderRadius: 12, padding: 12 }} aria-label="Höchste Verschuldung">
            <div className="tag">Höchste Verschuldung</div>
            {largestDebt ? (
              <div style={{ marginTop: 6 }}>
                <strong>{largestDebt.flag} {largestDebt.name}</strong>
                <div className="mono" aria-live="polite">€{formatEUR(largestDebt.last_value_eur)}</div>
              </div>
            ) : <div className="tag">—</div>}
          </div>

          {/* Schnellstes Wachstum */}
          <div style={{ background: "#0f172a", border: "1px solid #1f2b3a", borderRadius: 12, padding: 12 }} aria-label="Schnellstes Schuldenwachstum">
            <div className="tag">Schnellstes Wachstum</div>
            {fastestGrowing ? (
              <div style={{ marginTop: 6 }}>
                <strong>{fastestGrowing.flag} {fastestGrowing.name}</strong>
                <div className="mono" style={{ color: "var(--bad)" }}>↑ +€{formatEUR(fastestGrowing.delta)}</div>
              </div>
            ) : <div className="tag">—</div>}
          </div>
        </div>

        <div style={{ marginTop: 12 }} className="tag">
          Warum sind Schulden wichtig? Staatsverschuldung beeinflusst Zinsen, Inflation und die Stabilität der EU-Wirtschaft.
        </div>
      </section>

      {/* QUICK LIST */}
      <QuickList
        items={quickItems}
        initialCount={8}
        strings={{
          title: "Schnellübersicht",
          showAll: "Alle anzeigen",
          showLess: "Weniger anzeigen",
          rising: "↑ steigend",
          falling: "↓ fallend",
          flat: "→ stabil",
          more: "mehr",
        }}
      />
    </main>
  );
}
