// app/news-sitemap.xml/route.js
import { listArticles } from "@/lib/articles";
import newsSitemapCore from "@/lib/newsSitemapCore.cjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const { buildNewsSitemap, SUPPORTED_LANGUAGES } = newsSitemapCore;

export async function GET() {
  let articles = [];

  try {
    articles = SUPPORTED_LANGUAGES.flatMap(
      (lang) => listArticles({ lang }) || []
    );
  } catch (error) {
    console.error("News sitemap error:", error);
  }

  const xml = buildNewsSitemap({ articles });

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300",
    },
  });
}
