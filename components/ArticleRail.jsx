// components/ArticleRail.jsx

import Link from "next/link";

function hrefFor(article) {
  if (!article) return "#";
  if (article.url) return article.url;

  const lang = article.lang && article.lang !== "en" ? `/${article.lang}` : "";
  return `${lang}/articles/${article.slug}`;
}

function formatDate(iso, lang = "en") {
  if (!iso) return "";

  const locale =
    {
      en: "en-GB",
      nl: "nl-NL",
      de: "de-DE",
      fr: "fr-FR",
    }[lang] || "en-GB";

  try {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function summaryFor(article) {
  return article.summary || article.excerpt || "";
}

export default function ArticleRail({
  articles = [],
  title = "Further Reading",
  lang = "en",
}) {
  if (!articles.length) return null;

  return (
    <section className="rail-wrapper">
      <style>{`
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
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #111827;
          font-family: var(--font-sans, sans-serif);
        }

        .rail-subtitle {
          margin: 0;
          font-size: 0.95rem;
          color: #6b7280;
          font-family: var(--font-sans, sans-serif);
        }

        .rail-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: 1fr;
        }

        @media (min-width: 640px) {
          .rail-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .rail-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .rail-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          background: #ffffff;
          border-radius: 14px;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          border: 1px solid rgba(15, 23, 42, 0.08);
          height: 100%;
        }

        .rail-card:hover,
        .rail-card:focus-visible {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
          border-color: rgba(37, 99, 235, 0.22);
          text-decoration: none;
        }

        .rail-thumb {
          position: relative;
          aspect-ratio: 16 / 9;
          background: #f3f4f6;
          overflow: hidden;
        }

        .rail-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .rail-card:hover .rail-thumb img,
        .rail-card:focus-visible .rail-thumb img {
          transform: scale(1.05);
        }

        .rail-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-grow: 1;
        }

        .rail-meta {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
          color: #6b7280;
          font-family: var(--font-sans, sans-serif);
        }

        .rail-card-title {
          margin: 0;
          font-size: 1.08rem;
          font-weight: 750;
          line-height: 1.35;
          color: #111827;
          letter-spacing: -0.01em;
          font-family: var(--font-sans, sans-serif);
        }

        .rail-card:hover .rail-card-title,
        .rail-card:focus-visible .rail-card-title {
          color: #2563eb;
          text-decoration: underline;
          text-decoration-thickness: 2px;
          text-underline-offset: 3px;
        }

        .rail-excerpt {
          font-size: 0.9rem;
          line-height: 1.55;
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
        <p className="rail-subtitle">Analysis and data you might have missed</p>
      </div>

      <div className="rail-grid">
        {articles.map((article) => {
          const date = article.date || article.datePublished;
          const formattedDate = formatDate(date, article.lang || lang);

          return (
            <Link
              key={`${article.lang || "en"}-${article.slug}`}
              href={hrefFor(article)}
              className="rail-card"
              title={article.title}
            >
              <div className="rail-thumb">
                <img
                  src={article.image || "/images/articles/placeholder.jpg"}
                  alt={article.imageAlt || article.title}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="rail-content">
                {formattedDate && (
                  <span className="rail-meta">{formattedDate}</span>
                )}

                <h4 className="rail-card-title">{article.title}</h4>

                {summaryFor(article) && (
                  <p className="rail-excerpt">{summaryFor(article)}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}