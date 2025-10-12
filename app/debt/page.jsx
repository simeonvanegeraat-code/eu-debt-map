// app/debt/page.jsx
import Link from "next/link";
import CTASidebar from "@/components/CTASidebar";

export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const path = "/debt";
  const title = "What is Government Debt? • EU Debt Map";
  const description =
    "Clear, friendly explainer of government debt: why countries borrow, what debt-to-GDP means, how debt changes over time, and why it matters for people and the economy.";

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
        "Government debt explained in plain English with examples, FAQs, and links to official sources. Understand debt-to-GDP and how debt changes over time.",
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
  // JSON-LD: Article (+ light FAQ entities) for richer SERP
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

      {/* HERO */}
      <section className="card" style={{ gridColumn: "1 / -1", display: "grid", gap: 12 }}>
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
          <p className="hero-lede" style={{ marginTop: 8 }}>
            <span style={{ fontWeight: 600 }}>
              Think of government debt as the price of big, long-term decisions spread over time —
              the roads we drive on, the hospitals we rely on, the shock absorbers in a crisis.
            </span>{" "}
            Countries borrow for the same reason families sometimes do: to invest today and pay back
            gradually. The details matter — and that’s where debt-to-GDP, interest costs and
            fiscal rules come in.
          </p>
        </header>

        {/* SHORT NAV / CONTEXT */}
        <div className="tag" style={{ marginTop: 2 }}>
          Prefer the map?{" "}
          <Link href="/" className="btn" style={{ padding: "6px 10px", marginLeft: 6 }}>
            See the EU map →
          </Link>
        </div>
      </section>

      {/* CORE EXPLAINER */}
      <article className="card" style={{ gridColumn: "1 / -1" }}>
        <h2 className="article-title">Why do governments borrow?</h2>
        <p className="article-body">
          Borrowing isn’t just about plugging gaps — it’s often about building the future and
          smoothing the path to get there.
        </p>
        <ul>
          <li>
            <strong>Invest & build:</strong> roads, rail, schools, hospitals, clean energy and
            defence — projects that last longer than a single budget year.
          </li>
          <li>
            <strong>Handle shocks:</strong> recessions, natural disasters or pandemics can shrink tax
            income and raise costs at the same time.
          </li>
          <li>
            <strong>Smooth timing:</strong> spending needs are lumpy; tax revenue arrives steadily.
            Debt helps bridge the timing gap.
          </li>
        </ul>

        <h2 className="article-title">Debt-to-GDP, explained simply</h2>
        <p>
          Debt is reported in euros (<span className="mono">€</span>) and as a share of the economy:
          the <strong>debt-to-GDP ratio</strong>. It puts a country’s debt in context by comparing it
          to what the economy produces in a year.
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
          <strong>Example</strong> — If an economy produces <strong>€1 trillion</strong> (GDP) and
          the government owes <strong>€500 billion</strong>, then debt-to-GDP is{" "}
          <strong>50%</strong>.
        </div>
        <p className="article-body" style={{ marginTop: 10 }}>
          Ratios help compare across countries of different sizes — but they don’t tell the whole
          story. Interest rates, economic growth and the maturity of the debt also matter.
        </p>

        <h2 className="article-title">Debt vs. deficit: what’s the difference?</h2>
        <p>
          <strong>Debt</strong> is the total stock — the sum of past borrowing that hasn’t been
          repaid yet. A <strong>deficit</strong> is the yearly flow — when a government spends more
          than it collects in taxes. Running deficits adds to the debt; running a surplus can reduce it.
        </p>

        <h2 className="article-title">Why does debt matter for people?</h2>
        <ul>
          <li>
            <strong>Interest costs:</strong> the more you owe, the more you pay in interest — money
            that can’t be used for schools, healthcare or tax cuts.
          </li>
          <li>
            <strong>Policy room:</strong> lower debt and lower interest bills can give governments
            more room to respond to shocks or invest.
          </li>
          <li>
            <strong>Stability & rules:</strong> in the EU, debt and deficits are monitored to
            support sustainable public finances and economic stability.
          </li>
        </ul>

        <h2 className="article-title">How does debt change over time?</h2>
        <p>Three forces drive the path of debt-to-GDP:</p>
        <ol>
          <li>
            <strong>Primary balance:</strong> the budget before interest. Surpluses push debt down;
            deficits push it up.
          </li>
          <li>
            <strong>Interest rates vs. growth:</strong> if the economy grows faster than the interest
            rate on debt, ratios can stabilise or fall more easily.
          </li>
          <li>
            <strong>One-off factors:</strong> bank rescues, asset sales, inflation shocks or
            exchange-rate moves (outside the euro) can shift the numbers.
          </li>
        </ol>

        <h2 className="article-title">Common questions</h2>
        <h3 style={{ marginBottom: 6 }}>Who lends to governments?</h3>
        <p className="tag" style={{ marginTop: 0 }}>
          Mostly investors who buy government bonds: banks, pension funds, insurance companies and,
          at times, other countries or institutions.
        </p>

        <h3 style={{ marginBottom: 6 }}>Is there a single “safe” level of debt?</h3>
        <p className="tag" style={{ marginTop: 0 }}>
          No single magic number fits every country. In the EU, a <strong>60% of GDP</strong> guide
          is often referenced, but sustainable levels depend on growth, interest rates, demographics
          and policy choices.
        </p>

        <h3 style={{ marginBottom: 6 }}>Where can I see today’s figures?</h3>
        <p className="tag" style={{ marginTop: 0 }}>
          Use the{" "}
          <Link href="/" className="btn" style={{ padding: "2px 8px" }}>
            EU map
          </Link>{" "}
          and click a country for a live estimate based on the latest reference dates.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "12px 0" }} />

        <p className="tag" style={{ marginTop: 6 }}>
          Sources: Eurostat (government finance statistics) and national finance ministries. This
          page is an educational overview — not investment advice or an official statistic.
        </p>
      </article>

      {/* Contextual CTAs (reuse your component) */}
      <CTASidebar lang="en" homeHref="/" methodologyHref="/methodology" />
    </main>
  );
}
