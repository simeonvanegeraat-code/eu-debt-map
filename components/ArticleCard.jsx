// components/ArticleCard.jsx
import Link from "next/link";
import { articleImage } from "@/lib/media";

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

export default function ArticleCard({ article }) {
  const src = articleImage(article, "cover");
  const alt = article.imageAlt || article.title || "Article";

  return (
    <article
      className="card"
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr",
        gap: 12,
        alignItems: "start",
      }}
    >
      {/* Thumbnail */}
      {src ? (
        <img
          src={src}
          alt={alt}
          width={120}
          height={120}
          loading="lazy"
          decoding="async"
          style={{
            width: 120,
            height: 120,
            objectFit: "cover",
            borderRadius: 12,
            border: "1px solid #1f2b3a",
            background: "#0b1220",
          }}
        />
      ) : (
        <div
          aria-hidden
          title={alt}
          style={{
            width: 120,
            height: 120,
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
      )}

      {/* Tekst */}
      <div style={{ display: "grid", gap: 6, alignContent: "start" }}>
        <div className="tag" style={{ opacity: 0.9 }}>
          {formatDate(article.date)}{" "}
          {(article.tags || []).slice(0, 4).map((t) => (
            <span key={t} className="tag" style={{ marginLeft: 6 }}>
              {t}
            </span>
          ))}
        </div>

        <h3 style={{ margin: 0, lineHeight: 1.25 }}>
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>

        {article.summary && (
          <p className="tag" style={{ margin: 0 }}>
            {article.summary}
          </p>
        )}

        <div>
          <Link href={`/articles/${article.slug}`} className="tag">
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
