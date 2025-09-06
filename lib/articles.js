// lib/articles.js
// Klein, file-based "CMS" voor artikelen. Pas of voeg items toe.
// Beschikbare velden:
// slug (unique), title, summary, tags[], date (YYYY-MM-DD), lang ("en"|"nl"|"de"|"fr"), body (JSX string)

export const articles = [
  {
    slug: "eu-countries-with-highest-debt-2025",
    title: "Top 5 EU countries with the highest government debt (2025)",
    summary:
      "A quick look at which EU economies carry the largest nominal public debt in 2025—and why size isn’t the whole story.",
    tags: ["EU", "Trends", "Analysis"],
    date: "2025-09-01",
    lang: "en",
    body: `
<h2>What this list measures</h2>
<p>We look at <em>nominal</em> government debt in euros, based on the two latest Eurostat reference quarters used across EU Debt Map.</p>
<p>Nominal size is not the same as sustainability. Debt-to-GDP and financing costs matter too.</p>
<h3>Highlights</h3>
<ul>
  <li>France and Italy remain at the top in nominal terms.</li>
  <li>Smaller economies can still see fast quarterly deltas.</li>
</ul>
<p class="tag">Source: Eurostat (gov_10q_ggdebt).</p>
    `,
  },
  {
    slug: "why-debt-matters-interest-inflation",
    title: "Why government debt matters for rates and inflation",
    summary:
      "How public debt interacts with interest rates, inflation and fiscal stability—in plain language.",
    tags: ["Explainer"],
    date: "2025-09-03",
    lang: "en",
    body: `
<p>Public debt influences financial markets through the volume and maturity of issued bonds, expectations about deficits, and central bank conditions.</p>
<p>Higher debt can coincide with higher rates if investors demand compensation, but the relation depends on growth, credibility and monetary policy.</p>
<p class="tag">This article is educational, not financial advice.</p>
    `,
  },
];

// Helpers
export function listArticles({ lang } = {}) {
  let list = [...articles];
  if (lang) list = list.filter(a => a.lang === lang);
  // nieuwste eerst
  return list.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticle(slug) {
  return articles.find(a => a.slug === slug) || null;
}
