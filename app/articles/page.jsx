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
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
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
    <main className="w-full">
      {/* Hero/sectietitel */}
      <section className="text-center py-10 border-b border-gray-200 mb-8 bg-gradient-to-b from-blue-50/30 to-white">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
          EU Debt Analysis & Insights
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          The latest analyses and reports on Europe’s public finances — exploring
          how national debt shapes policy, growth, and everyday life across the EU-27.
        </p>
      </section>

      {/* Artikellijst in BNR-stijl */}
      <section className="articles-list max-w-4xl mx-auto px-4 md:px-0 space-y-6 mb-16">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`${prefix}/articles/${a.slug}`}
            className="group block rounded-xl border border-gray-200 bg-white p-5 hover:bg-gray-50 hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* Thumbnail wrapper met vaste aspect-ratio 4:3 */}
              <div className="relative w-full sm:w-48 overflow-hidden rounded-md bg-gray-100"
                   style={{ aspectRatio: "4 / 3" }}>
                <img
                  src={a.image || "/images/articles/placeholder.jpg"}
                  alt={a.imageAlt || a.title}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  loading="lazy"
                />
              </div>

              {/* Tekst */}
              <div className="min-w-0">
                <p className="text-sm text-gray-500 mb-1">{formatDate(a.date)}</p>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-blue-700">
                  {a.title}
                </h2>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {a.excerpt}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Defensieve overrides tegen globale img/prose regels die alles 'vol-breedte' maken */}
      <style jsx global>{`
        .articles-list img {
          max-width: 100%;
          height: 100% !important;   /* forceer de crop-hoogte binnen de wrapper */
        }
        .articles-list figure,
        .articles-list .prose img,
        .articles-list .prose figure {
          margin: 0 !important;
        }
      `}</style>
    </main>
  );
}
