import { trendSegments } from "@/lib/fiscal/growth";
import chart from "./interest.module.css";
import styles from "./accounts.module.css";

// All series share one labelled scale; use separate charts for different units.
export default function FiscalComparisonChart({ points, series, title, note, format, showZero = false }) {
  if (!points.length) return null;
  const lines = series.map(line => ({ ...line, segments: trendSegments(points, line.metric) }));
  const values = lines.flatMap(line => line.segments.flatMap(segment => segment.map(p => p.value)));
  const low = Math.min(...values, ...(showZero ? [0] : values.length ? [] : [0]));
  const high = Math.max(...values, ...(showZero ? [0] : values.length ? [] : [1]));
  const pad = Math.max((high - low) * .15, .2), min = low - pad, max = high + pad;
  const x = index => 104 + index / Math.max(points.length - 1, 1) * 408;
  const y = value => 20 + (max - value) / (max - min) * 166;
  return <figure className={chart.chart}><figcaption>{title}</figcaption>
    {series.length > 1 && <ul className={styles.legend}>{series.map(line => <li key={line.metric}><i style={{ borderColor: line.color, borderTopStyle: line.dashed ? "dashed" : "solid" }} aria-hidden="true" />{line.label}</li>)}</ul>}
    <svg viewBox="0 0 540 224" role="img" aria-label={`${title}, ${points[0].year}–${points.at(-1).year}. ${note}`}>
      {[min, (min + max) / 2, max].map(value => <g key={value}><line x1="104" x2="512" y1={y(value)} y2={y(value)} stroke="#d8e0eb" /><text x="94" y={y(value) + 4} textAnchor="end">{format(value)}</text></g>)}
      {showZero && <line data-zero-line="true" x1="104" x2="512" y1={y(0)} y2={y(0)} stroke="#52627a" strokeDasharray="3 4" />}
      {lines.map(line => <g key={line.metric}>{line.segments.map((segment, i) => <g key={i}>
        <polyline data-trend-segment={line.metric} points={segment.map(p => `${x(p.index)},${y(p.value)}`).join(" ")} fill="none" stroke={line.color} strokeWidth="3" strokeDasharray={line.dashed ? "7 5" : undefined} />
        {segment.map(p => <circle key={p.index} cx={x(p.index)} cy={y(p.value)} r={2.5} fill={line.color}><title>{`${line.label} · ${points[p.index].year}: ${format(p.value)} ${points[p.index][`${line.metric}Status`] || ""}`.trim()}</title></circle>)}
      </g>)}</g>)}
      <text x="104" y="216">{points[0].year}</text><text x="512" y="216" textAnchor="end">{points.at(-1).year}</text>
    </svg>
  </figure>;
}
