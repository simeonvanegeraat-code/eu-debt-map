import FiscalRelatedLinks from "./FiscalRelatedLinks";
import { fiscalPageModified } from "@/lib/fiscal/discovery";
import Link from "next/link";
import snapshot from "@/lib/fiscal/accounts.gen.json";
import edp from "@/lib/fiscal/balance.gen.json";
import { ACCOUNTS, accountPoints, edpComparison } from "@/lib/fiscal/accounts";
import { fiscalPath } from "@/lib/fiscal/paths";
import { editorialDisplay } from "@/lib/editorial-font";
import { getAccountsCopy, accountNumber } from "./accounts-copy";
import AccountsExplorer from "./AccountsExplorer";
import AccountsSource from "./AccountsSource";
import styles from "./fiscal.module.css";
import { DERIVED_DATASET_LICENSE_URL } from "@/lib/dataset-license";

const SITE = "https://www.eudebtmap.com";
export function accountsMetadata(lang = "en") {
  const copy = getAccountsCopy(lang), url = `${SITE}${fiscalPath("/government-spending", lang)}`, title = `${copy.title} (${snapshot.latestYear}) | EU Debt Map`;
  return { title, description: copy.description, alternates: { canonical: url, languages: { ...Object.fromEntries(["en", "nl", "de", "fr"].map(locale => [locale, `${SITE}${fiscalPath("/government-spending", locale)}`])), "x-default": `${SITE}/government-spending` } },
    openGraph: { title, description: copy.description, url, type: "website", locale: copy.locale.replace("-", "_"), images: [{ url: `${SITE}/og/eu-debt-map.jpg`, width: 1200, height: 630, alt: "EU Debt Map" }] }, twitter: { card: "summary_large_image", title, description: copy.description } };
}
export default function AccountsPage({ lang = "en" }) {
  const copy = getAccountsCopy(lang), eu = accountPoints(snapshot, "EU27_2020").at(-1), url = `${SITE}${fiscalPath("/government-spending", lang)}`;
  const modified = new Date(Math.max(Date.parse(snapshot.fetchedAt), Date.parse(ACCOUNTS.reviewedAt))).toISOString();
  const graph = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": url, url, name: copy.title, description: copy.description, inLanguage: lang, dateModified: fiscalPageModified(modified), mainEntity: { "@id": `${url}#dataset` } },
    { "@type": "Dataset", "@id": `${url}#dataset`, url: `${url}#government-accounts-methodology`, name: `${copy.shortTitle} · EU27`, description: copy.identity, creator: { "@type": "Organization", name: "EU Debt Map", url: SITE }, publisher: { "@type": "Organization", name: "EU Debt Map", url: SITE }, license: DERIVED_DATASET_LICENSE_URL, isBasedOn: ACCOUNTS.metadata, dateModified: modified, temporalCoverage: `${snapshot.years[0]}-01-01/${snapshot.latestYear}-12-31`, spatialCoverage: "EU-27 (2020 composition)", variableMeasured: Object.keys(ACCOUNTS.sources).map(key => ({ "@type": "PropertyValue", name: copy[key], unitText: key.endsWith("Ratio") ? "percent of GDP" : "EUR" })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "EU Debt Map", item: `${SITE}${fiscalPath("/", lang)}` }, { "@type": "ListItem", position: 2, name: copy.shortTitle, item: url }] },
  ] };
  return <article className={`${styles.page} ${editorialDisplay.variable}`} lang={lang}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />
    <header className={styles.hero}><div className={styles.shell}><p className={styles.eyebrow}>{copy.eyebrow}</p><h1>{copy.title}</h1><p className={styles.intro}>{copy.intro}</p><p className={styles.period}>{copy.official} · {copy.year}: {snapshot.latestYear}</p><p className={styles.heroNote}>{copy.eu}</p>
      <dl className={styles.heroStats}>{["expenditure", "revenue", "balance"].map(key => <div key={key}><dt>{copy[key]} · % {lang === "de" ? "BIP" : lang === "fr" ? "PIB" : lang === "nl" ? "bbp" : "GDP"}</dt><dd>{accountNumber(eu[`${key}Ratio`], lang, "percent")}<sup>{eu[`${key}RatioStatus`]}</sup></dd><small>{accountNumber(eu[key], lang, "compact")}<sup>{eu[`${key}Status`]}</sup></small></div>)}</dl>
    </div></header>
    <AccountsExplorer snapshot={{ latestYear: snapshot.latestYear, years: snapshot.years, countries: snapshot.countries, eu: snapshot.eu }} comparisons={Object.fromEntries(Object.keys(snapshot.countries).map(code => [code, edpComparison(snapshot, edp, code)]))} lang={lang} />
    <section className={`${styles.context} ${styles.shell}`} aria-labelledby="accounts-context-title"><h2 id="accounts-context-title">{copy.contextTitle}</h2><div className={styles.contextGrid}><div><h3>{copy.contextSpending}</h3><p>{copy.spendingText}</p><p>{copy.interestNote}</p><Link href={fiscalPath("/interest-cost", lang)}>{copy.interestLink} →</Link></div><div><h3>{copy.contextRevenue}</h3><p>{copy.revenueText}</p><Link href={fiscalPath("/deficit", lang)}>{copy.deficitLink} →</Link></div></div></section>
    <div className={styles.shell}><AccountsSource lang={lang} /></div>
    <FiscalRelatedLinks indicator="government-spending" lang={lang} />
  </article>;
}
