import "server-only";
import { listArticles } from "@/lib/articles";

export function getHomeArticles(lang) {
  return listArticles({ lang }).slice(0, 3).map((article) => ({
    slug: article.slug,
    url: article.url,
    title: article.title,
    summary: article.summary || article.excerpt || "",
    image: article.image || null,
    imageAlt: article.imageAlt || "",
    date: article.date || article.datePublished || null,
    readingMinutes: article.readingMinutes || null,
  }));
}
