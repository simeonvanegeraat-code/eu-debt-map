import Link from "next/link";
import { listArticles } from "@/lib/articles";
import ArticlesListClient from "@/components/ArticlesListClient";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const LANG = "de";
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };
const prefix = ROUTE_PREFIX[LANG] ?? "";

const PAGE_SIZE = 12;

export const metadata = {
  title:
    "EU-Schuldenanalysen: Artikel, Datenanalysen und Erklärungen • EU Debt Map",
  description:
    "Lesen Sie datenbasierte Artikel, Erklärungen und Updates zur Staatsverschuldung der EU, Schulden/BIP, Ländertrends, Fiskalregeln und Eurostat-Daten.",
  alternates: {
    canonical: `${SITE}${prefix}/articles`,
    languages: {
      en: `${SITE}/articles`,
      nl: `${SITE}/nl/articles`,
      de: `${SITE}/de/articles`,
      fr: `${SITE}/fr/articles`,
      "x-default": `${SITE}/articles`,
    },
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title:
      "EU-Schuldenanalysen: Artikel, Datenanalysen und Erklärungen • EU Debt Map",
    description:
      "Entdecken Sie datenbasierte Artikel und Erklärungen zur EU-Staatsverschuldung, Schulden/BIP, Fiskalregeln und Schuldentrends je Land.",
    url: `${SITE}${prefix}/articles`,
    siteName: "EU Debt Map",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EU-Schuldenanalysen • EU Debt Map",
    description:
      "Datenbasierte Artikel, Erklärungen und Updates zur Staatsverschuldung in der EU-27.",
  },
};

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function hrefForArticle(article) {
  if (!article) return "#";
  if (article.url) return article.url;
  return `${prefix}/articles/${article.slug}`;
}

function imageForArticle(article) {
  return article?.image || "/images/articles/placeholder.jpg";
}

function summaryForArticle(article) {
  return article?.summary || article?.excerpt || "";
}

function tagForArticle(article, fallback = "Analyse") {
  if (Array.isArray(article?.tags) && article.tags.length) {
    return String(article.tags[0]).replace(/-/g, " ");
  }
  return fallback;
}

function readingTime(article) {
  const html = article?.body || "";
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 650;
  const minutes = Math.max(2, Math.round(words / 220));
  return `${minutes} Min. Lesezeit`;
}

function TopicCard({ href, label, text }) {
  return (
    <Link href={href} className="topic-card">
      <span className="topic-label">{label}</span>
      <span className="topic-text">{text}</span>
    </Link>
  );
}

function SmallStoryCard({ article, label }) {
  if (!article) return null;

  return (
    <Link href={hrefForArticle(article)} className="side-story-card">
      <div className="side-story-image">
        <img
          src={imageForArticle(article)}
          alt={article.imageAlt || article.title}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="side-story-content">
        <span className="story-kicker">{label}</span>
        <h3>{article.title}</h3>
        <p>{summaryForArticle(article)}</p>
      </div>
    </Link>
  );
}

