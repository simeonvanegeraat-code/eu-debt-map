"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ACCOUNTS, accountRows, accountPoints, accountBand, accountChange } from "@/lib/fiscal/accounts";
import { countryName } from "@/lib/countries";
import { fiscalPath } from "@/lib/fiscal/paths";
import { getAccountsCopy, accountNumber } from "./accounts-copy";
import IndicatorRanking from "./IndicatorRanking";
import AccountsHistory from "./AccountsHistory";
import AccountSourceDifference from "./AccountSourceDifference";
import styles from "./accounts.module.css";
import fiscal from "./fiscal.module.css";

const IndicatorMap = dynamic(() => import("./IndicatorMap"), { ssr: false });
const SIZE = { low: "#c7daf8", medium: "#85b1f3", high: "#3478dc", highest: "#123b80", missing: "#d8dee8" };
const BALANCE = { surplus: "#24746d", deficit: "#88ace0", largeDeficit: "#b76946", missing: "#d8dee8" };

export default function AccountsExplorer({ snapshot, comparisons, lang = "en" }) {
  const [code, setCode] = useState("NL"), [mode, setMode] = useState("expenditureRatio");
  const copy = getAccountsCopy(lang), rows = accountRows(snapshot, mode), selected = rows.find(row => row.code === code);
  const eu = accountPoints(snapshot, "EU27_2020").at(-1), points = accountPoints(snapshot, code);
  const named = rows.map(row => ({ ...row, name: countryName(row.code, lang) })).sort((a, b) => a.name.localeCompare(b.name, copy.locale));
  const colours = mode === "balanceRatio" ? BALANCE : SIZE, bands = mode === "balanceRatio" ? copy.balanceBands : copy.sizeBands;
  const columns = [...ACCOUNTS.modes.map(key => ({ key, label: `${copy[key]} (%)`, period: snapshot.latestYear })),
    { key: "previous", label: `${copy.previous} · ${copy[mode]} (%)`, period: String(Number(snapshot.latestYear) - 1) },
    { key: "change", label: copy.change }, { key: "euGap", label: copy.euGap }];
  const cell = (value, status, type = "percent", signed = false) => ({ text: accountNumber(value, lang, type, signed), status });
  const ranking = rows.map(row => ({ code: row.code, name: countryName(row.code, lang), rank: row.rank, href: fiscalPath(`/country/${row.code.toLowerCase()}`, lang), cells: {
    ...Object.fromEntries(ACCOUNTS.modes.map(key => [key, cell(row[key], row[`${key}Status`])])),
    previous: cell(row.previous, row.previousStatus), change: cell(row.change.change, row.change.status, "pp", true), euGap: cell(row.euGap, row.euGapStatus, "pp", true),
  } }));
  const expenditureChange = accountChange(points, snapshot.latestYear, "expenditureRatio"), revenueChange = accountChange(points, snapshot.latestYear, "revenueRatio");
  return <div className={fiscal.shell}>
    <section className={fiscal.section} aria-labelledby="accounts-map-title"><div className={fiscal.sectionHeading}><h2 id="accounts-map-title">{copy.mapTitle}</h2><p>{copy.mapHint}</p></div>
      <div className={styles.control}><div><label htmlFor="accounts-metric">{copy.metric}</label><select id="accounts-metric" value={mode} onChange={e => setMode(e.target.value)}>{ACCOUNTS.modes.map(key => <option key={key} value={key}>{copy.modes[key]}</option>)}</select></div></div>
      <div className={fiscal.mapLayout}><div><div className={fiscal.mapFrame}><p className={fiscal.mapFallback}>{copy.loading}</p><IndicatorMap selectedCode={code} onSelect={setCode} label={`${copy.mapTitle} · ${copy[mode]} · ${snapshot.latestYear}`} rows={named.map(row => ({ code: row.code, color: colours[accountBand(row[mode], mode)], label: `${row.name}: ${accountNumber(row[mode], lang, "percent")} · ${copy[mode]} · ${snapshot.latestYear}` }))} /></div>
        <div className={fiscal.smallCountries}>{["CY", "LU", "MT"].map(small => { const row = named.find(item => item.code === small); return <button key={small} type="button" aria-pressed={small === code} onClick={() => setCode(small)}><i style={{ background: colours[accountBand(row[mode], mode)] }} aria-hidden="true" />{row.name} {accountNumber(row[mode], lang, "percent")}</button>; })}</div>
        <ul className={fiscal.legend}>{Object.entries(colours).map(([key, color], i) => <li key={key}><i aria-hidden="true" style={{ background: color }} />{bands[i]}</li>)}</ul><p className={fiscal.note}>{copy.bandNote}</p>
        <p className={fiscal.note}>{copy.eu} · {snapshot.latestYear}</p><dl className={styles.euStrip}>{ACCOUNTS.modes.map(key => <div key={key}><dt>{copy[key]}</dt><dd>{accountNumber(eu[key], lang, "percent")}<sup>{eu[`${key}Status`]}</sup></dd></div>)}</dl><p className={fiscal.note}>{copy.euNote}</p>
      </div><div className={fiscal.countryPanel}><label htmlFor="accounts-country">{copy.select}</label><select id="accounts-country" value={code} onChange={e => setCode(e.target.value)}>{named.map(row => <option key={row.code} value={row.code}>{row.name}</option>)}</select>
        <div aria-live="polite" aria-atomic="true"><p className={fiscal.panelYear}>{countryName(code, lang)} · {snapshot.latestYear}</p><p className={fiscal.bigValue}>{accountNumber(selected[mode], lang, "percent")}<sup>{selected[`${mode}Status`]}</sup></p><p>{copy[mode]}</p>
          <dl className={fiscal.panelFacts}>{["expenditure", "revenue", "balance"].map(key => <div key={key}><dt>{copy[key]}</dt><dd>{accountNumber(selected[`${key}Ratio`], lang, "percent")}<sup>{selected[`${key}RatioStatus`]}</sup><small style={{ display: "block", fontSize: 12, fontWeight: 400 }}>{accountNumber(selected[key], lang, "compact")}<sup>{selected[`${key}Status`]}</sup></small></dd></div>)}
            <div><dt>{copy.euGap} · {copy[mode]}</dt><dd>{accountNumber(selected.euGap, lang, "pp", true)}<sup>{selected.euGapStatus}</sup></dd></div><div><dt>{copy.rank} · {copy[mode]}</dt><dd>{selected.rank} / 27</dd></div></dl>
        </div><AccountSourceDifference comparison={comparisons[code]} lang={lang} /><Link className={fiscal.textLink} href={fiscalPath(`/country/${code.toLowerCase()}`, lang)}>{copy.countryLink} →</Link>
      </div></div>
    </section>
    <section className={styles.history} aria-labelledby="accounts-history-title"><h2 id="accounts-history-title">{copy.historyTitle} · {countryName(code, lang)}</h2><p>{snapshot.years[0]}–{snapshot.latestYear}</p><p className={fiscal.note}>{copy.identity}</p>
      {expenditureChange.change !== null && revenueChange.change !== null && <p className={fiscal.insight}>{copy.insight(countryName(code, lang), accountNumber(expenditureChange.change, lang, "pp", true), accountNumber(revenueChange.change, lang, "pp", true), expenditureChange.startYear, snapshot.latestYear)}</p>}
      <AccountsHistory points={points} name={countryName(code, lang)} lang={lang} />
    </section><div className={styles.control}><div><label htmlFor="accounts-order">{copy.order}</label><select id="accounts-order" value={mode} onChange={e => setMode(e.target.value)}>{ACCOUNTS.modes.map(key => <option key={key} value={key}>{copy.modes[key]}</option>)}</select></div></div>
    <p className={fiscal.note}>{copy.scrollHint}</p><div className={styles.ranking}><IndicatorRanking id="accounts-ranking" title={copy.rankingTitle} caption={`${copy.modes[mode]} · ${snapshot.latestYear}`} rows={ranking} columns={columns} copy={copy} locale={copy.locale} /></div><p className={fiscal.note}>{copy.flags}</p>
  </div>;
}
