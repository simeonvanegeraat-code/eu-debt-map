\
/**
 * File-based articles loader.
 * Reads JSON files in /content/articles/{lang}/{YYYY}/{slug}.json
 * and returns { listArticles, getArticle } helpers.
 */
import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");
let CACHE = null;

function readAllJsonFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...readAllJsonFiles(p));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      try {
        const raw = fs.readFileSync(p, "utf8");
        const obj = JSON.parse(raw);
        // Basic sanity
        if (obj && obj.slug && obj.title && obj.date) out.push(obj);
      } catch {}
    }
  }
  return out;
}

function ensureCache() {
  if (!CACHE) CACHE = readAllJsonFiles(CONTENT_DIR);
  return CACHE;
}

export function listArticles({ lang } = {}) {
  const list = ensureCache();
  const filtered = lang ? list.filter(a => a.lang === lang) : list;
  return [...filtered].sort((a,b) => (a.date < b.date ? 1 : -1));
}

export function getArticle(slug) {
  const list = ensureCache();
  return list.find(a => a.slug === slug) || null;
}

// Optional: dev hot-reload (invalidate cache on every call in dev)
if (process.env.NODE_ENV === "development") {
  CACHE = null;
  // on ESM in Next, simplest is to re-read each time:
  export const __DEV__ = true;
}