export default function ArticlesPage() {
  const articles = listArticles({ lang: LANG });

  const [topStory, secondStory, thirdStory, ...restArticles] = articles;
  const latestArticles = restArticles.length ? restArticles : articles;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "EU-Schuldenanalysen",
    description:
      "Datenbasierte Artikel, Erklärungen und Updates zur Staatsverschuldung in der EU-27.",
    url: `${SITE}${prefix}/articles`,
    isPartOf: {
      "@type": "WebSite",
      name: "EU Debt Map",
      url: SITE,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE}${hrefForArticle(article)}`,
        name: article.title,
      })),
    },
  };

  return (
    <div className="insights-page">
      <style>{`
        .insights-page {
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.10), transparent 34rem),
            linear-gradient(180deg, #f8fafc 0%, #ffffff 36rem);
          color: #0f172a;
        }

        .insights-shell {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .insights-hero {
          padding: 46px 0 28px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: 28px;
          align-items: end;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 12px;
          color: #1d4ed8;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .hero-eyebrow::before {
          content: "";
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #22c55e);
          box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.10);
        }

        .insights-hero h1 {
          margin: 0;
          max-width: 820px;
          font-size: clamp(2.25rem, 4.7vw, 4.7rem);
          line-height: 0.98;
          letter-spacing: -0.055em;
          font-weight: 850;
          color: #08111f;
        }

        .insights-hero p {
          margin: 18px 0 0;
          max-width: 720px;
          color: #475569;
          font-size: clamp(1rem, 0.45vw + 0.92rem, 1.22rem);
          line-height: 1.65;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 10px 15px;
          border-radius: 999px;
          border: 1px solid rgba(15, 23, 42, 0.12);
          background: #ffffff;
          color: #0f172a;
          text-decoration: none;
          font-size: 0.92rem;
          font-weight: 750;
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);
          transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
        }

        .hero-btn:hover,
        .hero-btn:focus-visible {
          transform: translateY(-1px);
          border-color: rgba(37, 99, 235, 0.28);
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.10);
          text-decoration: none;
        }

        .hero-btn.primary {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        .hero-panel {
          border: 1px solid rgba(15, 23, 42, 0.10);
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(10px);
          border-radius: 28px;
          padding: 20px;
          box-shadow: 0 20px 46px rgba(15, 23, 42, 0.08);
        }

        .hero-panel-title {
          margin: 0 0 12px;
          font-size: 0.82rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 800;
        }

        .hero-panel-list {
          display: grid;
          gap: 10px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .hero-panel-list li {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          color: #334155;
          font-size: 0.94rem;
          line-height: 1.45;
        }

        .hero-panel-list li::before {
          content: "";
          flex: 0 0 auto;
          width: 7px;
          height: 7px;
          margin-top: 8px;
          border-radius: 999px;
          background: #2563eb;
        }

        .editorial-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
          gap: 18px;
          margin: 20px auto 26px;
        }

        .top-story {
          position: relative;
          display: grid;
          min-height: 470px;
          overflow: hidden;
          border-radius: 32px;
          background: #0f172a;
          color: #ffffff;
          text-decoration: none;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.20);
        }

        .top-story:hover,
        .top-story:focus-visible {
          text-decoration: none;
        }

        .top-story img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.66;
          transform: scale(1.01);
          transition: transform 0.35s ease, opacity 0.35s ease;
        }

        .top-story:hover img,
        .top-story:focus-visible img {
          transform: scale(1.045);
          opacity: 0.54;
        }

        .top-story::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(15, 23, 42, 0.04) 0%, rgba(15, 23, 42, 0.86) 100%),
            linear-gradient(90deg, rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.10));
        }

        .top-story-content {
          position: relative;
          z-index: 1;
          align-self: end;
          max-width: 760px;
          padding: clamp(22px, 4vw, 38px);
        }

        .story-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          color: #bfdbfe;
          font-size: 0.76rem;
          font-weight: 850;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .top-story h2 {
          margin: 0;
          max-width: 760px;
          color: #ffffff;
          font-size: clamp(1.85rem, 3.2vw, 3.25rem);
          line-height: 1.02;
          letter-spacing: -0.045em;
          font-weight: 850;
        }

        .top-story p {
          margin: 16px 0 0;
          max-width: 650px;
          color: rgba(255, 255, 255, 0.84);
          font-size: 1.03rem;
          line-height: 1.6;
        }

        .top-story-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
          color: rgba(255, 255, 255, 0.78);
          font-size: 0.88rem;
          font-weight: 700;
        }

        .top-story-cta {
          display: inline-flex;
          margin-top: 24px;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.94);
          color: #0f172a;
          font-size: 0.92rem;
          font-weight: 850;
        }

        .side-stories {
          display: grid;
          gap: 18px;
        }

        .side-story-card {
          display: grid;
          grid-template-columns: 138px minmax(0, 1fr);
          gap: 14px;
          align-items: stretch;
          min-height: 176px;
          padding: 14px;
          border: 1px solid rgba(15, 23, 42, 0.10);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.86);
          color: inherit;
          text-decoration: none;
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.07);
          transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
        }

        .side-story-card:hover,
        .side-story-card:focus-visible {
          transform: translateY(-2px);
          border-color: rgba(37, 99, 235, 0.28);
          box-shadow: 0 20px 44px rgba(15, 23, 42, 0.11);
          text-decoration: none;
        }

        .side-story-image {
          overflow: hidden;
          border-radius: 18px;
          background: #e2e8f0;
        }

        .side-story-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .side-story-content {
          display: flex;
          min-width: 0;
          flex-direction: column;
          justify-content: center;
        }

        .side-story-content .story-kicker {
          margin-bottom: 8px;
          color: #2563eb;
        }

        .side-story-content h3 {
          margin: 0;
          color: #0f172a;
          font-size: 1.02rem;
          line-height: 1.22;
          letter-spacing: -0.02em;
          font-weight: 820;
        }

        .side-story-content p {
          margin: 8px 0 0;
          color: #64748b;
          font-size: 0.88rem;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .topics-section {
          margin: 10px auto 36px;
          padding: 20px;
          border: 1px solid rgba(15, 23, 42, 0.10);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.74);
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
        }

        .section-head {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: end;
          margin-bottom: 16px;
        }

        .section-head h2 {
          margin: 0;
          color: #0f172a;
          font-size: clamp(1.35rem, 1vw + 1.05rem, 1.9rem);
          line-height: 1.1;
          letter-spacing: -0.035em;
          font-weight: 850;
        }

        .section-head p {
          margin: 6px 0 0;
          max-width: 650px;
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.55;
        }

        .topics-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .topic-card {
          display: flex;
          flex-direction: column;
          gap: 7px;
          min-height: 118px;
          padding: 16px;
          border-radius: 20px;
          border: 1px solid rgba(15, 23, 42, 0.10);
          background: #ffffff;
          color: inherit;
          text-decoration: none;
          transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
        }

        .topic-card:hover,
        .topic-card:focus-visible {
          transform: translateY(-2px);
          border-color: rgba(37, 99, 235, 0.30);
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.09);
          text-decoration: none;
        }

        .topic-label {
          color: #0f172a;
          font-size: 0.96rem;
          line-height: 1.2;
          font-weight: 850;
        }

        .topic-text {
          color: #64748b;
          font-size: 0.82rem;
          line-height: 1.4;
        }

        .latest-section {
          margin: 0 auto 34px;
        }

        .latest-section .section-head {
          padding: 0 4px;
        }

        .insights-page .articles-list {
          max-width: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 16px;
        }

        .insights-page .articles-item {
          display: block;
          color: inherit;
          text-decoration: none;
        }

        .insights-page .articles-row {
          display: grid;
          grid-template-columns: 240px minmax(0, 1fr);
          gap: 20px;
          padding: 16px;
          border-radius: 26px;
          border: 1px solid rgba(15, 23, 42, 0.10);
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
          transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
        }

        .insights-page .articles-item:hover .articles-row,
        .insights-page .articles-item:focus-visible .articles-row {
          transform: translateY(-2px);
          border-color: rgba(37, 99, 235, 0.28);
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.10);
        }

        .insights-page .articles-thumb {
          width: 100%;
          max-width: none;
          aspect-ratio: 16 / 10;
          border-radius: 20px;
          overflow: hidden;
          background: #e2e8f0;
          box-shadow: none;
        }

        .insights-page .articles-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .insights-page .articles-content {
          display: flex;
          min-width: 0;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
        }

        .insights-page .articles-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .insights-page .articles-tag {
          color: #1d4ed8;
        }

        .insights-page .articles-date {
          margin: 0;
          color: #64748b;
          font-size: inherit;
          font-weight: inherit;
          text-transform: inherit;
          letter-spacing: inherit;
        }

        .insights-page .articles-title {
          margin: 0;
          color: #0f172a;
          font-size: clamp(1.15rem, 0.7vw + 1rem, 1.55rem);
          line-height: 1.18;
          letter-spacing: -0.025em;
          font-weight: 850;
        }

        .insights-page .articles-excerpt {
          margin: 0;
          color: #64748b;
          font-size: 0.96rem;
          line-height: 1.55;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .insights-page .articles-cta {
          margin-top: 4px;
          color: #0f172a;
          font-size: 0.9rem;
          font-weight: 850;
        }

        .insights-page .loadmore-wrap {
          display: flex;
          justify-content: center;
          margin: 22px 0 0;
        }

        .insights-page .loadmore-btn {
          min-height: 42px;
          padding: 10px 18px;
          border-radius: 999px;
          border: 1px solid rgba(15, 23, 42, 0.14);
          background: #ffffff;
          color: #0f172a;
          font-size: 0.9rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.07);
        }

        .insights-page .loadmore-btn:hover {
          border-color: rgba(37, 99, 235, 0.28);
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.10);
        }

        .reports-section {
          margin: 0 auto 40px;
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 18px;
          align-items: stretch;
        }

        .reports-intro {
          padding: 24px;
          border-radius: 28px;
          background: #0f172a;
          color: #ffffff;
          box-shadow: 0 18px 44px rgba(15, 23, 42, 0.14);
        }

        .reports-intro h2 {
          margin: 0;
          color: #ffffff;
          font-size: clamp(1.4rem, 1.2vw + 1rem, 2rem);
          line-height: 1.1;
          letter-spacing: -0.035em;
        }

        .reports-intro p {
          margin: 12px 0 0;
          color: rgba(255, 255, 255, 0.75);
          font-size: 0.96rem;
          line-height: 1.6;
        }

        .reports-grid {
          display: grid;
          gap: 12px;
        }

        .report-card {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
          padding: 18px 20px;
          border-radius: 22px;
          border: 1px solid rgba(15, 23, 42, 0.10);
          background: #ffffff;
          color: #0f172a;
          text-decoration: none;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
          transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
        }

        .report-card:hover,
        .report-card:focus-visible {
          transform: translateY(-2px);
          border-color: rgba(37, 99, 235, 0.28);
          box-shadow: 0 18px 38px rgba(15, 23, 42, 0.10);
          text-decoration: none;
        }

        .report-card strong {
          display: block;
          color: #0f172a;
          font-size: 1rem;
          line-height: 1.25;
        }

        .report-card span span {
          display: block;
          margin-top: 4px;
          color: #64748b;
          font-size: 0.86rem;
          line-height: 1.4;
        }

        .report-arrow {
          flex: 0 0 auto;
          display: inline-grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 900;
        }

        .about-insights {
          margin: 0 auto 52px;
          padding: 24px;
          border-radius: 28px;
          border: 1px solid rgba(15, 23, 42, 0.10);
          background: #ffffff;
          color: #475569;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
        }

        .about-insights h2 {
          margin: 0 0 10px;
          color: #0f172a;
          font-size: 1.35rem;
          letter-spacing: -0.02em;
        }

        .about-insights p {
          margin: 0;
          max-width: 900px;
          font-size: 0.95rem;
          line-height: 1.7;
        }

        .about-insights a {
          color: #1d4ed8;
          font-weight: 750;
          text-decoration: none;
        }

        .about-insights a:hover {
          text-decoration: underline;
        }

        @media (max-width: 980px) {
          .insights-hero {
            grid-template-columns: 1fr;
            align-items: start;
          }

          .hero-panel {
            max-width: 620px;
          }

          .editorial-grid {
            grid-template-columns: 1fr;
          }

          .side-stories {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .side-story-card {
            grid-template-columns: 1fr;
          }

          .side-story-image {
            aspect-ratio: 16 / 9;
          }

          .topics-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .insights-page .articles-row {
            grid-template-columns: 190px minmax(0, 1fr);
          }

          .reports-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .insights-shell {
            width: min(100% - 24px, 1180px);
          }

          .insights-hero {
            padding: 30px 0 18px;
          }

          .hero-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .hero-btn {
            width: 100%;
          }

          .top-story {
            min-height: 430px;
            border-radius: 26px;
          }

          .side-stories {
            grid-template-columns: 1fr;
          }

          .section-head {
            display: block;
          }

          .topics-section,
          .reports-intro,
          .about-insights {
            border-radius: 24px;
          }

          .topics-grid {
            grid-template-columns: 1fr;
          }

          .topic-card {
            min-height: auto;
          }

          .insights-page .articles-row {
            grid-template-columns: 1fr;
            gap: 14px;
            border-radius: 24px;
          }

          .insights-page .articles-thumb {
            aspect-ratio: 16 / 9;
          }

          .report-card {
            align-items: flex-start;
          }
        }
      `}</style>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        className="insights-shell insights-hero"
        aria-labelledby="insights-title"
      >
        <div>
          <div className="hero-eyebrow">EU Debt Map Forschung</div>
          <h1 id="insights-title">EU-Schuldenanalysen</h1>
          <p>
            Datenbasierte Artikel, Erklärungen und Updates zu Staatsverschuldung,
            Schulden/BIP, Länderrisiken und fiskalischem Druck in der EU-27.
          </p>

          <div className="hero-actions" aria-label="EU Debt Map erkunden">
            <Link href="/de" className="hero-btn primary">
              Live-Karte ansehen
            </Link>
            <Link href="/de/debt-to-gdp" className="hero-btn">
              Schulden/BIP anzeigen
            </Link>
            <Link href="/de/methodology" className="hero-btn">
              Methodik lesen
            </Link>
          </div>
        </div>

        <aside className="hero-panel" aria-label="Was Sie hier finden">
          <p className="hero-panel-title">Was Sie hier finden</p>
          <ul className="hero-panel-list">
            <li>Klare Erklärungen zu Staatsverschuldung und Schulden/BIP.</li>
            <li>Länderbezogene Analysen auf Basis von EU-27-Schuldendaten.</li>
            <li>Updates, wenn neue Eurostat-Daten das Bild verändern.</li>
          </ul>
        </aside>
      </section>

      {topStory && (
        <section
          className="insights-shell editorial-grid"
          aria-label="Ausgewählte Artikel"
        >
          <Link href={hrefForArticle(topStory)} className="top-story">
            <img
              src={imageForArticle(topStory)}
              alt={topStory.imageAlt || topStory.title}
              loading="eager"
              decoding="async"
            />

            <div className="top-story-content">
              <span className="story-kicker">Titelthema</span>
              <h2>{topStory.title}</h2>
              <p>{summaryForArticle(topStory)}</p>

              <div className="top-story-meta">
                <span>{formatDate(topStory.date)}</span>
                <span>{tagForArticle(topStory)}</span>
                <span>{readingTime(topStory)}</span>
              </div>

              <span className="top-story-cta">Analyse lesen</span>
            </div>
          </Link>

          <div className="side-stories">
            <SmallStoryCard article={secondStory} label="Neuestes Update" />
            <SmallStoryCard article={thirdStory} label="Erklärung" />
          </div>
        </section>
      )}

      <section className="insights-shell topics-section" aria-labelledby="topics-title">
        <div className="section-head">
          <div>
            <h2 id="topics-title">Nach Thema erkunden</h2>
            <p>
              Folgen Sie den wichtigsten Themen hinter Europas Schuldenentwicklung,
              von Länderrankings bis zu Fiskalregeln und Eurostat-Updates.
            </p>
          </div>
        </div>

        <div className="topics-grid">
          <TopicCard
            href="/de/articles"
            label="EU-Schuldenüberblick"
            text="Der große Blick auf Staatsverschuldung in der EU-27."
          />
          <TopicCard
            href="/de"
            label="Schulden je Land"
            text="Starten Sie mit der Live-Karte und vergleichen Sie Länder."
          />
          <TopicCard
            href="/de/debt-to-gdp"
            label="Schulden/BIP"
            text="Bewerten Sie Schulden im Verhältnis zur Wirtschaftsleistung."
          />
          <TopicCard
            href="/de/debt"
            label="Schulden erklärt"
            text="Einfache Erklärungen für Leser, die neu im Thema sind."
          />
          <TopicCard
            href="/de/methodology"
            label="Eurostat-Daten"
            text="Wie offizielle Daten zu Live-Schätzungen werden."
          />
        </div>
      </section>

      <section className="insights-shell latest-section" aria-labelledby="latest-title">
        <div className="section-head">
          <div>
            <h2 id="latest-title">Neueste Artikel</h2>
            <p>
              Lesen Sie die neuesten EU Debt Map Artikel, Erklärungen und
              datenbasierten Analysen.
            </p>
          </div>
        </div>

        <ArticlesListClient articles={latestArticles} pageSize={PAGE_SIZE} />
      </section>

      <section
        className="insights-shell reports-section"
        aria-labelledby="reports-title"
      >
        <div className="reports-intro">
          <h2 id="reports-title">Vertiefende Datenberichte</h2>
          <p>
            Einige Seiten sind tiefere Forschungsansichten statt normale Artikel.
            Nutzen Sie diese für Charts, Rankings und Methodik.
          </p>
        </div>

        <div className="reports-grid">
          <Link href="/eu-debt" className="report-card">
            <span>
              <strong>EU debt in 2026: 5-year chart and country breakdown</strong>
              <span>
                Englischsprachiger Datenbericht zu EU-Gesamtschulden, Länderanteilen
                und langfristiger Entwicklung.
              </span>
            </span>
            <span className="report-arrow">→</span>
          </Link>

          <Link href="/de/debt-to-gdp" className="report-card">
            <span>
              <strong>Schulden/BIP-Ranking</strong>
              <span>
                Vergleichen Sie Staatsverschuldung mit der Größe jeder Volkswirtschaft.
              </span>
            </span>
            <span className="report-arrow">→</span>
          </Link>

          <Link href="/de/methodology" className="report-card">
            <span>
              <strong>Methodik und Datenquellen</strong>
              <span>
                So nutzt EU Debt Map Eurostat-Daten und Live-Schätzungen.
              </span>
            </span>
            <span className="report-arrow">→</span>
          </Link>
        </div>
      </section>

      <section
        className="insights-shell about-insights"
        aria-labelledby="about-insights-title"
      >
        <h2 id="about-insights-title">Über EU-Schuldenanalysen</h2>
        <p>
          EU-Schuldenanalysen ist der redaktionelle Bereich von EU Debt Map.
          Hier erklären wir Staatsverschuldung, Schulden/BIP, Fiskalregeln und
          Schuldentrends je Land anhand transparenter Eurostat-Daten und
          EU Debt Map Berechnungen. Für den Live-Überblick starten Sie mit der{" "}
          <Link href="/de">interaktiven EU-Schuldenkarte</Link>. Für die
          Berechnung lesen Sie unsere <Link href="/de/methodology">Methodik</Link>.
        </p>
      </section>
    </div>
  );
}