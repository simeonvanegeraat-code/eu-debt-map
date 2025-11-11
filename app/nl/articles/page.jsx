import { listArticles } from "@/lib/articles";
import ArticlesListClient from "@/components/ArticlesListClient";

export const runtime = "nodejs";

const SITE = "https://www.eudebtmap.com";
const LANG = "nl";
const ROUTE_PREFIX = { en: "", nl: "/nl", de: "/de", fr: "/fr" };
const prefix = ROUTE_PREFIX[LANG] ?? "";

const PAGE_SIZE = 12;

export const metadata = {
  title: "EU Schuld Artikelen & Inzichten over Staatsschuld en Begrotingsregels • EU Debt Map",
  description:
    "Data-gedreven artikelen over de staatsschuld van EU-landen, schuld-tot-bbp-verhoudingen, tekorten en begrotingsregels — gebaseerd op Eurostat en live trackers.",
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
      "EU Schuld Artikelen & Inzichten over Staatsschuld en Begrotingsregels • EU Debt Map",
    description:
      "Ontdek diepgaande, data-onderbouwde artikelen over Europese overheidsschuld, schuld-tot-bbp, tekorten en het begrotingskader dat de toekomst van Europa vormt.",
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
    itemListElement: articles.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE}${prefix}/articles/${a.slug}`,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="articles-hero" aria-labelledby="articles-title">
        <h1 id="articles-title" className="hero-title">
          Artikelen & Inzichten over Staatsschuld
        </h1>
        <p className="hero-lede">
          Data-gedreven verhalen over de Europese overheidsfinanciën: staatsschuld,
          schuld-tot-bbp, tekorten en begrotingsregels die beleid, markten en het dagelijks
          leven in de EU-27 beïnvloeden.
        </p>
      </section>

      <ArticlesListClient articles={articles} pageSize={PAGE_SIZE} />

      <section className="articles-seo">
        EU Debt Map publiceert onafhankelijke, data-gedreven artikelen over de staatsschuld
        van EU-lidstaten, schuld-tot-bbp-verhoudingen, tekorten en begrotingskaders.
        Alle inzichten zijn gebaseerd op transparante Eurostat-data en gekoppeld aan onze
        live schuldtrackers per land.
      </section>
    </main>
  );
}
