"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { countryName } from "@/lib/countries";
import { fiscalPath } from "@/lib/fiscal/paths";
import { perCapitaBand } from "@/lib/fiscal/per-capita";
import { capitaNumber, getPerCapitaCopy } from "./per-capita-copy";
import styles from "./fiscal.module.css";

const IndicatorMap = dynamic(() => import("./IndicatorMap"), { ssr: false });
const COLORS = { low: "#c7daf8", medium: "#85b1f3", high: "#3478dc", highest: "#123b80", missing: "#d8dee8" };

export default function PerCapitaExplorer({ rows, debtYear, populationYear, lang = "en" }) {
  const copy = getPerCapitaCopy(lang);
  const [code, setCode] = useState("NL");
  const selected = rows.find((row) => row.code === code) || rows[0];
  const named = rows.map((row) => ({ ...row, name: countryName(row.code, lang) })).sort((a, b) => a.name.localeCompare(b.name, copy.locale));
  return <section className={styles.section} aria-labelledby="per-capita-map-title">
    <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>{copy.debtDate} · {debtYear}</p><h2 id="per-capita-map-title">{copy.mapTitle}</h2></div><p>{copy.mapHint}</p></div>
    <div className={styles.mapLayout}><div>
      <div className={styles.mapFrame}><p className={styles.mapFallback}>{copy.loading}</p><IndicatorMap rows={named.map((row) => ({code:row.code,color:COLORS[perCapitaBand(row.displayValue)],label:`${row.name}: ${capitaNumber(row.displayValue,lang)} ${copy.perResident}`}))} selectedCode={selected.code} onSelect={setCode} label={copy.mapAria} /></div>
      <div className={styles.smallCountries}>{["CY","LU","MT"].map((small) => { const row = named.find((item) => item.code === small); return <button type="button" key={small} aria-pressed={selected.code === small} onClick={() => setCode(small)}><i style={{background:COLORS[perCapitaBand(row.displayValue)]}} aria-hidden="true" />{row.name} {capitaNumber(row.displayValue,lang)}</button>; })}</div>
      <ul className={styles.legend}>{Object.entries(COLORS).map(([key,color],index) => <li key={key}><i style={{background:color}} aria-hidden="true" />{copy.bands[index]}</li>)}</ul>
    </div><div className={styles.countryPanel}>
      <label htmlFor="per-capita-country">{copy.select}</label><select id="per-capita-country" value={selected.code} onChange={(e) => setCode(e.target.value)}>{named.map((row) => <option key={row.code} value={row.code}>{row.name}</option>)}</select>
      <div aria-live="polite" aria-atomic="true"><p className={styles.panelYear}>{countryName(selected.code,lang)}</p><p className={styles.bigValue} style={{fontSize:"clamp(30px, 3.4vw, 48px)"}}>{capitaNumber(selected.displayValue,lang)}<sup>{selected.status}</sup></p><p>{copy.perResident}</p>
      <dl className={styles.panelFacts}><div><dt>{copy.debt} · {debtYear}</dt><dd>{capitaNumber(selected.debtEur,lang)}<sup>{selected.debtStatus}</sup></dd></div><div><dt>{copy.ratio} · {debtYear}</dt><dd>{capitaNumber(selected.debtRatio,lang,"percent")}<sup>{selected.ratioStatus}</sup></dd></div><div><dt>{copy.populationDate} {populationYear}</dt><dd>{capitaNumber(selected.population,lang,"number")}<sup>{selected.populationStatus}</sup></dd></div><div><dt>{copy.rank}</dt><dd>{selected.rank} / 27</dd></div></dl></div>
      <Link className={styles.textLink} href={fiscalPath(`/country/${selected.code.toLowerCase()}`,lang)}>{copy.countryLink} →</Link>
      <p className={styles.note}>{copy.flags}</p>
    </div></div>
  </section>;
}
