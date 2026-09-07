"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./fiscal.module.css";

// Text projections keep formatting and indicator definitions outside the shared ranking UI.
export default function IndicatorRanking({ id, title, caption, columns, rows, copy, locale }) {
  const [query, setQuery] = useState("");
  const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase(locale);
  const filtered = rows.filter((row) => normalize(`${row.name} ${row.code}`).includes(normalize(query.trim())));
  return <section className={styles.section} aria-labelledby={`${id}-title`}>
    <div className={styles.sectionHeading}><h2 id={`${id}-title`}>{title}</h2><div className={styles.search}>
      <label htmlFor={`${id}-search`}>{copy.search}</label><input type="search" id={`${id}-search`} value={query} onChange={(e) => setQuery(e.target.value)} />
    </div></div>
    <p id={`${id}-note`} className={styles.note}>{copy.rankNote}</p><p className={styles.resultCount} role="status">{copy.shown}: {filtered.length} / {rows.length}</p>
    <div className={styles.tableScroll} tabIndex={0} role="region" aria-labelledby={`${id}-title`}>
      <table className={styles.ranking} aria-describedby={`${id}-note`}><caption>{caption}</caption>
        <thead><tr><th scope="col">{copy.rank}</th><th scope="col">{copy.country}</th>{columns.map((column) => <th scope="col" key={column.key}>{column.label}<small>{column.period}</small></th>)}</tr></thead>
        <tbody>{filtered.map((row) => <tr key={row.code}><td>{row.rank ?? "—"}</td><th scope="row"><Link href={row.href}>{row.name}</Link><small>{row.code}</small></th>{columns.map((column) => <td key={column.key}>{row.cells[column.key].text}<sup>{row.cells[column.key].status}</sup></td>)}</tr>)}</tbody>
      </table>{!filtered.length && <p>{copy.noResults}</p>}
    </div>
  </section>;
}
