// components/ArticleCard.jsx
"use client";

import Link from "next/link";

export default function ArticleCard({ article, hrefBase = "/articles" }) {
  if (!article) return null;
  const dateFmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });
  const href = `${hrefBase}/${article.slug}`;

  return (
    <article
      className="card"
      style={{
        display: "grid",
        gap: 8,
        borderColor: "#1f2b3a",
      }}
    >
      <div className="tag" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <time dateTime={article.date}>{dateFmt.format(new Date(article.date))}</time>
        <span aria-hidden>•</span>
        {article.tags?.map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>

      <h3 style={{ margin: 0 }}>
        <Link href={href}>{article.title}</Link>
      </h3>

      <p style={{ margin: 0, opacity: 0.9 }}>{article.summary}</p>

      <div style={{ marginTop: 4 }}>
        <Link href={href} className="tag">Read more →</Link>
      </div>
    </article>
  );
}
