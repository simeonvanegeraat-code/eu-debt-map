"use client";

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { debtGuideSeries } from '@/lib/debt-guide-model';
import { SECTION_IDS } from './guide-copy';
import styles from './guide.module.css';

export function GuideNavigation({ copy }) {
  const nav = useRef(null);
  const links = useRef(null);
  const [active, setActive] = useState(null);
  useEffect(() => {
    let frame = 0;
    let disposed = false;
    const sections = SECTION_IDS.map(id => document.getElementById(id));
    function update() {
      frame = 0;
      if (disposed || !nav.current) return;
      const line = nav.current.getBoundingClientRect().bottom + 45;
      setActive(sections.filter(section => section && section.getBoundingClientRect().top <= line).at(-1)?.id || null);
    }
    function schedule() { if (!disposed && !frame) frame = requestAnimationFrame(update); }
    const observer = new ResizeObserver(schedule);
    sections.filter(Boolean).forEach(section => observer.observe(section));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => { disposed = true; observer.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    const scroller = links.current;
    const current = scroller.querySelector('[aria-current="location"]');
    if (!current) return;
    const bounds = current.getBoundingClientRect();
    const visible = scroller.getBoundingClientRect();
    if (bounds.left < visible.left) scroller.scrollLeft -= visible.left - bounds.left + 8;
    else if (bounds.right > visible.right) scroller.scrollLeft += bounds.right - visible.right + 8;
  }, [active]);
  function browse() {
    const node = links.current;
    node.scrollTo({ left: node.scrollLeft + node.clientWidth >= node.scrollWidth - 2 ? 0 : node.scrollLeft + node.clientWidth * .7, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  return <nav ref={nav} className={styles.chapterNav} aria-label={copy.navLabel}><div className={styles.container}><span>{copy.navLabel}</span><div ref={links} id="guide-chapters" className={styles.chapterLinks}>{SECTION_IDS.map((id, index) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>{copy.nav[index]}</a>)}</div><button type="button" onClick={browse} aria-label={copy.browse} aria-controls="guide-chapters">→</button></div></nav>;
}

export function BorrowingSteps({ copy }) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef([]);
  function selectWithKey(event, index) {
    const key = event.key;
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(key)) return;
    event.preventDefault();
    const next = key === 'Home' ? 0 : key === 'End' ? 3 : (index + (key === 'ArrowDown' || key === 'ArrowRight' ? 1 : 3)) % 4;
    setSelected(next);
    tabs.current[next].focus();
  }
  return <div className={styles.mechanism}>
    <div role="tablist" aria-label={copy.mechanism} className={styles.stepList}>{copy.steps.map(([title], index) => <button ref={node => { tabs.current[index] = node; }} type="button" role="tab" id={`borrowing-tab-${index}`} aria-controls={`borrowing-panel-${index}`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} key={title} onClick={() => setSelected(index)} onKeyDown={event => selectWithKey(event, index)}><span aria-hidden="true">0{index + 1}</span>{title}<span aria-hidden="true">↗</span></button>)}</div>
    <div className={styles.stepStage}>
      <div className={styles.moneyDiagram} data-stage={selected} aria-hidden="true"><div className={styles.diagramEntity}><svg viewBox="0 0 40 40"><path d="M5 15 20 6l15 9M8 17h24M11 18v13m9-13v13m9-13v13M6 34h28"/></svg><strong>{copy.government}</strong></div><div className={styles.diagramFlows}><span>{copy.money}<b>←</b></span><span><b>→</b>{copy.bond}</span></div><div className={styles.diagramEntity}><svg viewBox="0 0 40 40"><circle cx="20" cy="12" r="6"/><path d="M8 34v-5a12 12 0 0 1 24 0v5M5 34h30"/></svg><strong>{copy.investors}</strong></div></div>
      {copy.steps.map(([title, text, takeaway], index) => <div role="tabpanel" id={`borrowing-panel-${index}`} aria-labelledby={`borrowing-tab-${index}`} tabIndex={0} hidden={selected !== index} key={title} className={styles.stepPanel}><p className={styles.eyebrow}>{copy.step} 0{index + 1} / 04</p><h3>{title}</h3><p>{text}</p><p className={styles.takeaway}>{takeaway}</p></div>)}
      <div className={styles.stepPaging}><button type="button" onClick={() => setSelected(value => value - 1)} disabled={selected === 0}>← {copy.previous}</button><span aria-hidden="true">{selected + 1} / 4</span><button type="button" onClick={() => setSelected(value => value + 1)} disabled={selected === 3}>{copy.next} →</button></div>
    </div>
    <noscript><ol>{copy.steps.map(([title, text, takeaway]) => <li key={title}><h3>{title}</h3><p>{text}</p><p>{takeaway}</p></li>)}</ol></noscript>
  </div>;
}

export function DebtModel({ copy }) {
  const [opening, setOpening] = useState(800);
  const [deficit, setDeficit] = useState(30);
  const values = debtGuideSeries(opening, deficit);
  const end = values.at(-1);
  const format = value => new Intl.NumberFormat(copy.locale).format(value);
  const amount = value => copy.locale === 'fr-FR' ? `${format(value)} ${copy.unit}` : `€ ${format(value)} ${copy.unit}`;
  return <div className={styles.model}>
    <div className={styles.modelControls}><h3>{copy.modelTitle}</h3><p>{copy.modelIntro}</p><div className={styles.rangeControl}><label htmlFor="guide-opening">{copy.opening}<strong>{amount(opening)}</strong></label><input id="guide-opening" type="range" min="200" max="2000" step="50" value={opening} aria-valuetext={amount(opening)} onChange={event => setOpening(Number(event.target.value))}/></div><div className={styles.rangeControl}><label htmlFor="guide-deficit">{copy.deficit}<strong>{amount(deficit)}</strong></label><input id="guide-deficit" type="range" min="0" max="150" step="5" value={deficit} aria-valuetext={amount(deficit)} onChange={event => setDeficit(Number(event.target.value))}/></div></div>
    <div className={styles.modelResult}><div className={styles.modelTotals} aria-live="polite" aria-atomic="true"><div><span>{copy.after}</span><strong>{amount(end)}</strong></div><div><span>{copy.added}</span><strong>+{amount(end - opening)}</strong></div></div><figure className={styles.modelFigure}><figcaption>{copy.chart}</figcaption><div className={styles.chart} aria-hidden="true">{values.map((value, year) => <div key={year}><span style={{height: `${value / Math.max(end, 1) * 100}%`}}/><small>{year}</small></div>)}</div><details className={styles.chartData}><summary>{copy.year} 0–10</summary><table><thead><tr><th>{copy.year}</th><th>{copy.debt} ({copy.unit})</th></tr></thead><tbody>{values.map((value, year) => <tr key={year}><th scope="row">{year}</th><td>{format(value)}</td></tr>)}</tbody></table></details></figure></div>
    <p className={styles.modelNote}>{copy.modelNote}</p>
  </div>;
}

export function CountryPicker({ copy, countries, prefix }) {
  const [code, setCode] = useState('');
  return <div className={styles.countryPicker}><label htmlFor="guide-country">{copy.select}</label><div><select id="guide-country" value={code} onChange={event => setCode(event.target.value)}><option value="">{copy.select}…</option>{countries.map(country => <option key={country.code} value={country.code.toLowerCase()}>{country.name}</option>)}</select>{code ? <Link className={styles.primaryButton} href={`${prefix}/country/${code}`}>{copy.countryAction} ↗</Link> : <button className={styles.primaryButton} type="button" disabled>{copy.countryAction} ↗</button>}</div><noscript><ul>{countries.map(country => <li key={country.code}><a href={`${prefix}/country/${country.code.toLowerCase()}`}>{country.name}</a></li>)}</ul></noscript></div>;
}
