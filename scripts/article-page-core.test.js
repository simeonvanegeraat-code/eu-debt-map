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
  const files = {
    en: "content/articles/en/2025/eurozone-hidden-debt-timebomb-extended.json",
    nl: "content/articles/nl/2025/eurozone-hidden-debt-timebomb-extended.json",
    de: "content/articles/de/eurozone-hidden-debt-timebomb-extended.json",
    fr: "content/articles/fr/eurozone-hidden-debt-timebomb-extended.json",
  };
  const expectedNumbers = [
    "88.9", "87.7", "82.9", "143.5", "138.9", "117.6", "109.1",
    "101.6", "43.8", "64.4",
  ];

  for (const [lang, file] of Object.entries(files)) {
    const article = JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
    const normalizedBody = article.body.replace(/,/g, ".");

    assert.equal(article.lang, lang);
    assert.equal(article.contentStandard, "discover-2026-v1");
    assert.equal(article.image, "/images/articles/eurozone-debt-risks-2026-editorial-v2.jpg");
    assert.equal(article.imageWidth, 1672);
    assert.equal(article.imageHeight, 941);
    assert.equal(article.sources.length, lang === "nl" ? 3 : 5);
    assert.deepEqual(article.relatedCountries, ["GR", "IT", "FR", "BE", "ES", "DE", "NL"]);
    assert.doesNotMatch(article.body, /contentReference|oaicite/);
    if (lang === "nl") {
      assert.doesNotMatch(article.body, /<table/);
      assert.match(article.body, /september 2026/);
      assert.match(normalizedBody, /1\.4% in 2027/);
      assert.match(article.body, /21 oktober 2026/);
      assert.ok(article.sources.some((source) => source.url === "https://www.ecb.europa.eu/mopo/devel/ecana/html/table.sr.html"));
    } else {
      assert.match(article.body, /<caption>/);
      assert.match(article.body, /scope='col'/);
      assert.match(normalizedBody, /85\.3/);
    }

    for (const value of expectedNumbers) {
      assert.match(normalizedBody, new RegExp(value.replace(".", "\\.")), `${lang}: ${value}`);
    }
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
  const articlePath = path.join(
    ROOT,
    "content",
    "articles",
    "de",
    "Staatschuld.json"
  );
  const article = JSON.parse(fs.readFileSync(articlePath, "utf8"));

  assert.equal(article.contentStandard, "discover-2026-v1");
  assert.equal(article.articleType, "analysis");
  assert.deepEqual(article.relatedCountries, ["DE"]);
  assert.equal(article.image, "/images/articles/deutschland-staatsverschuldung-2026-editorial-v2.jpg");
  assert.equal(article.imageWidth, 1672);
  assert.equal(article.imageHeight, 941);
  assert.equal(article.sources.length, 6);
  assert.equal(article.relatedLinks.length, 4);
  assert.equal(article.body.split(ARTICLE_AD_MARKER).length - 1, 1);
  assert.match(article.sourceNote, /keine offizielle Echtzeitmessung/);
  assert.match(article.body, /2\.902,035 Milliarden Euro/);
  assert.match(article.body, /2\.726,5 Milliarden Euro/);
  assert.match(article.body, /lineare Extrapolation/);
  assert.match(article.body, /8\.204 Euro pro Sekunde/);
  assert.match(article.body, /6\.918 Euro neuer Schulden pro Sekunde/);
  assert.match(article.body, /geplante Nettokreditaufnahme/);
  assert.match(article.body, /schulden-pro-kopf-deutschland-2026/);
  assert.match(article.body, /href='\/de\/country\/de'/);
  assert.equal(
    fs.existsSync(path.join(ROOT, "public", article.image.replace(/^\//, ""))),
    true
  );
});

test("the Dutch live debt article explains the falling model without calling it a forecast", () => {
  const articlePath = path.join(
    ROOT,
    "content",
    "articles",
    "nl",
    "2025",
    "Staatschuld.json"
  );
  const article = JSON.parse(fs.readFileSync(articlePath, "utf8"));

  assert.equal(article.contentStandard, "discover-2026-v1");
  assert.equal(article.articleType, "analysis");
  assert.deepEqual(article.relatedCountries, ["NL"]);
  assert.equal(article.image, "/images/articles/nederland-staatsschuld-2026-editorial-v2.jpg");
  assert.equal(article.imageWidth, 1672);
  assert.equal(article.imageHeight, 941);
  assert.equal(article.sources.length, 5);
  assert.equal(article.relatedLinks.length, 3);
  assert.equal(article.body.split(ARTICLE_AD_MARKER).length - 1, 1);
  assert.match(article.sourceNote, /geen officiële realtime meting/);
  assert.match(article.body, /€517,377 miljard/);
  assert.match(article.body, /€6,343 miljard/);
  assert.match(article.body, /−€815,72 per seconde/);
  assert.match(article.body, /46,9% eind 2026/);
  assert.match(article.body, /geen voorspelling voor heel 2026/);
  assert.match(article.body, /href='\/nl\/country\/nl'/);
  assert.equal(
    fs.existsSync(path.join(ROOT, "public", article.image.replace(/^\//, ""))),
    true
  );
});

test("localized 2026 debt-per-capita articles use identical country data and explicit consolidation context", () => {
  const articleFiles = {
    en: "content/articles/en/2026/eu-debt-per-capita-2026-inequality-report.json",
    de: "content/articles/de/eu-pro-kopf-verschuldung-2026-analyse.json",
    fr: "content/articles/fr/dette-publique-ue-par-habitant-2026-analyse.json",
  };

  function tableAmounts(body) {
    const tableBody = body.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1] || "";
    return [...tableBody.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((row) => {
      const cells = [...row[1].matchAll(/<td>([\s\S]*?)<\/td>/g)];
      return Number(cells.at(-1)?.[1].replace(/[^0-9]/g, ""));
    });
  }

  const articles = Object.fromEntries(
    Object.entries(articleFiles).map(([lang, file]) => [
      lang,
      JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8")),
    ])
  );
  const expectedAmounts = tableAmounts(articles.en.body);

  assert.equal(expectedAmounts.length, 27);
  for (const lang of ["de", "fr"]) {
    const article = articles[lang];
    assert.equal(article.contentStandard, "discover-2026-v1");
    assert.equal(article.lang, lang);
    assert.equal(article.image, "/images/articles/eu-debt-per-capita-2026-editorial-v3.jpg");
    assert.equal(article.imageWidth, 1672);
    assert.equal(article.imageHeight, 941);
    assert.equal(article.sources.length, 3);
    assert.equal(article.relatedLinks.length, 3);
    assert.equal(article.body.split(ARTICLE_AD_MARKER).length - 1, 1);
    assert.deepEqual(tableAmounts(article.body), expectedAmounts);
    assert.match(article.body, /15[,.]91/);
    assert.match(article.body, /15[,.]704/);
    assert.match(article.body, /209[,.]247/);
    assert.doesNotMatch(article.body, /pagead2\.googlesyndication|adsbygoogle/);
  }
});

test("Dutch debt-per-capita update preserves search intent and explains the annual comparison link", () => {
  const article = JSON.parse(fs.readFileSync(path.join(ROOT,
    "content/articles/nl/2026/eu-staatsschuld-per-inwoner-2026-analyse.json"), "utf8"));
  const baseline = JSON.parse(fs.readFileSync(path.join(ROOT,
    "content/articles/en/2026/eu-debt-per-capita-2026-inequality-report.json"), "utf8"));
  const amounts = (body) => [...body.matchAll(/<tr><td>\d+<\/td><td>[\s\S]*?<\/td><td>([\s\S]*?)<\/td><\/tr>/g)]
    .map((match) => Number(match[1].replace(/[^0-9]/g, "")));
  assert.equal(article.slug, "eu-staatsschuld-per-inwoner-2026-analyse");
  assert.equal(article.title, "EU-staatsschuld per inwoner in 2026: België, Italië en Frankrijk bovenaan");
  assert.equal(article.seoTitle, "EU-staatsschuld per inwoner 2026: alle 27 landen");
  assert.equal(article.datePublished, "2026-01-21T09:00:00+00:00");
  assert.equal(amounts(article.body).length, 27);
  assert.deepEqual(amounts(article.body), amounts(baseline.body));
  assert.match(article.body.slice(0, 1600), /href='\/nl\/debt-per-capita'/);
  assert.match(article.body, /href='\/nl\/debt-per-capita#per-capita-ranking-title'/);
  assert.match(article.body, /href='\/nl\/debt-per-capita#debt-per-capita-methodology'/);
  assert.match(article.body, /schuld van eind 2025/);
  assert.match(article.body, /schuld van eind maart 2026/);
  assert.match(article.body, /De bedragen kunnen dus verschillen/);
  assert.match(article.body, /451,99 miljoen/);
  assert.match(article.body, /€15,70 biljoen/);
  assert.match(article.body, /€209,25 miljard/);
  assert.match(article.sourceNote, /Eigen berekening/);
  assert.match(article.body, /geen rekening voor iedere inwoner/);
  assert.doesNotMatch(article.summary, /Eurostat zet/);
  assert.equal(article.relatedLinks[0].url, "https://www.eudebtmap.com/nl/debt-per-capita");
  assert.equal(article.body.split(ARTICLE_AD_MARKER).length - 1, 1);
  assert.equal(article.sources.some((source) => source.url.includes("gov_10q_ggdebt?")), true);
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
