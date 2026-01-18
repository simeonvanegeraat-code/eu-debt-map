// app/news-sitemap.xml/route.js
import { listArticles } from "@/lib/articles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // Altijd vers genereren

const SITE = "https://www.eudebtmap.com";

function esc(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("'", "&apos;")
    .replaceAll('"', "&quot;");
}

export async function GET() {
  // 1. Haal alle artikelen op
  let articles = [];
  try {
    articles = listArticles({ lang: "en" }) || [];
  } catch (e) {
    console.error("News sitemap error:", e);
  }

  // 2. Google News eis: Artikelen mogen max 48 uur oud zijn (Strict!)
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const newsArticles = articles.filter((a) => {
    // Check published date first, fallback to generic date
    const dateStr = a.datePublished || a.date;
    if (!dateStr) return false;
    return new Date(dateStr) > twoDaysAgo;
  });

  // 3. Bouw de XML string (Google News Specifiek schema)
  const xmlItems = newsArticles
    .map((a) => {
      const dateStr = a.datePublished || a.date;
      const dateIso = new Date(dateStr).toISOString();
      const title = esc(a.title);

      return `
    <url>
      <loc>${SITE}/articles/${a.slug}</loc>
      <news:news>
        <news:publication>
          <news:name>EU Debt Map</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${dateIso}</news:publication_date>
        <news:title>${title}</news:title>
      </news:news>
    </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${xmlItems}
</urlset>`;

  // 4. Return als XML
  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800", // 1 uur cache
    },
  });
}