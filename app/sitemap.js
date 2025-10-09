// app/sitemap.js
import { listArticles } from "@/lib/articles";
import { EUROSTAT_UPDATED_AT } from "@/lib/eurostat.gen";
import { countries } from "@/lib/data";

const SITE = "https://www.eudebtmap.com";
const DATA_LASTMOD = EUROSTAT_UPDATED_AT ? new Date(EUROSTAT_UPDATED_AT) : new Date();

// Talen ("" = en op root)
const LOCALES = ["", "nl", "de", "fr"];
const ALL_LOCALES = ["en", "nl", "de", "fr"];

// Statische paden die we in ALLE talen willen hebben
const STATIC_PATHS = [
  "/",              // Home
  "/debt-to-gdp",   // NIEUW in sitemap
  "/debt",
  "/about",
  "/methodology",
  // Privacy/Cookies kun je optioneel meertalig maken als je pagina's hebt
];

function withLocale(path, locale) {
  if (!locale) return path; // EN root
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

function languageAlternatesFor(path) {
  // Bouw hreflang alternates (en, nl, de, fr) voor een pad
  return {
    en: `${SITE}${withLocale(path, "")}`,
    nl: `${SITE}${withLocale(path, "nl")}`,
    de: `${SITE}${withLocale(path, "de")}`,
    fr: `${SITE}${withLocale(path, "fr")}`,
  };
}

export default async function sitemap() {
  const urls = [];

  // 1) Statische pagina's met hreflang alternates
  for (const p of STATIC_PATHS) {
    const alts = languageAlternatesFor(p);

    // Eén entry per taalvariant (zoals je nu ook voor country doet)
    for (const lang of ALL_LOCALES) {
      const locPath = withLocale(p, lang === "en" ? "" : lang);
      urls.push({
        url: `${SITE}${locPath}`,
        lastModified: DATA_LASTMOD,
        changeFrequency: p === "/" || p === "/debt-to-gdp" ? "daily" : "weekly",
        priority: p === "/" ? 1.0 : p === "/debt-to-gdp" ? 0.9 : 0.7,
        alternates: { languages: alts },
      });
    }
  }

  // 2) Country-pagina's met hreflang (nu uit lib/data i.p.v. hardcoded lijst)
  const list = Array.isArray(countries) ? countries : [];
  for (const c of list) {
    const code = String(c.code).toLowerCase();
    const path = `/country/${code}`;
    const alts = languageAlternatesFor(path);

    for (const lang of ALL_LOCALES) {
      const locPath = withLocale(path, lang === "en" ? "" : lang);
      urls.push({
        url: `${SITE}${locPath}`,
        lastModified: DATA_LASTMOD,
        changeFrequency: "daily",
        priority: 0.8,
        alternates: { languages: alts },
      });
    }
  }

  // 3) Artikelen (bewust ENG-only, geen hreflang)
  const articles = listArticles(); // newest-first
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
