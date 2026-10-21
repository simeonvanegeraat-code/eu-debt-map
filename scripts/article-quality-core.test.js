const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const {
  ARTICLE_STANDARD,
  inspectArticle,
  inspectArticleCollection,
  readImageDimensions,
} = require("../lib/articleQualityCore.cjs");
const {
  buildArticleDraft,
  createArticleFile,
} = require("./new-article.js");

const ROOT = path.resolve(__dirname, "..");
const GERMAN_HERO = path.join(
  ROOT,
  "public",
  "images",
  "articles",
  "wer-haelt-deutsche-staatsschulden-2026-editorial-v2.jpg"
);

function completeArticle(overrides = {}) {
  return {
    contentStandard: ARTICLE_STANDARD,
    slug: "verified-analysis",
    title: "Verified analysis",
    seoTitle: "Verified analysis",
    summary: "A factual summary based on authoritative public data.",
    primaryTopic: "EU government debt",
    articleType: "analysis",
    tags: ["EU debt"],
    relatedCountries: [],
    lang: "en",
    datePublished: "2026-08-08T10:00:00.000Z",
    dateModified: "2026-08-08T10:00:00.000Z",
    dateReviewed: "2026-08-08T10:00:00.000Z",
    author: {
      name: "EU Debt Map Research",
      url: "https://www.eudebtmap.com/about",
    },
    reviewedBy: {
      name: "EU Debt Map Research",
      url: "https://www.eudebtmap.com/methodology",
    },
    readingMinutes: 7,
    image: "/images/articles/wer-haelt-deutsche-staatsschulden-2026-editorial-v2.jpg",
    imageWidth: 1672,
    imageHeight: 941,
    imageAlt: "Editorial illustration of public debt holders",
    imageCredit: "Original editorial image created for EU Debt Map",
    sourceNote: "Based on an official statistical release.",
    relatedLinks: [
      { label: "Methodology", url: "https://www.eudebtmap.com/methodology" },
    ],
    sources: [
      {
        name: "Eurostat",
        url: "https://ec.europa.eu/eurostat/",
        accessed: "2026-08-08",
      },
    ],
    body: "<p>Original analysis based on the cited source.</p>",
    ...overrides,
  };
}

test("quality checker reads the real editorial image dimensions", () => {
  assert.deepEqual(readImageDimensions(GERMAN_HERO), {
    width: 1672,
    height: 941,
  });
});

test("the modern standard accepts mechanically complete article metadata", () => {
  const result = inspectArticle(completeArticle(), {
    root: ROOT,
    file: "synthetic-article.json",
  });

  assert.equal(result.enforced, true);
  assert.deepEqual(result.errors, []);
  assert.ok(result.warnings.some((warning) => warning.code === "short-article"));
});

test("the modern standard rejects image dimensions that do not match the file", () => {
  const result = inspectArticle(completeArticle({ imageWidth: 1200, imageHeight: 630 }), {
    root: ROOT,
    file: "synthetic-article.json",
  });

  assert.ok(
    result.errors.some((error) => error.code === "incorrect-image-dimensions")
  );
});

test("brief news does not receive a generic 600-word warning", () => {
  for (const wordCount of [80, 350, 599, 600]) {
    const result = inspectArticle(completeArticle({
      articleType: "news",
      body: `<p>${Array(wordCount).fill("word").join(" ")}</p>`,
    }), { root: ROOT });

    assert.deepEqual(result.errors, []);
    assert.equal(result.warnings.some((item) => item.code === "short-article"), false);
  }
});

test("other genres retain a non-blocking depth-review prompt, not a minimum length", () => {
  for (const articleType of ["analysis", "explainer", "opinion", "news-analysis", "unknown"]) {
    const result = inspectArticle(completeArticle({ articleType }), { root: ROOT });
    assert.deepEqual(result.errors, []);
    const warning = result.warnings.find((item) => item.code === "short-article");
    assert.equal(warning?.level, "warning");
    assert.match(warning.message, /do not add filler/);

    const longer = inspectArticle(completeArticle({
      articleType,
      body: `<p>${Array(600).fill("word").join(" ")}</p>`,
    }), { root: ROOT });
    assert.equal(longer.warnings.some((item) => item.code === "short-article"), false);
  }
});

test("brief news retains the source, body, image and advertising safeguards", () => {
  const result = inspectArticle(completeArticle({
    articleType: "news",
    body: "<!-- MID_ARTICLE_AD --><!-- MID_ARTICLE_AD -->",
    sources: [],
    imageWidth: 1200,
    imageHeight: 630,
  }), { root: ROOT });
  for (const code of ["missing-sources", "incorrect-image-dimensions", "too-many-ad-markers"]) {
    assert.ok(result.errors.some((item) => item.code === code));
  }
  const empty = inspectArticle(completeArticle({ articleType: "news", body: "" }), { root: ROOT });
  assert.ok(empty.errors.some((item) => item.code === "missing-body"));
});

test("new article generator creates a complete localized draft without overwriting", () => {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "eudebtmap-article-"));
  try {
    const now = new Date("2026-08-08T10:00:00.000Z");
    const { article, file } = createArticleFile({
      root: temporaryRoot,
      lang: "nl",
      year: "2026",
      slug: "voorbeeld-analyse",
      title: "Voorbeeldanalyse",
      now,
    });

    assert.equal(article.contentStandard, ARTICLE_STANDARD);
    assert.equal(article.author.url, "https://www.eudebtmap.com/nl/about");
    assert.equal(article.relatedLinks[0].url, "https://www.eudebtmap.com/nl");
    assert.equal(article.image, "/images/articles/voorbeeld-analyse.jpg");
    assert.equal(article.imageWidth, null);
    assert.equal(article.datePublished, "2026-08-08T10:00:00.000Z");
    assert.equal(fs.existsSync(file), true);
    assert.throws(
      () =>
        createArticleFile({
          root: temporaryRoot,
          lang: "nl",
          year: "2026",
          slug: "voorbeeld-analyse",
          title: "Duplicate",
          now,
        }),
      /already exists/
    );
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
});

test("new article arguments reject unsupported languages and unsafe slugs", () => {
  assert.throws(
    () => buildArticleDraft({ lang: "es", year: "2026", slug: "article" }),
    /Unsupported language/
  );
  assert.throws(
    () => buildArticleDraft({ lang: "en", year: "2026", slug: "Unsafe Slug" }),
    /Invalid slug/
  );
});

test("malformed legacy JSON is reported without blocking modern strict files", () => {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "eudebtmap-quality-"));
  const articleDirectory = path.join(
    temporaryRoot,
    "content",
    "articles",
    "en",
    "2026"
  );
  fs.mkdirSync(articleDirectory, { recursive: true });

  try {
    fs.writeFileSync(path.join(articleDirectory, "legacy.json"), "{broken", "utf8");
    fs.writeFileSync(
      path.join(articleDirectory, "strict.json"),
      `{"contentStandard":"${ARTICLE_STANDARD}",`,
      "utf8"
    );

    const results = inspectArticleCollection(temporaryRoot);
    const legacy = results.find((result) => result.file.endsWith("legacy.json"));
    const strict = results.find((result) => result.file.endsWith("strict.json"));

    assert.equal(legacy.enforced, false);
    assert.equal(legacy.errors.length, 0);
    assert.equal(legacy.warnings[0].code, "invalid-json");
    assert.equal(strict.enforced, true);
    assert.equal(strict.errors[0].code, "invalid-json");
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
});
