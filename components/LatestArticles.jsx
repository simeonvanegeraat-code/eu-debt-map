"use client";

import Link from "next/link";

// Helper: bepaalt juiste href per artikel
function hrefFor(a) {
  if (!a) return "#";
  // Gebruik de url uit je loader als die bestaat
  if (a.url) return a.url;
  // Anders bouw zelf een pad op uit lang + slug
  const langPrefix = a.lang && a.lang !== "en" ? `/${a.lang}` : "";
  return `${langPrefix}/articles/${a.slug}`;
}

export default function LatestArticles({ articles = [] }) {
  if (!articles.length) return null;

  return (
    <section aria-labelledby="latest-articles-heading" className="space-y-4">
      <h2 id="latest-articles-heading" className="text-xl font-semibold">
        Latest articles
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => {
          const href = hrefFor(a);
          return (
            <Link
              key={a.slug}
              href={href}
              className="rounded-xl border p-3 hover:shadow-md transition block"
              aria-label={a.title}
              rel="bookmark"
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
            </Link>
          );
        })}
      </div>
    </section>
  );
}
