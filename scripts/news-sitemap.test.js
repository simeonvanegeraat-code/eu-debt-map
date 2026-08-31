const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildNewsSitemap,
  isRecentNewsArticle,
} = require("../lib/newsSitemapCore.cjs");

const NOW = new Date("2026-08-31T12:00:00.000Z");

function article(overrides = {}) {
  return {
    articleType: "news",
    datePublished: "2026-08-30T12:00:00.000Z",
    lang: "en",
    slug: "example-news",
    title: "Example & verified news",
    ...overrides,
  };
}

test("news sitemap includes recent news for every supported locale", () => {
  const xml = buildNewsSitemap({
    now: NOW,
    articles: [
      article({ lang: "en", slug: "english-news", title: "English news" }),
      article({ lang: "nl", slug: "nederlands-nieuws", title: "Nederlands nieuws" }),
      article({ lang: "de", slug: "deutsche-nachricht", title: "Deutsche Nachricht" }),
      article({ lang: "fr", slug: "actualite-francaise", title: "Actualité française" }),
    ],
  });

  assert.match(xml, /<loc>https:\/\/www\.eudebtmap\.com\/articles\/english-news<\/loc>/);
  assert.match(xml, /<loc>https:\/\/www\.eudebtmap\.com\/nl\/articles\/nederlands-nieuws<\/loc>/);
  assert.match(xml, /<loc>https:\/\/www\.eudebtmap\.com\/de\/articles\/deutsche-nachricht<\/loc>/);
  assert.match(xml, /<loc>https:\/\/www\.eudebtmap\.com\/fr\/articles\/actualite-francaise<\/loc>/);

  for (const lang of ["en", "nl", "de", "fr"]) {
    assert.match(xml, new RegExp(`<news:language>${lang}<\\/news:language>`));
  }
});

test("news sitemap excludes non-news, future and unsupported articles", () => {
  const articles = [
    article({ articleType: "analysis", slug: "analysis" }),
    article({ datePublished: "2026-08-31T12:00:01.000Z", slug: "future" }),
    article({ lang: "es", slug: "unsupported" }),
  ];
  const xml = buildNewsSitemap({ articles, now: NOW });

  assert.doesNotMatch(xml, /analysis|future|unsupported/);
});

test("older news remains a regular URL without stale News metadata", () => {
  const xml = buildNewsSitemap({
    now: NOW,
    articles: [
      article({
        datePublished: "2026-08-21T12:00:00.000Z",
        lang: "nl",
        slug: "ouder-nieuws",
        title: "Ouder Nederlands nieuws",
      }),
    ],
  });

  assert.match(xml, /<loc>https:\/\/www\.eudebtmap\.com\/nl\/articles\/ouder-nieuws<\/loc>/);
  assert.doesNotMatch(xml, /<news:news>/);
  assert.doesNotMatch(xml, /<news:publication_date>/);
});

test("the 48-hour boundary is included and XML values are escaped", () => {
  const boundaryArticle = article({
    datePublished: "2026-08-29T12:00:00.000Z",
    slug: "boundary",
    title: "Debt & growth < update",
  });

  assert.equal(isRecentNewsArticle(boundaryArticle, NOW), true);

  const xml = buildNewsSitemap({ articles: [boundaryArticle], now: NOW });
  assert.match(xml, /Debt &amp; growth &lt; update/);
});
