import Link from "next/link";
import dynamic from "next/dynamic";
import QuickList from "@/components/QuickList";
import ArticleCard from "@/components/ArticleCard";
import HighlightTicker from "@/components/HighlightTicker";
import { listArticles } from "@/lib/articles";
import { countries, trendFor, livePerSecondFor, interpolateDebt } from "@/lib/data";

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

const EUTotalTicker = dynamic(() => import("@/components/EUTotalTicker"), {
  ssr: false,
});

export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const title = "EU Debt Map – Live Government Debt by Country (EU-27, 2025)";
  const description =
    "Track EU government debt live, country by country. Interactive EU-27 debt map with real-time estimates, debt growth, and country comparisons based on Eurostat data.";

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
      description,
      url: "https://www.eudebtmap.com/",
      siteName: "EU Debt Map",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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

export default function HomePage() {
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
    .hero-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
    }
    .meta-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 34px;
      padding: 0 12px;
      border: 1px solid #dbe4ef;
      border-radius: 999px;
      background: rgba(255,255,255,0.94);
      color: #50667f;
      font-size: 13px;
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
      text-decoration: none;
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
      min-height: 48px;
      padding: 0 18px;
      border-radius: 999px;
      text-decoration: none;
      font-weight: 700;
      transition: transform .08s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease;
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
    @media (max-width: 640px) {
      .hero-actions {
        flex-direction: column;
        align-items: stretch;
      }
      .hero-btn-primary,
      .hero-btn-secondary {
        width: 100%;
      }
    }
  `;

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
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <div className="card-content-wrapper">
          <header style={{ maxWidth: 760, width: "100%" }}>
            <h1
              className="hero-title"
              style={{
                fontSize: "clamp(1.8rem, 4vw + 1rem, 3rem)",
                background: "linear-gradient(90deg, #2563eb, #00875a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 8,
                display: "block",
                width: "100%",
              }}
            >
              Live EU Government Debt Map
            </h1>

            <p className="hero-lede" style={{ maxWidth: 760 }}>
              <span style={{ fontWeight: 600 }}>
                If you add up every euro of government debt across all 27 EU countries, you get the
                number below: a live estimate that never stands still.
              </span>
            </p>
          </header>

          <div style={{ marginTop: 16, width: "100%", clear: "both" }}>
            <EUTotalTicker />
          </div>

          <p className="hero-lede" style={{ maxWidth: 760, marginTop: 18 }}>
            EU Debt Map visualises the combined government debt of the European Union in real time.
            The latest Eurostat reference point is used as the base for each country and then
            extrapolated second by second. This is not just another statistic, it is a live way to
            understand the financial position of Europe. Whether you compare France with Germany,
            follow Italy’s debt, or look at smaller economies such as Estonia, this map turns
            complex fiscal data into something easier to grasp.
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

          <p
            className="tag"
            style={{
              marginTop: 14,
              paddingTop: 10,
              borderTop: "1px solid var(--border)",
              color: "#4b5563",
            }}
          >
            Source: Eurostat (<code className="mono">gov_10q_ggdebt</code>). Educational
            visualisation, not an official real-time statistic.
          </p>
        </div>
      </section>

      <section className="card section" style={{ gridColumn: "1 / -1", gap: 16 }}>
        <div className="card-content-wrapper">
          <h2 style={{ marginTop: 4 }}>EU overview</h2>

          <div
            className="mapWrap"
            role="region"
            aria-label="Interactive EU map"
            style={{ width: "100%", clear: "both" }}
          >
            <EuropeMap />
          </div>

          <div style={s.mapFooter}>
            <div style={s.legend}>
              <strong>Legend:</strong>
              <span style={{ ...s.pill, ...s.pillOk }}>Green</span>= debt falling
              <span style={s.sep}>•</span>
              <span style={{ ...s.pill, ...s.pillBad }}>Red</span>= debt rising
              <span style={s.sep}>•</span>
              <span style={s.muted}>Based on the latest two reference dates.</span>
            </div>
            <div style={s.cta}>
              <span aria-hidden style={s.ctaIcon}>➜</span>
              <span>
                <strong>Click any country</strong> on the map to open its live debt ticker.
              </span>
            </div>
          </div>

          <div className="tag" style={{ marginTop: 6, lineHeight: 1.7 }}>
            <h3 style={{ margin: "8px 0" }}>EU debt made simple</h3>
            <p style={{ margin: 0 }}>
              This map shows the government debt of all EU-27 countries in real time. Using
              Eurostat as the foundation, the latest official figure is extended per second into a
              live estimate. Click any country to explore the numbers and see whether debt is rising
              or falling.
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
            Government debt affects interest rates, inflation, and the wider economy. These live
            tickers show the biggest movements at a glance.
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
                title: "Quick overview",
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
              <Link href="/articles" className="tag">
                View all →
              </Link>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {topArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
              {topArticles.length === 0 && (
                <div className="tag">No articles yet. More coming soon.</div>
              )}
            </div>
          </div>
        </section>
      </section>

      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <div className="card-content-wrapper">
          <h2 style={{ marginTop: 0 }}>FAQ: EU government debt</h2>

          <h3 style={{ marginBottom: 6 }}>How is the live estimate calculated?</h3>
          <p className="tag" style={{ marginTop: 0 }}>
            We interpolate between the latest two Eurostat reference periods and extrapolate the
            result per second. On the country pages you can find the underlying baseline values.
          </p>

          <h3 style={{ marginBottom: 6 }}>Is this an official statistic?</h3>
          <p className="tag" style={{ marginTop: 0 }}>
            No. It is an educational visualisation based on official data, designed to make EU
            government debt easier to understand and compare.
          </p>
        </div>
      </section>

      <style>{responsiveCss}</style>
    </main>
  );
}