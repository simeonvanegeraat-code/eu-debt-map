import Link from "next/link";
import snapshot from "@/lib/fiscal/balance.gen.json";
import { BALANCE } from "@/lib/fiscal/indicators";
import { balanceRows, balanceBand } from "@/lib/fiscal/balance-core";
import { countryName } from "@/lib/countries";
import { fiscalPath } from "@/lib/fiscal/paths";
import BalanceTrend from "./BalanceTrend";
import { getBalanceCopy, formatFiscal, balanceInsight } from "./balance-copy";
import styles from "./fiscal.module.css";

export default function CountryBalance({ code, lang = "en" }) {
  const copy = getBalanceCopy(lang);
  const row = balanceRows(snapshot).find((item) => item.code === code);
  if (!row) return null;
  const points = snapshot.years.map((year) => ({ year, value: snapshot.series[code][year].balance, status: snapshot.series[code][year].balanceStatus }));
  return <section className={styles.countryBalance} aria-labelledby="country-balance-title">
    <p className={styles.eyebrow}>{copy.official} · {row.year}</p><h2 id="country-balance-title">{copy.shortTitle}</h2><p>{copy.countryIntro}</p>
    <dl className={styles.countryMetrics}>
      <div><dt>{copy.balance} · {copy.gdp}</dt><dd>{formatFiscal(row.balance, lang)}<sup>{row.balanceStatus}</sup></dd><small>{copy.status[balanceBand(row.balance)]} · {row.year}</small></div>
      <div><dt>{copy.previous} · {Number(row.year) - 1}</dt><dd>{formatFiscal(row.previous, lang)}<sup>{row.previousStatus}</sup></dd><small>{copy.gdp}</small></div>
      <div><dt>{copy.change}</dt><dd>{formatFiscal(row.change, lang, { suffix: ` ${copy.pp}` })}<sup>{row.changeStatus}</sup></dd><small>{Number(row.year) - 1} → {row.year}</small></div>
      <div><dt>{copy.rank}</dt><dd>{row.rank ?? "—"} / 27</dd><small>{row.year}</small></div>
    </dl>
    <p className={styles.insight}>{balanceInsight(row.change, lang)}</p>
    <p>{copy.debt} · {copy.debtDate} {row.year}: <strong>{formatFiscal(row.debtRatio, lang, { signed: false })}<sup>{row.debtStatus}</sup></strong>. {copy.debtNote}</p>
    <BalanceTrend points={points} name={countryName(code, lang)} lang={lang} />
    <Link className={styles.textLink} href={fiscalPath("/deficit", lang)}>{copy.comparisonLink} →</Link>
    <p className={styles.note}>{copy.source}: <a href={BALANCE.datasetUrl}>Eurostat · {BALANCE.dataset}</a> · {copy.accessed}: <time dateTime={snapshot.fetchedAt}>{new Intl.DateTimeFormat(copy.locale, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(snapshot.fetchedAt))}</time>. <Link href={fiscalPath("/methodology#budget-balance-methodology", lang)}>{copy.methodology}</Link></p>
  </section>;
}
