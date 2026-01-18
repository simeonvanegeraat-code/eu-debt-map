import Link from "next/link";
import dynamic from "next/dynamic";
import QuickList from "@/components/QuickList";
import ArticleCard from "@/components/ArticleCard";
import HighlightTicker from "@/components/HighlightTicker";
import { listArticles } from "@/lib/articles";
import { countries, trendFor } from "@/lib/data";

const EuropeMap = dynamic(() => import("@/components/EuropeMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 420, display: "grid", placeItems: "center" }} className="card" aria-busy="true">
      Karte wird geladen…
    </div>
  ),
});

const EUTotalTicker = dynamic(() => import("@/components/EUTotalTicker"), { ssr: false });

export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com/de");
  const title = "EU Schuldenuhr – Live Staatsschulden nach Ländern (EU-27, 2025)";
  const description =
    "Sehen Sie die EU-Staatsverschuldung live, Land für Land. Interaktive Karte der EU-27 mit Echtzeit-Schätzungen, Schuldenwachstum und Vergleichen.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: "https://www.eudebtmap.com/de",
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
      url: "https://www.eudebtmap.com/de",
      siteName: "EU Debt Map",
      type: "website",
    },
  };
}

function perSecondForCountry(c) {
  if (!c) return 0;
  if (typeof c.per_second === "number") return c.per_second;

  const delta = (c.last_value_eur ?? 0) - (c.prev_value_eur ?? 0);
  if (typeof c.seconds_between === "number" && c.seconds_between > 0) {
    return delta / c.seconds_between;
  }
  const approxSeconds = 90 * 24 * 60 * 60;
  return delta / approxSeconds;
}

