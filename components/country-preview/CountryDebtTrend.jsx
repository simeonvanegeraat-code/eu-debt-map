"use client";

import { useMemo, useState } from "react";
import { endpointChange, shiftQuarter, trendSegments } from "@/lib/fiscal/growth";
import { localeFor } from "@/components/country/country-copy";
import { getCountryRedesignCopy } from "./country-redesign-copy";
import styles from "./country-preview.module.css";

const HORIZONS = [1, 5, 10];

function formatQuarter(value, lang) {
  const match = /^(\d{4})-Q([1-4])$/.exec(value || "");
  if (!match) return value || "—";
  return lang === "fr" ? `T${match[2]} ${match[1]}` : `${match[1]} Q${match[2]}`;
}

function formatDebt(value, locale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatAxisDebt(value, locale) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function horizonLabel(years, lang) {
  if (lang === "fr") return `${years}A`;
  if (lang === "nl" || lang === "de") return `${years}J`;
  return `${years}Y`;
}

function signed(value, locale, suffix = "") {
  if (!Number.isFinite(value)) return "—";
  return `${value > 0 ? "+" : ""}${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)}${suffix}`;
}

export default function CountryDebtTrend({ points, name, latestQuarter, ratio, rank, count, median, growthRank, growthLink, ratioLink, lang = "en" }) {
  const locale = localeFor(lang);
  const copy = getCountryRedesignCopy(lang);
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

  const scaleMax = 160;

  return (
    <div className={styles.trendSection}>
      <div className={styles.trendToolbar}>
        <p>{copy.trendTitle(formatQuarter(start, lang), formatQuarter(latestQuarter, lang))}</p>
        <fieldset className={styles.rangePicker}>
          <legend>{copy.trendPeriod}</legend>
          {HORIZONS.map((horizon) => (
            <button type="button" key={horizon} aria-pressed={years === horizon} onClick={() => setYears(horizon)}>{horizonLabel(horizon, lang)}</button>
          ))}
        </fieldset>
      </div>

      <div className={styles.debtVisualGrid}>
        <figure className={styles.chartCard}>
          <figcaption>{copy.chartCaption(name)}</figcaption>
          <svg viewBox="0 0 680 264" role="img" aria-label={copy.chartAria(name, formatQuarter(start, lang), formatQuarter(latestQuarter, lang))}>
            {gridValues.map((value) => (
              <g key={value}>
                <line x1={left} x2={right} y1={y(value)} y2={y(value)} />
                <text x={left - 12} y={y(value) + 5} textAnchor="end">{formatAxisDebt(value, locale)}</text>
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
            <text x={left} y="254">{formatQuarter(start, lang)}</text>
            <text x={right} y="254" textAnchor="end">{formatQuarter(latestQuarter, lang)}</text>
          </svg>
        </figure>

        <aside className={styles.debtReading} aria-live="polite">
          <div className={styles.movementSummary}>
            <p>{copy.yearChange(years)}</p>
            <strong>{signed(debtChange.percent, locale, "%")}</strong>
            <span>{formatDebt(debtChange.change, locale)} {copy.debtChange}</span>
            <dl>
              <div><dt>{copy.ratioChange}</dt><dd>{signed(ratioChange.change, locale, " pp")}</dd></div>
              <div><dt>{copy.growthRank}</dt><dd>#{growthRank} / {count}</dd></div>
            </dl>
            {growthLink}
          </div>
        </aside>

        <div className={styles.euReading} id="eu-context">
          <h3 className={styles.euReadingTitle}>{copy.ratioTitle(formatQuarter(latestQuarter, lang))}</h3>
          <div className={styles.euReadingHeading}>
            <div><p>{copy.debtRatio}</p><strong>{signed(ratio, locale, "%").replace("+", "")}</strong></div>
            <div><p>{copy.euPosition}</p><strong>#{rank} <span>/ {count}</span></strong></div>
          </div>
          <div className={styles.miniRatioChart} aria-label={copy.ratioAria(name)}>
            <span className={styles.referenceLabel}>60%</span>
            <div><small>{name}</small><i><b style={{ width: `${ratio / scaleMax * 100}%` }} /></i></div>
            <div><small>{copy.euMedian}</small><i><b style={{ width: `${median / scaleMax * 100}%` }} /></i></div>
          </div>
          <div className={styles.euReadingFooter}>
            <p>{copy.treatyNote}</p>
            {ratioLink}
          </div>
        </div>
      </div>
    </div>
  );
}
