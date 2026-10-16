import Link from "next/link";
import articleDateCore from "@/lib/articleDateCore.cjs";
import styles from "./ArticleArchiveHome.module.css";

const { formatArticleDate } = articleDateCore;

export default function ArticleArchiveStory({ article, featured = false }) {
  if (!article) return null;
  const lang = article.lang || "en";
  const prefix = lang === "en" ? "" : `/${lang}`;
  const date = article.date || article.datePublished;
  const summary = article.summary || article.excerpt;

  return (
    <article className={featured ? styles.featured : styles.story}>
      <Link href={article.url || `${prefix}/articles/${article.slug}`} className={styles.storyLink}>
        <div className={styles.image}>
          <img
            src={article.image || "/images/articles/placeholder.jpg"}
            alt={article.imageAlt || article.title}
            width={featured ? 1200 : 240}
            height={featured ? 675 : 180}
            loading={featured ? "eager" : "lazy"}
            decoding="async"
          />
        </div>
        <div className={styles.content}>
          {date && (
            <time className={styles.date} dateTime={date}>
              {formatArticleDate(date, lang, { day: "numeric", month: "short", year: "numeric" })}
            </time>
          )}
          <h2 className={styles.title}>{article.title}</h2>
          {summary && <p className={styles.summary}>{summary}</p>}
        </div>
      </Link>
    </article>
  );
}
