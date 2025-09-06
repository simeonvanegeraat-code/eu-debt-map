// app/fr/page.jsx
import Link from "next/link";
import EuropeMap from "@/components/EuropeMap";
import QuickList from "@/components/QuickList";
import { countries, trendFor } from "@/lib/data";
import EUTotalTicker from "@/components/EUTotalTicker";

// --- SEO / Metadata (FR) ---
export const metadata = {
  title: "EU Debt Map | Explorer la dette publique dans l’UE-27",
  description:
    "Carte interactive de l’UE avec estimations en direct de la dette publique par pays. Basé sur les deux derniers trimestres de référence d’Eurostat.",
  openGraph: {
    title: "EU Debt Map",
    description:
      "Explorez la dette publique dans l’UE-27 avec une estimation en direct par pays.",
    url: "https://eudebtmap.com/fr",
    siteName: "EU Debt Map",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EU Debt Map",
    description:
      "Estimations en direct de la dette publique de l’UE basées sur Eurostat.",
  },
  metadataBase: new URL("https://eudebtmap.com"),
  alternates: {
    canonical: "https://eudebtmap.com/fr",
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
          <h2 style={{ margin: 0 }}>Voir la dette publique de l’UE, en direct</h2>
          <p className="tag" style={{ margin: 0 }}>
            Carte interactive avec estimations par pays, basées sur les deux derniers trimestres d’Eurostat.
          </p>
          <p className="tag" style={{ margin: 0 }}>
            Source : Eurostat (gov_10q_ggdebt). Visualisation éducative, non officielle.
          </p>
        </div>
        <EUTotalTicker />
      </section>

      {/* MAP */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Vue d’ensemble de l’UE</h3>
        <div className="mapWrap" role="region" aria-label="Carte interactive de l’UE">
          <EuropeMap />
        </div>

        {/* Legend + CTA */}
        <div role="note" aria-label="Légende et action" style={s.mapFooter}>
          <div style={s.legend}>
            <strong>Légende :</strong>
            <span style={{ ...s.pill, ...s.pillOk }}>Vert</span>= dette en baisse
            <span style={s.sep}>•</span>
            <span style={{ ...s.pill, ...s.pillBad }}>Rouge</span>= dette en hausse
            <span style={s.sep}>•</span>
            <span style={s.muted}>Basé sur les deux dernières dates de référence.</span>
          </div>

          <div style={s.cta}>
            <span aria-hidden style={s.ctaIcon}>➜</span>
            <span>
              <strong>Cliquez sur un pays</strong> sur la carte pour voir son compteur de dette en direct.
            </span>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Faits marquants sur la dette de l’UE</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginTop: 8 }}>
          {/* Dette la plus élevée */}
          <div style={{ background: "#0f172a", border: "1px solid #1f2b3a", borderRadius: 12, padding: 12 }} aria-label="Dette la plus élevée">
            <div className="tag">Dette la plus élevée</div>
            {largestDebt ? (
              <div style={{ marginTop: 6 }}>
                <strong>{largestDebt.flag} {largestDebt.name}</strong>
                <div className="mono" aria-live="polite">€{formatEUR(largestDebt.last_value_eur)}</div>
              </div>
            ) : <div className="tag">—</div>}
          </div>

          {/* Croissance la plus rapide */}
          <div style={{ background: "#0f172a", border: "1px solid #1f2b3a", borderRadius: 12, padding: 12 }} aria-label="Croissance de dette la plus rapide">
            <div className="tag">Croissance la plus rapide</div>
            {fastestGrowing ? (
              <div style={{ marginTop: 6 }}>
                <strong>{fastestGrowing.flag} {fastestGrowing.name}</strong>
                <div className="mono" style={{ color: "var(--bad)" }}>↑ +€{formatEUR(fastestGrowing.delta)}</div>
              </div>
            ) : <div className="tag">—</div>}
          </div>
        </div>

        <div style={{ marginTop: 12 }} className="tag">
          Pourquoi la dette compte-t-elle ? La dette publique influence les taux d’intérêt, l’inflation et la stabilité de l’économie de l’UE.
        </div>
      </section>

      {/* QUICK LIST */}
      <QuickList
        items={quickItems}
        initialCount={8}
        strings={{
          title: "Liste rapide",
          showAll: "Tout afficher",
          showLess: "Réduire",
          rising: "↑ en hausse",
          falling: "↓ en baisse",
          flat: "→ stable",
          more: "plus",
        }}
      />
    </main>
  );
}
