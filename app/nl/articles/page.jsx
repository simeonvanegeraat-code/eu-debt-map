import { listArticles } from "@/lib/articles";
import ArticlesListClient from "@/components/ArticlesListClient";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const LANG = "nl";
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };
const prefix = ROUTE_PREFIX[LANG] ?? "";

const PAGE_SIZE = 12;

/* ---------- SEO ---------- */
export const metadata = {
  title:
    "EU Schuld Artikelen & Inzichten over Staatsschuld, Schuld-tot-bbp & Begrotingsregels • EU Debt Map",
  description:
    "Data-gedreven uitleg en analyses over de staatsschuld van EU-27 landen, schuld-tot-bbp-verhoudingen, tekorten en begrotingsregels — gebaseerd op Eurostat en live trackers.",
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
      "EU Schuld Artikelen & Inzichten over Staatsschuld, Schuld-tot-bbp & Begrotingsregels • EU Debt Map",
    description:
      "Verken diepgaande, data-onderbouwde artikelen over Europese overheidsschuld, schuld-tot-bbp, tekorten en het begrotingskader dat de economische toekomst van Europa vormgeeft.",
    url: `${SITE}${prefix}/articles`,
    siteName: "EU Debt Map",
    type: "website",
  },
};

export default function ArticlesPage() {
  const articles = listArticles({ lang: LANG }); // newest-first

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
      {/* Styles specifiek voor deze pagina */}
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

      {/* ItemList structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="articles-hero" aria-labelledby="articles-title">
        <h1 id="articles-title" className="hero-title">
          EU Schuld Artikelen & Inzichten
        </h1>
        <p className="hero-lede">
          Data-gedreven verhalen over de Europese overheidsfinanciën: staatsschuld,
          schuld-tot-bbp, tekorten en begrotingsregels die beleid, markten en het
          dagelijkse leven in alle EU-27 lidstaten vormen.
        </p>
      </section>

      {/* Artikelen met lazy load / load more */}
      <ArticlesListClient articles={articles} pageSize={PAGE_SIZE} />

      {/* SEO / context-blok */}
      <section className="articles-seo">
        EU Debt Map publiceert onafhankelijke, data-gedreven artikelen over de
        overheidsschuld van EU-lidstaten, schuld-tot-bbp-verhoudingen, deficitregels en
        fiscale kaders. Alle inzichten zijn gebaseerd op transparante Eurostat-data en
        gekoppeld aan onze live schuldtrackers per land.
      </section>
    </main>
  );
}
