import { listArticles } from "@/lib/articles";
import ArticlesShell from "@/components/ArticlesShell";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const LANG = "fr";
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };
const prefix = ROUTE_PREFIX[LANG] ?? "";

export const metadata = {
  title: "Articles & Analysis • EU Debt Map",
  description: "Explainers and insights on EU government debt, built on Eurostat data.",
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
    title: "Articles & Analysis • EU Debt Map",
    description: "Explainers and insights on EU government debt, built on Eurostat data.",
    url: `${SITE}${prefix}/articles`,
    siteName: "EU Debt Map",
    type: "website",
  },
};

export default function ArticlesPage() {
  const all = listArticles({ lang: LANG }); // newest-first
  return <ArticlesShell articles={all} />;
}
