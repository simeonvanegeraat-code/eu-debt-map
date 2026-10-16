const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { readArticleInventory, checkPublication } = require('../lib/articlePublicationCore.cjs');

async function validateArticlePublication(root = process.cwd()) {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'content/article-publication-manifest.json'), 'utf8'));
  if (manifest.version !== 1 || !Array.isArray(manifest.articles) || !manifest.articles.length) {
    throw new Error('Published article manifest is missing, empty or unsupported');
  }
  const inventory = readArticleInventory(root);
  const translations = JSON.parse(fs.readFileSync(path.join(root, 'content/article-translations.json'), 'utf8'));
  const config = (await import(pathToFileURL(path.join(root, 'next.config.mjs')).href)).default;
  const redirects = await config.redirects();
  const errors = checkPublication({ published: manifest.articles, inventory, translations, redirects });
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(`[article-publication] ${manifest.articles.length} published URLs preserved; ${inventory.size} articles; translations valid`);
  return { inventory, translations, redirects };
}

if (require.main === module) {
  validateArticlePublication().catch(error => {
    console.error(`[article-publication] FAILED: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { validateArticlePublication };
