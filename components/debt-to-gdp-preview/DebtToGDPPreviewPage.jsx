"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { countries, estimatedLiveDebtToGDPRatio, interpolateDebt, officialDebtToGDPRatio } from "@/lib/data";
import { countryName } from "@/lib/countries";
import { editorialDisplay } from "@/lib/editorial-font";
import { getDebtToGDPCopy, SITE } from "./debt-to-gdp-copy";
import styles from "./debt-to-gdp-preview.module.css";

const SCALE_MAX = 160;
const EUROSTAT_RELEASE = "https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-21072026-ap";
const EUROSTAT_METHOD = "https://ec.europa.eu/eurostat/cache/metadata/en/gov_10q_ggdebt_esms.htm";

function formatPeriod(period, lang) {
  const match = /^(\d{4})-?Q([1-4])$/i.exec(String(period || "").trim());
  if (!match) return period || "";
  return lang === "fr" ? `T${match[2]} ${match[1]}` : `${match[1]} Q${match[2]}`;
}

function formatRatio(value, locale) {
  return Number.isFinite(value) ? `${value.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%` : "—";
}

function formatDebt(value, locale, compact = true) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", notation: compact ? "compact" : "standard", maximumFractionDigits: compact ? 2 : 0 }).format(value);
}

function bandFor(ratio) {
  if (!Number.isFinite(ratio)) return "unknown";
  if (ratio < 60) return "below";
  if (ratio <= 90) return "reference";
  return "high";
}

function ArrowIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 7l5 5-5 5" /></svg>; }

