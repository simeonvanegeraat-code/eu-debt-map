"use client";

import Link from "next/link";

function hrefFor(a) {
  if (!a) return "#";
  if (a.url) return a.url;
  const lang = a.lang && a.lang !== "en" ? `/${a.lang}` : "";
  return `${lang}/articles/${a.slug}`;
}

export default function ArticleRail({
  articles = [],
  title = "More articles",
}) {
  if (!articles.length) return null;

  const headingId =
    "rail-heading-" +
    (title || "more").toLowerCase().replace(/\s+/g, "-");

  return (
    <section
      aria-labelledby={headingId}
      className="mt-6 space-y-2"
    >
      <h3
        id={headingId}
        className="text-base font-semibold tracking-tight text-slate-900"
      >
        {title}
      </h3>
      <p className="text-xs text-slate-500">
        Related EU debt and fiscal insights to explore next.
      </p>

      {/* Mobile: horizontal scroll, Desktop: grid */}
      <div
        className="
          flex gap-3 overflow-x-auto pb-2
          md:grid md:grid-cols-3 md:gap-4 md:overflow-visible
        "
      >
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={hrefFor(a)}
            aria-label={a.title}
            rel="bookmark"
            className="
              group
              w-[260px] shrink-0
              md:w-auto md:shrink
              flex flex-col
              rounded-2xl
              border border-slate-200/80
              bg-white
              shadow-[0_6px_16px_rgba(15,23,42,0.06)]
              hover:shadow-[0_14px_32px_rgba(15,23,42,0.14)]
              hover:bg-slate-50/80
              transition-all duration-150
              overflow-hidden
            "
          >
            {/* 16:9 thumbnail */}
            <div className="w-full aspect-[16/9] bg-slate-100 overflow-hidden">
              <img
                src={a.image || "/images/articles/placeholder.jpg"}
                alt={a.imageAlt || a.title}
                loading="lazy"
                decoding="async"
                className="
                  h-full w-full object-cover
                  group-hover:scale-[1.03]
                  transition-transform duration-150
                "
              />
            </div>

            {/* Tekst */}
            <div className="flex flex-col gap-1.5 p-3">
              {a.date && (
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-slate-400">
                  {formatDate(a.date, a.lang)}
                </p>
              )}
              <div className="text-[0.9rem] font-semibold leading-snug text-slate-900 line-clamp-3">
                {a.title}
              </div>
              {(a.summary || a.excerpt) && (
                <p className="mt-0.5 text-[0.78rem] leading-snug text-slate-600 line-clamp-3">
                  {a.summary || a.excerpt}
                </p>
              )}
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
