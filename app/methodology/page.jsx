// app/methodology/page.jsx
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/methodology";
  const title = "Methodology • EU Debt Map";
  const description =
    "How EU Debt Map sources, transforms and interpolates government debt data for the EU-27.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}${path}`,
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
      description: "Data source, filters, conversion and the live ticker interpolation used by EU Debt Map.",
      url: `${base}${path}`,
      siteName: "EU Debt Map",
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

// --- lightweight presentational helpers (no client code) ---
function Callout({ type = "info", title, children }) {
  const styles = {
    info: { bg: "#0b1220", bd: "#1f2b3a" },
    warn: { bg: "#1b1320", bd: "#3a2637" },
    ok: { bg: "#0b2b1d", bd: "#1f5d43" },
  }[type] || { bg: "#0b1220", bd: "#1f2b3a" };

  return (
    <div
      style={{
        background: styles.bg,
        border: `1px solid ${styles.bd}`,
        borderRadius: 12,
        padding: 12,
      }}
    >
      {title && (
        <div className="tag" style={{ marginBottom: 8 }}>
          {title}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

function CodeBlock({ title, children }) {
  return (
    <div
      style={{
        background: "#0b1220",
        border: "1px solid #1f2b3a",
        borderRadius: 12,
        padding: 12,
      }}
      aria-label={title || "Code sample"}
    >
      {title && (
        <div className="tag" style={{ marginBottom: 8 }}>
          {title}
        </div>
      )}
      <pre
        className="mono"
        style={{
          whiteSpace: "pre-wrap",
          margin: 0,
          lineHeight: 1.5,
          fontSize: 13,
        }}
      >
        {children}
      </pre>
    </div>
  );
}

export default function MethodologyPage() {
  const todayISO = new Date().toISOString().slice(0, 10);

  // JSON-LD: FAQ (blijft zoals je had, maar we zetten hem hier ook neer voor context)
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which data source is used?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Eurostat gov_10q_ggdebt: general government (S.13), gross debt (GD), quarterly (freq=Q), values in million euro (unit=MIO_EUR), EU-27.",
        },
      },
      {
        "@type": "Question",
        name: "How is the live ticker calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "We linearly interpolate between the last two quarters and, after the last reference date, extrapolate using a per-second rate derived from their difference.",
        },
      },
    ],
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Header / TL;DR */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2 style={{ marginTop: 0 }}>Methodology</h2>
        <p style={{ margin: 0 }}>
          This page explains the data source, selection filters and the simple
          interpolation we use to show a live estimate of government debt for
          the EU-27.
        </p>
        <ul style={{ marginTop: 10 }}>
          <li>Source: Eurostat quarterly series for general government (S.13).</li>
          <li>
            We store the <strong>latest two quarters</strong> per country and
            compute a per-second rate.
          </li>
          <li>Updates roll out when Eurostat publishes new quarters.</li>
        </ul>
        <div className="tag" style={{ marginTop: 6 }}>
          Method last updated: {todayISO}
        </div>
      </section>

      {/* Official source */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Official source</h3>
        <p style={{ marginTop: 0 }}>
          We use Eurostat’s quarterly dataset <strong>gov_10q_ggdebt</strong>{" "}
          (general government gross debt; Maastricht definition).
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
          <a
            className="btn"
            href="https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt?lang=EN"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open API (gov_10q_ggdebt)
          </a>
          <a
            className="btn"
            href="https://ec.europa.eu/eurostat/en/web/products-datasets/-/GOV_10Q_GGDEBT"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dataset page
          </a>
          <a className="btn" href="/about" aria-label="Learn more about the project">
            About the project
          </a>
        </div>

        {/* Filters as definition list */}
        <div style={{ marginTop: 14 }}>
          <h4 style={{ margin: "10px 0" }}>Selection filters</h4>
          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "160px 1fr",
              gap: "6px 12px",
            }}
          >
            <dt className="mono tag">freq</dt>
            <dd>Q (quarterly)</dd>

            <dt className="mono tag">sector</dt>
            <dd>S13 (general government)</dd>

            <dt className="mono tag">na_item</dt>
            <dd>GD (gross debt)</dd>

            <dt className="mono tag">unit</dt>
            <dd>MIO_EUR (converted to euro ×1,000,000)</dd>

            <dt className="mono tag">geo</dt>
            <dd>EU-27 countries (Eurostat uses EL for Greece)</dd>
          </dl>
        </div>
      </section>

      {/* Conversion & structure */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Conversion & structure</h3>
        <p style={{ marginTop: 0 }}>
          Values arrive as <em>million euro</em> and are converted to euro. For
          each country we persist the latest two reference quarters (value + ISO
          date) and compute a safe, clamped per-second rate.
        </p>
        <Callout type="info" title="Why a simple approach?">
          We optimise for clarity and performance in the MVP. A simple
          interpolation keeps the UI fast and the method transparent. More
          advanced modelling (e.g. seasonality or monthly series) can be added
          later.
        </Callout>
      </section>

      {/* Interpolation / live ticker */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Live ticker (simple interpolation)</h3>

        <CodeBlock title="Interpolation logic (pseudocode)">
{`rate_per_second = (last_value - prev_value) / seconds_between_quarters

current_estimate(now) =
  if now <= last_quarter_end:
      // linear interpolation between prev and last
      prev_value + (last_value - prev_value) * (now - prev_quarter_end) / (last_quarter_end - prev_quarter_end)
  else:
      // extrapolate after last using rate_per_second
      last_value + rate_per_second * (now - last_quarter_end)
`}
        </CodeBlock>

        <div className="tag" style={{ marginTop: 10 }}>
          Note: extreme €/s outliers are clamped to guard against bad inputs.
        </div>
      </section>

      {/* Limitations */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Limitations</h3>
        <Callout type="warn">
          <ul style={{ margin: 0 }}>
            <li>Quarterly data → intra-quarter changes are interpolated.</li>
            <li>
              Some countries may have only one recent quarter → displays a flat
              line until the next release.
            </li>
            <li>Minor rounding differences vs. national sources may occur.</li>
          </ul>
        </Callout>
        <div className="tag" style={{ marginTop: 10 }}>
          Source: Eurostat statistics API — dataset <em>gov_10q_ggdebt</em>.
        </div>
      </section>

      {/* Transparency / related */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h3 style={{ marginTop: 0 }}>Transparency</h3>
        <p style={{ marginTop: 0 }}>
          Our goal is to make big numbers understandable at a glance. See also{" "}
          <a href="/debt">What is Government Debt?</a>,{" "}
          <a href="/about">About</a> and{" "}
          <a href="/privacy">Privacy & Cookies</a>.
        </p>
      </section>
    </main>
  );
}
