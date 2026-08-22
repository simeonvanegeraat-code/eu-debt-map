const SUPPORTED_LANGS = new Set(["en", "nl", "de", "fr"]);

const EU_COUNTRY_CODES = new Set([
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
]);

function normalizeLang(value) {
  const lang = String(value || "en").toLowerCase();
  return SUPPORTED_LANGS.has(lang) ? lang : "en";
}

function normalizeCountryCode(value) {
  const code = String(value || "").toUpperCase();
  return EU_COUNTRY_CODES.has(code) ? code : null;
}

function articleDate(article) {
  return article?.dateModified || article?.datePublished || article?.date || "";
}

function dateScore(article) {
  const date = new Date(articleDate(article));
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function newestFirst(a, b) {
  const difference = dateScore(b) - dateScore(a);
  if (difference !== 0) return difference;
  return String(a?.title || "").localeCompare(String(b?.title || ""));
}

function isValidArticle(article, lang) {
  const articleLang = String(article?.lang || "").toLowerCase();

  return Boolean(
    article &&
      article.slug &&
      article.title &&
      SUPPORTED_LANGS.has(articleLang) &&
      articleLang === lang
  );
}

function isRelatedToCountry(article, countryCode) {
  if (!Array.isArray(article?.relatedCountries)) return false;

  return article.relatedCountries.some(
    (value) => normalizeCountryCode(value) === countryCode
  );
}

function toArticleCard(article) {
  if (!article) return null;

  return {
    slug: article.slug,
    title: article.title,
    summary: article.summary || article.excerpt || "",
    image: article.image || null,
    imageAlt: article.imageAlt || article.title,
    lang: normalizeLang(article.lang),
    date: articleDate(article),
    url: article.url,
  };
}

function selectCountryRelatedArticle({
  articles = [],
  lang = "en",
  countryCode,
  preferredSlug = null,
} = {}) {
  const normalizedLang = normalizeLang(lang);
  const normalizedCountry = normalizeCountryCode(countryCode);

  if (!normalizedCountry || !Array.isArray(articles)) return null;

  const sameLanguage = articles.filter((article) =>
    isValidArticle(article, normalizedLang)
  );

  const preferredMatch = preferredSlug
    ? sameLanguage.find(
        (article) =>
          article.slug === preferredSlug &&
          isRelatedToCountry(article, normalizedCountry)
      )
    : null;

  if (preferredMatch) return toArticleCard(preferredMatch);

  const exactMatch = sameLanguage
    .filter((article) => isRelatedToCountry(article, normalizedCountry))
    .sort(newestFirst)[0];

  if (exactMatch) return toArticleCard(exactMatch);

  const fallback = sameLanguage
    .filter((article) => article.countryPageFallback === true)
    .sort(newestFirst)[0];

  return toArticleCard(fallback);
}

module.exports = {
  EU_COUNTRY_CODES,
  SUPPORTED_LANGS,
  normalizeCountryCode,
  normalizeLang,
  selectCountryRelatedArticle,
  toArticleCard,
};
