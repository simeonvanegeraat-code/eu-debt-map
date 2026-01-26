export const runtime = "nodejs";

import { getArticle, getTranslations } from "@/lib/articles";
import { notFound } from "next/navigation";
import ShareBar from "@/components/ShareBar";
import { articleOgImage, articleImage } from "@/lib/media";
import ArticleRailServer from "@/components/ArticleRailServer";

const SITE = "https://www.eudebtmap.com";
const LANG = "de"; // Taal ingesteld op Duits
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };
const prefix = ROUTE_PREFIX[LANG] ?? "";

/* ---------- SEO ---------- */
export async function generateMetadata({ params }) {
  const slug = params.slug;
  const a = getArticle({ slug, lang: LANG });
  const url = `${SITE}${prefix}/articles/${slug}`;

  if (!a) {
    return {
      title: "Artikel • EU Debt Map",
      alternates: { canonical: url },
      openGraph: { url },
      robots: { index: false }
    };
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
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    openGraph: {
      title: a.title,
      description: a.summary,
      url,
      siteName: "EU Debt Map",
      type: "article",
      publishedTime: a.datePublished || a.date,
      modifiedTime: a.dateModified || a.date,
      authors: a.author?.name ? [a.author.name] : ["EU Debt Map"],
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
// Dit is de lichtere, veiligere check van de Engelse pagina
function bodyStartsWithImage(html = "") {
  const head = html.trim().slice(0, 500).toLowerCase();
  return head.startsWith("<img") || head.startsWith("<figure");
}

/* ---------- page ---------- */
export default function ArticleDetailPage({ params }) {
  const article = getArticle({ slug: params.slug, lang: LANG });
  if (!article) return notFound();

  const url = `${SITE}${prefix}/articles/${params.slug}`;
  
  const publishDate = article.datePublished || article.date;
  const modifyDate = article.dateModified || publishDate;
  // Duitse datum notatie
  const dateFmt = new Intl.DateTimeFormat("de-DE", { dateStyle: "long" });

  const candidateHero =
    articleImage(article, "hero") ||
    articleImage(article, "cover") ||
    article.image ||
    null;

  // Check of we de Hero image moeten tonen (Engelse logica)
  const shouldRenderHero = candidateHero && !bodyStartsWithImage(article.body);

  // --- PREMIUM EDITORIAL STYLING (Harde CSS uit de Engelse versie) ---
  const css = `
    /* Layout Container */
    .article-container {
      max-width: 740px; 
      margin: 0 auto;
      padding: 0 16px;
    }

    /* Typography Hierarchy */
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
      aspect-ratio: 16/9;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .heroWrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* THE ARTICLE BODY - "The Economist" style */
    .articleProse {
      font-family: Georgia, Cambria, "Times New Roman", Times, serif;
      font-size: 1.125rem; /* 18px */
      line-height: 1.8;
      color: #1f2937;
    }

    .articleProse p {
      margin-bottom: 1.5rem;
    }

    /* Headings in article body */
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

    /* Links */
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

    /* Lists */
    .articleProse ul, .articleProse ol {
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

    /* Blockquotes */
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

    /* Images in text */
    .articleProse figure {
      margin: 2.5rem -16px;
    }
    @media (min-width: 640px) {
      .articleProse figure { margin: 2.5rem 0; }
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
    
    /* Footer source styling */
    .source-note {
      font-size: 0.85rem;
      color: #6b7280;
      margin-top: 16px;
      font-style: italic;
    }
  `;

  // Author Object
  let authorObj;
  if (article.author) {
    if (typeof article.author === 'string') {
       authorObj = { "@type": "Person", name: article.author };
    } else {
       authorObj = { 
         "@type": "Person", 
         name: article.author.name, 
         url: article.author.url 
       };
    }
  } else {
    authorObj = { "@type": "Organization", name: "EU Debt Map" };
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary || undefined,
    datePublished: new Date(publishDate).toISOString(),
    dateModified: new Date(modifyDate).toISOString(),
    inLanguage: article.lang || LANG,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: authorObj,
    publisher: {
      "@type": "Organization",
      name: "EU Debt Map",
      logo: { "@type": "ImageObject", url: `${SITE}/icons/icon-512.png`, width: 512, height: 512 },
    },
    image: candidateHero ? [`${SITE}${candidateHero}`] : undefined,
  };

  return (
    <main style={{ paddingBottom: 60 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{css}</style>

      {/* BELANGRIJK: Hier gebruiken we nu article-container i.p.v. card/container */}
      <article className="article-container">
        {/* Header Section */}
        <header>
          <div className="metaRow">
            {article.tags?.[0] && <span className="tag">{article.tags[0]}</span>}
            <time dateTime={publishDate}>{dateFmt.format(new Date(publishDate))}</time>
            {article.author && (
               <span>von {typeof article.author === 'string' ? article.author : article.author.name}</span>
            )}
          </div>
          
          <h1 className="pageTitle">{article.title}</h1>
          
          {article.summary && (
            <div className="summary-lead">
              {article.summary}
            </div>
          )}
        </header>

        {/* Share buttons */}
        <div style={{ margin: "20px 0" }}>
          <ShareBar url={url} title={article.title} summary={article.summary} />
        </div>

        {/* Hero Image */}
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

        {/* The Content */}
        <div className="articleProse" dangerouslySetInnerHTML={{ __html: article.body || "" }} />

        {/* Footer Area with Source Note */}
        <hr style={{ margin: "40px 0 24px", border: 0, borderTop: "1px solid #e5e7eb" }} />
        
        <div style={{ marginBottom: 40 }}>
            <ShareBar url={url} title={article.title} summary={article.summary} />
            {/* Bronvermelding uit originele Duitse code */}
            <div className="source-note">
              Quelle: Eurostat (gov_10q_ggdebt). Bildungsvisualisierung, keine offizielle Statistik.
            </div>
        </div>

        {/* Read More (Vertaald naar Duits) */}
        <ArticleRailServer
          lang={article.lang}
          exceptSlug={article.slug}
          limit={6}
          title="Weitere Artikel" 
        />
      </article>
    </main>
  );
}