// app/debt/page.jsx
import Link from "next/link";

export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/debt";
  const title = "What is Government Debt? • EU Debt Map";
  const description =
    "Clear explainer of government debt: why countries borrow, what debt-to-GDP means, how debt changes over time, and why it matters for people and the economy.";

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
        "Government debt explained in plain English with examples, FAQs, and links to official sources.",
      type: "article",
      url: `${base}${path}`,
      siteName: "EU Debt Map",
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

export default function DebtExplainer() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "What is Government Debt?",
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "EU Debt Map", url: "https://www.eudebtmap.com/" },
    mainEntityOfPage: "https://www.eudebtmap.com/debt",
    about: ["government debt", "public finance", "debt-to-GDP", "deficit vs debt"],
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      {/* ==== HERO (tekst + optionele afbeelding) ==== */}
      <section className="card debt-hero" style={{ gridColumn: "1 / -1" }}>
        {/* Tekstkolom */}
        <header style={{ maxWidth: 760 }}>
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

          {/* Vetgedrukte eerste zin */}
          <p className="hero-lede" style={{ marginTop: 8 }}>
            <span style={{ fontWeight: 600 }}>
              Think of government debt as the price of big, long-term decisions spread over time —
              the roads we drive on, the hospitals we rely on, the shock absorbers in a crisis.
            </span>
          </p>

          {/* Witte regel voor vloeiende overgang */}
          <div
            aria-hidden
            style={{
              height: 8,
              background: "#ffffff",
              borderRadius: 6,
              margin: "8px 0 6px",
              boxShadow: "inset 0 0 0 1px var(--border)",
            }}
          />

          {/* Rest van de intro – normale tekst */}
          <p className="tag" style={{ margin: 0, lineHeight: 1.7 }}>
            Countries borrow for similar reasons families do: invest today, pay back gradually.
            The details matter — that’s where debt-to-GDP, interest costs and fiscal rules come in.
          </p>

          <div className="tag" style={{ marginTop: 8 }}>
            Prefer the map?{" "}
            <Link href="/" className="btn" style={{ padding: "6px 10px", marginLeft: 6 }}>
              See the EU map →
            </Link>
          </div>
        </header>

        {/* Afbeeldingskolom (vervang bron door je asset in /public) */}
        <figure
          style={{
            display: "grid",
            placeItems: "center",
            background: "#f3f4f6",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 12,
            aspectRatio: "16/10",
            overflow: "hidden",
          }}
        >
          <img
            src="/images/debt-hero.jpg"
            alt="Illustration: debt, GDP and interest over time"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
          />
        </figure>
      </section>

      {/* ==== UITLEG ==== */}
      <article className="card" style={{ gridColumn: "1 / -1", display: "grid", gap: 12 }}>
        <section>
          <h2 className="article-title">Why do governments borrow?</h2>
          <p className="article-body">
            Borrowing isn’t only patchwork — it’s how countries finance projects that outlast a single
            budget and cushion the economy when shocks hit.
          </p>
          <ul>
            <li>
              <strong>Invest & build.</strong> Roads, rail, schools, hospitals, clean energy and defence.
            </li>
            <li>
              <strong>Handle shocks.</strong> Recessions, disasters or pandemics can cut tax income while costs rise.
            </li>
            <li>
              <strong>Smooth timing.</strong> Spending is lumpy; tax flows are steady. Debt bridges the gap.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="article-title">Debt-to-GDP, in plain words</h2>
          <p>
            Debt is reported in euros (<span className="mono">€</span>) and as a share of the economy:
            the <em>debt-to-GDP ratio</em>. It puts debt in context by comparing it with what the economy
            produces in a year.
          </p>
          <div
            className="tag"
            role="note"
            style={{
              marginTop: 8,
              border: "1px solid var(--border)",
              background: "#f9fafb",
              padding: "10px 12px",
              borderRadius: 10,
            }}
          >
            <strong>Example.</strong> If GDP is <strong>€1 trillion</strong> and government debt is{" "}
            <strong>€500 billion</strong>, debt-to-GDP equals <strong>50%</strong>.
          </div>
        </section>

        <section>
          <h2 className="article-title">Debt vs. deficit: what’s the difference?</h2>
          <p>
            <strong>Debt</strong> is the total outstanding stock from past borrowing. A{" "}
            <strong>deficit</strong> is a yearly shortfall when spending exceeds revenue. Deficits add
            to debt; surpluses can reduce it.
          </p>
        </section>

        <section>
          <h2 className="article-title">Why does debt matter for people?</h2>
          <p className="article-body">
            Debt affects everyday life through three channels:
          </p>
          <ul>
            <li>Interest costs — money spent on interest can’t fund schools or healthcare.</li>
            <li>Policy room — lower interest bills give more space to invest or respond to shocks.</li>
            <li>Stability — in the EU, debt and deficits are monitored to keep finances sustainable.</li>
          </ul>
        </section>

        <section>
          <h2 className="article-title">How does debt change over time?</h2>
          <p>Three forces shape debt-to-GDP:</p>
          <ol>
            <li>
              <strong>Primary balance:</strong> budget before interest. Surpluses push debt down; deficits push it up.
            </li>
            <li>
              <strong>Growth vs. interest:</strong> if growth outpaces the interest rate on debt, the ratio can stabilise or fall.
            </li>
            <li>
              <strong>One-offs:</strong> bank rescues, asset sales, inflation shocks or FX moves (outside the euro).
            </li>
          </ol>
        </section>

        <section>
          <h2 className="article-title">FAQ</h2>

          <details className="debt-faq">
            <summary><strong>Who lends to governments?</strong></summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Mainly investors who buy government bonds: banks, pension funds, insurers and sometimes
              other countries or institutions.
            </p>
          </details>

          <details className="debt-faq">
            <summary><strong>Is there a “safe” level of debt?</strong></summary>
            <p className="tag" style={{ marginTop: 8 }}>
              No single number fits all. In the EU, <strong>60% of GDP</strong> is often used as a guide,
              but sustainability depends on growth, interest rates, demographics and policy.
            </p>
          </details>

          <details className="debt-faq">
            <summary><strong>Where can I see current figures?</strong></summary>
            <p className="tag" style={{ marginTop: 8 }}>
              Use the{" "}
              <Link href="/" className="btn" style={{ padding: "2px 8px" }}>
                EU map
              </Link>{" "}
              and click a country for a live estimate based on the latest reference dates.
            </p>
          </details>

          <p className="tag" style={{ marginTop: 10 }}>
            Sources: Eurostat (government finance statistics) and national finance ministries. Educational overview; not investment advice.
          </p>
        </section>
      </article>

      {/* ==== Lichte “Explore more” kaarten (vervanging voor de donkere blokken) ==== */}
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
          <h3 style={{ marginTop: 0 }}>Compare two countries</h3>
          <p className="tag" style={{ marginTop: 6 }}>Open both pages to compare live figures.</p>
          <div className="tag" style={{ display: "grid", gap: 6 }}>
            <Link href="/country/DE">Germany</Link>
            <Link href="/country/FR">France</Link>
            <Link href="/country/IT">Italy</Link>
            <Link href="/country/NL">Netherlands</Link>
            <Link href="/country/ES">Spain</Link>
          </div>
        </div>

        <div className="card" style={{ margin: 0 }}>
          <h3 style={{ marginTop: 0 }}>Popular country pages</h3>
          <p className="tag" style={{ marginTop: 6 }}>
            Explore the live ticker and trend for each country.
          </p>
          <div className="tag" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/country/DE" className="nav-link">DE Germany</Link>
            <Link href="/country/FR" className="nav-link">FR France</Link>
            <Link href="/country/IT" className="nav-link">IT Italy</Link>
            <Link href="/country/ES" className="nav-link">ES Spain</Link>
            <Link href="/country/NL" className="nav-link">NL Netherlands</Link>
          </div>
        </div>

        <div className="card" style={{ margin: 0, display: "grid", gap: 8, alignContent: "start" }}>
          <h3 style={{ marginTop: 0 }}>Learn more</h3>
          <Link href="/" className="btn">See the EU map</Link>
          <Link href="/methodology" className="btn">Methodology</Link>
        </div>
      </section>
    </main>
  );
}
