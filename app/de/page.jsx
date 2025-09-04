import Link from "next/link";
import EuropeMap from "@/components/EuropeMap";
import QuickList from "@/components/QuickList";
import { countries, trendFor } from "@/lib/data";

export const metadata = {
  title: "EU Debt Map | Staatsschulden in der EU-27",
  description:
    "Interaktive EU-Karte mit live aktualisierten Schätzungen der Staatsschuld je Land. Basierend auf den letzten zwei Eurostat-Stichtagen.",
  openGraph: {
    title: "EU Debt Map",
    description:
      "Erkunden Sie Staatsschulden in der EU-27 mit einer Live-Schätzung je Land.",
    url: "https://eudebtmap.com/de",
    siteName: "EU Debt Map",
    type: "website",
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
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Willkommen bei EU Debt Map</h2>
        <p style={{ margin: 0 }}>
          Entdecken Sie die Staatsschuld aller EU-Länder.{" "}
          <strong>Klicken Sie ein Land auf der Karte</strong>, um eine Live-Schätzung zu sehen.
        </p>
        <ul style={{ marginTop: 10, marginBottom: 0 }}>
          <li><span className="tag">Rot</span> = Schulden steigen • <span className="tag">Grün</span> = Schulden fallen</li>
          <li className="tag">Grundlage: die zwei jüngsten Eurostat-Stichtage.</li>
        </ul>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>EU-Übersicht</h3>
        <p className="tag">Grün = fallend • Rot = steigend (basierend auf den letzten zwei Stichtagen)</p>
        <div className="mapWrap" role="region" aria-label="Interaktive EU-Karte">
          <EuropeMap />
        </div>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Highlights</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginTop: 8 }}>
          <div style={{ background: "#0f172a", border: "1px solid #1f2b3a", borderRadius: 12, padding: 12 }}>
            <div className="tag">Größte Schulden</div>
            {largestDebt ? (
              <div style={{ marginTop: 6 }}>
                <strong>{largestDebt.flag} {largestDebt.name}</strong>
                <div className="mono" aria-live="polite">€{formatEUR(largestDebt.last_value_eur)}</div>
              </div>
            ) : (<div className="tag">—</div>)}
          </div>

          <div style={{ background: "#0f172a", border: "1px solid #1f2b3a", borderRadius: 12, padding: 12 }}>
            <div className="tag">Schnellster Anstieg</div>
            {fastestGrowing ? (
              <div style={{ marginTop: 6 }}>
                <strong>{fastestGrowing.flag} {fastestGrowing.name}</strong>
                <div className="mono" style={{ color: "var(--bad)" }}>↑ +€{formatEUR(fastestGrowing.delta)}</div>
              </div>
            ) : (<div className="tag">—</div>)}
          </div>
        </div>

        <div style={{ marginTop: 12 }} className="tag">
          Warum relevant? Staatsschulden beeinflussen Zinsen, Inflation und die Stabilität der EU-Wirtschaft.
        </div>
      </section>

      <QuickList
        items={quickItems}
        initialCount={8}
        strings={{
          title: "Schnellliste",
          showAll: "Alle anzeigen",
          showLess: "Weniger anzeigen",
          rising: "↑ steigend",
          falling: "↓ fallend",
          flat: "→ unverändert",
          more: "mehr",
        }}
      />
    </main>
  );
}
