// app/sitemap.js
/** Hardened sitemap: always returns valid entries, even if imports fail. */

const SITE = "https://www.eudebtmap.com";

// Talen ("" = en op root)
const LOCALES = ["", "nl", "de", "fr"];
const ALL_LOCALES = ["en", "nl", "de", "fr"];

// Statische paden die we in ALLE talen willen hebben
const STATIC_PATHS = [
  "/",            // Home
  "/debt-to-gdp", // NIEUW in sitemap
  "/debt",
  "/about",
  "/methodology",
];

function withLocale(path, locale) {
  if (!locale) return path; // EN root
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

function languageAlternatesFor(path) {
  // hreflang alternates (en, nl, de, fr)
  return {
    en: `${SITE}${withLocale(path, "")}`,
    nl: `${SITE}${withLocale(path, "nl")}`,
    de: `${SITE}${withLocale(path, "de")}`,
    fr: `${SITE}${withLocale(path, "fr")}`,
  };
}

export default async function sitemap() {
  // --------- SAFE IMPORTS + FALLBACKS ----------
  let EUROSTAT_UPDATED_AT = null;
  let countries = [];
  let listArticles = () => [];

  try {
    // eurostat.gen should only export constants; if not present, ignore
    const eurostat = await import("@/lib/eurostat.gen").catch(() => ({}));
    EUROSTAT_UPDATED_AT = eurostat?.EUROSTAT_UPDATED_AT ?? null;
  } catch {}

  try {
    const dataMod = await import("@/lib/data").catch(() => ({}));
    countries = Array.isArray(dataMod?.countries) ? dataMod.countries : [];
  } catch {}

  try {
    const artMod = await import("@/lib/articles").catch(() => ({}));
    if (typeof artMod?.listArticles === "function") listArticles = artMod.listArticles;
  } catch {}

  const DATA_LASTMOD = EUROSTAT_UPDATED_AT ? new Date(EUROSTAT_UPDATED_AT) : new Date();

  // We bouwen in een Set om duplicaten te voorkomen
  const seen = new Set();
  const urls = [];

  // Helper om veilig toe te voegen
  const pushUrl = (entry) => {
    try {
      if (!entry?.url) return;
      if (seen.has(entry.url)) return;
      seen.add(entry.url);
      urls.push(entry);
    } catch {
      /* ignore broken entry */
    }
  };

  // --------- 1) Statische pagina's in alle talen ----------
  for (const p of STATIC_PATHS) {
    const alts = languageAlternatesFor(p);
    for (const lang of ALL_LOCALES) {
      const locPath = withLocale(p, lang === "en" ? "" : lang);
      pushUrl({
        url: `${SITE}${locPath}`,
        lastModified: DATA_LASTMOD,
        changeFrequency: (p === "/" || p === "/debt-to-gdp") ? "daily" : "weekly",
        priority: p === "/" ? 1.0 : p === "/debt-to-gdp" ? 0.9 : 0.7,
        alternates: { languages: alts },
      });
    }
  }

  // --------- 2) Country-pagina's in alle talen ----------
  if (Array.isArray(countries) && countries.length) {
    for (const c of countries) {
      const code = String(c?.code ?? "").toLowerCase();
      if (!code) continue;
      const path = `/country/${code}`;
      const alts = languageAlternatesFor(path);

      for (const lang of ALL_LOCALES) {
        const locPath = withLocale(path, lang === "en" ? "" : lang);
        pushUrl({
          url: `${SITE}${locPath}`,
          lastModified: DATA_LASTMOD,
          changeFrequency: "daily",
          priority: 0.8,
          alternates: { languages: alts },
        });
      }
    }
  }

  // --------- 3) Artikelen (ENG-only) ----------
  let articles = [];
  try {
    articles = listArticles() || [];
  } catch {
    articles = [];
  }

  if (Array.isArray(articles) && articles.length) {
    for (const a of articles) {
      // Verwacht: { slug, date }
      const slug = a?.slug ? String(a.slug) : null;
      if (!slug) continue;
      const lm = a?.date ? new Date(a.date) : DATA_LASTMOD;
      pushUrl({
        url: `${SITE}/articles/${slug}`,
        lastModified: lm,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // --------- 4) Minimale fallback (NOOIT leeg) ----------
  if (urls.length === 0) {
    // Geef in elk geval de homepage terug zodat sitemap nooit 0 B is
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
