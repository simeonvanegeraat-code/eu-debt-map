import Link from "next/link";
import snapshot from "@/lib/inflation/inflation.gen.json";
import { INFLATION, euroMembers, observation } from "@/lib/inflation/indicators";
import { inflationMetadata, inflationModified } from "@/lib/inflation/metadata";
import { localeAwareHref } from "@/lib/navigation";
import { DERIVED_DATASET_LICENSE_URL } from "@/lib/dataset-license";
import { formatMonth, formatRate, getInflationCopy, statusText } from "./copy";
import InflationExplorer from "./InflationExplorer";
import typography from "@/components/typography/typography.module.css";
import styles from "./inflation.module.css";

export default function InflationPage({ lang = "en" }) {
  const copy = getInflationCopy(lang);
  const metadata = inflationMetadata(lang);
  const url = metadata.alternates.canonical;
  const date = value => new Intl.DateTimeFormat(copy.locale, { dateStyle: "long", timeZone: "Europe/Amsterdam" }).format(new Date(value));
  const graph = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": url, url, name: copy.title, description: copy.description, inLanguage: lang,
      dateModified: inflationModified(), mainEntity: { "@id": `${url}#dataset` } },
    { "@type": "Dataset", "@id": `${url}#dataset`, url: `${url}#inflation-methodology`, name: `${copy.title} · HICP`,
      description: copy.sourceDetail, creator: { "@type": "Organization", name: "Eurostat", url: "https://ec.europa.eu/eurostat" },
      publisher: { "@type": "Organization", name: "EU Debt Map", url: "https://www.eudebtmap.com" },
      license: DERIVED_DATASET_LICENSE_URL, isBasedOn: INFLATION.datasetUrl, dateModified: snapshot.source.updated,
      temporalCoverage: `${snapshot.periods[0]}/${snapshot.latestMonth}`, spatialCoverage: "EU-27; euro area (changing composition)",
      variableMeasured: [copy.annual, copy.monthly].map(name => ({ "@type": "PropertyValue", name, unitText: "percent" })) },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "EU Debt Map", item: `https://www.eudebtmap.com${localeAwareHref("/", lang)}` },
      { "@type": "ListItem", position: 2, name: copy.shortTitle, item: url },
    ] },
  ] };
  return <article className={`${styles.page} ${typography.page}`} lang={lang}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />
    <header className={styles.hero}><div className={styles.shell}>
      <p className={styles.heroEyebrow}>{copy.eyebrow}</p>
      <h1>{copy.title}</h1><p className={styles.intro}>{copy.intro}</p>
      <p className={styles.release}><span aria-hidden="true" />{copy.latest}: <time dateTime={snapshot.latestMonth}>{formatMonth(snapshot.latestMonth, lang)}</time></p>
      <p className={styles.freshness}>{copy.freshness}</p>
      <dl className={styles.heroStats}>
        <div><dt>{copy.euroArea}</dt><dd>{formatRate(observation(snapshot, "EA", snapshot.latestMonth).value, lang)}</dd><small>{copy.annual} · {euroMembers(snapshot.latestMonth).length} {copy.countries.toLocaleLowerCase(copy.locale)}</small></div>
        <div><dt>{copy.eu}</dt><dd>{formatRate(observation(snapshot, "EU27_2020", snapshot.latestMonth).value, lang)}</dd><small>{copy.annual} · EU-27</small></div>
        <div><dt>{copy.coverage}</dt><dd className={styles.historyStat}>2015 <span>—</span> {snapshot.latestMonth.slice(0, 4)}</dd><small>{copy.official}</small></div>
      </dl>
      <nav className={styles.heroLinks} aria-label={copy.shortTitle}><a href="#inflation-explorer">{copy.explore} ↓</a><a href="#inflation-methodology">{copy.methodologyLink} ↗</a></nav>
    </div></header>
    <InflationExplorer snapshot={snapshot} lang={lang} />
    <div className={styles.shell}>
      <section className={styles.section} aria-labelledby="reading-title"><p className={styles.eyebrow}>HICP / IPCH / HVPI</p><h2 id="reading-title">{copy.reading}</h2><div className={styles.explanations}>{copy.explanations.map(([title, text], index) => <div key={title}><span className={styles.explanationNumber}>0{index + 1}</span><h3>{title}</h3><p>{text}</p></div>)}</div></section>
      <section className={`${styles.section} ${styles.source}`} id="inflation-methodology" aria-labelledby="source-title">
        <h2 id="source-title">{copy.methodology}</h2><p>{copy.sourceDetail}</p>
        <dl className={styles.sourceDates}>{[[copy.source, "Eurostat · prc_hicp_minr"], [copy.fetched, date(snapshot.fetchedAt)], [copy.updated, date(snapshot.source.updated)], [copy.reviewed, date(INFLATION.reviewedAt)]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <p>{copy.releaseNote}</p><p>{copy.aggregateNote}</p><p>{copy.historyNote}</p>
        <div className={styles.sourceLinks}>{[[INFLATION.datasetUrl, copy.dataset], [INFLATION.metadataUrl, copy.definitions], [INFLATION.informationUrl, copy.releaseCalendar], [INFLATION.membershipUrl, copy.membership]].map(([href, label]) => <a key={href} href={href} target="_blank" rel="noopener noreferrer">{label} ↗</a>)}</div>
        <details className={styles.flags}><summary>{copy.flagsTitle}</summary><dl>{Object.keys(snapshot.statusLabels).sort().map(flag => <div key={flag}><dt>{flag}</dt><dd>{statusText(flag, lang, snapshot.statusLabels)}</dd></div>)}</dl><p>{copy.missing}</p></details>
      </section>
      <aside className={styles.related}><p>{copy.debtText}</p><Link href={localeAwareHref("/", lang)}>{copy.debtLink} →</Link></aside>
    </div>
  </article>;
}
