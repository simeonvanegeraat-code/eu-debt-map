// components/ArticleRailServer.jsx

import ArticleRail from "./ArticleRail";
import { listArticles } from "@/lib/articles";

function scoreArticle(article, exceptSlug) {
  const date = article.dateModified || article.datePublished || article.date || "";
  const dateScore = date ? new Date(date).getTime() : 0;

  if (article.slug === exceptSlug) return -1;

  return dateScore;
}

export default async function ArticleRailServer({
  lang = "en",
  exceptSlug,
  limit = 6,
  title = "Further Reading",
}) {
  let items = [];

  try {
    items = listArticles({ lang }) || [];
  } catch {
    items = [];
  }

  const articles = [...items]
    .filter((article) => article?.slug && article.slug !== exceptSlug)
    .sort((a, b) => scoreArticle(b, exceptSlug) - scoreArticle(a, exceptSlug))
    .slice(0, limit);

  if (!articles.length) return null;

  return <ArticleRail articles={articles} title={title} lang={lang} />;
}