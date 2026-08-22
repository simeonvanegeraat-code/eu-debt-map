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

function jsonFilesBelow(relativeDir) {
  const start = path.join(ROOT, relativeDir);
  const files = [];
  const stack = [start];

  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(entryPath);
      if (entry.isFile() && entry.name.endsWith(".json")) files.push(entryPath);
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

test("legacy duplicate and retired article routes permanently redirect", async () => {
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
      {
        source: "/articles/eu-debt-to-gdp-2025",
        destination: "/debt-to-gdp",
        permanent: true,
      },
      {
        source: "/articles/eu-debt-thermometer-q2-2025",
        destination: "/articles/eu-debt-burden-2026",
        permanent: true,
      },
      {
        source: "/nl/articles/eu-schuldthermometer-q2-2025",
        destination: "/nl/articles/eu-debt-burden-2026",
        permanent: true,
      },
      {
        source: "/nl/articles/staatschuld-nederland-2025",
        destination: "/nl/articles/actuele-staatsschuld-nederland-live-inzicht",
        permanent: true,
      },
      {
        source: "/nl/articles/nederlandse-staatsschuld-live-teller-europa",
        destination: "/nl/articles/actuele-staatsschuld-nederland-live-inzicht",
        permanent: true,
      },
      {
        source: "/nl/articles/analyse-nederlandse-staatsschuld-2025",
        destination: "/nl/articles/actuele-staatsschuld-nederland-live-inzicht",
        permanent: true,
      },
      {
        source: "/nl/articles/nederlandse-staatsschuld-actueel",
        destination: "/nl/articles/actuele-staatsschuld-nederland-live-inzicht",
        permanent: true,
      },
      {
        source: "/nl/articles/staatsschuld-nederland-live-eurostat-update",
        destination: "/nl/articles/actuele-staatsschuld-nederland-live-inzicht",
        permanent: true,
      },
      {
        source: "/articles/highest-debt-per-capita-europe-2025",
        destination: "/articles/eu-debt-per-capita-2026-inequality-report",
        permanent: true,
      },
      {
        source: "/articles/european-debt-per-person-2025",
        destination: "/articles/eu-debt-per-capita-2026-inequality-report",
        permanent: true,
      },
      {
        source: "/nl/articles/europese-schuld-per-persoon-2025",
        destination: "/nl/articles/eu-staatsschuld-per-inwoner-2026-analyse",
        permanent: true,
      },
      {
        source: "/de/articles/europas-schuld-pro-person-2025",
        destination: "/de/articles/eu-pro-kopf-verschuldung-2026-analyse",
        permanent: true,
      },
      {
        source: "/fr/articles/dette-europeenne-par-personne-2025",
        destination: "/fr/articles/dette-publique-ue-par-habitant-2026-analyse",
        permanent: true,
      },
      {
        source: "/de/articles/deutschland-staatsverschuldung-2025",
        destination: "/de/articles/aktuelle-staatsverschuldung-deutschland-live-schuldenuhr",
        permanent: true,
      },
      {
        source: "/de/articles/schuldenuhr-deutschland-live-aktueller-stand-2026",
        destination: "/de/articles/aktuelle-staatsverschuldung-deutschland-live-schuldenuhr",
        permanent: true,
      },
      {
        source: "/de/articles/schuldenuhr-deutschland-live-pro-kopf-2026",
        destination: "/de/articles/eu-pro-kopf-verschuldung-2026-analyse",
        permanent: true,
      },
      {
        source: "/de/articles/deutschlands-staatsverschuldung-2026-aktuell",
        destination: "/de/articles/aktuelle-staatsverschuldung-deutschland-live-schuldenuhr",
        permanent: true,
      },
      {
        source: "/de/articles/schuldenuhr-deutschland-2026-schuldenbremse-live",
        destination: "/de/articles/deutsches-schuldenparadox-schuldenbremse-zwickmuehle",
        permanent: true,
      },
    ]
  );
});

