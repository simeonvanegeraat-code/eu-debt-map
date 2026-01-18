import Link from "next/link";
import dynamic from "next/dynamic";
import QuickList from "@/components/QuickList";
import ArticleCard from "@/components/ArticleCard";
import HighlightTicker from "@/components/HighlightTicker";
import { listArticles } from "@/lib/articles";
import { countries, trendFor } from "@/lib/data";

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

// Bepaal groei per seconde voor een land
function perSecondForCountry(c) {
  if (!c) return 0;
  if (typeof c.per_second === "number") return c.per_second;

  const delta = (c.last_value_eur ?? 0) - (c.prev_value_eur ?? 0);
  if (typeof c.seconds_between === "number" && c.seconds_between > 0) {
    return delta / c.seconds_between;
  }
  const approxSeconds = 90 * 24 * 60 * 60; // ~90 dagen tussen kwartalen
  return delta / approxSeconds;
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

  // Toegevoegd: extra CSS regels (.hero-lede, .tag, .card-content) om te forceren dat elementen 
  // niet naast advertenties gaan drijven (clearing floats) en breedte behouden.
  const responsiveCss = `
    .ql-articles{
      display:grid;
      gap:12px;
      grid-template-columns: minmax(260px, 1fr) minmax(260px, 1fr);
    }
    @media (max-width: 920px){
      .ql-articles{ grid-template-columns: 1fr !important; }
    }
    
    /* Layout Hardening tegen advertenties */
    .hero-lede, .tag, .hero-title {
       width: 100%;
       max-width: 760px;
       display: block;
       clear: both; /* Voorkomt dat tekst naast een zwevende advertentie gepropt wordt */
    }
    .card-content-wrapper {
       width: 100%;
       display: flex;
       flex-direction: column;
       /* Zorgt dat padding overal consistent is binnen de card */
       box-sizing: border-box; 
    }
  `;

  // --- JSON-LD (Website + Organization) ---
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

  // Extra: FAQ schema (non-breaking SEO enhancement)
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

  // Light-styles
  const s = {
    mapFooter: {
      marginTop: 12,
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: 12,
      background: "#f9fafb", // subtiel subpaneel
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
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* === HERO === */}
      <section className="card section" style={{ gridColumn: "1 / -1" }} aria-labelledby="page-title">
        {/* Wrapper om content bij elkaar te houden als er advertenties in de <section> worden geïnjecteerd */}
        <div className="card-content-wrapper">
          <header style={{ maxWidth: 760, width: "100%" }}>
            <h1
              id="page-title"
              className="hero-title"
              style={{
                fontSize: "clamp(1.8rem, 4vw + 1rem, 3rem)", // iets kleinere max op mobiel
                background: "linear-gradient(90deg, #2563eb, #00875a)", // donkerder groen voor contrast
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 8,
                display: "block",
                width: "100%"
              }}
            >
              Live EU Government Debt Map
            </h1>

            {/* Korte intro met semibold eerste zin */}
            <p className="hero-lede" style={{ maxWidth: 760 }}>
              <span style={{ fontWeight: 600 }}>
                If you added together every euro of public debt from all 27 EU countries, you’d get the number shown below, a live, ticking estimate that never stands still.
              </span>
            </p>
          </header>

          {/* EU-27 Total (live) – direct onder de intro */}
          {/* clear:both zorgt dat hij onder eventuele zwevende ads komt, width:100% forceert blok */}
          <div style={{ marginTop: 16, width: "100%", clear: "both" }}>
            <EUTotalTicker />
          </div>

          {/* Uitlegblok onder de teller */}
          <p className="hero-lede" style={{ maxWidth: 760, marginTop: 18 }}>
            The EU Debt Map visualizes the combined national debts of the European Union in real time.
            Each country’s most recent Eurostat data point is used as a baseline, then projected second by
            second to show how fast public debt continues to grow (or, in rare cases, shrink). This isn’t
            just a statistic, it’s a pulse of Europe’s financial health. Whether you’re comparing France
            to Germany, tracking Italy’s debt ratio, or exploring smaller economies like Estonia and Malta,
            this map translates complex fiscal data into an intuitive visual that updates every second.
          </p>

          {/* Bronregel onder de uitleg */}
          <p
            className="tag"
            style={{
              marginTop: 14,
              paddingTop: 10,
              borderTop: "1px solid var(--border)",
              color: "#4b5563",
            }}
          >
            Source: Eurostat (<code className="mono">gov_10q_ggdebt</code>). Educational visualization, not an official statistic.
          </p>
        </div>
      </section>

      {/* === MAP === */}
      <section className="card section" style={{ gridColumn: "1 / -1", gap: 16 }}>
        <div className="card-content-wrapper">
          <h2 style={{ marginTop: 4 }}>EU overview</h2>

          <div className="mapWrap" role="region" aria-label="Interactive EU map" style={{ width: "100%", clear: "both" }}>
            <EuropeMap />
          </div>

          {/* Legend + CTA (subpaneel) */}
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

          {/* Korte uitleg onder de kaart (SEO) */}
          <div className="tag" style={{ marginTop: 6, lineHeight: 1.7 }}>
            <h3 style={{ margin: "8px 0" }}>EU debt explained in simple terms</h3>
            <p style={{ margin: 0 }}>
              This EU Debt Map shows the national debt of all EU-27 countries in real time. Using Eurostat as a baseline, each country’s latest official figure is extrapolated per second to create a live, ticking estimate. Click any country to drill into its numbers and see whether debt is rising or falling. This is an educational visualization—not an official statistic.
            </p>
          </div>
        </div>
      </section>

      {/* === HIGHLIGHTS === */}
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        {/* Wrapper added here too for consistency and ad-protection */}
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
                start={largestDebt.last_value_eur}
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
                start={fastestGrowing.last_value_eur}
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

      {/* === QUICK LIST + LATEST ARTICLES === */}
      <section className="ql-articles" style={{ gridColumn: "1 / -1" }}>
        {/* Quick List: Wrapped in card section + card-content-wrapper for consistent padding */}
        <section className="card section">
            <div className="card-content-wrapper">
                <QuickList
                    items={quickItems}
                    initialCount={quickItems.length} // toon alles standaard
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

        {/* Latest Articles: Wrapped content in card-content-wrapper to fix padding issues */}
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

      {/* Mini-FAQ (extra SEO) */}
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