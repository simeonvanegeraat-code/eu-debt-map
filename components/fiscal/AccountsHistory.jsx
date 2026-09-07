import { getAccountsCopy, accountNumber } from "./accounts-copy";
import FiscalComparisonChart from "./FiscalComparisonChart";
import chart from "./interest.module.css";
import fiscal from "./fiscal.module.css";
import styles from "./accounts.module.css";

export default function AccountsHistory({ points, name, lang = "en" }) {
  const copy = getAccountsCopy(lang), format = n => accountNumber(n, lang, "percent");
  const fields = ["expenditure", "expenditureRatio", "revenue", "revenueRatio", "balance", "balanceRatio"];
  return <>
    <div className={chart.charts}>
      <FiscalComparisonChart points={points} series={[{ metric: "expenditureRatio", label: copy.expenditure, color: "#1f66c1" }, { metric: "revenueRatio", label: copy.revenue, color: "#956d31", dashed: true }]} title={`${copy.pairedTitle} · ${name}`} note={copy.historyNote} format={format} />
      <FiscalComparisonChart points={points} series={[{ metric: "balanceRatio", label: copy.balance, color: "#1f66c1" }]} title={`${copy.balanceTitle} · ${name}`} note={copy.historyNote} format={format} showZero />
    </div><p className={fiscal.note}>{copy.historyNote}</p>
    <details className={chart.values}><summary>{copy.history}</summary><p className={fiscal.note}>{copy.scrollHint}</p><div className={fiscal.tableScroll} tabIndex={0} role="region" aria-label={`${copy.history}: ${name}`}>
      <table className={styles.annualTable}><caption>{name} · {points[0]?.year}–{points.at(-1)?.year} · gov_10a_main</caption><thead><tr><th scope="col">{copy.year}</th>{fields.map(key => <th key={key} scope="col">{copy[key]} ({key.endsWith("Ratio") ? "%" : "€"})</th>)}</tr></thead><tbody>{points.map(point => <tr key={point.year}><th scope="row">{point.year}</th>{fields.map(key => <td key={key}>{accountNumber(point[key], lang, key.endsWith("Ratio") ? "percent" : "eur")}<sup>{point[`${key}Status`]}</sup></td>)}</tr>)}</tbody></table>
    </div></details>
  </>;
}
