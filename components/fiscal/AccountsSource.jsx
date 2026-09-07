import Link from "next/link";
import snapshot from "@/lib/fiscal/accounts.gen.json";
import { ACCOUNTS } from "@/lib/fiscal/accounts";
import { fiscalPath } from "@/lib/fiscal/paths";
import { getAccountsCopy, accountDate } from "./accounts-copy";
import AccountsReconciliation from "./AccountsReconciliation";
import styles from "./fiscal.module.css";

export default function AccountsSource({ lang = "en", methodology = false }) {
  const copy = getAccountsCopy(lang);
  return <section className={styles.source} id="government-accounts-methodology" aria-labelledby="accounts-source-title"><p className={styles.eyebrow}>{copy.official}</p><h2 id="accounts-source-title">{methodology ? `${copy.shortTitle} · ${copy.method}` : copy.sourceTitle}</h2><p>{copy.attribution}</p>
    <dl className={styles.sourceFacts}><div><dt>Eurostat</dt><dd><a href={ACCOUNTS.metadata}>gov_10a_main</a></dd></div><div><dt>{copy.period}</dt><dd>{snapshot.years[0]}–{snapshot.latestYear}</dd></div><div><dt>{copy.updated}</dt><dd><time dateTime={snapshot.sources.expenditure.updated}>{accountDate(snapshot.sources.expenditure.updated, lang)}</time></dd></div><div><dt>{copy.accessed}</dt><dd><time dateTime={snapshot.fetchedAt}>{accountDate(snapshot.fetchedAt, lang)}</time></dd></div></dl>
    <p>{copy.definition}</p><p>{copy.identity}</p><p>{copy.formula}</p><p>{copy.euNote}</p><p>{copy.fx}</p><p>{copy.missing}</p><p>{copy.flags}</p>
    <details><summary>{copy.method} · Eurostat</summary><p>{copy.validation}</p><p>{copy.updateText}</p><ul className={styles.sourceLinks}>{Object.entries(snapshot.sources).map(([key, source]) => <li key={key}><a href={source.url}>{copy[key]} · {source.dataset}</a> · {Object.entries(source.filters).map(([k, v]) => `${k}=${v}`).join(" · ")} · geo=EU27 + EU27_2020</li>)}</ul></details>
    <AccountsReconciliation lang={lang} /><Link className={styles.textLink} href={fiscalPath(methodology ? "/government-spending" : "/methodology#government-accounts-methodology", lang)}>{methodology ? copy.comparisonLink : copy.method} →</Link>
  </section>;
}
