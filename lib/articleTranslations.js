// lib/articleTranslations.js

import articleTranslations from "@/content/article-translations.json";

export { articleTranslations };

export function getTranslationGroupBySlug(currentSlug, fromLang) {
  if (!currentSlug) return null;

  for (const entry of Object.values(articleTranslations)) {
    if (fromLang && entry[fromLang] === currentSlug) return entry;
    if (Object.values(entry).includes(currentSlug)) return entry;
  }

  return null;
}

/**
 * Vind voor een gegeven slug+bron-taal de slug in de doel-taal.
 */
export function getTranslatedSlug(currentSlug, fromLang, toLang) {
  if (!currentSlug || fromLang === toLang) return null;

  const entry = getTranslationGroupBySlug(currentSlug, fromLang);
  return entry?.[toLang] || null;
}

/**
 * Bouw de URL voor een vertaling of fallback naar overzicht.
 */
export function getArticleTranslationHref({ currentPath, fromLang, toLang }) {
  // currentPath is bv:
  // /articles/slug
  // /nl/articles/slug
  // /de/articles/slug

  // 1) haal locale + slug uit de huidige url
  let path = currentPath || "/";
  let lang = fromLang || "en";

  // detect locale uit path
  const matchLocale = path.match(/^\/(nl|de|fr)\//);
  if (matchLocale) {
    lang = matchLocale[1];
    path = path.replace(/^\/(nl|de|fr)/, ""); // strip locale prefix
  } else {
    lang = "en";
  }

  const m = path.match(/^\/articles\/([^/]+)$/);
  if (!m) {
    // geen artikel-detail: fallback naar overzicht voor doel-taal
    return toLang === "en" ? "/articles" : `/${toLang}/articles`;
  }

  const currentSlug = m[1];
  const targetLang = toLang || "en";

  // 2) check of er een vertaalde slug is
  const translatedSlug = getTranslatedSlug(currentSlug, lang, targetLang);

  if (translatedSlug) {
    // vertaling bestaat
    if (targetLang === "en") {
      return `/articles/${translatedSlug}`;
    }
    return `/${targetLang}/articles/${translatedSlug}`;
  }

  // 3) geen vertaling → fallback naar artikelen-overzicht in die taal
  if (targetLang === "en") return "/articles";
  return `/${targetLang}/articles`;
}
