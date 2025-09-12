// components/LatestArticles.jsx
import Link from "next/link";
import { articles } from "@/lib/articles";

export default function LatestArticles({ max = 3 }) {
  const list = Array.isArray(articles) ? [...articles] : [];
  // Sorteer aflopend op date (YYYY-MM-DD)
  list.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const picks = list.slice(0, max);

  if (!picks.length) return null;

  return (
    <div className="card" style={{ padding: 12 }}>
      <h3 className="text-base font-semibold mb-2">Latest articles</h3>
      <ul className="space-y-2">
        {picks.map((a) => (
          <li key={a.slug}>
            <Link className="link" href={`/articles/${a.slug}`}>
              {a.title}
            </Link>
            {a.date && (
              <span className="text-xs text-slate-400"> — {a.date}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
