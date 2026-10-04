"use client";

import { useState } from "react";
import { countryName } from "@/lib/countries";
import { COLOR_BANDS, inflationColor, inflationRows, observation, shiftMonth } from "@/lib/inflation/indicators";
import IndicatorMap from "@/components/fiscal/IndicatorMap";
import InflationChart from "./InflationChart";
import useInflationSelection from "./useInflationSelection";
import { monthInYear, selectionSearch } from "@/lib/inflation/selection";
import { formatMonth, formatPoints, formatRate, getInflationCopy, statusText } from "./copy";
import styles from "./inflation.module.css";

function Observation({ point, lang, statusLabels }) {
  return <>{formatRate(point.value, lang)}{point.status && <small className={styles.flag}>{statusText(point.status, lang, statusLabels)}</small>}</>;
}

export default function InflationExplorer({ snapshot, lang = "en" }) {
  const copy = getInflationCopy(lang);
  const [selection, updateSelection] = useInflationSelection(snapshot, lang);
  const { month, area, country: selectedCode, years, sort } = selection;
  const setSelectedCode = country => updateSelection({ country });
  const [shareOpen, setShareOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const availableYears = [...new Set(snapshot.periods.map(period => period.slice(0, 4)))].reverse();
  const shareUrl = typeof window === "undefined" ? "" : `${window.location.origin}${window.location.pathname}?${selectionSearch(selection)}#inflation-explorer`;
  async function copyLink() {
    try { await navigator.clipboard.writeText(shareUrl); setCopyStatus(copy.copied); }
    catch { setCopyStatus(copy.manualCopy); }
  }
  const rows = inflationRows(snapshot, month, area);
  const code = rows.some(row => row.code === selectedCode) ? selectedCode : "NL";
  const name = countryName(code, lang);
  const annual = observation(snapshot, code, month);
  const monthly = observation(snapshot, code, month, "monthly");
  const euro = observation(snapshot, "EA", month);
  const difference = Number.isFinite(annual.value) && Number.isFinite(euro.value) ? annual.value - euro.value : null;
  const countries = [...rows].sort((a, b) => countryName(a.code, lang).localeCompare(countryName(b.code, lang), copy.locale));
  const ranking = sort === "alphabetical" ? countries : sort === "ascending"
    ? [...rows].sort((a, b) => a.value === null ? (b.value === null ? a.code.localeCompare(b.code) : 1) : b.value === null ? -1 : a.value - b.value || a.code.localeCompare(b.code)) : rows;
  const points = snapshot.periods.filter(period => period >= shiftMonth(month, -12 * years) && period <= month).map(period => {
    const country = observation(snapshot, code, period), aggregate = observation(snapshot, "EA", period);
    return { month: period, country: country.value, countryStatus: country.status, area: aggregate.value, areaStatus: aggregate.status };
  });
  const mapRows = rows.map(row => ({ ...row, color: inflationColor(row.value), label: `${countryName(row.code, lang)}: ${formatRate(row.value, lang)} ${statusText(row.status, lang, snapshot.statusLabels)}`.trim() }));
  function selectFromRanking(nextCode) {
    setSelectedCode(nextCode);
    const target = document.getElementById("history-title");
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: "center" });
  }

  return <div className={styles.shell}>
    <section className={styles.section} id="inflation-explorer" aria-labelledby="comparison-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>{copy.annual}</p><h2 id="comparison-title">{copy.comparison}</h2><p>{copy.comparisonIntro}</p></div></div>
      <div className={styles.toolbar}>
        <fieldset><legend>{copy.area}</legend><div className={styles.buttons}>{[["EA", copy.euroArea], ["EU27_2020", "EU-27"]].map(([key, label]) => <button key={key} type="button" aria-pressed={area === key} onClick={() => updateSelection({ area: key })}>{label}</button>)}</div></fieldset>
        <div className={styles.dateControls}>
          <div><label htmlFor="inflation-year">{copy.year}</label><select id="inflation-year" value={month.slice(0, 4)} onChange={event => updateSelection({ month: monthInYear(month, event.target.value, snapshot.periods) })}>{availableYears.map(year => <option key={year}>{year}</option>)}</select></div>
          <div className={styles.monthControl}><label htmlFor="inflation-month">{copy.month}</label><select id="inflation-month" value={month} onChange={event => updateSelection({ month: event.target.value })}>{snapshot.periods.filter(period => period.startsWith(month.slice(0, 4))).map(period => <option key={period} value={period}>{new Intl.DateTimeFormat(copy.locale, { month: "long", timeZone: "UTC" }).format(new Date(`${period}-01T00:00:00Z`))}</option>)}</select></div>
        </div>
        <p className={styles.periodNote} role="status">{formatMonth(month, lang)} · {rows.length} {copy.countries.toLocaleLowerCase(copy.locale)}<span>{copy.sameMonth}</span></p>
      </div>
      <div className={styles.share}>
        <button type="button" className={styles.actionButton} aria-expanded={shareOpen} aria-controls="inflation-share" onClick={() => { setShareOpen(!shareOpen); setCopyStatus(""); }}>{copy.share}</button>
        {shareOpen && <div id="inflation-share" className={styles.sharePanel}><label htmlFor="inflation-share-url">{copy.shareUrl}</label><div><input id="inflation-share-url" readOnly value={shareUrl} onFocus={event => event.target.select()} /><button type="button" className={styles.actionButton} onClick={copyLink}>{copy.copyLink}</button></div><p role="status">{copyStatus}</p></div>}
      </div>
      <div className={styles.mapLayout}>
        <div className={styles.mapFrame}>
          <IndicatorMap rows={mapRows} selectedCode={code} onSelect={setSelectedCode} label={`${copy.map} · ${formatMonth(month, lang)}`} />
          <div className={styles.smallCountries}>{mapRows.filter(row => ["MT", "LU", "CY"].includes(row.code)).map(row => <button type="button" key={row.code} onClick={() => setSelectedCode(row.code)} aria-pressed={code === row.code}><i style={{ background: row.color }} aria-hidden="true" />{countryName(row.code, lang)}</button>)}</div>
          <ul className={styles.legend} aria-label={copy.annual}>{COLOR_BANDS.map((band, index) => <li key={band.color}><i style={{ background: band.color }} aria-hidden="true" />{copy.bands[index]}</li>)}<li><i style={{ background: inflationColor(null) }} aria-hidden="true" />{copy.noData}</li></ul>
          <p className={styles.note}>{copy.memberNote}</p>
        </div>
        <aside className={styles.countryPanel}>
          <label htmlFor="inflation-country">{copy.select}</label><select id="inflation-country" value={code} onChange={event => setSelectedCode(event.target.value)}>{countries.map(row => <option key={row.code} value={row.code}>{countryName(row.code, lang)}</option>)}</select>
          <div aria-live="polite" aria-atomic="true">
            <p className={styles.panelPeriod}>{formatMonth(month, lang)}</p><h3>{name}</h3>
            <p className={styles.bigValue}><Observation point={annual} lang={lang} statusLabels={snapshot.statusLabels} /></p>
            <p className={styles.valueDefinition}>{copy.yearAgo}</p>
            <dl className={styles.facts}>
              <div><dt>{copy.monthly}<small>{copy.monthAgo}</small></dt><dd><Observation point={monthly} lang={lang} statusLabels={snapshot.statusLabels} /></dd></div>
              <div><dt>{copy.euroArea}<small>{copy.annual}</small></dt><dd><Observation point={euro} lang={lang} statusLabels={snapshot.statusLabels} /></dd></div>
              <div><dt>{copy.difference}<small>{copy.ppLong}</small></dt><dd>{formatPoints(difference, lang)}</dd></div>
            </dl>
          </div>
          <a href="#inflation-history" className={styles.textLink}>{copy.history} ↓</a>
        </aside>
      </div>
    </section>
    <section className={styles.section} id="inflation-history" aria-labelledby="history-title">
      <div className={styles.sectionHeading}><div><h2 id="history-title" tabIndex={-1}>{copy.history}</h2><p>{copy.historyIntro}</p></div><fieldset><legend>{copy.horizon}</legend><div className={styles.buttons}>{[1, 5, 10].map(value => <button key={value} type="button" aria-pressed={years === value} onClick={() => updateSelection({ years: value })}>{value === 1 ? copy.oneYear : `${value} ${copy.years}`}</button>)}</div></fieldset></div>
      <p className={styles.note}>{formatMonth(points[0].month, lang)} – {formatMonth(month, lang)} · {copy.annual}</p>
      <InflationChart points={points} name={name} lang={lang} statusLabels={snapshot.statusLabels} />
    </section>
    <section className={styles.section} aria-labelledby="ranking-title">
      <div className={styles.sectionHeading}><div><h2 id="ranking-title">{copy.ranking}</h2><p>{copy.rankingIntro}</p></div><div className={styles.sortControl}><label htmlFor="inflation-sort">{copy.sort}</label><select id="inflation-sort" value={sort} onChange={event => updateSelection({ sort: event.target.value })}>{["descending", "ascending", "alphabetical"].map(key => <option key={key} value={key}>{copy[key]}</option>)}</select></div></div>
      <div className={`${styles.tableScroll} ${styles.desktopRanking}`} tabIndex={0} role="region" aria-label={copy.ranking}>
        <table className={styles.table}><caption>{formatMonth(month, lang)} · {area === "EA" ? copy.euroArea : "EU-27"} · {copy.sameMonth}</caption>
          <thead><tr><th scope="col">{copy.country}</th><th scope="col">{copy.annual}<small>{copy.yearAgo}</small></th><th scope="col">{copy.monthly}<small>{copy.monthAgo}</small></th><th scope="col">{copy.difference}<small>{copy.ppLong}</small></th></tr></thead>
          <tbody>{ranking.map(row => {
            const change = observation(snapshot, row.code, month, "monthly");
            const gap = row.value !== null && euro.value !== null ? row.value - euro.value : null;
            return <tr key={row.code} data-selected={row.code === code ? "true" : undefined}>
              <th scope="row"><button type="button" className={styles.countryButton} onClick={() => selectFromRanking(row.code)} aria-label={`${copy.viewCountry}: ${countryName(row.code, lang)}`} aria-pressed={row.code === code}><span className={styles.countryCode}>{row.code}</span>{countryName(row.code, lang)}</button></th>
              <td><span className={styles.rateCell}><i style={{ background: inflationColor(row.value) }} aria-hidden="true" /><Observation point={row} lang={lang} statusLabels={snapshot.statusLabels} /></span></td>
              <td><Observation point={change} lang={lang} statusLabels={snapshot.statusLabels} /></td><td>{formatPoints(gap, lang)}</td>
            </tr>;
          })}</tbody>
        </table>
      </div>
      <div className={styles.mobileRanking}>
        <p className={styles.note}>{formatMonth(month, lang)} · {copy.annual} · {copy.sameMonth}</p>
        <ul>{ranking.map(row => <li key={row.code} data-selected={row.code === code ? "true" : undefined}>
          <details><summary><span>{countryName(row.code, lang)}</span><span className={styles.rateCell}><i style={{ background: inflationColor(row.value) }} aria-hidden="true" /><Observation point={row} lang={lang} statusLabels={snapshot.statusLabels} /></span><span className={styles.expandLabel}>{copy.details} <span aria-hidden="true">⌄</span></span></summary>
            <div className={styles.mobileDetails}><dl className={styles.facts}>
              <div><dt>{copy.monthly}<small>{copy.monthAgo}</small></dt><dd><Observation point={observation(snapshot, row.code, month, "monthly")} lang={lang} statusLabels={snapshot.statusLabels} /></dd></div>
              <div><dt>{copy.difference}<small>{copy.ppLong}</small></dt><dd>{formatPoints(row.value !== null && euro.value !== null ? row.value - euro.value : null, lang)}</dd></div>
            </dl><button className={styles.actionButton} type="button" onClick={() => selectFromRanking(row.code)} aria-label={`${copy.viewTrend}: ${countryName(row.code, lang)}`}>{copy.viewTrend} ↑</button></div>
          </details>
        </li>)}</ul>
      </div>
      <p className={styles.note}>{copy.missing}</p>
    </section>
  </div>;
}
