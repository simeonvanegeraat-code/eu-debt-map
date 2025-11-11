import "server-only";

/**
 * File-based articles loader for Next.js (App Router)
 * Structure: /content/articles/{lang}/{YYYY}/{slug}.json
 * - lang in: en | nl | de | fr
 * - YYYY: four-digit year
 *
 * Supports BOTH legacy and new article templates:
 * - Legacy: { date, excerpt, ... }
 * - New: { datePublished, dateModified, summary, ... }
 */

import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");
const LANGS = new Set(["en", "nl", "de", "fr"]);
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };

function isYearFolder(name) {
  return /^\d{4}$/.test(name);
}

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

/**
 * Enrich basic metadata from the file path.
 */
function enrichFromPath(obj, filePath) {
  // rel: {lang}/{YYYY}/{slug}.json
  const rel = path.relative(CONTENT_DIR, filePath);
  const [pLang, pYear, pFile] = rel.split(path.sep);
  const slugFromFile = pFile?.replace(/\.json$/i, "");

  const lang =
    obj?.lang && LANGS.has(obj.lang)
      ? obj.lang
      : LANGS.has(pLang)
      ? pLang
      : "en";

  const year = obj?.year ?? (isYearFolder(pYear) ? Number(pYear) : undefined);
  const slug = obj?.slug || slugFromFile;

  return {
    ...obj,
    lang,
    year,
    slug,
    __file: rel,
    url: slug ? toUrl({ lang, slug }) : undefined,
  };
}

/**
 * Normalize old + new templates naar één consistente shape.
 * - Zorgt dat `date` altijd gevuld is op basis van datePublished/date.
 * - Houdt originele velden intact voor backwards compatibility.
 */
function normalizeArticle(a) {
  const date =
    a.date ||
    a.datePublished ||
    a.dateModified ||
    null;

  const summary =
    a.summary ||
    a.excerpt ||
    "";

  const imageAlt = a.imageAlt || "";

  return {
    ...a,
    // genormaliseerde velden
    date, // gebruikt voor sortering & validatie
    summary,
    imageAlt,
  };
}

/**
 * Basic validity check AFTER normalizeArticle.
 * We accepteren zowel oude als nieuwe templates.
 */
function validateArticle(a) {
  const problems = [];
  if (!a.slug) problems.push("slug missing");
  if (!a.title) problems.push("title missing");
  if (!a.lang || !LANGS.has(a.lang)) problems.push("lang missing/invalid");
  if (!a.date) problems.push("date/datePublished missing");
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

      if (entry.isDirectory()) {
        stack.push(p);
        continue;
      }

      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;

      const parsed = safeParseJson(p);
      if (!parsed) continue;

      const enriched = enrichFromPath(parsed, p);
      const normalized = normalizeArticle(enriched);
      const issues = validateArticle(normalized);

      if (issues.length) {
        console.warn(
          `[articles] Skipped ${normalized.__file} → ${issues.join(", ")}`
        );
        continue;
      }

      out.push(normalized);
    }
  }

  return out;
}

// cache (dev-friendly)
const GLOBAL_KEY = "__ARTICLES_CACHE__";
let CACHE =
  process.env.NODE_ENV === "development"
    ? globalThis[GLOBAL_KEY] || null
    : null;

function ensureCache() {
  if (!CACHE) {
    CACHE = readAllJsonFiles(CONTENT_DIR);
    if (process.env.NODE_ENV === "development") {
      globalThis[GLOBAL_KEY] = CACHE;
    }
  }
  return CACHE;
}

/**
 * listArticles({ lang, year, tag, limit })
 * - Sort by normalized `date` desc, then title.
 */
export function listArticles({ lang, year, tag, limit } = {}) {
  const list = ensureCache();
  let filtered = list;

  if (lang) {
    filtered = filtered.filter((a) => a.lang === lang);
  }
  if (year) {
    filtered = filtered.filter((a) => a.year === Number(year));
  }
  if (tag) {
    filtered = filtered.filter(
      (a) => Array.isArray(a.tags) && a.tags.includes(tag)
    );
  }

  const sorted = [...filtered].sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    if (da === db) return a.title.localeCompare(b.title);
    return da < db ? 1 : -1; // nieuwste eerst
  });

  return limit && Number.isFinite(limit) ? sorted.slice(0, limit) : sorted;
}

/**
 * getArticle({ slug, lang? })
 */
export function getArticle({ slug, lang } = {}) {
  const list = ensureCache();
  if (!slug) return null;

  if (lang) {
    return list.find((a) => a.slug === slug && a.lang === lang) || null;
  }

  return list.find((a) => a.slug === slug) || null;
}

/**
 * getTranslations(slug)
 */
export function getTranslations(slug) {
  const list = ensureCache();
  return list.filter((a) => a.slug === slug);
}
