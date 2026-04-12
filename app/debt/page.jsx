// app/debt/page.jsx
import Link from "next/link";

export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/debt";
  const title =
    "What Is Government Debt? Public Debt, Deficits and Bonds Explained | EU Debt Map";
  const description =
    "A simple guide to government debt: what public debt is, how it differs from a deficit, how bonds work, who lends to governments, and why debt-to-GDP matters.";

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
          alt: "Government debt explainer",
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

function MiniCard({ label, text }) {
  return (
    <div className="card" style={{ margin: 0 }}>
      <div className="tag">{label}</div>
      <p style={{ margin: "8px 0 0 0", lineHeight: 1.65 }}>{text}</p>
    </div>
  );
}

function CompareCard({ leftTitle, leftText, rightTitle, rightText }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 12,
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        marginTop: 8,
      }}
    >
      <div className="card" style={{ margin: 0 }}>
        <div className="tag">{leftTitle}</div>
        <p style={{ margin: "8px 0 0 0", lineHeight: 1.65 }}>{leftText}</p>
      </div>
      <div className="card" style={{ margin: 0 }}>
        <div className="tag">{rightTitle}</div>
        <p style={{ margin: "8px 0 0 0", lineHeight: 1.65 }}>{rightText}</p>
      </div>
    </div>
  );
}

function StepGrid({ steps }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 12,
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        marginTop: 10,
      }}
    >
      {steps.map((step, i) => (
        <div key={i} className="card" style={{ margin: 0 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              background: "rgba(37,99,235,0.10)",
              color: "#1d4ed8",
              marginBottom: 10,
            }}
          >
            {i + 1}
          </div>
          <strong>{step.title}</strong>
          <p style={{ margin: "8px 0 0 0", lineHeight: 1.6 }}>{step.text}</p>
        </div>
      ))}
    </div>
  );
}

function RatioBand() {
  return (
    <div
      className="card"
      style={{
        marginTop: 10,
        display: "grid",
        gap: 10,
      }}
    >
      <div className="tag">Debt-to-GDP in one glance</div>

      <div
        role="img"
        aria-label="Illustrative debt-to-GDP scale with a 60% reference point"
        style={{ marginTop: 2 }}
      >
        <div
          style={{
            position: "relative",
            height: 16,
            borderRadius: 999,
            overflow: "hidden",
            background: "#e5e7eb",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ position: "absolute", inset: 0, width: "60%", background: "rgba(16,185,129,0.55)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "60%", width: "30%", background: "rgba(245,158,11,0.45)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "90%", width: "10%", background: "rgba(239,68,68,0.45)" }} />
          <div
            style={{
              position: "absolute",
              top: -4,
              bottom: -4,
              left: "60%",
              width: 2,
              background: "#0f172a",
              opacity: 0.7,
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "60% 30% 10%",
            fontSize: 12,
            color: "var(--muted)",
            marginTop: 8,
            gap: 8,
          }}
        >
          <span>&lt;60% reference zone</span>
          <span>60–90% watch zone</span>
          <span>&gt;90%</span>
        </div>
      </div>

      <p className="tag" style={{ margin: 0, lineHeight: 1.7 }}>
        The debt-to-GDP ratio compares total public debt with yearly economic output. It does not tell the full story, but it helps compare countries of very different sizes.
      </p>
    </div>
  );
}

