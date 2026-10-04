import InArticleAd from "@/components/InArticleAd";
import ArticleDonutChart from "@/components/ArticleDonutChart";
import articlePageCore from "@/lib/articlePageCore.cjs";

const { splitArticleBody } = articlePageCore;
const ARTICLE_VISUAL_MARKER = /<!--\s*ARTICLE_VISUAL:([a-z0-9-]+)\s*-->/gi;
const TABLE_SCROLL_LABELS = {
  en: "Swipe to view all columns",
  nl: "Veeg om alle kolommen te bekijken",
  de: "Wischen, um alle Spalten zu sehen",
  fr: "Balayez pour voir toutes les colonnes",
};

function addTableScrollHints(html, lang) {
  const label = TABLE_SCROLL_LABELS[lang] || TABLE_SCROLL_LABELS.en;
  return html.replace(
    /(<div class=['"]articleDataTableWrap['"][^>]*>)/g,
    `$1<div class='articleTableScrollHint'><span aria-hidden='true'>↔</span>${label}</div>`
  );
}

function renderArticleSegment(html, visualizations, lang, keyPrefix) {
  if (!html) return null;

  const blocks = [];
  let cursor = 0;
  let blockIndex = 0;

  for (const match of html.matchAll(ARTICLE_VISUAL_MARKER)) {
    if (match.index > cursor) {
      blocks.push(
        <div
          key={`${keyPrefix}-html-${blockIndex}`}
          dangerouslySetInnerHTML={{ __html: html.slice(cursor, match.index) }}
        />
      );
      blockIndex += 1;
    }

    const visual = visualizations?.[match[1]];
    if (visual?.type === "donut") {
      blocks.push(
        <ArticleDonutChart
          key={`${keyPrefix}-visual-${match[1]}-${blockIndex}`}
          data={visual}
          lang={lang}
        />
      );
      blockIndex += 1;
    }

    cursor = match.index + match[0].length;
  }

  if (cursor < html.length) {
    blocks.push(
      <div
        key={`${keyPrefix}-html-${blockIndex}`}
        dangerouslySetInnerHTML={{ __html: html.slice(cursor) }}
      />
    );
  }

  return blocks;
}

export default function ArticleBody({ body = "", visualizations = {}, lang = "en" }) {
  const preparedBody = addTableScrollHints(body, lang);
  const { bodyBeforeAd, bodyAfterAd, hasMidArticleAd } = splitArticleBody(preparedBody);

  return (
    <div className="articleProse">
      {renderArticleSegment(bodyBeforeAd, visualizations, lang, "before-ad")}
      {hasMidArticleAd && <InArticleAd />}
      {renderArticleSegment(bodyAfterAd, visualizations, lang, "after-ad")}
    </div>
  );
}
