"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const TEXT = {
  en: {
    loadMore: "Load more articles",
    readMore: "Read analysis",
    noArticles: "No articles found yet.",
    minRead: "min read",
    fallbackTag: "Analysis",
  },
  nl: {
    loadMore: "Meer artikelen laden",
    readMore: "Lees analyse",
    noArticles: "Nog geen artikelen gevonden.",
    minRead: "min lezen",
    fallbackTag: "Analyse",
  },
  de: {
    loadMore: "Weitere Artikel laden",
    readMore: "Analyse lesen",
    noArticles: "Noch keine Artikel gefunden.",
    minRead: "Min. Lesezeit",
    fallbackTag: "Analyse",
  },
  fr: {
    loadMore: "Charger plus d’articles",
    readMore: "Lire l’analyse",
    noArticles: "Aucun article trouvé pour le moment.",
    minRead: "min de lecture",
    fallbackTag: "Analyse",
  },
};

function localeForArticles(articles) {
  const lang = articles?.[0]?.lang;
  return TEXT[lang] ? lang : "en";
}

function formatDate(iso, lang = "en") {
  if (!iso) return "";

  const locale = {
    en: "en-GB",
    nl: "nl-NL",
    de: "de-DE",
    fr: "fr-FR",
  }[lang] || "en-GB";

  try {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function hrefFor(article) {
  if (!article) return "#";
  if (article.url) return article.url;
  const lang = article.lang && article.lang !== "en" ? `/${article.lang}` : "";
  return `${lang}/articles/${article.slug}`;
}

function tagFor(article, fallback) {
  if (Array.isArray(article?.tags) && article.tags.length) {
    return String(article.tags[0]).replace(/-/g, " ");
  }
  return fallback;
}

function summaryFor(article) {
  return article?.summary || article?.excerpt || "";
}

function readingMinutes(article) {
  if (Number.isFinite(article?.readingMinutes)) {
    return Math.max(1, Math.round(article.readingMinutes));
  }

  const html = article?.body || "";
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 650;

  return Math.max(2, Math.round(words / 220));
}

export default function ArticlesListClient({ articles = [], pageSize = 12 }) {
  const safeArticles = Array.isArray(articles) ? articles : [];
  const lang = localeForArticles(safeArticles);
  const t = TEXT[lang] || TEXT.en;

  const [visible, setVisible] = useState(
    Math.min(pageSize, safeArticles.length)
  );
  const [autoLoading, setAutoLoading] = useState(false);
  const sentinelRef = useRef(null);
  const timerRef = useRef(null);

  const hasMore = visible < safeArticles.length;

  useEffect(() => {
    setVisible(Math.min(pageSize, safeArticles.length));
  }, [pageSize, safeArticles.length]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleLoadMore = () => {
    if (!hasMore) return;

    setVisible((current) =>
      Math.min(current + pageSize, safeArticles.length)
    );
  };

  useEffect(() => {
    if (!hasMore) return;

    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry.isIntersecting || autoLoading) return;

        setAutoLoading(true);
        handleLoadMore();

        timerRef.current = window.setTimeout(() => {
          setAutoLoading(false);
        }, 250);
      },
      { rootMargin: "220px" }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [autoLoading, hasMore, pageSize, safeArticles.length]);

  if (!safeArticles.length) {
    return (
      <section className="articles-list" aria-live="polite">
        <div className="articles-empty">{t.noArticles}</div>
      </section>
    );
  }

  return (
    <>
      <section className="articles-list" aria-label="Article list">
        {safeArticles.slice(0, visible).map((article) => {
          const date = article.date || article.datePublished;
          const tag = tagFor(article, t.fallbackTag);
          const minutes = readingMinutes(article);

          return (
            <Link
              key={`${article.lang || "en"}-${article.slug}`}
              href={hrefFor(article)}
              className="articles-item"
            >
              <article className="articles-row">
                <div className="articles-thumb">
                  <img
                    src={article.image || "/images/articles/placeholder.jpg"}
                    alt={article.imageAlt || article.title}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="articles-content">
                  <div className="articles-meta">
                    <span className="articles-tag">{tag}</span>
                    {date && (
                      <>
                        <span aria-hidden="true">•</span>
                        <time className="articles-date" dateTime={date}>
                          {formatDate(date, lang)}
                        </time>
                      </>
                    )}
                    <span aria-hidden="true">•</span>
                    <span>
                      {minutes} {t.minRead}
                    </span>
                  </div>

                  <h2 className="articles-title">{article.title}</h2>

                  {summaryFor(article) && (
                    <p className="articles-excerpt">{summaryFor(article)}</p>
                  )}

                  <span className="articles-cta">{t.readMore} →</span>
                </div>
              </article>
            </Link>
          );
        })}
      </section>

      {hasMore && (
        <>
          <div className="loadmore-wrap">
            <button
              type="button"
              className="loadmore-btn"
              onClick={handleLoadMore}
              disabled={autoLoading}
            >
              {t.loadMore}
            </button>
          </div>

          <div
            ref={sentinelRef}
            aria-hidden="true"
            style={{ height: 1 }}
          />
        </>
      )}
    </>
  );
}