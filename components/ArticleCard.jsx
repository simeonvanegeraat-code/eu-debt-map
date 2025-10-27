// components/ArticleCard.jsx  (server component)
import Link from "next/link";

// Build the href from lang + slug unless a.url is provided by your loader
function hrefFor(a) {
  if (!a) return "#";
  if (a.url) return a.url;
  const langPrefix = a.lang && a.lang !== "en" ? `/${a.lang}` : "";
  return `${langPrefix}/articles/${a.slug}`;
}

export default function ArticleCard({ article }) {
  if (!article) return null;

  const { title, summary, image, imageAlt, date, tags = [] } = article;
  const href = hrefFor(article);

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    border: "1px solid var(--border)",
    borderRadius: 12,
    overflow: "hidden",
    background: "#fff",
    textDecoration: "none",
  };

  const thumbWrapStyle = {
    width: "100%",
    height: 160, // <<< fixed, reliable on every setup
    background: "#eef3ff",
    overflow: "hidden",
    borderBottom: "1px solid var(--border)",
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  const bodyStyle = { display: "grid", gap: 6, padding: 10 };
  const metaStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "center",
    fontSize: 12,
    color: "#334155",
    opacity: 0.9,
  };
  const pillStyle = {
    padding: "2px 8px",
    borderRadius: 999,
    border: "1px solid #e5e7eb",
    background: "#f8fafc",
    fontWeight: 600,
  };

  return (
    <Link href={href} prefetch={false} aria-label={title} rel="bookmark" style={cardStyle}>
      {image && (
        <div style={thumbWrapStyle}>
          <img src={image} alt={imageAlt || title} loading="lazy" decoding="async" style={imgStyle} />
        </div>
      )}

      <div style={bodyStyle}>
        <div style={metaStyle}>
          {date && (
            <time dateTime={date}>
              {new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(new Date(date))}
            </time>
          )}
          {tags.slice(0, 2).map((t) => (
            <span key={t} style={pillStyle}>
              {t}
            </span>
          ))}
        </div>

        <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.25, color: "inherit" }}>{title}</h3>

        {summary && (
          <p
            style={{
              margin: 0,
              color: "#475569",
              fontSize: 14,
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {summary}
          </p>
        )}

        <span style={{ marginTop: 4, fontSize: 13, color: "#1d4ed8", fontWeight: 600 }}>Read more →</span>
      </div>
    </Link>
  );
}
