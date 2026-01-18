// app/components/ArticleRailServer.jsx
import { listArticles } from "@/lib/articles";
import ArticleRail from "./ArticleRail";

export default async function ArticleRailServer({
  lang = "en",
  exceptSlug,
  limit = 3, // 3 is vaak mooier op desktop (1 rij), 6 mag ook
  title = "Read also",
}) {
  let items = listArticles({ lang }); // haalt alles op

  // 1. Filter het huidige artikel eruit
  if (exceptSlug) {
    items = items.filter((a) => a.slug !== exceptSlug);
  }

  // 2. Shuffle de array (Fisher-Yates algoritme) voor variatie
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  // 3. Pak de eerste X items
  const articles = items.slice(0, limit);

  if (!articles.length) return null;

  return <ArticleRail articles={articles} title={title} />;
}