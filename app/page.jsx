import Link from "next/link";
import dynamic from "next/dynamic";
import QuickList from "@/components/QuickList";
import ArticleCard from "@/components/ArticleCard";
import HighlightTicker from "@/components/HighlightTicker";
import { listArticles } from "@/lib/articles";
import { countries, trendFor, livePerSecondFor, interpolateDebt } from "@/lib/data";

// Kaart & Ticker client-only (ssr:false) => geen hydration mismatch
const EuropeMap = dynamic(() => import("@/components/EuropeMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 420, display: "grid", placeItems: "center" }} className="card" aria-busy="true">
      Loading map…
    </div>
  ),
});

const EUTotalTicker = dynamic(() => import("@/components/EUTotalTicker"), { ssr: false });

// --- SEO: generateMetadata (EN root) ---
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const title = "EU Debt Map – Live National Debt by Country (EU-27, 2025)";
  const description =
    "See EU government debt live, country by country. Interactive EU-27 debt map with real-time estimates, debt growth, and comparisons. Based on Eurostat data.";

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
      description: "Explore government debt across the EU-27 with a live, ticking estimate per country.",
      url: "https://www.eudebtmap.com/",
      siteName: "EU Debt Map",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: "Live, ticking estimates of EU government debt based on Eurostat.",
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

function formatEUR(v) {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(Math.round(v));
}

// Gedeelde live-rate bron uit lib/data
function perSecondForCountry(c) {
  return livePerSecondFor(c);
}

// Gedeelde live startwaarde, gelijk aan country pages
function liveStartForCountry(c, atMs) {
  if (!c) return 0;
  return interpolateDebt(c, atMs);
}

