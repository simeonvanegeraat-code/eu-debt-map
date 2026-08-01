const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const ROOT = path.resolve(__dirname, "..");

function exists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function filesBelow(relativeDir, fileName) {
  const start = path.join(ROOT, relativeDir);
  const files = [];
  const stack = [start];

  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(entryPath);
      if (entry.isFile() && entry.name === fileName) files.push(entryPath);
    }
  }

  return files;
}

test("localized debt-vs-deficit pages use the intended public routes", () => {
  assert.equal(exists("app/de/debt-vs-deficit/page.jsx"), true);
  assert.equal(exists("app/fr/debt-vs-deficit/page.jsx"), true);
  assert.equal(exists("app/de/de/debt-vs-deficit/page.jsx"), false);
  assert.equal(exists("app/fr/fr/debt-vs-deficit/page.jsx"), false);
});

test("legacy duplicate locale routes permanently redirect", async () => {
  const configUrl = pathToFileURL(path.join(ROOT, "next.config.mjs")).href;
  const config = (await import(configUrl)).default;
  const redirects = await config.redirects();

  assert.deepEqual(
    redirects.map(({ source, destination, permanent }) => ({
      source,
      destination,
      permanent,
    })),
    [
      {
        source: "/de/de/debt-vs-deficit",
        destination: "/de/debt-vs-deficit",
        permanent: true,
      },
      {
        source: "/fr/fr/debt-vs-deficit",
        destination: "/fr/debt-vs-deficit",
        permanent: true,
      },
    ]
  );
});

test("metadata never concatenates a URL object into canonical URLs", () => {
  const riskyPages = filesBelow("app", "page.jsx")
    .filter((filePath) => {
      const source = fs.readFileSync(filePath, "utf8");
      return (
        /const base = new URL\("https:\/\/www\.eudebtmap\.com"\)/.test(source) &&
        /\$\{base\}/.test(source)
      );
    })
    .map((filePath) => path.relative(ROOT, filePath));

  assert.deepEqual(riskyPages, []);
});

test("localized explainer routes are included in the sitemap", () => {
  const sitemap = read("app/sitemap.js");
  assert.match(sitemap, /path: "\/debt-vs-deficit"/);
  assert.match(sitemap, /path: "\/stability-and-growth-pact"/);
});

test("debug pages and responses are explicitly excluded from indexing", async () => {
  const debugLayout = read("app/debug/layout.jsx");
  assert.match(debugLayout, /index: false/);
  assert.match(debugLayout, /follow: false/);

  const configUrl = pathToFileURL(path.join(ROOT, "next.config.mjs")).href;
  const config = (await import(configUrl)).default;
  const headers = await config.headers();
  const debugHeaders = headers.find((entry) => entry.source === "/debug/:path*");

  assert.ok(debugHeaders);
  assert.deepEqual(debugHeaders.headers, [
    {
      key: "X-Robots-Tag",
      value: "noindex, nofollow, noarchive",
    },
  ]);
});

test("phase 3A preserves production AdSense identifiers", () => {
  assert.match(read("app/layout.jsx"), /ca-pub-9252617114074571/);
  assert.match(read("app/layout.jsx"), /pagead\/js\/adsbygoogle\.js/);
  assert.match(read("components/InArticleAd.jsx"), /data-ad-slot="8569800942"/);
  assert.equal(
    read("public/ads.txt").trim(),
    "google.com, pub-9252617114074571, DIRECT, f08c47fec0942fa0"
  );
});
