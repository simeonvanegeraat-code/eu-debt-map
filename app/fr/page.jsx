// app/fr/page.jsx
import Link from "next/link";
import dynamic from "next/dynamic";
import QuickList from "@/components/QuickList";
import ArticleCard from "@/components/ArticleCard";
import HighlightTicker from "@/components/HighlightTicker";
import { listArticles } from "@/lib/articles";
import { countries, trendFor } from "@/lib/data";

// Rendu côté client uniquement
const EuropeMap = dynamic(() => import("@/components/EuropeMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 420, display: "grid", placeItems: "center" }} className="card">
      Carte en cours de chargement…
    </div>
  ),
});

const EUTotalTicker = dynamic(() => import("@/components/EUTotalTicker"), { ssr: false });

// --- SEO: generateMetadata (FR) ---
export async function generateMetadata() {
  const base = new URL("https://www.eudebtmap.com");
  const title = "Carte de la dette de l’UE – Dette publique par pays (UE-27, 2025)";
  const description =
    "Découvrez la dette publique en temps réel dans les pays de l’Union européenne. Carte interactive basée sur les données Eurostat.";

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
      },
    },
    openGraph: {
      title,
      description:
        "Explorez la dette publique européenne avec des estimations actualisées en direct, pays par pays.",
      url: "https://www.eudebtmap.com/fr",
      siteName: "EU Debt Map",
      type: "website",
    },
  };
}

// Croissance par seconde
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

  const topArticles = listArticles().slice(0, 3);

  const s = {
    mapFooter: {
      marginTop: 12,
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: 12,
      background: "#f9fafb",
    },
    legend: { fontSize: 14, lineHeight: 1.5, color: "var(--fg)" },
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
            Carte de la dette publique de l’UE
          </h1>
          <p style={{ fontWeight: 600 }}>
            Si vous additionniez chaque euro de dette publique des 27 pays de l’Union européenne, vous obtiendriez le montant ci-dessous — une estimation en direct qui ne s’arrête jamais.
          </p>
        </header>

        <div style={{ marginTop: 16 }}>
          <EUTotalTicker />
        </div>

        <p style={{ marginTop: 18 }}>
          La Carte de la dette de l’UE illustre la dette nationale combinée de l’Union européenne en temps réel.
          Chaque donnée la plus récente d’Eurostat sert de point de départ, projetée seconde par seconde pour
          montrer la vitesse à laquelle la dette publique évolue. Ce n’est pas qu’une statistique — c’est le
          pouls économique de l’Europe. Que vous compariez la France et l’Allemagne, suiviez le ratio dette/PIB
          de l’Italie ou exploriez les petites économies comme l’Estonie et Malte, cette carte rend les données
          financières complexes accessibles et vivantes.
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
          Source : Eurostat (<code className="mono">gov_10q_ggdebt</code>). Visualisation éducative, non statistique officielle.
        </p>
      </section>

      {/* MAP */}
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <h2>Vue d’ensemble de l’UE</h2>
        <EuropeMap />

        <div style={s.mapFooter}>
          <strong>Légende :</strong>{" "}
          <span style={{ color: "var(--ok)" }}>Vert</span> = dette en baisse •{" "}
          <span style={{ color: "var(--bad)" }}>Rouge</span> = dette en hausse
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="card section" style={{ gridColumn: "1 / -1" }}>
        <h2>Faits marquants</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 12,
          }}
        >
          {largestDebt && (
            <HighlightTicker
              label="Plus forte dette"
              flag={largestDebt.flag}
              name={largestDebt.name}
              start={largestDebt.last_value_eur}
              perSecond={perSecondForCountry(largestDebt)}
            />
          )}
          {fastestGrowing && (
            <HighlightTicker
              label="Dette en croissance la plus rapide"
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
            title: "Liste rapide",
            showAll: "Tout afficher",
            showLess: "Réduire",
            rising: "↑ en hausse",
            falling: "↓ en baisse",
            flat: "→ stable",
            more: "plus",
          }}
        />
        <div className="card section">
          <h2>Derniers articles</h2>
          {topArticles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
    </main>
  );
}
