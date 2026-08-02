import Link from "next/link";
import paginationCore from "@/lib/articleArchivePagination.cjs";
import styles from "./ArticleArchivePagination.module.css";

const { archivePagePath } = paginationCore;

const TEXT = {
  en: { label: "Article archive pages", previous: "Previous", next: "Next", page: "Page" },
  nl: { label: "Pagina's in het artikelarchief", previous: "Vorige", next: "Volgende", page: "Pagina" },
  de: { label: "Seiten im Artikelarchiv", previous: "Zurück", next: "Weiter", page: "Seite" },
  fr: { label: "Pages des archives d'articles", previous: "Précédente", next: "Suivante", page: "Page" },
};

export default function ArticleArchivePagination({
  lang = "en",
  currentPage = 1,
  totalPages = 1,
}) {
  if (totalPages <= 1) return null;

  const t = TEXT[lang] || TEXT.en;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className={styles.pagination} aria-label={t.label}>
      <div className={styles.controls}>
        {currentPage > 1 ? (
          <Link
            href={archivePagePath(lang, currentPage - 1)}
            rel="prev"
            className={styles.direction}
          >
            <span aria-hidden="true">←</span> {t.previous}
          </Link>
        ) : (
          <span className={`${styles.direction} ${styles.disabled}`} aria-hidden="true">
            <span>←</span> {t.previous}
          </span>
        )}

        <div className={styles.pages}>
          {pages.map((page) =>
            page === currentPage ? (
              <span
                key={page}
                className={`${styles.page} ${styles.current}`}
                aria-current="page"
                aria-label={`${t.page} ${page}`}
              >
                {page}
              </span>
            ) : (
              <Link
                key={page}
                href={archivePagePath(lang, page)}
                className={styles.page}
                aria-label={`${t.page} ${page}`}
              >
                {page}
              </Link>
            )
          )}
        </div>

        {currentPage < totalPages ? (
          <Link
            href={archivePagePath(lang, currentPage + 1)}
            rel="next"
            className={styles.direction}
          >
            {t.next} <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <span className={`${styles.direction} ${styles.disabled}`} aria-hidden="true">
            {t.next} <span>→</span>
          </span>
        )}
      </div>
    </nav>
  );
}
