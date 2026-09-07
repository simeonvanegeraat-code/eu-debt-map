import Link from "next/link";
import snapshot from "@/lib/fiscal/accounts.gen.json";
import edp from "@/lib/fiscal/balance.gen.json";
import { accountPoints, accountChange, edpComparison } from "@/lib/fiscal/accounts";
import { countryName } from "@/lib/countries";
import { fiscalPath } from "@/lib/fiscal/paths";
import { getAccountsCopy, accountNumber, accountDate } from "./accounts-copy";
import AccountsHistory from "./AccountsHistory";
import AccountSourceDifference from "./AccountSourceDifference";
import styles from "./accounts.module.css";
import chart from "./interest.module.css";
import fiscal from "./fiscal.module.css";

export default function CountryAccounts({ code, lang = "en" }) {
  if (!snapshot.countries[code]) return null;
  const copy = getAccountsCopy(lang), points = accountPoints(snapshot, code), row = points.at(-1), eu = accountPoints(snapshot, "EU27_2020").at(-1), name = countryName(code, lang);
  const exp = accountChange(points, snapshot.latestYear, "expenditureRatio"), rev = accountChange(points, snapshot.latestYear, "revenueRatio");
  return <section className={chart.country} aria-labelledby="country-accounts-title"><p className={fiscal.eyebrow}>{copy.official}</p><h2 id="country-accounts-title">{copy.countryTitle}</h2><p className={chart.period}>{copy.year}: {snapshot.latestYear} · gov_10a_main</p>
    <dl className={styles.metrics}>{["expenditure", "revenue", "balance"].map(key => <div key={key}><dt>{copy[`${key}Ratio`]}</dt><dd>{accountNumber(row[`${key}Ratio`], lang, "percent")}<sup>{row[`${key}RatioStatus`]}</sup><small>{accountNumber(row[key], lang, "compact")}<sup>{row[`${key}Status`]}</sup></small></dd><small>{copy.eu}: {accountNumber(eu[`${key}Ratio`], lang, "percent")}<sup>{eu[`${key}RatioStatus`]}</sup></small></div>)}</dl>
    <p className={fiscal.note}>{copy.identity}</p><AccountSourceDifference comparison={edpComparison(snapshot, edp, code)} lang={lang} />
    {exp.change !== null && rev.change !== null && <p className={fiscal.insight}>{copy.insight(name, accountNumber(exp.change, lang, "pp", true), accountNumber(rev.change, lang, "pp", true), exp.startYear, snapshot.latestYear)}</p>}
    <p className={fiscal.note}>{copy.annualContext}</p><details className={chart.values}><summary>{copy.countryDetails}</summary><AccountsHistory points={points} name={name} lang={lang} /><p className={fiscal.note}>{copy.flags}</p></details>
    <Link href={fiscalPath("/government-spending", lang)}>{copy.comparisonLink} →</Link><p className={fiscal.note}>Eurostat · gov_10a_main · {copy.accessed}: {accountDate(snapshot.fetchedAt, lang)}. <Link href={fiscalPath("/methodology#government-accounts-methodology", lang)}>{copy.method}</Link></p>
  </section>;
}
