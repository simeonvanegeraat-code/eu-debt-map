// app/de/methodology/page.jsx

export const metadata = {
  title: "Methodik • EU Debt Map",
  description:
    "Wie EU Debt Map Staatsverschuldungsdaten für die EU-27 bezieht, verarbeitet und interpoliert.",
  openGraph: {
    title: "Methodik • EU Debt Map",
    description:
      "Datenquelle, Filter, Konvertierung und die Live-Ticker-Interpolation von EU Debt Map.",
    url: "https://eudebtmap.com/de/methodology",
    siteName: "EU Debt Map",
    type: "article",
  },
  metadataBase: new URL("https://eudebtmap.com"),
  alternates: {
    canonical: "https://eudebtmap.com/de/methodology",
    languages: {
      en: "https://eudebtmap.com/methodology",
      nl: "https://eudebtmap.com/nl/methodology",
      de: "https://eudebtmap.com/de/methodology",
      fr: "https://eudebtmap.com/fr/methodology",
      "x-default": "https://eudebtmap.com/methodology",
    },
  },
};

function Callout({ type = "info", title, children }) {
  const styles = {
    info: { bg: "#0b1220", bd: "#1f2b3a" },
    warn: { bg: "#1b1320", bd: "#3a2637" },
    ok: { bg: "#0b2b1d", bd: "#1f5d43" },
  }[type] || { bg: "#0b1220", bd: "#1f2b3a" };

  return (
    <div style={{ background: styles.bg, border: `1px solid ${styles.bd}`, borderRadius: 12, padding: 12 }}>
      {title && <div className="tag" style={{ marginBottom: 8 }}>{title}</div>}
      <div>{children}</div>
    </div>
  );
}

function CodeBlock({ title, children }) {
  return (
    <div style={{ background: "#0b1220", border: "1px solid #1f2b3a", borderRadius: 12, padding: 12 }} aria-label={title || "Codebeispiel"}>
      {title && <div className="tag" style={{ marginBottom: 8 }}>{title}</div>}
      <pre className="mono" style={{ whiteSpace: "pre-wrap", margin: 0, lineHeight: 1.5, fontSize: 13 }}>{children}</pre>
    </div>
  );
}

export default function MethodologyDE() {
  const todayISO = new Date().toISOString().slice(0, 10);

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2 style={{ marginTop: 0 }}>Methodik</h2>
        <p style={{ margin: 0 }}>
          Hier erläutern wir Datenquelle, Auswahlfilter und die einfache
          Interpolation, mit der wir eine Live-Schätzung der Staatsschulden
          für die EU-27 anzeigen.
        </p>
        <ul style={{ marginTop: 10 }}>
          <li>Quelle: Eurostat, Quartalsreihe für den Sektor Staat (S.13).</li>
          <li>Wir speichern die <strong>letzten zwei Quartale</strong> je Land und berechnen eine €/s-Rate.</li>
          <li>Aktualisierungen erfolgen, sobald Eurostat neue Quartale veröffentlicht.</li>
        </ul>
        <div className="tag" style={{ marginTop: 6 }}>
          Zuletzt aktualisiert: {todayISO}
        </div>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Offizielle Quelle</h3>
        <p style={{ marginTop: 0 }}>
          Wir nutzen Eurostats Quartals-Datensatz <strong>gov_10q_ggdebt</strong>
          {" "} (Bruttostaatsschuld; Maastricht-Definition).
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
          <a className="btn" href="https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt?lang=EN" target="_blank" rel="noopener noreferrer">
            API öffnen (gov_10q_ggdebt)
          </a>
          <a className="btn" href="https://ec.europa.eu/eurostat/en/web/products-datasets/-/GOV_10Q_GGDEBT" target="_blank" rel="noopener noreferrer">
            Datensatzseite
          </a>
          <a className="btn" href="/de/about">Über das Projekt</a>
        </div>

        <div style={{ marginTop: 14 }}>
          <h4 style={{ margin: "10px 0" }}>Auswahlfilter</h4>
          <dl style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "6px 12px" }}>
            <dt className="mono tag">freq</dt><dd>Q (quartalsweise)</dd>
            <dt className="mono tag">sector</dt><dd>S13 (Staat, allgemeine Regierung)</dd>
            <dt className="mono tag">na_item</dt><dd>GD (Bruttoschuld)</dd>
            <dt className="mono tag">unit</dt><dd>MIO_EUR (umgerechnet in Euro ×1.000.000)</dd>
            <dt className="mono tag">geo</dt><dd>EU-27 Länder (Eurostat nutzt EL für Griechenland)</dd>
          </dl>
        </div>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Konvertierung & Struktur</h3>
        <p style={{ marginTop: 0 }}>
          Werte kommen als <em>Millionen Euro</em> und werden in Euro konvertiert.
          Pro Land speichern wir die letzten zwei Referenzquartale (Wert + ISO-Datum)
          und berechnen eine sichere, begrenzte €/s-Rate.
        </p>
        <Callout type="info" title="Warum einfach?">
          Für das MVP priorisieren wir Klarheit und Performance. Eine schlichte
          Interpolation hält die UI schnell und die Methode transparent. Spätere
          Erweiterungen sind möglich.
        </Callout>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Live-Ticker (einfache Interpolation)</h3>
        <CodeBlock title="Interpolationslogik (Pseudocode)">
{`rate_per_second = (last_value - prev_value) / seconds_between_quarters

current_estimate(now) =
  if now <= last_quarter_end:
      // lineare Interpolation zwischen prev und last
      prev_value + (last_value - prev_value) * (now - prev_quarter_end) / (last_quarter_end - prev_quarter_end)
  else:
      // nach dem letzten Punkt mit rate_per_second extrapolieren
      last_value + rate_per_second * (now - last_quarter_end)
`}
        </CodeBlock>
        <div className="tag" style={{ marginTop: 10 }}>
          Hinweis: Extreme €/s-Ausreißer werden zur Qualitätssicherung begrenzt.
        </div>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Einschränkungen</h3>
        <Callout type="warn">
          <ul style={{ margin: 0 }}>
            <li>Quartalsdaten → intraquartale Veränderungen werden interpoliert.</li>
            <li>Manche Länder haben zeitweise nur einen aktuellen Punkt → flache Anzeige bis zur nächsten Veröffentlichung.</li>
            <li>Kleine Rundungsunterschiede gegenüber nationalen Quellen sind möglich.</li>
          </ul>
        </Callout>
        <div className="tag" style={{ marginTop: 10 }}>
          Quelle: Eurostat-API — Datensatz <em>gov_10q_ggdebt</em>.
        </div>
      </section>

      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Transparenz</h3>
        <p style={{ marginTop: 0 }}>
          Unser Ziel ist es, große Zahlen auf einen Blick verständlich zu machen.
          Siehe auch <a href="/de/debt">Was ist Staatsschuld?</a>,{" "}
          <a href="/de/about">Über</a> und{" "}
          <a href="/de/privacy">Datenschutz & Cookies</a>.
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Welche Datenquelle wird verwendet?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Eurostat gov_10q_ggdebt: allgemeine Regierung (S.13), Bruttoschuld (GD), vierteljährlich (freq=Q), Werte in Millionen Euro (unit=MIO_EUR), EU-27.",
                },
              },
              {
                "@type": "Question",
                name: "Wie wird der Live-Ticker berechnet?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Lineare Interpolation zwischen den letzten zwei Quartalen; nach dem letzten Referenzdatum Extrapolation mit einer aus der Differenz abgeleiteten €/s-Rate.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
