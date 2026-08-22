// app/rss.xml/route.js
export const runtime = "nodejs";        // nodig als listArticles fs gebruikt
export const dynamic = "force-static";  // Next 15 caches GET handlers only when explicitly requested
export const revalidate = 1800;         // 30 min cache

const SITE = "https://www.eudebtmap.com";
const TITLE = "EU Debt Map – Articles";
const DESC = "Explainers and insights on EU government debt.";
const LOCALE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };

function esc(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function cdata(s = "") {
  return `<![CDATA[${String(s).replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}

function articleUrl(article) {
  if (!article?.slug) return null;

  if (article.url) {
    return article.url.startsWith("http")
      ? article.url
      : `${SITE}${article.url.startsWith("/") ? article.url : `/${article.url}`}`;
  }

  const prefix = LOCALE_PREFIX[article.lang] ?? "";
  return `${SITE}${prefix}/articles/${encodeURIComponent(article.slug)}`;
}

function safeRssDate(article) {
  const value = article?.dateModified || article?.datePublished || article?.date;
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

async function safeListArticles() {
  try {
    const mod = await import("@/lib/articles");
    if (typeof mod?.listArticles === "function") {
      const list = mod.listArticles();
      return Array.isArray(list) ? list : [];
    }
  } catch {
    /* ignore */
  }
  return [];
}

export async function GET() {
  try {
    const seenLinks = new Set();
    const items = [];

    for (const article of await safeListArticles()) {
      const link = articleUrl(article);
      if (!link || seenLinks.has(link)) continue;

      seenLinks.add(link);
      items.push({ article, link });
      if (items.length === 20) break;
    }

    const xmlItems = items.map(({ article, link }) => {
      const title = article?.title ? cdata(article.title) : "EU Debt Map Article";
      const summary = article?.summary ? cdata(article.summary) : "";
      const date = safeRssDate(article);
      const escapedLink = esc(link);

      return `
  <item>
    <title>${title}</title>
    <link>${escapedLink}</link>
    <guid>${escapedLink}</guid>
    <pubDate>${date.toUTCString()}</pubDate>
    ${summary ? `<description>${summary}</description>` : ""}
  </item>`;
    }).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${esc(TITLE)}</title>
  <link>${SITE}</link>
  <description>${esc(DESC)}</description>
  ${xmlItems}
</channel>
</rss>`;

    return new Response(xml, {
      status: 200,
      headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
    });
  } catch {
    // Fallback: minimale, geldige RSS zodat bestand nooit 0 B is
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${esc(TITLE)}</title>
  <link>${SITE}</link>
  <description>${esc(DESC)}</description>
  <item>
    <title>EU Debt Map</title>
    <link>${SITE}</link>
    <guid>${SITE}</guid>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <description>Feed temporarily unavailable.</description>
  </item>
</channel>
</rss>`;
    return new Response(fallback, {
      status: 200,
      headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
    });
  }
}
