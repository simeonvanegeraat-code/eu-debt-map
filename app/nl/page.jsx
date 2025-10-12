// app/page.jsx (NL-versie)
import Link from "next/link";
import dynamic from "next/dynamic";
import QuickList from "@/components/QuickList";
import ArticleCard from "@/components/ArticleCard";
import HighlightTicker from "@/components/HighlightTicker";
import { listArticles } from "@/lib/articles";
import { countries, trendFor } from "@/lib/data";

// Kaart & Ticker alleen client-side (ssr:false)
const EuropeMap = dynamic(() => import("@/components/EuropeMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 420, display: "grid", placeItems: "center" }} className="card">
      Kaart laden…
    </div>
  ),
});

const EUTotalTicker = dynamic(() => import("@/components/EUTotalTicker"), { ssr: false });

// --- SEO: generateMetadata (NL) ---
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const title = "EU Schuldenkaart – Live nationale schuld per land (EU-27, 2025)";
  const description =
    "Bekijk de live staatsschuld van EU-landen. Interactieve EU-27 kaart met realtime schattingen, schuldgroei en vergelijkingen. Gebaseerd op Eurostat-data.";

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
      },
    },
    openGraph: {
      title,
      description:
        "Ontdek de staatsschuld van EU-landen met een live, per seconde bijwerkende schatting per land.",
      url: "https://www.eudebtmap.com/nl",
      siteName: "EU Debt Map",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: "Live bijwerkende schattingen van de staatsschuld in de EU, gebaseerd op Eurostat.",
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

// Bereken groei per seconde
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

  // --- JSON-LD ---
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://www.eudebtmap.com/nl",
    name: "EU Schuldenkaart",
    inLanguage: "nl",
  };
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EU Schuldenkaart",
    url: "https://www.eudebtmap.com/nl",
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
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />

      {/* === HERO === */}
      <section className="card section" style={{ gridColumn: "1 / -1" }} aria-labelledby="page-title">
        <header style={{ maxWidth: 760 }}>
          <h1
            id="page-title"
            className="hero-title"
            style={{
              fontSize: "clamp(1.8rem, 4vw + 1rem, 3rem)",
              background: "linear-gradient(90deg, #2563eb, #00875a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 8,
            }}
          >
            Live EU-schuldenkaart
          </h1>

          <p className="hero-lede" style={{ maxWidth: 760 }}>
            <span style={{ fontWeight: 600 }}>
              Als je alle euro’s aan staatsschuld van de 27 EU-landen bij elkaar zou optellen, kom je uit op het bedrag hieronder — een live, voortdurend tikkende schatting die nooit stilstaat.
            </span>
          </p>
        </header>

        <div style={{ marginTop: 16 }}>
          <EUTotalTicker />
        </div>

        <p className="hero-lede" style={{ maxWidth: 760, marginTop: 18 }}>
          De EU-Schuldenkaart visualiseert de gezamenlijke staatsschuld van de Europese Unie in realtime.
          De meest recente Eurostat-cijfers per land vormen het vertrekpunt, waarna de groei per seconde
          wordt doorgerekend. Zo zie je direct hoe snel de schuld toeneemt (of in zeldzame gevallen afneemt).
          Dit is meer dan een getal — het is de hartslag van de Europese economie. Of je nu Frankrijk met
          Duitsland vergelijkt, Italië’s schuld-/bbp-ratio volgt, of kleinere economieën als Estland en Malta
          bekijkt: deze kaart maakt complexe financiële data visueel en begrijpelijk.
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
          Bron: Eurostat (<code className="mono">gov_10q_ggdebt</code>). Educatieve visualisatie, geen officiële statistiek.
        </p>
      </section>

      {/* === MAP === */}
      <section className="card section" style={{ gridColumn: "1 / -1", gap: 16 }}>
        <h2 style={{ marginTop: 4 }}>Overzicht EU</h2>

        <div className="mapWrap" role="region" aria-label="Interactieve EU-kaart">
          <EuropeMap />
        </div>

        <div role="note" aria-label="Kaartlegenda en uitleg" style={s.mapFooter}>
          <div style={s.legend}>
            <strong>Legenda:</strong>
            <span style={{ ...s.pill, ...s.pillOk }}>Groen</span>= schuld daalt
            <span style={s.sep}>•</span>
            <span style={{ ...s.pill, ...s.pillBad }}>Rood</span>= schuld stijgt
            <span style={s.sep}>•</span>
            <span style={s.muted}>Gebaseerd op de laatste twee referentieperiodes.</span>
          </div>

          <div style={s.cta}>
            <span aria-hidden style={s.ctaIcon}>➜</span>
            <span>
              <strong>Klik op een land</strong> om de live-schuldteller te bekijken.
            </span>
          </div>
        </div>

        <div className="tag" style={{ marginTop: 6, lineHeight: 1.7 }}>
          <h3 style={{ margin: "8px 0" }}>Uitleg in eenvoudige woorden</h3>
          <p style={{ margin: 0 }}>
            Deze EU-schuldenkaart toont de nationale schuld van alle EU-27-landen in realtime. Op basis van
            Eurostat-data wordt voor elk land de meest recente officiële waarde per seconde geëxtrapoleerd.
            Klik op een land om te zien of de schuld stijgt of daalt. Dit is een educatieve visualisatie —
            geen officiële statistiek.
          </p>
        </div>
      </section>

      {/* === HIGHLIGHTS === */}
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <h2 style={{ marginTop: 0 }}>Hoogtepunten</h2>

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
              label="Grootste schuld"
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
              label="Snelst stijgende schuld"
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
          Staatsschuld beïnvloedt rente, inflatie, begrotingsbeleid en de stabiliteit van de Europese economie.
          Deze live-tellers tonen in één oogopslag de grootste bewegingen.
        </p>
      </section>

      {/* === QUICK LIST + LATEST ARTICLES === */}
      <section className="ql-articles" style={{ gridColumn: "1 / -1" }}>
        <div>
          <QuickList
            items={quickItems}
            initialCount={quickItems.length}
            strings={{
              title: "Snelle lijst",
              showAll: "Alles tonen",
              showLess: "Minder tonen",
              rising: "↑ stijgend",
              falling: "↓ dalend",
              flat: "→ stabiel",
              more: "meer",
            }}
          />
        </div>

        <div className="card section" style={{ alignContent: "start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ margin: 0, flex: 1 }}>Laatste artikelen</h2>
            <Link href="/articles" className="tag">Bekijk alle →</Link>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {topArticles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
            {topArticles.length === 0 && <div className="tag">Nog geen artikelen. Binnenkort beschikbaar.</div>}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <h2 style={{ marginTop: 0 }}>Veelgestelde vragen</h2>

        <h3 style={{ marginBottom: 6 }}>Hoe wordt de live-schatting berekend?</h3>
        <p className="tag" style={{ marginTop: 0 }}>
          We interpoleren tussen de laatste twee referentieperiodes van Eurostat en rekenen de waarde per seconde door.
          Op de landpagina’s vind je de uitgangswaarde en trendindicator.
        </p>

        <h3 style={{ marginBottom: 6 }}>Is dit een officiële statistiek?</h3>
        <p className="tag" style={{ marginTop: 0 }}>
          Nee. Dit is een educatieve visualisatie gebaseerd op officiële data, bedoeld om inzicht en discussie te stimuleren.
        </p>
      </section>

      <style>{responsiveCss}</style>
    </main>
  );
}
