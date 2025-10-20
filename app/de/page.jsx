// app/de/page.jsx
import Link from "next/link";
import dynamic from "next/dynamic";
import QuickList from "@/components/QuickList";
import ArticleCard from "@/components/ArticleCard";
import HighlightTicker from "@/components/HighlightTicker";
import { listArticles } from "@/lib/articles";
import { countries, trendFor } from "@/lib/data";

// Nur Client-seitig rendern
const EuropeMap = dynamic(() => import("@/components/EuropeMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 420, display: "grid", placeItems: "center" }} className="card">
      Karte wird geladen…
    </div>
  ),
});

const EUTotalTicker = dynamic(() => import("@/components/EUTotalTicker"), { ssr: false });

// --- SEO: generateMetadata (DE) ---
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const title = "EU-Schuldenkarte – Live-Staatsschulden nach Land (EU-27, 2025)";
  const description =
    "Sehen Sie die aktuelle Staatsverschuldung der EU-Länder in Echtzeit. Interaktive EU-27-Karte mit laufenden Schätzungen und Vergleichen. Datenquelle: Eurostat.";

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
      },
    },
    openGraph: {
      title,
      description:
        "Entdecken Sie die Staatsverschuldung der EU-Länder mit einer Live-Schätzung pro Land.",
      url: "https://www.eudebtmap.com/de",
      siteName: "EU Debt Map",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description:
        "Live-Schätzungen der europäischen Staatsverschuldung basierend auf Eurostat-Daten.",
    },
  };
}

// Wachstum pro Sekunde berechnen
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

  const topArticles = listArticles({ lang: "de" }).slice(0, 3);

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
      margin: "0 4px",
      background: "#f3f4f6",
      color: "#0b1220",
    },
    pillOk: { color: "var(--ok)", background: "#ecfdf5" },
    pillBad: { color: "var(--bad)", background: "#fef2f2" },
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      {/* HERO */}
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <header style={{ maxWidth: 760 }}>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw + 1rem, 3rem)",
              background: "linear-gradient(90deg, #2563eb, #00875a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 8,
            }}
          >
            Live EU-Schuldenkarte
          </h1>
          <p style={{ fontWeight: 600 }}>
            Wenn man die gesamten Staatsschulden aller 27 EU-Länder zusammenrechnet, ergibt sich die Zahl unten — eine Live-Schätzung, die niemals stillsteht.
          </p>
        </header>

        <div style={{ marginTop: 16 }}>
          <EUTotalTicker />
        </div>

        <p style={{ marginTop: 18 }}>
          Die EU-Schuldenkarte zeigt die kombinierten nationalen Schulden der Europäischen Union in Echtzeit.
          Die neuesten Eurostat-Daten dienen als Ausgangspunkt und werden pro Sekunde fortgeschrieben, um zu
          zeigen, wie schnell sich die Verschuldung verändert. Dies ist mehr als nur eine Statistik — es ist
          der Puls der europäischen Finanzlage. Ob Sie Frankreich mit Deutschland vergleichen, Italiens
          Schuldenquote verfolgen oder kleine Volkswirtschaften wie Estland und Malta untersuchen — diese Karte
          macht komplexe fiskalische Daten visuell erfahrbar.
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
          Quelle: Eurostat (<code className="mono">gov_10q_ggdebt</code>). Pädagogische Visualisierung, keine offizielle Statistik.
        </p>
      </section>

      {/* MAP */}
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <h2>EU-Überblick</h2>
        <EuropeMap />

        <div style={s.mapFooter}>
          <strong>Legende:</strong>{" "}
          <span style={{ ...s.pill, ...s.pillOk }}>Grün</span> = Schulden sinken •{" "}
          <span style={{ ...s.pill, ...s.pillBad }}>Rot</span> = Schulden steigen
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <h2>Höhepunkte</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 12,
          }}
        >
          {largestDebt && (
            <HighlightTicker
              label="Größte Verschuldung"
              flag={largestDebt.flag}
              name={largestDebt.name}
              start={largestDebt.last_value_eur}
              perSecond={perSecondForCountry(largestDebt)}
            />
          )}
          {fastestGrowing && (
            <HighlightTicker
              label="Schnellst wachsender Schuldenstand"
              flag={fastestGrowing.flag}
              name={fastestGrowing.name}
              start={fastestGrowing.last_value_eur}
              perSecond={perSecondForCountry(fastestGrowing)}
              accent="var(--bad)"
            />
          )}
        </div>
      </section>

      {/* QUICK LIST */}
      <section className="ql-articles" style={{ gridColumn: "1 / -1" }}>
        <QuickList
          items={quickItems}
          initialCount={quickItems.length}
          strings={{
            title: "Schnellübersicht",
            showAll: "Alle zeigen",
            showLess: "Weniger zeigen",
            rising: "↑ steigend",
            falling: "↓ sinkend",
            flat: "→ stabil",
            more: "mehr",
          }}
        />
        <div className="card section">
          <h2>Neueste Artikel</h2>
          {topArticles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
    </main>
  );
}
