const assert = require('node:assert/strict');
const { verificationTarget, checkRenderedMetadata } = require('../lib/articlePublicationCore.cjs');
const { EU27 } = require('../lib/fiscal/indicators');
const { SECTION_IDS } = require('../components/debt-guide-preview/guide-copy');
const { getGuideSchemas } = require('../components/debt-guide-preview/guide-schema');

async function verify() {
  const { base, protectedPreview } = verificationTarget(process.argv.slice(2));
  const publicRoutes = process.argv.includes('--public');
  for (const lang of ['en', 'nl', 'de', 'fr']) {
    const prefix = lang === 'en' ? '' : `/${lang}`;
    const path = `${prefix}${publicRoutes ? '' : '/preview'}/debt`;
    const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, path);
    const html = await response.text();
    if (publicRoutes) {
      if (!protectedPreview) assert(!/noindex/i.test(response.headers.get('x-robots-tag') || ''), `${path}: public response is indexable`);
      assert.deepEqual(checkRenderedMetadata(html, `https://www.eudebtmap.com${path}`), [], `${path}: public metadata`);
      const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(match => JSON.parse(match[1]));
      for (const expected of getGuideSchemas(lang)) assert.deepEqual(schemas.find(schema => schema['@type'] === expected['@type']), expected, `${path}: ${expected['@type']}`);
      for (const language of ['en', 'nl', 'de', 'fr']) {
        const alternate = `https://www.eudebtmap.com${language === 'en' ? '' : `/${language}`}/debt`;
        assert(new RegExp(`hreflang="${language}" href="${alternate}"`, 'i').test(html), `${path}: alternate ${language}`);
      }
    } else {
      assert.match(html, /<meta name="robots" content="[^"]*noindex/, `${path}: noindex`);
      assert.doesNotMatch(html, /<link rel="canonical"/, `${path}: no inherited production canonical`);
    }
    assert.match(html, new RegExp(`<article[^>]*lang="${lang}"`), `${path}: content language`);
    assert.equal((html.match(/<main\b/g) || []).length, 1, `${path}: one main landmark`);
    for (const id of ['government-debt-in-one-sentence', ...SECTION_IDS, 'guide-sources']) {
      assert.equal((html.match(new RegExp(`id="${id}"`, 'g')) || []).length, 1, `${path}: unique ${id}`);
    }
    const select = html.match(/<select[^>]*id="guide-country"[\s\S]*?<\/select>/)?.[0];
    assert(select, `${path}: country selector`);
    assert.match(select, /<option value="" selected="">/, `${path}: no country selected by language`);
    const codes = [...select.matchAll(/<option value="([a-z]{2})"/g)].map(match => match[1].toUpperCase()).sort();
    assert.deepEqual(codes, [...EU27].sort(), `${path}: all 27 countries`);
    assert.match(html, new RegExp(`href="${prefix}/eu-debt"`), `${path}: localized comparison`);
    assert.match(html, /id="guide-opening"[^>]*value="800"/, `${path}: initial debt`);
    assert.match(html, /id="guide-deficit"[^>]*value="30"/, `${path}: initial deficit`);
  }
  console.log(`[debt-guide] 4 localized ${publicRoutes ? 'public guides: metadata, language alternates and schemas' : 'previews: noindex and canonicals'}; landmarks, anchors, neutral EU27 selector, comparison links and initial model passed`);
}
verify().catch(error => { console.error(error); process.exitCode = 1; });
