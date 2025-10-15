"use client";

import Link from "next/link";

function hrefFor(a) {
  if (!a) return "#";
  // Gebruik URL van de loader als die bestaat
  if (a.url) return a.url;
  // Anders: bouw 'm uit lang + slug
  const langPrefix = a.lang && a.lang !== "en" ? `/${a.lang}` : "";
  return `${langPrefix}/articles/${a.slug}`;
}

export default function ArticleRail({
  articles = [],
  title = "More articles",
}) {
  if (!articles.length) return null;

  return (
    <section aria-labelledby="rail-heading" className="space-y-3">
      <h3 id="rail-heading" className="text-lg font-semibold">{title}</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {articles.map((a) => {
          const href = hrefFor(a);
          return (
            <Link
              key={a.slug}
              href={href}
              className="min-w-[240px] max-w-[280px] shrink-0 rounded-lg border p-3 hover:shadow-sm transition"
              aria-label={a.title}
              rel="bookmark"
            >
              <div className="text-sm font-medium">{a.title}</div>
              {a.summary ? (
                <p className="text-xs opacity-80 mt-1 line-clamp-3">{a.summary}</p>
              ) : null}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
