import { listArticles } from "@/lib/articles";
import ArticleRail from "./ArticleRail";

export default async function ArticleRailServer({
  lang = "en",
  exceptSlug,
  limit = 6,
  title = "More articles",
}) {
  let items = listArticles({ lang }); // newest-first
  if (exceptSlug) {
    items = items.filter((a) => a.slug !== exceptSlug);
  }

  const articles = items.slice(0, limit);
  if (!articles.length) return null;

  return <ArticleRail articles={articles} title={title} />;
}
