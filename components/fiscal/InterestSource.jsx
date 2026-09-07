import Link from "next/link";
import snapshot from "@/lib/fiscal/interest.gen.json";
import { INTEREST } from "@/lib/fiscal/interest";
import { fiscalPath } from "@/lib/fiscal/paths";
import { getInterestCopy } from "./interest-copy";
import styles from "./fiscal.module.css";

export default function InterestSource({ lang = "en", methodology = false }) {
  const copy = getInterestCopy(lang);
  const date = value => new Intl.DateTimeFormat(copy.locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(value));
  return <section className={styles.source} id="interest-cost-methodology" aria-labelledby="interest-source-title">
    <p className={styles.eyebrow}>{copy.official}</p><h2 id="interest-source-title">{methodology ? `${copy.shortTitle} · ${copy.method}` : copy.sourceTitle}</h2><p>{copy.attribution}</p>
    <dl className={styles.sourceFacts}>
      <div><dt>Eurostat</dt><dd><a href={INTEREST.metadata}>gov_10a_main</a> · <a href={INTEREST.populationMetadata}>demo_gind</a></dd></div>
      <div><dt>{copy.period}</dt><dd>{snapshot.years[0]}–{snapshot.latestYear}</dd></div>
      <div><dt>{copy.updated} · gov_10a_main</dt><dd><time dateTime={snapshot.sources.amount.updated}>{date(snapshot.sources.amount.updated)}</time></dd></div>
      <div><dt>{copy.updated} · demo_gind</dt><dd><time dateTime={snapshot.sources.population.updated}>{date(snapshot.sources.population.updated)}</time></dd></div>
      <div><dt>{copy.accessed}</dt><dd><time dateTime={snapshot.fetchedAt}>{date(snapshot.fetchedAt)}</time></dd></div>
    </dl>
    <p>{copy.definition}</p><p>{copy.accounting} <a href={INTEREST.accounting}>ESA 2010 · 4.50</a></p><p>{copy.formula}</p><p>{copy.populationNote}</p><p>{copy.fx}</p><p>{copy.missing}</p><p>{copy.flags}</p>
    <details><summary>{copy.method} · Eurostat</summary><p>{copy.updateText}</p><ul className={styles.sourceLinks}>{Object.entries(snapshot.sources).map(([kind, source]) => <li key={kind}><a href={source.url}>{copy[kind]} · {source.dataset}</a> · {Object.entries(source.filters).map(([key, value]) => `${key}=${value}`).join(" · ")}</li>)}</ul></details>
    <Link className={styles.textLink} href={fiscalPath(methodology ? "/interest-cost" : "/methodology#interest-cost-methodology", lang)}>{methodology ? copy.comparisonLink : copy.method} →</Link>
  </section>;
}
