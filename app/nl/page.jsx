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
      Kaart laden…
    </div>
  ),
});

const EUTotalTicker = dynamic(() => import("@/components/EUTotalTicker"), { ssr: false });

export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com/nl");
  const title = "EU Schuldenkaart – Live Staatsschuld per Land (EU-27, 2025)";
  const description =
    "Bekijk de overheidsschuld van de EU live, land per land. Interactieve kaart van de EU-27 met real-time schattingen, schuldgroei en vergelijkingen. Gebaseerd op Eurostat data.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: "https://www.eudebtmap.com/nl",
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
      url: "https://www.eudebtmap.com/nl",
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
  if (!c) return 0;
  if (typeof c.per_second === "number") return c.per_second;

  const delta = (c.last_value_eur ?? 0) - (c.prev_value_eur ?? 0);
  if (typeof c.seconds_between === "number" && c.seconds_between > 0) {
    return delta / c.seconds_between;
  }
  const approxSeconds = 90 * 24 * 60 * 60;
  return delta / approxSeconds;
}

export default function HomePageNL() {
  const valid = countries.filter((c) => c && c.last_value_eur > 0 && c.prev_value_eur > 0);
  const largestDebt = valid.length > 0 ? valid.reduce((a, b) => (a.last_value_eur > b.last_value_eur ? a : b)) : null;
  const withDelta = valid.map((c) => ({ ...c, delta: c.last_value_eur - c.prev_value_eur }));
  const fastestGrowing = withDelta.length > 0 ? withDelta.reduce((a, b) => (a.delta > b.delta ? a : b)) : null;

  const quickItems = valid.map((c) => ({
    code: c.code,
    name: c.name, // Zorg dat je data eventueel NL namen heeft, anders blijft dit Engels
    flag: c.flag,
    trend: trendFor(c),
  }));

  // LET OP: articles laden voor NL
  const topArticles = listArticles({ lang: "nl" }).slice(0, 3);

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
      {/* JSON-LD mag hier eventueel ook vertaald, maar Engels is vaak standaard voor Schema.org */}
      
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
              Live EU Staatsschuld Kaart
            </h1>
            <p className="hero-lede" style={{ maxWidth: 760 }}>
              <span style={{ fontWeight: 600 }}>
                Als je elke euro overheidsschuld van alle 27 EU-landen bij elkaar optelt, krijg je het onderstaande getal: een live schatting die nooit stilstaat.
              </span>
            </p>
          </header>

          <div style={{ marginTop: 16, width: "100%", clear: "both" }}>
            <EUTotalTicker />
          </div>

          <p className="hero-lede" style={{ maxWidth: 760, marginTop: 18 }}>
            De EU Debt Map visualiseert de gecombineerde staatsschulden van de Europese Unie in real-time.
            Het meest recente datapunt van Eurostat wordt per land gebruikt als basis en vervolgens seconde per seconde geëxtrapoleerd.
            Dit is niet zomaar een statistiek, het is de hartslag van de financiële gezondheid van Europa. Of je nu Frankrijk met Duitsland vergelijkt,
            de schuld van Italië volgt of kleinere economieën zoals Estland bekijkt: deze kaart vertaalt complexe fiscale data naar een begrijpelijk beeld.
          </p>

          <p className="tag" style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid var(--border)", color: "#4b5563" }}>
            Bron: Eurostat (<code className="mono">gov_10q_ggdebt</code>). Educatieve visualisatie, geen officiële statistiek.
          </p>
        </div>
      </section>

      {/* === MAP === */}
      <section className="card section" style={{ gridColumn: "1 / -1", gap: 16 }}>
        <div className="card-content-wrapper">
          <h2 style={{ marginTop: 4 }}>EU overzicht</h2>

          <div className="mapWrap" role="region" aria-label="Interactieve EU kaart" style={{ width: "100%", clear: "both" }}>
            <EuropeMap />
          </div>

          <div style={s.mapFooter}>
            <div style={s.legend}>
              <strong>Legenda:</strong>
              <span style={{ ...s.pill, ...s.pillOk }}>Groen</span>= schuld daalt
              <span style={s.sep}>•</span>
              <span style={{ ...s.pill, ...s.pillBad }}>Rood</span>= schuld stijgt
              <span style={s.sep}>•</span>
              <span style={s.muted}>Gebaseerd op de laatste twee referentiedata.</span>
            </div>
            <div style={s.cta}>
              <span aria-hidden style={s.ctaIcon}>➜</span>
              <span>
                <strong>Klik op een land</strong> op de kaart voor de live schuldteller.
              </span>
            </div>
          </div>

          <div className="tag" style={{ marginTop: 6, lineHeight: 1.7 }}>
            <h3 style={{ margin: "8px 0" }}>EU-schuld eenvoudig uitgelegd</h3>
            <p style={{ margin: 0 }}>
              Deze kaart toont de staatsschuld van alle EU-27 landen in real-time. Met Eurostat als basis wordt het laatste officiële cijfer per seconde doorberekend om een live schatting te maken. Klik op een land om de cijfers in te duiken en te zien of de schuld stijgt of daalt.
            </p>
          </div>
        </div>
      </section>

      {/* === HIGHLIGHTS === */}
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <div className="card-content-wrapper">
          <h2 style={{ marginTop: 0 }}>Hoogtepunten</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginTop: 8 }}>
            {largestDebt ? (
              <HighlightTicker
                label="Grootste schuld"
                flag={largestDebt.flag}
                name={largestDebt.name}
                start={largestDebt.last_value_eur}
                perSecond={perSecondForCountry(largestDebt)}
              />
            ) : <div className="tag">—</div>}

            {fastestGrowing ? (
              <HighlightTicker
                label="Snelst groeiend"
                flag={fastestGrowing.flag}
                name={fastestGrowing.name}
                start={fastestGrowing.last_value_eur}
                perSecond={perSecondForCountry(fastestGrowing)}
                accent="var(--bad)"
              />
            ) : <div className="tag">—</div>}
          </div>

          <p className="tag" style={{ marginTop: 12 }}>
            Overheidsschuld beïnvloedt rentes, inflatie en de economie. Deze live tellers tonen de grootste bewegingen in één oogopslag.
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
                    title: "Snel overzicht",
                    showAll: "Toon alles",
                    showLess: "Toon minder",
                    rising: "↑ stijgt",
                    falling: "↓ daalt",
                    flat: "→ vlak",
                    more: "meer",
                    }}
                />
            </div>
        </section>

        <section className="card section" style={{ alignContent: "start" }}>
          <div className="card-content-wrapper">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <h2 style={{ margin: 0, flex: 1 }}>Laatste artikelen</h2>
                <Link href="/nl/articles" className="tag">Bekijk alles →</Link>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
                {topArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
                ))}
                {topArticles.length === 0 && <div className="tag">Nog geen artikelen. Binnenkort meer.</div>}
            </div>
          </div>
        </section>
      </section>

      {/* === FAQ === */}
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <div className="card-content-wrapper">
            <h2 style={{ marginTop: 0 }}>FAQ: EU overheidsschuld</h2>
            <h3 style={{ marginBottom: 6 }}>Hoe wordt de live schatting berekend?</h3>
            <p className="tag" style={{ marginTop: 0 }}>
            We interpoleren tussen de laatste twee referentieperiodes van Eurostat en extrapoleren dit per seconde. Op de landenpagina's vind je de exacte basiswaarden.
            </p>
            <h3 style={{ marginBottom: 6 }}>Is dit een officiële statistiek?</h3>
            <p className="tag" style={{ marginTop: 0 }}>
            Nee. Het is een educatieve visualisatie gebaseerd op officiële data, bedoeld om inzicht te geven en discussie te stimuleren.
            </p>
        </div>
      </section>

      <style>{responsiveCss}</style>
    </main>
  );
}