import { trendSegments } from "@/lib/fiscal/growth";
import styles from "./interest.module.css";

// A compact chart over already transformed fiscal points; it never fills data gaps.
export default function FiscalTrendChart({ points, metric, title, note, formatAxis, formatValue }) {
  if (!points.length) return null;
  const segments = trendSegments(points, metric);
  const values = segments.flat().map(point => point.value);
  const lowest = values.length ? Math.min(...values) : 0;
  const highest = values.length ? Math.max(...values) : 1;
  const padding = Math.max((highest - lowest) * .18, highest * .02, .1);
  const min = Math.max(0, lowest - padding), max = highest + padding;
  const x = index => 104 + index / Math.max(points.length - 1, 1) * 408;
  const y = value => 20 + (max - value) / (max - min) * 166;
  return <figure className={styles.chart}><figcaption>{title}</figcaption>
    <svg viewBox="0 0 540 224" role="img" aria-label={`${title}, ${points[0].year}–${points.at(-1).year}. ${note}`}>
      {[min, (min + max) / 2, max].map(value => <g key={value}>
        <line x1="104" x2="512" y1={y(value)} y2={y(value)} stroke="#d8e0eb" />
        <text x="94" y={y(value) + 4} textAnchor="end">{formatAxis(value)}</text>
      </g>)}
      {segments.map((segment, i) => <g key={i}>
        <polyline data-trend-segment={metric} points={segment.map(point => `${x(point.index)},${y(point.value)}`).join(" ")} fill="none" stroke="#276ac4" strokeWidth="3" strokeLinejoin="round" />
        {segment.map(point => <circle key={point.index} cx={x(point.index)} cy={y(point.value)} r={segment.length === 1 ? 3 : 2} fill="#133965"><title>{`${points[point.index].year}: ${formatValue(point.value)} ${points[point.index][`${metric}Status`] || ""}`.trim()}</title></circle>)}
      </g>)}
      <text x="104" y="216">{points[0].year}</text><text x="512" y="216" textAnchor="end">{points.at(-1).year}</text>
    </svg>
  </figure>;
}
