// app/articles/[slug]/page.jsx
export const runtime = "nodejs";

import { getArticle, getTranslations } from "@/lib/articles";
import { notFound } from "next/navigation";
import ShareBar from "@/components/ShareBar";
import { articleOgImage, articleImage } from "@/lib/media";
import ArticleRailServer from "@/components/ArticleRailServer";

const SITE = "https://www.eudebtmap.com";
const LANG = "en";
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };
const prefix = ROUTE_PREFIX[LANG] ?? "";

/* ---------- SEO ---------- */
export async function generateMetadata({ params }) {
  const slug = params.slug;
  const a = getArticle({ slug, lang: LANG });
  const url = `${SITE}${prefix}/articles/${slug}`;

  if (!a) {
    return { title: "Article • EU Debt Map", alternates: { canonical: url }, openGraph: { url } };
  }
  const translations = getTranslations(slug);
  const languages = Object.fromEntries(
    translations.map(t => {
      const pfx = ROUTE_PREFIX[t.lang] ?? "";
      return [t.lang, `${SITE}${pfx}/articles/${t.slug}`];
    })
  );
  languages["x-default"] = languages.en || url;

  const og = articleOgImage(a);
  return {
    title: `${a.title} • EU Debt Map`,
    description: a.summary,
    alternates: { canonical: url, languages },
    openGraph: {
      title: a.title,
      description: a.summary,
      url,
      siteName: "EU Debt Map",
      type: "article",
      images: og ? [{ url: og, width: 1200, height: 630 }] : undefined,
      locale: LANG,
    },
    twitter: {
      card: "summary_large_image",
      title: a.title,
      description: a.summary,
      images: og ? [og] : undefined,
    },
  };
}

