import Link from "next/link";
import EuropeMap from "@/components/EuropeMap";
import QuickList from "@/components/QuickList";
import { countries, trendFor } from "@/lib/data";

export const metadata = {
  title: "EU Debt Map | Bekijk staatsschulden in de EU-27",
  description:
    "Interactieve EU-kaart met live, tikkende schattingen van de staatsschuld per land. Gebaseerd op de laatste twee Eurostat-peildata.",
  openGraph: {
    title: "EU Debt Map",
    description:
      "Ontdek staatsschuld in de EU-27 met een live schatting per land.",
    url: "https://eudebtmap.com/nl",
    siteName: "EU Debt Map",
    type: "website",
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
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Welkom bij EU Debt Map</h2>
        <p style={{ margin: 0 }}>
          Bekijk de staatsschuld van alle EU-landen.{" "}
          <strong>Klik op de kaart op een land</strong> voor een live, tikkende schatting.
        </p>
        <ul style={{ marginTop: 10, marginBottom: 0 }}>
          <li>
            <span className="tag">Rood</span> = schuld stijgt • <span className="tag">Groen</span> = schuld daalt
          </li>
          <li className="tag">Gebaseerd op de laatste twee Eurostat-peildata.</li>
        </ul>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>EU-overzicht</h3>
        <p className="tag">
          Groen = schuld daalt • Rood = schuld stijgt (op basis van de laatste twee peildata)
        </p>
        <div className="mapWrap" role="region" aria-label="Interactieve EU-kaart">
          <EuropeMap />
        </div>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Highlights</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginTop: 8 }}>
          <div style={{ background: "#0f172a", border: "1px solid #1f2b3a", borderRadius: 12, padding: 12 }}>
            <div className="tag">Grootste schuld</div>
            {largestDebt ? (
              <div style={{ marginTop: 6 }}>
                <strong>{largestDebt.flag} {largestDebt.name}</strong>
                <div className="mono" aria-live="polite">€{formatEUR(largestDebt.last_value_eur)}</div>
              </div>
            ) : (<div className="tag">—</div>)}
          </div>

          <div style={{ background: "#0f172a", border: "1px solid #1f2b3a", borderRadius: 12, padding: 12 }}>
            <div className="tag">Snelst stijgend</div>
            {fastestGrowing ? (
              <div style={{ marginTop: 6 }}>
                <strong>{fastestGrowing.flag} {fastestGrowing.name}</strong>
                <div className="mono" style={{ color: "var(--bad)" }}>↑ +€{formatEUR(fastestGrowing.delta)}</div>
              </div>
            ) : (<div className="tag">—</div>)}
          </div>
        </div>

        <div style={{ marginTop: 12 }} className="tag">
          Waarom is schuld belangrijk? Staatsschuld beïnvloedt rentes, inflatie en de stabiliteit van de EU-economie.
        </div>
      </section>

      <QuickList
        items={quickItems}
        initialCount={8}
        strings={{
          title: "Snellijst",
          showAll: "Alles tonen",
          showLess: "Minder tonen",
          rising: "↑ stijgt",
          falling: "↓ daalt",
          flat: "→ gelijk",
          more: "meer",
        }}
      />
    </main>
  );
}
