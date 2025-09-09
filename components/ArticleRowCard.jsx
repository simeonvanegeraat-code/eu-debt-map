// components/ArticleRowCard.jsx
import Link from "next/link";

function Thumb({ src, alt, title }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || title || "Article image"}
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
  // Placeholder
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
    >
      📊
    </div>
  );
}

export default function ArticleRowCard({ article }) {
  const dateFmt = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const href = `/articles/${article.slug}`;

  return (
    <article
      className="card"
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "minmax(220px, 340px) 1fr",
      }}
    >
      <Thumb src={article.image} alt={article.imageAlt} title={article.title} />

      <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
        <div className="tag" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {article.date && <time>{dateFmt.format(new Date(article.date))}</time>}
          {article.tags?.length ? <span aria-hidden>•</span> : null}
          {(article.tags || []).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>

        <h3 style={{ margin: 0 }}>
          <Link href={href}>{article.title}</Link>
        </h3>

        {article.excerpt && (
          <p style={{ margin: 0, color: "#c8d1dc" }}>{article.excerpt}</p>
        )}

        <div style={{ marginTop: 4 }}>
          <Link href={href} className="tag">Read more →</Link>
        </div>
      </div>

      {/* Mobile: stack */}
      <style>{`
        @media (max-width: 760px){
          article.card { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </article>
  );
}
