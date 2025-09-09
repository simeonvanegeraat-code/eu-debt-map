// components/ArticleCard.jsx
"use client";

import Link from "next/link";
import { articleImage } from "@/lib/media";

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso || "";
  }
}

export default function ArticleCard({ article }) {
  const href = `/articles/${article.slug}`;
  const img = articleImage(article, "cover"); // verwacht 600x600 (webp/jpg/png)
  const alt = article.imageAlt || article.title || "Article image";

  return (
    <article className="card" style={{ display: "grid", gap: 10 }}>
      <Link href={href} className="thumb" aria-label={article.title}>
        {img ? (
          <img
            src={img}
            alt={alt}
            width={600}
            height={600}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="thumb-fallback" aria-hidden>📊</div>
        )}
      </Link>

      <div className="tag" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <time dateTime={article.date}>{formatDate(article.date)}</time>
        <span aria-hidden>•</span>
        {(article.tags || []).slice(0, 4).map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>

      <h3 style={{ margin: 0, lineHeight: 1.25 }}>
        <Link href={href}>{article.title}</Link>
      </h3>

      <p className="tag" style={{ margin: 0, color: "#c8d1dc" }}>
        {article.summary}
      </p>

      <div>
        <Link href={href} className="tag">Read more →</Link>
      </div>

      {/* square thumb styles */}
      <style>{`
        .thumb{
          display:block;
          width:100%;
          aspect-ratio:1 / 1;         /* altijd vierkant */
          border-radius:12px;
          overflow:hidden;
          border:1px solid #1f2b3a;
          background:#0b1220;
        }
        .thumb img{
          width:100%;
          height:100%;
          object-fit:cover;           /* center-crop */
          display:block;
        }
        .thumb-fallback{
          width:100%;
          height:100%;
          display:grid;
          place-items:center;
          font-size:28px;
          background:linear-gradient(135deg, rgba(37,99,235,.18), rgba(99,102,241,.12));
        }
      `}</style>
    </article>
  );
}
