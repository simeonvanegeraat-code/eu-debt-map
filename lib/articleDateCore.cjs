const ARTICLE_TIME_ZONE = "Europe/Amsterdam";

const ARTICLE_DATE_LOCALES = {
  en: "en-GB",
  nl: "nl-NL",
  de: "de-DE",
  fr: "fr-FR",
};

function resolveLocale(langOrLocale = "en") {
  return ARTICLE_DATE_LOCALES[langOrLocale] || langOrLocale || ARTICLE_DATE_LOCALES.en;
}

function formatArticleDate(value, langOrLocale = "en", options = {}) {
  if (!value) return "";

  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat(resolveLocale(langOrLocale), {
      ...options,
      timeZone: ARTICLE_TIME_ZONE,
    }).format(date);
  } catch {
    return String(value);
  }
}

module.exports = {
  ARTICLE_TIME_ZONE,
  formatArticleDate,
};
