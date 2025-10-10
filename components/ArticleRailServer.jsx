// Server component: related/meer artikelen, exclusief huidig artikel
import { listArticles } from "@/lib/articles";
import ArticleRail from "./ArticleRail";

export default async function ArticleRailServer({
  lang = "en",
  exceptSlug,
  limit = 6,
}) {
  let items = listArticles({ lang });
  if (exceptSlug) items = items.filter((a) => a.slug !== exceptSlug);
  return <ArticleRail articles={items.slice(0, limit)} />;
}