test("retired debt articles are removed after their permanent redirects are configured", () => {
  assert.equal(exists("content/articles/en/2025/eu-debt-to-gdp-2025.json"), false);
  assert.equal(exists("content/articles/en/2025/eu-debt-thermometer-q2-2025.json"), false);
  assert.equal(exists("content/articles/nl/2025/eu-schuldthermometer-q2-2025.json"), false);
  assert.equal(exists("content/articles/en/2025/highest-debt-per-capita-europe.json"), false);
  assert.equal(exists("content/articles/en/2025/european-debt-per-person-2025-en.json"), false);
  assert.equal(exists("content/articles/nl/2025/european-debt-per-person-2025.json"), false);
  assert.equal(exists("content/articles/de/european-debt-per-person-2025.json"), false);
  assert.equal(exists("content/articles/fr/european-debt-per-person-2025.json"), false);
  assert.equal(exists("content/articles/nl/2025/staatschuld-nederland-2025.json"), false);
  assert.equal(exists("content/articles/nl/2025/eudebtmap_netherlands_articles.json"), false);
  assert.equal(exists("content/articles/nl/2025/analyse-nederlandse-staatsschuld-2025.json"), false);
  assert.equal(exists("content/articles/nl/2025/nederlandse-staatsschuld-actueel.json"), false);
  assert.equal(exists("content/articles/nl/2026/staatschuld-update-april.json"), false);
  assert.equal(exists("content/articles/de/deutschland-staatsverschuldung-2025.json"), false);
  assert.equal(exists("content/articles/de/schuldenuhr-deutschland-live-aktueller-stand-2026.json"), false);
  assert.equal(exists("content/articles/de/schuldenuhr-deutschland-live-pro-kopf-2026.json"), false);
  assert.equal(exists("content/articles/de/Deutschlands Staatsverschuldung 2026.json"), false);
  assert.equal(exists("content/articles/de/schuldenuhr-deutschland-2026-schuldenbremse-live.json"), false);
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

test("SEO image references resolve to existing image routes and assets", () => {
  const englishCountryPage = read("app/country/[code]/page.jsx");
  const germanCountryPage = read("app/de/country/[code]/page.jsx");
  const localizedDebtPage = read("components/LocalizedEUDebtPage.jsx");

  for (const countryPage of [englishCountryPage, germanCountryPage]) {
    assert.match(
      countryPage,
      /\/country\/\$\{code\.toLowerCase\(\)\}\/opengraph-image/
    );
    assert.doesNotMatch(countryPage, /\/og\/country-/);
  }

  assert.equal(exists("app/country/[code]/opengraph-image.jsx"), true);
  assert.equal(exists("public/eu_favicon_512.png"), true);
  assert.match(localizedDebtPage, /\/eu_favicon_512\.png/);
  assert.doesNotMatch(localizedDebtPage, /\/icons\/icon-512\.png/);
});

test("Germany debt-clock SEO is route-scoped and preserves the Dutch country page", () => {
  const germanCountryPage = read("app/de/country/[code]/page.jsx");
  const dutchCountryPage = read("app/nl/country/[code]/page.jsx");
  const countryClient = read("app/country/[code]/CountryClient.jsx");
  const breadcrumbs = read("components/GermanyDebtClockBreadcrumbs.jsx");

  assert.match(germanCountryPage, /const isGermany = code === "DE"/);
  assert.match(
    germanCountryPage,
    /Schuldenuhr Deutschland live \$\{ratioYear\} \| EU Debt Map/
  );
  assert.match(germanCountryPage, /titleOverride=/);
  assert.match(germanCountryPage, /GermanyDebtClockIntro/);
  assert.match(germanCountryPage, /GermanyDebtClockBreadcrumbs/);
  assert.match(germanCountryPage, /preferredSlug=/);

  assert.doesNotMatch(dutchCountryPage, /titleOverride=/);
  assert.doesNotMatch(dutchCountryPage, /preferredSlug=/);
  assert.doesNotMatch(dutchCountryPage, /GermanyDebtClock/);
  assert.match(
    dutchCountryPage,
    /Staatsschuld \$\{name\}: live en \$\{ratioText\} van bbp/
  );
  assert.match(dutchCountryPage, /canonical: url/);
  assert.match(dutchCountryPage, /nl: `\$\{SITE\}\/nl\/country\/\$\{code\}`/);

  assert.match(countryClient, /titleOverride = null/);
  assert.match(
    countryClient,
    /titleOverride \|\| pageTitleFor\(effLang, displayName\)/
  );
  assert.match(breadcrumbs, /"@type": "BreadcrumbList"/);
  assert.match(breadcrumbs, /item: `\$\{SITE\}\/de\/country\/de`/);
});

test("localized explainer routes are included in the sitemap", () => {
  const sitemap = read("app/sitemap.js");
  assert.match(sitemap, /path: "\/debt-vs-deficit"/);
  assert.match(sitemap, /path: "\/stability-and-growth-pact"/);
});

test("all existing localized EU debt routes are included in the multilingual sitemap", () => {
  const sitemap = read("app/sitemap.js");

  assert.match(sitemap, /path: "\/eu-debt"/);
  assert.doesNotMatch(sitemap, /const EN_ONLY_PATHS/);
});

test("both homepage EU debt actions preserve the selected language", () => {
  const homepage = read("components/LocalizedHomePage.jsx");

  for (const href of ["/eu-debt", "/nl/eu-debt", "/de/eu-debt", "/fr/eu-debt"]) {
    assert.match(homepage, new RegExp(`euDebtHref: "${href}"`));
  }

  assert.equal(
    (homepage.match(/<Link href=\{t\.euDebtHref\}/g) || []).length,
    2
  );
  assert.doesNotMatch(homepage, /<Link href="\/eu-debt"/);
});

test("RSS article links use their actual locale and are deduplicated", () => {
  const rss = read("app/rss.xml/route.js");

  assert.match(rss, /const LOCALE_PREFIX/);
  assert.match(rss, /function articleUrl/);
  assert.match(rss, /seenLinks/);
  assert.doesNotMatch(rss, /const link = `\$\{SITE\}\/articles\/\$\{slug\}`/);
});

test("the central article translation registry only references real articles", () => {
  const registryPath = "content/article-translations.json";
  assert.equal(exists(registryPath), true);

  const registry = JSON.parse(read(registryPath));
  const supportedLocales = new Set(["en", "nl", "de", "fr"]);
  const articles = jsonFilesBelow("content/articles").map((filePath) =>
    JSON.parse(fs.readFileSync(filePath, "utf8"))
  );
  const existingArticles = new Set(
    articles.map((article) => `${article.lang}:${article.slug}`)
  );
  const registeredArticles = new Set();

  for (const [translationKey, translations] of Object.entries(registry)) {
    assert.match(translationKey, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(Object.keys(translations).length >= 2);

    for (const [lang, slug] of Object.entries(translations)) {
      assert.equal(supportedLocales.has(lang), true);
      assert.equal(typeof slug, "string");
      assert.ok(slug.length > 0);

      const articleKey = `${lang}:${slug}`;
      assert.equal(existingArticles.has(articleKey), true, `${articleKey} must exist`);
      assert.equal(
        registeredArticles.has(articleKey),
        false,
        `${articleKey} must belong to one translation group`
      );
      registeredArticles.add(articleKey);
    }
  }

  assert.match(read("lib/articleTranslations.js"), /article-translations\.json/);
  assert.match(read("lib/articles.js"), /getTranslationGroupBySlug/);
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
