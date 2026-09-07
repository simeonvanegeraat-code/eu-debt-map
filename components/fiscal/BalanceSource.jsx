import Link from "next/link";
import snapshot from "@/lib/fiscal/balance.gen.json";
import { BALANCE } from "@/lib/fiscal/indicators";
import { fiscalPath } from "@/lib/fiscal/paths";
import { getBalanceCopy } from "./balance-copy";
import styles from "./fiscal.module.css";

export default function BalanceSource({ lang = "en", methodology = false }) {
  const copy = getBalanceCopy(lang);
  const date = (value) => new Intl.DateTimeFormat(copy.locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(value));
  return <section className={styles.source} id="budget-balance-methodology" aria-labelledby="balance-source-title">
    <p className={styles.eyebrow}>{copy.official}</p><h2 id="balance-source-title">{methodology ? `${copy.shortTitle} · ${copy.methodology}` : copy.sourceTitle}</h2>
    <p>{copy.attribution}</p>
    <dl className={styles.sourceFacts}>
      <div><dt>{copy.source}</dt><dd><a href={BALANCE.datasetUrl}>Eurostat · {BALANCE.dataset}</a></dd></div>
      <div><dt>{copy.year}</dt><dd>{snapshot.latestCompleteYear} · {copy.gdp}</dd></div>
      <div><dt>{copy.updated}</dt><dd><time dateTime={new Date(snapshot.sourceUpdated).toISOString()}>{date(snapshot.sourceUpdated)}</time></dd></div>
      <div><dt>{copy.accessed}</dt><dd><time dateTime={snapshot.fetchedAt}>{date(snapshot.fetchedAt)}</time></dd></div>
    </dl>
    <p>{copy.filters}</p><p>{copy.debtNote}</p>
    <h3>{copy.calculation}</h3><p>{copy.calculations}</p><p>{copy.rankNote}</p>
    <details><summary>{copy.methodology} · {copy.source}</summary><p>{copy.definition}</p><p>{copy.updateLogic}</p><p>{copy.period}: {snapshot.years[0]}–{snapshot.latestCompleteYear}.</p><p>{copy.flags}</p>
      <ul className={styles.sourceLinks}><li><a href={BALANCE.metadataUrl}>{copy.metadata}</a></li><li><a href={snapshot.sourceUrls.balance}>{copy.apiBalance}</a></li><li><a href={snapshot.sourceUrls.debt}>{copy.apiDebt}</a></li><li><a href={BALANCE.referenceUrl}>{copy.referenceSource}</a></li></ul>
    </details>
    <Link className={styles.textLink} href={fiscalPath(methodology ? "/deficit" : "/methodology#budget-balance-methodology", lang)}>{methodology ? copy.comparisonLink : copy.methodology} →</Link>
  </section>;
}
