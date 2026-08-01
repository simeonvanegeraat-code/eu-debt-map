export const runtime = "nodejs";

import { getArticle, getTranslations } from "@/lib/articles";
import { notFound } from "next/navigation";
import ShareBar from "@/components/ShareBar";
import { articleOgImage, articleImage } from "@/lib/media";
import ArticleRailServer from "@/components/ArticleRailServer";
import ArticleBody from "@/components/ArticleBody";
import articlePageCore from "@/lib/articlePageCore.cjs";

const SITE = "https://www.eudebtmap.com";
const LANG = "en";
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };
const prefix = ROUTE_PREFIX[LANG] ?? "";
const { buildArticleJsonLd, buildArticleMetadata } = articlePageCore;

/* ---------- helpers ---------- */

function bodyStartsWithImage(html = "") {
  const head = html.trim().slice(0, 500).toLowerCase();
  return head.startsWith("<img") || head.startsWith("<figure");
}

/* ---------- SEO ---------- */

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const article = getArticle({ slug, lang: LANG });

  return buildArticleMetadata({
    article,
    translations: article ? getTranslations(slug) : [],
    slug,
    lang: LANG,
    site: SITE,
    routePrefixes: ROUTE_PREFIX,
    missingTitle: "Article • EU Debt Map",
    ogImage: article ? articleOgImage(article) : undefined,
  });
}

/* ---------- page ---------- */

export default function ArticleDetailPage({ params }) {
  const article = getArticle({ slug: params.slug, lang: LANG });
  if (!article) return notFound();

  const url = `${SITE}${prefix}/articles/${params.slug}`;

  const publishDate = article.datePublished || article.date;
  const dateFmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "long" });

  const candidateHero =
    articleImage(article, "hero") ||
    articleImage(article, "cover") ||
    article.image ||
    null;

  const og = articleOgImage(article);
  const shouldRenderHero = candidateHero && !bodyStartsWithImage(article.body);

  const jsonLd = buildArticleJsonLd({
    article,
    url,
    lang: LANG,
    site: SITE,
    imageUrl: og,
  });

  const css = `
    .article-container {
      max-width: 740px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .pageTitle {
      margin: 1rem 0 0.5rem;
      line-height: 1.1;
      font-weight: 800;
      font-size: clamp(2rem, 1.5rem + 2.5vw, 3rem);
      letter-spacing: -0.02em;
      color: #111827;
      font-family: var(--font-sans, sans-serif);
    }

    .metaRow {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      font-size: 0.85rem;
      color: #6b7280;
      margin-bottom: 24px;
      font-weight: 500;
      align-items: center;
    }

    .metaRow .tag {
      color: #2563eb;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }

    .summary-lead {
      font-size: 1.25rem;
      line-height: 1.5;
      color: #4b5563;
      margin-bottom: 24px;
      font-weight: 400;
      font-family: Georgia, Cambria, "Times New Roman", Times, serif;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 24px;
    }

    .heroWrap {
      width: 100%;
      max-width: 100%;
      margin: 0 0 32px 0;
      border-radius: 12px;
      overflow: hidden;
      background: #f3f4f6;
      aspect-ratio: 16 / 9;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .heroWrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .articleProse {
      font-family: Georgia, Cambria, "Times New Roman", Times, serif;
      font-size: 1.125rem;
      line-height: 1.8;
      color: #1f2937;
    }

    .articleProse p {
      margin-bottom: 1.5rem;
    }

    .articleProse h2 {
      font-family: var(--font-sans, sans-serif);
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
      margin: 2.5rem 0 1rem;
      line-height: 1.3;
      letter-spacing: -0.01em;
    }

    .articleProse h3 {
      font-family: var(--font-sans, sans-serif);
      font-size: 1.35rem;
      font-weight: 600;
      color: #111827;
      margin: 2rem 0 0.75rem;
    }

    .articleProse a {
      color: #2563eb;
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 3px;
    }

    .articleProse a:hover {
      color: #1d4ed8;
      text-decoration-thickness: 2px;
    }

    .articleProse ul,
    .articleProse ol {
      margin: 1.5rem 0;
      padding-left: 1.5rem;
    }

    .articleProse li {
      margin-bottom: 0.5rem;
      padding-left: 0.5rem;
    }

    .articleProse ul li::marker {
      color: #9ca3af;
    }

    .articleProse blockquote {
      border-left: 4px solid #2563eb;
      margin: 2rem 0;
      padding: 0.5rem 0 0.5rem 1.5rem;
      font-style: italic;
      color: #374151;
      font-size: 1.2rem;
      background: #f9fafb;
      border-radius: 0 8px 8px 0;
    }

    .articleProse figure {
      margin: 2.5rem -16px;
    }

    @media (min-width: 640px) {
      .articleProse figure {
        margin: 2.5rem 0;
      }
    }

    .articleProse img {
      width: 100%;
      height: auto;
      border-radius: 8px;
      display: block;
    }

    .articleProse figcaption {
      font-family: var(--font-sans, sans-serif);
      color: #6b7280;
      font-size: 0.9rem;
      margin-top: 0.75rem;
      text-align: center;
    }
  `;

  return (
    <main style={{ paddingBottom: 60 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <article className="article-container">
        <header>
          <div className="metaRow">
            {article.tags?.[0] && <span className="tag">{article.tags[0]}</span>}

            <time dateTime={publishDate}>
              {dateFmt.format(new Date(publishDate))}
            </time>

            {article.author && (
              <span>
                by{" "}
                {typeof article.author === "string"
                  ? article.author
                  : article.author.name}
              </span>
            )}
          </div>

          <h1 className="pageTitle">{article.title}</h1>

          {article.summary && (
            <div className="summary-lead">{article.summary}</div>
          )}
        </header>

        <div style={{ margin: "20px 0" }}>
          <ShareBar url={url} title={article.title} />
        </div>

        {shouldRenderHero && (
          <figure className="heroWrap">
            <img
              src={candidateHero}
              alt={article.imageAlt || article.title}
              loading="eager"
              decoding="async"
              width={1200}
              height={675}
            />
          </figure>
        )}

        <ArticleBody body={article.body} />

        <hr
          style={{
            margin: "40px 0 24px",
            border: 0,
            borderTop: "1px solid #e5e7eb",
          }}
        />

        <div style={{ marginBottom: 40 }}>
          <ShareBar url={url} title={article.title} />
        </div>

        <ArticleRailServer
          lang={article.lang}
          exceptSlug={article.slug}
          limit={6}
          title="Further Reading"
        />
      </article>
    </main>
  );
}
