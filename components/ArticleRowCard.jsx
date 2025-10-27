"use client";

import Link from "next/link";

function articleHref(a) {
  if (!a) return "#";
  if (a.url) return a.url;
  const lang = a.lang && a.lang !== "en" ? `/${a.lang}` : "";
  return `${lang}/articles/${a.slug}`;
}

export default function ArticleRowCard({ article }) {
  if (!article) return null;

  const {
    title,
    summary,
    image = "/articles/placeholder-600.jpg",
    imageAlt = title || "Article image",
    date,
    tags = [],
  } = article;

  const href = articleHref(article);

  return (
    <article className="flex gap-4 items-start rounded-2xl border border-slate-200 p-4 hover:shadow-sm transition">
      <Link
        href={href}
        className="shrink-0 overflow-hidden rounded-xl border border-slate-200"
        aria-label={title}
        rel="bookmark"
      >
        <img
          src={image}
          alt={imageAlt}
          width={320}
          height={180}
          loading="lazy"
          decoding="async"
          className="block w-[160px] h-[90px] md:w-[200px] md:h-[112px] object-cover"
        />
      </Link>

      <div className="min-w-0">
        <h3 className="mb-1 text-lg font-semibold leading-tight">
          <Link href={href} className="hover:underline" rel="bookmark">
            {title}
          </Link>
        </h3>

        {date ? (
          <time
            dateTime={date}
            className="block mb-2 text-xs text-slate-500"
            aria-label={`Published on ${date}`}
          >
            {new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(new Date(date))}
          </time>
        ) : null}

        {summary ? (
          <p className="mb-3 text-sm text-slate-600 line-clamp-3">{summary}</p>
        ) : null}

        {tags?.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {tags.slice(0, 5).map((t) => (
              <li
                key={t}
                className="text-[11px] px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200"
              >
                #{t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
