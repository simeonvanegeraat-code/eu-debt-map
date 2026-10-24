const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  ARTICLE_AD_MARKER,
  buildArticleJsonLd,
  buildArticleMetadata,
  safeIsoDate,
  splitArticleBody,
} = require("../lib/articlePageCore.cjs");
const {
  formatArticleDate,
} = require("../lib/articleDateCore.cjs");

const ROOT = path.resolve(__dirname, "..");

test("article dates use the publisher timezone around midnight", () => {
  const published = "2026-09-03T00:10:19+02:00";

  assert.equal(
    formatArticleDate(published, "de", { dateStyle: "long" }),
    "3. September 2026"
  );
});
test("October quarterly country news preserves its periods, source boundaries and local destinations", () => {
  const editions = [
  [
    "nl",
    "staatsschuld-nederland-tweede-kwartaal-2026-eurostat",
    "NL"
  ],
  [
    "fr",
    "dette-france-119-1-pib-eurostat-deuxieme-trimestre-2026",
    "FR"
  ],
  [
    "de",
    "staatsschulden-deutschland-22-4-milliarden-zweites-quartal-2026",
    "DE"
  ],
  [
    "en",
    "finland-debt-90-percent-gdp-eurostat-q2-2026",
    "FI"
  ]
];
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "content/article-publication-manifest.json"), "utf8"));
  const translations = JSON.parse(fs.readFileSync(path.join(ROOT, "content/article-translations.json"), "utf8"));
  const images = new Set();
  for (const [lang, slug, country] of editions) {
    const article = JSON.parse(fs.readFileSync(path.join(ROOT, "content/articles", lang, "2026", slug + ".json"), "utf8"));
    const prefix = lang === "en" ? "" : "/" + lang;
    const [prose, footer] = article.body.split("<details id='article-sources'>");
    assert.equal(article.articleType, "news");
    assert.equal(article.datePublished, "2026-10-22");
    assert.equal(article.dateModified, "2026-10-22");
    assert.equal(article.dateReviewed, "2026-10-22");
    assert.deepEqual(article.relatedCountries, [country]);
    assert.equal(article.countryPageFallback, false);
    assert.ok(manifest.articles.includes(prefix + "/articles/" + slug));
    assert.ok(prose.includes("href='" + prefix + "/country/" + country.toLowerCase() + "'"));
    assert.ok(prose.includes("href='" + prefix + "/debt-to-gdp'"));
    assert.ok(footer.includes(prefix + "/methodology"));
    assert.doesNotMatch(prose, /href=['"]https?:\/\//);
    assert.doesNotMatch(article.body, /<table\b|<script\b/i);
    assert.equal((prose.match(/<!-- MID_ARTICLE_AD -->/g) || []).length, 1);
    assert.ok(article.sources.some(source => source.url.endsWith("/2-21102026-bp")), "use the quarterly release, not the annual notification");
    assert.ok(!article.sources.some(source => source.url.endsWith("/2-21102026-ap")));
    assert.equal((footer.match(/<li><a /g) || []).length, article.sources.length);
    for (const source of article.sources) {
      assert.equal(source.accessed, "2026-10-22");
      assert.ok(footer.includes(source.url));
    }
    assert.match(article.contentNotes, /no independent human or native-language review claimed/);
    assert.match(article.contentNotes, /not October debt stocks/);
    assert.ok(!Object.values(translations).some(group => Object.values(group).includes(slug)), "distinct country stories are not equivalent translations");
    assert.ok(fs.existsSync(path.join(ROOT, "public", article.image)));
    assert.equal(article.imageWidth, 1672);
    assert.equal(article.imageHeight, 941);
    images.add(article.image);
    const metadata = buildArticleMetadata({article, translations: [], slug, lang, ogImage: "https://www.eudebtmap.com" + article.image});
    assert.equal(metadata.alternates.canonical, "https://www.eudebtmap.com" + prefix + "/articles/" + slug);
  }
  assert.equal(images.size, 4);
});

test("October news calculations retain the historical release vintage and the Dutch rounding caveat", () => {
  // These are the 21 October 2026 inputs, not whatever a later snapshot revises them to.
  const inputs = {
    NL: [517377, 523795],
    FR: [3535928.6, 3595524.9],
    DE: [2902262.5, 2924674.2],
    FI: [254813, 259585],
  };
  const billions = Object.fromEntries(Object.entries(inputs).map(([code, [q1, q2]]) => [code, Number(((q2 - q1) / 1000).toFixed(1))]));
  assert.deepEqual(billions, {NL: 6.4, FR: 59.6, DE: 22.4, FI: 4.8});
  assert.equal(Math.round((inputs.NL[1] - inputs.NL[0]) * 1e6 / (91 * 86400)), 816);
  const load = (lang, slug) => JSON.parse(fs.readFileSync(path.join(ROOT, "content/articles", lang, "2026", slug + ".json"), "utf8"));
  const nl = load("nl", "staatsschuld-nederland-tweede-kwartaal-2026-eurostat");
  assert.match(nl.body, /vrijwel stabiel/);
  assert.match(nl.body, /0,0 procentpunt/);
  assert.match(nl.body, /91 dagen/);
  assert.match(nl.body, /€816 per seconde/);
  const fr = load("fr", "dette-france-119-1-pib-eurostat-deuxieme-trimestre-2026");
  assert.match(fr.body, /119,0 %/);
  assert.match(fr.body, /119,1 %/);
  assert.match(fr.body, /29 septembre/);
  assert.match(fr.body, /3,7 points/);
  const de = load("de", "staatsschulden-deutschland-22-4-milliarden-zweites-quartal-2026");
  assert.match(de.body, /63,5 Prozent/);
  assert.match(de.body, /63,4 Prozent/);
  assert.match(de.body, /Bund, Länder, Gemeinden und Sozialversicherung/);
  const en = load("en", "finland-debt-90-percent-gdp-eurostat-q2-2026");
  assert.match(en.body, /seven EU countries/);
  assert.match(en.body, /compared with six in March/);
  assert.match(en.body, /not an EU legal debt ceiling/);
  assert.match(en.body, /euro area’s 21 members/);
});

test("article body without a marker remains unchanged", () => {
  assert.deepEqual(splitArticleBody("<p>Body</p>"), {
    bodyBeforeAd: "<p>Body</p>",
    bodyAfterAd: "",
    hasMidArticleAd: false,
  });
});

test("article body marker produces one clean split", () => {
  assert.deepEqual(
    splitArticleBody(`<p>Before</p>${ARTICLE_AD_MARKER}<p>After</p>`),
    {
      bodyBeforeAd: "<p>Before</p>",
      bodyAfterAd: "<p>After</p>",
      hasMidArticleAd: true,
    }
  );
});

test("shared metadata uses the localized SEO title and hreflang routes", () => {
  const metadata = buildArticleMetadata({
    article: {
      slug: "example",
      title: "Long visible title",
      seoTitle: "Focused search title",
      summary: "Summary",
      lang: "de",
      datePublished: "2026-04-28T00:00:00+02:00",
      image: "/images/example.jpg",
      author: { name: "EU Debt Map Research" },
    },
    translations: [
      { lang: "en", slug: "example" },
      { lang: "de", slug: "example" },
    ],
    slug: "example",
    lang: "de",
    ogImage: "https://www.eudebtmap.com/images/example.jpg",
  });

  assert.equal(metadata.title, "Focused search title • EU Debt Map");
  assert.equal(
    metadata.alternates.canonical,
    "https://www.eudebtmap.com/de/articles/example"
  );
  assert.equal(
    metadata.alternates.languages.en,
    "https://www.eudebtmap.com/articles/example"
  );
  assert.equal(
    metadata.alternates.languages.de,
    "https://www.eudebtmap.com/de/articles/example"
  );
  assert.equal(
    metadata.alternates.languages["x-default"],
    "https://www.eudebtmap.com/articles/example"
  );
  assert.equal(metadata.openGraph.images[0].width, undefined);
  assert.equal(metadata.openGraph.images[0].height, undefined);
});

