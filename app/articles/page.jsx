// app/articles/page.jsx
import Link from "next/link";
import { listArticles } from "@/lib/articles";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const LANG = "en";
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };
const prefix = ROUTE_PREFIX[LANG] ?? "";

export const metadata = {
  title: "EU Debt Analysis & Insights • EU Debt Map",
  description:
    "In-depth explainers and reports on EU government debt—data-driven stories built on Eurostat.",
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
    title: "EU Debt Analysis & Insights • EU Debt Map",
    description:
      "In-depth explainers and reports on EU government debt—data-driven stories built on Eurostat.",
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

  return (
    <main>
      {/* ===== HERO boven de lijst – matcht homepage-stijl ===== */}
      <section className="articles-hero" aria-labelledby="articles-title">
        <h1 id="articles-title" className="hero-title" style={{ marginBottom: 6 }}>
          EU Debt Analysis & Insights
        </h1>
        <p className="hero-lede" style={{ margin: "0 auto", maxWidth: 760 }}>
          The latest analyses and reports on Europe’s public finances, exploring how national
          debt shapes policy, growth, and everyday life across the EU-27.
        </p>
      </section>

      {/* ===== Artikellijst in BNR-stijl ===== */}
      <section className="articles-list">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`${prefix}/articles/${a.slug}`}
            className="articles-item"
          >
            <div className="articles-row">
              {/* Thumbnail met vaste 4:3 ratio en nette crop */}
              <div className="articles-thumb">
                <img
                  src={a.image || "/images/articles/placeholder.jpg"}
                  alt={a.imageAlt || a.title}
                  loading="lazy"
                />
              </div>

              {/* Tekstkolom */}
              <div className="articles-content">
                <p className="articles-date">{formatDate(a.date)}</p>
                <h2 className="articles-title">{a.title}</h2>
                <p className="articles-excerpt">{a.excerpt}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
