"use client";

import { useState } from "react";
import Link from "next/link";
import PreviewEUTicker from "@/components/home-preview/PreviewEUTicker";
import { getEUDebtCopy, euDebtText, euDebtAmount, euDebtQuarter, euDebtHref } from "./eu-debt-copy";
import styles from "./eu-debt-preview.module.css";

export default function EUDebtSummary({ officialTotal, perSecond, period, children, lang = "nl" }) {
  const copy = getEUDebtCopy(lang);
  const t = copy.summary;
  const quarter = euDebtQuarter(period, copy.lang);
  const euro = new Intl.NumberFormat(copy.locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const [mode, setMode] = useState("live");
  const live = mode === "live";

  return <aside className={styles.summary} aria-label={t.label}>
    <div className={styles.summaryHeader}>
      <span>{t.label}</span>
      <div className={styles.summarySwitch} role="group" aria-label={t.mode}>
        <button type="button" aria-pressed={live} onClick={() => setMode("live")}>{t.live}</button>
        <button type="button" aria-pressed={!live} onClick={() => setMode("official")}>{t.official}</button>
      </div>
    </div>
    <p className={styles.summaryCaption}>{t.caption}</p>
    <div hidden={!live}>
      <PreviewEUTicker officialTotal={officialTotal} perSecond={perSecond} locale={copy.locale} ariaLabel={t.liveAria} className={styles.summaryTicker} />
    </div>
    {!live ? <output className={styles.summaryNumber} aria-live="off" aria-label={t.officialAria}>{euro.format(officialTotal)}</output> : null}
    <p className={styles.period} role="status">{live ? t.liveStatus : euDebtText(t.officialStatus, { period: quarter })}</p>
    <p className={styles.officialAnchor}>{t.anchor}: <strong>{euDebtAmount(officialTotal, copy.lang)}</strong> · {quarter}</p>
    <p className={styles.summaryModeNote}>{live ? t.liveNote : t.officialNote} <Link href={euDebtHref("/methodology", copy.lang)}>{t.method}</Link></p>
    <p className={styles.summaryChanges}>{t.changes}</p>
    {children}
  </aside>;
}
