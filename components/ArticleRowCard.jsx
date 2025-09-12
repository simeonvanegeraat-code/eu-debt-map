// components/ArticleRowCard.jsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function ArticleRowCard({ article }) {
  if (!article) return null;

  const {
    slug,
    title,
    summary,
    image = "/articles/placeholder-600.jpg",
    imageAlt = title || "Article image",
    date,
    tags = [],
  } = article;

  return (
    <article className="flex gap-4 items-start border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-colors">
      <Link
        href={`/articles/${slug}`}
        className="shrink-0 rounded-xl overflow-hidden border border-slate-800"
        aria-label={title}
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
          <Link href={`/articles/${slug}`} className="hover:underline">
            {title}
          </Link>
        </h3>

        {date && (
          <time
            dateTime={date}
            className="text-xs text-slate-400 block mb-2"
            aria-label={`Published on ${date}`}
          >
            {date}
          </time>
        )}

        <p className="text-sm text-slate-300 mb-3 line-clamp-3">{summary}</p>

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
