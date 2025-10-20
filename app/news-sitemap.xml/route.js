// app/news-sitemap.xml/route.js
export const runtime = "nodejs";        // forceer Node runtime (fs nodig)
export const revalidate = 1800;         // 30 min cache

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
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function safeListArticles() {
  try {
    const mod = await import("@/lib/articles");
    if (typeof mod?.listArticles === "function") {
      const list = mod.listArticles();
      return Array.isArray(list) ? list : [];
    }
  } catch {
    // noop: val teruggeven
  }
  return [];
}

export async function GET() {
  try {
    const all = await safeListArticles();
    const fresh = all.filter(a => isFresh(a?.date)).slice(0, 100);

    // Bouw items; valideren + escapings
    const items = fresh.map(a => {
      const slug = esc(a?.slug ?? "");
      const title = esc(a?.title ?? "EU Debt Map");
      const lang = esc(a?.lang ?? DEFAULT_LANG);
      const date = a?.date ? new Date(a.date) : new Date();
      const url = `${SITE}/articles/${slug}`;
      return `
  <url>
    <loc>${url}</loc>
    <news:news>
      <news:publication>
        <news:name>${esc(PUBLICATION_NAME)}</news:name>
        <news:language>${lang}</news:language>
      </news:publication>
      <news:publication_date>${date.toISOString()}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
    }).join("");

    // Altijd een geldige XML teruggeven (ook als er 0 items zijn)
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  } catch {
    // Fallback: minimal, maar geldig, zodat bestand nooit 0 B is
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>${SITE}/</loc>
    <news:news>
      <news:publication>
        <news:name>${esc(PUBLICATION_NAME)}</news:name>
        <news:language>${DEFAULT_LANG}</news:language>
      </news:publication>
      <news:publication_date>${new Date().toISOString()}</news:publication_date>
      <news:title>EU Debt Map</news:title>
    </news:news>
  </url>
</urlset>`;
    return new Response(fallback, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }
}
