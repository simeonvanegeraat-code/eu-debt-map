const { execFileSync, spawnSync } = require('node:child_process');
const { ARTICLE_PATH, articlePath, checkPublication } = require('../lib/articlePublicationCore.cjs');
const { validateArticlePublication } = require('./validate-article-publication');

async function preflightPublication() {
  const { inventory, translations, redirects } = await validateArticlePublication();
  const git = args => execFileSync('git', args, { encoding: 'utf8' }).trim();
  const dirty = git(['status', '--porcelain', '--untracked-files=normal']);
  if (dirty) throw new Error('Commit or isolate the intended release before deploying; this checkout has uncommitted files.');
  const remoteLine = git(['ls-remote', 'origin', 'refs/heads/main']);
  const remoteSha = remoteLine.split(/\s+/)[0];
  if (!/^[a-f0-9]{40}$/.test(remoteSha)) throw new Error('Could not resolve current origin/main');
  const ancestry = spawnSync('git', ['merge-base', '--is-ancestor', remoteSha, 'HEAD']);
  if (ancestry.status !== 0) throw new Error(`Release does not contain current main (${remoteSha}); fetch and integrate it first.`);
  const remoteFiles = git(['ls-tree', '-r', '--name-only', remoteSha, 'content/articles']).split('\n').filter(Boolean);
  const remotePaths = remoteFiles.filter(file => file.endsWith('.json')).map(file =>
    articlePath(JSON.parse(git(['show', `${remoteSha}:${file}`]))));
  const remoteManifestFile = `${remoteSha}:content/article-publication-manifest.json`;
  const hasRemoteManifest = spawnSync('git', ['cat-file', '-e', remoteManifestFile]).status === 0;
  const remotePublished = hasRemoteManifest ? JSON.parse(git(['show', remoteManifestFile])).articles : [];
  if (!Array.isArray(remotePublished)) throw new Error('Current main has an invalid publication manifest');
  const localPublished = require('../content/article-publication-manifest.json').articles;
  const removedRecords = remotePublished.filter(url => !localPublished.includes(url));
  if (removedRecords.length) throw new Error(`Publication history must be append-only; removed records: ${removedRecords.join(', ')}`);
  const response = await fetch('https://www.eudebtmap.com/sitemap.xml', { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Cannot compare production sitemap: HTTP ${response.status}`);
  const xml = await response.text();
  if (!xml.includes('<urlset')) throw new Error('Production sitemap response is not a URL set');
  const livePaths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]))
    .filter(url => url.origin === 'https://www.eudebtmap.com' && ARTICLE_PATH.test(url.pathname))
    .map(url => url.pathname);
  if (!livePaths.length) throw new Error('Production sitemap contains no article URLs; investigate before release');
  const errors = checkPublication({ published: [...new Set([...inventory.keys(), ...remotePublished, ...remotePaths, ...livePaths])], inventory, translations, redirects });
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(`[publication-preflight] Current main included; ${remotePaths.length} GitHub articles and ${livePaths.length} live articles preserved`);
}

if (require.main === module) {
  preflightPublication().catch(error => {
    console.error(`[publication-preflight] FAILED: ${error.message}`);
    process.exitCode = 1;
  });
}
