const assert = require('node:assert/strict');
const { checkRenderedMetadata, verificationTarget } = require('../lib/articlePublicationCore.cjs');
const { getDebtDeficitCopy } = require('../components/debt-guide/debt-deficit-copy');

const SITE = 'https://www.eudebtmap.com';
const LOCALES = ['en', 'nl', 'de', 'fr'];
const localeBase = lang => lang === 'en' ? '' : `/${lang}`;

async function responseFor(base, path) {
  return fetch(new URL(path, base), { redirect: 'manual', signal: AbortSignal.timeout(30000) });
}

async function verify() {
  const { base, protectedPreview } = verificationTarget(process.argv.slice(2));
  const redirects = LOCALES.map(lang => [
    `${localeBase(lang)}/debt-vs-deficit`, `${localeBase(lang)}/debt#debt-vs-deficit`,
  ]).concat([
    ['/de/de/debt-vs-deficit', '/de/debt#debt-vs-deficit'],
    ['/fr/fr/debt-vs-deficit', '/fr/debt#debt-vs-deficit'],
  ]);

  for (const [source, destination] of redirects) {
    for (const query of ['', '?utm_source=consolidation-check']) {
      const response = await responseFor(base, source + query);
      assert.equal(response.status, 308, source);
      const location = new URL(response.headers.get('location'), base);
      const expected = new URL(destination, base);
      assert.equal(location.origin, expected.origin, source);
      assert.equal(location.pathname, expected.pathname, source);
      assert.equal(location.hash, expected.hash, source);
      assert.equal(location.search, query, source);
      await response.body?.cancel();
    }
  }

  const sitemapResponse = await responseFor(base, '/sitemap.xml');
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert(!sitemap.includes('/debt-vs-deficit'), 'Retired paths must not remain in sitemap URLs or alternates');

  for (const lang of LOCALES) {
    const path = `${localeBase(lang)}/debt`;
    const response = await responseFor(base, path);
    assert.equal(response.status, 200, path);
    if (!protectedPreview) assert(!/noindex/i.test(response.headers.get('x-robots-tag') || ''), path);
    const html = await response.text();
    assert.deepEqual(checkRenderedMetadata(html, SITE + path), [], path);
    assert(html.includes('id="debt-vs-deficit"'), path);
    assert(html.includes(getDebtDeficitCopy(lang).title), path);
    for (const language of LOCALES) {
      const href = `${SITE}${localeBase(language)}/debt`;
      assert(new RegExp(`hreflang="${language}" href="${href}"`, 'i').test(html), `${path}: alternate ${language}`);
    }
    const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(match => JSON.parse(match[1]));
    const faq = schemas.find(schema => schema['@type'] === 'FAQPage');
    const [question, answer] = getDebtDeficitCopy(lang).ratioFAQ;
    assert(faq?.mainEntity.some(item => item.name === question && item.acceptedAnswer?.text === answer), `${path}: visible FAQ and schema must agree`);
    assert(sitemap.includes(`<loc>${SITE + path}</loc>`), path);
    assert(!/href="(?:https:\/\/www\.eudebtmap\.com)?\/(?:nl\/|de\/|fr\/)?debt-vs-deficit(?:["?#])/.test(html), path);

    const balance = await responseFor(base, `${localeBase(lang)}/deficit`);
    assert.equal(balance.status, 200);
    assert((await balance.text()).includes(`href="${path}#debt-vs-deficit"`), `${lang}: balance link`);
  }
  console.log('[debt-guide-consolidation] 6 direct permanent redirects, query preservation, 4 localized guides, anchor, canonicals, alternates, FAQ schema, balance links and sitemap passed');
}

verify().catch(error => {
  console.error(`[debt-guide-consolidation] FAILED: ${error.message}`);
  process.exitCode = 1;
});
