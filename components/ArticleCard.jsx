import Link from "next/link";
import styles from "./ArticleCard.module.css";
import articleDateCore from "@/lib/articleDateCore.cjs";

const { formatArticleDate } = articleDateCore;

function articleHref(article) {
  if (!article) return "#";
  if (article.url) return article.url;

  const prefix = article.lang && article.lang !== "en" ? `/${article.lang}` : "";
  return `${prefix}/articles/${article.slug}`;
}

function formatDate(iso, lang = "en") {
  return formatArticleDate(iso, lang, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ArticleCard({ article }) {
  if (!article) return null;

  const {
    title,
    summary,
    excerpt,
    image,
    imageAlt,
    date,
    tags = [],
    lang = "en",
  } = article;

  const text = summary || excerpt || "";
  const primaryTag = Array.isArray(tags) ? tags[0] : null;

  return (
    <li className={styles.item}>
      <article
        className={image ? styles.card : `${styles.card} ${styles.withoutImage}`}
      >
        {image && (
          <div className={styles.thumbnail}>
            <img
              src={image}
              alt={imageAlt || ""}
              loading="lazy"
              decoding="async"
              width={240}
              height={160}
            />
          </div>
        )}

        <div className={styles.content}>
          {(date || primaryTag) && (
            <div className={styles.meta}>
              {primaryTag && <span className={styles.tag}>{primaryTag}</span>}
              {date && primaryTag && <span aria-hidden="true">·</span>}
              {date && (
                <time dateTime={date}>{formatDate(date, lang)}</time>
              )}
            </div>
          )}

          <h3 className={styles.title}>
            <Link
              href={articleHref(article)}
              rel="bookmark"
              className={styles.titleLink}
            >
              {title}
            </Link>
          </h3>

          {text && <p className={styles.summary}>{text}</p>}
        </div>
      </article>
    </li>
  );
}