/* ---------- helpers ---------- */
// Remove a duplicate hero OR any *leading* media block (<figure>…</figure> or <img …>)
// so you never get a giant second image under the title.
function stripDuplicateHeroOrLeadingMedia(html, heroSrc) {
  if (!html) return html;

  const trimmed = html.replace(/^\s+/, "");

  // 1) If first non-whitespace tag is a <figure>…</figure>, drop it.
  const startsWithFigure = /^<figure\b[^>]*>[^]*?<\/figure>/i;
  if (startsWithFigure.test(trimmed)) {
    return trimmed.replace(startsWithFigure, "");
  }

  // 2) If first non-whitespace tag is a bare <img …>, drop that single tag
  //    (optionally wrapped in a <p>…</p> with only the img inside).
  const startsWithImg = /^<img\b[^>]*>/i;
  const startsWithPImg = /^<p\b[^>]*>\s*<img\b[^>]*>\s*<\/p>/i;

  if (startsWithPImg.test(trimmed)) return trimmed.replace(startsWithPImg, "");
  if (startsWithImg.test(trimmed)) return trimmed.replace(startsWithImg, "");

  // 3) Back-compat: if the same heroSrc appears near the top as a figure/img, drop it.
  if (heroSrc) {
    const head = trimmed.slice(0, 1800);
    const esc = escapeRegExp(heroSrc);
    const sameFigure = new RegExp(`<figure[^>]*>[^]*?<img[^>]*src=["']${esc}["'][^>]*>[^]*?</figure>`, "i");
    const sameImg = new RegExp(`<img[^>]*src=["']${esc}["'][^>]*>`, "i");
    if (sameFigure.test(head)) return trimmed.replace(sameFigure, "");
    if (sameImg.test(head)) return trimmed.replace(sameImg, "");
  }

  return trimmed;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* ---------- page ---------- */
export default function ArticleDetailPage({ params }) {
  const article = getArticle({ slug: params.slug, lang: LANG });
  if (!article) return notFound();

  const url = `${SITE}${prefix}/articles/${params.slug}`;
  const dateFmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "long" });

  // Hero: hero > cover > image
  const heroSrc =
    articleImage(article, "hero") ||
    articleImage(article, "cover") ||
    article.image ||
    null;

  // Body zonder (dubbele) leading hero / afbeelding
  const cleanBody = stripDuplicateHeroOrLeadingMedia(article.body || "", heroSrc || "");

  const css = `
    .pageTitle{
      margin:0;
      line-height:1.15;
      font-weight:800;
      font-size: clamp(1.75rem, 1.1rem + 2.4vw, 2.25rem);
      letter-spacing:-0.015em;
    }
    .metaRow{ display:flex; gap:8px; flex-wrap:wrap; }

    /* Compacte hero */
    .hero{
      width:100%;
      height:380px;
      display:block;
      object-fit:cover;
      border-radius:12px;
      border:1px solid var(--border);
      background:#f3f4f6;
    }
    @media (max-width: 640px){
      .hero{ height:260px; }
    }

    .divider{
      height:1px; border:0;
      background:linear-gradient(90deg, transparent, var(--border), transparent);
      margin: 8px 0 2px;
    }

    .articleProse h2{ margin: 1rem 0 .5rem; }
    .articleProse h3{ margin: .75rem 0 .4rem; }
    .articleProse p{ line-height: 1.65; margin:.6rem 0; }
    .articleProse ul, .articleProse ol{ margin:.5rem 0 .8rem 1.2rem; }
    .articleProse li{ margin:.25rem 0; }
    .articleProse .tag{ color:#9ca3af; }
    .articleProse figure { margin:1.25rem 0; }
    .articleProse img{ max-width:100%; height:auto; border-radius:12px; border:1px solid var(--border); }
    .articleProse figcaption{ color:#7d8da5; font-size:.9rem; margin-top:.45rem; text-align:center;}
  `;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary || undefined,
    datePublished: new Date(article.date).toISOString(),
    dateModified: new Date(article.date).toISOString(),
    inLanguage: article.lang || LANG,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: "EU Debt Map" },
    publisher: {
      "@type": "Organization",
      name: "EU Debt Map",
      logo: { "@type": "ImageObject", url: `${SITE}/icons/icon-512.png`, width: 512, height: 512 }
    },
    image: heroSrc ? [`${SITE}${heroSrc}`] : article.image ? [`${SITE}${article.image}`] : undefined
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="card" style={{ gridColumn: "1 / -1", display: "grid", gap: 12 }}>
        <style>{css}</style>

        {/* Meta + titel */}
        <header style={{ display: "grid", gap: 8 }}>
          <div className="tag metaRow">
            <time dateTime={article.date}>{dateFmt.format(new Date(article.date))}</time>
            {article.tags?.length ? <span aria-hidden>•</span> : null}
            {article.tags?.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          <h1 className="pageTitle">{article.title}</h1>
          {article.summary && (
            <p className="tag" style={{ margin: 0, opacity: 0.9 }}>{article.summary}</p>
          )}
        </header>

        {/* Hero (één keer, compact) */}
        {heroSrc && (
          <figure style={{ margin: 0 }}>
            <img
              src={heroSrc}
              alt={article.imageAlt || article.title}
              width={1200}
              height={675}
              loading="eager"
              decoding="async"
              className="hero"
            />
          </figure>
        )}

        {/* Share + divider */}
        <ShareBar url={url} title={article.title} summary={article.summary} />
        <hr className="divider" />

        {/* Artikeltekst */}
        <div className="articleProse" dangerouslySetInnerHTML={{ __html: cleanBody }} />

        {/* Verder lezen */}
        <ArticleRailServer
          lang={article.lang}
          exceptSlug={article.slug}
          limit={4}
          title="More articles"
        />

        {/* Footer */}
        <footer style={{ display: "grid", gap: 10 }}>
          <ShareBar url={url} title={article.title} summary={article.summary} />
          <div className="tag">
            Source: Eurostat (gov_10q_ggdebt). Educational visualization, not an official statistic.
          </div>
        </footer>
      </article>
    </main>
  );
}
