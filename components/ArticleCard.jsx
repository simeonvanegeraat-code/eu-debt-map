"use client";

import Link from "next/link";

// Veilige href (eerst expliciete url, anders /{lang?}/articles/{slug})
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
    excerpt,
    image,
    imageAlt,
    date,
    tags = [],
    lang = "en",
    slug,
  } = article;

  const href = articleHref(article);
  const text = summary || excerpt || "";

  return (
    <Link
      href={href}
      aria-label={title}
      rel="bookmark"
      className="
        group
        block
        rounded-2xl
        border border-slate-200/80
        bg-white
        shadow-[0_6px_16px_rgba(15,23,42,0.05)]
        hover:shadow-[0_14px_32px_rgba(15,23,42,0.14)]
        hover:bg-slate-50/70
        transition-all duration-150
        overflow-hidden
      "
    >
      {/* 16:9 thumbnail, voorkomt CLS door aspect-ratio container */}
      {image && (
        <div
          className="
            w-full
            aspect-[16/9]
            overflow-hidden
            bg-slate-100
          "
        >
          <img
            src={image}
            alt={imageAlt || title}
            loading="lazy"
            decoding="async"
            width={800}
            height={450}
            className="
              h-full w-full object-cover
              transition-transform duration-150
              group-hover:scale-[1.03]
            "
          />
        </div>
      )}

      <div className="grid gap-2.5 p-3.5">
        {/* Meta: datum + max 2 tags */}
        <div className="flex flex-wrap items-center gap-1.5 text-[0.7rem] text-slate-500">
          {date && (
            <time
              dateTime={date}
              className="font-medium uppercase tracking-[0.14em]"
            >
              {formatDate(date, lang)}
            </time>
          )}
          {tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="
                px-2 py-0.5
                rounded-full
                border border-slate-200
                bg-slate-50
                text-[0.65rem]
                font-semibold
                text-slate-700
              "
            >
              {t}
            </span>
          ))}
        </div>

        {/* Titel */}
        <h3
          className="
            m-0
            text-[1.02rem]
            leading-snug
            font-semibold
            text-slate-900
            line-clamp-3
          "
        >
          {title}
        </h3>

        {/* Korte samenvatting */}
        {text && (
          <p
            className="
              m-0
              text-[0.82rem]
              leading-snug
              text-slate-600
              line-clamp-3
            "
          >
            {text}
          </p>
        )}

        {/* Subtle CTA */}
        <span
          className="
            mt-0.5
            text-[0.78rem]
            font-semibold
            text-sky-700
            group-hover:text-sky-800
          "
        >
          Read more →
        </span>
      </div>
    </Link>
  );
}

function formatDate(iso, lang = "en") {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat(
      lang && lang !== "en" ? lang : "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(new Date(iso));
  } catch {
    return iso;
  }
}
