import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import ArticleArchivePagination from "@/components/ArticleArchivePagination";
import { listArticles } from "@/lib/articles";
import paginationCore from "@/lib/articleArchivePagination.cjs";
import styles from "./PaginatedArticleArchivePage.module.css";

const {
  FEATURED_COUNT,
  SUPPORTED_LANGS,
  archiveBasePath,
  archivePagePath,
  archiveStaticParams,
  normalizeLang,
  paginateArchive,
} = paginationCore;

const SITE = "https://www.eudebtmap.com";

const TEXT = {
  en: {
    eyebrow: "Article archive",
    heading: (page) => `EU debt articles — page ${page}`,
    description: "Browse earlier EU Debt Map articles, explainers and data-backed analysis.",
    back: "Back to featured articles",
    metadataTitle: (page) => `EU Debt Articles – Page ${page} • EU Debt Map`,
  },
  nl: {
    eyebrow: "Artikelarchief",
    heading: (page) => `Artikelen over EU-schuld — pagina ${page}`,
    description: "Bekijk eerdere artikelen, uitleg en data-analyses van EU Debt Map.",
    back: "Terug naar uitgelichte artikelen",
    metadataTitle: (page) => `Artikelen over EU-schuld – Pagina ${page} • EU Debt Map`,
  },
  de: {
    eyebrow: "Artikelarchiv",
    heading: (page) => `Artikel über EU-Schulden — Seite ${page}`,
    description: "Lesen Sie frühere Artikel, Erklärungen und datenbasierte Analysen von EU Debt Map.",
    back: "Zurück zu den vorgestellten Artikeln",
    metadataTitle: (page) => `Artikel über EU-Schulden – Seite ${page} • EU Debt Map`,
  },
  fr: {
    eyebrow: "Archives des articles",
    heading: (page) => `Articles sur la dette de l'UE — page ${page}`,
    description: "Consultez les anciens articles, explications et analyses d'EU Debt Map.",
    back: "Retour aux articles à la une",
    metadataTitle: (page) => `Articles sur la dette de l'UE – Page ${page} • EU Debt Map`,
  },
};

function getArchiveData(lang, page) {
  const normalizedLang = normalizeLang(lang);
  const articles = listArticles({ lang: normalizedLang });
  return {
    lang: normalizedLang,
    data: paginateArchive(articles, page),
  };
}

export function getArticleArchiveStaticParams(lang) {
  const normalizedLang = normalizeLang(lang);
  return archiveStaticParams(listArticles({ lang: normalizedLang }));
}

export function getArticleArchiveMetadata({ lang, page }) {
  const archive = getArchiveData(lang, page);
  const pageNumber = Number(page);
  const t = TEXT[archive.lang] || TEXT.en;

  if (!archive.data || pageNumber < 2) {
    return {
      title: "Article archive • EU Debt Map",
      robots: { index: false, follow: true },
    };
  }

  const canonical = `${SITE}${archivePagePath(archive.lang, pageNumber)}`;
  const languages = {};

  for (const candidateLang of SUPPORTED_LANGS) {
    const candidate = paginateArchive(
      listArticles({ lang: candidateLang }),
      pageNumber
    );

    if (candidate) {
      languages[candidateLang] = `${SITE}${archivePagePath(candidateLang, pageNumber)}`;
    }
  }

  if (languages.en) languages["x-default"] = languages.en;

  return {
    title: t.metadataTitle(pageNumber),
    description: t.description,
    alternates: { canonical, languages },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    openGraph: {
      title: t.metadataTitle(pageNumber),
      description: t.description,
      url: canonical,
      siteName: "EU Debt Map",
      type: "website",
    },
  };
}

export default function PaginatedArticleArchivePage({ lang = "en", page }) {
  const archive = getArchiveData(lang, page);
  const pageNumber = Number(page);

  if (!archive.data || pageNumber < 2) notFound();

  const t = TEXT[archive.lang] || TEXT.en;
  const basePath = archiveBasePath(archive.lang);
  const canonical = `${SITE}${archivePagePath(archive.lang, pageNumber)}`;
  const firstPosition = FEATURED_COUNT + (pageNumber - 1) * archive.data.pageSize + 1;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t.heading(pageNumber),
    description: t.description,
    url: canonical,
    isPartOf: {
      "@type": "WebSite",
      name: "EU Debt Map",
      url: SITE,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: archive.data.items.map((article, index) => ({
        "@type": "ListItem",
        position: firstPosition + index,
        url: `${SITE}${article.url}`,
        name: article.title,
      })),
    },
  };

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href={basePath} className={styles.backLink}>
            <span aria-hidden="true">←</span> {t.back}
          </Link>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <h1>{t.heading(pageNumber)}</h1>
          <p className={styles.description}>{t.description}</p>
        </header>

        <ul className={styles.list}>
          {archive.data.items.map((article) => (
            <ArticleCard
              key={`${article.lang}-${article.slug}`}
              article={article}
            />
          ))}
        </ul>

        <ArticleArchivePagination
          lang={archive.lang}
          currentPage={archive.data.currentPage}
          totalPages={archive.data.totalPages}
        />
      </div>
    </div>
  );
}
