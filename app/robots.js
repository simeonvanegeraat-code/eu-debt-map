// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.eudebtmap.com/sitemap.xml",
    host: "https://www.eudebtmap.com",
  };
}
