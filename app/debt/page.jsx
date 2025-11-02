// app/debt/page.jsx
import Link from "next/link";

/** -----------------------------
 * SEO METADATA
 * ----------------------------- */
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/debt";
  const title =
    "What is Government Debt? A Plain-English Guide to Public Debt, Debt-to-GDP & Deficits • EU Debt Map";
  const description =
    "Definition of public debt in simple terms. Debt-to-GDP explained, the difference between debt and deficit, why governments borrow, and how it affects citizens — with clear visuals and FAQs.";

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
 * SMALL UI HELPERS
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
        A 50% debt-to-GDP ratio means government debt equals half of annual economic output.
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

        {/* soft gradient field */}
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
    about: [
      "government debt",
      "public debt",
      "sovereign debt",
      "debt-to-GDP",
      "difference between debt and deficit",
    ],
  };

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "What is Government Debt?",
    url: "https://www.eudebtmap.com/debt",
    description:
      "Definition of public debt, debt-to-GDP explained, and the difference between debt and deficit in plain English.",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
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
              Picture a country like a household — not because they are the same, but because the idea is familiar.
              Big decisions arrive before the money does. Rail lines, hospitals, clean energy. Borrowing spreads the
              cost over time so people can use what is built today, while the bill is paid gradually.
            </p>

            <div className="divider-soft" aria-hidden />

            <p className="tag" style={{ margin: 0, lineHeight: 1.7 }}>
              This guide gives a plain-English <strong>definition of public debt</strong>, a clear{" "}
              <strong>debt-to-GDP explained</strong> section, and the <strong>difference between debt and deficit</strong>.
              Along the way, we show how policy and the economy move the numbers — and where to find live figures.
            </p>

            <p className="tag" style={{ marginTop: 8 }}>
              Prefer the visual overview?{" "}
              <Link href="/" className="btn" style={{ padding: "6px 10px", marginLeft: 6 }}>
                Explore the EU live map →
              </Link>
            </p>
          </div>
        </header>
      </section>

      {/* ================= ARTICLE ================= */}
      <article className="card section" style={{ gridColumn: "1 / -1" }}>
        {/* Section: Definition */}
        <section>
          <h2 className="article-title">Definition of Public Debt</h2>
          <p className="article-body">
            Public debt (also called <em>government debt</em> or <em>sovereign debt</em>) is the running
            total of what a government owes because of past borrowing. Think of it as a balance that changes
            every year: when the budget runs a deficit, debt grows; when there is a surplus, debt can shrink.
          </p>

          <div className="tag" role="note" style={{ marginTop: 8 }}>
            <strong>Plain-English definition.</strong> Government debt is money that a state has borrowed
            and still needs to repay, usually by issuing bonds to investors.
          </div>

          <h3 className="article-subtitle" style={{ marginTop: 14 }}>Debt-to-GDP explained</h3>
          <p>
            We measure debt in currency and as a share of the economy via the{" "}
            <Term title="Government debt as a percentage of annual economic output">debt-to-GDP ratio</Term>.
            The ratio puts large numbers into context.
          </p>
          <p>
            If GDP is <strong>€1 trillion</strong> and government debt is <strong>€500 billion</strong>,
            debt-to-GDP is <strong>50%</strong>.
          </p>
          <DebtMeter value={50} />

          <div className="tag" style={{ marginTop: 10 }}>
            <strong>Key takeaway.</strong> The same debt level can be sustainable in a large, growing
            economy and risky in a small, shrinking one. Context matters.
          </div>
        </section>

        {/* Section: Debt vs Deficit */}
        <section>
          <h2 className="article-title">Debt vs Deficit: What’s the Difference?</h2>
          <p>
            <strong>Debt</strong> is the stock — the total outstanding amount. A{" "}
            <strong>deficit</strong> is the flow — the yearly shortfall when spending exceeds revenue.
            Deficits add to debt; surpluses can reduce it.
          </p>

          <div className="card" style={{ marginTop: 10 }}>
            <h3 style={{ marginTop: 8, marginBottom: 6 }}>Myth vs fact</h3>
            <ul className="tag" style={{ display: "grid", gap: 6 }}>
              <li><strong>Myth:</strong> Debt and deficit are the same thing.</li>
              <li><strong>Fact:</strong> The deficit is one year of budget balance; debt is the running total.</li>
            </ul>
          </div>

          <p className="tag" style={{ marginTop: 8 }}>
            Want a deeper dive? Read our short explainer:{" "}
            <Link href="/debt-vs-deficit">Debt vs Deficit</Link>.
          </p>
        </section>

        {/* Section: Why governments borrow */}
        <section>
          <h2 className="article-title">Reasons Governments Borrow</h2>
          <p className="article-body">
            Borrowing isn’t only plugging holes. It is how countries finance projects that outlast a single
            budget and how they cushion shocks when the economy stumbles.
          </p>
          <h3>Investment that pays out over decades</h3>
          <ul>
            <li>Transport, schools, hospitals, digital and energy networks</li>
            <li>Benefits arrive for years, so long-term finance fits the timeline</li>
          </ul>
          <h3>Stabilising when shocks hit</h3>
          <ul>
            <li>Recessions or disasters can cut revenue while costs rise</li>
            <li>Debt smooths the gap so essential services continue</li>
          </ul>

          <div className="tag" style={{ marginTop: 8 }}>
            <strong>Quick example.</strong> During a downturn, tax income falls but unemployment support rises.
            Borrowing bridges the timing gap so support arrives when it is needed most.
          </div>
        </section>

        {/* Section: How debt changes over time */}
        <section>
          <h2 className="article-title">How Debt Changes Over Time</h2>
          <p>
            Three forces drive the path of the <strong>debt-to-GDP ratio</strong>. You can think of them as
            levers policy makers can push or pull — some directly, some only partly.
          </p>
          <ol>
            <li>
              <strong>Primary balance</strong> — the budget before interest. Surpluses push debt down;
              deficits push it up.
            </li>
            <li>
              <strong>Growth vs interest (r–g)</strong> — when{" "}
              <Term title="Nominal GDP growth (g)">g</Term> outpaces{" "}
              <Term title="Average effective interest rate on public debt (r)">r</Term>, the ratio tends to stabilise or fall.
            </li>
            <li>
              <strong>One-off measures</strong> — bank rescues, asset sales, inflation shocks or FX moves.
            </li>
          </ol>

          <RGDiagram />

          <div className="tag" style={{ marginTop: 10 }}>
            <strong>Rule of thumb.</strong> Healthy growth and manageable interest costs make it easier
            to keep debt on a stable path.
          </div>

          <p className="tag" style={{ marginTop: 10 }}>
            Methodological details: <Link href="/methodology">how we estimate and update figures</Link>.
          </p>
        </section>

        {/* Section: Impact on citizens */}
        <section>
          <h2 className="article-title">How Government Debt Impacts Citizens</h2>
          <p className="article-body">
            Debt affects everyday life less through the headline number and more through its side effects.
          </p>
          <h3>Interest costs and fiscal space</h3>
          <ul>
            <li>Money paid in interest cannot fund schools, healthcare or tax cuts</li>
            <li>Lower interest bills mean more room to invest or respond to shocks</li>
          </ul>
          <h3>Rules that aim for stability</h3>
          <ul>
            <li>
              In the EU, debt and deficits are monitored to keep public finances sustainable. See the{" "}
              <Link href="/stability-and-growth-pact">Stability and Growth Pact</Link>.
            </li>
          </ul>

          <div className="card" style={{ marginTop: 10 }}>
            <h3 style={{ marginTop: 8, marginBottom: 6 }}>In one minute</h3>
            <ul className="tag" style={{ display: "grid", gap: 6 }}>
              <li>Debt is the stock; deficit is the yearly flow</li>
              <li>Debt-to-GDP helps compare countries of different size</li>
              <li>Path depends on the primary balance, growth and interest, plus one-offs</li>
            </ul>
          </div>
        </section>

        {/* Section: FAQ */}
        <section>
          <h2 className="article-title">FAQ</h2>

          <details className="debt-faq">
            <summary>Who lends to governments?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Mostly investors who buy government bonds — banks, pension funds, insurers — and sometimes
              other countries or institutions.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Is there a safe level of debt?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              No single number fits all. In the EU, <strong>60% of GDP</strong> is often used as a guide,
              but the right level depends on growth, interest rates, demographics and policy.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Where can I see current figures?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Use the{" "}
              <Link href="/" className="btn" style={{ padding: "2px 8px" }}>
                EU live map
              </Link>
              {" "}and click a country for a ticking estimate based on the latest reference dates.
            </p>
          </details>

          <p className="tag" style={{ marginTop: 10 }}>
            Sources: Eurostat (government finance statistics) and national finance ministries. Educational overview; not investment advice.
          </p>

          <div className="cta card" style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/" className="btn">View the live EU debt map →</Link>
            <Link href="/debt-to-gdp" className="btn">Debt-to-GDP explained →</Link>
            <Link href="/methodology" className="btn">Methodology →</Link>
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
            <li><Link href="/debt-to-gdp">Debt-to-GDP ratio explained</Link></li>
            <li><Link href="/debt-vs-deficit">Debt vs Deficit</Link></li>
            <li><Link href="/stability-and-growth-pact">The EU Stability and Growth Pact</Link></li>
            <li><Link href="/methodology">Methodology</Link></li>
          </ul>
        </div>

        <div className="card" style={{ margin: 0 }}>
          <h3 style={{ marginTop: 0 }}>Popular country pages</h3>
          <p className="tag" style={{ marginTop: 6 }}>Explore the live ticker and trend for each country.</p>
          <div className="tag" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/country/DE" className="nav-link">DE Germany</Link>
            <Link href="/country/FR" className="nav-link">FR France</Link>
            <Link href="/country/IT" className="nav-link">IT Italy</Link>
            <Link href="/country/ES" className="nav-link">ES Spain</Link>
            <Link href="/country/NL" className="nav-link">NL Netherlands</Link>
          </div>
        </div>

        <div className="card" style={{ margin: 0, display: "grid", gap: 8, alignContent: "start" }}>
          <h3 style={{ marginTop: 0 }}>Quick actions</h3>
          <Link href="/" className="btn">See the EU map</Link>
          <Link href="/methodology" className="btn">Methodology</Link>
        </div>
      </section>
    </main>
  );
}
