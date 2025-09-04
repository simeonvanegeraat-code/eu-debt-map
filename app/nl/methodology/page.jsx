// app/nl/methodology/page.jsx

export const metadata = {
  title: "Methodologie • EU Debt Map",
  description:
    "Hoe EU Debt Map gegevens over staatsschuld voor de EU-27 haalt, verwerkt en interpoleert.",
  openGraph: {
    title: "Methodologie • EU Debt Map",
    description:
      "Databron, filters, conversie en de live-teller-interpolatie van EU Debt Map.",
    url: "https://eudebtmap.com/nl/methodology",
    siteName: "EU Debt Map",
    type: "article",
  },
  metadataBase: new URL("https://eudebtmap.com"),
  alternates: {
    canonical: "https://eudebtmap.com/nl/methodology",
    languages: {
      en: "https://eudebtmap.com/methodology",
      nl: "https://eudebtmap.com/nl/methodology",
      de: "https://eudebtmap.com/de/methodology",
      fr: "https://eudebtmap.com/fr/methodology",
      "x-default": "https://eudebtmap.com/methodology",
    },
  },
};

// Presentational helpers (server-friendly)
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
    <div style={{ background: "#0b1220", border: "1px solid #1f2b3a", borderRadius: 12, padding: 12 }} aria-label={title || "Codevoorbeeld"}>
      {title && <div className="tag" style={{ marginBottom: 8 }}>{title}</div>}
      <pre className="mono" style={{ whiteSpace: "pre-wrap", margin: 0, lineHeight: 1.5, fontSize: 13 }}>{children}</pre>
    </div>
  );
}

export default function MethodologyNL() {
  const todayISO = new Date().toISOString().slice(0, 10);

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      {/* Header / TL;DR */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2 style={{ marginTop: 0 }}>Methodologie</h2>
        <p style={{ margin: 0 }}>
          Op deze pagina leggen we de databron, selectie-filters en de eenvoudige
          interpolatie uit die we gebruiken om een live schatting van
          staatsschuld voor de EU-27 te tonen.
        </p>
        <ul style={{ marginTop: 10 }}>
          <li>Bron: Eurostat, kwartaalreeks voor de algemene overheid (S.13).</li>
          <li>We bewaren de <strong>laatste twee kwartalen</strong> per land en berekenen een €/s-snelheid.</li>
          <li>Updates verschijnen zodra Eurostat nieuwe kwartalen publiceert.</li>
        </ul>
        <div className="tag" style={{ marginTop: 6 }}>
          Laatst bijgewerkt: {todayISO}
        </div>
      </section>

      {/* Official source */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Officiële bron</h3>
        <p style={{ marginTop: 0 }}>
          We gebruiken de Eurostat-kwartaalreeks <strong>gov_10q_ggdebt</strong>
          {" "} (bruto overheidsschuld; Maastricht-definitie).
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
          <a className="btn" href="https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt?lang=EN" target="_blank" rel="noopener noreferrer">
            Open API (gov_10q_ggdebt)
          </a>
          <a className="btn" href="https://ec.europa.eu/eurostat/en/web/products-datasets/-/GOV_10Q_GGDEBT" target="_blank" rel="noopener noreferrer">
            Datasetpagina
          </a>
          <a className="btn" href="/nl/about">Over het project</a>
        </div>

        <div style={{ marginTop: 14 }}>
          <h4 style={{ margin: "10px 0" }}>Selectie-filters</h4>
          <dl style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "6px 12px" }}>
            <dt className="mono tag">freq</dt><dd>Q (kwartaal)</dd>
            <dt className="mono tag">sector</dt><dd>S13 (algemene overheid)</dd>
            <dt className="mono tag">na_item</dt><dd>GD (bruto schuld)</dd>
            <dt className="mono tag">unit</dt><dd>MIO_EUR (omgezet naar euro ×1.000.000)</dd>
            <dt className="mono tag">geo</dt><dd>EU-27 landen (Eurostat gebruikt EL voor Griekenland)</dd>
          </dl>
        </div>
      </section>

      {/* Conversion & structure */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Conversie & structuur</h3>
        <p style={{ marginTop: 0 }}>
          Waarden komen binnen als <em>miljoen euro</em> en worden omgerekend naar euro.
          Per land bewaren we de laatste twee referentiekwartalen (waarde + ISO-datum) en
          berekenen we een veilige, begrensde €/s-snelheid.
        </p>
        <Callout type="info" title="Waarom eenvoudig?">
          We optimaliseren in de MVP voor duidelijkheid en performance. Eenvoudige
          interpolatie houdt de UI snel en de methode transparant. Uitbreiding met
          geavanceerdere modellen kan later.
        </Callout>
      </section>

      {/* Interpolation */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Live-teller (eenvoudige interpolatie)</h3>
        <CodeBlock title="Interpolatielogica (pseudocode)">
{`rate_per_second = (last_value - prev_value) / seconds_between_quarters

current_estimate(now) =
  if now <= last_quarter_end:
      // lineaire interpolatie tussen prev en last
      prev_value + (last_value - prev_value) * (now - prev_quarter_end) / (last_quarter_end - prev_quarter_end)
  else:
      // extrapoleren na het laatste punt met rate_per_second
      last_value + rate_per_second * (now - last_quarter_end)
`}
        </CodeBlock>
        <div className="tag" style={{ marginTop: 10 }}>
          Let op: extreme €/s-uitschieters worden begrensd om foutieve input te voorkomen.
        </div>
      </section>

      {/* Limitations */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Beperkingen</h3>
        <Callout type="warn">
          <ul style={{ margin: 0 }}>
            <li>Kwartaaldata → intra-kwartaalveranderingen worden geïnterpoleerd.</li>
            <li>Sommige landen hebben tijdelijk maar één recent punt → vlakke lijn tot de volgende release.</li>
            <li>Kleine afrondingsverschillen t.o.v. nationale bronnen kunnen voorkomen.</li>
          </ul>
        </Callout>
        <div className="tag" style={{ marginTop: 10 }}>
          Bron: Eurostat statistics API — dataset <em>gov_10q_ggdebt</em>.
        </div>
      </section>

      {/* Transparantie */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Transparantie</h3>
        <p style={{ marginTop: 0 }}>
          We maken grote getallen in één oogopslag begrijpelijk. Zie ook{" "}
          <a href="/nl/debt">Wat is staatsschuld?</a>,{" "}
          <a href="/nl/about">Over</a> en{" "}
          <a href="/nl/privacy">Privacy & Cookies</a>.
        </p>
      </section>

      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Welke databron gebruiken jullie?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Eurostat gov_10q_ggdebt: algemene overheid (S.13), bruto schuld (GD), kwartaal (freq=Q), waarden in miljoen euro (unit=MIO_EUR), EU-27.",
                },
              },
              {
                "@type": "Question",
                name: "Hoe wordt de live-teller berekend?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "We interpoleren lineair tussen de laatste twee kwartalen en extrapoleren na het laatste peilpunt met een €/s-snelheid afgeleid van het verschil.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
