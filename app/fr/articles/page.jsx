import { listArticles } from "@/lib/articles";
import ArticlesListClient from "@/components/ArticlesListClient";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const LANG = "fr";
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };
const prefix = ROUTE_PREFIX[LANG] ?? "";

const PAGE_SIZE = 12;

export const metadata = {
  title:
    "Articles et analyses sur la dette publique européenne et les règles budgétaires • EU Debt Map",
  description:
    "Analyses fondées sur les données concernant la dette publique, le ratio dette/PIB, les déficits et les cadres budgétaires des États membres de l’UE — basées sur Eurostat et des données en direct.",
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
      "Articles et analyses sur la dette publique européenne et les règles budgétaires • EU Debt Map",
    description:
      "Découvrez des articles approfondis, fondés sur des données, sur la dette publique européenne, les ratios dette/PIB, les déficits et les cadres fiscaux qui façonnent l’avenir économique de l’Europe.",
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
          Articles & analyses sur la dette européenne
        </h1>
        <p className="hero-lede">
          Des analyses basées sur les données concernant les finances publiques
          européennes : dette nationale, ratio dette/PIB, déficits et règles budgétaires
          qui influencent les politiques, les marchés et la vie quotidienne dans l’UE-27.
        </p>
      </section>

      <ArticlesListClient articles={articles} pageSize={PAGE_SIZE} />

      <section className="articles-seo">
        EU Debt Map publie des articles indépendants et basés sur les données concernant la
        dette publique des États membres de l’UE, les ratios dette/PIB, les déficits et les
        cadres budgétaires. Toutes les analyses reposent sur les données transparentes
        d’Eurostat et sont reliées à nos indicateurs de dette en direct par pays.
      </section>
    </main>
  );
}
