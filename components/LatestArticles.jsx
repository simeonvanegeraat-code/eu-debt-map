"use client";

export default function LatestArticles({ articles = [] }) {
  if (!articles.length) return null;
  return (
    <section aria-labelledby="latest-articles-heading" className="space-y-4">
      <h2 id="latest-articles-heading" className="text-xl font-semibold">
        Latest articles
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <a
            key={a.slug}
            href={`/articles/${a.slug}`}
            className="rounded-xl border p-3 hover:shadow-md transition"
          >
            {a.image ? (
              <img
                src={a.image}
                alt={a.imageAlt || a.title}
                className="w-full h-40 object-cover rounded-md mb-2"
                loading="lazy"
                decoding="async"
              />
            ) : null}
            <h3 className="font-medium">{a.title}</h3>
            {a.summary ? (
              <p className="text-sm opacity-80 mt-1 line-clamp-3">{a.summary}</p>
            ) : null}
          </a>
        ))}
      </div>
    </section>
  );
}
