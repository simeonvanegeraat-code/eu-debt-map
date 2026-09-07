import Link from "next/link";
import snapshot from "@/lib/fiscal/per-capita.gen.json";
import { perCapitaRows } from "@/lib/fiscal/per-capita";
import { fiscalPath } from "@/lib/fiscal/paths";
import { getPerCapitaCopy, capitaNumber, capitaDate } from "./per-capita-copy";
import styles from "./per-capita.module.css";

export default function CountryPerCapita({ code, lang = "en" }) {
  const copy = getPerCapitaCopy(lang);
  const row = perCapitaRows(snapshot).find((item) => item.code === code);
  if (!row) return null;
  return <section className={styles.country} aria-labelledby="country-per-capita-title">
    <div><p className={styles.eyebrow}>{copy.calculated}</p><h2 id="country-per-capita-title">{copy.shortTitle}</h2><p className={styles.value}>{capitaNumber(row.displayValue,lang)}<sup>{row.status}</sup></p><p>{copy.rank}: {row.rank} / 27</p></div>
    <div><p>{copy.debtDate}: <strong>{capitaDate(snapshot.debtDate,lang)}</strong><br />{copy.populationDate} {snapshot.populationYear}: <strong>{capitaNumber(row.population,lang,"number")}<sup>{row.populationStatus}</sup></strong></p>
      <p>{copy.countryNote}</p><p>{copy.warning}</p><Link href={fiscalPath("/debt-per-capita",lang)}>{copy.comparisonLink} →</Link>
      <p className={styles.note}>Eurostat · gov_10dd_edpt1 + demo_gind · {copy.accessed}: {capitaDate(snapshot.fetchedAt,lang)}. <Link href={fiscalPath("/methodology#debt-per-capita-methodology",lang)}>{copy.method}</Link></p>
      {row.populationStatus && <p className={styles.note}>{copy.flags}</p>}
    </div>
  </section>;
}
