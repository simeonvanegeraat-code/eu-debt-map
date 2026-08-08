#!/usr/bin/env node
/**
 * Usage: npm run new:article -- <lang> <year> <slug> [title]
 * Creates a modern article draft in content/articles/<lang>/<year>.
 */
const fs = require("node:fs");
const path = require("node:path");

const SITE = "https://www.eudebtmap.com";
const SUPPORTED_LANGUAGES = new Set(["en", "nl", "de", "fr"]);
const ARTICLE_STANDARD = "discover-2026-v1";

const COPY = {
  en: {
    liveMap: "Live EU debt map",
    ranking: "Debt-to-GDP ranking",
    methodology: "Methodology",
    intro: "Write a concise, factual introduction that answers the main question.",
    takeaways: "Key takeaways",
    continue: "Continue the analysis",
  },
  nl: {
    liveMap: "Live EU-schuldenkaart",
    ranking: "Ranglijst schuld ten opzichte van het bbp",
    methodology: "Methodologie",
    intro: "Schrijf een korte, feitelijke inleiding die de hoofdvraag beantwoordt.",
    takeaways: "Belangrijkste punten",
    continue: "Vervolg van de analyse",
  },
  de: {
    liveMap: "Live-EU-Schuldenkarte",
    ranking: "Rangliste Schuldenquote",
    methodology: "Methodik",
    intro: "Schreibe eine kurze, sachliche Einleitung, die die Hauptfrage beantwortet.",
    takeaways: "Die wichtigsten Punkte",
    continue: "Fortsetzung der Analyse",
  },
  fr: {
    liveMap: "Carte en direct de la dette de l'UE",
    ranking: "Classement dette-PIB",
    methodology: "Méthodologie",
    intro: "Rédigez une introduction courte et factuelle qui répond à la question principale.",
    takeaways: "Points clés",
    continue: "Suite de l'analyse",
  },
};

function localizedPath(lang, pathname = "") {
  const prefix = lang === "en" ? "" : `/${lang}`;
  if (pathname === "/") return prefix || "/";
  return `${prefix}${pathname}` || "/";
}

function titleFromSlug(slug) {
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function validateArguments({ lang, year, slug }) {
  if (!SUPPORTED_LANGUAGES.has(lang)) {
    throw new Error(`Unsupported language "${lang}". Use en, nl, de or fr.`);
  }
  if (!/^20\d{2}$/.test(String(year))) {
    throw new Error(`Invalid year "${year}". Use a four-digit year such as 2026.`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      `Invalid slug "${slug}". Use lowercase letters, numbers and hyphens only.`
    );
  }
}

function buildArticleDraft({ lang, year, slug, title, now = new Date() }) {
  validateArguments({ lang, year, slug });
  const copy = COPY[lang];
  const resolvedTitle = String(title || titleFromSlug(slug)).trim();
  const timestamp = now.toISOString();
  const aboutUrl = `${SITE}${localizedPath(lang, "/about")}`;
  const methodologyUrl = `${SITE}${localizedPath(lang, "/methodology")}`;

  return {
    contentStandard: ARTICLE_STANDARD,
    slug,
    title: resolvedTitle,
    seoTitle: resolvedTitle,
    summary: "",
    excerpt: "",
    primaryTopic: "",
    countryPageFallback: false,
    relatedCountries: [],
    articleType: "analysis",
    tags: [],
    lang,
    datePublished: timestamp,
    dateModified: timestamp,
    dateReviewed: timestamp,
    author: {
      name: "EU Debt Map Research",
      url: aboutUrl,
    },
    reviewedBy: {
      name: "EU Debt Map Research",
      url: methodologyUrl,
    },
    readingMinutes: null,
    image: `/images/articles/${slug}.jpg`,
    imageWidth: null,
    imageHeight: null,
    imageAlt: "",
    imageCredit: "Original editorial image created for EU Debt Map",
    sourceNote: "",
    relatedLinks: [
      {
        label: copy.liveMap,
        url: `${SITE}${localizedPath(lang, "/")}`,
      },
      {
        label: copy.ranking,
        url: `${SITE}${localizedPath(lang, "/debt-to-gdp")}`,
      },
      {
        label: copy.methodology,
        url: methodologyUrl,
      },
    ],
    sources: [],
    note:
      "Place the mid-article ad at the marker <!-- MID_ARTICLE_AD -->. Do not paste the raw AdSense script into the body.",
    contentNotes:
      "Verify every factual claim against primary sources. Use a neutral headline, original analysis, short paragraphs and descriptive internal links. Update dates only after a substantive review.",
    body:
      `<p class="article-intro">${copy.intro}</p>` +
      `<h2>${copy.takeaways}</h2><ul><li>Add verified takeaways.</li></ul>` +
      `<!-- MID_ARTICLE_AD -->` +
      `<h2>${copy.continue}</h2><p>Write the complete article here.</p>`,
  };
}

function createArticleFile({ root = process.cwd(), lang, year, slug, title, now }) {
  const article = buildArticleDraft({ lang, year, slug, title, now });
  const directory = path.join(root, "content", "articles", lang, String(year));
  const file = path.join(directory, `${slug}.json`);

  if (fs.existsSync(file)) {
    throw new Error(`Article already exists: ${file}`);
  }

  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(article, null, 2)}\n`, "utf8");
  return { article, file };
}

function main(argv = process.argv.slice(2)) {
  const [lang, year, slug, ...titleParts] = argv;
  if (!lang || !year || !slug) {
    throw new Error(
      "Usage: npm run new:article -- <lang> <year> <slug> [title]"
    );
  }

  const { file } = createArticleFile({
    lang,
    year,
    slug,
    title: titleParts.join(" "),
  });

  console.log(`[new-article] Created ${file}`);
  console.log("[new-article] Add the final image and its measured width/height.");
  console.log("[new-article] Complete the sources and article, then run npm run audit:articles.");
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`[new-article] ERROR: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = {
  ARTICLE_STANDARD,
  buildArticleDraft,
  createArticleFile,
  main,
  validateArguments,
};
