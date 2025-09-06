// app/articles/page.jsx
import { listArticles } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";

// simpele metadata
export const metadata = {
  title: "Articles • EU Debt Map",
  description: "Analysis, explainers and trends around EU government debt.",
};

function TagFilter({ tags = [], active, base = "/articles" }) {
  const unique = Array.from(new Set(tags.flat())).slice(0, 12);
  const activeStyle = {
    borderColor: "#2b3a4f",
    background: "#0d1424",
  };

  return (
    <div className="card" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Link
        href={base}
        className="tag"
        style={!active ? activeStyle : undefined}
      >
        All
      </Link>
      {unique.map((t) => (
        <Link
          key={t}
          href={`${base}?tag=${encodeURIComponent(t)}`}
          className="tag"
          style={active === t ? activeStyle : undefined}
        >
          {t}
        </Link>
      ))}
    </div>
  );
}

export default function ArticlesPage({ searchParams }) {
  const tag = searchParams?.tag || null;

  const items = listArticles(); // eventueel: { lang: "en" }
  const tags = items.map((a) => a.tags || []);
  const filtered = tag ? items.filter((a) => a.tags?.includes(tag)) : items;

  return (
    <main className="container grid" style={{ alignItems: "start" }}>
      <section className="card" style={{ gridColumn: "1 / -1" }}>
        <h2 style={{ marginTop: 0, marginBottom: 6 }}>Latest articles</h2>
        <p className="tag" style={{ margin: 0 }}>
          Analysis and explainers built on the same Eurostat data as our live map.
        </p>
      </section>

      <TagFilter tags={tags} active={tag} />

      <section
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 12,
          gridColumn: "1 / -1",
        }}
      >
        {filtered.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
        {filtered.length === 0 && (
          <div className="card">No articles found for this tag.</div>
        )}
      </section>
    </main>
  );
}
