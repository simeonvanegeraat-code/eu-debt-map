// lib/media.js
// Helpers voor afbeeldingen in UI (relative) en voor social/meta (absolute).

const SITE =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://www.eudebtmap.com").replace(/\/$/, "");

/** Maak absolute URL voor OG/Twitter (vereist door crawlers) */
function absUrl(pathOrUrl) {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl; // al absoluut
  return `${SITE}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

/** Afbeelding voor UI componenten (relative is prima) */
export function articleImage(article, _variant = "cover") {
  // Gebruik artikelafbeelding of fallback
  return article?.image || "/images/default-og.jpg";
}

/** Afbeelding voor Open Graph / Twitter meta (moet absoluut zijn) */
export function articleOgImage(article) {
  const src = article?.image || "/images/default-og.jpg";
  return absUrl(src);
}
