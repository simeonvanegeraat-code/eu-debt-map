const { validateArticlePublication } = require('./validate-article-publication');
const { checkRenderedMetadata } = require('../lib/articlePublicationCore.cjs');

const SITE = 'https://www.eudebtmap.com';
const CANONICAL_RECHECKS = ['/fr/articles', '/nl/articles', '/de/country/lt'];

async function verifyPublication() {
  const index = process.argv.indexOf('--base-url');
  if (index < 0 || !process.argv[index + 1]) throw new Error('Usage: npm run verify:publication -- --base-url http://localhost:3022');
  const base = new URL(process.argv[index + 1]);
  if (base.username || base.password || !['http:', 'https:'].includes(base.protocol)) throw new Error('Expected an HTTP(S) base URL without credentials');
  const { inventory, translations, redirects } = await validateArticlePublication();
  const paths = [...inventory.keys(), ...CANONICAL_RECHECKS];
  const errors = [];
  let cursor = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (cursor < paths.length) {
      const pagePath = paths[cursor++];
      try {
        const response = await fetch(new URL(pagePath, base), { redirect: 'manual', signal: AbortSignal.timeout(30000) });
        if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
        if (/\b(noindex|none)\b/i.test(response.headers.get('x-robots-tag') || '')) throw new Error('X-Robots-Tag prevents indexing');
        const html = await response.text();
        errors.push(...checkRenderedMetadata(html, SITE + pagePath));
        const entry = inventory.get(pagePath);
        if (entry) {
          const article = entry.article;
          const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
            .map(match => JSON.parse(match[1]));
          const schema = schemas.find(item => ['Article', 'NewsArticle'].includes(item['@type']) && item.url === SITE + pagePath);
          if (!schema || schema.inLanguage !== article.lang) throw new Error('Localized Article schema is missing or incorrect');
          const group = Object.values(translations).find(entries => entries[article.lang] === article.slug);
          for (const [lang, slug] of Object.entries(group || {})) {
            const expected = `${SITE}${lang === 'en' ? '' : `/${lang}`}/articles/${slug}`;
            if (!html.includes(`hrefLang="${lang}" href="${expected}"`) && !html.includes(`hreflang="${lang}" href="${expected}"`)) {
              throw new Error(`Missing translation alternate: ${lang}`);
            }
          }
        }
      } catch (error) {
        errors.push(`${pagePath}: ${error.message}`);
      }
    }
  }));
  const images = [...new Set([...inventory.values()].map(entry => entry.article.image))];
  let imageCursor = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (imageCursor < images.length) {
      const imagePath = images[imageCursor++];
      try {
        const url = new URL(imagePath, SITE);
        if (url.origin !== SITE) throw new Error('Article image is not hosted on the site');
        const response = await fetch(new URL(url.pathname, base), { redirect: 'manual', signal: AbortSignal.timeout(30000) });
        if (response.status !== 200 || !response.headers.get('content-type')?.startsWith('image/')) {
          throw new Error(`Expected an image; HTTP ${response.status}, ${response.headers.get('content-type')}`);
        }
        await response.body?.cancel();
      } catch (error) {
        errors.push(`${imagePath}: ${error.message}`);
      }
    }
  }));
  const sitemapResponse = await fetch(new URL('/sitemap.xml', base), { redirect: 'manual', signal: AbortSignal.timeout(30000) });
  if (sitemapResponse.status !== 200) throw new Error(`Sitemap returned HTTP ${sitemapResponse.status}`);
  const sitemap = await sitemapResponse.text();
  const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]));
  for (const pagePath of paths) {
    if (!sitemapUrls.has(SITE + pagePath)) errors.push(`Sitemap omits ${pagePath}`);
  }
  const missingResponse = await fetch(new URL('/fr/articles/unpublished-publication-verification', base), { redirect: 'manual' });
  if (missingResponse.status !== 404) errors.push('An unknown article URL no longer returns HTTP 404');
  await missingResponse.body?.cancel();
  for (const redirect of redirects.filter(item => item.permanent && /\/articles\//.test(item.source))) {
    const response = await fetch(new URL(redirect.source, base), { redirect: 'manual', signal: AbortSignal.timeout(30000) });
    const target = response.headers.get('location');
    if (![301, 308].includes(response.status) || !target || new URL(target, base).pathname !== redirect.destination) {
      errors.push(`Permanent redirect changed: ${redirect.source}`);
    }
    await response.body?.cancel();
  }
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(`[publication-verify] ${inventory.size} article pages, ${images.length} images and 3 canonical checks passed; sitemap, translations, schema, redirects and 404 behavior verified`);
}

verifyPublication().catch(error => {
  console.error(`[publication-verify] FAILED: ${error.message}`);
  process.exitCode = 1;
});
