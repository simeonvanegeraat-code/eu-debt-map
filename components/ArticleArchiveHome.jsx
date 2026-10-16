import Link from "next/link";
import ArticleArchiveStory from "./ArticleArchiveStory";
import ArticleArchivePagination from "./ArticleArchivePagination";
import ExploreDataLink from "./ExploreDataLink";
import styles from "./ArticleArchiveHome.module.css";

const TEXT = {
  en: {
    heading: "EU Debt Insights", intro: "Analysis and explainers on government debt and public finances in Europe.",
    articles: "Articles", latest: "Latest articles", tools: "Explore the data", map: "Live debt map", ratio: "Debt-to-GDP", methodology: "Methodology", reports: "EU debt overview", explained: "Government debt explained",
    context: "Compare countries, explore the figures and see how our estimates are calculated.", empty: "No articles published yet.",
  },
  nl: {
    heading: "EU Schuldinzichten", intro: "Analyses en uitleg over staatsschuld en overheidsfinanciën in Europa.",
    articles: "Artikelen", latest: "Laatste artikelen", tools: "Ontdek de cijfers", map: "Live schuldenkaart", ratio: "Schuld ten opzichte van bbp", methodology: "Methodologie", reports: "EU-schuld in beeld", explained: "Staatsschuld uitgelegd",
    context: "Vergelijk landen, bekijk de cijfers en ontdek hoe onze schattingen worden berekend.", empty: "Er zijn nog geen artikelen gepubliceerd.",
  },
  de: {
    heading: "EU-Schuldenanalysen", intro: "Analysen und Erklärungen zu Staatsschulden und öffentlichen Finanzen in Europa.",
    articles: "Artikel", latest: "Neueste Artikel", tools: "Daten entdecken", map: "Live-Schuldenkarte", ratio: "Schuldenquote", methodology: "Methodik", reports: "EU-Schulden im Überblick", explained: "Staatsschulden erklärt",
    context: "Vergleichen Sie Länder, erkunden Sie die Zahlen und erfahren Sie, wie unsere Schätzungen entstehen.", empty: "Noch keine Artikel veröffentlicht.",
  },
  fr: {
    heading: "Analyses de la dette de l’UE", intro: "Analyses et explications sur la dette publique et les finances publiques en Europe.",
    articles: "Articles", latest: "Derniers articles", tools: "Explorer les données", map: "Carte de la dette en direct", ratio: "Dette rapportée au PIB", methodology: "Méthodologie", reports: "La dette de l’UE en chiffres", explained: "Comprendre la dette publique",
    context: "Comparez les pays, explorez les chiffres et découvrez comment nos estimations sont calculées.", empty: "Aucun article publié pour le moment.",
  },
};

export default function ArticleArchiveHome({ lang = "en", featured = [], articles = [], pagination, jsonLd }) {
  const t = TEXT[lang] || TEXT.en;
  const prefix = lang === "en" ? "" : `/${lang}`;
  const [lead, ...otherFeatured] = featured.filter(Boolean);
  // Small archives can contain the featured stories in the pagination slice too.
  const featuredSlugs = new Set(featured.filter(Boolean).map((article) => article.slug));
  const stories = [...otherFeatured, ...articles.filter((article) => !featuredSlugs.has(article.slug))];

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className={styles.shell}>
        <header className={styles.header}>
          <h1>{t.heading}</h1>
          <p>{t.intro}</p>
        </header>
        <nav className={styles.sectionNav} aria-label={t.articles}>
          <Link href={`${prefix}/articles`} aria-current="page">{t.articles}</Link>
          <a href="#latest-articles">{t.latest}</a>
          <ExploreDataLink>{t.tools}</ExploreDataLink>
        </nav>
        <div className={styles.layout}>
          <div className={styles.feed}>
            {lead ? <ArticleArchiveStory article={lead} featured /> : <p>{t.empty}</p>}
            <section id="latest-articles" aria-labelledby="latest-heading" className={styles.latest}>
              <h2 id="latest-heading" className={styles.sectionTitle}>{t.latest}</h2>
              <ul className={styles.list}>
                {stories.map((article) => (
                  <li key={`${article.lang}-${article.slug}`}><ArticleArchiveStory article={article} /></li>
                ))}
              </ul>
            </section>
            <ArticleArchivePagination lang={lang} currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
          </div>
          <aside id="explore-data" aria-labelledby="explore-heading" className={styles.resources}>
            <h2 id="explore-heading">{t.tools}</h2>
            <p>{t.context}</p>
            <ul>
              {[["/", t.map], ["/eu-debt", t.reports], ["/debt-to-gdp", t.ratio], ["/debt", t.explained], ["/methodology", t.methodology]].map(([path, label]) => (
                <li key={path}><Link href={`${prefix}${path}`}><span>{label}</span><span aria-hidden="true">→</span></Link></li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
