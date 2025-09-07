// app/sitemap.js
export async function GET() {
  const siteUrl = "https://www.eudebtmap.com";

  // Statische pagina's (EN + lokalisaties)
  const staticPaths = [
    "", "about", "methodology", "privacy", "cookies",
    "nl", "nl/about", "nl/methodology", "nl/privacy", "nl/cookies",
    "de", "de/about", "de/methodology", "de/privacy", "de/cookies",
    "fr", "fr/about", "fr/methodology", "fr/privacy", "fr/cookies",
  ];

  // EU-27 (let op: GR i.p.v. EL)
  const countries = [
    "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR",
    "HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"
  ];

  const countryPaths = countries.map(c => `country/${c.toLowerCase()}`);

  // Alle paden samen
  const urls = [...staticPaths, ...countryPaths];

  // Genereer XML
  const now = new Date().toISOString(); // prima met milliseconden
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((p) => {
  const cleanPath = p === "" ? "" : `/${p}`;                         // root: geen extra slash
  const loc = `${siteUrl}${encodeURI(cleanPath)}`;                   // URL-safe
  const priority = p === "" ? "1.0" : p.startsWith("country/") ? "0.8" : "0.6";
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      // Bots mogen 'm gerust een dag cachen; wijziging wordt bij volgende crawl opgepikt
      "Cache-Control": "public, max-age=86400",
    },
    status: 200,
  });
}
