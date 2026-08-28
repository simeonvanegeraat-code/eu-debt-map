const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  EU_COUNTRY_CODES,
  selectCountryRelatedArticle,
} = require("../lib/relatedArticlesCore.cjs");

const ROOT = path.resolve(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const LANGS = ["en", "nl", "de", "fr"];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function jsonFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) return jsonFiles(filePath);
    return entry.isFile() && entry.name.endsWith(".json") ? [filePath] : [];
  });
}

function loadArticles() {
  return jsonFiles(ARTICLES_DIR).map((filePath) => {
    const article = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const lang = article.lang;
    const prefix = lang === "en" ? "" : `/${lang}`;

    return {
      ...article,
      url: `${prefix}/articles/${article.slug}`,
      __file: path.relative(ROOT, filePath),
    };
  });
}

test("an explicit country match wins over a newer general fallback", () => {
  const result = selectCountryRelatedArticle({
    lang: "nl",
    countryCode: "NL",
    articles: [
      {
        lang: "nl",
        slug: "eu-overzicht",
        title: "EU-overzicht",
        dateModified: "2026-08-01",
        countryPageFallback: true,
      },
      {
        lang: "nl",
        slug: "nederland",
        title: "Nederland",
        dateModified: "2026-07-01",
        relatedCountries: ["NL"],
        body: "This large field must never be sent to the card.",
      },
    ],
  });

  assert.equal(result.slug, "nederland");
  assert.equal(Object.hasOwn(result, "body"), false);
});

test("an optional preferred slug wins without changing the default selection", () => {
  const articles = [
    {
      lang: "de",
      slug: "newer-germany-analysis",
      title: "Neuere Deutschland-Analyse",
      dateModified: "2026-08-20",
      relatedCountries: ["DE"],
    },
    {
      lang: "de",
      slug: "schuldenuhr-deutschland",
      title: "Schuldenuhr Deutschland",
      dateModified: "2026-08-10",
      relatedCountries: ["DE"],
    },
  ];

  assert.equal(
    selectCountryRelatedArticle({
      articles,
      lang: "de",
      countryCode: "DE",
    }).slug,
    "newer-germany-analysis"
  );

  assert.equal(
    selectCountryRelatedArticle({
      articles,
      lang: "de",
      countryCode: "DE",
      preferredSlug: "schuldenuhr-deutschland",
    }).slug,
    "schuldenuhr-deutschland"
  );

  assert.equal(
    selectCountryRelatedArticle({
      articles,
      lang: "de",
      countryCode: "DE",
      preferredSlug: "missing-or-unrelated",
    }).slug,
    "newer-germany-analysis"
  );
});

test("selection never crosses languages and safely rejects invalid countries", () => {
  const articles = [
    {
      lang: "en",
      slug: "english",
      title: "English",
      countryPageFallback: true,
    },
  ];

  assert.equal(
    selectCountryRelatedArticle({ articles, lang: "fr", countryCode: "FR" }),
    null
  );
  assert.equal(
    selectCountryRelatedArticle({ articles, lang: "en", countryCode: "XX" }),
    null
  );
  assert.equal(
    selectCountryRelatedArticle({
      articles: [
        {
          slug: "missing-language",
          title: "Missing language",
          countryPageFallback: true,
        },
      ],
      lang: "en",
      countryCode: "NL",
    }),
    null
  );
});

test("article relationship metadata stays valid and has one fallback per language", () => {
  const articles = loadArticles();

  for (const article of articles) {
    if (article.relatedCountries === undefined) continue;

    assert.equal(
      Array.isArray(article.relatedCountries),
      true,
      `${article.__file} must use an array for relatedCountries`
    );

    for (const code of article.relatedCountries) {
      assert.equal(
        EU_COUNTRY_CODES.has(String(code).toUpperCase()),
        true,
        `${article.__file} contains an invalid EU country code: ${code}`
      );
    }
  }

  for (const lang of LANGS) {
    const fallbacks = articles.filter(
      (article) => article.lang === lang && article.countryPageFallback === true
    );

    assert.equal(fallbacks.length, 1, `${lang} must have exactly one fallback`);
    assert.equal(fallbacks[0].slug, "eu-debt-burden-2026");
  }
});

test("all 27 country pages receive a valid article in their own language", () => {
  const articles = loadArticles();

  for (const lang of LANGS) {
    const expectedPrefix = lang === "en" ? "/articles/" : `/${lang}/articles/`;

    for (const countryCode of EU_COUNTRY_CODES) {
      const result = selectCountryRelatedArticle({
        articles,
        lang,
        countryCode,
      });

      assert.ok(result, `${lang}/${countryCode} must have a related article`);
      assert.equal(result.lang, lang);
      assert.equal(result.url.startsWith(expectedPrefix), true);
      assert.equal(Object.hasOwn(result, "body"), false);
    }
  }
});

test("country routes render the server-selected slot after content and advertising", () => {
  const client = read("app/country/[code]/CountryClient.jsx");
  const experience = read("components/country/CountryPageExperience.jsx");
  const adIndex = experience.indexOf(": adSlot ? (");
  const introIndex = experience.indexOf("{introSlot ?");
  const mapIndex = experience.indexOf("{mapSlot}");
  const relatedIndex = experience.indexOf("{relatedArticleSlot}");

  assert.equal(client.includes("LatestArticles"), false);
  assert.match(client, /adSlot=\{<ManualAd/);
  assert.match(client, /introSlot=\{introSlot\}/);
  assert.match(client, /mapSlot=\{<MapCTA/);
  assert.match(client, /relatedArticleSlot=\{relatedArticleSlot\}/);
  assert.ok(adIndex >= 0);
  assert.ok(adIndex < introIndex);
  assert.ok(introIndex < mapIndex);
  assert.ok(mapIndex < relatedIndex);

  for (const route of [
    "app/country/[code]/page.jsx",
    "app/nl/country/[code]/page.jsx",
    "app/de/country/[code]/page.jsx",
    "app/fr/country/[code]/page.jsx",
  ]) {
    const source = read(route);
    assert.match(source, /CountryRelatedArticleServer/);
    assert.match(source, /relatedArticleSlot=/);
  }
});
