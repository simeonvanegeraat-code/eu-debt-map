// app/de/methodology/page.jsx
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/methodology";
  const title = "Methodik • EU Debt Map";
  const description =
    "Wie EU Debt Map Daten sammelt, umwandelt und interpoliert, um Live-Schätzungen der EU-27-Staatsverschuldung zu zeigen.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}/de${path}`,
      languages: {
        en: `${base}${path}`,
        nl: `${base}/nl${path}`,
        de: `${base}/de${path}`,
        fr: `${base}/fr${path}`,
        "x-default": `${base}${path}`,
      },
    },
    openGraph: {
      title,
      description:
        "Datenquelle, Filter, Umrechnung und die Live-Ticker-Interpolation, die von EU Debt Map verwendet wird.",
      url: `${base}/de${path}`,
      siteName: "EU Debt Map",
      type: "article",
    },
  };
}

function Callout({ type = "info", title, children }) {
  const styles = {
    info: { bg: "#0b1220", bd: "#1f2b3a" },
    warn: { bg: "#1b1320", bd: "#3a2637" },
    ok:   { bg: "#0b2b1d", bd: "#1f5d43" },
  }[type] || { bg: "#0b1220", bd: "#1f2b3a" };

  return (
    <div style={{ background: styles.bg, border: `1px solid ${styles.bd}`, borderRadius: 12, padding: 12 }}>
      {title && <div className="tag" style={{ marginBottom: 8 }}>{title}</div>}
      <div>{children}</div>
    </div>
  );
}

export default function MethodologyPageDE() {
  const todayISO = new Date().toISOString().slice(0, 10);
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Welche Datenquelle wird verwendet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Eurostat gov_10q_ggdebt: allgemeine Regierung (S.13), Bruttoschuld (GD), vierteljährlich (freq=Q), Werte in Millionen Euro (unit=MIO_EUR), EU-27.",
        },
      },
      {
        "@type": "Question",
        name: "Wie wird der Live-Ticker berechnet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Wir interpolieren linear zwischen den letzten zwei Quartalen und extrapolieren danach mit einer pro-Sekunden-Rate.",
        },
      },
    ],
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2>Methodik</h2>
        <p>
          Auf dieser Seite erklären wir die Datenquelle, Filter und die einfache Interpolation,
          die wir verwenden, um eine Live-Schätzung der Staatsverschuldung der EU-27 anzuzeigen.
        </p>
        <ul>
          <li>Quelle: Eurostat-Vierteljahresreihe für allgemeine Regierung (S.13).</li>
          <li>Wir speichern die <strong>letzten zwei Quartale</strong> pro Land und berechnen eine Rate pro Sekunde.</li>
          <li>Aktualisierungen erfolgen, wenn Eurostat neue Daten veröffentlicht.</li>
        </ul>
        <div className="tag">Zuletzt aktualisiert: {todayISO}</div>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3>Offizielle Quelle</h3>
        <p>
          Wir verwenden Eurostats Datensatz <strong>gov_10q_ggdebt</strong> (Bruttoschuld, Maastricht-Definition).
        </p>
        <a className="btn" href="https://ec.europa.eu/eurostat/en/web/products-datasets/-/GOV_10Q_GGDEBT" target="_blank">Zur Eurostat-Datasetseite</a>
        <div className="tag" style={{ marginTop: 10 }}>
          Geo: EU-27 Länder (Eurostat verwendet <strong>EL</strong> für Griechenland)
        </div>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3>Warum eine einfache Methode?</h3>
        <Callout type="info">
          Wir optimieren für Klarheit und Leistung. Eine einfache lineare Interpolation
          hält die Seite schnell und die Methode transparent.
        </Callout>
      </section>
    </main>
  );
}
