import { balanceBand } from "@/lib/fiscal/balance-core";
import { MAP_BALANCE_COLORS } from "@/lib/map-colors";
import { getBalanceCopy, formatFiscal } from "./balance-copy";
import styles from "./fiscal.module.css";

export const BALANCE_COLORS = MAP_BALANCE_COLORS;

export default function BalanceTrend({ points, lang = "en", name }) {
  const copy = getBalanceCopy(lang);
  const values = points.map((point) => point.value).filter(Number.isFinite);
  const min = Math.min(-4, ...values) - 1;
  const max = Math.max(1, ...values) + 1;
  const y = (value) => 16 + (max - value) / (max - min) * 126;
  const step = 480 / Math.max(1, points.length);
  return (
    <figure className={styles.trend}>
      <figcaption>{copy.trendTitle} · {name}</figcaption>
      <svg viewBox="0 0 540 180" role="img" aria-label={`${copy.trendTitle}: ${name}. ${copy.trendHint}`}>
        <line x1="38" x2="530" y1={y(0)} y2={y(0)} stroke="#8296ad" />
        <line x1="38" x2="530" y1={y(-3)} y2={y(-3)} stroke="#914149" strokeDasharray="4 4" />
        <text x="0" y={y(0) + 4}>0%</text><text x="0" y={y(-3) + 4}>−3%</text>
        {points.map((point, i) => {
          const x = 45 + i * step;
          const valid = Number.isFinite(point.value);
          return <g key={point.year}>
            {valid && <rect x={x} y={Math.min(y(0), y(point.value))} width={step * 0.62}
              height={Math.max(1, Math.abs(y(point.value) - y(0)))} fill={BALANCE_COLORS[balanceBand(point.value)]}>
              <title>{`${point.year}: ${formatFiscal(point.value, lang)} ${point.status || ""}`}</title>
            </rect>}
            {!valid && <text x={x + step * 0.31} y={y(0) - 5} textAnchor="middle">—</text>}
            {(i === 0 || i === points.length - 1 || i % 2 === 0) && <text x={x + step * 0.31} y="170" textAnchor="middle">{point.year}</text>}
          </g>;
        })}
      </svg>
      <p className={styles.note}>{copy.trendHint}</p>
      <details className={styles.historyValues}>
        <summary>{copy.trendTable}</summary>
        <div className={styles.tableScroll}>
          <table><caption>{name} · {copy.dataValues} · {copy.gdp}</caption>
            <thead><tr><th scope="col">{copy.year}</th><th scope="col">{copy.balance}</th></tr></thead>
            <tbody>{points.map((point) => <tr key={point.year}><th scope="row">{point.year}</th><td>{formatFiscal(point.value, lang)} <sup>{point.status}</sup></td></tr>)}</tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
