// app/rss.xml/route.js
export const runtime = "nodejs";        // nodig als listArticles fs gebruikt
export const revalidate = 1800;         // 30 min cache

const SITE = "https://www.eudebtmap.com";
const TITLE = "EU Debt Map – Articles";
const DESC = "Explainers and insights on EU government debt.";

function esc(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
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
    const items = (await safeListArticles()).slice(0, 20);

    const xmlItems = items.map(a => {
      const slug = esc(a?.slug ?? "");
      const title = a?.title ? `<![CDATA[${a.title}]]>` : "EU Debt Map Article";
      const summary = a?.summary ? `<![CDATA[${a.summary}]]>` : "";
      const date = a?.date ? new Date(a.date) : new Date();
      const link = `${SITE}/articles/${slug}`;

      return `
  <item>
    <title>${title}</title>
    <link>${link}</link>
    <guid>${link}</guid>
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
