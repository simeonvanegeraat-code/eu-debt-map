const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  FEATURED_COUNT,
  PAGE_SIZE,
  archivePagePath,
  archiveStaticParams,
  paginateArchive,
} = require("../lib/articleArchivePagination.cjs");

const ROOT = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function makeArticles(count) {
  return Array.from({ length: count }, (_, index) => ({
    lang: "en",
    slug: `article-${index + 1}`,
    title: `Article ${index + 1}`,
  }));
}

test("archive pagination keeps featured articles out and exposes every remaining article", () => {
  const articles = makeArticles(FEATURED_COUNT + PAGE_SIZE + 4);
  const firstPage = paginateArchive(articles, 1);
  const secondPage = paginateArchive(articles, 2);

  assert.equal(firstPage.items.length, PAGE_SIZE);
  assert.equal(firstPage.items[0].slug, "article-4");
  assert.equal(secondPage.items.length, 4);
  assert.equal(secondPage.items[0].slug, "article-16");
  assert.deepEqual(
    [...firstPage.items, ...secondPage.items].map((article) => article.slug),
    articles.slice(FEATURED_COUNT).map((article) => article.slug)
  );
});

test("pagination creates only real static pages and rejects invalid pages", () => {
  assert.deepEqual(archiveStaticParams(makeArticles(28)), [
    { page: "2" },
    { page: "3" },
  ]);
  assert.deepEqual(archiveStaticParams(makeArticles(12)), []);
  assert.equal(paginateArchive(makeArticles(16), 3), null);
  assert.equal(paginateArchive(makeArticles(16), "not-a-page"), null);
});

test("archive URLs are stable and localized", () => {
  assert.equal(archivePagePath("en", 1), "/articles");
  assert.equal(archivePagePath("en", 2), "/articles/page/2");
  assert.equal(archivePagePath("nl", 2), "/nl/articles/page/2");
  assert.equal(archivePagePath("de", 3), "/de/articles/page/3");
  assert.equal(archivePagePath("fr", 1), "/fr/articles");
});

test("all article hubs expose crawlable server pagination", () => {
  for (const page of [
    "app/articles/page.jsx",
    "app/nl/articles/page.jsx",
    "app/de/articles/page.jsx",
    "app/fr/articles/page.jsx",
  ]) {
    const source = read(page);
    assert.match(source, /ArticleArchivePagination/);
    assert.match(source, /articles=\{firstArchivePage\.items\}/);
    assert.match(source, /itemListElement: firstPageArticles\.map/);
  }
});

test("the language switcher cannot send archive visitors to a missing page", () => {
  const header = read("components/Header.jsx");

  assert.match(header, /isArticleArchivePage/);
  assert.match(header, /link\[rel="alternate"\]\[hreflang=/);
  assert.match(header, /`\/\$\{toLang\}\/articles`/);
});
