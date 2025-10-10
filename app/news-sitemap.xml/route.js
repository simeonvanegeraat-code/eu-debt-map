// app/news-sitemap.xml/route.js
import { listArticles } from "@/lib/articles";

const SITE = "https://www.eudebtmap.com";
const PUBLICATION_NAME = "EU Debt Map";
const DEFAULT_LANG = "en";

function isFresh(iso) {
  const d = new Date(iso);
  if (Number.isNaN(+d)) return false;
  const diff = Date.now() - d.getTime();
  return diff >= 0 && diff <= 48 * 60 * 60 * 1000; // 48h
}

function esc(s = "") {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const fresh = listArticles().filter(a => isFresh(a.date)).slice(0, 100);

  const items = fresh.map(a => {
    const url = `${SITE}/articles/${a.slug}`;
    return `
  <url>
    <loc>${url}</loc>
    <news:news>
      <news:publication>
        <news:name>${esc(PUBLICATION_NAME)}</news:name>
        <news:language>${a.lang || DEFAULT_LANG}</news:language>
      </news:publication>
      <news:publication_date>${new Date(a.date).toISOString()}</news:publication_date>
      <news:title>${esc(a.title)}</news:title>
    </news:news>
  </url>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
