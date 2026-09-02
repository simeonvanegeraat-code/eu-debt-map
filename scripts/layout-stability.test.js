const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function jsxFiles(relativeDir) {
  const start = path.join(ROOT, relativeDir);
  const files = [];
  const stack = [start];

  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(entryPath);
      if (entry.isFile() && /\.jsx?$/.test(entry.name)) files.push(entryPath);
    }
  }

  return files;
}

test("the site header uses one global width and reserves scrollbar space", () => {
  const css = read("app/globals.css");

  assert.match(css, /html\s*\{\s*scrollbar-gutter:\s*stable;/);
  assert.match(
    css,
    /\.site-header\s+\.header-inner\s*\{[^}]*max-width:\s*1500px;/s
  );
});

test("page components cannot override the global site header width", () => {
  const offenders = [...jsxFiles("app"), ...jsxFiles("components")]
    .filter((filePath) => /\.site-header\s+\.container/.test(fs.readFileSync(filePath, "utf8")))
    .map((filePath) => path.relative(ROOT, filePath));

  assert.deepEqual(offenders, []);
});

test("localized home navigation only matches the exact locale root", () => {
  const header = read("components/Header.jsx");

  assert.match(
    header,
    /if\s*\(hrefBase\s*===\s*["']\/["']\)\s*return\s+pathname\s*===\s*target;/
  );
});

test("active desktop navigation does not change link width", () => {
  const css = read("app/globals.css");
  const baseRule = css.match(/\.nav-link\s*\{([\s\S]*?)\}/)?.[1] || "";
  const activeRule = css.match(/\.nav-link--active\s*\{([\s\S]*?)\}/)?.[1] || "";

  assert.match(baseRule, /font-weight:\s*600;/);
  assert.doesNotMatch(activeRule, /font-weight:/);
});

test("cookie pages preserve responsive horizontal container padding", () => {
  for (const relativePath of [
    "app/cookies/page.jsx",
    "app/nl/cookies/page.jsx",
    "app/de/cookies/page.jsx",
    "app/fr/cookies/page.jsx",
  ]) {
    const source = read(relativePath);
    assert.doesNotMatch(source, /padding:\s*["']24px 0 36px["']/);
    assert.match(source, /paddingTop:\s*24/);
    assert.match(source, /paddingBottom:\s*36/);
  }
});

test("the shared footer and skip link stay localized in every supported language", () => {
  const footer = read("components/Footer.jsx");
  const skipLink = read("components/LocalizedSkipLink.jsx");
  const layout = read("app/layout.jsx");

  for (const expected of [
    "Independent educational visualization based on Eurostat data.",
    "Onafhankelijke educatieve visualisatie op basis van Eurostat-gegevens.",
    "Unabhängige Bildungsvisualisierung auf Basis von Eurostat-Daten.",
    "Visualisation pédagogique indépendante fondée sur les données d’Eurostat.",
  ]) {
    assert.match(footer, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const expected of [
    "Skip to content",
    "Ga naar de inhoud",
    "Zum Inhalt springen",
    "Aller au contenu",
  ]) {
    assert.match(skipLink, new RegExp(expected));
  }

  assert.match(layout, /<LocalizedSkipLink\s*\/>/);
  assert.doesNotMatch(layout, />Skip to content<\/a>/);
});

test("country chapter navigation lands on headings without overriding manual scrolling", () => {
  const experience = read("components/country/CountryPageExperience.jsx");
  const css = read("components/country/country-page.module.css");

  for (const id of ["snapshot", "compare", "movement", "context", "method"]) {
    assert.match(
      experience,
      new RegExp(`className=\\{\\\`\\$\\{styles\\.eyebrow\\} \\$\\{styles\\.chapterTarget\\}\\\`\\} id="${id}"`)
    );
  }

  assert.match(experience, /id="country-hero"/);
  assert.doesNotMatch(experience, /addEventListener\(["']wheel["']/);
  assert.doesNotMatch(experience, /scrollIntoView/);
  assert.match(css, /\.chapterTarget\s*\{[^}]*scroll-margin-top:\s*156px;/s);
  assert.doesNotMatch(css, /scroll-snap-type:/);
  assert.doesNotMatch(css, /scroll-snap-align:/);
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*\.chapterTarget\s*\{\s*scroll-margin-top:\s*82px;/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*scroll-behavior:\s*auto;/);
});
