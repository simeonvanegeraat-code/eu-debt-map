const test = require('node:test');
const assert = require('node:assert/strict');
const { debtGuideSeries } = require('../lib/debt-guide-model');
const { toolNavigationFor } = require('../lib/tool-navigation');
const { getGuideSchemas } = require('../components/debt-guide-preview/guide-schema');
const { getGuideCopy } = require('../components/debt-guide-preview/guide-copy');
const { getDebtDeficitCopy } = require('../components/debt-guide/debt-deficit-copy');

test('illustrative debt accumulates ten deficits and includes the opening year', () => {
  const series = debtGuideSeries(800, 30);
  assert.equal(series.length, 11);
  assert.equal(series[0], 800);
  assert.equal(series[10], 1100);
  assert.equal(series[10] - series[0], 300);
});

test('zero deficits leave debt unchanged at both slider boundaries', () => {
  for (const opening of [200, 2000]) assert.deepEqual(debtGuideSeries(opening, 0), Array(11).fill(opening));
  assert.equal(debtGuideSeries(2000, 150).at(-1), 3500);
  assert.deepEqual(debtGuideSeries(800, 30, 0), [800]);
});

test('invalid amounts and fractional periods cannot silently create misleading examples', () => {
  for (const args of [[NaN, 30], [800, Infinity], [-1, 30], [800, -30], [800, 30, 1.5], [800, 30, -1]]) {
    assert.throws(() => debtGuideSeries(...args), RangeError);
  }
});

test('guide previews use the same topic navigation and localized links as public guides', () => {
  for (const lang of ['en', 'nl', 'de', 'fr']) {
    const prefix = lang === 'en' ? '' : `/${lang}`;
    assert.deepEqual(toolNavigationFor(`${prefix}/preview/debt`), toolNavigationFor(`${prefix}/debt`));
  }
});

test('published guide FAQ schema exactly matches the visible localized answers', () => {
  for (const lang of ['en', 'nl', 'de', 'fr']) {
    const schemas = getGuideSchemas(lang);
    const questions = schemas.find(schema => schema['@type'] === 'FAQPage').mainEntity;
    assert.deepEqual(questions.map(item => [item.name, item.acceptedAnswer.text]), [...getGuideCopy(lang).faqs, getDebtDeficitCopy(lang).ratioFAQ]);
    assert.equal(new Set(questions.map(item => item.name)).size, questions.length);
  }
});

test('published guide schema preserves each language URL, publisher and real logo', () => {
  for (const lang of ['en', 'nl', 'de', 'fr']) {
    const prefix = lang === 'en' ? '' : `/${lang}`;
    const url = `https://www.eudebtmap.com${prefix}/debt`;
    const schemas = getGuideSchemas(lang);
    const article = schemas.find(schema => schema['@type'] === 'Article');
    const webPage = schemas.find(schema => schema['@type'] === 'WebPage');
    const breadcrumbs = schemas.find(schema => schema['@type'] === 'BreadcrumbList');
    assert.equal(article.mainEntityOfPage, url);
    assert.equal(webPage.url, url);
    assert.equal(breadcrumbs.itemListElement.at(-1).item, url);
    assert.equal(article.inLanguage, lang);
    assert.equal(article.headline, getGuideCopy(lang).title);
    assert.equal(article.publisher.logo.url, 'https://www.eudebtmap.com/eu_favicon_512.png');
  }
});
