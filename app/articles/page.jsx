import { listArticles } from "@/lib/articles";
import ArticleArchiveHome from "@/components/ArticleArchiveHome";
import paginationCore from "@/lib/articleArchivePagination.cjs";

const { paginateArchive } = paginationCore;

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const LANG = "en";
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };
const prefix = ROUTE_PREFIX[LANG] ?? "";

export const metadata = {
  title:
    "EU Debt Insights: Articles, Data Analysis and Explainers • EU Debt Map",
  description:
    "Read data-backed articles, explainers and updates on EU government debt, debt-to-GDP, country debt trends, fiscal rules and Eurostat data across the EU-27.",
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
      "EU Debt Insights: Articles, Data Analysis and Explainers • EU Debt Map",
    description:
      "Explore data-backed articles and explainers on EU government debt, debt-to-GDP, fiscal rules and country debt trends.",
    url: `${SITE}${prefix}/articles`,
    siteName: "EU Debt Map",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EU Debt Insights • EU Debt Map",
    description:
      "Data-backed articles, explainers and updates on government debt across the EU-27.",
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
    name: "EU Debt Insights",
    description:
      "Data-backed articles, explainers and updates on government debt across the EU-27.",
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
