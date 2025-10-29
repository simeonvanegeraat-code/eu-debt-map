// components/ArticlesShell.jsx
"use client";

import Link from "next/link";
import Image from "next/image";

const THUMB_W_MOBILE = 116;
const THUMB_H_MOBILE = 87; // ~4:3 look

function articleHref(a) {
  if (!a) return "#";
  if (a.url) return a.url; // als lib/articles url meegeeft
  const langPrefix = a.lang && a.lang !== "en" ? `/${a.lang}` : "";
  return `${langPrefix}/articles/${a.slug}`;
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    const today = new Date();
    const isToday =
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();

    const time = new Intl.DateTimeFormat("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);

    if (isToday) return `Vandaag, ${time}`;
    return new Intl.DateTimeFormat("nl-NL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return iso || "";
  }
}

export default function ArticlesShell({ articles = [] }) {
  if (!articles?.length) return null;

  return (
    <section aria-labelledby="articles-heading" className="news-wrap">
      <h1 id="articles-heading" className="visually-hidden">
        Articles & Analysis
      </h1>

      <ul role="list" className="list">
        {articles.map((a) => {
          const href = articleHref(a);
          const imgSrc = a.image || "/images/articles/placeholder.jpg";
          const imgAlt = a.imageAlt || a.title;

          return (
            <li key={a.slug} className="item">
              <Link href={href} className="row" aria-label={a.title} rel="bookmark">
                {/* Thumb (mobiel links) */}
                <div className="thumb">
                  <Image
                    src={imgSrc}
                    alt={imgAlt}
                    width={THUMB_W_MOBILE}
                    height={THUMB_H_MOBILE}
                    sizes="(max-width: 960px) 34vw, 320px"
                    priority={false}
                  />
                </div>

                {/* Body */}
                <div className="body">
                  <div className="meta">{formatDate(a.date)}</div>
                  <h3 className="title">{a.title}</h3>
                  {a.summary ? <p className="summary">{a.summary}</p> : null}
                </div>
              </Link>

              <hr className="divider" />
            </li>
          );
        })}
      </ul>

      <style jsx>{`
        .list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .item {
          margin: 0;
        }
        .row {
          display: grid;
          grid-template-columns: ${THUMB_W_MOBILE}px 1fr;
          gap: 12px;
          text-decoration: none;
          align-items: start;
        }
        .thumb {
          width: ${THUMB_W_MOBILE}px;
          height: ${THUMB_H_MOBILE}px;
          overflow: hidden;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: #eef3ff;
        }
        .thumb :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .meta {
          color: var(--muted);
          font-size: var(--fs-sm);
          margin-bottom: 4px;
        }
        .title {
          margin: 0 0 4px 0;
          font-family: var(--font-display);
          font-weight: 700;
          line-height: 1.2;
          font-size: clamp(18px, 1.6vw + 14px, 22px);
          color: inherit;
        }
        .summary {
          margin: 0;
          color: var(--muted);
          font-size: var(--fs-sm);
        }
        .divider {
          border: 0;
          height: 1px;
          background: var(--border);
          margin: 12px 0;
        }

        /* Desktop: kaart-tegels (BNR voelt list, maar wij geven grid boven 960px) */
        @media (min-width: 960px) {
          .list {
            display: grid;
            gap: var(--sp-6);
            grid-template-columns: repeat(3, 1fr);
          }
          .item {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: var(--sp-4);
            box-shadow: var(--shadow-sm);
          }
          .row {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .thumb {
            width: 100%;
            height: 160px; /* nette crop op desktop */
            border-radius: 12px;
          }
          .divider {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
