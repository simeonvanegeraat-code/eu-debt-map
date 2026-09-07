import Link from "next/link";
import snapshot from "@/lib/fiscal/growth.gen.json";
import { GROWTH } from "@/lib/fiscal/growth";
import { fiscalPath } from "@/lib/fiscal/paths";
import { getGrowthCopy, growthQuarter } from "./growth-copy";
import styles from "./fiscal.module.css";

export default function GrowthSource({ lang = "en", methodology = false }) {
  const copy = getGrowthCopy(lang);
  const date = value => new Intl.DateTimeFormat(copy.locale,{dateStyle:"long",timeZone:"UTC"}).format(new Date(value));
  return <section className={styles.source} id="debt-growth-methodology" aria-labelledby="growth-source-title"><p className={styles.eyebrow}>{copy.official}</p><h2 id="growth-source-title">{methodology ? `${copy.shortTitle} · ${copy.method}` : copy.sourceTitle}</h2><p>{copy.attribution}</p>
    <dl className={styles.sourceFacts}><div><dt>Eurostat</dt><dd><a href={GROWTH.metadata}>gov_10q_ggdebt</a></dd></div><div><dt>{copy.horizon}</dt><dd>{growthQuarter(snapshot.periods[0],lang)} → {growthQuarter(snapshot.latestQuarter,lang)}</dd></div><div><dt>{copy.updated}</dt><dd><time dateTime={snapshot.sources.debt.updated}>{date(snapshot.sources.debt.updated)}</time></dd></div><div><dt>{copy.accessed}</dt><dd><time dateTime={snapshot.fetchedAt}>{date(snapshot.fetchedAt)}</time></dd></div></dl>
    <p>{copy.definition}</p><p>{copy.formula}</p><p>{copy.fx}</p><p>{copy.missing}</p><p>{copy.flags}</p>
    <details><summary>{copy.method} · Eurostat</summary><p>{copy.updateText}</p><ul className={styles.sourceLinks}>{Object.entries(snapshot.sources).map(([kind,source])=><li key={kind}><a href={source.url}>{copy.api} · {source.filters.unit}</a> · {Object.entries(source.filters).map(([key,value])=>`${key}=${value}`).join(" · ")}</li>)}</ul></details><Link className={styles.textLink} href={fiscalPath(methodology ? "/debt-growth" : "/methodology#debt-growth-methodology",lang)}>{methodology ? copy.comparisonLink : copy.method} →</Link>
  </section>;
}
