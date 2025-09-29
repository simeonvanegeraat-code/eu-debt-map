// app/articles/[slug]/page.jsx
import { getArticle } from "@/lib/articles";
import { notFound } from "next/navigation";
import ShareBar from "@/components/ShareBar";
import { articleOgImage } from "@/lib/media";
import ArticleRail from "@/components/ArticleRail";
import AdBox from "@/components/AdBox"; // <-- nieuw

const SITE = "https://www.eudebtmap.com";

export async function generateMetadata({ params }) {
  const a = getArticle(params.slug);
  if (!a) {
    return {
      title: "Article • EU Debt Map",
      alternates: { canonical: `${SITE}/articles/${params.slug}` },
      openGraph: { url: `${SITE}/articles/${params.slug}` },
    };
  }

  const url = `${SITE}/articles/${params.slug}`;
  const og = articleOgImage(a);

  return {
    title: `${a.title} • EU Debt Map`,
    description: a.summary,
    alternates: { canonical: url },
    openGraph: {
      title: a.title,
      description: a.summary,
      url,
      siteName: "EU Debt Map",
      type: "article",
      images: og ? [{ url: og, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: a.title,
      description: a.summary,
      images: og ? [og] : undefined,
    },
  };
}

export default function ArticleDetailPage({ params }) {
  const article = getArticle(params.slug);
  if (!article) return notFound();

  const url = `${SITE}/articles/${params.slug}`;
  const dateFmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "long" });

  const proseCss = `
    .articleProse h2{ margin: 1rem 0 .5rem; }
    .articleProse h3{ margin: .75rem 0 .4rem; }
    .articleProse p{ line-height: 1.6; margin: .5rem 0; }
    .articleProse ul{ margin: .5rem 0 .75rem 1.2rem; }
    .articleProse li{ margin: .25rem 0; }
    .articleProse .tag{ color:#9ca3af; }
    .articleProse code{ background:#0b1220; padding:.1rem .3rem; border-radius:6px; }
  `;

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <article className="card" style={{ gridColumn: "1 / -1", display: "grid", gap: 12 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <div className="tag" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <time dateTime={article.date}>{dateFmt.format(new Date(article.date))}</time>
            {article.tags?.length ? <span aria-hidden>•</span> : null}
            {article.tags?.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
          <h1 style={{ margin: 0 }}>{article.title}</h1>
          {article.summary && (
            <p className="tag" style={{ margin: 0, opacity: 0.9 }}>{article.summary}</p>
          )}
          <ShareBar url={url} title={article.title} summary={article.summary} />
        </header>

        <style>{proseCss}</style>

        {/* Ad 1: bovenin content (na intro). Vervang door jouw echte slot ID */}
        <AdBox slot="YOUR_SLOT_ID_1" />

        <div className="articleProse" dangerouslySetInnerHTML={{ __html: article.body }} />

        {/* Verder lezen */}
        <ArticleRail currentSlug={article.slug} lang={article.lang} max={4} title="More articles" />

        {/* Ad 2: onderaan content. Vervang door jouw echte slot ID */}
        <AdBox slot="YOUR_SLOT_ID_2" />

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
