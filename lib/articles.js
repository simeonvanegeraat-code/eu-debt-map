/**
 * File-based articles loader for Next.js.
 * Reads JSON files in /content/articles/{lang}/{YYYY}/{slug}.json
 * and exports { listArticles, getArticle }.
 */

import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");

// Recursively read all JSON files
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
        if (obj && obj.slug && obj.title && obj.date) out.push(obj);
      } catch (e) {
        console.warn(`[articles] Skipped invalid JSON: ${p}`, e?.message || e);
      }
    }
  }
  return out;
}

// Cache (met veilige dev-hot-reload via globalThis)
const GLOBAL_KEY = "__ARTICLES_CACHE__";
let CACHE =
  process.env.NODE_ENV === "development"
    ? globalThis[GLOBAL_KEY] || null
    : null;

function ensureCache() {
  if (!CACHE) {
    CACHE = readAllJsonFiles(CONTENT_DIR);
    if (process.env.NODE_ENV === "development") {
      globalThis[GLOBAL_KEY] = CACHE; // bewaar tussen HMR-renders
    }
  }
  return CACHE;
}

export function listArticles({ lang } = {}) {
  const list = ensureCache();
  const filtered = lang ? list.filter((a) => a.lang === lang) : list;
  return [...filtered].sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
}

export function getArticle(slug) {
  const list = ensureCache();
  return list.find((a) => a.slug === slug) || null;
}
