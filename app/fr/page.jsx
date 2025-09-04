import Link from "next/link";
import EuropeMap from "@/components/EuropeMap";
import QuickList from "@/components/QuickList";
import { countries, trendFor } from "@/lib/data";

export const metadata = {
  title: "EU Debt Map | Dette publique dans l’UE-27",
  description:
    "Carte interactive de l’UE avec estimations en direct de la dette publique par pays, basées sur les deux dernières périodes de référence Eurostat.",
  openGraph: {
    title: "EU Debt Map",
    description:
      "Explorez la dette publique dans l’UE-27 avec une estimation en direct par pays.",
    url: "https://eudebtmap.com/fr",
    siteName: "EU Debt Map",
    type: "website",
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
  const valid = countries.filter((c) => c && c.last_value_eur > 0 && c.prev_value_eur > 0);

  const largestDebt =
    valid.length > 0 ? valid.reduce((a, b) => (a.last_value_eur > b.last_value_eur ? a : b)) : null;

  const withDelta = valid.map((c) => ({ ...c, delta: c.last_value_eur - c.prev_value_eur }));
  const fastestGrowing = withDelta.length > 0 ? withDelta.reduce((a, b) => (a.delta > b.delta ? a : b)) : null;

  const quickItems = valid.map((c) => ({
    code: c.code,
    name: c.name,
    flag: c.flag,
    trend: trendFor(c),
  }));

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Bienvenue sur EU Debt Map</h2>
        <p style={{ margin: 0 }}>
          Explorez la dette publique de tous les pays de l’UE.{" "}
          <strong>Cliquez un pays sur la carte</strong> pour voir une estimation en direct.
        </p>
        <ul style={{ marginTop: 10, marginBottom: 0 }}>
          <li><span className="tag">Rouge</span> = dette en hausse • <span className="tag">Vert</span> = dette en baisse</li>
          <li className="tag">Basé sur les deux dernières périodes de référence Eurostat.</li>
        </ul>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Vue d’ensemble de l’UE</h3>
        <p className="tag">Vert = baisse • Rouge = hausse (selon les deux derniers points de référence)</p>
        <div className="mapWrap" role="region" aria-label="Carte interactive de l’UE">
          <EuropeMap />
        </div>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>À retenir</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginTop: 8 }}>
          <div style={{ background: "#0f172a", border: "1px solid #1f2b3a", borderRadius: 12, padding: 12 }}>
            <div className="tag">Dette la plus élevée</div>
            {largestDebt ? (
              <div style={{ marginTop: 6 }}>
                <strong>{largestDebt.flag} {largestDebt.name}</strong>
                <div className="mono" aria-live="polite">€{formatEUR(largestDebt.last_value_eur)}</div>
              </div>
            ) : (<div className="tag">—</div>)}
          </div>

          <div style={{ background: "#0f172a", border: "1px solid #1f2b3a", borderRadius: 12, padding: 12 }}>
            <div className="tag">Hausse la plus rapide</div>
            {fastestGrowing ? (
              <div style={{ marginTop: 6 }}>
                <strong>{fastestGrowing.flag} {fastestGrowing.name}</strong>
                <div className="mono" style={{ color: "var(--bad)" }}>↑ +€{formatEUR(fastestGrowing.delta)}</div>
              </div>
            ) : (<div className="tag">—</div>)}
          </div>
        </div>

        <div style={{ marginTop: 12 }} className="tag">
          Pourquoi c’est important ? La dette publique influence les taux, l’inflation et la stabilité de l’économie de l’UE.
        </div>
      </section>

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
          more: "de plus",
        }}
      />
    </main>
  );
}
