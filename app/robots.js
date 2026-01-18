// app/robots.js
export default function robots() {
  const base = "https://www.eudebtmap.com";
  
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/"],
    },
    // Host is deprecated, maar kan geen kwaad
    host: base,
    sitemap: [
      `${base}/sitemap.xml`,       // Je algemene sitemap
      `${base}/news-sitemap.xml`,  // Je nieuwe News sitemap
      `${base}/rss.xml`,           // Je bestaande RSS feed (optioneel om hier te melden, maar mag)
    ],
  };
}