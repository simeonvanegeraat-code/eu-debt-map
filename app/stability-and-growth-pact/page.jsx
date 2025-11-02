// app/stability-and-growth-pact/page.jsx
import Link from "next/link";

/** -----------------------------
 * SEO METADATA (EN)
 * ----------------------------- */
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/stability-and-growth-pact";
  const title = "The EU Stability and Growth Pact (SGP): basics, rules, and why it matters • EU Debt Map";
  const description =
    "A plain-English explainer of the EU’s Stability and Growth Pact (SGP): what it aims to do, how the debt and deficit rules work, the role of debt-to-GDP, and key FAQs with links to methodology and the live EU debt map.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: `${base}${path}`,
      languages: {
        en: `${base}${path}`,
        nl: `${base}/nl/stability-and-growth-pact`,
        de: `${base}/de/stability-and-growth-pact`,
        fr: `${base}/fr/stability-and-growth-pact`,
        "x-default": `${base}${path}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${base}${path}`,
      siteName: "EU Debt Map",
      images: [{ url: "/og/debt-explainer-1200x630.jpg", width: 1200, height: 630, alt: "Stability and Growth Pact" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og/debt-explainer-1200x630.jpg"] },
    robots: { index: true, follow: true, "max-image-preview": "large" },
  };
}

/** -----------------------------
 * SMALL LABEL COMPONENT
 * ----------------------------- */
function Pill({ children }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 999,
      background: "var(--muted, #f3f4f6)",
      fontSize: 12,
      marginRight: 6
    }}>
      {children}
    </span>
  );
}

export default function SgpExplainerEN() {
  // JSON-LD
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "The EU Stability and Growth Pact (SGP): basics, rules, and why it matters",
    inLanguage: "en",
    mainEntityOfPage: "https://www.eudebtmap.com/stability-and-growth-pact",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    about: ["Stability and Growth Pact", "SGP", "EU fiscal rules", "debt-to-GDP", "deficit rules"],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the goal of the SGP?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "To keep public finances sustainable in EU member states by coordinating fiscal policy around debt and deficit benchmarks.",
        },
      },
      {
        "@type": "Question",
        name: "Does the SGP mean every country must hit the same number?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No single number fits all; debt sustainability depends on each country’s path, growth, interest rates and fiscal choices.",
        },
      },
      {
        "@type": "Question",
        name: "Where can I see current debt figures?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use EU Debt Map to view a live ticking estimate per country based on the latest reference dates.",
        },
      },
    ],
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.eudebtmap.com/" },
      { "@type": "ListItem", position: 2, name: "Stability and Growth Pact", item: "https://www.eudebtmap.com/stability-and-growth-pact" },
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
          <h1 className="hero-title" style={{
            fontSize: "clamp(1.8rem, 4vw + 1rem, 3rem)",
            background: "linear-gradient(90deg, #2563eb, #00875a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}>
            The EU Stability and Growth Pact (SGP)
          </h1>
          <div style={{ maxWidth: "68ch" }}>
            <p className="hero-lede" style={{ marginTop: 8 }}>
              A plain-English explainer of what the EU’s fiscal rules try to achieve, how debt and deficit benchmarks are used,
              and why the <em>path</em> of debt matters as much as the level.
            </p>
          </div>
        </header>
      </section>

      {/* ARTICLE */}
      <article className="card section" style={{ gridColumn: "1 / -1" }}>
        <section>
          <h2 className="article-title">What the SGP tries to do</h2>
          <p>
            The Stability and Growth Pact coordinates fiscal policy across EU members so that public finances remain
            <strong> sustainable</strong>. It does this by setting common anchors for <strong>deficits</strong> and <strong>debt</strong>,
            while leaving room for national choices on how to get there.
          </p>
          <div className="tag" style={{ marginTop: 8 }}>
            In short: align incentives, reduce risks, and keep the monetary union stable.
          </div>
        </section>

        <section>
          <h2 className="article-title">Key ideas at a glance</h2>
          <p>
            Although the technical details evolve over time, three ideas show up consistently:
          </p>
          <p>
            <Pill>Debt sustainability</Pill>
            <Pill>Sound budget paths</Pill>
            <Pill>Common yardsticks</Pill>
          </p>
          <ul>
            <li><strong>Debt path matters:</strong> not just today’s level but where it’s heading.</li>
            <li><strong>Deficit discipline:</strong> keep annual gaps manageable to avoid compounding risks.</li>
            <li><strong>Comparability:</strong> shared metrics (like debt-to-GDP) help compare across countries.</li>
          </ul>
        </section>

        <section>
          <h2 className="article-title">Debt, deficit and debt-to-GDP</h2>
          <p>
            The SGP focuses on the distinction between the yearly <strong>deficit</strong> (flow) and total <strong>debt</strong> (stock).
            To compare countries of different size, debt is usually discussed as a share of the economy via the{" "}
            <strong>debt-to-GDP</strong> ratio.
          </p>
          <p className="tag" style={{ marginTop: 8 }}>
            New to these concepts? Read the primers:{" "}
            <Link href="/debt">What is Debt?</Link> · <Link href="/nl/debt-vs-deficit">Debt vs Deficit (NL)</Link> ·{" "}
            <Link href="/debt-to-gdp">Debt-to-GDP explained</Link>.
          </p>
        </section>

        <section>
          <h2 className="article-title">Why it matters for citizens</h2>
          <ul>
            <li><strong>Interest costs:</strong> money spent on interest can’t fund schools or healthcare.</li>
            <li><strong>Stability:</strong> common rules aim to lower the risk of fiscal crises.</li>
            <li><strong>Policy space:</strong> healthier debt dynamics allow more room to invest and cushion shocks.</li>
          </ul>
        </section>

        <section>
          <h2 className="article-title">FAQ</h2>

          <details className="debt-faq">
            <summary>Is there a single “safe” number for debt?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              No. Sustainability depends on growth, interest rates, demographics and credible budget paths.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Do the rules stop investment?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              The intent is to support sustainable investment by keeping debt on a stable path, not to block it.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Where can I see up-to-date country figures?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Use the{" "}
              <Link href="/" className="btn" style={{ padding: "2px 8px" }}>
                EU live map
              </Link>{" "}
              and click a country for a ticking estimate based on the latest reference dates.
            </p>
          </details>

          <div className="cta card" style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/" className="btn">View the EU map →</Link>
            <Link href="/debt" className="btn">Debt explainer →</Link>
            <Link href="/debt-to-gdp" className="btn">Debt-to-GDP explained →</Link>
            <Link href="/methodology" className="btn">Methodology →</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
