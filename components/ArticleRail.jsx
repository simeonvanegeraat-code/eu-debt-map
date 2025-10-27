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
              className="min-w-[240px] max-w-[280px] shrink-0 rounded-lg border border-slate-200 p-3 hover:shadow-sm transition"
              aria-label={a.title}
              rel="bookmark"
            >
              <div className="text-sm font-medium leading-tight">{a.title}</div>
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
