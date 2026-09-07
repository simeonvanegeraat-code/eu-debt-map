import { getInterestCopy, interestNumber } from "./interest-copy";
import FiscalTrendChart from "./FiscalTrendChart";
import styles from "./interest.module.css";
import fiscal from "./fiscal.module.css";

export default function InterestHistory({ points, name, lang = "en" }) {
  const copy = getInterestCopy(lang);
  const fields = [["amount", "eur"], ["ratio", "percent"], ["perCapita", "eur"], ["revenueShare", "percent"]];
  return <div><div className={styles.charts}>{["amount", "ratio"].map(metric => <FiscalTrendChart key={metric} points={points} metric={metric} title={`${copy[metric]} · ${name}`} note={copy.historyNote}
    formatAxis={value => interestNumber(value, lang, metric === "amount" ? "compact" : "percent")}
    formatValue={value => interestNumber(value, lang, metric === "amount" ? "eur" : "percent")} />)}</div>
    <p className={fiscal.note}>{copy.historyNote}</p>
    <details className={styles.values}><summary>{copy.history}</summary><p className={fiscal.note}>{copy.scrollHint}</p><div className={fiscal.tableScroll} role="region" tabIndex={0} aria-label={`${copy.history}: ${name}`}>
      <table><caption>{name} · {points[0].year}–{points.at(-1).year} · Eurostat</caption><thead><tr><th scope="col">{copy.year}</th>{fields.map(([key]) => <th scope="col" key={key}>{copy[key]}</th>)}</tr></thead>
        <tbody>{points.map(point => <tr key={point.year}><th scope="row">{point.year}</th>{fields.map(([key, type]) => <td key={key}>{interestNumber(point[key], lang, type)}<sup>{point[`${key}Status`]}</sup></td>)}</tr>)}</tbody>
      </table></div></details>
  </div>;
}
