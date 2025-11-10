// components/ArticlesListClient.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function ArticlesListClient({ articles, pageSize = 12 }) {
  const [visible, setVisible] = useState(
    Math.min(pageSize, articles.length)
  );
  const [autoLoading, setAutoLoading] = useState(false);
  const sentinelRef = useRef(null);

  const hasMore = visible < articles.length;

  const handleLoadMore = () => {
    if (!hasMore) return;
    setVisible((v) => Math.min(v + pageSize, articles.length));
  };

  // Lazy-load bij scroll via IntersectionObserver
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setAutoLoading(true);
          handleLoadMore();
        }
      },
      { rootMargin: "160px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore]);

  return (
    <>
      <section className="articles-list">
        {articles.slice(0, visible).map((a) => (
          <Link
            key={a.slug}
            href={hrefFor(a)}
            className="articles-item"
          >
            <div className="articles-row">
              <div className="articles-thumb">
                <img
                  src={a.image || "/images/articles/placeholder.jpg"}
                  alt={a.imageAlt || a.title}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="articles-content">
                <p className="articles-date">
                  {formatDate(a.date)}
                </p>
                <h2 className="articles-title">
                  {a.title}
                </h2>
                <p className="articles-excerpt">
                  {a.excerpt || a.summary}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Load more + sentinel */}
      {hasMore && (
        <>
          <div className="loadmore-wrap">
            <button
              type="button"
              className="loadmore-btn"
              onClick={handleLoadMore}
              disabled={autoLoading}
            >
              Load more articles
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

function hrefFor(a) {
  if (!a) return "#";
  if (a.url) return a.url;
  const lang = a.lang && a.lang !== "en" ? `/${a.lang}` : "";
  return `${lang}/articles/${a.slug}`;
}
