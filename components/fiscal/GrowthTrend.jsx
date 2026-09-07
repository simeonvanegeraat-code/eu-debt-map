import { trendSegments } from "@/lib/fiscal/growth";
import { getGrowthCopy, growthNumber, growthQuarter } from "./growth-copy";
import styles from "./growth.module.css";
import fiscal from "./fiscal.module.css";

export default function GrowthTrend({ points, name, lang = "en", readable = false }) {
  const copy = getGrowthCopy(lang);
  return <div>
    <div className={styles.charts}>{["debt", "ratio"].map(metric => {
      const segments = trendSegments(points, metric);
      const values = segments.flat().map(p => p.value);
      const lowest = values.length ? Math.min(...values) : 0;
      const highest = values.length ? Math.max(...values) : 1;
      const pad = Math.max((highest - lowest) * .16, highest * .01, metric === "ratio" ? 1 : 1e6);
      const min = Math.max(0, lowest - pad), max = highest + pad;
      const left = readable ? 152 : 86;
      const x = i => left + i / Math.max(points.length - 1, 1) * (508 - left);
      const y = v => 20 + (max - v) / (max - min) * 164;
      const label = metric === "debt" ? copy.chartDebt : copy.chartRatio;
      const format = v => growthNumber(v,lang,metric === "debt" ? "compact" : "percent");
      return <figure key={metric}><figcaption>{label} · {name}</figcaption>
        <svg className={readable ? styles.readableChart : undefined} viewBox="0 0 540 222" role="img" aria-label={`${label}: ${name}, ${growthQuarter(points[0].quarter,lang)} – ${growthQuarter(points.at(-1).quarter,lang)}. ${copy.chartNote}`}>
          {[min,(min+max)/2,max].map(v => <g key={v}><line x1={left} x2="508" y1={y(v)} y2={y(v)} stroke="#d8e0eb" /><text x={left-8} y={y(v)+4} textAnchor="end">{format(v)}</text></g>)}
          {segments.map((segment,i) => <g key={i}><polyline data-trend-segment={metric} points={segment.map(p=>`${x(p.index)},${y(p.value)}`).join(" ")} fill="none" stroke={metric === "debt" ? "#276ac4" : "#133965"} strokeWidth="3" strokeLinejoin="round" />{segment.map(p=><circle key={p.index} cx={x(p.index)} cy={y(p.value)} r={segment.length === 1 ? 3 : 2} fill="#133965"><title>{`${growthQuarter(points[p.index].quarter,lang)}: ${growthNumber(p.value,lang,metric === "debt" ? "eur" : "percent")} ${points[p.index][`${metric}Status`] || ""}`.trim()}</title></circle>)}</g>)}
          <text x={left} y="214">{growthQuarter(points[0].quarter,lang)}</text><text x="508" y="214" textAnchor="end">{growthQuarter(points.at(-1).quarter,lang)}</text>
        </svg></figure>;
    })}</div><p className={fiscal.note}>{copy.chartNote}</p>
    <details className={styles.values}><summary>{copy.history}</summary><div className={fiscal.tableScroll} tabIndex={0} role="region" aria-label={`${copy.history}: ${name}`}>
      <table><caption>{name} · Eurostat · gov_10q_ggdebt</caption><thead><tr><th scope="col">{copy.quarter}</th><th scope="col">{copy.debt} (€)</th><th scope="col">{copy.ratio} (%)</th></tr></thead><tbody>{points.map(point=><tr key={point.quarter}><th scope="row">{growthQuarter(point.quarter,lang)}</th><td>{growthNumber(point.debt,lang)}<sup>{point.debtStatus}</sup></td><td>{growthNumber(point.ratio,lang,"percent")}<sup>{point.ratioStatus}</sup></td></tr>)}</tbody></table>
    </div></details>
  </div>;
}
