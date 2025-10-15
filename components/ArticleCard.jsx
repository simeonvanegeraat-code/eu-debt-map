"use client";

import Link from "next/link";

function clamp(txt, n = 2) {
  return (
    <span
      style={{
        display: "-webkit-box",
        WebkitLineClamp: n,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}
    >
      {txt}
    </span>
  );
}

// Bepaalt de juiste href op basis van artikeldata
function articleHref(article) {
  if (!article) return "#";

  // 1) Als je lib/articles.js al een 'url' meegeeft, gebruik die.
  if (article.url) return article.url;

  // 2) Anders bouw 'm uit lang + slug.
  const slug = article.slug || "";
  const lang = article.lang && article.lang !== "en" ? `/${article.lang}` : "";
  return `${lang}/articles/${slug}`;
}

export default function ArticleCard({ article }) {
  const {
    title,
    summary,
    image,
    imageAlt,
    date,
    tags = [],
  } = article || {};

  const href = articleHref(article);

  return (
    <Link href={href} className="article-card" aria-label={title} rel="bookmark">
      {image ? (
        <div className="thumb">
          <img
            src={image}
            alt={imageAlt || title}
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}

      <div className="body">
        <div className="meta">
          {date && (
            <time dateTime={date}>
              {new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(new Date(date))}
            </time>
          )}
          {tags.slice(0, 2).map((t) => (
            <span key={t} className="pill">
              {t}
            </span>
          ))}
        </div>

        <h3 className="title">{title}</h3>
        {summary ? <p className="excerpt">{clamp(summary, 3)}</p> : null}
        <span className="more">Read more →</span>
      </div>

      <style>{`
        .article-card{
          display:flex;
          flex-direction:column;
          border:1px solid var(--border);
          border-radius:12px;
          overflow:hidden;
          background:#fff;
          transition:box-shadow .15s ease, transform .05s ease;
        }
        .article-card:hover{ box-shadow:var(--shadow-sm); transform:translateY(-1px); }

        .thumb{
          width:100%;
          aspect-ratio:16/9;
          background:#eef3ff;
          overflow:hidden;
        }
        .thumb img{
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
        }

        .body{
          display:grid;
          gap:6px;
          padding:10px;
        }

        .meta{
          display:flex;
          flex-wrap:wrap;
          gap:6px;
          align-items:center;
          font-size:12px;
          color:#334155;
          opacity:.9;
        }
        .pill{
          padding:2px 8px;
          border-radius:999px;
          border:1px solid #e5e7eb;
          background:#f8fafc;
          font-weight:600;
        }

        .title{
          margin:0;
          font-size:16px;
          line-height:1.25;
        }
        .excerpt{
          margin:0;
          color:#475569;
          font-size:14px;
          line-height:1.5;
        }
        .more{
          margin-top:4px;
          font-size:13px;
          color:#1d4ed8;
          font-weight:600;
        }

        @media (max-width: 380px){
          .title{ font-size:15px; }
          .excerpt{ font-size:13px; }
        }
      `}</style>
    </Link>
  );
}
