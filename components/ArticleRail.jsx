// app/components/ArticleRail.jsx
"use client";

import Link from "next/link";

/* Helper voor URL opbouw */
function hrefFor(a) {
  if (!a) return "#";
  if (a.url) return a.url;
  const lang = a.lang && a.lang !== "en" ? `/${a.lang}` : "";
  return `${lang}/articles/${a.slug}`;
}

/* Helper voor datum */
function formatDate(iso, lang = "en") {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(lang === "en" ? "en-GB" : lang, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function ArticleRail({ articles = [], title = "More articles" }) {
  if (!articles.length) return null;

  return (
    <section className="rail-wrapper">
      <style jsx>{`
        .rail-wrapper {
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .rail-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .rail-title {
          margin: 0;
          font-size: 1.4rem; /* Groter = Duidelijker */
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #111827;
        }

        .rail-subtitle {
          margin: 0;
          font-size: 0.95rem;
          color: #6b7280;
        }

        .rail-grid {
          display: grid;
          gap: 24px;
          /* Mobile first: 1 kolom */
          grid-template-columns: 1fr; 
        }

        @media (min-width: 640px) {
          .rail-grid {
            /* Tablet: 2 kolommen */
            grid-template-columns: repeat(2, 1fr); 
          }
        }
        @media (min-width: 1024px) {
          .rail-grid {
            /* Desktop: 3 kolommen */
            grid-template-columns: repeat(3, 1fr); 
          }
        }

        /* CARD */
        .card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: 1px solid rgba(0,0,0,0.06);
          height: 100%; /* Gelijke hoogte */
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.08);
          border-color: rgba(0,0,0,0.0);
        }

        .thumb-wrap {
          position: relative;
          aspect-ratio: 16/9;
          background: #f3f4f6;
          overflow: hidden;
        }
        
        .thumb-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .card:hover .thumb-wrap img {
          transform: scale(1.05);
        }

        .content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-grow: 1;
        }

        .meta {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          color: #9ca3af;
        }

        .card-title {
          margin: 0;
          font-size: 1.15rem; /* Leesbaarder */
          font-weight: 700;
          line-height: 1.4;
          color: #111827;
        }
        
        .card:hover .card-title {
          color: #2563eb; /* Blauw accent bij hover */
          text-decoration: underline;
          text-decoration-thickness: 2px;
        }

        .excerpt {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #4b5563;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div className="rail-header">
        <h3 className="rail-title">{title}</h3>
        <p className="rail-subtitle">Analysis & data you might have missed</p>
      </div>

      <div className="rail-grid">
        {articles.map((a) => (
          <Link 
            key={a.slug} 
            href={hrefFor(a)} 
            className="card"
            title={a.title}
          >
            <div className="thumb-wrap">
              <img
                src={a.image || "/images/articles/placeholder.jpg"}
                alt={a.title}
                loading="lazy"
              />
            </div>
            <div className="content">
              {a.date && <span className="meta">{formatDate(a.date, a.lang)}</span>}
              <h4 className="card-title">{a.title}</h4>
              {/* Excerpt is optioneel, zet uit als het te druk wordt */}
              {a.summary && <p className="excerpt">{a.summary}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}