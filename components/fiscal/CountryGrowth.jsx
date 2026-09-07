import Link from "next/link";
import snapshot from "@/lib/fiscal/growth.gen.json";
import { GROWTH, countryGrowthPoints, growthRows } from "@/lib/fiscal/growth";
import { fiscalPath } from "@/lib/fiscal/paths";
import { countryName } from "@/lib/countries";
import { getGrowthCopy, growthNumber, growthQuarter, growthInsight } from "./growth-copy";
import GrowthTrend from "./GrowthTrend";
import styles from "./growth.module.css";
import fiscal from "./fiscal.module.css";
export default function CountryGrowth({ code, lang = "en", showHistory = false }) {
  if (!snapshot.countries[code]) return null;
  const copy = getGrowthCopy(lang), name = countryName(code,lang);
  const rows = GROWTH.horizons.map(years=>({years,...growthRows(snapshot,years).find(row=>row.code===code)}));
  const insight = growthInsight(rows[1],name,lang);
  return <section className={styles.country} aria-labelledby="country-growth-title"><p className={fiscal.eyebrow}>{copy.official}</p><h2 id="country-growth-title">{copy.countryTitle}</h2>
    <div className={`${styles.values} ${fiscal.tableScroll}`} tabIndex={0} role="region" aria-labelledby="country-growth-title"><table><caption>{copy.end}: {growthQuarter(snapshot.latestQuarter,lang)}</caption><thead><tr><th scope="col">{copy.horizon}</th><th scope="col">{copy.start}</th><th scope="col">{copy.amount}</th><th scope="col">{copy.percent}</th><th scope="col">{copy.pp}</th></tr></thead><tbody>{rows.map(row=><tr key={row.years}><th scope="row">{row.years===1 ? copy.oneYear : `${row.years} ${copy.years}`}</th><td>{growthQuarter(row.debt.start,lang)}</td><td>{growthNumber(row.debt.change,lang,"compact",true)}<sup>{row.debt.status}</sup></td><td>{growthNumber(row.debt.percent,lang,"percent",true)}<sup>{row.debt.status}</sup></td><td>{growthNumber(row.ratio.change,lang,"pp",true)}<sup>{row.ratio.status}</sup></td></tr>)}</tbody></table></div>
    {insight && <p className={fiscal.insight}>{insight}</p>}{rows[1].divergence && <p className={fiscal.insight}>{copy.divergence}</p>}
    {showHistory ? <GrowthTrend readable points={countryGrowthPoints(snapshot,code)} name={name} lang={lang} /> : <details className={styles.values}><summary>{copy.countryDetails}</summary><GrowthTrend points={countryGrowthPoints(snapshot,code)} name={name} lang={lang} /></details>}
    <p className={fiscal.note}>{copy.missing}</p><p className={fiscal.note}>{copy.flags}</p><Link href={fiscalPath("/debt-growth",lang)}>{copy.comparisonLink} →</Link><p className={fiscal.note}>Eurostat · gov_10q_ggdebt · {copy.accessed}: {new Intl.DateTimeFormat(copy.locale,{dateStyle:"long",timeZone:"UTC"}).format(new Date(snapshot.fetchedAt))}. <Link href={fiscalPath("/methodology#debt-growth-methodology",lang)}>{copy.method}</Link></p>
  </section>;
}
