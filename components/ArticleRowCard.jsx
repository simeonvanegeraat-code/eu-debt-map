// components/ArticleRowCard.jsx
"use client";

import Link from "next/link";
import Image from "next/image";

// Kleine helper om een taalbewuste URL te maken.
// - gebruikt eventueel a.url als je die al meegeeft
// - anders: /<lang>/articles/<slug> met '' voor Engels
function articleHref(article) {
  if (!article) return "#";
  if (article.url) return article.url;

  const slug = article.slug || "";
  const lang = article.lang && article.lang !== "en" ? `/${article.lang}` : "";
  return `${lang}/articles/${slug}`;
}

export default function ArticleRowCard({ article }) {
  if (!article) return null;

  const {
    title,
    summary,
    image = "/images/articles/placeholder-600.jpg",
    imageAlt = title || "Article image",
    date,
    tags = [],
  } = article;

  const href = articleHref(article);

  // Mooie, korte datum in en-GB stijl
  const niceDate =
    date &&
    new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));

  return (
    <article className="flex gap-4 items-start border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-colors">
      <Link
        href={href}
        className="shrink-0 rounded-xl overflow-hidden border border-slate-800"
        aria-label={title}
        rel="bookmark"
      >
        <Image
          src={image}
          alt={imageAlt}
          width={600}
          height={600}
          priority={false}
          sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 600px"
          style={{ display: "block", background: "#0b1220" }}
        />
      </Link>

      <div className="min-w-0">
        <h3 className="text-lg font-semibold leading-tight mb-1">
          <Link href={href} className="hover:underline" rel="bookmark">
            {title}
          </Link>
        </h3>

        {niceDate && (
          <time
            dateTime={date}
            className="text-xs text-slate-400 block mb-2"
            aria-label={`Published on ${niceDate}`}
          >
            {niceDate}
          </time>
        )}

        {summary && (
          <p className="text-sm text-slate-300 mb-3 line-clamp-3">{summary}</p>
        )}

        {tags?.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {tags.slice(0, 5).map((t) => (
              <li
                key={t}
                className="text-[11px] px-2 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
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
