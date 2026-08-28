import Link from "next/link";
import { EUROSTAT_DEBT_HISTORY } from "@/lib/eurostat.debt.history.gen";
import styles from "./home-preview.module.css";

const CHART_WIDTH = 720;
const CHART_HEIGHT = 260;
const CHART_PADDING = 18;

function formatTrillions(value, lang, locale) {
  const units = { en: "tn", nl: "bln.", de: "Bio.", fr: "Bn" };
  const amount = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 1e12);

  return `€ ${amount} ${units[lang] || units.en}`;
}

function chartGeometry(rows) {
  const values = rows.map((row) => Number(row.totalDebtEUR));
  const minValue = Math.min(...values) * 0.985;
  const maxValue = Math.max(...values) * 1.01;
  const range = Math.max(maxValue - minValue, 1);
  const usableWidth = CHART_WIDTH - CHART_PADDING * 2;
  const usableHeight = CHART_HEIGHT - CHART_PADDING * 2;
  const points = rows.map((row, index) => {
    const x = CHART_PADDING + (index / Math.max(rows.length - 1, 1)) * usableWidth;
    const y = CHART_HEIGHT - CHART_PADDING - ((row.totalDebtEUR - minValue) / range) * usableHeight;
    return { x, y };
  });
  const line = points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  const area = `${line} L${points.at(-1).x.toFixed(1)},${CHART_HEIGHT - CHART_PADDING} L${points[0].x.toFixed(1)},${CHART_HEIGHT - CHART_PADDING} Z`;

  return { points, line, area };
}

export default function HomeTrendPreview({ lang, copy }) {
  const rows = (EUROSTAT_DEBT_HISTORY?.quarters || []).slice(-20);
  if (rows.length < 2) return null;

  const first = rows[0];
  const latest = rows.at(-1);
  const change = ((latest.totalDebtEUR - first.totalDebtEUR) / first.totalDebtEUR) * 100;
  const geometry = chartGeometry(rows);
  const trendHref = `${copy.base}/eu-debt` || "/eu-debt";

  return (
    <section className={styles.trendSection} aria-labelledby="home-trend-title">
      <div className={styles.trendCopy}>
        <p className={styles.eyebrow}>{copy.trendEyebrow}</p>
        <h2 id="home-trend-title">{copy.trendTitle}</h2>
        <p>{copy.trendIntro}</p>

        <dl className={styles.trendMetrics}>
          <div>
            <dt>{copy.trendLatest}</dt>
            <dd>{formatTrillions(latest.totalDebtEUR, lang, copy.locale)}</dd>
          </div>
          <div>
            <dt>{copy.trendChange}</dt>
            <dd>+{new Intl.NumberFormat(copy.locale, { maximumFractionDigits: 1 }).format(change)}%</dd>
          </div>
        </dl>

        <Link className={styles.trendCta} href={trendHref}>
          <span>{copy.trendCta}</span>
          <b aria-hidden="true">→</b>
        </Link>
      </div>

      <div className={styles.trendChart}>
        <div className={styles.trendChartHeader}>
          <div>
            <span>{copy.trendChartLabel}</span>
            <strong>{first.quarter} — {latest.quarter}</strong>
          </div>
          <span>{copy.trendOfficial}</span>
        </div>

        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          role="img"
          aria-label={copy.trendChartAria(first.quarter, latest.quarter)}
        >
          <defs>
            <linearGradient id="home-trend-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5ce5bf" stopOpacity="0.34" />
              <stop offset="1" stopColor="#5ce5bf" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.2, 0.5, 0.8].map((fraction) => (
            <line
              key={fraction}
              x1={CHART_PADDING}
              x2={CHART_WIDTH - CHART_PADDING}
              y1={CHART_HEIGHT * fraction}
              y2={CHART_HEIGHT * fraction}
              className={styles.trendGridLine}
            />
          ))}
          <path d={geometry.area} fill="url(#home-trend-area)" />
          <path d={geometry.line} className={styles.trendLine} />
          <circle
            cx={geometry.points.at(-1).x}
            cy={geometry.points.at(-1).y}
            r="6"
            className={styles.trendPoint}
          />
        </svg>

        <div className={styles.trendAxis} aria-hidden="true">
          <span>{first.quarter}</span>
          <span>{latest.quarter}</span>
        </div>
      </div>
    </section>
  );
}