export default function HomePageDE() {
  const valid = countries.filter((c) => c && c.last_value_eur > 0 && c.prev_value_eur > 0);
  const largestDebt = valid.length > 0 ? valid.reduce((a, b) => (a.last_value_eur > b.last_value_eur ? a : b)) : null;
  const withDelta = valid.map((c) => ({ ...c, delta: c.last_value_eur - c.prev_value_eur }));
  const fastestGrowing = withDelta.length > 0 ? withDelta.reduce((a, b) => (a.delta > b.delta ? a : b)) : null;

  const quickItems = valid.map((c) => ({
    code: c.code,
    name: c.name,
    flag: c.flag,
    trend: trendFor(c),
  }));

  // ARTIKEL DUITS
  const topArticles = listArticles({ lang: "de" }).slice(0, 3);

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
      
      {/* === HERO === */}
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
                width: "100%"
              }}
            >
              Live EU Schuldenuhr
            </h1>
            <p className="hero-lede" style={{ maxWidth: 760 }}>
              <span style={{ fontWeight: 600 }}>
                Wenn man jeden Euro Staatsschulden aller 27 EU-Länder zusammenzählt, erhält man die unten stehende Zahl: eine Live-Schätzung, die niemals stillsteht.
              </span>
            </p>
          </header>

          <div style={{ marginTop: 16, width: "100%", clear: "both" }}>
            <EUTotalTicker />
          </div>

          <p className="hero-lede" style={{ maxWidth: 760, marginTop: 18 }}>
            Die EU Debt Map visualisiert die kombinierten Staatsschulden der Europäischen Union in Echtzeit.
            Der aktuellste Eurostat-Datenpunkt dient als Basis und wird sekündlich extrapoliert.
            Dies ist nicht nur eine Statistik, sondern ein Puls der finanziellen Gesundheit Europas. Egal ob Sie Frankreich mit Deutschland vergleichen
            oder kleinere Volkswirtschaften wie Estland untersuchen: Diese Karte macht komplexe Steuerdaten verständlich.
          </p>

          <p className="tag" style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid var(--border)", color: "#4b5563" }}>
            Quelle: Eurostat (<code className="mono">gov_10q_ggdebt</code>). Bildungszwecke, keine offizielle Statistik.
          </p>
        </div>
      </section>

      {/* === MAP === */}
      <section className="card section" style={{ gridColumn: "1 / -1", gap: 16 }}>
        <div className="card-content-wrapper">
          <h2 style={{ marginTop: 4 }}>EU-Übersicht</h2>

          <div className="mapWrap" role="region" aria-label="Interaktive EU Karte" style={{ width: "100%", clear: "both" }}>
            <EuropeMap />
          </div>

          <div style={s.mapFooter}>
            <div style={s.legend}>
              <strong>Legende:</strong>
              <span style={{ ...s.pill, ...s.pillOk }}>Grün</span>= sinkend
              <span style={s.sep}>•</span>
              <span style={{ ...s.pill, ...s.pillBad }}>Rot</span>= steigend
              <span style={s.sep}>•</span>
              <span style={s.muted}>Basierend auf den letzten zwei Referenzdaten.</span>
            </div>
            <div style={s.cta}>
              <span aria-hidden style={s.ctaIcon}>➜</span>
              <span>
                <strong>Klicken Sie auf ein Land</strong> für den Live-Ticker.
              </span>
            </div>
          </div>

          <div className="tag" style={{ marginTop: 6, lineHeight: 1.7 }}>
            <h3 style={{ margin: "8px 0" }}>EU-Schulden einfach erklärt</h3>
            <p style={{ margin: 0 }}>
              Diese Karte zeigt die Staatsverschuldung aller EU-27 Länder in Echtzeit. Mit Eurostat als Basis wird der letzte offizielle Wert pro Sekunde berechnet. Klicken Sie auf ein Land, um zu sehen, ob die Schulden steigen oder fallen.
            </p>
          </div>
        </div>
      </section>

      {/* === HIGHLIGHTS === */}
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <div className="card-content-wrapper">
          <h2 style={{ marginTop: 0 }}>Highlights</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginTop: 8 }}>
            {largestDebt ? (
              <HighlightTicker
                label="Höchste Schulden"
                flag={largestDebt.flag}
                name={largestDebt.name}
                start={largestDebt.last_value_eur}
                perSecond={perSecondForCountry(largestDebt)}
              />
            ) : <div className="tag">—</div>}

            {fastestGrowing ? (
              <HighlightTicker
                label="Schnellstes Wachstum"
                flag={fastestGrowing.flag}
                name={fastestGrowing.name}
                start={fastestGrowing.last_value_eur}
                perSecond={perSecondForCountry(fastestGrowing)}
                accent="var(--bad)"
              />
            ) : <div className="tag">—</div>}
          </div>

          <p className="tag" style={{ marginTop: 12 }}>
            Staatsschulden beeinflussen Zinssätze, Inflation und die gesamte EU-Wirtschaft. Diese Live-Ticker zeigen die größten Bewegungen auf einen Blick.
          </p>
        </div>
      </section>

      {/* === QUICK LIST + ARTICLES === */}
      <section className="ql-articles" style={{ gridColumn: "1 / -1" }}>
        <section className="card section">
            <div className="card-content-wrapper">
                <QuickList
                    items={quickItems}
                    initialCount={quickItems.length}
                    strings={{
                    title: "Schnellliste",
                    showAll: "Alle anzeigen",
                    showLess: "Weniger anzeigen",
                    rising: "↑ steigend",
                    falling: "↓ sinkend",
                    flat: "→ stabil",
                    more: "mehr",
                    }}
                />
            </div>
        </section>

        <section className="card section" style={{ alignContent: "start" }}>
          <div className="card-content-wrapper">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <h2 style={{ margin: 0, flex: 1 }}>Neueste Artikel</h2>
                <Link href="/de/articles" className="tag">Alle ansehen →</Link>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
                {topArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
                ))}
                {topArticles.length === 0 && <div className="tag">Noch keine Artikel. Bald verfügbar.</div>}
            </div>
          </div>
        </section>
      </section>

      {/* === FAQ === */}
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <div className="card-content-wrapper">
            <h2 style={{ marginTop: 0 }}>FAQ: EU-Staatsschulden</h2>
            <h3 style={{ marginBottom: 6 }}>Wie wird die Schätzung berechnet?</h3>
            <p className="tag" style={{ marginTop: 0 }}>
            Wir interpolieren zwischen den letzten zwei Eurostat-Referenzperioden und extrapolieren pro Sekunde. Auf den Länderseiten finden Sie die Basiswerte.
            </p>
            <h3 style={{ marginBottom: 6 }}>Ist dies eine offizielle Statistik?</h3>
            <p className="tag" style={{ marginTop: 0 }}>
            Nein. Es ist eine pädagogische Visualisierung auf Basis offizieller Daten, die Verständnis schaffen und Diskussionen anregen soll.
            </p>
        </div>
      </section>

      <style>{responsiveCss}</style>
    </main>
  );
}