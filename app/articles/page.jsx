// app/articles/page.jsx
import Link from "next/link";
import { listArticles } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";

// ---- Page metadata ----
export const metadata = {
  title: "Articles & Analysis • EU Debt Map",
  description:
    "Explainers and insights on EU government debt, built on the same Eurostat data as our live map.",
  alternates: { canonical: "https://www.eudebtmap.com/articles" },
  openGraph: {
    title: "Articles & Analysis • EU Debt Map",
    description:
      "Explainers and insights on EU government debt, built on Eurostat data.",
    url: "https://www.eudebtmap.com/articles",
    siteName: "EU Debt Map",
    type: "website",
  },
};

// ---- helpers (server-safe) ----
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

function uniq(arr) {
  return Array.from(new Set(arr)).filter(Boolean);
}

function Thumbnail({ article }) {
  const alt = article.title || "Article";
  const src = article.image || null; // optioneel: gebruik wanneer beschikbaar
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: 140,
          objectFit: "cover",
          borderRadius: 12,
          border: "1px solid #1f2b3a",
          background: "#0b1220",
        }}
        loading="lazy"
      />
    );
  }
  // fallback-blok
  return (
    <div
      aria-hidden
      style={{
        height: 140,
        borderRadius: 12,
        border: "1px solid #1f2b3a",
        background:
          "linear-gradient(135deg, rgba(37,99,235,.18), rgba(99,102,241,.12))",
        display: "grid",
        placeItems: "center",
        fontWeight: 700,
        letterSpacing: 0.2,
      }}
    >
      📊
    </div>
  );
}

// ---- Client-shell voor filters/zoeken + URL sync ----
function ClientShell({ articles, initialTag = "All", initialQ = "" }) {
  "use client";

  const { useMemo, useState, useEffect } = require("react");
  const { useRouter, usePathname, useSearchParams } = require("next/navigation");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // featured = nieuwste
  const featured = articles[0];
  const rest = articles.slice(1);

  const allTags = useMemo(
    () => uniq(articles.flatMap((a) => a.tags || [])).sort(),
    [articles]
  );

  const [q, setQ] = useState(initialQ);
  const [active, setActive] = useState(initialTag);

  // sync naar URL (?tag=&q=)
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

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rest.filter((a) => {
      const inTag =
        active === "All" ||
        (a.tags || []).map((t) => t.toLowerCase()).includes(active.toLowerCase());
      if (!inTag) return false;
      if (!needle) return true;
      const hay =
        `${a.title} ${a.excerpt || ""} ${(a.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [rest, q, active]);

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
            gap: 16,
            gridTemplateColumns: "minmax(240px, 360px) 1fr",
          }}
        >
          <div>
            <Thumbnail article={featured} />
          </div>
          <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
            <div className="tag" style={{ opacity: 0.9 }}>
              Featured · {formatDate(featured.date)}
            </div>
            <h2 style={{ margin: 0 }}>
              <Link href={`/articles/${featured.slug}`}>{featured.title}</Link>
            </h2>
            <div style={{ color: "#c8d1dc" }}>{featured.excerpt}</div>
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

      {/* CONTROLS */}
      <section
        className="card"
        style={{ display: "grid", gap: 12, paddingTop: 14, paddingBottom: 14 }}
      >
        {/* Tag-filters */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setActive("All")}
            className="plain"
            aria-pressed={active === "All"}
            title="Show all articles"
          >
            <span
              className="tag"
              style={{
                border: "1px solid " + (active === "All" ? "#3256e1" : "#1f2b3a"),
                background:
                  active === "All" ? "rgba(49,130,246,.15)" : "rgba(255,255,255,.03)",
                padding: "6px 10px",
                borderRadius: 999,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              All
            </span>
          </button>
          {allTags.map((t) => {
            const isActive = active === t;
            return (
              <button
                key={t}
                onClick={() => setActive(t)}
                className="plain"
                aria-pressed={isActive}
                title={`Filter: ${t}`}
              >
                <span
                  className="tag"
                  style={{
                    border: "1px solid " + (isActive ? "#3256e1" : "#1f2b3a"),
                    background:
                      isActive ? "rgba(49,130,246,.15)" : "rgba(255,255,255,.03)",
                    padding: "6px 10px",
                    borderRadius: 999,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {t}
                </span>
              </button>
            );
          })}
        </div>

        {/* Zoeken */}
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
      </section>

      {/* GRID – gebruikt je bestaande ArticleCard */}
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

      <style>{`
        .plain { background: transparent; border: 0; padding: 0; cursor: pointer; }
      `}</style>
    </main>
  );
}

// ---- Server wrapper: haalt data op en leest query (?tag,&q) ----
export default function ArticlesPage({ searchParams }) {
  const all = listArticles().slice().sort((a, b) => {
    const da = +new Date(a.date || 0);
    const db = +new Date(b.date || 0);
    return db - da;
  });

  const initialTag = searchParams?.tag ? String(searchParams.tag) : "All";
  const initialQ = searchParams?.q ? String(searchParams.q) : "";

  return <ClientShell articles={all} initialTag={initialTag} initialQ={initialQ} />;
}
