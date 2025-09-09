// components/ArticleCard.jsx
import Link from "next/link";
import { articleImage } from "@/lib/media";

function CardThumb({ article }) {
  const src = articleImage(article, "cover");
  const alt = article.imageAlt || article.title || "Article image";
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          width: "100%",
          height: 140,
          objectFit: "cover",
          borderRadius: 12,
          border: "1px solid #1f2b3a",
          background: "#0b1220",
        }}
      />
    );
  }
  // Fallback
  return (
    <div
      aria-hidden
      style={{
        height: 140,
        borderRadius: 12,
        border: "1px solid #1f2b3a",
        background:
          "linear-gradient(135deg, rgba(37,99,235,.18), rgba(99,102,241,.12))",
        display: "grid",
        placeItems: "center",
        fontWeight: 700,
      }}
      title={alt}
    >
      📊
    </div>
  );
}

export default function ArticleCard({ article }) {
  const dateFmt = new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
  const href = `/articles/${article.slug}`;

  return (
    <article className="card" style={{ display: "grid", gap: 10, alignContent: "start" }}>
      <CardThumb article={article} />

      <div className="tag" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {article.date && <time>{dateFmt.format(new Date(article.date))}</time>}
        {article.tags?.length ? <span aria-hidden>•</span> : null}
        {article.tags?.map((t) => <span key={t} className="tag">{t}</span>)}
      </div>

      <h3 style={{ margin: 0 }}>
        <Link href={href}>{article.title}</Link>
      </h3>

      {article.excerpt && <p style={{ margin: 0, color: "#c8d1dc" }}>{article.excerpt}</p>}

      <div><Link href={href} className="tag">Read more →</Link></div>
    </article>
  );
}
