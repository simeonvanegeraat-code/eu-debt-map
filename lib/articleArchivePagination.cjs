const SUPPORTED_LANGS = ["en", "nl", "de", "fr"];
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };

const FEATURED_COUNT = 3;
const PAGE_SIZE = 12;

function normalizeLang(value) {
  const lang = String(value || "en").toLowerCase();
  return SUPPORTED_LANGS.includes(lang) ? lang : "en";
}

function archiveBasePath(lang = "en") {
  const normalizedLang = normalizeLang(lang);
  return `${ROUTE_PREFIX[normalizedLang]}/articles`;
}

function archivePagePath(lang = "en", page = 1) {
  const pageNumber = Number(page);
  const basePath = archiveBasePath(lang);

  return Number.isInteger(pageNumber) && pageNumber > 1
    ? `${basePath}/page/${pageNumber}`
    : basePath;
}

function archiveArticles(articles = []) {
  const safeArticles = Array.isArray(articles) ? articles : [];

  return safeArticles.length > FEATURED_COUNT
    ? safeArticles.slice(FEATURED_COUNT)
    : safeArticles;
}

function paginateArchive(articles = [], page = 1) {
  const pageNumber = Number(page);
  const items = archiveArticles(articles);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));

  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    pageNumber > totalPages
  ) {
    return null;
  }

  const start = (pageNumber - 1) * PAGE_SIZE;

  return {
    currentPage: pageNumber,
    items: items.slice(start, start + PAGE_SIZE),
    pageSize: PAGE_SIZE,
    totalItems: items.length,
    totalPages,
  };
}

function archiveStaticParams(articles = []) {
  const firstPage = paginateArchive(articles, 1);
  if (!firstPage || firstPage.totalPages < 2) return [];

  return Array.from({ length: firstPage.totalPages - 1 }, (_, index) => ({
    page: String(index + 2),
  }));
}

module.exports = {
  FEATURED_COUNT,
  PAGE_SIZE,
  SUPPORTED_LANGS,
  archiveArticles,
  archiveBasePath,
  archivePagePath,
  archiveStaticParams,
  normalizeLang,
  paginateArchive,
};
