// app/sitemap.js
export async function GET() {
  const siteUrl = "https://www.eudebtmap.com";

  const staticPaths = [
    "", "about", "methodology", "privacy", "cookies",
    "nl", "nl/about", "nl/methodology", "nl/privacy", "nl/cookies",
    "de", "de/about", "de/methodology", "de/privacy", "de/cookies",
    "fr", "fr/about", "fr/methodology", "fr/privacy", "fr/cookies",
  ];

  const countries = [
    "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR",
    "HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"
  ];

  const countryPaths = countries.map(c => `country/${c.toLowerCase()}`);

  const urls = [...staticPaths, ...countryPaths];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(p => `
  <url>
    <loc>${siteUrl}/${p}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${p === "" ? "1.0" : p.startsWith("country/") ? "0.8" : "0.6"}</priority>
  </url>`).join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
