// app/debt-vs-deficit/page.jsx
import Link from "next/link";

/** -----------------------------
 * SEO METADATA (EN)
 * ----------------------------- */
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/debt-vs-deficit";
  const title = "Debt vs. Deficit Explained — The Difference in 5 Minutes • EU Debt Map";
  const description =
    "Understand the key difference between government debt (stock) and deficit (flow). A clear, visual explanation with examples, analogies, FAQ, and links to related topics like debt-to-GDP and the Stability and Growth Pact.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}${path}`,
      languages: {
        en: `${base}${path}`,
        nl: `${base}/nl/debt-vs-deficit`,
        de: `${base}/de/debt-vs-deficit`,
        fr: `${base}/fr/debt-vs-deficit`,
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
          alt: "Debt vs Deficit infographic",
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
 * INLINE SVG: Flow vs Stock Visual
 * ----------------------------- */
function StockFlowSVG() {
  const w = 420,
    h = 160;
  return (
    <figure style={{ marginTop: 8 }}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Deficit (flow) vs Debt (stock)"
      >
        {/* Tank (stock) */}
        <rect x="240" y="30" width="160" height="100" rx="10" fill="#e5e7eb" />
        <text x="320" y="88" textAnchor="middle" fontSize="12">
          Debt (stock)
        </text>

        {/* Inflow pipe (deficit) */}
        <line x1="40" y1="60" x2="220" y2="60" stroke="#10b981" strokeWidth="6" />
        <polygon points="220,56 220,64 234,60" fill="#10b981" />
        <text x="40" y="50" fontSize="12" fill="#065f46">
          Deficit (annual flow)
        </text>

        {/* Outflow pipe (surplus) */}
        <line x1="320" y1="130" x2="320" y2="150" stroke="#ef4444" strokeWidth="6" />
        <text x="326" y="152" fontSize="12" fill="#7f1d1d">
          Repayment / surplus
        </text>
      </svg>
      <figcaption className="tag" style={{ marginTop: 6 }}>
        The <em>deficit</em> is a yearly flow; the <em>debt</em> is the stock that accumulates (or falls) over time.
      </figcaption>
    </figure>
  );
}

/** -----------------------------
 * MAIN PAGE
 * ----------------------------- */
export default function DebtVsDeficitEN() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Debt vs. Deficit Explained — The Difference in 5 Minutes",
    inLanguage: "en",
    mainEntityOfPage: "https://www.eudebtmap.com/debt-vs-deficit",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    about: [
      "government debt",
      "budget deficit",
      "debt vs deficit",
      "public finance",
      "debt-to-GDP ratio",
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
          text: "The deficit is the annual shortfall between government spending and revenue. The debt is the total stock accumulated from all past deficits and surpluses.",
        },
      },
      {
        "@type": "Question",
        name: "Can debt fall without a budget surplus?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. If economic growth (g) exceeds the average interest rate (r), the debt-to-GDP ratio can decline even with small deficits.",
        },
      },
      {
        "@type": "Question",
        name: "Why can debt rise even when the economy grows?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Because the primary balance may still be negative (deficit) or one-off factors like bank rescues and asset purchases increase debt faster than GDP.",
        },
      },
    ],
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.eudebtmap.com" },
      { "@type": "ListItem", position: 2, name: "Debt vs Deficit", item: "https://www.eudebtmap.com/debt-vs-deficit" },
    ],
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />

      {/* HERO */}
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
            Debt vs. Deficit — The Difference in 5 Minutes
          </h1>

          <div style={{ maxWidth: "68ch" }}>
            <p className="hero-lede" style={{ marginTop: 8 }}>
              Quick summary: <strong>deficit</strong> is what a government adds this year;{" "}
              <strong>debt</strong> is what it already owes. Understanding the two helps make sense
              of economic headlines and EU fiscal rules.
            </p>
          </div>
        </header>
      </section>

      {/* ARTICLE */}
      <article className="card section" style={{ gridColumn: "1 / -1" }}>
        <section>
          <h2 className="article-title">The core concept: flow vs. stock</h2>
          <p>
            A <strong>budget deficit</strong> is a <em>flow</em>: the yearly gap between spending and
            revenue. <strong>Public debt</strong> is a <em>stock</em>: the total amount accumulated
            through time. Each deficit fills the debt “tank”; each surplus drains it slightly.
          </p>
          <StockFlowSVG />
        </section>

        <section>
          <h2 className="article-title">A relatable analogy</h2>
          <p>
            Think of your credit card. The <strong>deficit</strong> is what you added to your balance
            this month. The <strong>debt</strong> is your total outstanding balance — what you still
            owe after all past months.
          </p>
        </section>

        <section>
          <h2 className="article-title">Why the distinction matters</h2>
          <ul>
            <li>
              <strong>Short vs. long term:</strong> Deficits are one-year snapshots; debt is the
              long-term accumulation.
            </li>
            <li>
              <strong>Interest burden:</strong> More debt means higher interest costs and less room
              for investment.
            </li>
            <li>
              <strong>Comparability:</strong> Debt-to-GDP helps compare countries of different sizes
              fairly.
            </li>
          </ul>
          <p className="tag" style={{ marginTop: 8 }}>
            Related reading: <Link href="/debt-to-gdp">Debt-to-GDP explained</Link> and{" "}
            <Link href="/stability-and-growth-pact">The Stability and Growth Pact</Link>.
          </p>
        </section>

        <section>
          <h2 className="article-title">FAQ</h2>

          <details className="debt-faq">
            <summary>Does debt automatically fall when there’s a surplus?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Yes, a primary surplus reduces debt, but the debt ratio also depends on growth (g) and
              interest rates (r).
            </p>
          </details>

          <details className="debt-faq">
            <summary>Can the debt ratio fall even with a small deficit?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Yes, if <strong>g &gt; r</strong> — when GDP grows faster than the interest on debt.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Where can I see current country data?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Use the{" "}
              <Link href="/" className="btn" style={{ padding: "2px 8px" }}>
                EU map
              </Link>{" "}
              to view live ticking debt estimates for each country.
            </p>
          </details>

          <div
            className="cta card"
            style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}
          >
            <Link href="/" className="btn">
              View the EU map →
            </Link>
            <Link href="/debt" className="btn">
              What is Debt? →
            </Link>
            <Link href="/stability-and-growth-pact" className="btn">
              Stability & Growth Pact →
            </Link>
            <Link href="/methodology" className="btn">
              Methodology →
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
