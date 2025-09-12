// components/LatestArticles.jsx
import Link from "next/link";
import Image from "next/image";
import { articles } from "@/lib/articles";

export default function LatestArticles({ max = 1 }) {
  const list = Array.isArray(articles) ? [...articles] : [];
  list.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const picks = list.slice(0, max);

  if (!picks.length) return null;

  return (
    <div className="card" style={{ padding: 12 }}>
      <h3 className="text-base font-semibold mb-3">Latest article</h3>

      {picks.map((a) => (
        <Link
          key={a.slug}
          href={`/articles/${a.slug}`}
          className="flex gap-3 items-start group"
          aria-label={a.title}
        >
          <div
            className="shrink-0 overflow-hidden rounded-xl border border-slate-800"
            style={{ width: 120, height: 120, background: "#0b1220" }}
          >
            <Image
              src={a.image || "/articles/placeholder-600.jpg"}
              alt={a.imageAlt || a.title || "Article image"}
              width={600}
              height={600}
              sizes="120px"
              style={{ display: "block", width: "120px", height: "120px", objectFit: "cover" }}
            />
          </div>

          <div className="min-w-0">
            <div className="text-sm font-semibold group-hover:underline">{a.title}</div>
            {a.date && (
              <time className="text-xs text-slate-400 block mt-1" dateTime={a.date}>
                {a.date}
              </time>
            )}
            {a.summary && (
              <p className="text-sm text-slate-300 mt-2 line-clamp-3">{a.summary}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
