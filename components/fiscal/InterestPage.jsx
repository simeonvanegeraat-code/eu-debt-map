import FiscalRelatedLinks from "./FiscalRelatedLinks";
import { fiscalPageModified } from "@/lib/fiscal/discovery";
import Link from "next/link";
import snapshot from "@/lib/fiscal/interest.gen.json";
import debtSnapshot from "@/lib/fiscal/per-capita.gen.json";
import { INTEREST, interestAggregate } from "@/lib/fiscal/interest";
import { fiscalPath } from "@/lib/fiscal/paths";
import { editorialDisplay } from "@/lib/editorial-font";
import { getInterestCopy, interestNumber } from "./interest-copy";
import InterestExplorer from "./InterestExplorer";
import InterestSource from "./InterestSource";
import styles from "./fiscal.module.css";
import { DERIVED_DATASET_LICENSE_URL } from "@/lib/dataset-license";

const SITE = "https://www.eudebtmap.com";
export function interestMetadata(lang = "en") {
  const copy = getInterestCopy(lang), url = `${SITE}${fiscalPath("/interest-cost", lang)}`;
  const title = `${copy.title} (${snapshot.latestYear}) | EU Debt Map`;
  return { title, description: copy.description,
    alternates: { canonical: url, languages: { ...Object.fromEntries(["en", "nl", "de", "fr"].map(locale => [locale, `${SITE}${fiscalPath("/interest-cost", locale)}`])), "x-default": `${SITE}/interest-cost` } },
    openGraph: { title, description: copy.description, url, type: "website", locale: copy.locale.replace("-", "_"), images: [{ url: `${SITE}/og/eu-debt-map.jpg`, width: 1200, height: 630, alt: "EU Debt Map" }] },
    twitter: { card: "summary_large_image", title, description: copy.description },
  };
}

export default function InterestPage({ lang = "en" }) {
  const copy = getInterestCopy(lang), aggregate = interestAggregate(snapshot);
  const url = `${SITE}${fiscalPath("/interest-cost", lang)}`;
  const modified = new Date(Math.max(Date.parse(snapshot.fetchedAt), Date.parse(INTEREST.reviewedAt))).toISOString();
  const debtContext = debtSnapshot.debtYear === snapshot.latestYear ? { year: debtSnapshot.debtYear, countries: Object.fromEntries(Object.entries(debtSnapshot.countries).map(([code, row]) => [code, { amount: row.debtMioEur * 1e6, ratio: row.debtRatio, amountStatus: row.debtStatus, ratioStatus: row.ratioStatus }])) } : null;
  const graph = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": url, url, name: copy.title, description: copy.description, inLanguage: lang, dateModified: fiscalPageModified(modified), mainEntity: { "@id": `${url}#dataset` } },
    { "@type": "Dataset", "@id": `${url}#dataset`, url: `${url}#interest-cost-methodology`, name: `${copy.shortTitle} · EU27`, description: copy.formula, creator: { "@type": "Organization", name: "EU Debt Map", url: SITE }, publisher: { "@type": "Organization", name: "EU Debt Map", url: SITE }, license: DERIVED_DATASET_LICENSE_URL, isBasedOn: [INTEREST.metadata, INTEREST.populationMetadata], dateModified: modified, temporalCoverage: `${snapshot.years[0]}-01-01/${snapshot.latestYear}-12-31`, spatialCoverage: "EU-27 (2020 composition)", variableMeasured: [[copy.amount, "EUR"], [copy.ratio, "percent of GDP"], [copy.perCapita, "EUR per resident"], [copy.revenueShare, "percent of government revenue"]].map(([name, unitText]) => ({ "@type": "PropertyValue", name, unitText })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "EU Debt Map", item: `${SITE}${fiscalPath("/", lang)}` }, { "@type": "ListItem", position: 2, name: copy.shortTitle, item: url }] },
  ] };
  return <article className={`${styles.page} ${editorialDisplay.variable}`} lang={lang}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />
    <header className={styles.hero}><div className={styles.shell}><p className={styles.eyebrow}>{copy.eyebrow}</p><h1>{copy.title}</h1><p className={styles.intro}>{copy.intro}</p><p className={styles.period}>{copy.official}</p>
      <dl className={styles.heroStats}><div><dt>{copy.year}</dt><dd>{snapshot.latestYear}</dd></div><div><dt>{copy.total}</dt><dd style={{ fontSize: "clamp(28px,3.3vw,46px)" }}>{interestNumber(aggregate?.amount, lang, "compact")}<sup>{aggregate?.amountStatus}</sup></dd></div><div><dt>{copy.countries}</dt><dd>27 <span>EU</span></dd></div></dl>
    </div></header>
    <div className={styles.shell}><p className={styles.note}>{copy.weighted}</p></div>
    <InterestExplorer snapshot={{ years: snapshot.years, latestYear: snapshot.latestYear, countries: snapshot.countries }} debtContext={debtContext} lang={lang} />
    <section className={`${styles.context} ${styles.shell}`} aria-labelledby="interest-context-title"><h2 id="interest-context-title">{copy.contextTitle}</h2><div className={styles.contextGrid}><div><h3>{copy.contextCost}</h3><p>{copy.contextCostText}</p><Link href={fiscalPath("/", lang)}>{copy.debtLink} →</Link></div><div><h3>{copy.contextRevenue}</h3><p>{copy.contextRevenueText}</p><Link href={fiscalPath("/deficit", lang)}>{copy.balanceLink} →</Link></div></div><p>{copy.accounting}</p><p>{copy.populationNote}</p></section>
    <div className={styles.shell}><InterestSource lang={lang} /></div>
    <FiscalRelatedLinks indicator="interest-cost" lang={lang} />
  </article>;
}
