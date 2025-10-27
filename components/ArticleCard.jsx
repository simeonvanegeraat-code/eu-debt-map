import Link from "next/link";
import Image from "next/image";

// Build the href from lang + slug unless a.url is provided by your loader
function hrefFor(a) {
  if (!a) return "#";
  if (a.url) return a.url;
  const langPrefix = a.lang && a.lang !== "en" ? `/${a.lang}` : "";
  return `${langPrefix}/articles/${a.slug}`;
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

  const href = hrefFor(article);

  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={title}
      rel="bookmark"
      className="block rounded-xl border border-slate-200 bg-white hover:shadow-md transition"
    >
      {/* Thumb */}
      {image && (
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-xl bg-slate-100">
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            priority={false}
            loading="lazy"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      {/* Body */}
      <div className="grid gap-2 p-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          {date && (
            <time dateTime={date}>
              {new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(new Date(date))}
            </time>
          )}
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

        {summary && (
          <p className="m-0 text-sm text-slate-600 line-clamp-3">{summary}</p>
        )}

        <span className="mt-1 text-[13px] font-semibold text-blue-700">
          Read more →
        </span>
      </div>
    </Link>
  );
}
