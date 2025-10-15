import "server-only";

/**
 * File-based articles loader for Next.js (App Router)
 * Structure: /content/articles/{lang}/{YYYY}/{slug}.json
 * - lang in: en | nl | de | fr
 * - YYYY: four-digit year
 */

import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");
const LANGS = new Set(["en", "nl", "de", "fr"]);
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };

function isYearFolder(name) { return /^\d{4}$/.test(name); }
function toUrl({ lang = "en", slug }) {
  const prefix = ROUTE_PREFIX[lang] ?? "";
  return `${prefix}/articles/${slug}`;
}
function safeParseJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`[articles] Skipped invalid JSON: ${filePath}`, e?.message || e);
    return null;
  }
}
function enrichFromPath(obj, filePath) {
  const rel = path.relative(CONTENT_DIR, filePath); // {lang}/{YYYY}/{slug}.json
  const [pLang, pYear, pFile] = rel.split(path.sep);
  const slugFromFile = pFile?.replace(/\.json$/i, "");
  const lang = obj?.lang && LANGS.has(obj.lang) ? obj.lang : (LANGS.has(pLang) ? pLang : "en");
  const year = obj?.year ?? (isYearFolder(pYear) ? Number(pYear) : undefined);
  const slug = obj?.slug || slugFromFile;
  return { ...obj, lang, year, slug, __file: rel, url: slug ? toUrl({ lang, slug }) : undefined };
}
function validateArticle(a) {
  const problems = [];
  if (!a.slug) problems.push("slug missing");
  if (!a.title) problems.push("title missing");
  if (!a.date) problems.push("date missing");
  if (!a.lang || !LANGS.has(a.lang)) problems.push("lang missing/invalid");
  return problems;
}
function readAllJsonFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    const entries = fs.readdirSync(cur, { withFileTypes: true });
    for (const entry of entries) {
      const p = path.join(cur, entry.name);
      if (entry.isDirectory()) stack.push(p);
      else if (entry.isFile() && entry.name.endsWith(".json")) {
        const parsed = safeParseJson(p);
        if (!parsed) continue;
        const enriched = enrichFromPath(parsed, p);
        const issues = validateArticle(enriched);
        if (issues.length) { console.warn(`[articles] Skipped ${enriched.__file} → ${issues.join(", ")}`); continue; }
        out.push(enriched);
      }
    }
  }
  return out;
}

// cache (dev-friendly)
const GLOBAL_KEY = "__ARTICLES_CACHE__";
let CACHE = process.env.NODE_ENV === "development" ? globalThis[GLOBAL_KEY] || null : null;
function ensureCache() {
  if (!CACHE) {
    CACHE = readAllJsonFiles(CONTENT_DIR);
    if (process.env.NODE_ENV === "development") globalThis[GLOBAL_KEY] = CACHE;
  }
  return CACHE;
}

/** listArticles({ lang, year, tag, limit }) */
export function listArticles({ lang, year, tag, limit } = {}) {
  const list = ensureCache();
  let filtered = list;
  if (lang) filtered = filtered.filter(a => a.lang === lang);
  if (year) filtered = filtered.filter(a => a.year === Number(year));
  if (tag)  filtered = filtered.filter(a => Array.isArray(a.tags) && a.tags.includes(tag));
  filtered = [...filtered].sort((a, b) => (a.date === b.date ? a.title.localeCompare(b.title) : (a.date < b.date ? 1 : -1)));
  return limit && Number.isFinite(limit) ? filtered.slice(0, limit) : filtered;
}

/** getArticle({ slug, lang? }) */
export function getArticle({ slug, lang } = {}) {
  const list = ensureCache();
  if (!slug) return null;
  return lang ? (list.find(a => a.slug === slug && a.lang === lang) || null)
              : (list.find(a => a.slug === slug) || null);
}

/** getTranslations(slug) */
export function getTranslations(slug) {
  const list = ensureCache();
  return list.filter(a => a.slug === slug);
}
