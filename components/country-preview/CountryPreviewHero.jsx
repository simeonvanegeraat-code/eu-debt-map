"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { interpolateDebt } from "@/lib/data";
import { getCountryCopy, localeBase, localeFor } from "@/components/country/country-copy";
import styles from "./country-preview.module.css";

function formatQuarter(value, lang) {
  const match = /^(\d{4})-?Q([1-4])$/i.exec(String(value || ""));
  if (!match) return value || "—";
  return lang === "fr" ? `T${match[2]} ${match[1]}` : `${match[1]} Q${match[2]}`;
}

export default function CountryPreviewHero({ country, name, title, rank, count, lang = "en", breadcrumbSlot = null, isPreview }) {
  const locale = localeFor(lang);
  const copy = getCountryCopy(lang);
  const number = useMemo(() => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }), [locale]);
  const compact = useMemo(() => new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 2 }), [locale]);
  const ratio = useMemo(() => new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), [locale]);
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
  const period = formatQuarter(country.official_latest_time, lang);
  const base = localeBase(lang);

  return (
    <header className={styles.hero} id="debt-now">
      <div className={styles.shell}>
        {isPreview ? (
          <div className={styles.previewBar}>
            <span>{copy.previewLabel}</span>
            <Link href={`${base}/country/${country.code.toLowerCase()}`}>{copy.viewCurrent}</Link>
          </div>
        ) : null}

        {breadcrumbSlot ? <div className={styles.breadcrumbSlot}>{breadcrumbSlot}</div> : null}

        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{copy.eyebrow(name)}</p>
            <h1 id="country-page-title">{title}</h1>
            <p className={styles.heroIntro}>{copy.lede}</p>
          </div>

          <section className={styles.livePanel} aria-label={copy.liveMonitor}>
            <div className={styles.liveHeader}>
              <span>{showOfficial ? copy.officialValue : copy.liveMonitor}</span>
              <div className={styles.modeSwitch} role="group" aria-label={`${copy.liveMonitor}: ${copy.live} / ${copy.official}`}>
                <button type="button" aria-pressed={!showOfficial} onClick={() => setShowOfficial(false)}>{copy.live}</button>
                <button type="button" aria-pressed={showOfficial} onClick={() => setShowOfficial(true)}>{copy.official}</button>
              </div>
            </div>
            <output className={styles.debtNumber} aria-live="off" suppressHydrationWarning>€{number.format(Math.round(shownDebt))}</output>
            <p className={styles.debtCompact} suppressHydrationWarning>
              €{compact.format(shownDebt)} <span>{showOfficial ? period : copy.modelledEstimate}</span>
            </p>
            <div className={styles.anchorLine} aria-hidden="true"><i /><i /><i /></div>
            <div className={styles.anchorLabels}>
              <span><small>{formatQuarter(country.official_previous_time, lang)}</small><strong>€{compact.format(country.prev_value_eur)}</strong></span>
              <span><small>{period}</small><strong>€{compact.format(officialDebt)}</strong></span>
              <span><small>{copy.estimatedNow}</small><strong suppressHydrationWarning>€{compact.format(liveDebt)}</strong></span>
            </div>
            <p className={styles.modelNote}>
              {showOfficial
                ? copy.officialObservation
                : copy.methodWarning}
            </p>
          </section>

          <div className={styles.heroMeta}>
            <dl className={styles.heroFacts}>
              <div><dt>{copy.debtToGdp}</dt><dd>{ratio.format(country.official_debt_to_gdp_pct)}%</dd></div>
              <div><dt>{copy.euPosition}</dt><dd>{copy.ranked(rank, count)}</dd></div>
              <div><dt>{copy.officialPeriod}</dt><dd>{period}</dd></div>
            </dl>
            <p className={styles.sourceLine}>{copy.official} · Eurostat · {period}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
