import Link from "next/link";
import styles from "./CountryRelatedArticle.module.css";
import articleDateCore from "@/lib/articleDateCore.cjs";

const { formatArticleDate } = articleDateCore;

const TEXT = {
  en: {
    eyebrow: "Analysis and context",
    heading: (name) => `Further reading about ${name}`,
    intro: "Continue with a focused analysis, then compare the country with the wider European picture.",
    cta: "Read the analysis",
    secondary: "EU-wide analysis",
  },
  nl: {
    eyebrow: "Analyse en context",
    heading: (name) => `Verder lezen over ${name}`,
    intro: "Lees eerst de analyse over dit land en vergelijk de uitkomst daarna met het bredere Europese beeld.",
    cta: "Lees de analyse",
    secondary: "Analyse voor de hele EU",
  },
  de: {
    eyebrow: "Analyse und Kontext",
    heading: (name) => `Mehr über ${name} lesen`,
    intro: "Vertiefe zuerst die Analyse zu diesem Land und vergleiche sie danach mit dem europäischen Gesamtbild.",
    cta: "Analyse lesen",
    secondary: "Analyse zur gesamten EU",
  },
  fr: {
    eyebrow: "Analyse et contexte",
    heading: (name) => `Analyses complémentaires : ${name}`,
    intro: "Poursuivez avec une analyse du pays, puis comparez-la à la situation européenne dans son ensemble.",
    cta: "Lire l’analyse",
    secondary: "Analyse à l’échelle de l’UE",
  },
};

function articleHref(article) {
  if (article?.url) return article.url;
  const prefix = article?.lang && article.lang !== "en" ? `/${article.lang}` : "";
  return `${prefix}/articles/${article?.slug || ""}`;
}

function formatDate(value, lang) {
  return formatArticleDate(value, lang, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ArticleDate({ article, lang }) {
  const date = formatDate(article.date, lang);
  return date ? <time className={styles.date} dateTime={article.date}>{date}</time> : null;
}

export default function CountryRelatedArticle({
  article = null,
  articles = [],
  lang = "en",
  countryName = "",
}) {
  const list = (articles.length ? articles : [article]).filter(Boolean).slice(0, 2);
  if (!list.length) return null;

  const effectiveLang = TEXT[lang] ? lang : "en";
  const t = TEXT[effectiveLang];
  const [primary, secondary] = list;

  return (
    <section className={styles.section} aria-labelledby="country-related-article-heading">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <h2 id="country-related-article-heading">{t.heading(countryName)}</h2>
        </div>
        <p>{t.intro}</p>
      </div>

      <div className={`${styles.articles} ${secondary ? "" : styles.articlesSingle}`}>
        <Link
          href={articleHref(primary)}
          aria-label={`${t.cta}: ${primary.title}`}
          rel="bookmark"
          className={styles.primary}
        >
          {primary.image ? (
            <span className={styles.image}>
              <img
                src={primary.image}
                alt={primary.imageAlt || primary.title}
                width={640}
                height={360}
                loading="lazy"
                decoding="async"
              />
            </span>
          ) : null}
          <span className={styles.content}>
            <ArticleDate article={primary} lang={effectiveLang} />
            <strong>{primary.title}</strong>
            {primary.summary ? <span className={styles.summary}>{primary.summary}</span> : null}
            <span className={styles.cta}>{t.cta} <span aria-hidden="true">→</span></span>
          </span>
        </Link>

        {secondary ? (
          <Link
            href={articleHref(secondary)}
            aria-label={`${t.cta}: ${secondary.title}`}
            rel="bookmark"
            className={styles.secondary}
          >
            <span>
              <span className={styles.secondaryLabel}>{t.secondary}</span>
              <ArticleDate article={secondary} lang={effectiveLang} />
              <strong>{secondary.title}</strong>
              {secondary.summary ? <span className={styles.summary}>{secondary.summary}</span> : null}
            </span>
            <span className={styles.cta}>{t.cta} <span aria-hidden="true">→</span></span>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
