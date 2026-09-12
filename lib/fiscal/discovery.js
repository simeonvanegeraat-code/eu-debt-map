const translations = require("../../content/article-translations.json");
const { fiscalPath } = require("./paths");

// Navigation review dates belong to pages, never to the official observations.
const FISCAL_DISCOVERY_REVIEWED = "2026-09-08T00:00:00Z";
const RELATED_INDICATORS = {
  deficit: ["government-spending", "interest-cost"],
  "debt-per-capita": ["debt-to-gdp", "debt-growth"],
  "debt-growth": ["debt-to-gdp", "interest-cost"],
  "interest-cost": ["government-spending", "debt-growth"],
  "government-spending": ["debt-growth", "debt-to-gdp"],
};
const METRIC_ROUTES = {
  debt: "/", debtRatio: "/debt-to-gdp", perCapita: "/debt-per-capita",
  balance: "/deficit", interest: "/interest-cost",
  expenditure: "/government-spending", revenue: "/government-spending",
};
const ARTICLE_GROUPS = [
  { key: "eu-debt-burden-2026", indicators: ["debt-growth", "deficit", "interest-cost", "government-spending"], note: "debtArticle" },
  { key: "eu-debt-per-capita-2026", indicators: ["debt-per-capita"], note: "capitaArticle" },
];

function relatedFiscalArticles(indicator, lang, articles) {
  return ARTICLE_GROUPS.filter(group => group.indicators.includes(indicator)).flatMap(group => {
    const slug = translations[group.key]?.[lang];
    const article = articles.find(item => item.lang === lang && item.slug === slug && item.title);
    return article ? [{ title: article.title, href: fiscalPath(`/articles/${slug}`, lang), note: group.note }] : [];
  });
}

function articleFiscalIndicators(slug, lang) {
  const group = ARTICLE_GROUPS.find(item => translations[item.key]?.[lang] === slug);
  if (!group) return null;
  return { indicators: group.key === "eu-debt-per-capita-2026" ? ["debt-per-capita", "debt-to-gdp"] : ["debt-growth", "deficit", "interest-cost"], note: group.note };
}

function fiscalPageModified(value) {
  return new Date(Math.max(Date.parse(value), Date.parse(FISCAL_DISCOVERY_REVIEWED))).toISOString();
}

function countryFiscalDescription({ name, lang = "en", ratio, period }) {
  const locale = { en: "en-GB", nl: "nl-NL", de: "de-DE", fr: "fr-FR" }[lang] || "en-GB";
  const validRatio = Number.isFinite(ratio) && /^\d{4}-Q[1-4]$/.test(period || "");
  const value = validRatio
    ? `${new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(ratio)}%`
    : null;
  const descriptions = value ? {
    en: `Track ${name} public debt live and see the official Eurostat debt-to-GDP ratio of ${value} for ${period}.`,
    nl: `Bekijk de staatsschuld van ${name} live en de officiële Eurostat-schuldquote van ${value} voor ${period}.`,
    de: `Verfolgen Sie die Staatsschulden von ${name} live und sehen Sie die offizielle Eurostat-Schuldenquote von ${value} für ${period}.`,
    fr: `Suivez la dette publique de ${name} en direct et consultez le ratio officiel d’Eurostat de ${value} pour ${period}.`,
  } : {
    en: `Track ${name} public debt live with a real-time estimate based on Eurostat data. See debt levels, GDP ratio, and country details.`,
    nl: `Bekijk de staatsschuld van ${name} live met een actuele schatting op basis van Eurostat. Inclusief schuldniveau en bbp-verhouding.`,
    de: `Verfolge die Staatsverschuldung von ${name} live mit einer aktuellen Schätzung auf Basis von Eurostat. Inklusive Schuldenstand und BIP-Verhältnis.`,
    fr: `Suivez la dette publique de ${name} en direct avec une estimation actuelle basée sur Eurostat. Inclut le niveau de dette et le ratio dette/PIB.`,
  };
  return descriptions[lang] || descriptions.en;
}

function countrySocialMetadata({ title, description, url, lang }) {
  const image = { url: "https://www.eudebtmap.com/og/eu-debt-map.jpg", width: 1200, height: 630, alt: "EU Debt Map" };
  return {
    openGraph: { title, description, url, type: "website", siteName: "EU Debt Map", locale: { en: "en_GB", nl: "nl_NL", de: "de_DE", fr: "fr_FR" }[lang], images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

module.exports = { FISCAL_DISCOVERY_REVIEWED, RELATED_INDICATORS, METRIC_ROUTES, relatedFiscalArticles, articleFiscalIndicators, fiscalPageModified, countryFiscalDescription, countrySocialMetadata };
