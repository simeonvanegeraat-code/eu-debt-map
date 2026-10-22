/* Run after next build; --capture records a local baseline before a redesign. */
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const baselinePath = path.join(root, "reports/home-atlas/homepage-baseline.json");
const locales = ["en", "nl", "de", "fr"];
const codes = "at be bg hr cy cz dk ee fi fr de gr hu ie it lv lt lu mt nl pl pt ro sk si es se".split(" ");
const sections = ["country-directory", "home-trend-title", "home-articles-title", "home-why-title", "home-faq-title", "home-trust-title"];

function readHome(lang) {
  return fs.readFileSync(path.join(root, `.next/server/app/${lang === "en" ? "index" : lang}.html`), "utf8");
}

function inventory(html) {
  return {
    metadata: (html.match(/<title>[^<]*<\/title>|<meta\b[^>]*>|<link\b(?=[^>]*(?:rel="canonical"|hrefLang=))[^>]*>/g) || [])
      .filter(tag => !/name="next-size-adjust"/.test(tag)).sort(),
    structuredData: [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(match => match[1]),
    links: [...new Set([...html.matchAll(/<a\b[^>]*href="([^"#]+)"/g)].map(match => match[1]))].sort(),
    answers: [...html.matchAll(/<details\b[^>]*>[\s\S]*?<\/summary>([\s\S]*?)<\/details>/g)].map(match => match[1]),
  };
}

if (process.argv.includes("--capture")) {
  fs.mkdirSync(path.dirname(baselinePath), { recursive: true });
  fs.writeFileSync(baselinePath, JSON.stringify(Object.fromEntries(locales.map(lang => [lang, inventory(readHome(lang))])), null, 2));
  console.log("Captured homepage metadata, structured data, links and FAQ baseline.");
} else {
  const baseline = fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, "utf8")) : null;
  for (const lang of locales) {
    const html = readHome(lang);
    const base = lang === "en" ? "" : `/${lang}`;
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${lang}: one visible main heading`);
    assert.ok(!/<meta name="robots"[^>]*noindex/.test(html), `${lang}: indexable`);
    assert.ok(html.includes('hrefLang="x-default"'), `${lang}: language alternates`);
    for (const code of codes) assert.ok(html.includes(`href="${base}/country/${code}"`), `${lang}: crawlable ${code}`);
    for (const id of sections) assert.ok(html.includes(`id="${id}"`), `${lang}: retained ${id}`);
    assert.ok(!html.includes('id="atlas-discover-title"'), `${lang}: no placeholder editorial content`);
    const topics = html.match(/<nav\b[^>]*id="atlas-topics"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(topics, `${lang}: tool navigation is server rendered`);
    const topicLinks = [...topics.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(topicLinks, ["#atlas-map", ...["/debt-to-gdp", "/debt-per-capita", "/debt-growth", "/eu-debt", "/deficit", "/interest-cost", "/government-spending"].map(route => base + route)], `${lang}: direct localized tool links instead of repeated main categories`);
    const current = inventory(html);
    if (baseline) {
      assert.deepEqual(current.metadata, baseline[lang].metadata, `${lang}: unchanged metadata`);
      assert.deepEqual(current.structuredData, baseline[lang].structuredData, `${lang}: unchanged structured data`);
      assert.deepEqual(current.answers, baseline[lang].answers, `${lang}: unchanged FAQ answers`);
      for (const link of baseline[lang].links.filter(link => !link.includes("#"))) {
        assert.ok(current.links.includes(link), `${lang}: retained link ${link}`);
      }
    }
    console.log(`${lang}: rendered content, 27 country links${baseline ? ", metadata, structured data, FAQ and previous links" : ""} passed`);
  }
  const preview = fs.readFileSync(path.join(root, ".next/server/app/nl/preview/home-atlas.html"), "utf8");
  assert.match(preview, /<meta name="robots" content="[^"]*noindex/);
  assert.doesNotMatch(preview, /<link rel="canonical"/);
  console.log("Design preview remains noindex without a public canonical.");
}
