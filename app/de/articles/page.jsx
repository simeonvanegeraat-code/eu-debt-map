import { listArticles } from "@/lib/articles";
import ArticlesListClient from "@/components/ArticlesListClient";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const LANG = "de";
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };
const prefix = ROUTE_PREFIX[LANG] ?? "";

const PAGE_SIZE = 12;

export const metadata = {
  title:
    "EU-Schuldenartikel & Einblicke in Staatsverschuldung und Fiskalregeln • EU Debt Map",
  description:
    "Datenbasierte Analysen zu Staatsschulden, Schuldenquote (Schulden/BIP), Defiziten und den fiskalischen Regeln der EU-Mitgliedstaaten — basierend auf Eurostat und Live-Daten.",
  alternates: {
    canonical: `${SITE}${prefix}/articles`,
    languages: {
      en: `${SITE}/articles`,
      nl: `${SITE}/nl/articles`,
      de: `${SITE}/de/articles`,
      fr: `${SITE}/fr/articles`,
      "x-default": `${SITE}/articles`,
    },
  },
  openGraph: {
    title:
      "EU-Schuldenartikel & Einblicke in Staatsverschuldung und Fiskalregeln • EU Debt Map",
    description:
      "Entdecken Sie fundierte, datengestützte Artikel über die europäische Staatsverschuldung, Schuldenquote, Defizite und das fiskalische Rahmenwerk, das Europas Zukunft prägt.",
    url: `${SITE}${prefix}/articles`,
    siteName: "EU Debt Map",
    type: "website",
  },
};

export default function ArticlesPage() {
  const articles = listArticles({ lang: LANG });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE}${prefix}/articles/${a.slug}`,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="articles-hero" aria-labelledby="articles-title">
        <h1 id="articles-title" className="hero-title">
          EU-Schuldenartikel & Analysen
        </h1>
        <p className="hero-lede">
          Datenbasierte Einblicke in die öffentlichen Finanzen Europas:
          Staatsverschuldung, Schulden-zu-BIP, Defizite und Fiskalregeln, die Politik,
          Märkte und das tägliche Leben in der EU-27 beeinflussen.
        </p>
      </section>

      <ArticlesListClient articles={articles} pageSize={PAGE_SIZE} />

      <section className="articles-seo">
        EU Debt Map veröffentlicht unabhängige, datengestützte Artikel über die
        Staatsverschuldung der EU-Mitgliedstaaten, Schuldenquoten, Defizitregeln und
        fiskalische Rahmenwerke. Alle Analysen basieren auf transparenten Eurostat-Daten
        und sind mit unseren Live-Schulden-Trackern verknüpft.
      </section>
    </main>
  );
}
