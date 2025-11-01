import Link from "next/link";
import { listArticles } from "@/lib/articles";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const LANG = "de";
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };
const prefix = ROUTE_PREFIX[LANG] ?? "/de";

export const metadata = {
  title: "EU-Staatsschulden: Analysen & Einblicke • EU Debt Map",
  description:
    "Fundierte Erklärstücke und Analysen zu den Staatsschulden in der EU — datenbasiert auf Eurostat.",
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
    title: "EU-Staatsschulden: Analysen & Einblicke • EU Debt Map",
    description:
      "Fundierte Erklärstücke und Analysen zu den Staatsschulden in der EU — datenbasiert auf Eurostat.",
    url: `${SITE}${prefix}/articles`,
    siteName: "EU Debt Map",
    type: "website",
  },
};

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("de-DE", {
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
      <section className="articles-hero" aria-labelledby="articles-title">
        <h1 id="articles-title" className="hero-title" style={{ marginBottom: 6 }}>
          Analysen & Einblicke zu EU-Staatsschulden
        </h1>
        <p className="hero-lede" style={{ margin: "0 auto", maxWidth: 760 }}>
          Aktuelle Analysen und Berichte zu den öffentlichen Finanzen Europas — wie
          Staatsschulden Politik, Wachstum und den Alltag in der EU-27 prägen.
        </p>
      </section>

      <section className="articles-list">
        {articles.map((a) => (
          <Link key={a.slug} href={`${prefix}/articles/${a.slug}`} className="articles-item">
            <div className="articles-row">
              <div className="articles-thumb">
                <img src={a.image || "/images/articles/placeholder.jpg"} alt={a.imageAlt || a.title} loading="lazy" />
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
    </main>
  );
}
