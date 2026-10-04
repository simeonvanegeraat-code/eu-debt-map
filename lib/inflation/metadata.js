const snapshot = require("./inflation.gen.json");
const { INFLATION } = require("./indicators");
const { getInflationCopy, formatMonth } = require("../../components/inflation/copy");
const { localeAwareHref } = require("../navigation");
const SITE = "https://www.eudebtmap.com";
function inflationModified() {
  return new Date(Math.max(Date.parse(snapshot.fetchedAt), Date.parse(INFLATION.reviewedAt))).toISOString();
}
function inflationMetadata(lang = "en") {
  const copy = getInflationCopy(lang);
  const url = `${SITE}${localeAwareHref("/inflation", lang)}`;
  const title = `${copy.title} — ${formatMonth(snapshot.latestMonth, lang)} | EU Debt Map`;
  return {
    title, description: copy.description,
    alternates: { canonical: url, languages: {
      ...Object.fromEntries(["en", "nl", "de", "fr"].map(locale => [locale, `${SITE}${localeAwareHref("/inflation", locale)}`])),
      "x-default": `${SITE}/inflation`,
    } },
    openGraph: { title, description: copy.description, url, type: "website", locale: copy.locale.replace("-", "_"),
      images: [{ url: `${SITE}/og/eu-debt-map.jpg`, width: 1200, height: 630, alt: "EU Debt Map" }] },
    twitter: { card: "summary_large_image", title, description: copy.description },
  };
}
module.exports = { inflationMetadata, inflationModified };
