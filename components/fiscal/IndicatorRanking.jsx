"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./fiscal.module.css";

// Text projections keep formatting and indicator definitions outside the shared ranking UI.
export default function IndicatorRanking({ id, title, caption, columns, rows, copy, locale, mobilePrimaryKey = null }) {
  const [query, setQuery] = useState("");
  const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase(locale);
  const filtered = rows.filter((row) => normalize(`${row.name} ${row.code}`).includes(normalize(query.trim())));
  const mobilePrimary = columns.find((column) => column.key === mobilePrimaryKey);
  const mobileDetails = mobilePrimary ? columns.filter((column) => column.key !== mobilePrimaryKey) : [];
  return <section className={styles.section} aria-labelledby={`${id}-title`}>
    <div className={styles.sectionHeading}><h2 id={`${id}-title`}>{title}</h2><div className={styles.search}>
      <label htmlFor={`${id}-search`}>{copy.search}</label><input type="search" id={`${id}-search`} value={query} onChange={(e) => setQuery(e.target.value)} />
    </div></div>
    <p id={`${id}-note`} className={styles.note}>{copy.rankNote}</p><p className={styles.resultCount} role="status">{copy.shown}: {filtered.length} / {rows.length}</p>
    <div className={`${styles.tableScroll} ${mobilePrimary ? styles.desktopRanking : ""}`} tabIndex={0} role="region" aria-labelledby={`${id}-title`}>
      <table className={styles.ranking} aria-describedby={`${id}-note`}><caption>{caption}</caption>
        <thead><tr><th scope="col">{copy.rank}</th><th scope="col">{copy.country}</th>{columns.map((column) => <th scope="col" key={column.key}>{column.label}<small>{column.period}</small></th>)}</tr></thead>
        <tbody>{filtered.map((row) => <tr key={row.code}><td>{row.rank ?? "—"}</td><th scope="row"><Link href={row.href}>{row.name}</Link><small>{row.code}</small></th>{columns.map((column) => <td key={column.key}>{row.cells[column.key].text}<sup>{row.cells[column.key].status}</sup></td>)}</tr>)}</tbody>
      </table>{!filtered.length && <p>{copy.noResults}</p>}
    </div>
    {mobilePrimary ? <div className={styles.mobileRanking} aria-labelledby={`${id}-title`}>
      <p className={styles.mobileRankCaption}>{caption}</p>
      <ol className={styles.mobileRankList}>
        {filtered.map((row) => <li className={styles.mobileRankItem} key={row.code}>
          <details>
            <summary>
              <span className={styles.mobileRankPosition}>{row.rank ?? "—"}</span>
              <span className={styles.mobileRankCountry}><strong>{row.name}</strong><small>{row.code}</small></span>
              <span className={styles.mobileRankValue}>{row.cells[mobilePrimary.key].text}<sup>{row.cells[mobilePrimary.key].status}</sup></span>
              <span className={styles.mobileRankChevron} aria-hidden="true" />
            </summary>
            <div className={styles.mobileRankDetails}>
              <dl>{mobileDetails.map((column) => <div key={column.key}><dt>{column.label}{column.period ? <small> · {column.period}</small> : null}</dt><dd>{row.cells[column.key].text}<sup>{row.cells[column.key].status}</sup></dd></div>)}</dl>
              <Link className={styles.mobileRankLink} href={row.href}>{copy.countryLink} →</Link>
            </div>
          </details>
        </li>)}
      </ol>
      {!filtered.length && <p>{copy.noResults}</p>}
    </div> : null}
  </section>;
}
