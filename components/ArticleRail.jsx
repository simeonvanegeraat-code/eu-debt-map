"use client";

export default function ArticleRail({
  articles = [],
  title = "More articles",
}) {
  if (!articles.length) return null;

  return (
    <section aria-labelledby="rail-heading" className="space-y-3">
      <h3 id="rail-heading" className="text-lg font-semibold">{title}</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {articles.map((a) => (
          <a
            key={a.slug}
            href={`/articles/${a.slug}`}
            className="min-w-[240px] max-w-[280px] shrink-0 rounded-lg border p-3 hover:shadow-sm transition"
          >
            <div className="text-sm font-medium">{a.title}</div>
            {a.summary ? (
              <p className="text-xs opacity-80 mt-1 line-clamp-3">{a.summary}</p>
            ) : null}
          </a>
        ))}
      </div>
    </section>
  );
}
