const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { RELATED_INDICATORS, METRIC_ROUTES, relatedFiscalArticles, articleFiscalIndicators, fiscalPageModified, countryFiscalDescription, countrySocialMetadata } = require("../lib/fiscal/discovery");
const { fiscalPath } = require("../lib/fiscal/paths");
const { getDiscoveryCopy } = require("../components/fiscal/discovery-copy");
const { EU27 } = require("../lib/fiscal/indicators");
const { countryName } = require("../lib/countries");
const translations = require("../content/article-translations.json");
const ROOT = path.resolve(__dirname, "..");
const articleFiles = fs.readdirSync(path.join(ROOT, "content/articles"), { recursive: true }).filter(file => file.endsWith(".json"));
const articles = articleFiles.map(file => JSON.parse(fs.readFileSync(path.join(ROOT, "content/articles", file), "utf8")));

test("fiscal recommendations and country metrics target real localized comparison routes", () => {
  assert.equal(Object.keys(METRIC_ROUTES).length, 7);
  for (const lang of ["en", "nl", "de", "fr"]) {
    const copy = getDiscoveryCopy(lang);
    for (const [indicator, targets] of Object.entries(RELATED_INDICATORS)) {
      assert.equal(new Set(targets).size, targets.length);
      assert.ok(!targets.includes(indicator));
      for (const target of targets) {
        assert.ok(fs.existsSync(path.join(ROOT, "app", fiscalPath(`/${target}`, lang), "page.jsx")));
        assert.equal(copy.routes[target].length, 2);
        assert.ok(copy.routes[target].every(text => text.trim().length > 0));
      }
    }
    for (const route of Object.values(METRIC_ROUTES)) assert.ok(fs.existsSync(path.join(ROOT, "app", fiscalPath(route, lang), "page.jsx")));
  }
});

test("curated analyses have reciprocal links, actual translations and explicit period context", () => {
  for (const lang of ["en", "nl", "de", "fr"]) {
    for (const indicator of Object.keys(RELATED_INDICATORS)) {
      const related = relatedFiscalArticles(indicator, lang, articles);
      assert.equal(related.length, 1);
      const article = articles.find(a => fiscalPath(`/articles/${a.slug}`, a.lang) === related[0].href);
      assert.equal(article.lang, lang);
      assert.equal(related[0].title, article.title);
      assert.ok(getDiscoveryCopy(lang)[related[0].note].includes("2026"));
      assert.ok(articleFiscalIndicators(article.slug, lang));
      assert.deepEqual(relatedFiscalArticles(indicator, lang, articles.filter(a => a.lang !== lang)), []);
    }
    const capita = articleFiscalIndicators(translations["eu-debt-per-capita-2026"][lang], lang);
    assert.deepEqual(capita.indicators, ["debt-per-capita", "debt-to-gdp"]);
    assert.equal(capita.note, "capitaArticle");
    assert.equal(articleFiscalIndicators("unrelated-article", lang), null);
  }
  assert.equal(articleFiscalIndicators(translations["eu-debt-per-capita-2026"].nl, "fr"), null);
});

test("country descriptions preserve real periods, distinguish estimates and never turn null into zero", () => {
  for (const lang of ["en", "nl", "de", "fr"]) {
    const descriptions = new Set();
    for (const code of EU27) {
      const name = countryName(code, lang), description = countryFiscalDescription({ name, lang, ratio: 117.6, period: "2026-Q1" });
      assert.ok(description.includes(name) && description.includes("2026-Q1") && description.includes("Eurostat"));
      descriptions.add(description);
    }
    assert.equal(descriptions.size, 27);
    for (const ratio of [null, undefined, NaN, "", "117.6"]) assert.ok(!countryFiscalDescription({ name: "Example", lang, ratio, period: "2026-Q1" }).includes("%"));
    assert.ok(countryFiscalDescription({ name: "Example", lang, ratio: 0, period: "2026-Q1" }).includes("%"));
    assert.ok(!countryFiscalDescription({ name: "Example", lang, ratio: 10, period: "unknown" }).includes("%"));
  }
});

test("localized social previews identify the actual country instead of the English homepage", () => {
  for (const lang of ["nl", "fr"]) for (const code of EU27) {
    const name = countryName(code, lang), title = `${name} | EU Debt Map`, description = countryFiscalDescription({ name, lang, ratio: 50, period: "2026-Q1" });
    const url = `https://www.eudebtmap.com/${lang}/country/${code.toLowerCase()}`;
    const result = countrySocialMetadata({ title, description, url, lang });
    assert.equal(result.openGraph.url, url);
    assert.equal(result.openGraph.title, title);
    assert.equal(result.twitter.description, description);
    assert.equal(result.twitter.card, "summary_large_image");
    assert.ok(fs.existsSync(path.join(ROOT, "public/og/eu-debt-map.jpg")));
  }
});

test("page review dates advance without masking later source updates", () => {
  assert.equal(fiscalPageModified("2026-09-01T12:00:00Z"), "2026-09-08T00:00:00.000Z");
  assert.equal(fiscalPageModified("2026-10-22T12:00:00Z"), "2026-10-22T12:00:00.000Z");
});