test("article metadata publishes measured image dimensions instead of a fixed guess", () => {
  const article = {
    title: "Measured image",
    summary: "Summary",
    image: "/images/measured.jpg",
    imageWidth: 1672,
    imageHeight: 941,
  };
  const metadata = buildArticleMetadata({
    article,
    slug: "measured-image",
    ogImage: "https://www.eudebtmap.com/images/measured.jpg",
  });
  const schema = buildArticleJsonLd({
    article,
    url: "https://www.eudebtmap.com/articles/measured-image",
  });

  assert.deepEqual(metadata.openGraph.images[0], {
    url: "https://www.eudebtmap.com/images/measured.jpg",
    width: 1672,
    height: 941,
  });
  assert.equal(schema.image[0].width, 1672);
  assert.equal(schema.image[0].height, 941);
});

test("hreflang uses one stable x-default when a translation group has no English article", () => {
  const translations = [
    { lang: "nl", slug: "franse-schuld" },
    { lang: "fr", slug: "dette-francaise" },
  ];
  const article = {
    title: "Franse staatsschuld",
    summary: "Summary",
  };

  const dutchMetadata = buildArticleMetadata({
    article,
    translations,
    slug: "franse-schuld",
    lang: "nl",
  });
  const frenchMetadata = buildArticleMetadata({
    article,
    translations,
    slug: "dette-francaise",
    lang: "fr",
  });

  assert.equal(
    dutchMetadata.alternates.languages["x-default"],
    "https://www.eudebtmap.com/nl/articles/franse-schuld"
  );
  assert.equal(
    frenchMetadata.alternates.languages["x-default"],
    "https://www.eudebtmap.com/nl/articles/franse-schuld"
  );
});

test("shared schema distinguishes analysis from news and preserves review data", () => {
  const article = {
    title: "Example analysis",
    summary: "Summary",
    articleType: "analysis",
    lang: "fr",
    datePublished: "2026-04-28T00:00:00+02:00",
    dateModified: "2026-08-01T00:00:00+02:00",
    dateReviewed: "2026-08-01T00:00:00+02:00",
    author: { name: "EU Debt Map Research", url: "https://www.eudebtmap.com/about" },
    reviewedBy: { name: "EU Debt Map Editorial Review" },
    tags: ["EU debt", "Eurostat"],
    image: "/images/example.jpg",
  };
  const schema = buildArticleJsonLd({
    article,
    url: "https://www.eudebtmap.com/fr/articles/example",
    lang: "fr",
  });

  assert.equal(schema["@type"], "Article");
  assert.equal(schema.inLanguage, "fr");
  assert.equal(schema.author["@type"], "Organization");
  assert.equal(schema.reviewedBy["@type"], "Organization");
  assert.equal(schema.dateReviewed, "2026-07-31T22:00:00.000Z");
  assert.equal(schema.publisher.logo.url, "https://www.eudebtmap.com/eu_favicon_512.png");
  assert.equal(schema.image[0].url, "https://www.eudebtmap.com/images/example.jpg");
  assert.equal(schema.image[0].width, undefined);
  assert.equal(schema.image[0].height, undefined);
  assert.equal(schema.keywords, "EU debt, Eurostat");

  const newsSchema = buildArticleJsonLd({
    article: { ...article, articleType: "news" },
    url: "https://www.eudebtmap.com/fr/articles/news",
    lang: "fr",
  });
  assert.equal(newsSchema["@type"], "NewsArticle");
});

test("invalid dates are omitted safely", () => {
  assert.equal(safeIsoDate("not-a-date"), undefined);
  assert.equal(safeIsoDate(null), undefined);
});

test("all article files contain at most one manual ad marker", () => {
  const contentRoot = path.join(ROOT, "content", "articles");
  const stack = [contentRoot];

  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const filePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(filePath);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;

      const article = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const body = typeof article.body === "string" ? article.body : "";
      const markerCount = body.split(ARTICLE_AD_MARKER).length - 1;
      assert.ok(
        markerCount <= 1,
        `${path.relative(ROOT, filePath)} contains ${markerCount} ad markers`
      );
    }
  }
});

