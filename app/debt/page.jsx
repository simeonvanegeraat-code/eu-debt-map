// app/debt/page.jsx
import Link from "next/link";

/** -----------------------------
 * SEO METADATA
 * ----------------------------- */
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/debt";
  const title =
    "What is Debt? A Simple Guide to Personal and Government Debt • EU Debt Map";
  const description =
    "Definition of debt in plain English. Personal debt (good vs bad), what is government debt, the difference between debt and deficit, how bonds work, who holds public debt, and debt-to-GDP explained with clear visuals and FAQs.";

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
    headline: "What is Debt? A Simple Guide to Personal and Government Debt",
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    mainEntityOfPage: "https://www.eudebtmap.com/debt",
    about: [
      "debt definition",
      "personal debt",
      "government debt",
      "public debt",
      "debt-to-GDP explained",
      "difference between debt and deficit",
    ],
  };

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "What is Debt? A Simple Guide to Personal and Government Debt",
    url: "https://www.eudebtmap.com/debt",
    description:
      "Debt explained simply: personal debt (good vs bad), government debt and deficits, bonds, who holds public debt, and debt-to-GDP.",
    inLanguage: "en",
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.eudebtmap.com/" },
      { "@type": "ListItem", position: 2, name: "Debt Guide", item: "https://www.eudebtmap.com/debt" },
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
          text: "A deficit is the one-year shortfall when spending exceeds revenue. Debt is the total outstanding amount built up over time from past deficits and surpluses.",
        },
      },
      {
        "@type": "Question",
        name: "Can a country ever pay off its debt?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "While possible, most large economies roll over their debt by issuing new bonds to replace maturing ones. The goal is not zero debt but a sustainable path where debt grows more slowly than the economy.",
        },
      },
      {
        "@type": "Question",
        name: "Is all personal debt bad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Good debt can build wealth or income potential (e.g., mortgages, student loans, business loans). Bad debt finances consumption that loses value quickly (e.g., high-interest credit card balances).",
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
            What is Debt? A Simple Guide to Personal and Government Debt
          </h1>

          <div style={{ maxWidth: "68ch" }}>
            <p className="hero-lede" style={{ marginTop: 8 }}>
              Ever felt overwhelmed by the word <em>debt</em>? You’re not alone. We hear it in the news,
              at the kitchen table, and when planning our future. At its simplest, debt is a promise:
              owing something — usually money — to someone else.
            </p>

            <div className="divider-soft" aria-hidden />

            <p className="tag" style={{ margin: 0, lineHeight: 1.7 }}>
              This page starts with <strong>personal debt</strong> you might recognise (like a student loan),
              then scales up to <strong>government debt</strong> — the numbers you see on the news. Along
              the way, we explain the <strong>difference between debt and deficit</strong>, how{" "}
              <Term title="Government debt as a percentage of annual economic output">debt-to-GDP</Term> works,
              and why some debt can be helpful while too much can be risky.
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
        {/* Personal Debt */}
        <section>
          <h2 className="article-title">The Basics: What is Personal Debt?</h2>
          <p className="article-body">
            Personal debt is money an individual borrows and promises to pay back with{" "}
            <Term title="The fee for using borrowed money, usually a percentage per year">interest</Term>.
            The <strong>borrower</strong> (debtor) receives money now; the <strong>lender</strong> (creditor)
            provides it and charges a fee for the convenience.
          </p>
          <div className="tag" role="note" style={{ marginTop: 8 }}>
            <strong>Everyday example.</strong> Buy a $5 coffee on a credit card and don’t pay the bill on time:
            that $5 can become $6 or more after interest and fees.
          </div>

          <h3 className="article-subtitle" style={{ marginTop: 14 }}>Good Debt vs Bad Debt</h3>
          <p>
            Not all debt is created equal. A common rule-of-thumb splits personal borrowing into two types.
          </p>
          <div className="card" style={{ display: "grid", gap: 8, marginTop: 8 }}>
            <div>
              <strong>Good debt (investment)</strong> — finances something that can grow in value or
              raise future income: <em>mortgages</em>, <em>student loans</em>, <em>business loans</em>.
            </div>
            <div>
              <strong>Bad debt (consumption)</strong> — finances things that lose value quickly and
              don’t earn income: revolving <em>credit card balances</em>, <em>payday loans</em>.
            </div>
          </div>
          <div className="tag" style={{ marginTop: 8 }}>
            <strong>Takeaway.</strong> Good debt helps build wealth; bad debt drains it.
          </div>
        </section>

        {/* Government Debt */}
        <section>
          <h2 className="article-title">Shifting Gears: What is Government Debt?</h2>
          <p className="article-body">
            Government debt (also called <em>public</em> or <em>national</em> debt) is the total amount a
            state owes to its creditors. Governments have <strong>income</strong> (mainly taxes) and{" "}
            <strong>expenses</strong> (infrastructure, healthcare, education, defence, public salaries).
            When expenses exceed income, borrowing fills the gap.
          </p>

          <h3 className="article-subtitle">Debt vs Deficit: the Crucial Difference</h3>
          <p>
            The <strong>deficit</strong> is a one-year snapshot: spending minus revenue. The{" "}
            <strong>debt</strong> is the accumulated total from previous years. A handy analogy:
            the deficit is what you add to your card <em>this month</em>; the debt is your{" "}
            <em>total outstanding balance</em>.
          </p>

          <h3 className="article-subtitle">How Does a Government Borrow?</h3>
          <p>
            Mostly by issuing <strong>bonds</strong> — a formal IOU. Investors buy a bond (say $1,000),
            receive regular interest, and get the $1,000 back at maturity. Investors can be households,
            banks, pension funds, other countries, or — in some cases — the central bank.
          </p>

          <h3 className="article-subtitle">Who Does the Government Owe?</h3>
          <ul>
            <li><strong>Domestic investors</strong>: households, banks, insurers, pension funds</li>
            <li><strong>Foreign investors</strong>: other countries, global funds</li>
            <li><strong>Central bank</strong>: sometimes holds bonds to manage the economy</li>
          </ul>
        </section>

        {/* Is debt always bad? */}
        <section>
          <h2 className="article-title">Is Government Debt Always a Bad Thing?</h2>
          <p className="article-body">
            Unlike a household, a government doesn’t need to reduce debt to zero. Most economists agree
            that some debt is useful — and sometimes necessary.
          </p>
          <div className="card" style={{ display: "grid", gap: 8, marginTop: 8 }}>
            <div>
              <strong>The Good.</strong> Borrowing funds long-lived investments (broadband, clean energy,
              universities) and helps during recessions by sustaining jobs and demand.
            </div>
            <div>
              <strong>The Bad.</strong> If debt gets too high, interest costs consume tax revenue, squeezing
              budgets for schools or healthcare.
            </div>
            <div>
              <strong>The Ugly.</strong> If investors lose confidence, demanded interest rates jump, making
              the problem worse — a potential crisis.
            </div>
          </div>
        </section>

        {/* Debt-to-GDP */}
        <section>
          <h2 className="article-title">The Key Metric: Debt-to-GDP Ratio</h2>
          <p>
            To judge scale, economists compare total debt to the size of the economy:
            the <Term title="Government debt divided by annual economic output">debt-to-GDP ratio</Term>.
            Think of GDP as a country’s yearly “salary.”
          </p>
          <p>
            Example: earning $50,000 with $25,000 debt is a <strong>50%</strong> ratio. Earning $50,000
            with $200,000 debt is <strong>400%</strong>. The same logic helps compare countries.
          </p>
          <DebtMeter value={50} />
          <div className="tag" style={{ marginTop: 10 }}>
            <strong>Context matters.</strong> A large, growing economy can carry more debt than a small,
            shrinking one.
          </div>
        </section>

        {/* Dynamics over time */}
        <section>
          <h2 className="article-title">What Moves the Debt Ratio Over Time?</h2>
          <p>
            Three forces shape the path of debt-to-GDP:
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
          <p className="tag" style={{ marginTop: 10 }}>
            Methodological details: <Link href="/methodology">how we estimate and update figures</Link>.
          </p>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="article-title">Frequently Asked Questions (FAQs)</h2>

          <details className="debt-faq">
            <summary>What is the difference between debt and deficit?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              A deficit is the one-year shortfall when spending exceeds revenue. Debt is the total outstanding
              amount built up over time from past deficits and surpluses.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Can a country ever pay off its debt?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Possible, but uncommon. Most large economies roll over their debt by issuing new bonds to repay
              maturing ones. The aim is sustainability, not zero.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Is all personal debt bad?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              No. Debt that builds assets or income potential (mortgage, education, business) can be helpful;
              high-interest consumption debt is usually harmful.
            </p>
          </details>

          <p className="tag" style={{ marginTop: 10 }}>
            Sources: Eurostat (government finance statistics) and national finance ministries. Educational overview; not investment advice.
          </p>

          <div className="cta card" style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/" className="btn">View the live EU debt map →</Link>
            <Link href="/debt-to-gdp" className="btn">Debt-to-GDP explained →</Link>
            <Link href="/debt-vs-deficit" className="btn">Debt vs Deficit →</Link>
            <Link href="/stability-and-growth-pact" className="btn">Stability & Growth Pact →</Link>
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
