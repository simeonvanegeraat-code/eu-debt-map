"use client";

import Link from "next/link";

function hrefFor(a) {
  if (!a) return "#";
  if (a.url) return a.url;
  const lang = a.lang && a.lang !== "en" ? `/${a.lang}` : "";
  return `${lang}/articles/${a.slug}`;
}

export default function ArticleRail({ articles = [], title = "More articles" }) {
  if (!articles.length) return null;

  const headingId =
    "rail-heading-" + (title || "more").toLowerCase().replace(/\s+/g, "-");

  return (
    <section className="article-rail" aria-labelledby={headingId}>
      <style jsx>{`
        .article-rail {
          margin-top: 24px;
          display: grid;
          gap: 6px;
        }

        .rail-heading {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: #0f172a;
        }

        .rail-sub {
          margin: 0;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .rail-list {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 4px 0 4px;
          scroll-behavior: smooth;
        }

        .rail-item {
          flex: 0 0 260px;
          text-decoration: none;
          color: inherit;
        }

        .card {
          display: grid;
          grid-template-rows: auto 1fr;
          gap: 6px;
          border-radius: 18px;
          background: #ffffff;
          border: 1px solid rgba(148, 163, 253, 0.18);
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
          overflow: hidden;
          transition: all 0.16s ease;
        }

        .card:hover,
        .card:focus-visible {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.14);
          background: #f9fafb;
        }

        .thumb {
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #e5e7eb;
          overflow: hidden;
        }

        .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.18s ease;
        }

        .card:hover .thumb img,
        .card:focus-visible .thumb img {
          transform: scale(1.03);
        }

        .body {
          padding: 8px 10px 9px;
          display: grid;
          gap: 4px;
        }

        .date {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #9ca3af;
          margin: 0;
        }

        .title {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 600;
          line-height: 1.35;
          color: #111827;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .excerpt {
          margin: 0;
          font-size: 0.78rem;
          line-height: 1.4;
          color: #6b7280;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .article-rail {
            margin-top: 28px;
            gap: 8px;
          }

          .rail-list {
            overflow-x: visible;
            padding-bottom: 0;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
          }

          .rail-item {
            flex: initial;
          }
        }
      `}</style>

      <h3 id={headingId} className="rail-heading">
        {title}
      </h3>
      <p className="rail-sub">
        Related EU debt and fiscal insights to explore next.
      </p>

      <div className="rail-list">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={hrefFor(a)}
            className="rail-item"
            aria-label={a.title}
            rel="bookmark"
          >
            <div className="card">
              <div className="thumb">
                <img
                  src={a.image || "/images/articles/placeholder.jpg"}
                  alt={a.imageAlt || a.title}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="body">
                {a.date && (
                  <p className="date">{formatDate(a.date, a.lang)}</p>
                )}
                <h4 className="title">{a.title}</h4>
                {(a.summary || a.excerpt) && (
                  <p className="excerpt">
                    {a.summary || a.excerpt}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function formatDate(iso, lang = "en") {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(
      lang && lang !== "en" ? lang : "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  } catch {
    return iso;
  }
}
