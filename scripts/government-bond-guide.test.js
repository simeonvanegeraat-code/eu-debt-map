const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

test("government bond preview stays excluded from search engines", () => {
  const preview = read("app/nl/preview/staatsobligaties-nederland/page.jsx");

  assert.match(preview, /robots:\s*\{[\s\S]*index:\s*false/);
  assert.match(preview, /follow:\s*false/);
  assert.match(preview, /alternates:\s*\{\s*canonical:\s*null\s*\}/);
});

test("published government bond guide is indexable and discoverable", () => {
  const page = read("app/nl/staatsobligaties-nederland/page.jsx");
  const sitemap = read("app/sitemap.js");
  const countryExperience = read("components/country/CountryPageExperience.jsx");

  assert.match(page, /canonical:\s*PAGE_URL/);
  assert.match(page, /robots:\s*\{[\s\S]*index:\s*true/);
  assert.match(page, /"@type": "Article"/);
  assert.match(page, /"@type": "BreadcrumbList"/);
  assert.match(sitemap, /\/nl\/staatsobligaties-nederland/);
  assert.match(countryExperience, /href="\/nl\/staatsobligaties-nederland"/);
});

test("government bond guide uses Dutch primary sources and a real search example", () => {
  const guide = read("components/government-bonds/DutchGovernmentBondGuide.jsx");

  assert.match(guide, /https:\/\/www\.dsta\.nl\/onderwerpen\/s\/staatslening-kopen/);
  assert.doesNotMatch(guide, /english\.dsta\.nl/);
  assert.match(guide, /NL0015073TQ2/);
  assert.match(guide, /DSL 2,50% · 15 januari 2031/);
  assert.match(guide, /Een obligatie valt niet onder de depositogarantie/);
  assert.match(guide, /compensatie gelden tot €20\.000/);
});

test("transactional answers precede the deeper product explanation", () => {
  const guide = read("components/government-bonds/DutchGovernmentBondGuide.jsx");
  const routeIndex = guide.indexOf('id="routes"');
  const lookupIndex = guide.indexOf('id="zoeken"');
  const calculatorIndex = guide.indexOf("<BondExampleCalculator />");
  const riskIndex = guide.indexOf('id="risicos"');
  const mechanicsIndex = guide.indexOf('id="werking"');

  assert.ok(routeIndex > -1);
  assert.ok(routeIndex < lookupIndex);
  assert.ok(lookupIndex < calculatorIndex);
  assert.ok(calculatorIndex < riskIndex);
  assert.ok(riskIndex < mechanicsIndex);
});

test("chapter navigation sticks below the site header and offsets anchors", () => {
  const css = read(
    "components/government-bonds/government-bond-guide.module.css"
  );

  assert.match(css, /\.chapterNav\s*\{[^}]*position:\s*sticky;/s);
  assert.match(css, /\.chapterNav\s*\{[^}]*top:\s*79px;/s);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*\.chapterNav\s*\{[^}]*top:\s*73px;/s);
  assert.match(css, /\.page section\[id\]\s*\{[^}]*scroll-margin-top:\s*150px;/s);
  assert.match(
    css,
    /@media \(max-width: 560px\)[\s\S]*\.page section\[id\]\s*\{[^}]*scroll-margin-top:\s*136px;/s
  );
});
