// Server component
import { listArticles } from "@/lib/articles";
import ArticleRail from "./ArticleRail";

export default async function ArticleRailServer({
  lang = "en",
  exceptSlug,
  limit = 6,
  title = "More articles",
}) {
  let items = listArticles({ lang });
  if (exceptSlug) items = items.filter((a) => a.slug !== exceptSlug);
  return <ArticleRail title={title} articles={items.slice(0, limit)} />;
}
