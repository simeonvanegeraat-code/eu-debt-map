// components/ArticlesShell.jsx
"use client";

import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { articleImage } from "@/lib/media";

const THUMB = 120; // één plek om de thumbnailmaat te wijzigen

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso || "";
  }
}

function SquareThumb({ article, alt }) {
  const src = articleImage(article, "cover");
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        width={THUMB}
        height={THUMB}
        loading="lazy"
        decoding="async"
        style={{
          width: THUMB,
          height: THUMB,
          objectFit: "cover",
          borderRadius: 12,
          border: "1px solid #1f2b3a",
          background: "#0b1220",
        }}
      />
    );
  }
  return (
    <div
      aria-hidden
      title={alt}
      style={{
        width: THUMB,
        height: THUMB,
        borderRadius: 12,
        border: "1px solid #1f2b3a",
        background:
          "linear-gradient(135deg, rgba(37,99,235,.18), rgba(99,102,241,.12))",
        display: "grid",
        placeItems: "center",
        fontSize: 24,
      }}
    >
      📊
    </div>
  );
}

export default function ArticlesShell({ articles = [] }) {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <main className="container" style={{ display: "grid", gap: 16 }}>
      {/* HERO */}
      <section className="card" style={{ paddingTop: 18, paddingBottom: 18 }}>
        <h1 style={{ margin: 0 }}>EU Debt Articles & Analysis</h1>
        <p className="tag" style={{ marginTop: 6 }}>
          Explainers and insights built on the same Eurostat data as our live map.
        </p>
      </section>

      {/* FEATURED */}
      {featured && (
        <section
          className="card"
          style={{
            display: "grid",
            gridTemplateColumns: `${THUMB}px 1fr`,
            gap: 12,
            alignItems: "start",
          }}
        >
          <SquareThumb article={featured} alt={featured.title} />
          <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
            <div className="tag" style={{ opacity: 0.9 }}>
              Featured · {formatDate(featured.date)}
            </div>
            <h2 style={{ margin: 0, lineHeight: 1.25 }}>
              <Link href={`/articles/${featured.slug}`}>{featured.title}</Link>
            </h2>
            {featured.summary && (
              <div style={{ color: "#c8d1dc" }}>{featured.summary}</div>
            )}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
              {(featured.tags || []).slice(0, 4).map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
            <div style={{ marginTop: 8 }}>
              <Link href={`/articles/${featured.slug}`} className="tag">
                Read more →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* GRID */}
      <section
        className="card"
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {rest.length > 0 ? (
          rest.map((a) => <ArticleCard key={a.slug} article={a} />)
        ) : (
          <div className="tag">No other articles yet.</div>
        )}
      </section>
    </main>
  );
}
