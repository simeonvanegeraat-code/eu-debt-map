import Link from "next/link";
import dynamic from "next/dynamic";
import QuickList from "@/components/QuickList";
import ArticleCard from "@/components/ArticleCard";
import HighlightTicker from "@/components/HighlightTicker";
import { listArticles } from "@/lib/articles";
import { countries, trendFor, livePerSecondFor, interpolateDebt } from "@/lib/data";

// Map & ticker client-only to avoid hydration mismatch
const EuropeMap = dynamic(() => import("@/components/EuropeMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{ height: 420, display: "grid", placeItems: "center" }}
      className="card"
      aria-busy="true"
    >
      Loading map…
    </div>
  ),
});

const EUTotalTicker = dynamic(() => import("@/components/EUTotalTicker"), { ssr: false });

// --- SEO metadata (EN root) ---
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const title = "EU Debt Map | Live EU Government Debt by Country";
  const description =
    "Track EU government debt country by country with a live EU-27 debt map, real-time estimates, country comparisons, and debt trends based on Eurostat data.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: "https://www.eudebtmap.com/",
      languages: {
        en: "https://www.eudebtmap.com/",
        nl: "https://www.eudebtmap.com/nl",
        de: "https://www.eudebtmap.com/de",
        fr: "https://www.eudebtmap.com/fr",
        "x-default": "https://www.eudebtmap.com/",
      },
    },
    openGraph: {
      title,
      description:
        "Explore EU government debt with a live map, country pages, debt trends, and real-time estimates based on Eurostat data.",
      url: "https://www.eudebtmap.com/",
      siteName: "EU Debt Map",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description:
        "Live EU government debt estimates, country comparisons, and trends based on Eurostat data.",
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

function perSecondForCountry(c) {
  return livePerSecondFor(c);
}

function liveStartForCountry(c, atMs) {
  if (!c) return 0;
  return interpolateDebt(c, atMs);
}

function formatEURShort(v) {
  const abs = Math.abs(v);

  if (abs >= 1_000_000_000_000) {
    return `€${(v / 1_000_000_000_000).toFixed(2)}tn`;
  }
  if (abs >= 1_000_000_000) {
    return `€${(v / 1_000_000_000).toFixed(0)}bn`;
  }
  if (abs >= 1_000_000) {
    return `€${(v / 1_000_000).toFixed(0)}m`;
  }

  return `€${new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(Math.round(v))}`;
}

export default function HomePage() {
  const valid = countries.filter((c) => c && c.last_value_eur > 0 && c.prev_value_eur > 0);

  const largestDebt =
    valid.length > 0 ? valid.reduce((a, b) => (a.last_value_eur > b.last_value_eur ? a : b)) : null;

  const withDelta = valid.map((c) => ({ ...c, delta: c.last_value_eur - c.prev_value_eur }));

  const fastestGrowing =
    withDelta.length > 0 ? withDelta.reduce((a, b) => (a.delta > b.delta ? a : b)) : null;

  const risingCount = valid.filter((c) => trendFor(c) > 0).length;
  const fallingCount = valid.filter((c) => trendFor(c) < 0).length;

  const quickItems = valid.map((c) => ({
    code: c.code,
    name: c.name,
    flag: c.flag,
    trend: trendFor(c),
  }));

  const topArticles = listArticles({ lang: "en" }).slice(0, 3);
  const nowMs = Date.now();

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://www.eudebtmap.com/",
    name: "EU Debt Map",
    inLanguage: "en",
  };

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EU Debt Map",
    url: "https://www.eudebtmap.com/",
    sameAs: ["https://www.eudebtmap.com/"],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is the live estimate calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "We interpolate between the last two Eurostat reference periods and extrapolate the change per second. Country pages show the baseline and recent direction.",
        },
      },
      {
        "@type": "Question",
        name: "Is this an official real-time government statistic?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No. It is an educational visualization based on official Eurostat data. The live ticker is an estimate, not an official real-time publication.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between debt and deficit?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Government debt is the accumulated amount a country owes. A deficit is the gap between what a government spends and what it collects over a period, usually a year.",
        },
      },
    ],
  };

  const styles = `
    .home-page {
      align-items: start;
    }

    .home-hero {
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(circle at top right, rgba(37,99,235,0.10), transparent 28%),
        radial-gradient(circle at bottom left, rgba(34,197,94,0.08), transparent 24%),
        #ffffff;
    }

    .home-hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
      gap: 24px;
      align-items: start;
    }

    .hero-copy {
      min-width: 0;
    }

    .hero-copy .hero-title {
      max-width: 11ch;
      margin-bottom: 12px;
    }

    .hero-copy .hero-lede {
      max-width: 33ch;
      margin-top: 0;
      color: #49637f;
    }

    .hero-copy .hero-lede strong {
      color: #3f5874;
      font-weight: 700;
    }

    .hero-subcopy {
      margin-top: 14px;
      max-width: 62ch;
      color: #546b84;
      line-height: 1.72;
    }

    .hero-meta {
      margin-top: 16px;
      display: inline-flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }

    .meta-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: 1px solid #dbe4ef;
      border-radius: 999px;
      padding: 7px 11px;
      background: rgba(255,255,255,0.88);
      color: #4b6077;
      font-size: 13px;
      line-height: 1.2;
      font-weight: 600;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 18px;
    }

    .hero-btn-primary,
    .hero-btn-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 46px;
      padding: 0 16px;
      border-radius: 999px;
      text-decoration: none;
      font-weight: 700;
      transition: transform .08s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease;
    }

    .hero-btn-primary {
      background: linear-gradient(180deg, #2563eb, #1d4ed8);
      color: #ffffff;
      border: 1px solid #1d4ed8;
      box-shadow: 0 10px 24px rgba(37,99,235,0.18);
    }

    .hero-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 14px 28px rgba(37,99,235,0.22);
      text-decoration: none;
    }

    .hero-btn-secondary {
      background: #ffffff;
      color: var(--fg);
      border: 1px solid #d7dee8;
      box-shadow: 0 4px 10px rgba(15,23,42,0.04);
    }

    .hero-btn-secondary:hover {
      background: #f8fafc;
      border-color: #c7d2de;
      text-decoration: none;
    }

    .hero-right {
      min-width: 0;
      display: grid;
      gap: 14px;
      align-content: start;
    }

    .hero-right .hero-mobile-copy {
      display: none;
    }

    .hero-side-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .hero-side-card {
      border: 1px solid #e4ebf3;
      border-radius: 16px;
      background: rgba(255,255,255,0.94);
      box-shadow: 0 8px 18px rgba(15,23,42,0.05);
      padding: 14px;
    }

    .hero-side-label {
      font-size: 12px;
      color: #6a7f93;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .05em;
      margin-bottom: 6px;
    }

    .hero-side-title {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px 0;
      line-height: 1.3;
    }

    .hero-side-value {
      font-family: var(--font-display);
      font-size: clamp(1.05rem, 2vw, 1.35rem);
      font-weight: 700;
      color: #111827;
      line-height: 1.15;
      letter-spacing: -0.02em;
    }

    .hero-side-sub {
      margin-top: 8px;
      font-size: 13px;
      color: #586d85;
      line-height: 1.45;
    }

    .hero-side-sub strong {
      color: #0f172a;
    }

    .hero-source {
      margin-top: 16px;
      color: #64748b;
      font-size: 13px;
      line-height: 1.6;
      padding-top: 14px;
      border-top: 1px solid #e6edf4;
    }

    .overview-card {
      background:
        linear-gradient(180deg, rgba(248,250,252,0.88), rgba(255,255,255,1)),
        #ffffff;
    }

    .overview-top {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 16px;
      align-items: end;
      margin-bottom: 12px;
    }

    .overview-title-wrap p {
      margin: 0;
      max-width: 70ch;
      color: #5a6f86;
      line-height: 1.7;
    }

    .overview-legend-inline {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px;
      align-items: center;
    }

    .legend-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 10px;
      border-radius: 999px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #475569;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      display: inline-block;
      flex: 0 0 10px;
    }

    .map-panel {
      overflow: hidden;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      background: #f8fafc;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
    }

    .map-panel .card {
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      background: transparent !important;
      padding: 0 !important;
    }

    .overview-bottom {
      margin-top: 14px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 14px;
      align-items: center;
    }

    .overview-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      min-height: 52px;
      padding: 12px 14px;
      border-radius: 14px;
      background: #ffffff;
      border: 1px dashed #cbd5e1;
      color: #0f172a;
      text-align: center;
      font-weight: 700;
      line-height: 1.5;
    }

    .overview-links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: flex-end;
    }

    .soft-link-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-height: 42px;
      padding: 0 14px;
      border-radius: 999px;
      border: 1px solid #d9e2ec;
      background: #ffffff;
      color: #0f172a;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      white-space: nowrap;
    }

    .soft-link-chip:hover {
      background: #f8fafc;
      text-decoration: none;
    }

    .highlights-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 10px;
    }

    .highlights-intro {
      margin-top: 10px;
      max-width: 72ch;
      color: #5a6f86;
      line-height: 1.72;
    }

    .why-card {
      background:
        radial-gradient(circle at top right, rgba(37,99,235,0.06), transparent 26%),
        #ffffff;
    }

    .why-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 18px;
    }

    .why-point {
      border: 1px solid #e5ebf2;
      border-radius: 16px;
      background: #fbfdff;
      padding: 14px;
    }

    .why-point-title {
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 6px 0;
      font-size: 15px;
    }

    .why-point-text {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
      color: #5b6f86;
    }

    .why-copy {
      max-width: 78ch;
      color: #586d85;
      line-height: 1.78;
    }

    .lower-grid {
      display: grid;
      grid-template-columns: minmax(280px, 0.95fr) minmax(320px, 1.05fr);
      gap: 16px;
      align-items: start;
    }

    .quicklist-shell {
      display: block;
    }

    .quicklist-shell :global(section.card) {
      padding: 20px;
      border-radius: 18px;
    }

    .quicklist-shell :global(h3) {
      margin-bottom: 12px;
    }

    .articles-shell .articles-head {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
    }

    .articles-shell .articles-head h2 {
      margin: 0;
      flex: 1;
    }

    .articles-stack {
      display: grid;
      gap: 12px;
    }

    .faq-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }

    .faq-item {
      border: 1px solid #e6edf4;
      border-radius: 16px;
      padding: 16px;
      background: #fbfdff;
      height: 100%;
    }

    .faq-item h3 {
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 18px;
    }

    .faq-item p {
      margin: 0;
      color: #5a6f86;
      line-height: 1.72;
    }

    @media (max-width: 1080px) {
      .home-hero-grid,
      .lower-grid {
        grid-template-columns: 1fr;
      }

      .hero-copy .hero-title {
        max-width: 12ch;
      }

      .overview-top,
      .overview-bottom {
        grid-template-columns: 1fr;
      }

      .overview-legend-inline,
      .overview-links {
        justify-content: flex-start;
      }

      .why-grid,
      .faq-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 820px) {
      .hero-copy .hero-subcopy--desktop {
        display: none;
      }

      .hero-right .hero-mobile-copy {
        display: block;
        color: #586d85;
        line-height: 1.72;
        margin: 0;
      }

      .hero-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .hero-btn-primary,
      .hero-btn-secondary {
        width: 100%;
      }

      .hero-side-grid,
      .highlights-grid {
        grid-template-columns: 1fr;
      }

      .meta-chip {
        width: fit-content;
      }
    }

    @media (max-width: 640px) {
      .home-hero {
        padding-top: 22px;
      }

      .hero-copy .hero-title {
        max-width: none;
      }

      .hero-copy .hero-lede {
        max-width: none;
      }

      .overview-banner {
        justify-content: center;
        text-align: center;
      }

      .overview-links {
        width: 100%;
      }

      .soft-link-chip {
        width: 100%;
      }
    }
  `;

  return (
    <main className="container grid home-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="card section home-hero" style={{ gridColumn: "1 / -1" }} aria-labelledby="page-title">
        <div className="home-hero-grid">
          <div className="hero-copy">
            <h1 id="page-title" className="hero-title">
              Live EU Government Debt Map
            </h1>

            <p className="hero-lede">
              <strong>
                Add together the public debt of all 27 EU countries and you get the figure below:
                a live estimate that keeps moving every second.
              </strong>
            </p>

            <p className="hero-subcopy hero-subcopy--desktop">
              EU Debt Map turns Eurostat debt data into a simple way to explore government debt
              across the European Union. Use the interactive map to compare countries such as
              France, Germany, Italy, Spain, and the Netherlands, then open any country page for a
              live debt ticker, recent trend, and debt-to-GDP context.
            </p>

            <div className="hero-meta" aria-label="Key facts">
              <span className="meta-chip">EU-27 coverage</span>
              <span className="meta-chip">Based on Eurostat data</span>
              <span className="meta-chip">Live estimated ticker</span>
            </div>

            <div className="hero-actions">
              <Link href="/eu-debt" className="hero-btn-primary">
                View EU debt trends →
              </Link>
              <Link href="/debt" className="hero-btn-secondary">
                Read the debt explainer →
              </Link>
            </div>

            <p className="hero-source">
              Source: Eurostat. Live values are estimated from the latest quarterly data and are
              shown for educational purposes, not as official real-time statistics.
            </p>
          </div>

          <div className="hero-right">
            <EUTotalTicker />

            <p className="hero-mobile-copy">
              EU Debt Map turns Eurostat debt data into a simple way to explore government debt
              across the European Union. Tap any country to open its page and compare live debt,
              recent movement, and debt-to-GDP context.
            </p>

            <div className="hero-side-grid" aria-label="Top insights">
              {largestDebt && (
                <div className="hero-side-card">
                  <div className="hero-side-label">Largest debt</div>
                  <p className="hero-side-title">
                    {largestDebt.flag} {largestDebt.name}
                  </p>
                  <div className="hero-side-value">{formatEURShort(largestDebt.last_value_eur)}</div>
                  <div className="hero-side-sub">
                    Biggest debt stock in the EU at the latest reference point.
                  </div>
                </div>
              )}

              {fastestGrowing && (
                <div className="hero-side-card">
                  <div className="hero-side-label">Fastest growing</div>
                  <p className="hero-side-title">
                    {fastestGrowing.flag} {fastestGrowing.name}
                  </p>
                  <div className="hero-side-value">{formatEURShort(fastestGrowing.last_value_eur)}</div>
                  <div className="hero-side-sub">
                    Strongest absolute increase between the latest two periods.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        className="card section overview-card"
        style={{ gridColumn: "1 / -1" }}
        aria-labelledby="overview-title"
      >
        <div className="overview-top">
          <div className="overview-title-wrap">
            <h2 id="overview-title" style={{ marginTop: 0, marginBottom: 8 }}>
              EU overview
            </h2>
            <p>
              The map shows whether government debt has risen or fallen between the latest two
              reference points. Open any country to see its live debt estimate, recent movement,
              and country context.
            </p>
          </div>

          <div className="overview-legend-inline" aria-label="Legend">
            <span className="legend-chip">
              <span className="legend-dot" style={{ background: "var(--ok)" }} />
              Falling debt
            </span>
            <span className="legend-chip">
              <span className="legend-dot" style={{ background: "var(--bad)" }} />
              Rising debt
            </span>
            <span className="legend-chip">{fallingCount} falling · {risingCount} rising</span>
          </div>
        </div>

        <div className="map-panel">
          <div className="mapWrap" role="region" aria-label="Interactive EU map">
            <EuropeMap />
          </div>
        </div>

        <div className="overview-bottom">
          <div className="overview-banner">
            <span aria-hidden>➜</span>
            <span>
              <strong>Click any country</strong> on the map to open its live debt ticker.
            </span>
          </div>

          <div className="overview-links">
            <Link href="/eu-debt" className="soft-link-chip">
              5-year EU debt chart
            </Link>
            <Link href="/debt" className="soft-link-chip">
              What government debt means
            </Link>
          </div>
        </div>
      </section>

      <section className="card section" style={{ gridColumn: "1 / -1" }} aria-labelledby="highlights-title">
        <div>
          <h2 id="highlights-title" style={{ marginTop: 0, marginBottom: 0 }}>
            Highlights
          </h2>

          <p className="highlights-intro">
            Government debt affects borrowing costs, budget choices, interest rates, and how much
            room governments have to respond to crises. These live highlights surface the biggest
            movements at a glance.
          </p>
        </div>

        <div className="highlights-grid">
          {largestDebt ? (
            <HighlightTicker
              label="Largest debt"
              flag={largestDebt.flag}
              name={largestDebt.name}
              start={liveStartForCountry(largestDebt, nowMs)}
              perSecond={perSecondForCountry(largestDebt)}
            />
          ) : (
            <div className="tag">—</div>
          )}

          {fastestGrowing ? (
            <HighlightTicker
              label="Fastest growing"
              flag={fastestGrowing.flag}
              name={fastestGrowing.name}
              start={liveStartForCountry(fastestGrowing, nowMs)}
              perSecond={perSecondForCountry(fastestGrowing)}
              accent="var(--bad)"
            />
          ) : (
            <div className="tag">—</div>
          )}
        </div>
      </section>

      <section className="card section why-card" style={{ gridColumn: "1 / -1" }} aria-labelledby="why-title">
        <div>
          <h2 id="why-title" style={{ marginTop: 0, marginBottom: 16 }}>
            Why EU government debt matters
          </h2>

          <div className="why-grid" aria-label="Key reasons">
            <div className="why-point">
              <p className="why-point-title">Borrowing costs</p>
              <p className="why-point-text">
                Higher debt can make countries more exposed when interest rates rise.
              </p>
            </div>

            <div className="why-point">
              <p className="why-point-title">Fiscal flexibility</p>
              <p className="why-point-text">
                Debt levels shape how much room governments have for spending and crisis response.
              </p>
            </div>

            <div className="why-point">
              <p className="why-point-title">EU comparison</p>
              <p className="why-point-text">
                The map makes it easier to compare very different fiscal positions inside one bloc.
              </p>
            </div>
          </div>

          <div className="why-copy">
            <p style={{ marginTop: 0 }}>
              Government debt is not just an abstract economic number. It shapes what states can
              spend, how vulnerable they are to higher interest rates, and how much room they have
              to support growth, defense, pensions, infrastructure, or crisis measures.
            </p>

            <p style={{ marginBottom: 0 }}>
              Start with the live map, open a country page to compare national debt, then use{" "}
              <Link href="/eu-debt">EU debt</Link> for the broader trend and <Link href="/debt">Debt</Link>{" "}
              if you want a clearer explanation of debt, deficits, and debt-to-GDP.
            </p>
          </div>
        </div>
      </section>

      <section className="lower-grid" style={{ gridColumn: "1 / -1" }}>
        <div className="quicklist-shell">
          <QuickList
            items={quickItems}
            initialCount={10}
            strings={{
              title: "Quick list",
              showAll: "Show all",
              showLess: "Show less",
              rising: "↑ rising",
              falling: "↓ falling",
              flat: "→ flat",
              more: "more",
            }}
          />
        </div>

        <section className="card section articles-shell" style={{ alignContent: "start" }}>
          <div className="articles-head">
            <h2>Latest articles</h2>
            <Link href="/articles" className="tag">
              View all →
            </Link>
          </div>

          <div className="articles-stack">
            {topArticles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
            {topArticles.length === 0 && <div className="tag">No articles yet. Coming soon.</div>}
          </div>
        </section>
      </section>

      <section className="card section" style={{ gridColumn: "1 / -1" }} aria-labelledby="faq-title">
        <div>
          <h2 id="faq-title" style={{ marginTop: 0, marginBottom: 16 }}>
            FAQ: EU government debt
          </h2>

          <div className="faq-grid">
            <div className="faq-item">
              <h3>How is the live estimate calculated?</h3>
              <p>
                We interpolate between the last two Eurostat reference periods and extrapolate the
                change per second. Country pages include the baseline and recent direction.
              </p>
            </div>

            <div className="faq-item">
              <h3>Is this an official real-time statistic?</h3>
              <p>
                No. This is an educational visualization based on official Eurostat data. The live
                ticker is an estimate designed to make national debt easier to understand.
              </p>
            </div>

            <div className="faq-item">
              <h3>What is the difference between debt and deficit?</h3>
              <p>
                Debt is the total amount a government owes. A deficit is the gap between what a
                government spends and what it collects over a period. You can read more on the{" "}
                <Link href="/debt">Debt page</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{styles}</style>
    </main>
  );
}