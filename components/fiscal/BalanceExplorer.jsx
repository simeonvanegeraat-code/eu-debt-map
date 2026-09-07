"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { countryName } from "@/lib/countries";
import { fiscalPath } from "@/lib/fiscal/paths";
import { balanceBand } from "@/lib/fiscal/balance-core";
import BalanceTrend, { BALANCE_COLORS } from "./BalanceTrend";
import { getBalanceCopy, formatFiscal, balanceInsight } from "./balance-copy";
import styles from "./fiscal.module.css";

const IndicatorMap = dynamic(() => import("./IndicatorMap"), { ssr: false });

export default function BalanceExplorer({ rows, history, year, lang = "en" }) {
  const copy = getBalanceCopy(lang);
  const [selectedCode, setSelectedCode] = useState("FR");
  const [query, setQuery] = useState("");
  const namedRows = rows.map((row) => ({ ...row, name: countryName(row.code, lang) }));
  const selected = namedRows.find((row) => row.code === selectedCode) || namedRows[0];
  const countryHref = (code) => fiscalPath(`/country/${code.toLowerCase()}`, lang);
  const simplify = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase(copy.locale);
  const filtered = namedRows.filter((row) => simplify(`${row.name} ${row.code}`).includes(simplify(query.trim())));
  const alphabetical = [...namedRows].sort((a, b) => a.name.localeCompare(b.name, copy.locale));
  return <>
    <section className={styles.section} aria-labelledby="balance-map-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>{copy.official} · {year}</p><h2 id="balance-map-title">{copy.mapTitle}</h2></div><p>{copy.mapHint}</p></div>
      <div className={styles.mapLayout}>
        <div>
          <div className={styles.mapFrame}>
            <p className={styles.mapFallback}>{copy.loading}</p>
            <IndicatorMap rows={namedRows.map((row) => ({ code: row.code, color: BALANCE_COLORS[balanceBand(row.balance)], label: `${row.name}: ${formatFiscal(row.balance, lang)}, ${copy.status[balanceBand(row.balance)]}, ${year}` }))}
              selectedCode={selectedCode} onSelect={setSelectedCode} label={copy.mapAria} />
          </div>
          <div className={styles.smallCountries}>{["CY", "LU", "MT"].map((code) => {
            const row = namedRows.find((item) => item.code === code);
            return <button type="button" key={code} aria-pressed={selectedCode === code} onClick={() => setSelectedCode(code)}><i style={{ background: BALANCE_COLORS[balanceBand(row.balance)] }} aria-hidden="true" />{row.name} {formatFiscal(row.balance, lang)}</button>;
          })}</div>
          <ul className={styles.legend} aria-label={copy.gdp}>{Object.entries(copy.bands).map(([key, label]) => <li key={key}><i aria-hidden="true" style={{ background: BALANCE_COLORS[key] }} />{label}</li>)}</ul>
          <p className={styles.note}><a href="#balance-reference">{copy.referenceShort}</a> · {copy.missing}</p>
        </div>
        <div className={styles.countryPanel}>
          <label htmlFor="balance-country">{copy.select}</label>
          <select id="balance-country" value={selected.code} onChange={(event) => setSelectedCode(event.target.value)}>{alphabetical.map((row) => <option key={row.code} value={row.code}>{row.name}</option>)}</select>
          <div aria-live="polite" aria-atomic="true">
            <p className={styles.panelYear}>{selected.name} · {year}</p>
            <p className={styles.bigValue}>{formatFiscal(selected.balance, lang)}<sup>{selected.balanceStatus}</sup></p>
            <p>{copy.status[balanceBand(selected.balance)]} · {copy.gdp}</p>
            <dl className={styles.panelFacts}>
              <div><dt>{copy.previous} · {Number(year) - 1}</dt><dd>{formatFiscal(selected.previous, lang)}<sup>{selected.previousStatus}</sup></dd></div>
              <div><dt>{copy.change}</dt><dd>{formatFiscal(selected.change, lang, { suffix: ` ${copy.pp}` })}</dd></div>
              <div><dt>{copy.rank}</dt><dd>{selected.rank ?? "—"} / 27</dd></div>
              <div><dt>{copy.debt} · {copy.debtDate} {year}</dt><dd>{formatFiscal(selected.debtRatio, lang, { signed: false })}<sup>{selected.debtStatus}</sup></dd></div>
            </dl>
            <p className={styles.insight}>{balanceInsight(selected.change, lang)}</p>
          </div>
          <Link className={styles.textLink} href={countryHref(selected.code)}>{copy.countryLink} →</Link>
          <p className={styles.note}>{copy.debtNote}</p>
        </div>
      </div>
      <BalanceTrend points={history[selected.code]} name={selected.name} lang={lang} />
    </section>
    <section className={styles.section} aria-labelledby="balance-ranking-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>EU-27 · {year}</p><h2 id="balance-ranking-title">{copy.rankingTitle}</h2></div>
        <div className={styles.search}><label htmlFor="balance-search">{copy.search}</label><input id="balance-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></div></div>
      <p className={styles.note} id="balance-rank-note">{copy.rankNote}</p>
      <p className={styles.resultCount} role="status">{copy.shown}: {filtered.length} / 27</p>
      <div className={styles.tableScroll} tabIndex={0} role="region" aria-labelledby="balance-ranking-title">
        <table className={styles.ranking} aria-describedby="balance-rank-note">
          <caption>{copy.balance} · {copy.gdp} · {year}</caption>
          <thead><tr><th scope="col">{copy.rank}</th><th scope="col">{copy.country}</th><th scope="col">{copy.balance}<small>{year}</small></th><th scope="col">{copy.previous}<small>{Number(year) - 1}</small></th><th scope="col">{copy.change}<small>{copy.pp}</small></th><th scope="col">{copy.debt}<small>{copy.debtDate} {year}</small></th></tr></thead>
          <tbody>{filtered.map((row) => <tr key={row.code}><td>{row.rank ?? "—"}</td><th scope="row"><Link href={countryHref(row.code)}>{row.name}</Link><small>{row.code}</small></th>
            <td><span className={styles.balanceCell}><i aria-hidden="true" style={{ background: BALANCE_COLORS[balanceBand(row.balance)] }} />{formatFiscal(row.balance, lang)}<sup>{row.balanceStatus}</sup></span></td>
            <td>{formatFiscal(row.previous, lang)}<sup>{row.previousStatus}</sup></td><td>{formatFiscal(row.change, lang, { suffix: "" })}</td><td>{formatFiscal(row.debtRatio, lang, { signed: false })}<sup>{row.debtStatus}</sup></td></tr>)}</tbody>
        </table>
        {filtered.length === 0 && <p>{copy.noResults}</p>}
      </div>
    </section>
  </>;
}
