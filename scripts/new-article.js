\
#!/usr/bin/env node
/**
 * Usage: node scripts/new-article.js <lang> <year> <slug> [title]
 * Creates content/articles/<lang>/<year>/<slug>.json from a template.
 */
import fs from "node:fs";
import path from "node:path";

const [,, lang, year, slug, ...rest] = process.argv;
if (!lang || !year || !slug) {
  console.error("Usage: node scripts/new-article.js <lang> <year> <slug> [title]");
  process.exit(1);
}
const title = rest.join(" ") || slug.replace(/[-_]/g, " ").replace(/\b\w/g, m => m.toUpperCase());

const dir = path.join(process.cwd(), "content", "articles", lang, year);
fs.mkdirSync(dir, { recursive: true });

const today = new Date().toISOString().slice(0,10);
const obj = {
  slug,
  title,
  summary: "",
  excerpt: "",
  tags: [],
  date: today,
  lang,
  image: "/images/articles/placeholder.jpg",
  imageAlt: "",
  body: "<h2>Intro</h2><p>Write your article here…</p>"
};
const file = path.join(dir, `${slug}.json`);
fs.writeFileSync(file, JSON.stringify(obj, null, 2), "utf8");
console.log("Created", file);
