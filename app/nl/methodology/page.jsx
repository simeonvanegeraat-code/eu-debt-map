// app/nl/methodology/page.jsx
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/methodology";
  const title = "Methodologie • EU Debt Map";
  const description =
    "Hoe EU Debt Map data verzamelt, omzet en interpoleert voor een live schatting van staatsschuld in de EU-27.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}/nl${path}`,
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
        "Datasets, filters, conversie en de live-teller-interpolatie die EU Debt Map gebruikt.",
      url: `${base}/nl${path}`,
      siteName: "EU Debt Map",
      type: "article",
    },
    twitter: { card: "summary", title, description },
  };
}

// Presentational helpers
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

function CodeBlock({ title, children }) {
  return (
    <div style={{ background: "#0b1220", border: "1px solid #1f2b3a", borderRadius: 12, padding: 12 }} aria-label={title || "Code sample"}>
      {title && <div className="tag" style={{ marginBottom: 8 }}>{title}</div>}
      <pre className="mono" style={{ whiteSpace: "pre-wrap", margin: 0, lineHeight: 1.5, fontSize: 13 }}>{children}</pre>
    </div>
  );
}

export default function MethodologyPageNL() {
  const todayISO = new Date().toISOString().slice(0, 10);
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Welke bron gebruiken jullie?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Eurostat gov_10q_ggdebt: general government (S.13), gross debt (GD), kwartaal (freq=Q), waarden in miljoen euro (unit=MIO_EUR), EU-27.",
        },
      },
      {
        "@type": "Question",
        name: "Hoe werkt de live-teller?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We interpoleren lineair tussen de laatste twee kwartalen en extrapoleren na de laatste referentiedatum met een per-seconde tempo.",
        },
      },
    ],
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Header / TL;DR */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2 style={{ marginTop: 0 }}>Methodologie</h2>
        <p style={{ margin: 0 }}>
          Op deze pagina leggen we de datasource, selectie-filters en de eenvoudige interpolatie uit
          die we gebruiken om een live schatting van overheidsschuld voor de EU-27 te tonen.
        </p>
        <ul style={{ marginTop: 10 }}>
          <li>Bron: Eurostat kwartaalreeks voor algemene overheid (S.13).</li>
          <li>We bewaren per land de <strong>twee meest recente kwartalen</strong> en berekenen een tempo per seconde.</li>
          <li>Updates verschijnen wanneer Eurostat nieuwe kwartalen publiceert.</li>
        </ul>
        <div className="tag" style={{ marginTop: 6 }}>Methode laatst bijgewerkt: {todayISO}</div>
      </section>

      {/* Officiële bron */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Officiële bron</h3>
        <p style={{ marginTop: 0 }}>
          We gebruiken Eurostats kwartaaldataset <strong>gov_10q_ggdebt</strong> (bruto overheidsschuld; Maastricht-definitie).
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
          <a className="btn" href="https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt?lang=EN" target="_blank" rel="noopener noreferrer">
            Open API (gov_10q_ggdebt)
          </a>
          <a className="btn" href="https://ec.europa.eu/eurostat/en/web/products-datasets/-/GOV_10Q_GGDEBT" target="_blank" rel="noopener noreferrer">
            Datasetpagina
          </a>
          <a className="btn" href="/nl/about" aria-label="Meer over het project">Over het project</a>
        </div>

        <div style={{ marginTop: 14 }}>
          <h4 style={{ margin: "10px 0" }}>Selectie-filters</h4>
          <dl style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "6px 12px" }}>
            <dt className="mono tag">freq</dt><dd>Q (kwartaal)</dd>
            <dt className="mono tag">sector</dt><dd>S13 (algemene overheid)</dd>
            <dt className="mono tag">na_item</dt><dd>GD (brutoschuld)</dd>
            <dt className="mono tag">unit</dt><dd>MIO_EUR (omgezet naar euro ×1.000.000)</dd>
            <dt className="mono tag">geo</dt><dd>EU-27 (Eurostat gebruikt <strong>EL</strong> voor Griekenland)</dd>
          </dl>
        </div>
      </section>

      {/* Conversie & structuur */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Conversie & structuur</h3>
        <p style={{ marginTop: 0 }}>
          Waarden komen binnen als <em>miljoen euro</em> en worden omgerekend naar euro.
          Per land bewaren we de laatste twee referentiekwartalen (waarde + ISO-datum)
          en berekenen we een veilig, begrensd tempo per seconde.
        </p>
        <Callout type="info" title="Waarom zo simpel?">
          Voor de MVP optimaliseren we op duidelijkheid en performance.
          De simpele interpolatie houdt de UI snel en de methode transparant.
          Geavanceerdere modellen (bijv. seizoenseffect of maandreeksen) kunnen later.
        </Callout>
      </section>

      {/* Interpolatie / live-teller */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Live-teller (eenvoudige interpolatie)</h3>
        <CodeBlock title="Interpolatielogica (pseudocode)">
{`rate_per_second = (last_value - prev_value) / seconds_between_quarters

current_estimate(now) =
  if now <= last_quarter_end:
      prev_value + (last_value - prev_value) * (now - prev_quarter_end) / (last_quarter_end - prev_quarter_end)
  else:
      last_value + rate_per_second * (now - last_quarter_end)
`}
        </CodeBlock>
        <div className="tag" style={{ marginTop: 10 }}>
          Let op: extreme €/s-uitschieters worden begrensd om foutieve input te dempen.
        </div>
      </section>

      {/* Beperkingen */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Beperkingen</h3>
        <Callout type="warn">
          <ul style={{ margin: 0 }}>
            <li>Kwartaaldata → intra-kwartaal schommelingen worden geïnterpoleerd.</li>
            <li>Soms maar één recent kwartaal → vlak verloop tot de volgende release.</li>
            <li>Kleine afrondingsverschillen t.o.v. nationale bronnen kunnen voorkomen.</li>
          </ul>
        </Callout>
        <div className="tag" style={{ marginTop: 10 }}>
          Bron: Eurostat-API — dataset <em>gov_10q_ggdebt</em>.
        </div>
      </section>

      {/* Transparantie */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Transparantie</h3>
        <p style={{ marginTop: 0 }}>
          We willen grote cijfers in één oogopslag begrijpelijk maken. Zie ook{" "}
          <a href="/nl/debt">Wat is staatsschuld?</a>,{" "}
          <a href="/nl/about">Over</a> en{" "}
          <a href="/privacy">Privacy & Cookies</a>.
        </p>
      </section>
    </main>
  );
}