export default function HomePage() {
  // Alleen landen met echte waarden voor highlights/quick list
  const valid = countries.filter((c) => c && c.last_value_eur > 0 && c.prev_value_eur > 0);

  const largestDebt =
    valid.length > 0 ? valid.reduce((a, b) => (a.last_value_eur > b.last_value_eur ? a : b)) : null;

  const withDelta = valid.map((c) => ({ ...c, delta: c.last_value_eur - c.prev_value_eur }));

  const fastestGrowing =
    withDelta.length > 0 ? withDelta.reduce((a, b) => (a.delta > b.delta ? a : b)) : null;

  const quickItems = valid.map((c) => ({
    code: c.code,
    name: c.name,
    flag: c.flag,
    trend: trendFor(c),
  }));

  const topArticles = listArticles({ lang: "en" }).slice(0, 3);

  // Één gedeeld tijdstip zodat beide highlight-boxen op dezelfde referentie starten
  const nowMs = Date.now();

  const responsiveCss = `
    .ql-articles{
      display:grid;
      gap:12px;
      grid-template-columns: minmax(260px, 1fr) minmax(260px, 1fr);
    }
    @media (max-width: 920px){
      .ql-articles{ grid-template-columns: 1fr !important; }
    }

    .hero-lede, .tag, .hero-title {
      width: 100%;
      max-width: 760px;
      display: block;
      clear: both;
    }

    .card-content-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }
  `;

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://www.eudebtmap.com/",
    name: "EU Debt Map",
    inLanguage: "en"
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
            "We interpolate between the last two Eurostat reference periods and extrapolate per second. Country pages include the baseline and trend indicator."
        }
      },
      {
        "@type": "Question",
        name: "Is this an official statistic?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No. It’s an educational visualization based on official data to improve understanding and spark discussion."
        }
      }
    ]
  };

  const s = {
    mapFooter: {
      marginTop: 12,
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: 12,
      background: "#f9fafb",
      boxShadow: "var(--shadow-sm)",
    },
    legend: { fontSize: 14, lineHeight: 1.5, color: "var(--fg)" },
    pill: {
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 999,
      fontWeight: 600,
      fontSize: 12,
      border: "1px solid transparent",
      marginRight: 4,
      marginLeft: 4,
      background: "#f3f4f6",
      color: "#0b1220",
    },
    pillOk: { color: "var(--ok)", borderColor: "#bbf7d0", background: "#ecfdf5" },
    pillBad: { color: "var(--bad)", borderColor: "#fecaca", background: "#fef2f2" },
    sep: { margin: "0 8px", color: "#94a3b8" },
    muted: { color: "#4a617b" },
    cta: {
      marginTop: 10,
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 12px",
      borderRadius: 10,
      background: "#ffffff",
      border: "1px dashed #cbd5e1",
      textAlign: "center",
      justifyContent: "center",
      fontSize: 14,
      lineHeight: 1.6,
      fontWeight: 600,
      color: "#0b1220",
    },
    ctaIcon: { fontSize: 16, opacity: 0.9, transform: "translateY(1px)" },
    heroCta: {
      marginTop: 14,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "10px 14px",
      borderRadius: 999,
      border: "1px solid #dbeafe",
      background: "#eff6ff",
      color: "#1d4ed8",
      textDecoration: "none",
      fontSize: 14,
      fontWeight: 700,
      alignSelf: "flex-start",
      boxShadow: "0 4px 10px rgba(37,99,235,0.08)",
    },
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="card section" style={{ gridColumn: "1 / -1" }} aria-labelledby="page-title">
        <div className="card-content-wrapper">
          <header style={{ maxWidth: 760, width: "100%" }}>
            <h1
              id="page-title"
              className="hero-title"
              style={{
                fontSize: "clamp(1.8rem, 4vw + 1rem, 3rem)",
                background: "linear-gradient(90deg, #2563eb, #00875a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 8,
                display: "block",
                width: "100%"
              }}
            >
              Live EU Government Debt Map
            </h1>

            <p className="hero-lede" style={{ maxWidth: 760 }}>
              <span style={{ fontWeight: 600 }}>
                See the combined public debt of all 27 EU countries as a live estimate.
              </span>
            </p>

            <p className="hero-lede" style={{ maxWidth: 760, marginTop: 10 }}>
              Built from the latest Eurostat data and updated second by second. Click any country to view its debt ticker, recent trend, and debt-to-GDP context.
            </p>

            <p
              className="tag"
              style={{
                marginTop: 14,
                paddingTop: 10,
                borderTop: "1px solid var(--border)",
                color: "#4b5563",
              }}
            >
              Source: Eurostat (<code className="mono">gov_10q_ggdebt</code>). Live values are estimates based on the latest quarterly data, not official real-time statistics.
            </p>
          </header>

          <div style={{ marginTop: 16, width: "100%", clear: "both" }}>
            <EUTotalTicker />
          </div>

          <Link href="/eu-debt" style={s.heroCta}>
            Explore EU debt over time: 5-year chart and debt by country →
          </Link>
        </div>
      </section>

      <section className="card section" style={{ gridColumn: "1 / -1", gap: 16 }}>
        <div className="card-content-wrapper">
          <h2 style={{ marginTop: 4 }}>EU overview</h2>

          <div className="mapWrap" role="region" aria-label="Interactive EU map" style={{ width: "100%", clear: "both" }}>
            <EuropeMap />
          </div>

          <div role="note" aria-label="Map legend and action" style={s.mapFooter}>
            <div style={s.legend}>
              <strong>Legend:</strong>
              <span style={{ ...s.pill, ...s.pillOk }}>Green</span>= debt falling
              <span style={s.sep}>•</span>
              <span style={{ ...s.pill, ...s.pillBad }}>Red</span>= debt rising
              <span style={s.sep}>•</span>
              <span style={s.muted}>Based on the last two reference dates.</span>
            </div>

            <div style={s.cta}>
              <span aria-hidden style={s.ctaIcon}>➜</span>
              <span>
                <strong>Click any country</strong> on the map to see its live debt ticker.
              </span>
            </div>
          </div>

          <div className="tag" style={{ marginTop: 8, lineHeight: 1.7 }}>
            <h3 style={{ margin: "8px 0" }}>New: EU debt over time</h3>
            <p style={{ margin: 0 }}>
              See the 5-year EU debt chart and country breakdown on the dedicated analysis page.{" "}
              <Link href="/eu-debt">Open the analysis</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <div className="card-content-wrapper">
          <h2 style={{ marginTop: 0 }}>Highlights</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 12,
              marginTop: 8,
            }}
          >
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

          <p className="tag" style={{ marginTop: 12 }}>
            Government debt shapes interest rates, inflation, fiscal policy, and the broader EU economy. These live tickers surface the biggest movements at a glance.
          </p>
        </div>
      </section>

      <section className="ql-articles" style={{ gridColumn: "1 / -1" }}>
        <section className="card section">
          <div className="card-content-wrapper">
            <QuickList
              items={quickItems}
              initialCount={quickItems.length}
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
        </section>

        <section className="card section" style={{ alignContent: "start" }}>
          <div className="card-content-wrapper">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <h2 style={{ margin: 0, flex: 1 }}>Latest articles</h2>
              <Link href="/articles" className="tag">View all →</Link>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {topArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
              {topArticles.length === 0 && <div className="tag">No articles yet. Coming soon.</div>}
            </div>
          </div>
        </section>
      </section>

      <section className="card section" style={{ gridColumn: "1 / -1" }} aria-labelledby="faq-title">
        <div className="card-content-wrapper">
          <h2 id="faq-title" style={{ marginTop: 0 }}>FAQ: EU government debt</h2>

          <h3 style={{ marginBottom: 6 }}>How is the live estimate calculated?</h3>
          <p className="tag" style={{ marginTop: 0 }}>
            We interpolate between the last two Eurostat reference periods and extrapolate per second. Country pages include the baseline and trend indicator.
          </p>

          <h3 style={{ marginBottom: 6 }}>Is this an official statistic?</h3>
          <p className="tag" style={{ marginTop: 0 }}>
            No. It’s an educational visualization based on official data to improve understanding and spark discussion.
          </p>
        </div>
      </section>

      <style>{responsiveCss}</style>
    </main>
  );
}