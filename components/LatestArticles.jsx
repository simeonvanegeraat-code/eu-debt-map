import Link from "next/link";
import Image from "next/image";

// Bepaal de juiste href op basis van data (taalprefix of expliciete url)
function hrefFor(a) {
  if (!a) return "#";
  if (a.url) return a.url; // loader kan zelf url aanleveren
  const langPrefix = a.lang && a.lang !== "en" ? `/${a.lang}` : "";
  return `${langPrefix}/articles/${a.slug}`;
}

export default function LatestArticles({ articles = [] }) {
  if (!articles?.length) return null;

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
              prefetch={false}
              className="block rounded-xl border border-slate-200 bg-white p-3 hover:shadow-md transition"
              aria-label={a.title}
              rel="bookmark"
            >
              {a.image && (
                <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden mb-2 bg-slate-100">
                  <Image
                    src={a.image}
                    alt={a.imageAlt || a.title}
                    fill
                    priority={false}
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}

              <h3 className="font-medium leading-snug">{a.title}</h3>
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
