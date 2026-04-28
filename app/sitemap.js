// app/sitemap.js
// Hardened sitemap for EU Debt Map.
// Includes static pages, localized pages, country pages, article hubs,
// article detail pages and image sitemap data for articles.

const SITE = "https://www.eudebtmap.com";

const ALL_LOCALES = ["en", "nl", "de", "fr"];
const LOCALE_PREFIX = {
  en: "",
  nl: "/nl",
  de: "/de",
  fr: "/fr",
};

const STATIC_PATHS = [
  {
    path: "/",
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    path: "/debt-to-gdp",
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    path: "/debt",
    changeFrequency: "weekly",
    priority: 0.75,
  },
  {
    path: "/articles",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/about",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    path: "/methodology",
    changeFrequency: "weekly",
    priority: 0.75,
  },
];

const EN_ONLY_PATHS = [
  {
    path: "/eu-debt",
    changeFrequency: "weekly",
    priority: 0.75,
  },
];

function withLocale(path, lang = "en") {
  const prefix = LOCALE_PREFIX[lang] ?? "";

  if (!prefix) return path;
  if (path === "/") return prefix;

  return `${prefix}${path}`;
}

function urlFor(path, lang = "en") {
  return `${SITE}${withLocale(path, lang)}`;
}

function languageAlternatesFor(path) {
  return Object.fromEntries(
    ALL_LOCALES.map((lang) => [lang, urlFor(path, lang)])
  );
}

function safeDate(value, fallback = new Date()) {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return date;
}

function absoluteImageUrl(image) {
  if (!image) return undefined;
  if (/^https?:\/\//i.test(image)) return image;
  return `${SITE}${image.startsWith("/") ? image : `/${image}`}`;
}

function articleUrl(article) {
  if (article?.url) {
    return article.url.startsWith("http")
      ? article.url
      : `${SITE}${article.url}`;
  }

  const lang = article?.lang || "en";
  const prefix = LOCALE_PREFIX[lang] ?? "";
  return `${SITE}${prefix}/articles/${article.slug}`;
}

function articleAlternates(article, translations = []) {
  if (!article?.slug) return undefined;

  const actualTranslations = Array.isArray(translations)
    ? translations.filter((t) => t?.slug && t?.lang)
    : [];

  if (!actualTranslations.length) {
    return undefined;
  }

  const languages = Object.fromEntries(
    actualTranslations.map((t) => {
      const prefix = LOCALE_PREFIX[t.lang] ?? "";
      return [t.lang, `${SITE}${prefix}/articles/${t.slug}`];
    })
  );

  if (!languages.en) {
    languages["x-default"] = articleUrl(article);
  } else {
    languages["x-default"] = languages.en;
  }

  return { languages };
}

export default async function sitemap() {
  let EUROSTAT_UPDATED_AT = null;
  let countries = [];
  let listArticles = () => [];
  let getTranslations = () => [];

  try {
    const eurostat = await import("@/lib/eurostat.gen").catch(() => ({}));
    EUROSTAT_UPDATED_AT = eurostat?.EUROSTAT_UPDATED_AT ?? null;
  } catch {
    EUROSTAT_UPDATED_AT = null;
  }

  try {
    const dataMod = await import("@/lib/data").catch(() => ({}));
    countries = Array.isArray(dataMod?.countries) ? dataMod.countries : [];
  } catch {
    countries = [];
  }

  try {
    const articlesMod = await import("@/lib/articles").catch(() => ({}));

    if (typeof articlesMod?.listArticles === "function") {
      listArticles = articlesMod.listArticles;
    }

    if (typeof articlesMod?.getTranslations === "function") {
      getTranslations = articlesMod.getTranslations;
    }
  } catch {
    listArticles = () => [];
    getTranslations = () => [];
  }

  const DATA_LASTMOD = safeDate(EUROSTAT_UPDATED_AT);
  const seen = new Set();
  const urls = [];

  function pushUrl(entry) {
    if (!entry?.url) return;
    if (seen.has(entry.url)) return;

    seen.add(entry.url);
    urls.push(entry);
  }

  // 1. Static localized pages.
  for (const item of STATIC_PATHS) {
    const alternates = languageAlternatesFor(item.path);

    for (const lang of ALL_LOCALES) {
      pushUrl({
        url: urlFor(item.path, lang),
        lastModified: DATA_LASTMOD,
        changeFrequency: item.changeFrequency,
        priority: item.priority,
        alternates: { languages: alternates },
      });
    }
  }

  // 2. English-only special pages.
  for (const item of EN_ONLY_PATHS) {
    pushUrl({
      url: `${SITE}${item.path}`,
      lastModified: DATA_LASTMOD,
      changeFrequency: item.changeFrequency,
      priority: item.priority,
    });
  }

  // 3. Country pages in all languages.
  if (Array.isArray(countries) && countries.length) {
    for (const country of countries) {
      const code = String(country?.code ?? "").toLowerCase();
      if (!code) continue;

      const path = `/country/${code}`;
      const alternates = languageAlternatesFor(path);

      for (const lang of ALL_LOCALES) {
        pushUrl({
          url: urlFor(path, lang),
          lastModified: DATA_LASTMOD,
          changeFrequency: "daily",
          priority: 0.8,
          alternates: { languages: alternates },
        });
      }
    }
  }

  // 4. Article detail pages.
  let articles = [];

  try {
    articles = listArticles() || [];
  } catch {
    articles = [];
  }

  if (Array.isArray(articles) && articles.length) {
    for (const article of articles) {
      if (!article?.slug) continue;

      const published = article.datePublished || article.date;
      const modified = article.dateModified || published;
      const lastModified = safeDate(modified, DATA_LASTMOD);
      const imageUrl = absoluteImageUrl(article.image);

      let translations = [];
      try {
        translations = getTranslations(article.slug) || [];
      } catch {
        translations = [];
      }

      pushUrl({
        url: articleUrl(article),
        lastModified,
        changeFrequency: "monthly",
        priority: article.lang === "en" ? 0.72 : 0.65,
        images: imageUrl ? [imageUrl] : undefined,
        alternates: articleAlternates(article, translations),
      });
    }
  }

  // 5. Safe fallback so sitemap is never empty.
  if (!urls.length) {
    return [
      {
        url: `${SITE}/`,
        lastModified: DATA_LASTMOD,
        changeFrequency: "daily",
        priority: 1.0,
      },
    ];
  }

  return urls;
}