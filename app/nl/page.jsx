// app/nl/page.jsx
import Link from "next/link";
import EuropeMap from "@/components/EuropeMap";
import QuickList from "@/components/QuickList";
import { countries, trendFor } from "@/lib/data";
import EUTotalTicker from "@/components/EUTotalTicker";

// --- SEO / Metadata (NL) ---
export const metadata = {
  title: "EU Debt Map | Ontdek staatschulden in de EU-27",
  description:
    "Interactieve EU-kaart met live, tikkende schattingen van overheidsschuld per land. Gebaseerd op de laatste twee Eurostat-referentieperiodes.",
  openGraph: {
    title: "EU Debt Map",
    description:
      "Ontdek overheidsschuld in de EU-27 met een live, tikkende schatting per land.",
    url: "https://eudebtmap.com/nl",
    siteName: "EU Debt Map",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EU Debt Map",
    description:
      "Live, tikkende schattingen van EU-overheidsschuld op basis van Eurostat.",
  },
  metadataBase: new URL("https://eudebtmap.com"),
  alternates: {
    canonical: "https://eudebtmap.com/nl",
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
          <h2 style={{ margin: 0 }}>Zie EU-overheidsschuld, live</h2>
          <p className="tag" style={{ margin: 0 }}>
            Interactieve kaart met tikkende schattingen per land, gebaseerd op de laatste twee Eurostat-kwartalen.
          </p>
          <p className="tag" style={{ margin: 0 }}>
            Bron: Eurostat (gov_10q_ggdebt). Educatieve visualisatie, geen officiële statistiek.
          </p>
        </div>
        <EUTotalTicker />
      </section>

      {/* MAP */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>EU-overzicht</h3>
        <div className="mapWrap" role="region" aria-label="Interactieve EU-kaart">
          <EuropeMap />
        </div>

        {/* Legend + CTA */}
        <div role="note" aria-label="Legenda en actie" style={s.mapFooter}>
          <div style={s.legend}>
            <strong>Legenda:</strong>
            <span style={{ ...s.pill, ...s.pillOk }}>Groen</span>= schuld daalt
            <span style={s.sep}>•</span>
            <span style={{ ...s.pill, ...s.pillBad }}>Rood</span>= schuld stijgt
            <span style={s.sep}>•</span>
            <span style={s.muted}>Gebaseerd op de laatste twee referentiedata.</span>
          </div>

          <div style={s.cta}>
            <span aria-hidden style={s.ctaIcon}>➜</span>
            <span>
              <strong>Klik op een land</strong> op de kaart voor de live schuld-teller.
            </span>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>EU-schuld highlights</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginTop: 8 }}>
          {/* Grootste schuld */}
          <div style={{ background: "#0f172a", border: "1px solid #1f2b3a", borderRadius: 12, padding: 12 }} aria-label="Grootste schuld">
            <div className="tag">Grootste schuld</div>
            {largestDebt ? (
              <div style={{ marginTop: 6 }}>
                <strong>{largestDebt.flag} {largestDebt.name}</strong>
                <div className="mono" aria-live="polite">€{formatEUR(largestDebt.last_value_eur)}</div>
              </div>
            ) : <div className="tag">—</div>}
          </div>

          {/* Snelst stijgend */}
          <div style={{ background: "#0f172a", border: "1px solid #1f2b3a", borderRadius: 12, padding: 12 }} aria-label="Snelst stijgende schuld">
            <div className="tag">Snelst stijgend</div>
            {fastestGrowing ? (
              <div style={{ marginTop: 6 }}>
                <strong>{fastestGrowing.flag} {fastestGrowing.name}</strong>
                <div className="mono" style={{ color: "var(--bad)" }}>↑ +€{formatEUR(fastestGrowing.delta)}</div>
              </div>
            ) : <div className="tag">—</div>}
          </div>
        </div>

        <div style={{ marginTop: 12 }} className="tag">
          Waarom is schuld belangrijk? Overheidsschuld beïnvloedt rentes, inflatie en de stabiliteit van de EU-economie.
        </div>
      </section>

      {/* QUICK LIST */}
      <QuickList
        items={quickItems}
        initialCount={8}
        strings={{
          title: "Snelle lijst",
          showAll: "Toon alles",
          showLess: "Toon minder",
          rising: "↑ stijgend",
          falling: "↓ dalend",
          flat: "→ gelijk",
          more: "meer",
        }}
      />
    </main>
  );
}
