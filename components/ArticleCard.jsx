"use client";

import Link from "next/link";

// Bepaal veilige href (eerst expliciete url, anders /{lang?}/articles/{slug})
function articleHref(a) {
  if (!a) return "#";
  if (a.url) return a.url;
  const lang = a.lang && a.lang !== "en" ? `/${a.lang}` : "";
  return `${lang}/articles/${a.slug}`;
}

export default function ArticleCard({ article }) {
  if (!article) return null;

  const {
    title,
    summary,
    image,
    imageAlt,
    date,
    tags = [],
  } = article;

  const href = articleHref(article);

  return (
    <Link
      href={href}
      className="block rounded-xl border border-slate-200 bg-white hover:shadow-sm transition-shadow"
      aria-label={title}
      rel="bookmark"
    >
      {image ? (
        <div className="w-full overflow-hidden rounded-t-xl">
          {/* kleine, vaste thumbnail om CLS te voorkomen */}
          <img
            src={image}
            alt={imageAlt || title}
            width={800}
            height={450}
            loading="lazy"
            decoding="async"
            className="block w-full h-40 object-cover"
          />
        </div>
      ) : null}

      <div className="grid gap-2 p-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          {date ? (
            <time dateTime={date}>
              {new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(new Date(date))}
            </time>
          ) : null}
          {tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-full border border-slate-200 bg-slate-50 font-semibold"
            >
              {t}
            </span>
          ))}
        </div>

        <h3 className="m-0 text-[16px] leading-tight font-semibold">{title}</h3>

        {summary ? (
          <p className="m-0 text-[14px] text-slate-600 line-clamp-3">{summary}</p>
        ) : null}

        <span className="mt-1 text-[13px] font-semibold text-blue-700">Read more →</span>
      </div>
    </Link>
  );
}
