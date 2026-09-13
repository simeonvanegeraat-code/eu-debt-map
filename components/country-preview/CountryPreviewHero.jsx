"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { interpolateDebt } from "@/lib/data";
import styles from "./country-preview.module.css";

function formatQuarter(value) {
  const match = /^(\d{4})-?Q([1-4])$/i.exec(String(value || ""));
  return match ? `${match[1]} Q${match[2]}` : value || "—";
}

export default function CountryPreviewHero({ country, name, title, rank, count, isPreview }) {
  const number = useMemo(() => new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }), []);
  const compact = useMemo(() => new Intl.NumberFormat("en-GB", { notation: "compact", maximumFractionDigits: 2 }), []);
  const ratio = useMemo(() => new Intl.NumberFormat("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 }), []);
  const [now, setNow] = useState(() => Date.now());
  const [showOfficial, setShowOfficial] = useState(false);

  useEffect(() => {
    if (country.isDebtTickerFrozen) return undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setInterval(() => setNow(Date.now()), reducedMotion ? 1000 : 180);
    return () => window.clearInterval(timer);
  }, [country.isDebtTickerFrozen]);

  const officialDebt = Number(country.last_value_eur);
  const liveDebt = interpolateDebt(country, now);
  const shownDebt = showOfficial ? officialDebt : liveDebt;
  const period = formatQuarter(country.official_latest_time);

  return (
    <header className={styles.hero} id="debt-now">
      <div className={styles.shell}>
        {isPreview ? (
          <div className={styles.previewBar}>
            <span>Country-page redesign · private preview</span>
            <Link href={`/country/${country.code.toLowerCase()}`}>View current public page</Link>
          </div>
        ) : null}

        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{name} · official government-debt data</p>
            <h1 id="country-page-title">{title}</h1>
            <p className={styles.heroIntro}>
              The latest official debt figure, a transparent live estimate and the European context needed to interpret both.
            </p>
            <p className={styles.verified}><i aria-hidden="true" />Verified source · Eurostat {period}</p>

            <dl className={styles.heroFacts}>
              <div><dt>Debt / GDP</dt><dd>{ratio.format(country.official_debt_to_gdp_pct)}%</dd></div>
              <div><dt>EU position</dt><dd>#{rank} of {count}</dd></div>
              <div><dt>Official period</dt><dd>{period}</dd></div>
            </dl>
          </div>

          <section className={styles.livePanel} aria-label="Live debt monitor">
            <div className={styles.liveHeader}>
              <span>{showOfficial ? "Official quarter-end value" : "Live debt monitor"}</span>
              <div className={styles.modeSwitch} role="group" aria-label="Choose live or official debt">
                <button type="button" aria-pressed={!showOfficial} onClick={() => setShowOfficial(false)}>Live</button>
                <button type="button" aria-pressed={showOfficial} onClick={() => setShowOfficial(true)}>Official</button>
              </div>
            </div>
            <output className={styles.debtNumber} aria-live="off" suppressHydrationWarning>€{number.format(Math.round(shownDebt))}</output>
            <p className={styles.debtCompact} suppressHydrationWarning>
              €{compact.format(shownDebt)} <span>{showOfficial ? period : "modelled estimate"}</span>
            </p>
            <div className={styles.anchorLine} aria-hidden="true"><i /><i /><i /></div>
            <div className={styles.anchorLabels}>
              <span><small>{formatQuarter(country.official_previous_time)}</small><strong>€{compact.format(country.prev_value_eur)}</strong></span>
              <span><small>{period}</small><strong>€{compact.format(officialDebt)}</strong></span>
              <span><small>Estimate now</small><strong suppressHydrationWarning>€{compact.format(liveDebt)}</strong></span>
            </div>
            <p className={styles.modelNote}>
              {showOfficial
                ? "Official Eurostat observation at the latest quarter end."
                : "Modelled from the two latest official quarters; this is an estimate, not a new official observation or forecast."}
            </p>
          </section>
        </div>
      </div>
    </header>
  );
}
