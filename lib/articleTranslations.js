// lib/articleTranslations.js

// Ondersteunde talen
const LOCALES = ["en", "nl", "de", "fr"];

/**
 * articleTranslations:
 * key = een intern id dat jij kiest
 * value = per taal de slug van dat artikel in die taal
 *
 * Vul dit met jouw echte artikelen.
 */
export const articleTranslations = {
  "eu-debt-dilemma": {
    en: "europes-debt-dilemma-investing-in-tomorrow-or-burdening-the-future",
    nl: "europa-schuldendilemma-investeren-voor-de-toekomst",
    // de: "...", // alleen invullen als je een Duitse versie hebt
    // fr: "...",
  },
  // voorbeeld:
  // "sweden-debt-tracker": {
  //   en: "sweden-national-debt-live-tracker-falling",
  //   nl: "zweedse-staatsschuld-live-tracker-dalend",
  // },
};

/**
 * Vind voor een gegeven slug+bron-taal de slug in de doel-taal.
 */
export function getTranslatedSlug(currentSlug, fromLang, toLang) {
  if (!currentSlug || fromLang === toLang) return null;

  for (const key of Object.keys(articleTranslations)) {
    const entry = articleTranslations[key];
    if (entry[fromLang] === currentSlug) {
      return entry[toLang] || null;
    }
  }
  return null;
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
