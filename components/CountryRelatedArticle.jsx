import Link from "next/link";

const TEXT = {
  en: {
    heading: "Put this country's debt in EU context",
    cta: "Read the analysis",
  },
  nl: {
    heading: "Plaats deze staatsschuld in EU-context",
    cta: "Lees de analyse",
  },
  de: {
    heading: "Diese Staatsschuld im EU-Vergleich",
    cta: "Analyse lesen",
  },
  fr: {
    heading: "Situer cette dette dans le contexte de l’UE",
    cta: "Lire l’analyse",
  },
};

function articleHref(article) {
  if (article?.url) return article.url;
  const prefix = article?.lang && article.lang !== "en" ? `/${article.lang}` : "";
  return `${prefix}/articles/${article?.slug || ""}`;
}

function formatDate(value, lang) {
  if (!value) return "";

  const locale = {
    en: "en-GB",
    nl: "nl-NL",
    de: "de-DE",
    fr: "fr-FR",
  }[lang] || "en-GB";

  try {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

export default function CountryRelatedArticle({ article, lang = "en" }) {
  if (!article) return null;

  const effectiveLang = TEXT[lang] ? lang : "en";
  const t = TEXT[effectiveLang];
  const date = formatDate(article.date, effectiveLang);

  return (
    <section
      aria-labelledby="country-related-article-heading"
      style={{
        marginTop: 24,
        paddingTop: 24,
        borderTop: "1px solid #e2e8f0",
      }}
    >
      <h2
        id="country-related-article-heading"
        style={{
          margin: "0 0 12px",
          fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
          color: "#0f172a",
        }}
      >
        {t.heading}
      </h2>

      <Link
        href={articleHref(article)}
        aria-label={`${t.cta}: ${article.title}`}
        rel="bookmark"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          padding: 14,
          border: "1px solid #dbe5f0",
          borderRadius: 14,
          background: "#f8fafc",
          color: "#0f172a",
          textDecoration: "none",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
        }}
      >
        {article.image && (
          <span
            style={{
              flex: "1 1 210px",
              maxWidth: 320,
              minWidth: 0,
              aspectRatio: "16 / 9",
              overflow: "hidden",
              borderRadius: 10,
              background: "#e2e8f0",
            }}
          >
            <img
              src={article.image}
              alt={article.imageAlt || article.title}
              width={640}
              height={360}
              loading="lazy"
              decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </span>
        )}

        <span
          style={{
            flex: "2 1 320px",
            minWidth: 0,
            display: "grid",
            alignContent: "center",
            gap: 8,
          }}
        >
          {date && (
            <time
              dateTime={article.date}
              style={{
                color: "#64748b",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {date}
            </time>
          )}

          <strong style={{ fontSize: "1.08rem", lineHeight: 1.35 }}>
            {article.title}
          </strong>

          {article.summary && (
            <span style={{ color: "#475569", fontSize: 14, lineHeight: 1.55 }}>
              {article.summary}
            </span>
          )}

          <span style={{ color: "#1d4ed8", fontSize: 14, fontWeight: 800 }}>
            {t.cta} →
          </span>
        </span>
      </Link>
    </section>
  );
}
