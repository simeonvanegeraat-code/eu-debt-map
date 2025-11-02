// app/debt/page.jsx
import Link from "next/link";
import Image from "next/image";

/** -----------------------------
 * SEO METADATA
 * ----------------------------- */
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/debt";
  const title =
    "What is Government Debt? Definition, Debt-to-GDP & Deficit Explained • EU Debt Map";
  const description =
    "Learn what government/public debt means, how the debt-to-GDP ratio works, and the difference between debt and deficit — with clear examples, inline SVG visuals and FAQs.";

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
      description,
      type: "article",
      url: `${base}${path}`,
      siteName: "EU Debt Map",
      images: [
        {
          url: "/og/debt-explainer-1200x630.jpg",
          width: 1200,
          height: 630,
          alt: "EU debt explainer hero",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og/debt-explainer-1200x630.jpg"],
    },
    robots: { index: true, follow: true, "max-image-preview": "large" },
  };
}

/** -----------------------------
 * UI HELPERS
 * ----------------------------- */
function Term({ children, title }) {
  return (
    <abbr
      title={title}
      style={{
        textDecoration: "none",
        borderBottom: "1px dotted var(--border)",
        cursor: "help",
      }}
    >
      {children}
    </abbr>
  );
}

/** -----------------------------
 * INLINE SVG: Debt-to-GDP meter
 * ----------------------------- */
function DebtMeter({ value = 50 }) {
  const width = 320;
  const height = 18;
  const pct = Math.max(0, Math.min(100, value));
  const filled = (width * pct) / 100;

  return (
    <figure style={{ margin: "8px 0 0 0" }}>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={`Debt-to-GDP ${pct}%`}
        style={{ display: "block" }}
      >
        <rect x="0" y="0" width={width} height={height} rx="9" fill="#e5e7eb" />
        <rect x="0" y="0" width={filled} height={height} rx="9" />
        <text
          x={width - 6}
          y={height - 5}
          textAnchor="end"
          fontSize="12"
          fill="#111827"
          aria-hidden="true"
        >
          {pct}%
        </text>
      </svg>
      <figcaption className="tag" style={{ marginTop: 6 }}>
        Illustration: a 50% debt-to-GDP ratio means debt equals half of annual output.
      </figcaption>
    </figure>
  );
}

/** -----------------------------
 * INLINE SVG: r–g diagram
 * r = effective interest rate on debt, g = nominal GDP growth
 * ----------------------------- */
function RGDiagram() {
  const w = 360;
  const h = 200;

  return (
    <figure style={{ margin: "12px 0 0 0" }}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Conceptual diagram comparing interest (r) and growth (g)"
        style={{ display: "block", maxWidth: "100%" }}
      >
        {/* axes */}
        <line x1="40" y1="10" x2="40" y2={h - 30} stroke="#9ca3af" />
        <line x1="40" y1={h - 30} x2={w - 10} y2={h - 30} stroke="#9ca3af" />

        {/* r line */}
        <path
          d={`M 40 ${h - 80} L ${w - 10} ${h - 60}`}
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
        />
        <text x={w - 14} y={h - 62} textAnchor="end" fontSize="12">
          r
        </text>

        {/* g line */}
        <path
          d={`M 40 ${h - 40} L ${w - 10} ${h - 100}`}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
        />
        <text x={w - 14} y={h - 102} textAnchor="end" fontSize="12">
          g
        </text>

        {/* shaded outcome zones */}
        <rect
          x="41"
          y="11"
          width={w - 52}
          height={h - 42}
          fill="url(#fade)"
          opacity="0.08"
        />
        <defs>
          <linearGradient id="fade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* labels */}
        <text x="44" y="20" fontSize="11" fill="#111827">
          Debt ratio tends to fall when g &gt; r
        </text>
        <text x="44" y={h - 12} fontSize="11" fill="#6b7280">
          Time
        </text>
        <text
          x="12"
          y="22"
          transform={`rotate(-90 12,22)`}
          fontSize="11"
          fill="#6b7280"
        >
          Level
        </text>
      </svg>
      <figcaption className="tag" style={{ marginTop: 6 }}>
        If <strong>g</strong> (growth) exceeds <strong>r</strong> (interest), debt-to-GDP can stabilise or fall.
      </figcaption>
    </figure>
  );
}

