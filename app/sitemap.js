// app/sitemap.js
export default async function sitemap() {
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

  const urls = [
    ...staticPaths,
    ...countries.map((c) => `country/${c.toLowerCase()}`),
  ].map((p) => ({
    url: `${siteUrl}${p === "" ? "" : `/${encodeURI(p)}`}`,
    lastModified: new Date(),                 // Next mag Date of string
    changeFrequency: "weekly",
    priority: p === "" ? 1.0 : p.startsWith("country/") ? 0.8 : 0.6,
  }));

  return urls;
}
