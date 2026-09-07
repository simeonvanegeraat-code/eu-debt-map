import Link from "next/link";
import snapshot from "@/lib/fiscal/per-capita.gen.json";
import { PER_CAPITA } from "@/lib/fiscal/per-capita";
import { fiscalPath } from "@/lib/fiscal/paths";
import { getPerCapitaCopy, capitaDate } from "./per-capita-copy";
import styles from "./fiscal.module.css";

export default function PerCapitaSource({ lang = "en", methodology = false }) {
  const copy = getPerCapitaCopy(lang);
  return <section className={styles.source} id="debt-per-capita-methodology" aria-labelledby="per-capita-source-title">
    <p className={styles.eyebrow}>{copy.calculated}</p><h2 id="per-capita-source-title">{methodology ? `${copy.shortTitle} · ${copy.method}` : copy.sourceTitle}</h2><p>{copy.attribution}</p>
    <dl className={styles.sourceFacts}><div><dt>{copy.debtDate}</dt><dd>{capitaDate(snapshot.debtDate,lang)}</dd></div><div><dt>{copy.populationDate} {snapshot.populationYear}</dt><dd>{capitaDate(snapshot.populationDate,lang)}</dd></div>
      <div><dt>{copy.debtSource} · {copy.updated}</dt><dd><a href={PER_CAPITA.debtMetadata}>gov_10dd_edpt1</a> · {capitaDate(snapshot.sources.debt.updated,lang)}</dd></div><div><dt>{copy.populationSource} · {copy.updated}</dt><dd><a href={PER_CAPITA.populationMetadata}>demo_gind</a> · {capitaDate(snapshot.sources.population.updated,lang)}</dd></div><div><dt>{copy.accessed}</dt><dd><time dateTime={snapshot.fetchedAt}>{capitaDate(snapshot.fetchedAt,lang)}</time></dd></div></dl>
    <h3>{copy.calculation}</h3><p>{copy.formula}</p><p>{copy.datesText}</p><p>{copy.euNote}</p><p>{copy.flags}</p>
    <details><summary>{copy.method} · Eurostat</summary><p>{copy.populationChoice}</p><p>{copy.updateText}</p>
      <ul className={styles.sourceLinks}>{Object.entries(snapshot.sources).map(([kind,source]) => <li key={kind}><a href={source.url}>{copy.api}: {source.dataset}</a> · {Object.entries(source.filters).map(([key,value])=>`${key}=${value}`).join(" · ")}</li>)}</ul>
    </details>
    <Link className={styles.textLink} href={fiscalPath(methodology ? "/debt-per-capita" : "/methodology#debt-per-capita-methodology",lang)}>{methodology ? copy.comparisonLink : copy.method} →</Link>
  </section>;
}
