// lib/locale.js
// Helpers voor taal-prefixing & taalwissel van routes.
// "" = Engels op root, "nl" / "de" / "fr" = subpath locales.

export const LOCALES = ["", "nl", "de", "fr"]; // volgorde belangrijk als je wil valideren
export const DEFAULT_LOCALE = ""; // EN op root

// Haal de locale uit de huidige pathname ("/", "/nl", "/de/about", ...)
export function getLocaleFromPathname(pathname = "/") {
  if (typeof pathname !== "string" || !pathname.length) return DEFAULT_LOCALE;
  const seg = pathname.replace(/^\/+/, "").split("/")[0] || "";
  return LOCALES.includes(seg) ? seg : DEFAULT_LOCALE;
}

// Bouw een pad op met de gekozen locale, behoudt de rest van het pad
// withLocale("/about", "nl") -> "/nl/about"
// withLocale("/nl/about", "") -> "/about"
export function withLocale(path = "/", locale = DEFAULT_LOCALE) {
  // Zorg dat we altijd met een leading slash werken
  if (!path.startsWith("/")) path = `/${path}`;

  // Strip eventuele query/hash (pathname-only logica)
  const [purePath] = path.split(/[?#]/);

  // Split en filter lege segmenten
  const parts = purePath.split("/").filter(Boolean);

  // Verwijder bestaande locale-segment als aanwezig
  if (parts.length && LOCALES.includes(parts[0])) {
    parts.shift();
  }

  // Voeg de gewenste locale toe (leeg = EN/root)
  const prefix = locale && locale !== DEFAULT_LOCALE ? `/${locale}` : "";

  // Herbouw het pad
  const rest = parts.length ? `/${parts.join("/")}` : "/";
  const joined = `${prefix}${rest}`;

  // Normaliseer dubbele slashes en trailing slash
  return joined.replace(/\/{2,}/g, "/").replace(/\/+$/, "") || "/";
}

// Handige helper voor UI (bijv. in Header): geeft "/nl" of "" terug
export function currentPrefix(pathname = "/") {
  const loc = getLocaleFromPathname(pathname);
  return loc ? `/${loc}` : "";
}
