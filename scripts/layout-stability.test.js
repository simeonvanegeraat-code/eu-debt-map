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
