"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { endpointChange, shiftQuarter, trendSegments } from "@/lib/fiscal/growth";
import styles from "./country-preview.module.css";

const HORIZONS = [1, 5, 10];

function formatQuarter(value) {
  const match = /^(\d{4})-Q([1-4])$/.exec(value || "");
  return match ? `${match[1]} Q${match[2]}` : value || "—";
}

function formatDebt(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function signed(value, suffix = "") {
  if (!Number.isFinite(value)) return "—";
  return `${value > 0 ? "+" : ""}${new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 }).format(value)}${suffix}`;
}

export default function CountryDebtTrend({ points, name, latestQuarter }) {
  const [years, setYears] = useState(5);
  const start = shiftQuarter(latestQuarter, -4 * years);
  const visible = useMemo(() => points.filter((point) => point.quarter >= start), [points, start]);
  const debtChange = endpointChange(points, latestQuarter, years, "debt");
  const ratioChange = endpointChange(points, latestQuarter, years, "ratio");
  const segments = trendSegments(visible, "debt");
  const values = segments.flat().map((point) => point.value);
  const lowest = Math.min(...values);
  const highest = Math.max(...values);
  const padding = Math.max((highest - lowest) * 0.14, highest * 0.01, 1e6);
  const min = Math.max(0, lowest - padding);
  const max = highest + padding;
  const left = 92;
  const right = 650;
  const x = (index) => left + index / Math.max(visible.length - 1, 1) * (right - left);
  const y = (value) => 24 + (max - value) / Math.max(max - min, 1) * 196;
  const gridValues = [min, (min + max) / 2, max];

  return (
    <section className={`${styles.section} ${styles.trendSection}`} id="debt-trend" aria-labelledby="debt-trend-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>Official debt history</p>
          <h2 id="debt-trend-title">How {name}’s debt has developed</h2>
          <p>Official quarterly debt stock in euros, without extending the live estimate into the historical series.</p>
        </div>
        <fieldset className={styles.rangePicker}>
          <legend>Period</legend>
          {HORIZONS.map((horizon) => (
            <button type="button" key={horizon} aria-pressed={years === horizon} onClick={() => setYears(horizon)}>{horizon}Y</button>
          ))}
        </fieldset>
      </div>

      <div className={styles.trendLayout}>
        <figure className={styles.chartCard}>
          <figcaption>Official debt stock · {name}</figcaption>
          <svg viewBox="0 0 680 264" role="img" aria-label={`${name} official debt, ${formatQuarter(start)} to ${formatQuarter(latestQuarter)}`}>
            {gridValues.map((value) => (
              <g key={value}>
                <line x1={left} x2={right} y1={y(value)} y2={y(value)} />
                <text x={left - 12} y={y(value) + 5} textAnchor="end">{formatDebt(value)}</text>
              </g>
            ))}
            {segments.map((segment, segmentIndex) => (
              <polyline
                key={segmentIndex}
                points={segment.map((point) => `${x(point.index)},${y(point.value)}`).join(" ")}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}
            <text x={left} y="254">{formatQuarter(start)}</text>
            <text x={right} y="254" textAnchor="end">{formatQuarter(latestQuarter)}</text>
          </svg>
        </figure>

        <aside className={styles.trendSummary} aria-live="polite">
          <p>{years}-year change</p>
          <strong>{signed(debtChange.percent, "%")}</strong>
          <span>{formatDebt(debtChange.change)} in official debt</span>
          <div>
            <small>Debt / GDP over the same period</small>
            <b>{signed(ratioChange.change, " pp")}</b>
          </div>
          <p className={styles.contextNote}>Debt in euros and debt relative to GDP can move in different directions.</p>
          <Link href="/debt-growth">Compare {name}’s debt growth across Europe <span aria-hidden="true">→</span></Link>
        </aside>
      </div>
    </section>
  );
}
