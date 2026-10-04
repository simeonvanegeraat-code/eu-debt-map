"use client";

import { useState } from "react";
import { trendSegments } from "@/lib/inflation/indicators";
import { formatMonth, formatRate, getInflationCopy, statusText } from "./copy";
import styles from "./inflation.module.css";

export default function InflationChart({ points, name, lang, statusLabels }) {
  const copy = getInflationCopy(lang);
  const [activeMonth, setActiveMonth] = useState(null);
  const foundIndex = points.findIndex(point => point.month === activeMonth);
  const activeIndex = foundIndex < 0 ? points.length - 1 : foundIndex;
  const activePoint = points[activeIndex];
  const lines = [{ key: "country", name, color: "#276ac4" }, { key: "area", name: copy.euroArea, color: "#b56729" }];
  const values = points.flatMap(point => [point.country, point.area]).filter(Number.isFinite);
  const low = Math.min(0, ...values), high = Math.max(1, ...values);
  const padding = Math.max((high - low) * .1, .3);
  const min = low - padding, max = high + padding;
  const y = value => 24 + (max - value) / (max - min) * 230;
  function renderChart(width, className) {
    const right = width - 20;
    const x = index => 64 + index / Math.max(points.length - 1, 1) * (right - 64);
    const tickCount = width < 500 ? 2 : 4;
    const ticks = [...new Set(Array.from({ length: tickCount + 1 }, (_, i) => Math.round((points.length - 1) * i / tickCount)))];
    function selectPoint(event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const chartX = (event.clientX - rect.left) / rect.width * width;
      const index = Math.max(0, Math.min(points.length - 1, Math.round((chartX - 64) / (right - 64) * (points.length - 1))));
      setActiveMonth(points[index].month);
    }
    return <svg className={className} viewBox={`0 0 ${width} 304`} role="img" onClick={selectPoint} aria-label={`${copy.annual}: ${name}, ${copy.euroArea}. ${formatMonth(points[0].month, lang)} – ${formatMonth(points.at(-1).month, lang)}`}>
        <title>{`${copy.history}: ${name} / ${copy.euroArea}`}</title>
        <desc>{`${copy.chartNote} ${copy.historyTable}`}</desc>
        {[0, 1, 2, 3, 4].map(i => {
          const value = min + (max - min) * i / 4;
          return <g key={i}><line x1="64" x2={right} y1={y(value)} y2={y(value)} stroke="#dfe5e8" /><text x="52" y={y(value) + 4} textAnchor="end">{formatRate(value, lang)}</text></g>;
        })}
        <line x1="64" x2={right} y1={y(0)} y2={y(0)} stroke="#8398a5" strokeDasharray="4 4" />
        {lines.map(line => <g key={line.key}>
          {trendSegments(points, line.key).map((segment, i) => <g key={i}>
            <polyline points={segment.map(p => `${x(p.index)},${y(p.value)}`).join(" ")} fill="none" stroke={line.color} strokeWidth={width < 500 ? 2 : 3} strokeLinejoin="round" strokeDasharray={line.key === "area" ? "7 4" : undefined} />
            {segment.map(p => <circle key={p.index} cx={x(p.index)} cy={y(p.value)} r={segment.length === 1 ? 3.5 : width < 500 ? 1 : 2.5} fill={line.color}>
              <title>{`${line.name}, ${formatMonth(points[p.index].month, lang)}: ${formatRate(p.value, lang)} ${statusText(points[p.index][`${line.key}Status`], lang, statusLabels)}`.trim()}</title>
            </circle>)}
          </g>)}
        </g>)}
        <line x1={x(activeIndex)} x2={x(activeIndex)} y1="24" y2="254" stroke="#52627a" strokeDasharray="3 4" />
        {lines.filter(line => Number.isFinite(activePoint[line.key])).map(line => <circle key={line.key} cx={x(activeIndex)} cy={y(activePoint[line.key])} r="4" fill={line.color} stroke="#fff" strokeWidth="2" />)}
        {ticks.map((index, i) => <text key={index} x={x(index)} y="287" textAnchor={i === 0 ? "start" : i === ticks.length - 1 ? "end" : "middle"}>{formatMonth(points[index].month, lang, true)}</text>)}
      </svg>;
  }
  return <>
    <figure className={styles.chart}>
      <figcaption className={styles.chartLegend}>{lines.map(line => <span key={line.key}><i style={{ background: line.color }} aria-hidden="true" />{line.name}</span>)}</figcaption>
      {renderChart(952, styles.desktopChart)}
      {renderChart(400, styles.mobileChart)}
      <div className={styles.chartSelection}>
        <div className={styles.chartReadout} aria-live="polite" aria-atomic="true"><strong>{formatMonth(activePoint.month, lang)}</strong><dl>{lines.map(line => <div key={line.key}><dt>{line.name}</dt><dd>{formatRate(activePoint[line.key], lang)}{activePoint[`${line.key}Status`] && <small>{statusText(activePoint[`${line.key}Status`], lang, statusLabels)}</small>}</dd></div>)}</dl></div>
        <label htmlFor="inflation-chart-month">{copy.chartSelect}</label><input id="inflation-chart-month" type="range" min="0" max={points.length - 1} value={activeIndex} aria-valuetext={formatMonth(activePoint.month, lang)} onChange={event => setActiveMonth(points[Number(event.target.value)].month)} />
        <p className={styles.note}>{copy.chartHint}</p>
      </div>
    </figure>
    <p className={styles.note}>{copy.chartNote}</p>
    <details className={styles.historyData}>
      <summary>{copy.historyTable}</summary>
      <div className={styles.tableScroll} tabIndex={0} role="region" aria-label={copy.historyTable}>
        <table className={styles.table}><caption>{copy.annual} · {name} / {copy.euroArea}</caption>
          <thead><tr><th scope="col">{copy.month}</th><th scope="col">{name}</th><th scope="col">{copy.euroArea}</th></tr></thead>
          <tbody>{[...points].reverse().map(point => <tr key={point.month}>
            <th scope="row">{formatMonth(point.month, lang)}</th>
            {lines.map(line => <td key={line.key}>{formatRate(point[line.key], lang)}{point[`${line.key}Status`] && <small>{statusText(point[`${line.key}Status`], lang, statusLabels)}</small>}</td>)}
          </tr>)}</tbody>
        </table>
      </div>
    </details>
  </>;
}
