// app/articles/page.jsx
import { listArticles } from "@/lib/articles";
import ArticlesShell from "@/components/ArticlesShell";

export const runtime = "nodejs";

export const metadata = {
  title: "Articles & Analysis • EU Debt Map",
  description:
    "Explainers and insights on EU government debt, built on the same Eurostat data as our live map.",
  alternates: { canonical: "https://www.eudebtmap.com/articles" },
  openGraph: {
    title: "Articles & Analysis • EU Debt Map",
    description: "Explainers and insights on EU government debt, built on Eurostat data.",
    url: "https://www.eudebtmap.com/articles",
    siteName: "EU Debt Map",
    type: "website",
  },
};

export default function ArticlesPage() {
  const all = listArticles(); // al newest-first
  return <ArticlesShell articles={all} />;
}
