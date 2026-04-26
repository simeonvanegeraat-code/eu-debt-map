// app/methodology/page.jsx
import Link from "next/link";
import { countries } from "@/lib/data";
import { EUROSTAT_UPDATED_AT } from "@/lib/eurostat.debt.gen";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const PATH = "/methodology";
const METHOD_VERSION = "1.1";
const METHOD_REVIEWED = "April 2026";

export async function generateMetadata() {
  const base = new URL(SITE);
  const title = "Methodology | How EU Debt Map Calculates Live Government Debt";
  const description =
    "See how EU Debt Map uses Eurostat data to calculate live government debt estimates for all EU-27 countries, including sources, filters, formulas, limitations, and update logic.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${SITE}${PATH}`,
      languages: {
        en: `${SITE}${PATH}`,
        nl: `${SITE}/nl${PATH}`,
        de: `${SITE}/de${PATH}`,
        fr: `${SITE}/fr${PATH}`,
        "x-default": `${SITE}${PATH}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE}${PATH}`,
      siteName: "EU Debt Map",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
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

function formatDateTime(value) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

function getLatestReferencePeriod() {
  const periods = (countries || [])
    .map((country) => country?.official_latest_time || country?.last_date)
    .filter(Boolean);

  if (periods.length === 0) return "Latest Eurostat data";

  return [...new Set(periods)].sort().at(-1);
}

function Section({ eyebrow, title, intro, children, id }) {
  return (
    <section id={id} className="method-card">
      {eyebrow ? <div className="method-eyebrow">{eyebrow}</div> : null}
      {title ? <h2>{title}</h2> : null}
      {intro ? <p className="method-section-intro">{intro}</p> : null}
      {children}
    </section>
  );
}

function MiniStat({ label, value, note }) {
  return (
    <div className="method-stat">
      <div className="method-stat-label">{label}</div>
      <div className="method-stat-value">{value}</div>
      {note ? <div className="method-stat-note">{note}</div> : null}
    </div>
  );
}

function StepCard({ number, title, children }) {
  return (
    <div className="method-step">
      <div className="method-step-number">{number}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

function Callout({ title, children, tone = "info" }) {
  return (
    <div className={`method-callout method-callout-${tone}`}>
      {title ? <strong>{title}</strong> : null}
      <div>{children}</div>
    </div>
  );
}

function FilterTable() {
  const rows = [
    ["Dataset", "gov_10q_ggdebt"],
    ["Frequency", "Q, quarterly"],
    ["Sector", "S13, general government"],
    ["Debt item", "GD, gross debt"],
    ["Unit", "MIO_EUR, converted to euro by multiplying by 1,000,000"],
    ["Countries", "EU-27 member states only"],
    ["Greece code", "Eurostat uses EL, EU Debt Map displays GR"],
    ["Lookback", "lastTimePeriod=8, then we select the latest two available quarters per country"],
  ];

  return (
    <div className="method-table-wrap">
      <table className="method-table">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <th>{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ title, children }) {
  return (
    <div className="method-code" aria-label={title || "Code example"}>
      {title ? <div className="method-code-title">{title}</div> : null}
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}

function RelatedCard({ href, title, text }) {
  return (
    <Link href={href} className="method-related-card">
      <strong>{title}</strong>
      <span>{text}</span>
    </Link>
  );
}

export default function MethodologyPage() {
  const validCountries = (countries || []).filter(
    (country) => country && country.last_value_eur > 0 && country.prev_value_eur > 0
  );

  const latestReferencePeriod = getLatestReferencePeriod();
  const dataGeneratedAt = formatDateTime(EUROSTAT_UPDATED_AT);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which data source powers EU Debt Map?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "EU Debt Map uses Eurostat gov_10q_ggdebt, a quarterly dataset for general government gross debt. Values are filtered to the EU-27 member states and converted from millions of euros to euros.",
        },
      },
      {
        "@type": "Question",
        name: "Is the live debt ticker official real-time data?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The underlying values come from official Eurostat data, but the live ticker is an educational estimate based on the latest two available quarterly data points.",
        },
      },
      {
        "@type": "Question",
        name: "How is the per-second debt estimate calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For each country, EU Debt Map takes the latest two available quarters, calculates the difference in debt, divides it by the number of seconds between the two reference dates, and uses that rate for the live estimate.",
        },
      },
      {
        "@type": "Question",
        name: "When does EU Debt Map update its numbers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The site updates after fresh Eurostat data is fetched during the build process. Eurostat government debt data is quarterly, so the official input data does not change every second.",
        },
      },
    ],
  };

  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Eurostat gov_10q_ggdebt EU-27 government debt data",
    description:
      "Quarterly general government gross debt data used by EU Debt Map to estimate live government debt movement for EU-27 countries.",
    creator: {
      "@type": "Organization",
      name: "Eurostat",
    },
    license: "https://ec.europa.eu/eurostat/about/policies/copyright",
    url: "https://ec.europa.eu/eurostat/en/web/products-datasets/-/GOV_10Q_GGDEBT",
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl:
          "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt?lang=EN",
      },
    ],
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Methodology",
        item: `${SITE}${PATH}`,
      },
    ],
  };

  return (
    <main className="method-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />

      <section className="method-hero">
        <div className="method-hero-copy">
          <div className="method-kicker">Methodology</div>

          <h1>How EU Debt Map calculates live government debt estimates</h1>

          <p className="method-lede">
            EU Debt Map starts with official Eurostat quarterly debt data. The live counters are then
            estimated from the latest available trend, so visitors can understand the direction and
            scale of government debt across the EU-27.
          </p>

          <Callout tone="warning" title="Important">
            <p>
              The live ticker is an educational estimate. It is not an official real-time statistic.
              The official source remains Eurostat.
            </p>
          </Callout>

          <div className="method-hero-actions">
            <Link href="/" className="method-button method-button-primary">
              Open the live map
            </Link>
            <Link href="/debt" className="method-button method-button-secondary">
              Read the debt explainer
            </Link>
          </div>
        </div>

        <aside className="method-hero-panel" aria-label="Method summary">
          <MiniStat label="Source" value="Eurostat" note="Quarterly government debt data" />
          <MiniStat label="Coverage" value="EU-27" note={`${validCountries.length} countries with usable data`} />
          <MiniStat label="Latest reference" value={latestReferencePeriod} note="Most recent period in the generated data" />
          <MiniStat label="Data generated" value={dataGeneratedAt} note={`Method version ${METHOD_VERSION}`} />
        </aside>
      </section>

      <Section
        eyebrow="Quick answer"
        title="What you are looking at"
        intro="The number on each country page is a live estimate built from official quarterly debt data. It keeps moving because we convert the most recent change into a per-second rate."
      >
        <div className="method-steps">
          <StepCard number="1" title="Fetch official data">
            We use Eurostat’s quarterly government debt dataset and request the latest available periods
            for all EU-27 countries.
          </StepCard>

          <StepCard number="2" title="Select the latest trend">
            For each country, we keep the latest two quarters with valid values. This creates a recent
            debt movement, not a long-term forecast.
          </StepCard>

          <StepCard number="3" title="Convert to euros">
            Eurostat reports the selected series in millions of euros. EU Debt Map converts this to euros
            for the large live counters.
          </StepCard>

          <StepCard number="4" title="Estimate per second">
            The difference between the two latest quarters is divided by the seconds between the two
            reference dates.
          </StepCard>
        </div>
      </Section>

      <Section
        eyebrow="Source"
        title="Official data source"
        intro="EU Debt Map uses Eurostat gov_10q_ggdebt: quarterly general government gross debt under the Maastricht definition."
      >
        <div className="method-link-row">
          <a
            className="method-button method-button-secondary"
            href="https://ec.europa.eu/eurostat/en/web/products-datasets/-/GOV_10Q_GGDEBT"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Eurostat dataset
          </a>

          <a
            className="method-button method-button-secondary"
            href="https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt?lang=EN"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open API JSON
          </a>
        </div>

        <FilterTable />

        <Callout title="Why Eurostat?" tone="success">
          <p>
            Eurostat gives a consistent, comparable data source across EU member states. That matters
            because national debt figures can differ in timing, format, definitions, and publication
            rhythm.
          </p>
        </Callout>
      </Section>

      <Section
        eyebrow="Calculation"
        title="How the live estimate is calculated"
        intro="The calculation is intentionally simple. It avoids hidden economic assumptions and makes the numbers easy to audit."
      >
        <div className="method-formula-card">
          <div>
            <span className="method-formula-label">Per-second rate</span>
            <strong>(latest debt - previous debt) / seconds between reference dates</strong>
          </div>
          <div>
            <span className="method-formula-label">Live estimate after latest quarter</span>
            <strong>latest debt + per-second rate × seconds since latest reference date</strong>
          </div>
        </div>

        <div className="method-example">
          <h3>Simple example</h3>
          <p>
            Suppose a country’s debt increases by €7.8 billion between two quarter-end dates. A
            quarter is roughly 7.8 million seconds. In that simplified case, the live estimate would
            move by about €1,000 per second.
          </p>
          <p>
            If the change is negative, the counter moves down. If the latest two values are the same,
            the counter stays flat.
          </p>
        </div>

        <CodeBlock title="Pseudocode">
{`previous_value_eur = debt value at previous quarter end
latest_value_eur   = debt value at latest quarter end

seconds_between_dates =
  latest_reference_timestamp - previous_reference_timestamp

rate_per_second =
  (latest_value_eur - previous_value_eur) / seconds_between_dates

if now <= latest_reference_timestamp:
  estimate =
    previous_value_eur +
    (latest_value_eur - previous_value_eur) *
    ((now - previous_reference_timestamp) / seconds_between_dates)

if now > latest_reference_timestamp:
  estimate =
    latest_value_eur +
    rate_per_second * (now - latest_reference_timestamp)`}
        </CodeBlock>
      </Section>

      <Section
        eyebrow="Safeguards"
        title="How we prevent misleading ticker behaviour"
        intro="Live counters can look precise, but the input data is quarterly. The site therefore uses a few conservative safeguards."
      >
        <div className="method-grid-two">
          <Callout title="Outlier protection" tone="info">
            <p>
              The app caps extreme per-second values to prevent runaway counters if a source value,
              date, or generated field is abnormal.
            </p>
          </Callout>

          <Callout title="Missing previous quarter" tone="info">
            <p>
              If only one recent valid value is available, the estimate is treated as flat until more
              data is available.
            </p>
          </Callout>

          <Callout title="Quarter-end dates" tone="info">
            <p>
              Quarter labels such as 2025-Q3 are converted to quarter-end dates so the per-second
              movement has a consistent time span.
            </p>
          </Callout>

          <Callout title="EU-27 only" tone="info">
            <p>
              The site intentionally excludes non-EU countries to keep the scope clear and comparable.
            </p>
          </Callout>
        </div>
      </Section>

      <Section
        eyebrow="Limitations"
        title="What the live ticker cannot tell you"
        intro="The site is designed for public understanding, not for official accounting, trading, forecasting, or fiscal reporting."
      >
        <div className="method-limits">
          <div>
            <h3>It is not official real-time debt</h3>
            <p>
              Governments do not publish a fully comparable live second-by-second debt number through
              Eurostat. The official data is quarterly.
            </p>
          </div>

          <div>
            <h3>It assumes a linear path</h3>
            <p>
              Debt does not actually change smoothly every second. The ticker spreads the latest
              quarterly movement evenly over time.
            </p>
          </div>

          <div>
            <h3>It focuses on gross debt</h3>
            <p>
              Gross government debt is useful for comparison, but it does not include every measure of
              fiscal strength, assets, future obligations, or budget quality.
            </p>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Updates"
        title="When the numbers change"
        intro="The live movement changes when new official Eurostat data is fetched and the site is regenerated."
      >
        <div className="method-update-box">
          <div>
            <strong>Data source refresh</strong>
            <span>
              The build script requests Eurostat data with <code>lastTimePeriod=8</code>, then selects
              the latest two available quarters per country.
            </span>
          </div>

          <div>
            <strong>Generated data file</strong>
            <span>
              Last generated: <b>{dataGeneratedAt}</b>
            </span>
          </div>

          <div>
            <strong>Method version</strong>
            <span>
              Version {METHOD_VERSION}, reviewed {METHOD_REVIEWED}
            </span>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="For technical users"
        title="Reproduce the input data"
        intro="The exact transformed values are generated during the build process. The public Eurostat API call below shows the source dataset and filters."
      >
        <CodeBlock title="Example Eurostat API call">
{`https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt
  ?lang=EN
  &format=JSON
  &freq=Q
  &sector=S13
  &na_item=GD
  &unit=MIO_EUR
  &lastTimePeriod=8
  &geo=FR
  &geo=DE
  &geo=IT`}
        </CodeBlock>

        <p className="method-muted">
          In production, EU Debt Map requests all EU-27 country codes. Eurostat uses <code>EL</code>{" "}
          for Greece, while the app displays Greece as <code>GR</code>.
        </p>
      </Section>

      <section className="method-related">
        <div className="method-related-head">
          <div>
            <div className="method-eyebrow">Next steps</div>
            <h2>Explore the numbers behind the method</h2>
          </div>
        </div>

        <div className="method-related-grid">
          <RelatedCard
            href="/"
            title="Live EU debt map"
            text="Open the interactive EU-27 map and compare countries."
          />
          <RelatedCard
            href="/debt"
            title="What is government debt?"
            text="Understand debt, deficits, bonds, and fiscal pressure."
          />
          <RelatedCard
            href="/debt-to-gdp"
            title="Debt-to-GDP"
            text="Compare debt relative to the size of each economy."
          />
          <RelatedCard
            href="/eu-debt"
            title="EU debt trends"
            text="See the broader EU movement and chart context."
          />
          <RelatedCard
            href="/country/fr"
            title="France debt"
            text="View France’s live estimate and country context."
          />
          <RelatedCard
            href="/country/de"
            title="Germany debt"
            text="View Germany’s live estimate and country context."
          />
        </div>
      </section>

      <style>{`
        .method-page {
          width: min(calc(100% - 48px), 1500px);
          max-width: 1500px;
          margin: 0 auto;
          padding: 28px 0 56px;
          display: grid;
          gap: 18px;
          align-items: start;
        }

        .site-header .container,
        .site-header .header-inner {
          max-width: 1500px !important;
        }

        .method-hero,
        .method-card,
        .method-related {
          background: #ffffff;
          border: 1px solid rgba(203, 213, 225, 0.8);
          border-radius: 18px;
          box-shadow: 0 14px 36px rgba(15, 23, 42, 0.06);
        }

        .method-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(360px, 0.9fr);
          gap: clamp(24px, 3vw, 46px);
          padding: clamp(28px, 3vw, 44px);
          background:
            radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 36%),
            linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
        }

        .method-kicker,
        .method-eyebrow {
          color: #1d4ed8;
          font-size: 0.78rem;
          line-height: 1;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .method-hero h1 {
          max-width: 900px;
          margin: 12px 0 0;
          color: #0f172a;
          font-family: var(--font-display);
          font-size: clamp(2.45rem, 4.8vw, 5rem);
          line-height: 0.95;
          letter-spacing: -0.065em;
        }

        .method-lede {
          max-width: 780px;
          margin: 18px 0 0;
          color: #334b6b;
          font-size: clamp(1.03rem, 0.7vw + 0.9rem, 1.2rem);
          line-height: 1.62;
        }

        .method-hero-actions,
        .method-link-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 18px;
        }

        .method-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 18px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 850;
          font-size: 0.92rem;
          transition:
            transform 0.12s ease,
            box-shadow 0.18s ease,
            background 0.18s ease,
            border-color 0.18s ease;
        }

        .method-button:hover {
          transform: translateY(-1px);
          text-decoration: none;
        }

        .method-button-primary {
          color: #ffffff;
          background: linear-gradient(180deg, #1764e8, #0f55d4);
          border: 1px solid #0f55d4;
          box-shadow: 0 14px 26px rgba(37, 99, 235, 0.22);
        }

        .method-button-secondary {
          color: #101827;
          background: #ffffff;
          border: 1px solid #d8e1ec;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
        }

        .method-hero-panel {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          align-self: start;
        }

        .method-stat {
          min-width: 0;
          padding: 16px;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid #dbe5f0;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.045);
        }

        .method-stat-label {
          color: #64748b;
          font-size: 0.74rem;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .method-stat-value {
          margin-top: 9px;
          color: #0f172a;
          font-size: clamp(1.25rem, 1.8vw, 1.75rem);
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: -0.04em;
          overflow-wrap: anywhere;
        }

        .method-stat-note {
          margin-top: 8px;
          color: #52647b;
          font-size: 0.8rem;
          line-height: 1.35;
        }

        .method-card,
        .method-related {
          padding: 24px;
          display: grid;
          gap: 16px;
        }

        .method-card h2,
        .method-related h2 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(1.45rem, 1.5vw, 2rem);
          line-height: 1.08;
          letter-spacing: -0.035em;
        }

        .method-section-intro {
          max-width: 880px;
          margin: -4px 0 0;
          color: #52647b;
          font-size: 0.98rem;
          line-height: 1.65;
        }

        .method-steps {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .method-step {
          min-width: 0;
          padding: 16px;
          border-radius: 16px;
          border: 1px solid #dbe5f0;
          background: #f8fbff;
        }

        .method-step-number {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border-radius: 999px;
          color: #ffffff;
          background: #1d4ed8;
          font-weight: 900;
          font-size: 0.9rem;
          margin-bottom: 12px;
        }

        .method-step h3,
        .method-example h3,
        .method-limits h3 {
          margin: 0;
          color: #0f172a;
          font-size: 1rem;
          letter-spacing: -0.02em;
        }

        .method-step p,
        .method-example p,
        .method-limits p,
        .method-callout p {
          margin: 7px 0 0;
          color: #52647b;
          font-size: 0.9rem;
          line-height: 1.55;
        }

        .method-callout {
          padding: 14px 15px;
          border-radius: 14px;
          border: 1px solid #dbe5f0;
          background: #f8fafc;
        }

        .method-callout strong {
          display: block;
          margin-bottom: 4px;
          color: #0f172a;
          font-size: 0.88rem;
        }

        .method-callout-warning {
          margin-top: 18px;
          border-color: #fed7aa;
          background: #fff7ed;
        }

        .method-callout-warning strong,
        .method-callout-warning p {
          color: #7c2d12;
        }

        .method-callout-success {
          border-color: #bbf7d0;
          background: #ecfdf5;
        }

        .method-callout-success strong,
        .method-callout-success p {
          color: #064e3b;
        }

        .method-table-wrap {
          width: 100%;
          overflow-x: auto;
          border-radius: 14px;
          border: 1px solid #dbe5f0;
        }

        .method-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 680px;
          background: #ffffff;
        }

        .method-table th,
        .method-table td {
          padding: 13px 14px;
          border-bottom: 1px solid #edf2f7;
          text-align: left;
          vertical-align: top;
          font-size: 0.9rem;
          line-height: 1.45;
        }

        .method-table tr:last-child th,
        .method-table tr:last-child td {
          border-bottom: 0;
        }

        .method-table th {
          width: 190px;
          color: #0f172a;
          background: #f8fafc;
          font-weight: 850;
        }

        .method-table td {
          color: #52647b;
        }

        .method-formula-card {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .method-formula-card > div {
          padding: 16px;
          border-radius: 16px;
          border: 1px solid #bfdbfe;
          background: #eff6ff;
        }

        .method-formula-label {
          display: block;
          color: #1d4ed8;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .method-formula-card strong {
          display: block;
          color: #0f172a;
          font-size: 1rem;
          line-height: 1.45;
        }

        .method-example {
          padding: 16px;
          border-radius: 16px;
          border: 1px solid #dbe5f0;
          background: #ffffff;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
        }

        .method-code {
          overflow: hidden;
          border-radius: 16px;
          border: 1px solid #1f2b3a;
          background: #0b1220;
        }

        .method-code-title {
          padding: 12px 14px;
          border-bottom: 1px solid #1f2b3a;
          color: #93c5fd;
          font-size: 0.78rem;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .method-code pre {
          margin: 0;
          padding: 16px;
          overflow-x: auto;
          white-space: pre;
        }

        .method-code code {
          color: #dbeafe;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            "Liberation Mono",
            "Courier New",
            monospace;
          font-size: 0.86rem;
          line-height: 1.62;
        }

        .method-grid-two {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .method-limits {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .method-limits > div {
          padding: 16px;
          border-radius: 16px;
          border: 1px solid #fecaca;
          background: #fff7f7;
        }

        .method-limits p {
          color: #7f1d1d;
        }

        .method-update-box {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .method-update-box > div {
          display: grid;
          gap: 7px;
          padding: 16px;
          border-radius: 16px;
          border: 1px solid #dbe5f0;
          background: #f8fafc;
        }

        .method-update-box strong {
          color: #0f172a;
          font-size: 0.92rem;
        }

        .method-update-box span {
          color: #52647b;
          font-size: 0.88rem;
          line-height: 1.5;
        }

        .method-muted {
          margin: 0;
          color: #64748b;
          font-size: 0.88rem;
          line-height: 1.55;
        }

        .method-muted code,
        .method-update-box code {
          padding: 2px 5px;
          border-radius: 6px;
          background: #eef2ff;
          color: #1d4ed8;
          font-size: 0.82em;
        }

        .method-related-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .method-related-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .method-related-card {
          display: grid;
          gap: 7px;
          padding: 16px;
          border-radius: 16px;
          border: 1px solid #dbe5f0;
          background: #ffffff;
          color: inherit;
          text-decoration: none;
          transition:
            transform 0.12s ease,
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .method-related-card:hover {
          transform: translateY(-2px);
          border-color: #bfdbfe;
          box-shadow: 0 18px 34px rgba(37, 99, 235, 0.1);
          text-decoration: none;
        }

        .method-related-card strong {
          color: #0f172a;
          font-size: 0.95rem;
        }

        .method-related-card span {
          color: #52647b;
          font-size: 0.86rem;
          line-height: 1.45;
        }

        @media (max-width: 1180px) {
          .method-hero {
            grid-template-columns: 1fr;
          }

          .method-hero-panel {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .method-steps {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .method-related-grid,
          .method-limits,
          .method-update-box {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 820px) {
          .method-page {
            width: min(calc(100% - 28px), 1500px);
            padding: 18px 0 42px;
            gap: 14px;
          }

          .method-hero,
          .method-card,
          .method-related {
            padding: 18px;
            border-radius: 16px;
          }

          .method-hero h1 {
            font-size: clamp(2.45rem, 12vw, 4rem);
          }

          .method-hero-panel,
          .method-steps,
          .method-formula-card,
          .method-grid-two,
          .method-related-grid,
          .method-limits,
          .method-update-box {
            grid-template-columns: 1fr;
          }

          .method-hero-actions,
          .method-link-row {
            flex-direction: column;
            align-items: stretch;
          }

          .method-button {
            width: 100%;
          }

          .method-table {
            min-width: 620px;
          }

          .method-code pre {
            white-space: pre-wrap;
          }
        }

        @media (max-width: 560px) {
          .method-hero,
          .method-card,
          .method-related {
            padding: 16px;
          }

          .method-hero h1 {
            letter-spacing: -0.06em;
          }

          .method-stat,
          .method-step,
          .method-example,
          .method-limits > div,
          .method-update-box > div,
          .method-related-card {
            padding: 14px;
          }
        }
      `}</style>
    </main>
  );
}