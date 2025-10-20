export const runtime = "nodejs";

import { getArticle, getTranslations } from "@/lib/articles";
import { notFound } from "next/navigation";
import ShareBar from "@/components/ShareBar";
import { articleOgImage, articleImage } from "@/lib/media";
import ArticleRailServer from "@/components/ArticleRailServer";

const SITE = "https://www.eudebtmap.com";
const LANG = "nl";
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };
const prefix = ROUTE_PREFIX[LANG] ?? "";

/* ---------- SEO ---------- */
export async function generateMetadata({ params }) {
  const slug = params.slug;
  const a = getArticle({ slug, lang: LANG });
  const url = `${SITE}${prefix}/articles/${slug}`;

  if (!a) {
    return { title: "Artikel • EU Debt Map", alternates: { canonical: url }, openGraph: { url } };
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
function stripDuplicateHero(html, heroSrc) {
  if (!html || !heroSrc) return html;
  const head = html.slice(0, 1500);
  const imgRe = new RegExp(
    `<figure[^>]*>[^]*?<img[^>]*src=["']${escapeRegExp(heroSrc)}["'][^>]*>[^]*?</figure>`,
    "i"
  );
  const imgSoloRe = new RegExp(`<img[^>]*src=["']${escapeRegExp(heroSrc)}["'][^>]*>`, "i");
  if (imgRe.test(head)) return html.replace(imgRe, "");
  if (imgSoloRe.test(head)) return html.replace(imgSoloRe, "");
  return html;
}
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* ---------- page ---------- */
export default function ArticleDetailPage({ params }) {
  const article = getArticle({ slug: params.slug, lang: LANG });
  if (!article) return notFound();

  const url = `${SITE}${prefix}/articles/${params.slug}`;
  const dateFmt = new Intl.DateTimeFormat("nl-NL", { dateStyle: "long" });

  const heroSrc =
    articleImage(article, "hero") ||
    articleImage(article, "cover") ||
    article.image ||
    null;

  const cleanBody = stripDuplicateHero(article.body || "", heroSrc || "");

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
        <header style={{ display: "grid", gap: 8 }}>
          <div className="tag metaRow">
            <time dateTime={article.date}>{dateFmt.format(new Date(article.date))}</time>
            {article.tags?.length ? <span aria-hidden>•</span> : null}
            {article.tags?.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          <h1 className="pageTitle">{article.title}</h1>
          {article.summary && <p className="tag" style={{ margin: 0, opacity: 0.9 }}>{article.summary}</p>}
        </header>

        {heroSrc && (
          <figure style={{ margin: 0 }}>
            <img src={heroSrc} alt={article.imageAlt || article.title} width={1200} height={675} loading="eager" decoding="async" className="hero" />
          </figure>
        )}

        <ShareBar url={url} title={article.title} summary={article.summary} />
        <hr className="divider" />

        <div className="articleProse" dangerouslySetInnerHTML={{ __html: cleanBody }} />

        <ArticleRailServer lang={article.lang} exceptSlug={article.slug} limit={4} title="Meer artikelen" />

        <footer style={{ display: "grid", gap: 10 }}>
          <ShareBar url={url} title={article.title} summary={article.summary} />
          <div className="tag">
            Bron: Eurostat (gov_10q_ggdebt). Educatieve visualisatie, geen officiële statistiek.
          </div>
        </footer>
      </article>
    </main>
  );
}
