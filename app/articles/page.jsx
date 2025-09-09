// app/articles/page.jsx
import { listArticles } from "@/lib/articles";
import ArticlesShell from "@/components/ArticlesShell";

export const metadata = {
  title: "Articles & Analysis • EU Debt Map",
  description:
    "Explainers and insights on EU government debt, built on the same Eurostat data as our live map.",
  alternates: { canonical: "https://www.eudebtmap.com/articles" },
  openGraph: {
    title: "Articles & Analysis • EU Debt Map",
    description:
      "Explainers and insights on EU government debt, built on Eurostat data.",
    url: "https://www.eudebtmap.com/articles",
    siteName: "EU Debt Map",
    type: "website",
  },
};

export default function ArticlesPage({ searchParams }) {
  const all = listArticles()
    .slice()
    .sort((a, b) => +new Date(b.date || 0) - +new Date(a.date || 0));

  const initialTag = searchParams?.tag ? String(searchParams.tag) : "All";
  const initialQ = searchParams?.q ? String(searchParams.q) : "";

  return <ArticlesShell articles={all} initialTag={initialTag} initialQ={initialQ} />;
}
