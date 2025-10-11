// app/page.jsx
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
    <div style={{ height: 420, display: "grid", placeItems: "center" }} className="card">
      Loading map…
    </div>
  ),
});

const EUTotalTicker = dynamic(() => import("@/components/EUTotalTicker"), {
  ssr: false,
});

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

  const withDelta = valid.map((c) => ({
    ...c,
    delta: c.last_value_eur - c.prev_value_eur,
  }));

  const fastestGrowing =
    withDelta.length > 0 ? withDelta.reduce((a, b) => (a.delta > b.delta ? a : b)) : null;

  const quickItems = valid.map((c) => ({
    code: c.code,
    name: c.name,
    flag: c.flag,
    trend: trendFor(c),
  }));

  const topArticles = listArticles().slice(0, 3);

  const responsiveCss = `
    .ql-articles{
      display:grid;
      gap:12px;
      grid-template-columns: minmax(260px, 1fr) minmax(260px, 1fr);
    }
    @media (max-width: 920px){
      .ql-articles{ grid-template-columns: 1fr !important; }
    }
  `;

  // --- JSON-LD (Website + Organization) ---
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://www.eudebtmap.com/",
    name: "EU Debt Map",
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.eudebtmap.com/country/{country}",
      "query-input": "required name=country",
    },
  };
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EU Debt Map",
    url: "https://www.eudebtmap.com/",
    sameAs: ["https://www.eudebtmap.com/"],
  };

  // Light-styles voor mapfooter pills (bewust lokaal gehouden)
  const s = {
    mapFooter: {
      marginTop: 12,
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: 12,
      background: "#ffffff",
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
      background: "#f8fafc",
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

      {/* === HERO === */}
      <section className="card section" style={{ gridColumn: "1 / -1" }} aria-labelledby="page-title">
        <header>
          <h1 id="page-title" className="hero-title">
            Live EU Government Debt Map
          </h1>
          <p className="hero-lede">
            Interactive EU-27 map with per-country ticking estimates based on the last two Eurostat
            reference periods.
          </p>
          <p className="tag" style={{ marginTop: 6 }}>
            Source: Eurostat (<code className="mono">gov_10q_ggdebt</code>). Educational
            visualization, not an official statistic.
          </p>
        </header>

        {/* EU-27 Total (live) */}
        <EUTotalTicker />
      </section>

      {/* === MAP === */}
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <h2 style={{ marginTop: 0 }}>EU overview</h2>

        <div className="mapWrap" role="region" aria-label="Interactive EU map">
          <EuropeMap />
        </div>

        {/* Legend + CTA */}
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
        <div className="tag" style={{ marginTop: 14, lineHeight: 1.7 }}>
          <h3 style={{ margin: "8px 0" }}>EU debt explained in simple terms</h3>
          <p style={{ margin: 0 }}>
            This EU Debt Map shows the national debt of all EU-27 countries in real time. Using
            Eurostat as a baseline, each country’s latest official figure is extrapolated per second
            to create a live, ticking estimate. Click any country to drill into its numbers and see
            whether debt is rising or falling. This is an educational visualization—not an official
            statistic.
          </p>
        </div>
      </section>

      {/* === HIGHLIGHTS === */}
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <h2 style={{ marginTop: 0 }}>Highlights</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 12,
            marginTop: 8,
          }}
        >
          {/* Largest debt – live */}
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

          {/* Fastest growing – live */}
          {fastestGrowing ? (
            <HighlightTicker
              label="Fastest growing"
              flag={fastestGrowing.flag}
              name={fastestGrowing.name}
              start={fastestGrowing.last_value_eur}
              perSecond={perSecondForCountry(fastestGrowing)}
              accent="var(--bad)" // forceer rood accent voor “growing”
            />
          ) : (
            <div className="tag">—</div>
          )}
        </div>

        <p className="tag" style={{ marginTop: 12 }}>
          Government debt shapes interest rates, inflation, fiscal policy, and the broader EU
          economy. These live tickers surface the biggest movements at a glance.
        </p>
      </section>

      {/* === QUICK LIST + LATEST ARTICLES === */}
      <section className="ql-articles" style={{ gridColumn: "1 / -1" }}>
        <div>
          <QuickList
            items={quickItems}
            initialCount={8}
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

        <div className="card section" style={{ alignContent: "start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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

      {/* Mini-FAQ (extra SEO) */}
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <h2 style={{ marginTop: 0 }}>FAQ: EU government debt</h2>

        <h3 style={{ marginBottom: 6 }}>How is the live estimate calculated?</h3>
        <p className="tag" style={{ marginTop: 0 }}>
          We interpolate between the last two Eurostat reference periods and extrapolate per second.
          Country pages include the baseline and trend indicator.
        </p>

        <h3 style={{ marginBottom: 6 }}>Is this an official statistic?</h3>
        <p className="tag" style={{ marginTop: 0 }}>
          No. It’s an educational visualization based on official data to improve understanding and
          spark discussion.
        </p>
      </section>

      <style>{responsiveCss}</style>
    </main>
  );
}
