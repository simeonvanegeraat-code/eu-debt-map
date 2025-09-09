// components/ArticlesShell.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

const uniq = (arr) => Array.from(new Set(arr)).filter(Boolean);

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

export default function ArticlesShell({ articles, initialTag = "All", initialQ = "" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const featured = articles[0];
  const rest = articles.slice(1);

  const allTags = useMemo(
    () => uniq(articles.flatMap((a) => a.tags || [])).sort(),
    [articles]
  );

  const [q, setQ] = useState(initialQ);
  const [active, setActive] = useState(initialTag);

  // URL sync (?tag=&q=)
  useEffect(() => {
    const sp = new URLSearchParams(searchParams?.toString() || "");
    if (active && active !== "All") sp.set("tag", active);
    else sp.delete("tag");
    if (q?.trim()) sp.set("q", q.trim());
    else sp.delete("q");
    const next = sp.toString() ? `${pathname}?${sp.toString()}` : pathname;
    router.replace(next, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, q]);

  // Filter (zonder featured)
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rest.filter((a) => {
      const inTag =
        active === "All" ||
        (a.tags || [])
          .map((t) => t.toLowerCase())
          .includes((active || "").toLowerCase());
      if (!inTag) return false;
      if (!needle) return true;
      const hay = `${a.title} ${a.summary || ""} ${(a.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [rest, q, active]);

  const hasActiveFilters = active !== "All" || q.trim().length > 0;

  return (
    <main className="container" style={{ display: "grid", gap: 16 }}>
      {/* HERO */}
      <section className="card" style={{ paddingTop: 18, paddingBottom: 18 }}>
        <h1 style={{ margin: 0 }}>EU Debt Articles & Analysis</h1>
        <p className="tag" style={{ marginTop: 6 }}>
          Explainers and insights built on the same Eurostat data as our live map.
        </p>
      </section>

      {/* CONTROLS — zoek boven, tags eronder */}
      <section className="card" style={{ display: "grid", gap: 12 }}>
        {/* Search */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
            style={{
              flex: 1,
              height: 40,
              padding: "0 12px",
              borderRadius: 10,
              border: "1px solid #1f2b3a",
              background: "#0b1220",
              color: "inherit",
            }}
          />
          {(q || active !== "All") && (
            <button
              className="tag"
              onClick={() => {
                setQ("");
                setActive("All");
              }}
              title="Clear filters"
            >
              Clear
            </button>
          )}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={() => setActive("All")} className="plain" aria-pressed={active === "All"}>
            <span
              className="tag"
              style={{
                border: "1px solid " + (active === "All" ? "#3256e1" : "#1f2b3a"),
                background: active === "All" ? "rgba(49,130,246,.15)" : "rgba(255,255,255,.03)",
                padding: "6px 10px",
                borderRadius: 999,
                fontWeight: 600,
              }}
            >
              All
            </span>
          </button>
          {allTags.map((t) => {
            const isActive = active === t;
            return (
              <button key={t} onClick={() => setActive(t)} className="plain" aria-pressed={isActive}>
                <span
                  className="tag"
                  style={{
                    border: "1px solid " + (isActive ? "#3256e1" : "#1f2b3a"),
                    background: isActive ? "rgba(49,130,246,.15)" : "rgba(255,255,255,.03)",
                    padding: "6px 10px",
                    borderRadius: 999,
                    fontWeight: 600,
                  }}
                >
                  {t}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* FEATURED — nu hetzelfde thumbformaat en grid als de rest */}
      {!hasActiveFilters && featured && (
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

      {/* GRID met gewone kaarten (gebruikt ArticleCard met dezelfde 120×120 thumb) */}
      <section
        className="card"
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {filtered.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
        {filtered.length === 0 && (
          <div className="tag">No articles match your filters.</div>
        )}
      </section>

      <style>{`.plain{background:transparent;border:0;padding:0;cursor:pointer}`}</style>
    </main>
  );
}
