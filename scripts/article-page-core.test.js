const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  ARTICLE_AD_MARKER,
  buildArticleJsonLd,
  buildArticleMetadata,
  safeIsoDate,
  splitArticleBody,
} = require("../lib/articlePageCore.cjs");

const ROOT = path.resolve(__dirname, "..");

test("article body without a marker remains unchanged", () => {
  assert.deepEqual(splitArticleBody("<p>Body</p>"), {
    bodyBeforeAd: "<p>Body</p>",
    bodyAfterAd: "",
    hasMidArticleAd: false,
  });
});

test("article body marker produces one clean split", () => {
  assert.deepEqual(
    splitArticleBody(`<p>Before</p>${ARTICLE_AD_MARKER}<p>After</p>`),
    {
      bodyBeforeAd: "<p>Before</p>",
      bodyAfterAd: "<p>After</p>",
      hasMidArticleAd: true,
    }
  );
});

test("shared metadata uses the localized SEO title and hreflang routes", () => {
  const metadata = buildArticleMetadata({
    article: {
      slug: "example",
      title: "Long visible title",
      seoTitle: "Focused search title",
      summary: "Summary",
      lang: "de",
      datePublished: "2026-04-28T00:00:00+02:00",
      image: "/images/example.jpg",
      author: { name: "EU Debt Map Research" },
    },
    translations: [
      { lang: "en", slug: "example" },
      { lang: "de", slug: "example" },
    ],
    slug: "example",
    lang: "de",
    ogImage: "https://www.eudebtmap.com/images/example.jpg",
  });

  assert.equal(metadata.title, "Focused search title • EU Debt Map");
  assert.equal(
    metadata.alternates.canonical,
    "https://www.eudebtmap.com/de/articles/example"
  );
  assert.equal(
    metadata.alternates.languages.en,
    "https://www.eudebtmap.com/articles/example"
  );
  assert.equal(
    metadata.alternates.languages.de,
    "https://www.eudebtmap.com/de/articles/example"
  );
  assert.equal(
    metadata.alternates.languages["x-default"],
    "https://www.eudebtmap.com/articles/example"
  );
});

test("shared schema distinguishes analysis from news and preserves review data", () => {
  const article = {
    title: "Example analysis",
    summary: "Summary",
    articleType: "analysis",
    lang: "fr",
    datePublished: "2026-04-28T00:00:00+02:00",
    dateModified: "2026-08-01T00:00:00+02:00",
    dateReviewed: "2026-08-01T00:00:00+02:00",
    author: { name: "EU Debt Map Research", url: "https://www.eudebtmap.com/about" },
    reviewedBy: { name: "EU Debt Map Editorial Review" },
    tags: ["EU debt", "Eurostat"],
    image: "/images/example.jpg",
  };
  const schema = buildArticleJsonLd({
    article,
    url: "https://www.eudebtmap.com/fr/articles/example",
    lang: "fr",
  });

  assert.equal(schema["@type"], "Article");
  assert.equal(schema.inLanguage, "fr");
  assert.equal(schema.author["@type"], "Organization");
  assert.equal(schema.reviewedBy["@type"], "Organization");
  assert.equal(schema.dateReviewed, "2026-07-31T22:00:00.000Z");
  assert.equal(schema.publisher.logo.url, "https://www.eudebtmap.com/eu_favicon_512.png");
  assert.equal(schema.image[0].url, "https://www.eudebtmap.com/images/example.jpg");
  assert.equal(schema.keywords, "EU debt, Eurostat");

  const newsSchema = buildArticleJsonLd({
    article: { ...article, articleType: "news" },
    url: "https://www.eudebtmap.com/fr/articles/news",
    lang: "fr",
  });
  assert.equal(newsSchema["@type"], "NewsArticle");
});

test("invalid dates are omitted safely", () => {
  assert.equal(safeIsoDate("not-a-date"), undefined);
  assert.equal(safeIsoDate(null), undefined);
});

test("all article files contain at most one manual ad marker", () => {
  const contentRoot = path.join(ROOT, "content", "articles");
  const stack = [contentRoot];

  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const filePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(filePath);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;

      const article = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const body = typeof article.body === "string" ? article.body : "";
      const markerCount = body.split(ARTICLE_AD_MARKER).length - 1;
      assert.ok(
        markerCount <= 1,
        `${path.relative(ROOT, filePath)} contains ${markerCount} ad markers`
      );
    }
  }
});

test("all localized article routes use the shared body and schema helpers", () => {
  const routes = [
    "app/articles/[slug]/page.jsx",
    "app/nl/articles/[slug]/page.jsx",
    "app/de/articles/[slug]/page.jsx",
    "app/fr/articles/[slug]/page.jsx",
  ];

  for (const route of routes) {
    const source = fs.readFileSync(path.join(ROOT, route), "utf8");
    assert.match(source, /<ArticleBody body=\{article\.body\} \/>/, route);
    assert.match(source, /buildArticleMetadata\(/, route);
    assert.match(source, /buildArticleJsonLd\(/, route);
    assert.match(
      source,
      /<style dangerouslySetInnerHTML=\{\{ __html: css \}\} \/>/,
      route
    );
    assert.doesNotMatch(
      source,
      /dangerouslySetInnerHTML=\{\{ __html: article\.body/,
      route
    );
    assert.doesNotMatch(source, /<style>\{css\}<\/style>/, route);
    assert.doesNotMatch(source, /"@type": "NewsArticle"/, route);
  }
});

test("homepage article cards use isolated responsive styles and descriptive links", () => {
  const card = fs.readFileSync(
    path.join(ROOT, "components", "ArticleCard.jsx"),
    "utf8"
  );
  const styles = fs.readFileSync(
    path.join(ROOT, "components", "ArticleCard.module.css"),
    "utf8"
  );
  const homepage = fs.readFileSync(
    path.join(ROOT, "components", "LocalizedHomePage.jsx"),
    "utf8"
  );

  assert.match(card, /ArticleCard\.module\.css/);
  assert.match(card, /className=\{styles\.titleLink\}/);
  assert.match(card, /Array\.isArray\(tags\)/);
  assert.match(card, /rel="bookmark"/);
  assert.doesNotMatch(card, /Read more/);
  assert.doesNotMatch(card, /rounded-2xl|border-slate|line-clamp-3/);

  assert.match(styles, /grid-template-columns:\s*144px minmax\(0, 1fr\)/);
  assert.match(styles, /\.withoutImage/);
  assert.match(styles, /@media \(max-width: 560px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);

  assert.match(homepage, /<ul className="eu-home-articles-list">/);
  assert.match(homepage, /<ArticleCard key=\{article\.slug\} article=\{article\} \/>/);
});
