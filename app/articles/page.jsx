// app/articles/page.jsx
import Link from "next/link";
import { listArticles } from "@/lib/articles";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const LANG = "en";
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };
const prefix = ROUTE_PREFIX[LANG] ?? "";

/* ---------- SEO ---------- */
export const metadata = {
  // Gericht op jouw niche: EU national debt, debt-to-GDP, fiscal rules
  title: "EU Debt Articles & Insights on National Debt, Debt-to-GDP & Fiscal Rules • EU Debt Map",
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

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

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
      {/* Local styles specifiek voor deze pagina */}
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
          margin: 0 auto 40px;
          padding: 0 16px 8px;
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
          font-size: 1.3rem; /* ~20-21px */
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

        /* SEO / uitleg blok onderaan */
        .articles-seo {
          max-width: 1120px;
          margin: 8px auto 40px;
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

      {/* ItemList structured data voor Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
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

      {/* Artikellijst */}
      <section className="articles-list">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`${prefix}/articles/${a.slug}`}
            className="articles-item"
          >
            <div className="articles-row">
              <div className="articles-thumb">
                <img
                  src={a.image || "/images/articles/placeholder.jpg"}
                  alt={a.imageAlt || a.title}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="articles-content">
                <p className="articles-date">{formatDate(a.date)}</p>
                <h2 className="articles-title">{a.title}</h2>
                <p className="articles-excerpt">{a.excerpt}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* SEO / context-blok */}
      <section className="articles-seo">
        EU Debt Map publishes independent, data-driven articles on EU-27 government debt,
        debt-to-GDP ratios, deficit rules and fiscal frameworks. All insights are built on
        transparent Eurostat data and linked to our live national debt trackers, helping
        readers understand how Europe’s debt shapes its economic future.
      </section>
    </main>
  );
}
