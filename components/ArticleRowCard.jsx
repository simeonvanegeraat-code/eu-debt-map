import Link from "next/link";
import Image from "next/image";

function hrefFor(a){
  if (!a) return "#";
  if (a.url) return a.url;
  const lang = a.lang && a.lang !== "en" ? `/${a.lang}` : "";
  return `${lang}/articles/${a.slug}`;
}

export default function ArticleRowCard({ article }) {
  if (!article) return null;

  const {
    title,
    summary,
    image = "/articles/placeholder-600.jpg",
    imageAlt = title || "Article image",
    date,
    tags = [],
  } = article;

  const href = hrefFor(article);

  return (
    <article className="row">
      <Link href={href} className="thumb" aria-label={title} prefetch={false}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 320px"
          priority={false}
          loading="lazy"
          style={{ objectFit: "cover" }}
        />
      </Link>

      <div className="content">
        <h3 className="h"><Link href={href} className="link">{title}</Link></h3>

        {date && (
          <time dateTime={date} className="date">
            {new Intl.DateTimeFormat("en-GB",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(date))}
          </time>
        )}

        {summary && <p className="sum">{summary}</p>}

        {tags.length > 0 && (
          <ul className="tags">
            {tags.slice(0, 5).map((t) => (<li key={t}>#{t}</li>))}
          </ul>
        )}
      </div>

      <style jsx>{`
        .row{display:flex;gap:12px;align-items:flex-start;border:1px solid var(--border);
          border-radius:12px;padding:10px;background:#fff}
        .thumb{position:relative;flex:0 0 160px;height:100px;border-radius:10px;overflow:hidden;border:1px solid var(--border)}
        .content{min-width:0}
        .h{margin:0 0 4px;font-size:16px;line-height:1.25}
        .link:hover{text-decoration:underline}
        .date{display:block;font-size:12px;color:#64748b;margin-bottom:6px}
        .sum{margin:0 0 8px;color:#475569;font-size:14px;line-height:1.5;
          display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
        .tags{display:flex;gap:6px;flex-wrap:wrap;margin:0;padding:0;list-style:none}
        .tags li{font-size:11px;padding:2px 8px;border-radius:999px;background:#f1f5f9;border:1px solid #e2e8f0}
        @media (max-width:640px){.thumb{flex-basis:128px;height:84px}}
      `}</style>
    </article>
  );
}