export default function DebtToGDPPreviewPage({ lang = "en", preview = false }) {
  const copy = getDebtToGDPCopy(lang);
  const [mode, setMode] = useState("official");
  const [order, setOrder] = useState("desc");
  const [query, setQuery] = useState("");
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (mode !== "live") return undefined;
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [mode]);

  const officialRows = useMemo(() => countries.map((country) => ({ country, ratio: officialDebtToGDPRatio(country), debt: Number(country.last_value_eur) })).filter((row) => Number.isFinite(row.ratio)).sort((a, b) => b.ratio - a.ratio), []);
  const rows = useMemo(() => {
    const ranked = officialRows.map(({ country }) => {
      const officialRatio = officialDebtToGDPRatio(country);
      const liveRatio = estimatedLiveDebtToGDPRatio(country, nowMs);
      return { country, ratio: mode === "live" && Number.isFinite(liveRatio) ? liveRatio : officialRatio, debt: mode === "live" ? interpolateDebt(country, nowMs) : Number(country.last_value_eur) };
    }).sort((a, b) => order === "desc" ? b.ratio - a.ratio : a.ratio - b.ratio).map((row, index) => ({ ...row, rank: index + 1 }));
    const normalizedQuery = query.trim().toLocaleLowerCase(copy.locale);
    return normalizedQuery ? ranked.filter(({ country }) => countryName(country.code, lang).toLocaleLowerCase(copy.locale).includes(normalizedQuery) || country.code.toLowerCase().includes(normalizedQuery)) : ranked;
  }, [copy.locale, lang, mode, nowMs, officialRows, order, query]);

  const period = formatPeriod(officialRows[0]?.country.official_debt_to_gdp_time, lang);
  const highest = officialRows[0];
  const lowest = officialRows.at(-1);
  const counts = officialRows.reduce((result, row) => { result[bandFor(row.ratio)] += 1; return result; }, { below: 0, reference: 0, high: 0, unknown: 0 });
  const countryHref = (code) => `${copy.base}/country/${code.toLowerCase()}`;
  const webPageLd = { "@context": "https://schema.org", "@type": "WebPage", name: copy.meta.title.split(" | ")[0], description: copy.meta.description, url: `${SITE}${copy.path}`, inLanguage: copy.inLanguage, dateModified: "2026-08-30", isAccessibleForFree: true };
  const breadcrumbsLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: lang === "fr" ? "Accueil" : lang === "de" ? "Start" : "Home", item: `${SITE}${copy.base}` }, { "@type": "ListItem", position: 2, name: copy.navTitle, item: `${SITE}${copy.path}` }] };
  const navHrefs = ["#ranking", "#meaning", "#reference", "#method"];

  return (
    <div className={`${styles.page} ${editorialDisplay.variable}`}>
      {!preview ? <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} /></> : null}
      <section className={styles.hero} aria-labelledby="debt-ratio-title">
        <div className={styles.heroInner}>
          {preview ? <div className={styles.previewBar}><span>Debt-to-GDP design study · isolated preview</span><Link href="/debt-to-gdp">View current page</Link></div> : null}
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}><p className={styles.eyebrow}>{copy.hero.eyebrow}</p><h1 id="debt-ratio-title">{copy.hero.title}</h1><p className={styles.lede}>{copy.hero.lede(period)}</p><div className={styles.heroActions}><a href="#ranking">{copy.hero.action} <ArrowIcon /></a><span>{copy.hero.actionNote}</span></div></div>
            <aside className={styles.heroPanel} aria-label={copy.hero.panel}><p>{copy.hero.panel}</p><div className={styles.heroLeader}><span>{copy.hero.highest}</span><strong>{countryName(highest?.country.code, lang)}</strong><b>{formatRatio(highest?.ratio, copy.locale)}</b></div><dl className={styles.heroStats}><div><dt>{copy.hero.lowest}</dt><dd>{countryName(lowest?.country.code, lang)} · {formatRatio(lowest?.ratio, copy.locale)}</dd></div><div><dt>{copy.hero.above}</dt><dd>{counts.high} {copy.hero.countries}</dd></div><div><dt>{copy.hero.below}</dt><dd>{counts.below} {copy.hero.countries}</dd></div><div><dt>{copy.hero.period}</dt><dd>{period}</dd></div></dl><small>{copy.hero.source}</small></aside>
          </div>
        </div>
      </section>

      <nav className={styles.chapterNav} aria-label={copy.navTitle}><div><span>{copy.navTitle}</span>{copy.nav.map((label, index) => <a href={navHrefs[index]} key={label}>{label}</a>)}</div></nav>

      <section className={styles.rankingSection} aria-labelledby="ranking-title">
        <header className={`${styles.sectionHeader} ${styles.anchorTarget}`} id="ranking"><div><p className={styles.eyebrow}>{copy.ranking.eyebrow}</p><h2 id="ranking-title">{copy.ranking.title}</h2></div><p>{copy.ranking.intro(countryName(highest?.country.code, lang), countryName(lowest?.country.code, lang), period)}</p></header>
        <div className={styles.rankingShell}>
          <div className={styles.rankingToolbar}><div className={styles.modeSwitch} role="group" aria-label={copy.navTitle}><button type="button" className={mode === "official" ? styles.activeButton : ""} aria-pressed={mode === "official"} onClick={() => setMode("official")}>{copy.ranking.official(period)}</button><button type="button" className={mode === "live" ? styles.activeButton : ""} aria-pressed={mode === "live"} onClick={() => setMode("live")}>{copy.ranking.live}</button></div><label className={styles.searchField}><span>{copy.ranking.find}</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.ranking.placeholder} /></label><button className={styles.sortButton} type="button" onClick={() => setOrder((value) => value === "desc" ? "asc" : "desc")}>{order === "desc" ? copy.ranking.highestFirst : copy.ranking.lowestFirst}</button></div>
          <div className={styles.rankingNote}><strong>{mode === "official" ? copy.ranking.officialLabel : copy.ranking.liveLabel}</strong><span>{mode === "official" ? copy.ranking.officialNote(period) : copy.ranking.liveNote}</span></div>
          <div className={styles.scale} aria-hidden="true"><span>{copy.ranking.scaleStart}</span><b>{copy.ranking.reference}</b><span>{copy.ranking.scaleEnd}</span></div>
          <ol className={styles.rankingList} aria-label={copy.ranking.title}>{rows.map(({ country, ratio, debt, rank }) => { const name = countryName(country.code, lang); const band = bandFor(ratio); const fill = Math.max(0, Math.min(100, (ratio / SCALE_MAX) * 100)); return <li className={styles.rankingRow} data-band={band} key={country.code}><span className={styles.rank}>#{rank}</span><div className={styles.countryCell}><span className={styles.countryCode} aria-hidden="true">{country.code}</span><div><Link href={countryHref(country.code)}>{name}</Link><small>{copy.ranking.debt} {formatDebt(debt, copy.locale)}</small></div></div><div className={styles.ratioTrack} aria-label={`${name}: ${formatRatio(ratio, copy.locale)}`}><i style={{ width: `${fill}%` }} /><span aria-hidden="true" /></div><strong className={styles.ratioValue}>{formatRatio(ratio, copy.locale)}</strong><Link className={styles.rowLink} href={countryHref(country.code)}>{copy.ranking.open} <ArrowIcon /></Link></li>; })}</ol>
          {rows.length === 0 ? <p className={styles.emptyState}>{copy.ranking.noResult} “{query}”.</p> : null}
          <footer className={styles.rankingFooter}><div><i className={styles.legendBelow} />{copy.ranking.below}<i className={styles.legendReference} />{copy.ranking.middle}<i className={styles.legendHigh} />{copy.ranking.above}</div><p>{copy.ranking.scaleNote}</p></footer>
        </div>
      </section>

      <section className={styles.meaningSection} aria-labelledby="meaning-title"><div className={`${styles.meaningIntro} ${styles.anchorTarget}`} id="meaning"><p className={styles.eyebrow}>{copy.meaning.eyebrow}</p><h2 id="meaning-title">{copy.meaning.title}</h2><p>{copy.meaning.intro}</p></div><div className={styles.formulaCard}><span>{copy.meaning.debt}</span><i aria-hidden="true" /><span>{copy.meaning.gdp}</span><strong>{copy.meaning.formula}</strong><small>{copy.meaning.formulaNote}</small></div><div className={styles.meaningGrid}>{copy.meaning.cards.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className={styles.referenceSection} id="reference" aria-labelledby="reference-title"><div className={styles.referenceCopy}><p className={styles.eyebrow}>{copy.reference.eyebrow}</p><h2 id="reference-title">{copy.reference.title}</h2><p>{copy.reference.text}</p><Link href={`${copy.base}/stability-and-growth-pact`}>{copy.reference.link} <ArrowIcon /></Link></div><dl className={styles.referenceStats}>{[[copy.ranking.below, counts.below], [copy.ranking.middle, counts.reference], [copy.ranking.above, counts.high]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd><small>{copy.reference.countrySuffix(period)}</small></div>)}</dl></section>

      <section className={styles.methodSection} aria-labelledby="method-title"><header className={styles.anchorTarget} id="method"><p className={styles.eyebrow}>{copy.method.eyebrow}</p><h2 id="method-title">{copy.method.title}</h2><p>{copy.method.text}</p></header><div className={styles.methodLinks}><a href={EUROSTAT_RELEASE} target="_blank" rel="noreferrer"><span>{copy.method.primary}</span><strong>{copy.method.release(period)}</strong><ArrowIcon /></a><a href={EUROSTAT_METHOD} target="_blank" rel="noreferrer"><span>{copy.method.definition}</span><strong>{copy.method.metadata}</strong><ArrowIcon /></a><Link href={`${copy.base}/methodology`}><span>{copy.method.site}</span><strong>{copy.method.methodology}</strong><ArrowIcon /></Link></div></section>
    </div>
  );
}
