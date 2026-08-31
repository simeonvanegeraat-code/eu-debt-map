const SUPPORTED_LANGUAGES = ["en", "nl", "de", "fr"];
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };
const NEWS_WINDOW_MS = 48 * 60 * 60 * 1000;

function escapeXml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("'", "&apos;")
    .replaceAll('"', "&quot;");
}

function publicationDate(article) {
  return article?.datePublished || article?.date || null;
}

function isPublishedNewsArticle(article, now = new Date()) {
  if (article?.articleType !== "news") return false;
  if (!SUPPORTED_LANGUAGES.includes(article?.lang)) return false;

  const publishedAt = new Date(publicationDate(article)).getTime();
  const currentTime = new Date(now).getTime();

  if (!Number.isFinite(publishedAt) || !Number.isFinite(currentTime)) return false;

  return publishedAt <= currentTime;
}

function isRecentNewsArticle(article, now = new Date()) {
  if (!isPublishedNewsArticle(article, now)) return false;

  const publishedAt = new Date(publicationDate(article)).getTime();
  const currentTime = new Date(now).getTime();

  const age = currentTime - publishedAt;
  return age <= NEWS_WINDOW_MS;
}

function articlePath(article) {
  if (typeof article?.url === "string" && article.url.startsWith("/")) {
    return article.url;
  }

  const prefix = ROUTE_PREFIX[article?.lang];
  return `${prefix}/articles/${article.slug}`;
}

function buildNewsSitemap({
  articles = [],
  now = new Date(),
  site = "https://www.eudebtmap.com",
} = {}) {
  const urls = articles
    .filter((article) => isPublishedNewsArticle(article, now))
    .sort(
      (left, right) =>
        new Date(publicationDate(right)).getTime() -
        new Date(publicationDate(left)).getTime()
    )
    .map((article) => {
      const dateIso = new Date(publicationDate(article)).toISOString();
      const loc = `${site}${articlePath(article)}`;
      const newsMetadata = isRecentNewsArticle(article, now)
        ? `
      <news:news>
        <news:publication>
          <news:name>EU Debt Map</news:name>
          <news:language>${article.lang}</news:language>
        </news:publication>
        <news:publication_date>${dateIso}</news:publication_date>
        <news:title>${escapeXml(article.title)}</news:title>
      </news:news>`
        : "";

      return `
    <url>
      <loc>${escapeXml(loc)}</loc>${newsMetadata}
    </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;
}

module.exports = {
  NEWS_WINDOW_MS,
  SUPPORTED_LANGUAGES,
  articlePath,
  buildNewsSitemap,
  escapeXml,
  isPublishedNewsArticle,
  isRecentNewsArticle,
  publicationDate,
};