export default function DebtExplainer() {
  /** -----------------------------
   * STRUCTURED DATA (JSON-LD)
   * ----------------------------- */
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "What is Government Debt?",
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    mainEntityOfPage: "https://www.eudebtmap.com/debt",
    about: ["government debt", "public debt", "sovereign debt", "debt-to-GDP", "deficit vs debt"],
  };

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "What is Government Debt?",
    url: "https://www.eudebtmap.com/debt",
    description:
      "Learn what government/public debt means, debt-to-GDP explained, and the difference between debt and deficit.",
    inLanguage: "en",
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.eudebtmap.com/" },
      { "@type": "ListItem", position: 2, name: "Debt Explainer", item: "https://www.eudebtmap.com/debt" },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the difference between debt and deficit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Debt is the outstanding stock from past borrowing. A deficit is a yearly shortfall when spending exceeds revenue. Deficits add to debt; surpluses can reduce it.",
        },
      },
      {
        "@type": "Question",
        name: "Is there a safe level of government debt?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No single number fits all. In the EU, 60% of GDP is a guide, but sustainability depends on growth, interest rates, demographics and policy.",
        },
      },
      {
        "@type": "Question",
        name: "Who lends to governments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mainly investors who buy government bonds: banks, pension funds, insurers and sometimes other countries or institutions.",
        },
      },
      {
        "@type": "Question",
        name: "Where can I see current figures?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use the EU map on EU Debt Map and click a country to view a live ticking estimate based on the latest reference dates.",
        },
      },
    ],
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* ================= HERO ================= */}
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <header>
          <h1
            className="hero-title"
            style={{
              fontSize: "clamp(1.8rem, 4vw + 1rem, 3rem)",
              background: "linear-gradient(90deg, #2563eb, #00875a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
            }}
          >
            What is Government Debt?
          </h1>

          <div style={{ maxWidth: "68ch" }}>
            <p className="hero-lede" style={{ marginTop: 8 }}>
              <span style={{ fontWeight: 600 }}>
                Government debt is the price of big, long-term decisions spread over time — the roads we
                drive on, the hospitals we rely on, and a buffer during crises.
              </span>
            </p>

            <div className="divider-soft" aria-hidden />

            <p className="tag" style={{ margin: 0, lineHeight: 1.7 }}>
              Countries borrow for similar reasons families do: invest today and pay back gradually. This
              page explains the{" "}
              <Term title="Government debt as a percentage of annual economic output">debt-to-GDP ratio</Term>, the{" "}
              difference between <Term title="When annual spending exceeds annual revenue">deficit</Term> and{" "}
              <Term title="Outstanding stock of past borrowing">debt</Term>, and why it matters.
            </p>

            <p className="tag" style={{ marginTop: 8 }}>
              Prefer the map?{" "}
              <Link href="/" className="btn" style={{ padding: "6px 10px", marginLeft: 6 }}>
                See the EU map →
              </Link>
            </p>
          </div>
        </header>
      </section>

      {/* ================= ARTICLE ================= */}
      <article className="card section" style={{ gridColumn: "1 / -1" }}>
        {/* Definition */}
        <section>
          <h2 className="article-title">Definition of Public Debt</h2>
          <p className="article-body">
            Public debt (also called <em>government debt</em> or <em>sovereign debt</em>) is the total
            amount a government owes to creditors as a result of past borrowing. It is usually expressed
            in currency terms and as a share of the economy via the{" "}
            <Term title="Debt divided by annual economic output">debt-to-GDP ratio</Term>.
          </p>

        {/* Debt-to-GDP inline SVG */}
          <h3 className="article-subtitle">Debt-to-GDP explained</h3>
          <p>
            The ratio puts debt in context by comparing it with what the economy produces in a year. If
            GDP is <strong>€1 trillion</strong> and government debt is <strong>€500 billion</strong>, the
            ratio is <strong>50%</strong>.
          </p>
          <DebtMeter value={50} />
        </section>

        {/* Difference debt vs deficit */}
        <section>
          <h2 className="article-title">Debt vs Deficit: What’s the Difference?</h2>
          <p>
            <strong>Debt</strong> is the outstanding stock from past borrowing. A{" "}
            <strong>deficit</strong> is a yearly shortfall when spending exceeds revenue. Deficits add to
            debt; surpluses can reduce it.
          </p>
          <p className="tag">
            See also: <Link href="/debt-vs-deficit">Debt vs Deficit explainer</Link>.
          </p>
        </section>

        {/* Reasons to borrow */}
        <section>
          <h2 className="article-title">Reasons Governments Borrow</h2>
          <p className="article-body">
            Borrowing finances projects that outlast a single budget and helps stabilise the economy when
            shocks hit.
          </p>
          <h3>Investment & infrastructure</h3>
          <ul>
            <li>Transport networks, schools, hospitals, clean energy, defence</li>
            <li>Projects with benefits over decades match long-term financing</li>
          </ul>
          <h3>Stabilising shocks</h3>
          <ul>
            <li>Recessions, disasters or pandemics can cut revenue while costs rise</li>
            <li>Debt smooths temporary gaps between spending and tax income</li>
          </ul>
        </section>

        {/* Dynamics over time with r-g diagram */}
        <section>
          <h2 className="article-title">How Debt Changes Over Time</h2>
          <p>Three forces shape the debt-to-GDP path:</p>
          <ol>
            <li>
              <strong>Primary balance</strong> — the budget before interest. Surpluses push debt down;
              deficits push it up.
            </li>
            <li>
              <strong>Growth vs interest (r–g)</strong> — if growth outpaces the interest rate on debt,
              the ratio can stabilise or fall.
            </li>
            <li>
              <strong>One-off measures</strong> — bank rescues, asset sales, inflation shocks or FX moves.
            </li>
          </ol>
          <RGDiagram />
          <p className="tag">
            Methodological details: <Link href="/methodology">how we estimate and update figures</Link>.
          </p>
        </section>

        {/* Impact on citizens */}
        <section>
          <h2 className="article-title">How Government Debt Impacts Citizens</h2>
          <h3>Interest costs and fiscal space</h3>
          <ul>
            <li>Money spent on interest cannot fund schools or healthcare</li>
            <li>Lower interest bills leave more room to invest or respond to shocks</li>
          </ul>
          <h3>EU rules and sustainability</h3>
          <ul>
            <li>
              The EU monitors debt and deficits to keep public finances sustainable. Read the{" "}
              <Link href="/stability-and-growth-pact">Stability and Growth Pact overview</Link>.
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="article-title">FAQ</h2>

          <details className="debt-faq">
            <summary>Who lends to governments?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Mainly investors who buy government bonds: banks, pension funds, insurers and sometimes
              other countries or institutions.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Is there a safe level of debt?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              No single number fits all. In the EU, <strong>60% of GDP</strong> is a guide, but
              sustainability depends on growth, interest rates, demographics and policy.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Where can I see current figures?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Use the{" "}
              <Link href="/" className="btn" style={{ padding: "2px 8px" }}>
                EU map
              </Link>{" "}
              and click a country for a live estimate based on the latest reference dates.
            </p>
          </details>

          <p className="tag" style={{ marginTop: 10 }}>
            Sources: Eurostat (government finance statistics) and national finance ministries. Educational
            overview; not investment advice.
          </p>

          <div
            className="cta card"
            style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}
          >
            <Link href="/" className="btn">
              View the live EU debt map →
            </Link>
            <Link href="/debt-to-gdp" className="btn">
              Debt-to-GDP explained →
            </Link>
            <Link href="/methodology" className="btn">
              Methodology →
            </Link>
          </div>
        </section>
      </article>

      {/* ================= EXPLORE MORE / INTERNAL LINKS ================= */}
      <section
        className="card"
        style={{
          gridColumn: "1 / -1",
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        <div className="card" style={{ margin: 0 }}>
          <h3 style={{ marginTop: 0 }}>Related explainers</h3>
          <ul className="tag" style={{ marginTop: 6 }}>
            <li>
              <Link href="/debt-to-gdp">Debt-to-GDP ratio explained</Link>
            </li>
            <li>
              <Link href="/debt-vs-deficit">Debt vs Deficit</Link>
            </li>
            <li>
              <Link href="/stability-and-growth-pact">The EU Stability and Growth Pact</Link>
            </li>
            <li>
              <Link href="/methodology">Methodology</Link>
            </li>
          </ul>
        </div>

        <div className="card" style={{ margin: 0 }}>
          <h3 style={{ marginTop: 0 }}>Popular country pages</h3>
          <p className="tag" style={{ marginTop: 6 }}>
            Explore the live ticker and trend for each country.
          </p>
          <div className="tag" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/country/DE" className="nav-link">
              DE Germany
            </Link>
            <Link href="/country/FR" className="nav-link">
              FR France
            </Link>
            <Link href="/country/IT" className="nav-link">
              IT Italy
            </Link>
            <Link href="/country/ES" className="nav-link">
              ES Spain
            </Link>
            <Link href="/country/NL" className="nav-link">
              NL Netherlands
            </Link>
          </div>
        </div>

        <div className="card" style={{ margin: 0, display: "grid", gap: 8, alignContent: "start" }}>
          <h3 style={{ marginTop: 0 }}>Quick actions</h3>
          <Link href="/" className="btn">
            See the EU map
          </Link>
          <Link href="/methodology" className="btn">
            Methodology
          </Link>
        </div>
      </section>
    </main>
  );
}
