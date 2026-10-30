"use client";

import { useState } from "react";
import Link from "next/link";
import PreviewEUTicker from "@/components/home-preview/PreviewEUTicker";
import styles from "./eu-debt-preview.module.css";

const euro = (value) => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
const compactEuro = (value) => `€ ${new Intl.NumberFormat("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value / 1e12)} bln.`;

export default function EUDebtSummary({ officialTotal, perSecond, period, children }) {
  const [mode, setMode] = useState("live");
  const live = mode === "live";

  return <aside className={styles.summary} aria-label="EU-schuldmeter">
    <div className={styles.summaryHeader}>
      <span>EU-schuldmeter</span>
      <div className={styles.summarySwitch} role="group" aria-label="Weergave EU-schuldmeter">
        <button type="button" aria-pressed={live} onClick={() => setMode("live")}>Live</button>
        <button type="button" aria-pressed={!live} onClick={() => setMode("official")}>Officieel</button>
      </div>
    </div>
    <p className={styles.summaryCaption}>Opgetelde overheidsschuld EU-27</p>
    <div hidden={!live}>
      <PreviewEUTicker officialTotal={officialTotal} perSecond={perSecond} locale="nl-NL" ariaLabel="Overheidsschuld EU-27, gemodelleerde live schatting" className={styles.summaryTicker} />
    </div>
    {!live ? <output className={styles.summaryNumber} aria-live="off" aria-label="Officiële opgetelde overheidsschuld EU-27">{euro(officialTotal)}</output> : null}
    <p className={styles.period} role="status">{live ? "Gemodelleerde live schatting · EU-27" : `Berekende som · officiële cijfers · ${period}`}</p>
    <p className={styles.officialAnchor}>Officieel anker: <strong>{compactEuro(officialTotal)}</strong> · {period}</p>
    <p className={styles.summaryModeNote}>{live ? "De live teller gebruikt dezelfde schatting als de homepage. Het is geen officiële realtime statistiek." : "Dit is de laatst beschikbare kwartaalstand, berekend uit de officiële schuldcijfers van alle 27 EU-landen."} <Link href="/nl/methodology">Hoe werkt dit?</Link></p>
    <p className={styles.summaryChanges}>Veranderingen tussen officiële kwartalen</p>
    {children}
  </aside>;
}