test("all localized article routes use the shared body and schema helpers", () => {
  const routes = [
    "app/articles/[slug]/page.jsx",
    "app/nl/articles/[slug]/page.jsx",
    "app/de/articles/[slug]/page.jsx",
    "app/fr/articles/[slug]/page.jsx",
  ];

  for (const route of routes) {
    const source = fs.readFileSync(path.join(ROOT, route), "utf8");
    assert.match(source, /body=\{article\.body\}/, route);
    assert.match(source, /visualizations=\{article\.visualizations\}/, route);
    assert.match(source, /lang=\{article\.lang\}/, route);
    assert.match(
      source,
      /<article className="article-container" lang=\{article\.lang\}>/,
      route
    );
    assert.match(source, /buildArticleMetadata\(/, route);
    assert.match(source, /buildArticleJsonLd\(/, route);
    assert.match(source, /modifiedDate/, route);
    assert.match(source, /<ShareBar[^>]+lang=\{LANG\}/, route);
    assert.match(
      source,
      /<style dangerouslySetInnerHTML=\{\{ __html: css \}\} \/>/,
      route
    );
    assert.doesNotMatch(
      source,
      /dangerouslySetInnerHTML=\{\{ __html: article\.body/,
      route
    );
    assert.doesNotMatch(source, /<style>\{css\}<\/style>/, route);
    assert.doesNotMatch(source, /"@type": "NewsArticle"/, route);
  }
});

test("localized route layouts set the document language during initial load and navigation", () => {
  const component = fs.readFileSync(
    path.join(ROOT, "components", "DocumentLanguage.jsx"),
    "utf8"
  );

  assert.match(component, /document\.documentElement\.lang = safeLang/);
  assert.match(component, /dangerouslySetInnerHTML/);

  for (const lang of ["nl", "de", "fr"]) {
    const layout = fs.readFileSync(
      path.join(ROOT, "app", lang, "layout.jsx"),
      "utf8"
    );
    assert.match(layout, new RegExp(`<DocumentLanguage lang="${lang}" \\/>`));
  }
});

test("the euro area debt analysis preserves comparable quarterly figures in all four languages", () => {
  const fixture = require("./fixtures/article-review-2026-10-22.json");
  const editions = fixture.articles.filter(a => a.slug === "eurozone-hidden-debt-timebomb-extended");
  for (const entry of editions) {
    const article = JSON.parse(fs.readFileSync(path.join(ROOT, entry.file), "utf8"));
    const body = article.body.replace(/,/g, ".");
    assert.equal(article.datePublished, entry.datePublished);
    assert.equal(article.dateReviewed, fixture.reviewed);
    assert.equal(article.articleType, "analysis");
    assert.equal(article.image, "/images/articles/eurozone-debt-risks-2026-editorial-v2.jpg");
    for (const value of ["88.8", "88.4", "87.3", "82.9", "140.8", "119.1", "152.0", "115.4"]) {
      assert.ok(body.includes(value), entry.lang + ": missing " + value);
    }
    const prefix = entry.lang === "en" ? "" : "/" + entry.lang;
    for (const target of ["/country/gr", "/country/fr", "/interest-cost", "/inflation", "/debt-to-gdp", "/articles/eu-debt-burden-2026"]) {
      assert.ok(article.body.includes("href='" + prefix + target + "'"));
    }
    assert.doesNotMatch(article.body, /<table\b|contentReference|oaicite/);
    assert.ok(article.sources.some(s => s.url.endsWith("/2-21102026-bp")));
  }
});


test("the Dutch budget analysis distinguishes the latest CBS observation from budget forecasts", () => {
  const article = JSON.parse(fs.readFileSync(
    path.join(ROOT, "content/articles/nl/2025/hollandse-paradox-bezuinigen-bij-lage-staatsschuld.json"),
    "utf8"
  ));

  assert.equal(article.slug, "hollandse-paradox-bezuinigen-bij-lage-staatsschuld");
  assert.equal(article.datePublished, "2026-08-19T01:25:30+02:00");
  assert.match(article.body, /juni 2026/);
  assert.match(article.body, /43,7%/);
  for (const forecast of ["45,6%", "46,9%", "49,6%", "2,9%"]) {
    assert.ok(article.body.includes(forecast), `Missing budget forecast: ${forecast}`);
  }
  assert.match(article.body, /Miljoenennota 2027/);
  assert.match(article.sourceNote, /voorlopige/);
  assert.match(article.sourceNote, /ramingen/);
  assert.doesNotMatch(article.body, /<table|nog niet afgeronde begroting|€17,453/);
  assert.ok(article.sources.some((source) => source.url === "https://www.rijksfinancien.nl/miljoenennota/2027"));
  assert.ok(article.sources.some((source) => new URL(source.url).hostname === "www.cbs.nl"));
  assert.equal(article.body.split(ARTICLE_AD_MARKER).length - 1, 1);
});

test("the Dutch investment explainer dates the historical estimate and labels its illustrative example", () => {
  const article = JSON.parse(fs.readFileSync(
    path.join(ROOT, "content/articles/nl/2025/europa-schuldendilemma-investeren-voor-de-toekomst.json"),
    "utf8"
  ));

  assert.equal(article.slug, "europa-schuldendilemma-investeren-voor-de-toekomst");
  assert.equal(article.datePublished, "2025-11-07T09:00:00+01:00");
  assert.doesNotMatch(article.title, /triljoen/i);
  assert.match(article.body, /€750–800 miljard/);
  assert.match(article.body, /september 2024/);
  assert.match(article.body, /publieke én private/);
  assert.match(article.body, /geen verslag van een specifiek project/);
  assert.match(article.body, /3 maart 2026/);
  assert.match(article.body, /href='\/nl\/debt-to-gdp'/);
  assert.doesNotMatch(article.body, /<table/);
  assert.equal(article.body.split(ARTICLE_AD_MARKER).length - 1, 1);
});

test("the US 40 trillion debt article keeps its definitions and figures aligned in all four languages", () => {
  const files = {
    en: "content/articles/en/2026/us-national-debt-40-trillion-interest-cost-2026.json",
    nl: "content/articles/nl/2026/amerikaanse-staatsschuld-40-biljoen-rentekosten-2026.json",
    de: "content/articles/de/2026/us-staatsschulden-40-billionen-zinskosten-2026.json",
    fr: "content/articles/fr/2026/dette-americaine-40000-milliards-cout-interets-2026.json",
  };
  const localizedNumbers = {
    en: ["40.033", "32.279", "7.754", "$963", "$763", "$3.17"],
    nl: ["40,033", "32,279", "7,754", "$963", "$763", "$3,17"],
    de: ["40,033", "32,279", "7,754", "963", "763", "3,17"],
    fr: ["40 033", "32 279", "7 754", "963", "763", "3,17"],
  };

  for (const [lang, file] of Object.entries(files)) {
    const article = JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));

    assert.equal(article.lang, lang);
    assert.equal(article.contentStandard, "discover-2026-v1");
    assert.equal(article.articleType, "news");
    assert.equal(article.image, "/images/articles/us-national-debt-40-trillion-interest-cost-2026-editorial-v2.jpg");
    assert.equal(article.imageWidth, 1672);
    assert.equal(article.imageHeight, 941);
    assert.equal(article.sources.length, 5);
    assert.equal(article.relatedLinks.length, 4);
    assert.equal(article.body.split(ARTICLE_AD_MARKER).length - 1, 1);
    assert.match(article.body, /Debt to the Penny/);
    assert.match(article.body, /CBO/);
    assert.doesNotMatch(article.body, /contentReference|oaicite|pagead2\.googlesyndication|adsbygoogle/);

    for (const value of localizedNumbers[lang]) {
      assert.ok(article.body.includes(value), `${lang}: missing ${value}`);
    }
  }
});

test("the German article route preserves article-specific source attribution", () => {
  const route = fs.readFileSync(
    path.join(ROOT, "app", "de", "articles", "[slug]", "page.jsx"),
    "utf8"
  );

  assert.match(route, /article\.sourceNote\s*\|\|/);
  assert.match(route, /Quelle: Eurostat \(gov_10q_ggdebt\)/);
});

test("the German debt ownership analysis keeps its scope and assets explicit", () => {
  const articlePath = path.join(
    ROOT,
    "content",
    "articles",
    "de",
    "wer-haelt-deutsche-staatsschulden-2026.json"
  );
  const article = JSON.parse(fs.readFileSync(articlePath, "utf8"));

  assert.deepEqual(article.relatedCountries, ["DE"]);
  assert.equal(article.articleType, "analysis");
  assert.match(article.sourceNote, /Deutsche Finanzagentur/);
  assert.match(article.body, /Bundeswertpapiere/);
  assert.match(article.body, /Maastricht-Schuld/);
  assert.equal(article.body.split(ARTICLE_AD_MARKER).length - 1, 1);
  assert.equal(
    fs.existsSync(path.join(ROOT, "public", article.image.replace(/^\//, ""))),
    true
  );
});

test("the German live debt article distinguishes official data from its model", () => {
  const article = JSON.parse(fs.readFileSync(path.join(ROOT, "content/articles/de/Staatschuld.json"), "utf8"));
  assert.equal(article.articleType, "analysis");
  assert.deepEqual(article.relatedCountries, ["DE"]);
  assert.equal(article.image, "/images/articles/deutschland-staatsverschuldung-2026-editorial-v2.jpg");
  assert.match(article.sourceNote, /keine offizielle Echtzeitmessung/);
  assert.match(article.body, /2\.924,674 Milliarden Euro/);
  assert.match(article.body, /2\.753,5 Milliarden Euro/);
  assert.match(article.body, /lineare Extrapolation/);
  assert.match(article.body, /2\.850 Euro pro Sekunde/);
  assert.match(article.body, /Haushaltsplänen/);
  assert.match(article.body, /schulden-pro-kopf-deutschland-2026/);
  assert.match(article.body, /href='\/de\/country\/de'/);
  assert.doesNotMatch(article.body, /8\.204|6\.918|2\.726,5/);
  assert.ok(article.sources.some(s => s.url.includes("PD26_341_713")));
  assert.equal(article.body.split(ARTICLE_AD_MARKER).length - 1, 1);
});


test("the Dutch and English live debt explanations use the rising Q2 model without erasing Q1 history", () => {
  const entries = [
    ["nl", "content/articles/nl/2025/Staatschuld.json", /geen voorspelling/, /0,0 procentpunt/],
    ["en", "content/articles/en/2025/netherlands-national-debt-live-counter.json", /forecast/, /0\.0 percentage points/],
  ];
  for (const [lang, file, forecast, rounding] of entries) {
    const article = JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
    assert.equal(article.image, "/images/articles/netherlands-debt-counter-bridge-2026-v3.jpg");
    assert.equal(article.imageWidth, 1672);
    assert.equal(article.imageHeight, 941);
    assert.deepEqual(article.relatedCountries, ["NL"]);
    assert.match(article.body, /91 days|91 dagen/);
    assert.match(article.body, lang === "nl" ? /€6\.418\.000\.000/ : /€6\.418 billion/);
    assert.match(article.body, lang === "nl" ? /€6,343 miljard/ : /€6\.343 billion/);
    assert.match(article.body, forecast);
    assert.match(article.body, rounding);
    assert.doesNotMatch(article.title, /waarom de live teller daalt|Runs Backwards/);
    assert.ok(article.sources.some(s => s.url.endsWith("/2-21102026-bp")));
    assert.equal(article.body.split(ARTICLE_AD_MARKER).length - 1, 1);
  }
  assert.equal(Math.round(6_418_000_000 / (91 * 86400)), 816);
  assert.equal(Math.round(22_411_700_000 / (91 * 86400)), 2850);
  assert.equal(Math.round(59_596_300_000 / (91 * 86400)), 7580);
});


test("localized debt-per-capita articles preserve all 27 verified Q2 calculations, weights and displayed ties", () => {
  const fixture = require("./fixtures/article-review-2026-10-22.json");
  const slugs = new Set(["eu-debt-per-capita-2026-inequality-report", "eu-staatsschuld-per-inwoner-2026-analyse", "eu-pro-kopf-verschuldung-2026-analyse", "dette-publique-ue-par-habitant-2026-analyse"]);
  for (const entry of fixture.articles.filter(a => slugs.has(a.slug))) {
    const a = JSON.parse(fs.readFileSync(path.join(ROOT, entry.file), "utf8"));
    const rows = [...a.body.match(/<tbody>([\s\S]*?)<\/tbody>/)[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)];
    assert.equal(rows.length, 27);
    for (let j = 0; j < rows.length; j++) {
      const cells = [...rows[j][1].matchAll(/<td>([\s\S]*?)<\/td>/g)].map(m => m[1]);
      const expected = fixture.rows[j];
      assert.equal(Number(cells[2].replace(/[^0-9]/g, "")), expected.perPerson);
      assert.equal(Math.round(expected.debtMio * 1e6 / expected.population / 100) * 100, expected.perPerson);
      assert.ok(cells[1].includes("/country/" + expected.code.toLowerCase()));
      assert.equal(Number(cells[0]), fixture.rows.findIndex(x => x.perPerson === expected.perPerson) + 1);
    }
    assert.equal(a.datePublished, entry.datePublished);
    assert.equal(a.dateReviewed, fixture.reviewed);
    assert.ok(a.body.includes("206,73") || a.body.includes("206.73"));
    assert.ok(a.body.includes("451.990.314") || a.body.includes("451,990,314") || a.body.includes("451 990 314"));
    assert.ok(a.sources.some(s => s.url.includes("time=2026-Q2")));
    assert.ok(a.sources.some(s => s.url.includes("indic_de=JAN")));
  }
  const sum = fixture.rows.reduce((s, r) => s + r.debtMio, 0);
  const population = fixture.rows.reduce((s, r) => s + r.population, 0);
  assert.equal(Number(sum.toFixed(1)), 16157459.3);
  assert.equal(population, 451990314);
  assert.equal(Math.round(sum * 1e6 / population / 100) * 100, 35700);
  assert.equal(Number((sum - 15950729).toFixed(1)), 206730.3);
});


test("Dutch debt-per-capita update preserves search intent and distinguishes June debt from the annual tool", () => {
  const article = JSON.parse(fs.readFileSync(path.join(ROOT, "content/articles/nl/2026/eu-staatsschuld-per-inwoner-2026-analyse.json"), "utf8"));
  assert.equal(article.slug, "eu-staatsschuld-per-inwoner-2026-analyse");
  assert.equal(article.title, "EU-staatsschuld per inwoner in 2026: België, Italië en Frankrijk bovenaan");
  assert.equal(article.seoTitle, "EU-staatsschuld per inwoner 2026: alle 27 landen");
  assert.equal(article.datePublished, "2026-01-21T09:00:00+00:00");
  assert.match(article.body.slice(0, 1800), /href='\/nl\/debt-per-capita'/);
  assert.match(article.body, /href='\/nl\/debt-per-capita#per-capita-ranking-title'/);
  assert.match(article.body, /href='\/nl\/debt-per-capita#debt-per-capita-methodology'/);
  assert.match(article.body, /schuld van eind 2025/);
  assert.match(article.body, /schuld van eind juni 2026/);
  assert.match(article.body, /De bedragen kunnen dus verschillen/);
  assert.match(article.body, /zes maanden/);
  assert.match(article.body, /451,99 miljoen/);
  assert.match(article.body, /€15,95 biljoen/);
  assert.match(article.body, /€206,73 miljard/);
  assert.match(article.sourceNote, /Eigen berekening/);
  assert.match(article.body, /geen persoonlijke rekeningen/);
  assert.equal(article.relatedLinks[0].url, "https://www.eudebtmap.com/nl/debt-per-capita");
  assert.equal(article.body.split(ARTICLE_AD_MARKER).length - 1, 1);
});


test("article donut visualizations are internally consistent", () => {
  const contentRoot = path.join(ROOT, "content", "articles");
  const stack = [contentRoot];

  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const filePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(filePath);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;

      const article = JSON.parse(fs.readFileSync(filePath, "utf8"));
      for (const [key, visual] of Object.entries(article.visualizations || {})) {
        if (visual?.type !== "donut") continue;

        assert.match(key, /^[a-z0-9-]+$/, `${filePath}: invalid visualization key`);
        assert.ok(Array.isArray(visual.segments), `${filePath}: segments missing`);
        assert.ok(visual.segments.length >= 2, `${filePath}: at least two segments required`);
        assert.ok(Number.isFinite(visual.total) && visual.total > 0, `${filePath}: invalid total`);

        const segmentTotal = visual.segments.reduce((sum, segment) => {
          assert.equal(typeof segment.label, "string", `${filePath}: segment label missing`);
          assert.ok(Number.isFinite(segment.value) && segment.value > 0, `${filePath}: invalid segment`);
          return sum + segment.value;
        }, 0);

        assert.ok(
          Math.abs(segmentTotal - visual.total) < 0.001,
          `${filePath}: donut segments (${segmentTotal}) must equal total (${visual.total})`
        );
        assert.match(
          article.body || "",
          new RegExp(`<!--\\s*ARTICLE_VISUAL:${key}\\s*-->`, "i"),
          `${filePath}: visualization marker missing`
        );
      }
    }
  }
});

test("homepage article cards use isolated responsive styles and descriptive links", () => {
  const card = fs.readFileSync(
    path.join(ROOT, "components", "ArticleCard.jsx"),
    "utf8"
  );
  const styles = fs.readFileSync(
    path.join(ROOT, "components", "ArticleCard.module.css"),
    "utf8"
  );
  const homepage = fs.readFileSync(
    path.join(ROOT, "components", "LocalizedHomePage.jsx"),
    "utf8"
  );

  assert.match(card, /ArticleCard\.module\.css/);
  assert.match(card, /className=\{styles\.titleLink\}/);
  assert.match(card, /Array\.isArray\(tags\)/);
  assert.match(card, /rel="bookmark"/);
  assert.doesNotMatch(card, /Read more/);
  assert.doesNotMatch(card, /rounded-2xl|border-slate|line-clamp-3/);

  assert.match(styles, /grid-template-columns:\s*144px minmax\(0, 1fr\)/);
  assert.match(styles, /\.withoutImage/);
  assert.match(styles, /@media \(max-width: 560px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);

  assert.match(homepage, /<ul className="eu-home-articles-list">/);
  assert.match(homepage, /<ArticleCard key=\{article\.slug\} article=\{article\} \/>/);
});

test("French crisis analysis separates Dutch spillovers from automatic default", () => {
  const article = JSON.parse(fs.readFileSync(path.join(ROOT, "content", "articles", "nl", "2026", "frankrijk-schuldencrisis-gevolgen-nederland.json"), "utf8"));

  assert.equal(article.articleType, "analysis");
  assert.deepEqual(article.relatedCountries, ["FR", "NL"]);
  assert.match(article.body, /geen voorspelling dat Frankrijk failliet gaat/);
  assert.match(article.body, /4,4%/);
  assert.match(article.body, /daalde het tekort van 5,8% in 2024 naar voorlopig 5,1% in 2025/);
  assert.match(article.body, /2020 tot en met 2023/);
  assert.match(article.body, /tot 2029/);
  assert.match(article.body, /3 juni 2026/);
  assert.match(article.body, /procedure werd evenmin gesloten/);
  assert.match(article.body, /geen verklaring dat alle latere begrotingsplannen voldoen/);
  assert.match(article.body, /wederuitvoer/);
  assert.match(article.body, /geen bedrag dat bij een crisis volledig verdwijnt/);
  assert.match(article.body, /sluit inzet niet automatisch uit/);
  assert.match(article.body, /href='\/nl\/country\/fr'/);
  assert.match(article.body, /href='\/nl\/debt-to-gdp'/);
  assert.doesNotMatch(article.body, /<table\b|Veelgestelde vragen/);
  assert.equal(article.body.split(ARTICLE_AD_MARKER).length - 1, 1);
  assert.match(article.contentNotes, /menselijke lezing en goedkeuring zijn nog niet uitgevoerd/);
  const [prose, sourcesFooter] = article.body.split("<details id='article-sources'>");
  assert.doesNotMatch(prose, /href=['"]https?:\/\//);
  assert.match(sourcesFooter, /<summary>Bronnen en verantwoording<\/summary>/);
  assert.equal((sourcesFooter.match(/<li><a /g) || []).length, article.sources.length);
  for (const source of article.sources) assert.ok(sourcesFooter.includes(source.url));
  assert.match(prose, /Volgens CBS/);
  assert.match(prose, /De ECB waarschuwt/);
  assert.ok(fs.existsSync(path.join(ROOT, "public", article.image)));
});

test("France-US debt analysis keeps periods, monetary constraints and sources distinct", () => {
  const article = JSON.parse(fs.readFileSync(path.join(ROOT, "content", "articles", "fr", "2026", "dette-france-etats-unis-euro-dollar-comparaison.json"), "utf8"));
  const route = fs.readFileSync(path.join(ROOT, "app", "fr", "articles", "[slug]", "page.jsx"), "utf8");

  assert.equal(article.lang, "fr");
  assert.equal(article.articleType, "analysis");
  assert.deepEqual(article.relatedCountries, ["FR"]);
  assert.match(article.body, /Pour 2025/);
  assert.match(article.body, /115,7 %/);
  assert.match(article.body, /123,9 %/);
  assert.match(article.body, /publication d’avril 2026/);
  assert.match(article.body, /119,0 % du PIB à la fin du deuxième trimestre 2026/);
  assert.match(article.body, /conventions comptables restent différentes/);
  assert.match(article.body, /ne signifie pas partager automatiquement toutes les dettes/);
  assert.match(article.body, /n’exclut pas à elle seule/);
  assert.match(article.body, /n’achète pas directement les nouveaux titres/);
  assert.match(article.body, /3,3 % du PIB en 2026 et 4,6 % en 2036/);
  assert.match(article.body, /projections américaines/);
  assert.match(article.body, /href='\/fr\/country\/fr'/);
  assert.match(article.body, /href='\/fr\/debt-to-gdp'/);
  assert.doesNotMatch(article.body, /<table\b|Questions fréquentes/);
  assert.equal(article.body.split(ARTICLE_AD_MARKER).length - 1, 1);
  assert.match(article.contentNotes, /aucune lecture ni approbation (?:éditoriale )?humaine/);
  const [prose, footer] = article.body.split("<details id='article-sources'>");
  assert.doesNotMatch(prose, /href=['"]https?:\/\//);
  assert.match(footer, /<summary>Sources et méthode<\/summary>/);
  assert.equal((footer.match(/<li><a /g) || []).length, article.sources.length);
  for (const source of article.sources) assert.ok(footer.includes(source.url));
  assert.match(route, /article\.sourceNote\s*\|\|/);
  assert.match(route, /<figcaption>\{article\.imageCredit\}<\/figcaption>/);
  assert.ok(fs.existsSync(path.join(ROOT, "public", article.image)));
});

test("inflation-debt editions preserve fictional arithmetic, localized links and source footers", () => {
  const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "content", "article-translations.json"), "utf8"));
  const translations = registry["inflation-government-debt"];
  assert.deepEqual(Object.keys(translations).sort(), ["de", "en", "fr", "nl"]);
  assert.equal((100 / 110 * 100).toFixed(1), "90.9");
  assert.equal((1000 / 1.1).toFixed(0), "909");

  for (const [lang, slug] of Object.entries(translations)) {
    const article = JSON.parse(fs.readFileSync(path.join(ROOT, "content", "articles", lang, "2026", `${slug}.json`), "utf8"));
    const prefix = lang === "en" ? "" : `/${lang}`;
    const [prose, footer] = article.body.split("<details id='article-sources'>");
    assert.equal(article.lang, lang);
    assert.equal(article.articleType, "analysis");
    assert.match(prose, lang === "en" ? /90\.9%/ : /90,9\s*%/);
    assert.match(prose, /909/);
    assert.match(prose, /110/);
    assert.ok(prose.includes(`href='${prefix}/inflation'`));
    assert.ok(prose.includes(`href='${prefix}/debt-to-gdp'`));
    assert.doesNotMatch(prose, /href=['"]https?:\/\//);
    assert.doesNotMatch(prose, /<table\b/);
    assert.equal(article.body.split(ARTICLE_AD_MARKER).length - 1, 1);
    assert.equal((footer.match(/<li><a /g) || []).length, article.sources.length);
    for (const source of article.sources) {
      assert.equal(source.accessed, "2026-10-11");
      assert.ok(footer.includes(source.url));
    }
    assert.match(article.contentNotes, /no independent human or native-language review claimed/);
    assert.ok(fs.existsSync(path.join(ROOT, "public", article.image)));
    const metadata = buildArticleMetadata({article,translations:Object.entries(translations).map(([lang,slug])=>({lang,slug})),slug,lang,ogImage:`https://www.eudebtmap.com${article.image}`});
    assert.equal(metadata.alternates.canonical, `https://www.eudebtmap.com${prefix}/articles/${slug}`);
    for (const [targetLang,targetSlug] of Object.entries(translations)) {
      const targetPrefix = targetLang === "en" ? "" : `/${targetLang}`;
      assert.equal(metadata.alternates.languages[targetLang], `https://www.eudebtmap.com${targetPrefix}/articles/${targetSlug}`);
    }
  }
});

test("inflation-debt country adaptations distinguish observed examples and indexed liabilities", () => {
  const slugs = JSON.parse(fs.readFileSync(path.join(ROOT, "content", "article-translations.json"), "utf8"))["inflation-government-debt"];
  const articles = Object.fromEntries(Object.entries(slugs).map(([lang,slug])=>[lang,JSON.parse(fs.readFileSync(path.join(ROOT, "content", "articles", lang, "2026", `${slug}.json`), "utf8"))]));
  assert.match(articles.nl.body, /CBS-publicatie van 26 maart 2026/);
  assert.match(articles.nl.body, /eerste, voorlopige cijfers/);
  assert.match(articles.nl.body, /niet de nieuwste kwartaalstand/);
  assert.match(articles.fr.body, /OATi et OAT€i/);
  assert.match(articles.fr.body, /ne concerne pas toute la dette française/);
  assert.match(articles.de.body, /seit 2024 keine neuen/);
  assert.match(articles.de.body, /bleiben aber im Umlauf/);
  assert.match(articles.en.body, /not a model of the European economy/);
  assert.deepEqual(articles.nl.relatedCountries, ["NL"]);
  assert.deepEqual(articles.fr.relatedCountries, ["FR"]);
  assert.deepEqual(articles.de.relatedCountries, ["DE"]);
  assert.deepEqual(articles.en.relatedCountries, []);
});

test("priority article revisions preserve published identities and expose their reviewed sources", () => {
  const fixtures = [
    ["nl/2026/prinsjesdag-2026-begroting-2027-gevolgen.json", "prinsjesdag-2026-begroting-2027-gevolgen", "2026-08-18T09:17:21+02:00", "prinsjesdag-2026-begroting-nederland-editorial-v2.jpg"],
    ["nl/2026/prinsjesdagstukken-2026-gelekt-begroting-2027.json", "prinsjesdagstukken-2026-gelekt-begroting-2027", "2026-09-02T15:06:59+02:00", "prinsjesdagstukken-2026-gelekt-begroting-2027-editorial-v2.jpg"],
    ["fr/prix-carburant.json", "prix-carburant-france-plus-les-moyens-de-tout-compenser", "2026-04-07T18:00:00+00:00", "france-fuel-support-2026-editorial-v2.jpg"],
    ["en/2026/Eu-debt-april.json", "eu-debt-update-ratio-fell-but-total-still-rose", "2026-04-22T19:30:00+00:00", "eu-debt-update-ratio-total-2026-editorial-v2.jpg"],
  ];
  for (const [file, slug, published, image] of fixtures) {
    const article = JSON.parse(fs.readFileSync(path.join(ROOT, "content/articles", file), "utf8"));
    assert.equal(article.slug, slug);
    assert.equal(article.datePublished, published);
    assert.equal(article.image, `/images/articles/${image}`);
    assert.equal(article.dateReviewed, "2026-10-16");
    assert.equal(article.dateModified, "2026-10-16");
    const [prose, footer] = article.body.split("<details id='article-sources'>");
    assert.ok(footer, `${slug} must render sources, not only store metadata`);
    assert.equal((footer.match(/<li><a /g) || []).length, article.sources.length);
    for (const source of article.sources) {
      assert.equal(source.accessed, "2026-10-16");
      assert.ok(footer.includes(source.url));
    }
    const inlineExternal = [...prose.matchAll(/href='(https?:[^']+)'/g)].map(match => match[1]);
    assert.deepEqual(inlineExternal, article.lang === "fr"
      ? ["https://www.impots.gouv.fr/simulateur-aide-carburant-grands-rouleurs"] : []);
    assert.equal((prose.match(/<!-- MID_ARTICLE_AD -->/g) || []).length, 1);
    assert.doesNotMatch(article.body, /<table\b|<script\b/i);
    assert.match(article.contentNotes, /no independent human or native-language review claimed/);
  }
});

test("budget follow-up, fuel-aid extension and historical debt revisions keep their boundaries", () => {
  const read = file => JSON.parse(fs.readFileSync(path.join(ROOT, "content/articles", file), "utf8"));
  const process = read("nl/2026/prinsjesdag-2026-begroting-2027-gevolgen.json");
  const followUp = read("nl/2026/prinsjesdagstukken-2026-gelekt-begroting-2027.json");
  for (const article of [process, followUp]) {
    assert.match(article.body, /€36,7 miljard/);
    assert.match(article.body, /€599,6 miljard/);
    assert.match(article.body, /46,9%/);
    assert.match(article.body, /raming/);
    assert.doesNotMatch(article.body, /Op 15 september vervangen we|verschijnen op 15 september/);
  }
  assert.match(followUp.body, /€612,4 miljard/);
  assert.match(followUp.body, /€12,8 miljard/);
  assert.match(followUp.body, /1,1 procentpunt/);
  assert.match(followUp.body, /geen controle van iedere afzonderlijke gelekte maatregel/);
  assert.equal(Number((612.4 - 599.6).toFixed(1)), 12.8);

  const fuel = read("fr/prix-carburant.json");
  assert.match(fuel.body, /octobre à décembre 2026/);
  assert.match(fuel.body, /5,5 millions/);
  assert.match(fuel.body, /automatiquement à partir du 16 octobre/);
  assert.match(fuel.body, /27 octobre/);
  assert.match(fuel.body, /22 770 euros par part/);
  assert.match(fuel.body, /pas doublé/);
  assert.match(fuel.contentNotes, /Inline external exception/);

  const history = read("en/2026/Eu-debt-april.json");
  assert.equal(history.author.name, "Simeon");
  assert.match(history.body, /historical release comparison, not today’s debt update/);
  assert.match(history.body, /revised the Q4 2025 EU ratio to 81.8%/);
  assert.match(history.body, /82.9% for Q1 2026/);
  assert.doesNotMatch(history.body, /France currently shows|fastest-growing live estimate/);
  assert.equal(Number((206 / 260 * 100).toFixed(1)), 79.2);
});

test("October debt checkpoint drafts preserve vintage boundaries and local source footers", () => {
  const fixtures = [
    ["nl", "nederland-begrotingstekort-staatsschuld-gelijk-kasbuffer", /fictief en sterk vereenvoudigd voorbeeld/, /€524 miljard/],
    ["fr", "deficit-baisse-dette-augmente-budget-france", /Ce ne sont pas des prévisions pour la France/, /5,0 %/],
    ["de", "investitionsuhr-neue-schulden-infrastruktur-erfolg", /historische Vergleichsbasis, kein aktueller Oktoberstand/, /64,4 %/],
    ["en", "greece-france-debt-ratio-level-versus-direction", /same provisional Q1 2026 Eurostat release/, /143\.5%/],
  ];
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "content/article-publication-manifest.json"), "utf8"));
  const translations = JSON.parse(fs.readFileSync(path.join(ROOT, "content/article-translations.json"), "utf8"));
  const images = new Set();
  for (const [lang, slug, boundary, figure] of fixtures) {
    const article = JSON.parse(fs.readFileSync(path.join(ROOT, "content/articles", lang, "2026", slug + ".json"), "utf8"));
    const prefix = lang === "en" ? "" : "/" + lang;
    const [prose, footer] = article.body.split("<details id='article-sources'>");
    assert.match(article.body + article.sourceNote, boundary);
    assert.match(prose, figure);
    assert.match(article.contentNotes, /no independent human or native-language review claimed/);
    assert.match(article.contentNotes, /20 October 2026 source cutoff/);
    assert.equal(article.dateReviewed, "2026-10-20");
    assert.ok(manifest.articles.includes(prefix + "/articles/" + slug));
    assert.ok(prose.includes("href='" + prefix + "/debt-to-gdp'"));
    assert.ok(footer.includes(prefix + "/methodology"));
    assert.doesNotMatch(prose, /href=['"]https?:\/\//);
    assert.doesNotMatch(article.body, /<table\b|<script\b/i);
    assert.equal((prose.match(/<!-- MID_ARTICLE_AD -->/g) || []).length, 1);
    assert.equal((footer.match(/<li><a /g) || []).length, article.sources.length);
    for (const source of article.sources) {
      assert.equal(source.accessed, "2026-10-20");
      assert.ok(footer.includes(source.url));
    }
    assert.equal(article.imageWidth, 1672);
    assert.equal(article.imageHeight, 941);
    assert.ok(fs.existsSync(path.join(ROOT, "public", article.image)));
    images.add(article.image);
    assert.ok(!Object.values(translations).some(group => Object.values(group).includes(slug)), "different reader questions must not be marked as translations");
  }
  assert.equal(images.size, 4);
  assert.equal(Number((125 / 105 * 100).toFixed(1)), 119.0);
  assert.equal(Number((152.9 - 143.5).toFixed(1)), 9.4);
  assert.equal(Number((117.6 - 113.6).toFixed(1)), 4.0);
});

test("French unrest opinion translations retain the hypothetical rate calculation and its limits", () => {
  const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "content/article-translations.json"), "utf8"));
  const editions = registry["france-unrest-budget-trust"];
  assert.deepEqual(Object.keys(editions).sort(), ["de", "en", "fr", "nl"]);
  const deltaPercentagePoints = Number((4.853 - 4.794).toFixed(3));
  assert.equal(deltaPercentagePoints, 0.059);
  assert.equal(Number((deltaPercentagePoints * 100).toFixed(1)), 5.9);
  assert.equal(Math.round(10_000_000_000 * deltaPercentagePoints / 100), 5_900_000);
  const labels = { nl: /^Opinie:/, fr: /^Opinion :/, de: /^Meinung:/, en: /^Opinion:/ };
  const fiction = { nl: /fictieve nieuwe/, fr: /emprunt fictif/, de: /fiktiven neuen Kredit/, en: /fictional new/ };
  const openings = { nl: 'Na de plunderingen van afgelopen weekend', fr: 'Après les pillages du week-end dernier', de: 'Nach den Plünderungen vom vergangenen Wochenende', en: 'After last weekend’s looting' };
  const images = new Set();
  for (const [lang, slug] of Object.entries(editions)) {
    const article = JSON.parse(fs.readFileSync(path.join(ROOT, "content/articles", lang, "2026", slug + ".json"), "utf8"));
    const prefix = lang === "en" ? "" : "/" + lang;
    const [prose, footer] = article.body.split("<details id='article-sources'>");
    assert.equal(article.articleType, "opinion");
    assert.match(article.title, labels[lang]);
    assert.match(prose, fiction[lang]);
    assert.ok(prose.startsWith("<p class='article-intro'>" + openings[lang]));
    assert.match(prose, lang === "en" ? /4\.794%/ : /4,794\s*%/);
    assert.match(prose, lang === "en" ? /4\.853%/ : /4,853\s*%/);
    assert.match(prose, lang === "en" ? /0\.00059/ : /0,00059/);
    assert.match(prose, lang === "en" ? /5\.9 million/ : /5,9 (miljoen|millions|Millionen)/);
    assert.match(article.contentNotes, /not a causal estimate of riot costs/);
    assert.match(article.contentNotes, /never an application to total debt/);
    assert.match(article.contentNotes, /no independent human or native-language review claimed/);
    assert.deepEqual(article.relatedCountries, ["FR"]);
    assert.ok(prose.includes("href='" + prefix + "/country/fr'"));
    assert.ok(prose.includes("href='" + prefix + "/interest-cost'"));
    assert.doesNotMatch(prose, /href=['"]https?:\/\//);
    assert.doesNotMatch(article.body, /<table\b|<script\b/i);
    assert.equal((prose.match(/<!-- MID_ARTICLE_AD -->/g) || []).length, 1);
    assert.ok(footer);
    assert.equal((footer.match(/<li><a /g) || []).length, article.sources.length);
    for (const source of article.sources) {
      assert.equal(source.accessed, "2026-10-20");
      assert.ok(footer.includes(source.url));
    }
    const metadata = buildArticleMetadata({article,translations:Object.entries(editions).map(([lang,slug])=>({lang,slug})),slug,lang,ogImage:"https://www.eudebtmap.com" + article.image});
    assert.equal(metadata.alternates.canonical, "https://www.eudebtmap.com" + prefix + "/articles/" + slug);
    for (const [targetLang, targetSlug] of Object.entries(editions)) {
      assert.equal(metadata.alternates.languages[targetLang], "https://www.eudebtmap.com" + (targetLang === "en" ? "" : "/" + targetLang) + "/articles/" + targetSlug);
    }
    images.add(article.image);
  }
  assert.equal(images.size, 1, "equivalent translations share the same representative illustration");
});

test("article recommendations localize their supporting text", () => {
  const rail = fs.readFileSync(
    path.join(ROOT, "components", "ArticleRail.jsx"),
    "utf8"
  );

  assert.match(rail, /nl: "Analyses en data die je mogelijk hebt gemist"/);
  assert.match(rail, /de: "Analysen und Daten, die Sie vielleicht verpasst haben"/);
  assert.match(rail, /fr: "Analyses et données que vous avez peut-être manquées"/);
  assert.match(rail, /RAIL_SUBTITLES\[lang\] \|\| RAIL_SUBTITLES\.en/);
  assert.match(rail, /<p className="rail-subtitle">\{subtitle\}<\/p>/);
});

test("the 21 reviewed articles retain their published identities and disclose the actual update process", () => {
  const fixture = require("./fixtures/article-review-2026-10-22.json");
  assert.equal(fixture.articles.length, 21);
  for (const entry of fixture.articles) {
    const a = JSON.parse(fs.readFileSync(path.join(ROOT, entry.file), "utf8"));
    const prefix = entry.lang === "en" ? "" : "/" + entry.lang;
    const [prose, footer] = a.body.split("<details id='article-sources'>");
    assert.equal(a.slug, entry.slug);
    assert.equal(a.lang, entry.lang);
    assert.equal(a.datePublished, entry.datePublished);
    assert.deepEqual(a.author, entry.author);
    assert.equal(a.dateModified, fixture.reviewed);
    assert.equal(a.dateReviewed, fixture.reviewed);
    assert.equal(a.reviewedBy.name, "EU Debt Map Research");
    assert.match(a.contentNotes, /no independent human or native-language review claimed/);
    assert.ok(footer);
    assert.ok(footer.includes(prefix + "/methodology"));
    assert.doesNotMatch(prose, /href=['"]https?:\/\//);
    assert.doesNotMatch(a.body, /<script\b|contentReference|oaicite/);
    assert.equal(a.body.split(ARTICLE_AD_MARKER).length - 1, 1);
    assert.ok(a.sources.length >= 2);
    assert.equal((footer.match(/<li><a /g) || []).length, a.sources.length);
    for (const s of a.sources) {
      assert.equal(s.accessed, fixture.reviewed);
      assert.ok(footer.includes(s.url));
    }
    const canonical = "https://www.eudebtmap.com" + prefix + "/articles/" + entry.slug;
    const metadata = buildArticleMetadata({article:a,translations:[],slug:entry.slug,lang:entry.lang});
    assert.equal(metadata.alternates.canonical, canonical);
  }
});

test("inflation opinion revisions use the full September release and reproduce their cumulative approximations", () => {
  const f = require("./fixtures/article-review-2026-10-22.json");
  const slugs = {
    nl: ["NL", "inflatie-nederland-10-jaar-prijzen-sinds-corona", "3,0%", "33,3%", "40,7%"],
    de: ["DE", "inflation-deutschland-fast-normal-angst-bleibt", "3,3 Prozent", "30,0 Prozent", "35,5 Prozent"],
    fr: ["FR", "inflation-france-prix-peur-apres-crise", "3,4 %", "22,4 %", "28,1 %"],
  };
  const expected = {NL:[33.3,40.7],DE:[30.0,35.5],FR:[22.4,28.1]};
  for (const [lang,[code,slug,rate,covid,tenYear]] of Object.entries(slugs)) {
    const entry = f.articles.find(a => a.lang === lang && a.slug === slug);
    const a = JSON.parse(fs.readFileSync(path.join(ROOT, entry.file), "utf8"));
    assert.equal(a.articleType, "opinion");
    for (const value of [rate,covid,tenYear]) assert.ok(a.body.includes(value), lang + ": " + value);
    assert.ok(a.sources.some(s => s.url.endsWith("/2-16102026-ap")));
    assert.ok(a.body.includes("country=" + code.toLowerCase()));
    assert.doesNotMatch(a.title, /crisis is voorbij|krise ist vorbei|crise est terminée/i);
    assert.doesNotMatch(a.body, /septemberpublicatie wordt op 16 oktober verwacht|jüngste vollständige.*August|Août 2026 est le mois le plus récent/);
    const cumulative = start => Number(((f.inflation[code].monthly.slice(f.inflationPeriods.indexOf(start)+1).reduce((x,r)=>x*(1+r/100),1)-1)*100).toFixed(1));
    assert.deepEqual([cumulative("2020-02"),cumulative("2016-09")], expected[code]);
  }
});

test("the Dutch ten-year chart follows all 121 checked annual points through September", () => {
  const f = require("./fixtures/article-review-2026-10-22.json");
  const svg = fs.readFileSync(path.join(ROOT,"public/images/articles/inflatie-nederland-10-jaar-grafiek.svg"),"utf8");
  assert.match(svg, /september 2016 tot september 2026/);
  assert.match(svg, /3,0 procent/);
  assert.match(svg, /3,8 procent/);
  const start = f.inflationPeriods.indexOf("2016-09");
  for (const [code,color] of [["NL","#276ac4"],["EA","#b56729"]]) {
    const values = f.inflation[code].annual.slice(start);
    assert.equal(values.length,121);
    const expected = values.map((v,k)=>(k?"L":"M")+(100+k*1040/(values.length-1)).toFixed(1)+" "+(462-v*19.6).toFixed(1)).join(" ");
    assert.ok(svg.includes('d="'+expected+'" fill="none" stroke="'+color+'"'),code+" chart path must match source points");
  }
});

test("German municipal analysis separates cash figures, investment support and recurring financing", () => {
  const a = JSON.parse(fs.readFileSync(path.join(ROOT, "content/articles/de/2026/kommunen-investitionsmilliarden-haushaltskrise.json"), "utf8"));
  assert.equal(a.articleType, "analysis");
  assert.equal(a.lang, "de");
  assert.equal(a.dateReviewed, "2026-10-24");
  assert.equal(Number((204.1 - 184).toFixed(1)), 20.1);
  for (const value of ["20,1", "204,1", "184,0", "21,7", "8,7", "5,7", "100 Milliarden", "2042"]) assert.ok(a.body.includes(value), value);
  assert.match(a.body, /ohne die Stadtstaaten/);
  assert.match(a.body, /höhere Zuweisungen das kommunale Defizit 2026 senken/);
  assert.match(a.body, /weder um 100 Milliarden pro Jahr/);
  assert.match(a.body, /vorgesehene eigene Mittel entlastet/);
  assert.match(a.body, /nicht verankert.*tatsächlich zusätzliche Investitionen/);
  assert.match(a.body, /ersetzt aber keine Rechnung für die eigene Stadt/);
  assert.match(a.body, /href='\/de\/government-spending'/);
  assert.match(a.body, /href='\/de\/country\/de'/);
  assert.doesNotMatch(a.body, /<table\b/);
  assert.ok(a.sources.some(s => s.url.includes("PD26_349_71137")));
  assert.ok(a.sources.some(s => s.url.includes("monatsbericht-oktober-2026")));
});

test("French spread explainer uses matched months and limits its illustrative interest calculation", () => {
  const a = JSON.parse(fs.readFileSync(path.join(ROOT, "content/articles/fr/2026/france-allemagne-ecart-taux-emprunt-euro.json"), "utf8"));
  const monthly = { august: { fr: 4, de: 3.185 }, september: { fr: 4.44, de: 3.473 } };
  const gap = pair => Number(((pair.fr - pair.de) * 100).toFixed(1));
  assert.equal(gap(monthly.august), 81.5);
  assert.equal(gap(monthly.september), 96.7);
  assert.equal(Number((gap(monthly.september) - gap(monthly.august)).toFixed(1)), 15.2);
  assert.equal(Math.round(1e9 * (monthly.september.fr - monthly.september.de) / 100), 9670000);
  assert.equal(a.articleType, "explainer");
  assert.equal(a.lang, "fr");
  for (const value of ["4,44", "3,47", "96,7", "81,5", "15,2", "9,67", "23 octobre 2026", "5,05", "119,1", "63,4"]) assert.ok(a.body.includes(value), value);
  assert.match(a.body, /ne s’agit pas du spread du 24 octobre/);
  assert.match(a.body, /deux dates et deux constructions statistiques/);
  assert.match(a.body, /emprunt fictif d’un milliard d’euros/);
  assert.match(a.body, /émis au pair à taux fixe/);
  assert.match(a.body, /donc vendu à sa valeur nominale/);
  assert.match(a.body, /spread OAT–Bund/);
  assert.match(a.body, /les OAT sont les obligations assimilables du Trésor français/);
  assert.match(a.body, /taux de référence à dix ans/);
  assert.match(a.body, /pas le coût d’une émission réellement réalisée/);
  assert.match(a.body, /facture de toute la dette française ni son cumul réel sur dix ans/);
  assert.match(a.body, /pas un taux obligataire en direct/);
  for (const href of ["/fr/country/fr", "/fr/debt-to-gdp", "/fr/interest-cost"]) assert.ok(a.body.includes("href='" + href + "'"));
  assert.ok(a.sources.some(s => s.url.includes("IRS/M.FR+DE")));
  assert.ok(a.sources.some(s => s.url.includes("irt_lt_mcby_m")));
  assert.doesNotMatch(a.body, /<table\b/);
});

test("the two October country drafts preserve source visibility and do not invent translations", () => {
  const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "content/article-translations.json"), "utf8"));
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "content/article-publication-manifest.json"), "utf8"));
  for (const [lang, slug] of [["de", "kommunen-investitionsmilliarden-haushaltskrise"], ["fr", "france-allemagne-ecart-taux-emprunt-euro"]]) {
    const a = JSON.parse(fs.readFileSync(path.join(ROOT, `content/articles/${lang}/2026/${slug}.json`), "utf8"));
    assert.ok(manifest.articles.includes(`/${lang}/articles/${slug}`));
    assert.ok(!Object.values(registry).some(group => Object.values(group).includes(slug)));
    const [prose, footer] = a.body.split("<details id='article-sources'>");
    assert.doesNotMatch(prose, /href=['"]https?:\/\//);
    assert.ok(footer && footer.includes("/" + lang + "/methodology"));
    assert.equal(a.body.split(ARTICLE_AD_MARKER).length - 1, 1);
    for (const source of a.sources) {
      assert.equal(source.accessed, "2026-10-24");
      assert.ok(footer.includes(source.url));
    }
    assert.match(a.contentNotes, /fully drafted with AI assistance/);
    assert.match(a.contentNotes, /no independent human or native-language review claimed/);
    assert.equal(a.imageWidth, 1672);
    assert.equal(a.imageHeight, 941);
  }
});

test("French counter and Greek comparison retain same-vintage data and financing-scope limits", () => {
  const f=require("./fixtures/article-review-2026-10-22.json");
  const entries=f.articles.filter(a=>["franse-staatsschuld-live-teller-record","dette-publique-france-compteur-live-record"].includes(a.slug));
  for(const entry of entries){
    const a=JSON.parse(fs.readFileSync(path.join(ROOT,entry.file),"utf8"));
    assert.match(a.body,/119,0\s*%/);
    assert.match(a.body,/119,1\s*%/);
    assert.match(a.body,/117,7\s*%/);
    assert.match(a.body,/7[ .]580/);
    assert.ok(a.sources.some(s=>s.url==="https://www.insee.fr/fr/statistiques/9053525"));
    if(entry.lang==="fr") assert.equal(a.articleType,"explainer");
  }
  const gr=JSON.parse(fs.readFileSync(path.join(ROOT,"content/articles/nl/2026/staatsschuld-griekenland-2026-frankrijk-vergelijking.json"),"utf8"));
  for(const v of ["140,8%","143,5%","152,0%","119,1%","115,4%","11,2","3,7","2034","2060","2070"])assert.ok(gr.body.includes(v),v);
  assert.match(gr.sourceNote,/niet voor de hele Griekse portefeuille/);
  assert.match(gr.body,/href='\/nl\/country\/gr'/);
  assert.match(gr.body,/href='\/nl\/country\/fr'/);
  assert.doesNotMatch(gr.body,/<table\b/);
});
