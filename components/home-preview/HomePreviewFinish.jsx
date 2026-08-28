import Image from "next/image";
import Link from "next/link";
import styles from "./home-preview.module.css";

function formatDate(value, locale) {
  if (!value) return null;

  try {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return null;
  }
}

export default function HomePreviewFinish({ articles = [], copy, commonPeriod, countryCount, preview = false }) {
  const articlesHref = `${copy.base}/articles` || "/articles";
  const methodologyHref = `${copy.base}/methodology` || "/methodology";
  const aboutHref = `${copy.base}/about` || "/about";
  const debtHref = `${copy.base}/debt` || "/debt";
  const trustItems = copy.trustItems(commonPeriod, countryCount);

  return (
    <>
      {preview && (
        <aside className={styles.adPlacement} aria-label={copy.adLabel}>
          <span aria-hidden="true">AD</span>
          <div>
            <strong>{copy.adLabel}</strong>
            <p>{copy.adHint}</p>
          </div>
        </aside>
      )}

      <section className={styles.articlesSection} aria-labelledby="home-articles-title">
        <header className={styles.articlesHeader}>
          <div>
            <p className={styles.eyebrow}>{copy.articlesEyebrow}</p>
            <h2 id="home-articles-title">{copy.articlesTitle}</h2>
            <p>{copy.articlesIntro}</p>
          </div>
          <Link href={articlesHref}>{copy.viewAllArticles} <span aria-hidden="true">→</span></Link>
        </header>

        <div className={styles.articleGrid}>
          {articles.map((article) => {
            const date = formatDate(article.date, copy.locale);

            return (
              <article className={styles.articleCard} key={article.slug}>
                {article.image && (
                  <Link className={styles.articleImage} href={article.url} tabIndex={-1} aria-hidden="true">
                    <Image
                      src={article.image}
                      alt=""
                      fill
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    />
                  </Link>
                )}
                <div className={styles.articleContent}>
                  <div className={styles.articleMeta}>
                    <span>{copy.analysisLabel}</span>
                    {date && <time dateTime={article.date}>{date}</time>}
                    {article.readingMinutes && <span>{copy.readingTime(article.readingMinutes)}</span>}
                  </div>
                  <h3><Link href={article.url}>{article.title}</Link></h3>
                  <p>{article.summary}</p>
                  <Link className={styles.articleRead} href={article.url}>
                    {copy.readArticle} <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.whySection} aria-labelledby="home-why-title">
        <header className={styles.whyHeader}>
          <div>
            <p className={styles.eyebrow}>{copy.whyEyebrow}</p>
            <h2 id="home-why-title">{copy.whyTitle}</h2>
          </div>
          <div>
            <p>{copy.whyIntro}</p>
            <Link href={debtHref}>{copy.debtExplainerCta} <span aria-hidden="true">→</span></Link>
          </div>
        </header>
        <div className={styles.whyGrid}>
          {copy.whyItems.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.homeFaqSection} aria-labelledby="home-faq-title">
        <header>
          <p className={styles.eyebrow}>{copy.faqEyebrow}</p>
          <h2 id="home-faq-title">{copy.faqTitle}</h2>
        </header>
        <div className={styles.homeFaqList}>
          {copy.faqItems.map((item, index) => (
            <details key={item.question}>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.question}
                <i aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.trustSection} aria-labelledby="home-trust-title">
        <div className={styles.trustIntro}>
          <p className={styles.eyebrow}>{copy.trustEyebrow}</p>
          <h2 id="home-trust-title">{copy.trustTitle}</h2>
          <p>{copy.trustIntro}</p>
          <nav aria-label={copy.trustLinksLabel}>
            <Link href={methodologyHref}>{copy.methodologyCta} <span aria-hidden="true">→</span></Link>
            <Link href={aboutHref}>{copy.aboutCta}</Link>
          </nav>
        </div>

        <ol className={styles.trustList}>
          {trustItems.map((item, index) => (
            <li key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
