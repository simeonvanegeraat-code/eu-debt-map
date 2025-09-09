// lib/media.js
export function articleImage(a, type = "cover") {
  if (a?.image) return a.image;             // expliciet pad in je artikelobject
  if (a?.slug) return `/articles/${a.slug}/${type}.jpg`; // fallback op basis van slug
  return null;
}

export function articleOgImage(a) {
  if (a?.ogImage) return a.ogImage;         // expliciet og-image pad
  if (a?.slug) return `/articles/${a.slug}/og.jpg`; // fallback og-image
  return null;
}
