import Link from "next/link";
import { listArticles } from "@/lib/articles";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const LANG = "fr";
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };
const prefix = ROUTE_PREFIX[LANG] ?? "/fr";

export const metadata = {
  title: "Dette publique de l’UE : Analyses et éclairages • EU Debt Map",
  description:
    "Analyses et explications sur la dette publique dans l’UE — fondées sur les données d’Eurostat.",
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
    title: "Dette publique de l’UE : Analyses et éclairages • EU Debt Map",
    description:
      "Analyses et explications sur la dette publique dans l’UE — fondées sur les données d’Eurostat.",
    url: `${SITE}${prefix}/articles`,
    siteName: "EU Debt Map",
    type: "website",
  },
};

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
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
          Analyses et éclairages sur la dette de l’UE
        </h1>
        <p className="hero-lede" style={{ margin: "0 auto", maxWidth: 760 }}>
          Les dernières analyses des finances publiques en Europe — comment la dette
          publique influence les politiques, la croissance et la vie quotidienne dans l’UE-27.
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
