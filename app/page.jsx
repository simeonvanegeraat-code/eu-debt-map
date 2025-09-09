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

export const metadata = {
  title: "EU Debt Map | Explore national debts across the EU-27",
  description:
    "Interactive EU map with live, ticking estimates of government debt for EU-27 countries. Based on the last two Eurostat reference periods.",
  openGraph: {
    title: "EU Debt Map",
    description:
      "Explore government debt across the EU-27 with a live, ticking estimate per country.",
    url: "https://www.eudebtmap.com/",
    siteName: "EU Debt Map",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EU Debt Map",
    description: "Live, ticking estimates of EU government debt based on Eurostat.",
  },
  metadataBase: new URL("https://www.eudebtmap.com"),
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
};

function formatEUR(v) {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(Math.round(v));
}

// Bepaal groei per seconde voor een land
function perSecondForCountry(c) {
  if (!c) return 0;
  if (typeof c.per_second === "number") return c.per_second;

  const delta = (c.last_value_eur ?? 0) - (c.prev_value_eur ?? 0);
  // Gebruik exacte secondes als die in je dataset zit
  if (typeof c.seconds_between === "number" && c.seconds_between > 0) {
    return delta / c.seconds_between;
  }
  // Fallback: ~90 dagen tussen twee kwartalen
  const approxSeconds = 90 * 24 * 60 * 60;
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

  const s = {
    mapFooter: {
      marginTop: 12,
      border: "1px solid #203044",
      borderRadius: 12,
      padding: 12,
      background: "rgba(15,23,42,0.6)",
    },
    legend: { fontSize: 14, lineHeight: 1.5 },
    pill: {
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 999,
      fontWeight: 600,
      fontSize: 12,
      border: "1px solid transparent",
      marginRight: 4,
      marginLeft: 4,
    },
    pillOk: { color: "var(--ok)", borderColor: "#1f4d3a", background: "rgba(34,197,94,.08)" },
    pillBad: { color: "var(--bad)", borderColor: "#5a1f2a", background: "rgba(239,68,68,.08)" },
    sep: { margin: "0 8px", color: "#2b3444" },
    muted: { color: "#9ca3af" },
    cta: {
      marginTop: 10,
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 12px",
      borderRadius: 10,
      background: "rgba(255,255,255,0.03)",
      border: "1px dashed #2a3a4f",
      textAlign: "center",
      justifyContent: "center",
      fontSize: 14,
      lineHeight: 1.6,
      fontWeight: 600,
    },
    ctaIcon: { fontSize: 16, opacity: 0.9, transform: "translateY(1px)" },
  };

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

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      {/* === HERO === */}
      <section
        className="card"
        style={{ gridColumn: "1 / -1", display: "grid", gap: 12, alignItems: "stretch" }}
        aria-labelledby="page-title"
      >
        <div style={{ display: "grid", gap: 6 }}>
          <h1 id="page-title" style={{ margin: 0 }}>
            See EU Government Debt, live
          </h1>
          <p className="tag" style={{ margin: 0 }}>
            Interactive map with per-country ticking estimates based on the last two Eurostat
            quarters.
          </p>
          <p className="tag" style={{ margin: 0 }}>
            Source: Eurostat (gov_10q_ggdebt). Educational visualization, not an official
            statistic.
          </p>
        </div>

        {/* EU-27 Total (live) */}
        <EUTotalTicker />
      </section>

      {/* === MAP === */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
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
      </section>

      {/* === HIGHLIGHTS (nu live tikkend) === */}
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2 style={{ marginTop: 0 }}>EU debt highlights</h2>

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

        <div style={{ marginTop: 12 }} className="tag">
          Why does debt matter? Government debt influences interest rates, inflation, and the
          stability of the EU economy. This project makes those big numbers visible at a glance.
        </div>
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

        <div className="card" style={{ display: "grid", gap: 10, alignContent: "start" }}>
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

      <style>{responsiveCss}</style>
    </main>
  );
}
