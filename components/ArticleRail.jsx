import Link from "next/link";
import Image from "next/image";

function hrefFor(a) {
  if (!a) return "#";
  if (a.url) return a.url;
  const langPrefix = a.lang && a.lang !== "en" ? `/${a.lang}` : "";
  return `${langPrefix}/articles/${a.slug}`;
}

export default function ArticleRail({
  articles = [],
  title = "More articles",
}) {
  if (!articles?.length) return null;

  return (
    <section aria-labelledby="rail-heading" className="space-y-3">
      <h3 id="rail-heading" className="text-lg font-semibold">{title}</h3>

      <div
        className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]"
        role="list"
        aria-label="More articles"
      >
        {articles.map((a) => {
          const href = hrefFor(a);
          return (
            <Link
              key={a.slug}
              href={href}
              prefetch={false}
              role="listitem"
              className="min-w-[240px] max-w-[280px] shrink-0 rounded-lg border border-slate-200 bg-white p-3 hover:shadow-sm transition snap-start"
              aria-label={a.title}
              rel="bookmark"
            >
              {a.image && (
                <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden mb-2 bg-slate-100">
                  <Image
                    src={a.image}
                    alt={a.imageAlt || a.title}
                    fill
                    loading="lazy"
                    priority={false}
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 280px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}

              <div className="text-sm font-medium leading-snug">{a.title}</div>
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
