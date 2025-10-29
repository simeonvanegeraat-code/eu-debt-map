// app/articles/[slug]/page.jsx
export const runtime = "nodejs";

import { getArticle, getTranslations } from "@/lib/articles";
import { notFound } from "next/navigation";
import ShareBar from "@/components/ShareBar";
import { articleOgImage, articleImage } from "@/lib/media";
import ArticleRailServer from "@/components/ArticleRailServer";
import AdSlot from "@/components/AdSlot"; // ⬅️ toegevoegd

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
function bodyStartsWithImage(html = "") {
  const head = html.trim().slice(0, 500).toLowerCase();
  return head.startsWith("<img") || head.startsWith("<figure");
}

/* ---------- page ---------- */
export default function ArticleDetailPage({ params }) {
  const article = getArticle({ slug: params.slug, lang: LANG });
  if (!article) return notFound();

  const url = `${SITE}${prefix}/articles/${params.slug}`;
  const dateFmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "long" });

  // Optionele hero (alleen tonen als het artikel NIET al opent met een image/figure)
  const candidateHero =
    articleImage(article, "hero") ||
    articleImage(article, "cover") ||
    article.image ||
    null;

  const shouldRenderHero = candidateHero && !bodyStartsWithImage(article.body);

  const css = `
    /* Titel in home-stijl */
    .pageTitle{
      margin:0;
      line-height:1.15;
      font-weight:800;
      font-size:clamp(1.75rem,1.1rem + 2.4vw,2.25rem);
      letter-spacing:-0.015em;
    }
    .metaRow{ display:flex; gap:8px; flex-wrap:wrap; }

    /* Hero */
    .heroWrap{
      width:100%;
      border:1px solid var(--border);
      border-radius:12px;
      overflow:hidden;
      background:#f3f4f6;
      aspect-ratio:16/9;
    }
    .heroWrap img{
      width:100%;
      height:100%;
      object-fit:cover;
      display:block;
    }

    .divider{
      height:1px; border:0;
      background:linear-gradient(90deg, transparent, var(--border), transparent);
      margin: 8px 0 2px;
    }

    /* Prose */
    .articleProse h2{ margin:1rem 0 .5rem; }
    .articleProse h3{ margin:.75rem 0 .4rem; }
    .articleProse p{ line-height:1.65; margin:.6rem 0; }
    .articleProse ul,.articleProse ol{ margin:.5rem 0 .8rem 1.2rem; }
    .articleProse li{ margin:.25rem 0; }
    .articleProse .tag{ color:#9ca3af; }

    .articleProse figure{ margin:1.25rem 0; }
    .articleProse img{
      max-width:100%;
      height:auto;
      border-radius:12px;
      border:1px solid var(--border);
      display:block;
      margin-inline:auto;
    }
    .articleProse figcaption{
      color:#7d8da5;
      font-size:.9rem;
      margin-top:.45rem;
      text-align:center;
    }
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
    image: candidateHero ? [`${SITE}${candidateHero}`] : article.image ? [`${SITE}${article.image}`] : undefined
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
            {article.tags?.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
          <h1 className="pageTitle">{article.title}</h1>
          {article.summary && (
            <p className="tag" style={{ margin: 0, opacity: 0.9 }}>{article.summary}</p>
          )}
        </header>

        {/* Hero alleen als body niet al met image/figure start */}
        {shouldRenderHero && (
          <figure className="heroWrap" style={{ margin: 0 }}>
            <img
              src={candidateHero}
              alt={article.imageAlt || article.title}
              loading="lazy"
              decoding="async"
              width={1200}
              height={675}
            />
          </figure>
        )}

        {/* Share + divider */}
        <ShareBar url={url} title={article.title} summary={article.summary} />
        <hr className="divider" />

        {/* Ad slot #1 – boven de body */}
        <AdSlot slot="YOUR_SLOT_TOP_ARTICLE" minH={270} />

        {/* Artikeltekst */}
        <div className="articleProse" dangerouslySetInnerHTML={{ __html: article.body || "" }} />

        {/* Ad slot #2 – onder de body */}
        <AdSlot slot="YOUR_SLOT_BOTTOM_ARTICLE" minH={270} />

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
