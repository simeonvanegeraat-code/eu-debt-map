import FiscalRelatedLinks from "./FiscalRelatedLinks";
import { fiscalPageModified } from "@/lib/fiscal/discovery";
import Link from "next/link";
import snapshot from "@/lib/fiscal/balance.gen.json";
import { BALANCE } from "@/lib/fiscal/indicators";
import { balanceRows } from "@/lib/fiscal/balance-core";
import { fiscalPath } from "@/lib/fiscal/paths";
import typography from "@/components/typography/typography.module.css";
import BalanceExplorer from "./BalanceExplorer";
import BalanceSource from "./BalanceSource";
import { getBalanceCopy, formatFiscal } from "./balance-copy";
import styles from "./fiscal.module.css";

const SITE = "https://www.eudebtmap.com";

export function balanceMetadata(lang = "en") {
  const copy = getBalanceCopy(lang);
  const url = `${SITE}${fiscalPath("/deficit", lang)}`;
  const title = `${copy.title} (${snapshot.latestCompleteYear}) | EU Debt Map`;
  return { title, description: copy.description,
    alternates: { canonical: url, languages: { ...Object.fromEntries(["en", "nl", "de", "fr"].map((locale) => [locale, `${SITE}${fiscalPath("/deficit", locale)}`])), "x-default": `${SITE}/deficit` } },
    openGraph: { title, description: copy.description, url, type: "website", locale: copy.locale.replace("-", "_"), images: [{ url: `${SITE}/og/eu-debt-map.jpg`, width: 1200, height: 630, alt: "EU Debt Map" }] },
    twitter: { card: "summary_large_image", title, description: copy.description },
  };
}

export default function BalancePage({ lang = "en" }) {
  const copy = getBalanceCopy(lang);
  const rows = balanceRows(snapshot);
  const year = snapshot.latestCompleteYear;
  const eu = snapshot.series.EU27_2020[year];
  const history = Object.fromEntries(rows.map(({ code }) => [code, snapshot.years.map((time) => ({ year: time, value: snapshot.series[code][time].balance, status: snapshot.series[code][time].balanceStatus }))]));
  const url = `${SITE}${fiscalPath("/deficit", lang)}`;
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": url, url, name: copy.title, description: copy.description, inLanguage: lang,
      dateModified: fiscalPageModified(new Date(Math.max(Date.parse(BALANCE.contentReviewedAt), Date.parse(snapshot.fetchedAt))).toISOString()), mainEntity: { "@id": `${url}#dataset` } },
    { "@type": "Dataset", "@id": `${url}#dataset`, name: `${copy.balance} · EU-27 · ${snapshot.years[0]}–${year}`, description: `${copy.definition} ${copy.calculations}`, url: `${url}#budget-balance-methodology`,
      creator: { "@type": "Organization", name: "Eurostat", url: "https://ec.europa.eu/eurostat" },
      publisher: { "@type": "Organization", name: "EU Debt Map", url: SITE }, isBasedOn: BALANCE.datasetUrl,
      temporalCoverage: `${snapshot.years[0]}/${year}`, spatialCoverage: "EU-27 (2020 composition)",
      variableMeasured: [{ "@type": "PropertyValue", name: "General government net lending (+) / net borrowing (−)", propertyID: "B9", unitText: "% of GDP" }, { "@type": "PropertyValue", name: "Year-end general government consolidated gross debt", propertyID: "GD", unitText: "% of GDP" }],
      measurementTechnique: "ESA 2010; S13; annual; PC_GDP", dateModified: new Date(snapshot.sourceUpdated).toISOString(), citation: copy.attribution },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "EU Debt Map", item: `${SITE}${fiscalPath("/", lang)}` }, { "@type": "ListItem", position: 2, name: copy.shortTitle, item: url }] },
  ] };
  return <article className={`${styles.page} ${typography.page}`} lang={lang}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <header className={styles.hero}><div className={styles.shell}>
      <p className={styles.eyebrow}>{copy.eyebrow}</p><h1>{copy.title}</h1><p className={styles.intro}>{copy.intro}</p>
      <p className={styles.period}>{copy.official} · {copy.year} {year} · Eurostat</p>
      <dl className={styles.heroStats}>
        <div><dt>{copy.eu}</dt><dd>{formatFiscal(eu.balance, lang)}<sup>{eu.balanceStatus}</sup></dd><small>{copy.gdp}</small></div>
        <div><dt>{copy.surplusCount}</dt><dd>{rows.filter((row) => row.balance > 0).length}<span> / 27</span></dd></div>
        <div><dt>{copy.beyondCount}</dt><dd>{rows.filter((row) => Number.isFinite(row.balance) && row.balance < BALANCE.referenceValue).length}<span> / 27</span></dd></div>
      </dl><p className={styles.heroNote}>{copy.euNote}</p>
    </div></header>
    <BalanceExplorer rows={rows} history={history} year={year} lang={lang} />
    <section className={`${styles.context} ${styles.shell}`} aria-labelledby="balance-context-title"><p className={styles.eyebrow}>{copy.shortTitle} / {copy.debt}</p><h2 id="balance-context-title">{copy.contextTitle}</h2>
      <div className={styles.contextGrid}><div><h3>{copy.definitionTitle}</h3><p>{copy.definition}</p><Link href={fiscalPath("/debt-vs-deficit", lang)}>{copy.moreDebt} →</Link></div>
      <div><h3>{copy.connectionTitle}</h3><p>{copy.connection}</p><Link href={fiscalPath("/debt-to-gdp", lang)}>{copy.ratioLink} →</Link></div></div>
      <aside id="balance-reference" className={styles.reference}><h3>{copy.referenceTitle}</h3><p>{copy.reference}</p><a href={BALANCE.referenceUrl}>{copy.referenceSource} ↗</a></aside>
      <Link className={styles.textLink} href={fiscalPath("/", lang)}>{copy.debtLink} →</Link>
    </section>
    <div className={styles.shell}><BalanceSource lang={lang} /></div>
    <FiscalRelatedLinks indicator="deficit" lang={lang} />
  </article>;
}
