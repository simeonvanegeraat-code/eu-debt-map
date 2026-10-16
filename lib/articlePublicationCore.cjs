const fs = require('node:fs');
const path = require('node:path');
const { listArticleFiles } = require('./articleQualityCore.cjs');

const LANGUAGES = new Set(['en', 'nl', 'de', 'fr']);
const ARTICLE_PATH = /^\/(?:(nl|de|fr)\/)?articles\/([a-z0-9]+(?:-[a-z0-9]+)*)$/;

function articlePath(article) {
  if (!LANGUAGES.has(article.lang) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) {
    throw new Error('Article must have a supported language and a valid slug');
  }
  return `${article.lang === 'en' ? '' : `/${article.lang}`}/articles/${article.slug}`;
}

function readArticleInventory(root) {
  const inventory = new Map();
  for (const file of listArticleFiles(root)) {
    const article = JSON.parse(fs.readFileSync(file, 'utf8'));
    const url = articlePath(article);
    if (inventory.has(url)) throw new Error(`Duplicate article URL: ${url}`);
    inventory.set(url, { file: path.relative(root, file), article });
  }
  return inventory;
}

function checkPublication({ published, inventory, translations, redirects = [] }) {
  const errors = [];
  const seen = new Set();
  const permanent = new Map(redirects.filter(redirect => redirect.permanent === true)
    .map(redirect => [redirect.source, redirect.destination]));
  for (const url of published) {
    if (!ARTICLE_PATH.test(url)) errors.push(`Invalid published article URL: ${url}`);
    if (seen.has(url)) errors.push(`Duplicate published article URL: ${url}`);
    seen.add(url);
    if (inventory.has(url)) continue;
    const replacement = permanent.get(url);
    if (!replacement || !inventory.has(replacement)) {
      errors.push(`Published article is missing without a direct permanent replacement: ${url}`);
    }
  }
  for (const url of inventory.keys()) {
    if (!seen.has(url)) errors.push(`Article has no publication record; add its URL before release: ${url}`);
  }
  for (const [group, entries] of Object.entries(translations)) {
    for (const [lang, slug] of Object.entries(entries)) {
      try {
        const url = articlePath({ lang, slug });
        if (!inventory.has(url)) errors.push(`Translation ${group} points to a missing article: ${url}`);
      } catch (error) {
        errors.push(`Invalid translation ${group}: ${error.message}`);
      }
    }
  }
  return errors;
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g)]
    .map(match => [match[1].toLowerCase(), match[3]]));
}

function checkRenderedMetadata(html, expectedUrl) {
  const links = (html.match(/<link\b[^>]*>/gi) || []).map(attributes);
  const canonical = links.filter(link => String(link.rel).toLowerCase().split(/\s+/).includes('canonical'));
  const errors = [];
  if (canonical.length !== 1 || canonical[0].href !== expectedUrl) {
    errors.push(`Expected exactly one self-referencing canonical for ${expectedUrl}`);
  }
  const meta = (html.match(/<meta\b[^>]*>/gi) || []).map(attributes);
  if (meta.some(tag => /^(robots|googlebot)$/i.test(tag.name) && /\b(noindex|none)\b/i.test(tag.content))) {
    errors.push(`Page prevents indexing: ${expectedUrl}`);
  }
  return errors;
}

function verificationTarget(argv) {
  const index = argv.indexOf('--base-url');
  if (index < 0 || !argv[index + 1]) throw new Error('Expected --base-url <origin>');
  const base = new URL(argv[index + 1]);
  if (base.username || base.password || !['http:', 'https:'].includes(base.protocol)) {
    throw new Error('Expected an HTTP(S) base URL without credentials');
  }
  const protectedPreview = argv.includes('--protected-preview');
  if (protectedPreview && !base.hostname.endsWith('.vercel.app')) {
    throw new Error('Preview-only header handling is restricted to Vercel deployment URLs, never the production domain');
  }
  return { base, protectedPreview };
}

module.exports = { ARTICLE_PATH, articlePath, readArticleInventory, checkPublication, checkRenderedMetadata, verificationTarget };
