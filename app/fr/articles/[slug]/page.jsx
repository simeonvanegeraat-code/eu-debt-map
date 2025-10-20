export const runtime = "nodejs";

import { getArticle, getTranslations } from "@/lib/articles";
import { notFound } from "next/navigation";
import ShareBar from "@/components/ShareBar";
import { articleOgImage, articleImage } from "@/lib/media";
import ArticleRailServer from "@/components/ArticleRailServer";

const SITE = "https://www.eudebtmap.com";
const LANG = "fr";
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
    translations.map((t) => {
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
function stripDuplicateHero(html, heroSrc) {
  if (!html || !heroSrc) return html;
  // simple : si les ~1 500 premiers caractères contiennent une <img>/<figure> avec la même src, on supprime ce bloc
  const head = html.slice(0, 1500);
  const imgRe = new RegExp(
    `<figure[^>]*>[^]*?<img[^>]*src=["']${escapeRegExp(heroSrc)}["'][^>]*>[^]*?</figure>`,
    "i"
  );
  const imgSoloRe = new RegExp(
    `<img[^>]*src=["']${escapeRegExp(heroSrc)}["'][^>]*>`,
    "i"
  );

  if (imgRe.test(head)) return html.replace(imgRe, "");
  if (imgSoloRe.test(head)) return html.replace(imgSoloRe, "");
  return html;
}
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
}

/* ---------- page ---------- */
export default function ArticleDetailPage({ params }) {
  const article = getArticle({ slug: params.slug, lang: LANG });
  if (!article) return notFound();

  const url = `${SITE}${prefix}/articles/${params.slug}`;
  const dateFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" });

  // Héro : hero > cover > image
  const heroSrc =
    articleImage(article, "hero") ||
    articleImage(article, "cover") ||
    article.image ||
    null;

  // Corps sans doublon du visuel héro
  const cleanBody = stripDuplicateHero(article.body || "", heroSrc || "");

  const css = `
    .pageTitle{
      margin:0;
      line-height:1.15;
      font-weight:800;
      font-size: clamp(1.75rem, 1.1rem + 2.4vw, 2.25rem);
      letter-spacing:-0.015em;
    }
    .metaRow{ display:flex; gap:8px; flex-wrap:wrap; }
    .hero{
      width:100%;
      height:auto;
      display:block;
      border-radius:12px;
      border:1px solid var(--border);
      background:#f3f4f6;
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
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/icons/icon-512.png`,
        width: 512,
        height: 512
      }
    },
    image: heroSrc ? [`${SITE}${heroSrc}`] : article.image ? [`${SITE}${article.image}`] : undefined
  };

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="card" style={{ gridColumn: "1 / -1", display: "grid", gap: 12 }}>
        <style>{css}</style>

        {/* Méta + titre */}
        <header style={{ display: "grid", gap: 8 }}>
          <div className="tag metaRow">
            <time dateTime={article.date}>{dateFmt.format(new Date(article.date))}</time>
            {article.tags?.length ? <span aria-hidden>•</span> : null}
            {article.tags?.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
          <h1 className="pageTitle">{article.title}</h1>
          {article.summary && (
            <p className="tag" style={{ margin: 0, opacity: 0.9 }}>
              {article.summary}
            </p>
          )}
        </header>

        {/* Héro (une seule fois) */}
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

        {/* Partage + séparateur */}
        <ShareBar url={url} title={article.title} summary={article.summary} />
        <hr className="divider" />

        {/* Corps d’article */}
        <div className="articleProse" dangerouslySetInnerHTML={{ __html: cleanBody }} />

        {/* À lire aussi */}
        <ArticleRailServer
          lang={article.lang}
          exceptSlug={article.slug}
          limit={4}
          title="Plus d’articles"
        />

        {/* Pied de page */}
        <footer style={{ display: "grid", gap: 10 }}>
          <ShareBar url={url} title={article.title} summary={article.summary} />
          <div className="tag">
            Source : Eurostat (gov_10q_ggdebt). Visualisation éducative, statistique non officielle.
          </div>
        </footer>
      </article>
    </main>
  );
}
