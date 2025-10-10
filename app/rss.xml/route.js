// app/rss.xml/route.js
import { listArticles } from "@/lib/articles";

const SITE = "https://www.eudebtmap.com";
const TITLE = "EU Debt Map – Articles";
const DESC = "Explainers and insights on EU government debt.";

export async function GET() {
  const items = listArticles().slice(0, 20);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${TITLE}</title>
  <link>${SITE}</link>
  <description>${DESC}</description>
  ${items.map(a => `
  <item>
    <title><![CDATA[${a.title}]]></title>
    <link>${SITE}/articles/${a.slug}</link>
    <guid>${SITE}/articles/${a.slug}</guid>
    <pubDate>${new Date(a.date).toUTCString()}</pubDate>
    ${a.summary ? `<description><![CDATA[${a.summary}]]></description>` : ""}
  </item>`).join("")}
</channel>
</rss>`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
