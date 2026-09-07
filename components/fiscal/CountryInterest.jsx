import Link from "next/link";
import snapshot from "@/lib/fiscal/interest.gen.json";
import { interestRows, interestPoints } from "@/lib/fiscal/interest";
import { fiscalPath } from "@/lib/fiscal/paths";
import { countryName } from "@/lib/countries";
import { getInterestCopy, interestNumber } from "./interest-copy";
import InterestHistory from "./InterestHistory";
import styles from "./interest.module.css";
import fiscal from "./fiscal.module.css";

export default function CountryInterest({ code, lang = "en", showHistory = false }) {
  const row = interestRows(snapshot).find(item => item.code === code);
  if (!row) return null;
  const copy = getInterestCopy(lang), name = countryName(code, lang);
  return <section className={styles.country} aria-labelledby="country-interest-title"><p className={fiscal.eyebrow}>{copy.official}</p><h2 id="country-interest-title">{copy.countryTitle}</h2>
    <p className={styles.period}>{copy.year}: {snapshot.latestYear} · {copy.rank} ({copy.ratio}): {row.rank} / 27</p>
    <dl className={styles.metrics}>{[["amount", "compact"], ["ratio", "percent"], ["perCapita", "eur"], ["revenueShare", "percent"]].map(([key, type]) => <div key={key}><dt>{copy[key]}</dt><dd>{interestNumber(row[key], lang, type)}<sup>{row[`${key}Status`]}</sup></dd></div>)}</dl>
    {row.annualChange.change !== null && row.ratioChange.change !== null && <p className={fiscal.insight}>{copy.insight(name, interestNumber(row.annualChange.change, lang, "compact", true), interestNumber(row.ratioChange.change, lang, "pp", true), row.annualChange.startYear, snapshot.latestYear)}</p>}
    <p className={fiscal.note}>{copy.countryPeriod}</p>
    {showHistory ? <><InterestHistory points={interestPoints(snapshot, code)} name={name} lang={lang} /><p className={fiscal.note}>{copy.missing}</p></> : <details className={styles.values}><summary>{copy.countryDetails}</summary><InterestHistory points={interestPoints(snapshot, code)} name={name} lang={lang} /><p className={fiscal.note}>{copy.missing}</p></details>}
    <p className={fiscal.note}>{copy.flags}</p><Link href={fiscalPath("/interest-cost", lang)}>{copy.comparisonLink} →</Link>
    <p className={fiscal.note}>Eurostat · gov_10a_main / demo_gind · {copy.accessed}: {new Intl.DateTimeFormat(copy.locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(snapshot.fetchedAt))}. <Link href={fiscalPath("/methodology#interest-cost-methodology", lang)}>{copy.method}</Link></p>
  </section>;
}
