// app/robots.js

const SITE = "https://www.eudebtmap.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: [
      `${SITE}/sitemap.xml`,
      `${SITE}/news-sitemap.xml`,
    ],
  };
}