import Link from "next/link";
import Image from "next/image";

function hrefFor(a) {
  if (!a) return "#";
  if (a.url) return a.url;
  const langPrefix = a.lang && a.lang !== "en" ? `/${a.lang}` : "";
  return `${langPrefix}/articles/${a.slug}`;
}

export default function ArticleRowCard({ article }) {
  if (!article) return null;

  const {
    title,
    summary,
    image = "/articles/placeholder-600.jpg",
  } = article;

  const href = hrefFor(article);

  return (
    <article className="flex gap-4 items-start border border-slate-200 rounded-2xl p-4 hover:shadow-sm transition">
      <Link
        href={href}
        prefetch={false}
        className="shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
        aria-label={title}
      >
        <div className="relative w-[160px] h-[100px] sm:w-[220px] sm:h-[132px]">
          <Image
            src={image}
            alt={article.imageAlt || title || "Article image"}
            fill
            priority={false}
            loading="lazy"
            sizes="(max-width:640px) 40vw, (max-width:1024px) 25vw, 220px"
            style={{ objectFit: "cover" }}
          />
        </div>
      </Link>

      <div className="min-w-0">
        <h3 className="text-base sm:text-lg font-semibold leading-tight mb-1">
          <Link href={href} prefetch={false} className="hover:underline">
            {title}
          </Link>
        </h3>

        {article.date && (
          <time
            dateTime={article.date}
            className="text-xs text-slate-500 block mb-2"
          >
            {new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(new Date(article.date))}
          </time>
        )}

        {summary && (
          <p className="text-sm text-slate-600 mb-2 line-clamp-3">{summary}</p>
        )}

        {article.tags?.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {article.tags.slice(0, 5).map((t) => (
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
