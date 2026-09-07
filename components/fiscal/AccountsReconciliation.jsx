import Link from "next/link";
import snapshot from "@/lib/fiscal/accounts.gen.json";
import edp from "@/lib/fiscal/balance.gen.json";
import { edpComparison } from "@/lib/fiscal/accounts";
import { countryName } from "@/lib/countries";
import { fiscalPath } from "@/lib/fiscal/paths";
import { getAccountsCopy, accountNumber, accountDate } from "./accounts-copy";
import styles from "./accounts.module.css";
import fiscal from "./fiscal.module.css";

export default function AccountsReconciliation({ lang = "en" }) {
  const copy = getAccountsCopy(lang);
  const differences = Object.keys(snapshot.countries).flatMap(code => snapshot.years.map(year => ({ code, ...edpComparison(snapshot, edp, code, year) }))).filter(r => Number.isFinite(r.difference) && r.difference !== 0);
  const table = (rows, caption) => <div className={fiscal.tableScroll} role="region" tabIndex={0} aria-label={caption}><table><caption>{caption}</caption><thead><tr><th scope="col">{copy.country}</th><th scope="col">{copy.year}</th><th scope="col">gov_10a_main (%)</th><th scope="col">gov_10dd_edpt1 (%)</th><th scope="col">Δ (pp)</th></tr></thead><tbody>{rows.map(row => <tr key={`${row.code}-${row.year}`}><th scope="row"><Link href={fiscalPath(`/country/${row.code.toLowerCase()}`, lang)}>{countryName(row.code, lang)}</Link></th><td>{row.year}</td><td>{accountNumber(row.accounts, lang, "percent", true)}<sup>{row.accountsStatus}</sup></td><td>{accountNumber(row.edp, lang, "percent", true)}<sup>{row.edpStatus}</sup></td><td>{accountNumber(row.difference, lang, "pp", true)}<sup>{row.differenceStatus}</sup></td></tr>)}</tbody></table>{!rows.length && <p>{copy.same}</p>}</div>;
  return <section className={styles.comparison} id="accounts-source-comparison" aria-labelledby="accounts-revision-title"><h3 id="accounts-revision-title">{copy.revisionTitle}</h3><p>{copy.revisionText}</p><dl className={fiscal.sourceFacts}>
    <div><dt>{copy.accountsVersion} · {copy.updated}</dt><dd>{accountDate(snapshot.sources.balance.updated, lang)}</dd></div><div><dt>{copy.edpVersion} · {copy.updated}</dt><dd>{accountDate(edp.sourceUpdated, lang)}</dd></div>
    <div><dt>{copy.accountsVersion} · {copy.accessed}</dt><dd>{accountDate(snapshot.fetchedAt, lang)}</dd></div><div><dt>{copy.edpVersion} · {copy.accessed}</dt><dd>{accountDate(edp.fetchedAt, lang)}</dd></div>
  </dl>{table(differences.filter(row => row.year === snapshot.latestYear), `${copy.revisionCurrent} · ${snapshot.latestYear}`)}<details><summary>{copy.revisionHistory}</summary>{table(differences, `${snapshot.years[0]}–${snapshot.latestYear}`)}</details><Link href={fiscalPath("/deficit", lang)}>{copy.deficitLink} →</Link></section>;
}
