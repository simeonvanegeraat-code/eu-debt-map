// app/methodology/page.jsx

export const runtime = "nodejs";

/* =======================
   SEO / Open Graph
======================= */
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/methodology";
  const title = "Methodology • EU Debt Map";
  const description =
    "Exactly how EU Debt Map sources Eurostat data, transforms it, and computes the live per-second estimate for each EU-27 country.";

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
      description:
        "Data source (Eurostat), selection filters, data conversion, and the interpolation used to power the live debt ticker.",
      url: `${base}${path}`,
      siteName: "EU Debt Map",
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  };
}

/* =======================
   Presentational helpers
======================= */
function Section({ title, children }) {
  return (
    <section className="card" style={{ gridColumn: "1 / -1", display: "grid", gap: 10 }}>
      {title ? <h2 style={{ margin: 0 }}>{title}</h2> : null}
      {children}
    </section>
  );
}

function H3({ children }) {
  return <h3 style={{ margin: "6px 0 0" }}>{children}</h3>;
}

function Dl({ rows }) {
  return (
    <dl
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: "6px 12px",
        margin: 0,
      }}
    >
      {rows.map(([k, v]) => (
        <Fragment key={k}>
          <dt className="mono tag">{k}</dt>
          <dd style={{ margin: 0 }}>{v}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

function Callout({ tone = "info", children, title }) {
  const tones = {
    info: { bg: "#f8fafc", bd: "#e5e7eb", fg: "#0b1220" },
    warn: { bg: "#fff7ed", bd: "#fed7aa", fg: "#7c2d12" },
    ok: { bg: "#ecfdf5", bd: "#bbf7d0", fg: "#064e3b" },
  };
  const t = tones[tone] || tones.info;
  return (
    <div
      style={{
        background: t.bg,
        border: `1px solid ${t.bd}`,
        borderRadius: 12,
        padding: 12,
        color: t.fg,
      }}
    >
      {title ? <div className="tag" style={{ marginBottom: 6 }}>{title}</div> : null}
      <div>{children}</div>
    </div>
  );
}

function Code({ title, children }) {
  return (
    <div
      aria-label={title || "Code"}
      style={{
        background: "#0b1220",
        color: "#cbd5e1",
        border: "1px solid #1f2b3a",
        borderRadius: 12,
        padding: 12,
      }}
    >
      {title ? <div className="tag" style={{ marginBottom: 8 }}>{title}</div> : null}
      <pre className="mono" style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.5 }}>
        {children}
      </pre>
    </div>
  );
}

import { Fragment } from "react";

/* =======================
   Page
======================= */
export default function MethodologyPage() {
  const todayISO = new Date().toISOString().slice(0, 10);

  // JSON-LD: FAQ + Dataset (beide kort & to-the-point)
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which dataset powers EU Debt Map?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Eurostat gov_10q_ggdebt (quarterly, general government S.13, gross debt GD, unit MIO_EUR). We use all EU-27 member states.",
        },
      },
      {
        "@type": "Question",
        name: "How is the live per-second number computed?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "We take the latest two quarters per country, compute the difference, divide by the seconds between the two reference dates (per-second rate), interpolate within the last two quarters, and extrapolate after the last reference date using that rate.",
        },
      },
      {
        "@type": "Question",
        name: "When do numbers update?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Shortly after Eurostat publishes new quarterly values. Our build fetches fresh data and regenerates the pages.",
        },
      },
    ],
  };

  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Eurostat gov_10q_ggdebt (EU-27)",
    description:
      "General government gross debt per country (quarterly). Used by EU Debt Map to compute live estimates.",
    creator: { "@type": "Organization", name: "Eurostat" },
    license: "https://ec.europa.eu/eurostat/about/policies/copyright",
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl:
          "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt?lang=EN",
      },
    ],
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }} />

      {/* HERO / TL;DR */}
      <Section title="Methodology">
        <p className="tag" style={{ margin: 0 }}>
          How we go from Eurostat tables to a clean, fast, and transparent live ticker for all EU-27 countries.
        </p>

        <Callout tone="ok" title="TL;DR">
          <ul style={{ margin: 0 }}>
            <li>
              <strong>Source:</strong> Eurostat <code className="mono">gov_10q_ggdebt</code> (quarterly; S.13, GD, unit MIO_EUR).
            </li>
            <li>
              <strong>Keep:</strong> the <em>latest two quarters</em> per country (value & reference date).
            </li>
            <li>
              <strong>Compute:</strong> per-second rate from the difference and seconds between those quarters.
            </li>
            <li>
              <strong>Render:</strong> within the last two quarters → linear interpolation; after last reference → linear extrapolation.
            </li>
            <li>
              <strong>Safeguards:</strong> clamp extreme per-second outliers; fall back gracefully if a quarter is missing.
            </li>
          </ul>
        </Callout>

        <div className="tag" style={{ marginTop: 6 }}>Method last updated: {todayISO}</div>
      </Section>

      {/* DATA SOURCE */}
      <Section title="Official data source">
        <p style={{ margin: 0 }}>
          EU Debt Map uses Eurostat’s quarterly dataset <strong>gov_10q_ggdebt</strong>{" "}
          (general government gross debt under the Maastricht definition).
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          <a
            className="btn"
            href="https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt?lang=EN"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open API (JSON)
          </a>
          <a
            className="btn"
            href="https://ec.europa.eu/eurostat/en/web/products-datasets/-/GOV_10Q_GGDEBT"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dataset page
          </a>
          <a className="btn" href="/about">About the project</a>
        </div>

        <H3>Selection filters</H3>
        <Dl
          rows={[
            ["freq", "Q (quarterly)"],
            ["sector", "S13 (general government)"],
            ["na_item", "GD (gross debt)"],
            ["unit", "MIO_EUR (we convert to euro × 1,000,000)"],
            ["geo", "EU-27 member states (Eurostat uses EL for Greece)"],
          ]}
        />
      </Section>

      {/* TRANSFORMATION */}
      <Section title="Transformation & storage">
        <p style={{ margin: 0 }}>
          We fetch once per build and derive a tiny per-country record. That keeps pages fast and the method auditable.
        </p>

        <Dl
          rows={[
            ["Step 1", "Read JSON → filter to EU-27 and required keys."],
            ["Step 2", "Values in MIO_EUR → multiply by 1,000,000 (euro)."],
            ["Step 3", "For each country keep the latest two quarters (value + ISO reference date)."],
            ["Step 4", "Compute per-second rate = Δ(value) / Δ(seconds). Clamp outliers."],
          ]}
        />

        <Callout tone="info" title="Why only two quarters?">
          For a live directional signal we only need the most recent trend. This keeps the UI predictable, avoids hidden
          model assumptions, and makes verification easy.
        </Callout>
      </Section>

      {/* INTERPOLATION */}
      <Section title="Live ticker: interpolation & extrapolation">
        <p style={{ margin: 0 }}>
          Inside the range of the last two reference dates we linearly interpolate. After the most recent reference date
          we linearly extrapolate using the per-second rate.
        </p>

        <Code title="Pseudocode">
{`rate_per_second = (last_value_eur - prev_value_eur) / (last_ts - prev_ts)

estimate(now) =
  if now <= last_ts:
    prev_value_eur + (last_value_eur - prev_value_eur) * ((now - prev_ts) / (last_ts - prev_ts))
  else:
    last_value_eur + rate_per_second * (now - last_ts)

// safeguards
if abs(rate_per_second) > MAX_ALLOWED_RATE: clamp to MAX_ALLOWED_RATE
if prev quarter missing: show last_value_eur (no ticking)
`}
        </Code>

        <Callout tone="warn" title="Important caveats">
          <ul style={{ margin: 0 }}>
            <li>Quarterly data → intra-quarter movement is approximated as linear.</li>
            <li>If a country misses a prior quarter, we display a flat line until the next release.</li>
            <li>Minor rounding differences vs. national sources may occur.</li>
          </ul>
        </Callout>
      </Section>

      {/* REPRODUCIBILITY */}
      <Section title="Reproducibility">
        <p style={{ margin: 0 }}>
          You can reproduce our inputs directly with Eurostat’s API. Below is a minimal example call (English, JSON).
          Adjust the <code className="mono">geo</code> parameters for specific countries.
        </p>

        <Code title="Example Eurostat API call">
{`https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt
  ?lang=EN
  &format=JSON
  &freq=Q
  &sector=S13
  &na_item=GD
  &unit=MIO_EUR
  &geo=FR&geo=DE&geo=IT   // add EU-27 codes as needed
`}
        </Code>

        <p className="tag" style={{ margin: 0 }}>
          We track all transforms in code and re-fetch on new Eurostat releases so pages regenerate with fresh values.
        </p>
      </Section>

      {/* RELATED */}
      <Section title="Related pages">
        <p style={{ margin: 0 }}>
          Want the concepts behind the numbers? See{" "}
          <a href="/debt">What is Government Debt?</a>, visit the{" "}
          <a href="/">interactive EU map</a>, or read our{" "}
          <a href="/articles">articles & analysis</a>.
        </p>
      </Section>
    </main>
  );
}
