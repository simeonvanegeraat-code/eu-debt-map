// components/ArticlesShell.jsx
"use client";

import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";

const THUMB = 120; // formaat van de thumbnail in de featured-kaart

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

function SquareThumb({ src, alt }) {
  if (!src) {
    return (
      <div
        aria-hidden
        title={alt}
        style={{
          width: THUMB,
          height: THUMB,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          background:
            "linear-gradient(135deg, rgba(37,99,235,.12), rgba(99,102,241,.10))",
          display: "grid",
          placeItems: "center",
          fontSize: 24,
        }}
      >
        📊
      </div>
    );
  }
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
        border: "1px solid #e5e7eb",
        background: "#f8fafc",
      }}
    />
  );
}

// Locale-bewuste href helper
function articleHref(a) {
  if (!a) return "#";
  if (a.url) return a.url; // lib/articles zet dit al goed indien aanwezig
  const langPrefix = a.lang && a.lang !== "en" ? `/${a.lang}` : "";
  return `${langPrefix}/articles/${a.slug}`;
}

export default function ArticlesShell({ articles = [] }) {
  const featured = articles[0];
  const rest = articles.slice(1);

  const featuredHref = featured ? articleHref(featured) : "#";

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
          <SquareThumb src={featured.image} alt={featured.imageAlt || featured.title} />
          <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
            <div className="tag" style={{ opacity: 0.9 }}>
              Featured · {formatDate(featured.date)}
            </div>
            <h2 style={{ margin: 0, lineHeight: 1.25 }}>
              <Link href={featuredHref}>{featured.title}</Link>
            </h2>

            {featured.summary && (
              <div style={{ color: "#475569" }}>{featured.summary}</div>
            )}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
              {(featured.tags || []).slice(0, 4).map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>

            <div style={{ marginTop: 8 }}>
              <Link href={featuredHref} className="tag">
                Read more →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* GRID */}
      <section className="card">
        <div className="articles-grid">
          {rest.length > 0 ? (
            rest.map((a) => <ArticleCard key={a.slug} article={a} />)
          ) : (
            <div className="tag">No other articles yet.</div>
          )}
        </div>
      </section>

      {/* Page-scoped CSS */}
      <style>{`
        .articles-grid{
          display:grid;
          gap:12px;
          grid-template-columns: 1fr; /* mobiel: 1 kolom */
        }
        @media (min-width: 640px){
          .articles-grid{ grid-template-columns: 1fr 1fr; } /* tablet: 2 kolommen */
        }
        @media (min-width: 1024px){
          .articles-grid{ grid-template-columns: 1fr 1fr 1fr; } /* desktop: 3 kolommen */
        }
      `}</style>
    </main>
  );
}
