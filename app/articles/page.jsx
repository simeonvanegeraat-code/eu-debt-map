import Link from "next/link";
import { listArticles } from "@/lib/articles";
import ArticlesListClient from "@/components/ArticlesListClient";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const LANG = "en";
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };
const prefix = ROUTE_PREFIX[LANG] ?? "";

const PAGE_SIZE = 12;

/* ---------- SEO ---------- */
export const metadata = {
  title:
    "EU Debt Articles & Insights on National Debt, Debt-to-GDP & Fiscal Rules • EU Debt Map",
  description:
    "Data-driven explainers and analyses on EU-27 national debt, debt-to-GDP ratios, deficits and fiscal rules — based on Eurostat and live trackers.",
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
  openGraph: {
    title:
      "EU Debt Articles & Insights on National Debt, Debt-to-GDP & Fiscal Rules • EU Debt Map",
    description:
      "Explore in-depth, data-backed articles on EU government debt, debt-to-GDP, deficits and fiscal frameworks shaping Europe’s economic future.",
    url: `${SITE}${prefix}/articles`,
    siteName: "EU Debt Map",
    type: "website",
  },
};

export default function ArticlesPage() {
  const articles = listArticles({ lang: LANG });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.map((a, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE}${prefix}/articles/${a.slug}`,
    })),
  };

  return (
    <main>
      <style>{`
        .articles-hero {
          padding: 40px 16px 24px;
          text-align: center;
        }
        .articles-hero .hero-title {
          margin: 0 0 6px;
          font-weight: 800;
          font-size: clamp(1.9rem, 1.2rem + 1.8vw, 2.4rem);
          letter-spacing: -0.02em;
        }
        .articles-hero .hero-lede {
          margin: 0 auto;
          max-width: 760px;
          font-size: 0.98rem;
          line-height: 1.6;
          color: #6b7280;
        }

        .featured-wrap {
          max-width: 1120px;
          margin: 0 auto 24px;
          padding: 0 16px;
        }

        .featured-label {
          display: inline-block;
          margin: 0 0 10px;
          color: #2563eb;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .featured-card {
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          gap: 24px;
          padding: 24px;
          border-radius: 28px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
          box-shadow: 0 14px 38px rgba(15, 23, 42, 0.08);
          border: 1px solid #e5e7eb;
          text-decoration: none;
          color: inherit;
          transition: transform 0.16s ease, box-shadow 0.16s ease;
        }

        .featured-card:hover,
        .featured-card:focus-visible {
          transform: translateY(-2px);
          box-shadow: 0 18px 44px rgba(15, 23, 42, 0.12);
        }

        .featured-title {
          margin: 0 0 10px;
          font-size: clamp(1.45rem, 1.2rem + 0.8vw, 2rem);
          line-height: 1.15;
          letter-spacing: -0.02em;
          font-weight: 800;
          color: #111827;
        }

        .featured-text {
          margin: 0 0 14px;
          font-size: 1rem;
          line-height: 1.65;
          color: #4b5563;
          max-width: 680px;
        }

        .featured-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 0 0 16px;
        }

        .featured-chip {
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 999px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .featured-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
          font-weight: 700;
          color: #111827;
        }

        .featured-statbox {
          display: grid;
          gap: 12px;
          align-content: center;
        }

        .featured-stat {
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 16px 18px;
          background: #ffffff;
        }

        .featured-stat-label {
          margin: 0 0 6px;
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 600;
        }

        .featured-stat-value {
          margin: 0;
          font-size: 1.5rem;
          line-height: 1.1;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.02em;
        }

        .articles-list {
          max-width: 1120px;
          margin: 0 auto 32px;
          padding: 0 16px;
          display: grid;
          gap: 16px;
        }

        .articles-item {
          display: block;
          text-decoration: none;
          color: inherit;
        }

        .articles-row {
          display: flex;
          gap: 20px;
          padding: 20px 24px;
          border-radius: 24px;
          background: var(--card-bg, #ffffff);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
          align-items: stretch;
          transition: transform 0.16s ease, box-shadow 0.16s ease,
            background-color 0.16s ease;
        }

        .articles-item:hover .articles-row,
        .articles-item:focus-visible .articles-row {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.10);
          background-color: #f9fafb;
        }

        .articles-thumb {
          flex: 0 0 224px;
          max-width: 224px;
          aspect-ratio: 16 / 9;
          border-radius: 8px;
          overflow: hidden;
          background: #e5e7eb;
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.16);
        }

        .articles-thumb img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .articles-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;
          min-width: 0;
        }

        .articles-date {
          font-size: 0.8rem;
          font-weight: 500;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }

        .articles-title {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 600;
          line-height: 1.4;
          letter-spacing: -0.01em;
        }

        .articles-excerpt {
          margin: 2px 0 0;
          font-size: 1rem;
          line-height: 1.55;
          color: #6b7280;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .loadmore-wrap {
          display: flex;
          justify-content: center;
          margin: 8px 0 24px;
        }

        .loadmore-btn {
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid #d1d5db;
          background: #ffffff;
          font-size: 0.85rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 10px rgba(15,23,42,0.06);
          transition: all 0.16s ease;
        }
        .loadmore-btn:hover {
          background: #f3f4ff;
          box-shadow: 0 8px 18px rgba(15,23,42,0.12);
        }
        .loadmore-btn[disabled]{
          opacity:.45;
          cursor:default;
          box-shadow:none;
        }

        .articles-seo {
          max-width: 1120px;
          margin: 0 auto 40px;
          padding: 0 16px;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #6b7280;
        }

        @media (max-width: 900px) {
          .featured-card {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .articles-hero {
            padding-top: 24px;
            padding-bottom: 16px;
          }
          .articles-list {
            gap: 14px;
          }
          .articles-row {
            flex-direction: column;
            padding: 16px 18px;
            gap: 12px;
            border-radius: 18px;
          }
          .articles-thumb {
            flex: 0 0 auto;
            width: 100%;
            max-width: 100%;
            aspect-ratio: 16 / 9;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
          }
          .articles-title {
            font-size: 1.15rem;
          }
          .articles-excerpt {
            font-size: 0.92rem;
            -webkit-line-clamp: 4;
          }
        }
      `}</style>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="articles-hero" aria-labelledby="articles-title">
        <h1 id="articles-title" className="hero-title">
          EU Debt Articles & Insights
        </h1>
        <p className="hero-lede">
          Data-backed stories on Europe’s public finances: national debt, debt-to-GDP,
          deficits, and fiscal rules that shape policy, markets, and everyday life across
          the EU-27.
        </p>
      </section>

      <section className="featured-wrap" aria-labelledby="featured-analysis-title">
        <div className="featured-label">Featured analysis</div>
        <Link href="/eu-debt" className="featured-card" aria-labelledby="featured-analysis-title">
          <div>
            <h2 id="featured-analysis-title" className="featured-title">
              EU debt in 2026: 5-year chart and debt by country
            </h2>
            <p className="featured-text">
              See how total EU debt has changed over the last five years, which countries carry the
              biggest share, and why the burden is far from evenly spread across Europe.
            </p>
            <div className="featured-meta">
              <span className="featured-chip">5-year chart</span>
              <span className="featured-chip">Debt by country</span>
              <span className="featured-chip">Eurostat-based</span>
            </div>
            <div className="featured-cta">Open analysis →</div>
          </div>

          <div className="featured-statbox" aria-hidden="true">
            <div className="featured-stat">
              <div className="featured-stat-label">Focus</div>
              <div className="featured-stat-value">EU debt</div>
            </div>
            <div className="featured-stat">
              <div className="featured-stat-label">Format</div>
              <div className="featured-stat-value">Chart + breakdown</div>
            </div>
            <div className="featured-stat">
              <div className="featured-stat-label">Angle</div>
              <div className="featured-stat-value">Scale and distribution</div>
            </div>
          </div>
        </Link>
      </section>

      <ArticlesListClient
        articles={articles}
        pageSize={PAGE_SIZE}
      />

      <section className="articles-seo">
        EU Debt Map publishes independent, data-driven articles on EU-27 government debt,
        debt-to-GDP ratios, deficit rules and fiscal frameworks. All insights are based on
        transparent Eurostat data and linked to our live national debt trackers.
      </section>
    </main>
  );
}