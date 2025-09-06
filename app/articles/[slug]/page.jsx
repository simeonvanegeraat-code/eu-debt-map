// app/articles/[slug]/page.jsx
import { getArticle } from "@/lib/articles";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const a = getArticle(params.slug);
  if (!a) return { title: "Article • EU Debt Map" };
  return {
    title: `${a.title} • EU Debt Map`,
    description: a.summary,
    openGraph: { title: a.title, description: a.summary },
  };
}

export default function ArticleDetailPage({ params }) {
  const article = getArticle(params.slug);
  if (!article) return notFound();

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
      <article className="card" style={{ gridColumn: "1 / -1" }}>
        <header style={{ display: "grid", gap: 8, marginBottom: 8 }}>
          <div className="tag" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <time dateTime={article.date}>{dateFmt.format(new Date(article.date))}</time>
            <span aria-hidden>•</span>
            {article.tags?.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
          <h1 style={{ margin: 0 }}>{article.title}</h1>
          <p className="tag" style={{ margin: 0, opacity: 0.9 }}>{article.summary}</p>
        </header>

        {/* Scopede CSS zonder styled-jsx */}
        <style>{proseCss}</style>

        <div
          className="articleProse"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />

        <footer style={{ marginTop: 16 }}>
          <div className="tag">
            Source: Eurostat (gov_10q_ggdebt). Educational visualization, not an official statistic.
          </div>
        </footer>
      </article>
    </main>
  );
}
