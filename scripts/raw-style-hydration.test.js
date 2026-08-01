const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const SOURCE_DIRS = ["app", "components"];
const RAW_STYLE_BLOCK = /<style>\s*\{`([\s\S]*?)`}\s*<\/style>/g;

function jsxFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) return jsxFiles(filePath);
    return entry.isFile() && /\.jsx?$/.test(entry.name) ? [filePath] : [];
  });
}

test("raw server-rendered style blocks avoid HTML-sensitive characters", () => {
  const unsafeBlocks = [];

  for (const sourceDir of SOURCE_DIRS) {
    for (const filePath of jsxFiles(path.join(ROOT, sourceDir))) {
      const source = fs.readFileSync(filePath, "utf8");
      for (const match of source.matchAll(RAW_STYLE_BLOCK)) {
        if (/[&<>"']/.test(match[1])) {
          unsafeBlocks.push(path.relative(ROOT, filePath));
        }
      }
    }
  }

  assert.deepEqual(
    unsafeBlocks,
    [],
    "HTML-sensitive characters in a raw <style>{`...`}</style> block can differ between server HTML and browser hydration"
  );
});
