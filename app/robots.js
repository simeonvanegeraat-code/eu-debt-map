// app/robots.js
export default function robots() {
  const base = "https://www.eudebtmap.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: base,
    // meerdere sitemaps mag als array
    sitemap: [
      `${base}/sitemap.xml`,
      `${base}/news-sitemap.xml`,
    ],
  };
}
