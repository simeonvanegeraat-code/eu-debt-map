// app/sitemap.js
import { listArticles } from "@/lib/articles";
import { EUROSTAT_UPDATED_AT } from "@/lib/eurostat.gen";

export default async function sitemap() {
  const SITE = "https://www.eudebtmap.com";

  // Gebruik dataset-timestamp als lastModified voor data-gedreven routes
  const dataLastMod = EUROSTAT_UPDATED_AT ? new Date(EUROSTAT_UPDATED_AT) : new Date();

  // Statische routes op root
  const ROOT_STATIC = ["", "about", "debt", "methodology", "privacy", "cookies", "articles"];

  // Locale home + locale subpages die ook echt bestaan in /app/<locale>/
  const LOCALES = ["nl", "de", "fr"]; // bestaande locale secties
  const LOCALE_SUBPAGES = ["about", "debt", "methodology", "privacy"]; // géén cookies in locales

  // Hreflang talen (inclusief EN)
  const ALL_LOCALES = ["en", "nl", "de", "fr"];

  // EU-27 landcodes (country/[code])
  const COUNTRY_CODES = [
    "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR",
    "HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"
  ];

  const urls = [];

  // Root + statische pagina's
  for (const p of ROOT_STATIC) {
    const isHome = p === "";
    const isArticlesList = p === "articles";
    urls.push({
      url: `${SITE}${isHome ? "" : `/${p}`}`,
      lastModified: isHome ? dataLastMod : (isArticlesList ? new Date() : dataLastMod),
      changeFrequency: isHome ? "daily" : (isArticlesList ? "weekly" : "monthly"),
      priority: isHome ? 1.0 : (isArticlesList ? 0.7 : 0.6),
    });
  }

  // Locale home + locale subpages
  for (const loc of LOCALES) {
    // /nl, /de, /fr
    urls.push({
      url: `${SITE}/${loc}`,
      lastModified: dataLastMod,
      changeFrequency: "weekly",
      priority: 0.9,
    });

    // /nl/about, /nl/debt, ...
    for (const sp of LOCALE_SUBPAGES) {
      urls.push({
        url: `${SITE}/${loc}/${sp}`,
        lastModified: dataLastMod,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // Country-pagina's met hreflang alternates (EN + NL/DE/FR)
  for (const code of COUNTRY_CODES) {
    const low = code.toLowerCase();
    const langs = {
      en: `${SITE}/country/${low}`,
      nl: `${SITE}/nl/country/${low}`,
      de: `${SITE}/de/country/${low}`,
      fr: `${SITE}/fr/country/${low}`,
    };
    for (const loc of ALL_LOCALES) {
      urls.push({
        url: langs[loc],
        lastModified: dataLastMod,
        changeFrequency: "daily",
        priority: 0.8,
        alternates: { languages: langs },
      });
    }
  }

  // Artikelen (file-based CMS)
  const articles = listArticles(); // nieuwste eerst
  for (const a of articles) {
    urls.push({
      url: `${SITE}/articles/${a.slug}`,
      lastModified: a.date ? new Date(a.date) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return urls;
}
