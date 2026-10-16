import { listArticles } from "@/lib/articles";
import ArticleArchiveHome from "@/components/ArticleArchiveHome";
import paginationCore from "@/lib/articleArchivePagination.cjs";

const { paginateArchive } = paginationCore;

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const LANG = "fr";
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };
const prefix = ROUTE_PREFIX[LANG] ?? "";

export const metadata = {
  title:
    "Analyses de la dette de l’UE : articles, données et explications • EU Debt Map",
  description:
    "Lisez des articles, explications et mises à jour fondés sur les données concernant la dette publique de l’UE, le ratio dette/PIB, les tendances par pays, les règles budgétaires et les données Eurostat.",
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
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title:
      "Analyses de la dette de l’UE : articles, données et explications • EU Debt Map",
    description:
      "Découvrez des articles et explications fondés sur les données concernant la dette publique de l’UE, le ratio dette/PIB, les règles budgétaires et les tendances par pays.",
    url: `${SITE}${prefix}/articles`,
    siteName: "EU Debt Map",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Analyses de la dette de l’UE • EU Debt Map",
    description:
      "Articles, explications et mises à jour fondés sur les données concernant la dette publique dans l’UE-27.",
  },
};

function hrefForArticle(article) {
  if (!article) return "#";
  if (article.url) return article.url;
  return `${prefix}/articles/${article.slug}`;
}

export default function ArticlesPage() {
  const articles = listArticles({ lang: LANG });

  const [topStory, secondStory, thirdStory] = articles;
  const firstArchivePage = paginateArchive(articles, 1);
  const firstPageArticles = [
    topStory,
    secondStory,
    thirdStory,
    ...firstArchivePage.items,
  ].filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Analyses de la dette de l’UE",
    description:
      "Articles, explications et mises à jour fondés sur les données concernant la dette publique dans l’UE-27.",
    url: `${SITE}${prefix}/articles`,
    isPartOf: {
      "@type": "WebSite",
      name: "EU Debt Map",
      url: SITE,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: firstPageArticles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE}${hrefForArticle(article)}`,
        name: article.title,
      })),
    },
  };

  return (
    <ArticleArchiveHome
      lang={LANG}
      featured={[topStory, secondStory, thirdStory]}
      articles={firstArchivePage.items}
      pagination={firstArchivePage}
      jsonLd={jsonLd}
    />
  );
}