export default function DebtExplainer() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "What Is Government Debt? Public Debt, Deficits and Bonds Explained",
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    mainEntityOfPage: "https://www.eudebtmap.com/debt",
    about: [
      "government debt",
      "public debt",
      "debt vs deficit",
      "government bonds",
      "debt-to-GDP",
    ],
  };

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "What Is Government Debt? Public Debt, Deficits and Bonds Explained",
    url: "https://www.eudebtmap.com/debt",
    description:
      "A simple guide to government debt: what public debt is, how it differs from a deficit, how bonds work, who lends to governments, and why debt-to-GDP matters.",
    inLanguage: "en",
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.eudebtmap.com/" },
      { "@type": "ListItem", position: 2, name: "Government Debt Guide", item: "https://www.eudebtmap.com/debt" },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is government debt?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Government debt is the total amount a state owes after years of borrowing. It usually increases when public spending exceeds public revenue.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between debt and deficit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A deficit is the shortfall in one budget period when spending is higher than revenue. Debt is the total stock built up over time.",
        },
      },
      {
        "@type": "Question",
        name: "Who buys government bonds?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Government bonds are usually bought by banks, pension funds, insurers, investment funds, foreign investors and sometimes central banks.",
        },
      },
      {
        "@type": "Question",
        name: "Why does debt-to-GDP matter?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Debt-to-GDP compares public debt with the size of the economy. It helps show how heavy the debt burden is relative to a country's economic capacity.",
        },
      },
    ],
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <header style={{ display: "grid", gap: 14 }}>
          <h1
            className="hero-title"
            style={{
              fontSize: "clamp(1.9rem, 4vw + 1rem, 3.1rem)",
              background: "linear-gradient(90deg, #2563eb, #00875a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
            }}
          >
            What Is Government Debt?
          </h1>

          <div style={{ maxWidth: "70ch", display: "grid", gap: 10 }}>
            <p className="hero-lede" style={{ margin: 0 }}>
              Government debt is the total money a state owes after years of borrowing. If a government spends more than it collects, it usually fills the gap by issuing bonds.
            </p>

            <p className="tag" style={{ margin: 0, lineHeight: 1.7 }}>
              This guide focuses on <strong>public debt</strong>, not personal finance. It explains what government debt is, how it differs from a deficit, who lends to governments, and why the <Term title="Government debt as a share of annual economic output">debt-to-GDP ratio</Term> is the key comparison metric.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
              <Link href="/" className="btn">Open the live EU debt map →</Link>
              <Link href="/debt-to-gdp" className="btn">Debt-to-GDP explained →</Link>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              marginTop: 6,
            }}
          >
            <MiniCard
              label="Debt"
              text="The total stock of money a government still owes."
            />
            <MiniCard
              label="Deficit"
              text="The shortfall in one budget period when spending is higher than revenue."
            />
            <MiniCard
              label="Bond"
              text="The main IOU governments sell when they borrow from investors."
            />
            <MiniCard
              label="Debt-to-GDP"
              text="Debt compared with the size of the economy, not just the raw amount."
            />
          </div>
        </header>
      </section>

      <article className="card section" style={{ gridColumn: "1 / -1" }}>
        <section>
          <h2 className="article-title">Government debt in one sentence</h2>
          <p className="article-body">
            Government debt is the accumulated result of past borrowing. A country runs deficits from time to time, finances them with bonds, and carries the outstanding debt forward until those bonds are repaid or refinanced.
          </p>
          <div className="tag" style={{ marginTop: 8 }}>
            Think of it like this: a <strong>deficit</strong> is one year’s gap, while <strong>debt</strong> is the running total left after many years.
          </div>
        </section>

        <section>
          <h2 className="article-title">Debt vs deficit</h2>
          <CompareCard
            leftTitle="Deficit"
            leftText="A flow. It measures how much new borrowing is needed in one budget period when government spending exceeds government revenue."
            rightTitle="Debt"
            rightText="A stock. It measures the total outstanding amount the state still owes after years of borrowing."
          />
        </section>

        <section>
          <h2 className="article-title">How governments borrow</h2>
          <p className="article-body">
            Governments mainly borrow by issuing <strong>bonds</strong>. A bond is a formal promise to repay investors later, usually with regular interest payments in the meantime.
          </p>

          <StepGrid
            steps={[
              {
                title: "The state issues bonds",
                text: "The government offers debt securities to the market to raise money.",
              },
              {
                title: "Investors buy them",
                text: "Banks, pension funds, insurers, funds and foreign buyers provide cash upfront.",
              },
              {
                title: "Interest is paid",
                text: "Bond holders receive interest over time as compensation for lending.",
              },
              {
                title: "Old debt matures",
                text: "At maturity, bonds are repaid or replaced with newly issued bonds.",
              },
            ]}
          />
        </section>

        <section>
          <h2 className="article-title">Who holds government debt?</h2>
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              marginTop: 8,
            }}
          >
            <MiniCard
              label="Domestic investors"
              text="Local banks, insurers, pension funds and sometimes households often hold a large share."
            />
            <MiniCard
              label="Foreign investors"
              text="International funds and overseas institutions can also be important lenders."
            />
            <MiniCard
              label="Central banks"
              text="In some periods, central banks hold government bonds as part of monetary policy."
            />
          </div>
        </section>

        <section>
          <h2 className="article-title">When does debt become a problem?</h2>
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              marginTop: 8,
            }}
          >
            <MiniCard
              label="Interest costs rise"
              text="More tax revenue goes to debt service instead of public services or investment."
            />
            <MiniCard
              label="Growth stays weak"
              text="If the economy grows slowly, carrying the same debt burden becomes harder."
            />
            <MiniCard
              label="Market confidence falls"
              text="Investors may demand higher yields, which pushes borrowing costs up further."
            />
          </div>
        </section>

        <section>
          <h2 className="article-title">Why debt-to-GDP matters</h2>
          <p className="article-body">
            Raw debt alone can be misleading. A debt figure that looks huge for one country may be manageable for a much larger economy. That is why economists compare debt with yearly output using the debt-to-GDP ratio.
          </p>
          <RatioBand />
          <p className="tag" style={{ marginTop: 10 }}>
            A country with strong growth, low interest costs and credible institutions can often carry more debt than a smaller or weaker economy.
          </p>
        </section>

        <section>
          <h2 className="article-title">Frequently asked questions</h2>

          <details className="debt-faq">
            <summary>Is all government debt bad?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              No. Borrowing can finance long-term investment and help stabilise the economy during recessions. The key question is whether the debt remains manageable over time.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Do countries have to pay off all their debt?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Usually not. Most governments refinance part of their debt as bonds mature. The real goal is sustainability, not zero debt.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Why can a rich country carry more debt than a poor one?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Because repayment capacity depends on the size and strength of the economy, not just on the debt amount itself.
            </p>
          </details>

          <details className="debt-faq">
            <summary>Why does EU Debt Map focus so much on debt-to-GDP?</summary>
            <p className="tag" style={{ marginTop: 8 }}>
              It is the clearest way to compare countries of very different sizes and to judge debt against economic output rather than raw euro totals alone.
            </p>
          </details>
        </section>
      </article>

      <section
        className="card section"
        style={{
          gridColumn: "1 / -1",
          display: "grid",
          gap: 14,
        }}
      >
        <h2 className="article-title" style={{ marginBottom: 0 }}>Next steps</h2>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/" className="btn">View the live EU map →</Link>
          <Link href="/debt-to-gdp" className="btn">Debt-to-GDP explained →</Link>
          <Link href="/debt-vs-deficit" className="btn">Debt vs Deficit →</Link>
          <Link href="/methodology" className="btn">Methodology →</Link>
        </div>

        <div className="tag" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link href="/country/de" className="nav-link">Germany</Link>
          <Link href="/country/fr" className="nav-link">France</Link>
          <Link href="/country/it" className="nav-link">Italy</Link>
          <Link href="/country/es" className="nav-link">Spain</Link>
          <Link href="/country/nl" className="nav-link">Netherlands</Link>
        </div>

        <p className="tag" style={{ margin: 0 }}>
          Sources: Eurostat government finance data and national public finance institutions. Educational overview, not investment advice.
        </p>
      </section>
    </main>
  );
}