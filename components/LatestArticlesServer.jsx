// Server component: toont de nieuwste artikelen voor de huidige taal
import { listArticles } from "@/lib/articles";
import LatestArticles from "./LatestArticles";

export default async function LatestArticlesServer({
  lang = "en",
  exceptSlug,
  limit = 6,
}) {
  let items = listArticles({ lang });       // haalt al newest-first op
  if (exceptSlug) items = items.filter((a) => a.slug !== exceptSlug);

  // snij op limit en geef door aan de client component
  return <LatestArticles articles={items.slice(0, limit)} />;
}
