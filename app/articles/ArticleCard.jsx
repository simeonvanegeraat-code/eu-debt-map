// app/articles/page.jsx
import { listArticles } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";
import { getLocaleFromPathname, withLocale } from "@/lib/locale";
import Link from "next/link";

export const metadata = {
  title: "Articles • EU Debt Map",
  description: "Analysis, explainers and trends around EU government debt.",
};

function TagFilter({ tags = [], active, base = "/articles" }) {
  const unique = Array.from(new Set(tags.flat())).slice(0, 12);
  return (
    <div className="card" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Link href={base} className={"tag" + (!active ? " tag--active" : "")}>All</Link>
      {unique.map((t) => (
        <Link
          key={t}
          href={`${base}?tag=${encodeURIComponent(t)}`}
          className={"tag" + (active === t ? " tag--active" : "")}
        >
          {t}
        </Link>
      ))}
      <style jsx>{`
        .tag--active { border-color:#2b3a4f; background:#0d1424; }
      `}</style>
    </div>
  );
}

export default function ArticlesPage({ searchParams, params }) {
  // Bepaal taal uit URL prefix
  // Next app router geeft pathname niet hier; gebruik lang uit params niet nodig
  const tag = searchParams?.tag || null;

  // Voor nu: Engels lijstje; later kun je per taal filteren
  const items = listArticles(); // { lang: "en" } eventueel
  const tags = items.map(a => a.tags || []);

  const filtered = tag ? items.filter(a => a.tags?.includes(tag)) : items;

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
