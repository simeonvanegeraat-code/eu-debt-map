// components/ArticleRail.jsx
import Link from "next/link";
import Image from "next/image";
import { articles } from "@/lib/articles";

export default function ArticleRail({ currentSlug, lang, max = 4, title = "Keep reading" }) {
  const list = Array.isArray(articles) ? [...articles] : [];

  // filter: niet het huidige artikel
  let picks = list.filter(a => a?.slug !== currentSlug);

  // als er voldoende artikelen in dezelfde taal zijn, beperk daarop
  if (lang && picks.some(a => a?.lang === lang)) {
    picks = picks.filter(a => a?.lang === lang);
  }

  // sorteer op datum aflopend
  picks.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  picks = picks.slice(0, max);

  if (!picks.length) return null;

  return (
    <section className="card" style={{ padding: 12, marginTop: 16 }}>
      <h3 className="text-base font-semibold mb-3">{title}</h3>

      <div
        className="grid"
        style={{
          gap: 12,
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        }}
      >
        {picks.map((a) => {
          const img = a.image || "/articles/placeholder-600.jpg";
          const alt = a.imageAlt || a.title || "Article image";

          return (
            <Link
              key={a.slug}
              href={`/articles/${a.slug}`}
              className="group flex gap-3 items-start"
              aria-label={a.title}
            >
              <div
                className="shrink-0 overflow-hidden rounded-xl border border-slate-800"
                style={{ width: 96, height: 96, background: "#0b1220" }}
              >
                <Image
                  src={img}
                  alt={alt}
                  width={300}
                  height={300}
                  sizes="96px"
                  style={{
                    width: "96px",
                    height: "96px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              <div className="min-w-0">
                <div className="text-sm font-semibold leading-snug group-hover:underline">
                  {a.title}
                </div>
                {a.date && (
                  <time
                    className="text-xs text-slate-400 block mt-1"
                    dateTime={a.date}
                  >
                    {a.date}
                  </time>
                )}
                {a.summary && (
                  <p className="text-sm text-slate-300 mt-1 line-clamp-2">
                    {a.summary}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
