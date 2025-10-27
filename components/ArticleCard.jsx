import Link from "next/link";
import Image from "next/image";

// Bouw correcte href met taalprefix; valt terug op en
function articleHref(article) {
  if (!article) return "#";
  if (article.url) return article.url;           // expliciete URL wint
  const slug = article.slug || "";
  const lang = article.lang && article.lang !== "en" ? `/${article.lang}` : "";
  return `${lang}/articles/${slug}`;
}

export default function ArticleCard({ article }) {
  if (!article) return null;

  const { title, summary, image, imageAlt, date, tags = [] } = article;
  const href = articleHref(article);

  return (
    <Link href={href} className="article-card" aria-label={title} rel="bookmark" prefetch={false}>
      {image && (
        <div className="thumb" aria-hidden>
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
            loading="lazy"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      <div className="body">
        <div className="meta">
          {date && (
            <time dateTime={date}>
              {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                .format(new Date(date))}
            </time>
          )}
          {tags.slice(0, 2).map((t) => (
            <span key={t} className="pill">{t}</span>
          ))}
        </div>

        <h3 className="title">{title}</h3>
        {summary && <p className="excerpt">{summary}</p>}
        <span className="more">Read more →</span>
      </div>

      <style jsx>{`
        .article-card{display:flex;flex-direction:column;border:1px solid var(--border);
          border-radius:12px;overflow:hidden;background:#fff;transition:box-shadow .15s ease,transform .05s ease}
        .article-card:hover{box-shadow:var(--shadow-sm);transform:translateY(-1px)}
        .thumb{position:relative;width:100%;aspect-ratio:16/9;background:#eef3ff}
        .body{display:grid;gap:6px;padding:10px}
        .meta{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12px;color:#334155;opacity:.9}
        .pill{padding:2px 8px;border-radius:999px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600}
        .title{margin:0;font-size:16px;line-height:1.25}
        .excerpt{margin:0;color:#475569;font-size:14px;line-height:1.5;
          display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
        .more{margin-top:4px;font-size:13px;color:#1d4ed8;font-weight:600}
        @media (max-width:380px){.title{font-size:15px}.excerpt{font-size:13px}}
      `}</style>
    </Link>
  );
}
