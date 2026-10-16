const test = require('node:test');
const assert = require('node:assert/strict');
const { articlePath, checkPublication, checkRenderedMetadata, verificationTarget } = require('../lib/articlePublicationCore.cjs');
const { validateArticlePublication } = require('./validate-article-publication');

test('published articles cannot disappear when translations also disappear', () => {
  const published = ['/fr/articles/energy-warning', '/articles/newer-story'];
  const errors = checkPublication({ published, inventory: new Map([['/articles/newer-story', {}]]), translations: {} });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /\/fr\/articles\/energy-warning/);
});

test('retirement requires one permanent redirect to an existing replacement', () => {
  const base = { published: ['/articles/old-story', '/articles/replacement'], inventory: new Map([['/articles/replacement', {}]]), translations: {} };
  assert.deepEqual(checkPublication({ ...base, redirects: [{ source: '/articles/old-story', destination: '/articles/replacement', permanent: true }] }), []);
  for (const destination of ['/articles/missing', 'https://example.com/']) {
    assert.equal(checkPublication({ ...base, redirects: [{ source: '/articles/old-story', destination, permanent: true }] }).length, 1);
  }
  assert.equal(checkPublication({ ...base, redirects: [{ source: '/articles/old-story', destination: '/articles/replacement', permanent: false }] }).length, 1);
});

test('broken translation targets block publication even when the source still exists', () => {
  const errors = checkPublication({ published: ['/articles/story'], inventory: new Map([['/articles/story', {}]]), translations: { story: { en: 'story', fr: 'histoire' } } });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /Translation story.*\/fr\/articles\/histoire/);
});

test('publication paths preserve locale boundaries and reject unsafe slugs', () => {
  assert.equal(articlePath({ lang: 'en', slug: 'example-story' }), '/articles/example-story');
  assert.equal(articlePath({ lang: 'fr', slug: 'example-story' }), '/fr/articles/example-story');
  assert.throws(() => articlePath({ lang: 'it', slug: 'story' }));
  assert.throws(() => articlePath({ lang: 'fr', slug: '../story' }));
});

test('new articles require an explicit publication record', () => {
  const errors = checkPublication({ published: [], inventory: new Map([['/articles/new-story', {}]]), translations: {} });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /no publication record/);
});

test('the complete release retains every recorded article and translation', async () => {
  await validateArticlePublication();
});

test('rendered publication checks reject foreign canonicals, duplicate canonicals and noindex', () => {
  const url = 'https://www.eudebtmap.com/fr/articles';
  const canonical = `<link rel="canonical" href="${url}"/>`;
  assert.deepEqual(checkRenderedMetadata(canonical, url), []);
  assert.equal(checkRenderedMetadata('<link rel="canonical" href="https://example.com/"/>', url).length, 1);
  assert.equal(checkRenderedMetadata(canonical + canonical, url).length, 1);
  assert.equal(checkRenderedMetadata(canonical + '<meta name="robots" content="noindex, follow"/>', url).length, 1);
  assert.equal(checkRenderedMetadata('', url).length, 1);
});

test('production and localhost verification enforce indexable response headers by default', () => {
  for (const origin of ['https://www.eudebtmap.com', 'http://localhost:3022']) {
    assert.equal(verificationTarget(['--base-url', origin]).protectedPreview, false);
    assert.throws(() => verificationTarget(['--base-url', origin, '--protected-preview']), /restricted/);
  }
});

test('only an explicit Vercel preview check can allow platform noindex headers', () => {
  const origin = 'https://release-example.vercel.app';
  assert.equal(verificationTarget(['--base-url', origin]).protectedPreview, false);
  assert.equal(verificationTarget(['--base-url', origin, '--protected-preview']).protectedPreview, true);
  assert.throws(() => verificationTarget([]), /base-url/);
  assert.throws(() => verificationTarget(['--base-url', 'https://user:secret@example.com']), /credentials/);
});
