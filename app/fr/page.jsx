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
      Chargement de la carte…
    </div>
  ),
});

const EUTotalTicker = dynamic(() => import("@/components/EUTotalTicker"), { ssr: false });

export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com/fr");
  const title = "Carte Dette Publique UE – En direct par pays (UE-27, 2025)";
  const description =
    "Consultez la dette publique de l'UE en direct, pays par pays. Carte interactive des 27 avec estimations en temps réel, croissance de la dette et comparaisons.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical: "https://www.eudebtmap.com/fr",
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
      url: "https://www.eudebtmap.com/fr",
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

export default function HomePageFR() {
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

  // ARTIKEL FRANS
  const topArticles = listArticles({ lang: "fr" }).slice(0, 3);

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
              Dette Publique UE en Direct
            </h1>
            <p className="hero-lede" style={{ maxWidth: 760 }}>
              <span style={{ fontWeight: 600 }}>
                Si vous additionnez chaque euro de dette publique des 27 pays de l'UE, vous obtenez le chiffre ci-dessous : une estimation qui ne s'arrête jamais.
              </span>
            </p>
          </header>

          <div style={{ marginTop: 16, width: "100%", clear: "both" }}>
            <EUTotalTicker />
          </div>

          <p className="hero-lede" style={{ maxWidth: 760, marginTop: 18 }}>
            La carte visualise les dettes nationales combinées de l'Union européenne en temps réel.
            Le point de données le plus récent d'Eurostat est utilisé comme base, puis projeté seconde par seconde.
            Ce n'est pas juste une statistique, c'est le pouls de la santé financière de l'Europe. Que vous compariez la France à l'Allemagne
            ou exploriez de plus petites économies, cette carte traduit des données fiscales complexes en un visuel intuitif.
          </p>

          <p className="tag" style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid var(--border)", color: "#4b5563" }}>
            Source : Eurostat (<code className="mono">gov_10q_ggdebt</code>). Visualisation éducative, pas une statistique officielle.
          </p>
        </div>
      </section>

      {/* === MAP === */}
      <section className="card section" style={{ gridColumn: "1 / -1", gap: 16 }}>
        <div className="card-content-wrapper">
          <h2 style={{ marginTop: 4 }}>Aperçu UE</h2>

          <div className="mapWrap" role="region" aria-label="Carte interactive UE" style={{ width: "100%", clear: "both" }}>
            <EuropeMap />
          </div>

          <div style={s.mapFooter}>
            <div style={s.legend}>
              <strong>Légende :</strong>
              <span style={{ ...s.pill, ...s.pillOk }}>Vert</span>= baisse
              <span style={s.sep}>•</span>
              <span style={{ ...s.pill, ...s.pillBad }}>Rouge</span>= hausse
              <span style={s.sep}>•</span>
              <span style={s.muted}>Basé sur les deux dernières périodes de référence.</span>
            </div>
            <div style={s.cta}>
              <span aria-hidden style={s.ctaIcon}>➜</span>
              <span>
                <strong>Cliquez sur un pays</strong> pour voir son compteur en direct.
              </span>
            </div>
          </div>

          <div className="tag" style={{ marginTop: 6, lineHeight: 1.7 }}>
            <h3 style={{ margin: "8px 0" }}>La dette expliquée simplement</h3>
            <p style={{ margin: 0 }}>
              Cette carte montre la dette nationale de tous les pays de l'UE-27 en temps réel. En utilisant Eurostat comme base, le dernier chiffre officiel est extrapolé par seconde. Cliquez sur un pays pour voir si la dette augmente ou diminue.
            </p>
          </div>
        </div>
      </section>

      {/* === HIGHLIGHTS === */}
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <div className="card-content-wrapper">
          <h2 style={{ marginTop: 0 }}>Faits marquants</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginTop: 8 }}>
            {largestDebt ? (
              <HighlightTicker
                label="Dette la plus élevée"
                flag={largestDebt.flag}
                name={largestDebt.name}
                start={largestDebt.last_value_eur}
                perSecond={perSecondForCountry(largestDebt)}
              />
            ) : <div className="tag">—</div>}

            {fastestGrowing ? (
              <HighlightTicker
                label="Croissance la plus rapide"
                flag={fastestGrowing.flag}
                name={fastestGrowing.name}
                start={fastestGrowing.last_value_eur}
                perSecond={perSecondForCountry(fastestGrowing)}
                accent="var(--bad)"
              />
            ) : <div className="tag">—</div>}
          </div>

          <p className="tag" style={{ marginTop: 12 }}>
            La dette publique façonne les taux d'intérêt, l'inflation et l'économie de l'UE. Ces compteurs affichent les plus grands mouvements en un coup d'œil.
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
                    title: "Liste rapide",
                    showAll: "Voir tout",
                    showLess: "Voir moins",
                    rising: "↑ hausse",
                    falling: "↓ baisse",
                    flat: "→ stable",
                    more: "plus",
                    }}
                />
            </div>
        </section>

        <section className="card section" style={{ alignContent: "start" }}>
          <div className="card-content-wrapper">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <h2 style={{ margin: 0, flex: 1 }}>Derniers articles</h2>
                <Link href="/fr/articles" className="tag">Voir tout →</Link>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
                {topArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
                ))}
                {topArticles.length === 0 && <div className="tag">Aucun article pour le moment. Bientôt disponible.</div>}
            </div>
          </div>
        </section>
      </section>

      {/* === FAQ === */}
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <div className="card-content-wrapper">
            <h2 style={{ marginTop: 0 }}>FAQ : Dette publique UE</h2>
            <h3 style={{ marginBottom: 6 }}>Comment est calculée l'estimation ?</h3>
            <p className="tag" style={{ marginTop: 0 }}>
            Nous interpolons entre les deux dernières périodes de référence d'Eurostat et extrapolons par seconde. Les pages par pays incluent les valeurs de base.
            </p>
            <h3 style={{ marginBottom: 6 }}>Est-ce une statistique officielle ?</h3>
            <p className="tag" style={{ marginTop: 0 }}>
            Non. C'est une visualisation éducative basée sur des données officielles, destinée à améliorer la compréhension et susciter la discussion.
            </p>
        </div>
      </section>

      <style>{responsiveCss}</style>
    </main>
  );
}