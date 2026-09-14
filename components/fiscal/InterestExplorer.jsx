"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { countryName } from "@/lib/countries";
import { INTEREST, interestBand, interestRows, interestPoints } from "@/lib/fiscal/interest";
import { fiscalPath } from "@/lib/fiscal/paths";
import { MAP_SCALE_COLORS } from "@/lib/map-colors";
import { getInterestCopy, interestNumber } from "./interest-copy";
import IndicatorRanking from "./IndicatorRanking";
import InterestHistory from "./InterestHistory";
import styles from "./interest.module.css";
import fiscal from "./fiscal.module.css";

const IndicatorMap = dynamic(() => import("./IndicatorMap"), { ssr: false });
const COLORS = MAP_SCALE_COLORS;

export default function InterestExplorer({ snapshot, debtContext, lang = "en" }) {
  const copy = getInterestCopy(lang);
  const [code, setCode] = useState("NL"), [mode, setMode] = useState("ratio");
  const rows = interestRows(snapshot, mode), selected = rows.find(row => row.code === code);
  const named = rows.map(row => ({ ...row, name: countryName(row.code, lang) })).sort((a, b) => a.name.localeCompare(b.name, copy.locale));
  const ratioRank = interestRows(snapshot, "ratio").find(row => row.code === code).rank;
  const debt = debtContext?.countries[code];
  const columns = [
    { key: "amount", label: `${copy.amount} (€)`, period: snapshot.latestYear },
    { key: "ratio", label: `${copy.ratio} (%)`, period: snapshot.latestYear },
    { key: "perCapita", label: `${copy.perCapita} (€)`, period: snapshot.latestYear },
    { key: "revenueShare", label: `${copy.revenueShare} (%)`, period: snapshot.latestYear },
    { key: "previous", label: `${copy.previous} · ${copy.amount} (€)`, period: String(Number(snapshot.latestYear) - 1) },
    { key: "annualChange", label: copy.annualChange }, { key: "growth", label: copy.growth },
  ];
  const cell = (value, type, status = "", signed = false) => ({ text: interestNumber(value, lang, type, signed), status });
  const ranking = rows.map(row => ({ code: row.code, name: countryName(row.code, lang), rank: row.rank, href: fiscalPath(`/country/${row.code.toLowerCase()}`, lang), cells: {
    amount: cell(row.amount, "eur", row.amountStatus), ratio: cell(row.ratio, "percent", row.ratioStatus), perCapita: cell(row.perCapita, "eur", row.perCapitaStatus), revenueShare: cell(row.revenueShare, "percent", row.revenueShareStatus),
    previous: cell(row.previous?.amount, "eur", row.previous?.amountStatus), annualChange: cell(row.annualChange.change, "eur", row.annualChange.status, true), growth: cell(row.annualChange.percent, "percent", row.annualChange.status, true),
  } }));
  return <div className={fiscal.shell}>
    <section className={fiscal.section} aria-labelledby="interest-map-title"><div className={fiscal.sectionHeading}><h2 id="interest-map-title">{copy.mapTitle}</h2><p>{copy.mapHint}</p></div>
      <div className={fiscal.mapLayout}><div>
        <div className={fiscal.mapFrame}><p className={fiscal.mapFallback}>{copy.loading}</p><IndicatorMap rows={named.map(row => ({ code: row.code, color: COLORS[interestBand(row.ratio)], label: `${row.name}: ${interestNumber(row.ratio, lang, "percent")} · ${copy.ratio} · ${snapshot.latestYear}` }))} selectedCode={code} onSelect={setCode} label={copy.mapAria} /></div>
        <div className={fiscal.smallCountries}>{["CY", "LU", "MT"].map(small => { const row = named.find(item => item.code === small); return <button key={small} type="button" aria-pressed={code === small} onClick={() => setCode(small)}><i aria-hidden="true" style={{ background: COLORS[interestBand(row.ratio)] }} />{row.name} {interestNumber(row.ratio, lang, "percent")}</button>; })}</div>
        <ul className={fiscal.legend}>{Object.entries(COLORS).map(([key, color], i) => <li key={key}><i aria-hidden="true" style={{ background: color }} />{copy.bands[i]}</li>)}</ul><p className={fiscal.note}>{copy.bandNote}</p>
      </div><div className={fiscal.countryPanel}><label htmlFor="interest-country">{copy.select}</label><select id="interest-country" value={code} onChange={event => setCode(event.target.value)}>{named.map(row => <option key={row.code} value={row.code}>{row.name}</option>)}</select>
        <div aria-live="polite" aria-atomic="true"><p className={fiscal.panelYear}>{countryName(code, lang)} · {snapshot.latestYear}</p><p className={fiscal.bigValue}>{interestNumber(selected.ratio, lang, "percent")}<sup>{selected.ratioStatus}</sup></p><p>{copy.ratio}</p>
          <dl className={fiscal.panelFacts}>{[["amount", "compact"], ["perCapita", "eur"], ["revenueShare", "percent"]].map(([key, type]) => <div key={key}><dt>{copy[key]}</dt><dd>{interestNumber(selected[key], lang, type)}<sup>{selected[`${key}Status`]}</sup></dd></div>)}<div><dt>{copy.rank} · {copy.ratio}</dt><dd>{ratioRank} / 27</dd></div></dl>
        </div>
        {debt && <div className={styles.debtNote}><dl className={fiscal.panelFacts}><div><dt>{copy.debt} · {debtContext.year}</dt><dd>{interestNumber(debt.amount, lang, "compact")}<sup>{debt.amountStatus}</sup></dd></div><div><dt>{copy.debtRatio} · {debtContext.year}</dt><dd>{interestNumber(debt.ratio, lang, "percent")}<sup>{debt.ratioStatus}</sup></dd></div></dl><p className={fiscal.note}>{copy.debtSource} <Link href={fiscalPath("/debt-per-capita#debt-per-capita-methodology", lang)}>{copy.method}</Link></p></div>}
        <Link className={fiscal.textLink} href={fiscalPath(`/country/${code.toLowerCase()}`, lang)}>{copy.countryLink} →</Link>
      </div></div>
    </section>
    <section className={styles.history} aria-labelledby="interest-history-title"><h2 id="interest-history-title">{copy.historyTitle} · {countryName(code, lang)}</h2><p>{snapshot.years[0]}–{snapshot.latestYear} · {copy.year}: {snapshot.latestYear}</p>
      {selected.annualChange.change !== null && selected.ratioChange.change !== null && <p className={fiscal.insight}>{copy.insight(countryName(code, lang), interestNumber(selected.annualChange.change, lang, "compact", true), interestNumber(selected.ratioChange.change, lang, "pp", true), selected.annualChange.startYear, snapshot.latestYear)}</p>}
      <InterestHistory points={interestPoints(snapshot, code)} name={countryName(code, lang)} lang={lang} />
    </section>
    <div className={styles.order}><label htmlFor="interest-order">{copy.order}</label><select id="interest-order" value={mode} onChange={event => setMode(event.target.value)}>{INTEREST.modes.map(key => <option key={key} value={key}>{copy.modes[key]}</option>)}</select></div>
    <p className={fiscal.note}>{copy.scrollHint}</p><div className={styles.ranking}><IndicatorRanking id="interest-ranking" title={copy.rankingTitle} caption={`${copy.modes[mode]} · ${snapshot.latestYear}`} columns={columns} rows={ranking} copy={copy} locale={copy.locale} /></div><p className={fiscal.note}>{copy.missing}</p><p className={fiscal.note}>{copy.flags}</p>
  </div>;
}
