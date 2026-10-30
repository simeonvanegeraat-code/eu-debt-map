import Link from "next/link";
import snapshot from "@/lib/fiscal/growth.gen.json";
import { fiveYearOverview } from "@/lib/fiscal/growth";
import { countryName } from "@/lib/countries";
import { countries as liveCountries, debtDataSummary, livePerSecondFor } from "@/lib/data";
import { generateEUDebtArticleSchema } from "@/components/LocalizedEUDebtPage";
import InArticleAd from "@/components/InArticleAd";
import DebtTrend from "./DebtTrend";
import EUDebtSectionNav from "./EUDebtSectionNav";
import EUDebtSummary from "./EUDebtSummary";
import { getEUDebtCopy, euDebtText, euDebtAmount, euDebtPercent, euDebtQuarter, euDebtHref } from "./eu-debt-copy";
import styles from "./eu-debt-preview.module.css";

export default function EUDebtPageExperience({ preview = false, lang: requestedLang = "nl" }) {
  const copy = getEUDebtCopy(requestedLang);
  const { lang } = copy;
  const text = euDebtText;
  const amount = (value, scale) => euDebtAmount(value, lang, scale);
  const percentText = (value) => euDebtPercent(value, lang);
  const quarter = (value) => euDebtQuarter(value, lang);
  const href = (path) => euDebtHref(path, lang);
  const overview = fiveYearOverview(snapshot);
  const first = overview.quarters[0];
  const latest = overview.quarters.at(-1);
  const previous = overview.quarters.at(-2);
  const period = quarter(latest.quarter);
  const quarterChange = latest.totalDebtEUR - previous.totalDebtEUR;
  const quarterPercent = quarterChange / previous.totalDebtEUR * 100;
  const change = latest.totalDebtEUR - first.totalDebtEUR;
  const percent = change / first.totalDebtEUR * 100;
  const countries = overview.latestBreakdown.map((row) => ({ ...row, name: countryName(row.code, lang) }));
  const leaders = countries.slice(0, 4);
  const topShare = leaders.reduce((sum, row) => sum + row.sharePct, 0);
  const rest = countries.slice(7);
  const bars = [...countries.slice(0, 7), {
    code: "REST", name: text(copy.distribution.rest, { count: rest.length }),
    valueEUR: rest.reduce((sum, row) => sum + row.valueEUR, 0),
    sharePct: rest.reduce((sum, row) => sum + row.sharePct, 0),
  }];
  const updated = new Intl.DateTimeFormat(copy.locale, { dateStyle: "long", timeZone: "Europe/Amsterdam" }).format(new Date(snapshot.fetchedAt));
  const commonPeriod = debtDataSummary.dominantLatestTime;
  const tickerCountries = liveCountries.filter((country) => country.official_latest_time === commonPeriod && country.last_value_eur > 0);
  const officialTotal = tickerCountries.reduce((sum, country) => sum + country.last_value_eur, 0);
  const perSecond = tickerCountries.reduce((sum, country) => sum + livePerSecondFor(country), 0);
  if (tickerCountries.length !== 27 || commonPeriod !== latest.quarter || Math.abs(officialTotal - latest.totalDebtEUR) > 1) {
    throw new Error("EU debt overview requires matching, complete official ticker and history totals");
  }
  const growthTitle = percent > 0 ? copy.trend.up : percent < 0 ? copy.trend.down : copy.trend.flat;

  return (
    <div className={styles.page} lang={lang}>
      {!preview ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateEUDebtArticleSchema(lang)) }} /> : null}
      <section className={styles.hero} aria-labelledby="eu-debt-title">
        <div className={styles.container}>
          {preview ? <div className={styles.previewBar}><span><i /> {copy.preview}</span><Link href={href("/eu-debt")}>{copy.current} ↗</Link></div> : null}
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.eyebrow}>{copy.eyebrow}</p>
              <h1 id="eu-debt-title">{copy.title[0]}<br />{copy.title[1]} <span>{copy.title[2]}</span></h1>
              <p className={styles.lede}>{copy.intro}</p>
              <div className={styles.actions}><a href="#trend">{copy.explore} <span aria-hidden="true">↓</span></a><a href="#verdeling">{copy.compare} <span aria-hidden="true">↗</span></a></div>
            </div>
            <EUDebtSummary officialTotal={officialTotal} perSecond={perSecond} period={commonPeriod} lang={lang}>
              <dl>
                <div><dt>{copy.quarterChange}</dt><dd>{quarterChange >= 0 ? "+" : "−"}{amount(Math.abs(quarterChange), "billions")}</dd><span>{quarterPercent >= 0 ? "+" : "−"}{percentText(Math.abs(quarterPercent))} · {quarter(previous.quarter)} → {period}</span></div>
                <div><dt>{copy.fiveYearChange}</dt><dd>{percent >= 0 ? "+" : "−"}{percentText(Math.abs(percent))}</dd><span>{change >= 0 ? "+" : "−"}{amount(Math.abs(change))} · {quarter(first.quarter)} → {period}</span></div>
              </dl>
              <small>{copy.coverage}</small>
            </EUDebtSummary>
          </div>
        </div>
      </section>

      <EUDebtSectionNav lang={lang} />

      <section className={`${styles.container} ${styles.section}`} id="trend" aria-labelledby="trend-title">
        <header className={styles.sectionHeader}><div><p className={styles.eyebrow}>{copy.trend.eyebrow}</p><h2 id="trend-title">{text(growthTitle, { percent: percentText(Math.abs(percent)) })}</h2></div><p>{text(copy.trend.intro, { first: amount(first.totalDebtEUR), last: amount(latest.totalDebtEUR) })}</p></header>
        <DebtTrend rows={overview.quarters} lang={lang} />
        <div className={styles.chartFootnote}><span><i /> {text(copy.trend.footnote, { count: overview.quarters.length })}</span><span>{copy.trend.units}</span></div>
      </section>

      <section className={styles.distribution} id="verdeling" aria-labelledby="distribution-title"><div className={styles.container}>
        <header className={styles.sectionHeader}><div><p className={styles.eyebrow}>{copy.distribution.eyebrow}</p><h2 id="distribution-title">{copy.distribution.title}</h2></div><p>{copy.distribution.intro}</p></header>
        <div className={styles.distributionGrid}>
          <div className={styles.barCard}>
            <div className={styles.cardHeader}><strong>{copy.distribution.cardTitle}</strong><span>{text(copy.distribution.latest, { period })}</span></div>
            <p className={styles.distributionPeriod}>{text(copy.distribution.periodNote, { period })}</p>
            <div className={styles.barHead}><span>{copy.distribution.country}</span><span>{copy.distribution.amountShare}</span></div>
            <ol className={styles.bars}>{bars.map((row) => <li key={row.code}>
              <div className={styles.barLabel}>{row.code === "REST" ? <span>{row.name}</span> : <Link href={href(`/country/${row.code.toLowerCase()}`)}>{row.name} <span aria-hidden="true">↗</span></Link>}<strong>{amount(row.valueEUR, "billions")} <small>{percentText(row.sharePct)}</small></strong></div>
              <div className={styles.track}><i className={row.code === "REST" ? styles.rest : ""} style={{ width: `${row.valueEUR / bars[0].valueEUR * 100}%` }} /></div>
            </li>)}</ol>
            <p className={styles.barNote}>{text(copy.distribution.barNote, { count: rest.length })}</p>
          </div>
          <aside className={styles.insight}>
            <p className={styles.eyebrow}>{text(copy.distribution.insightEyebrow, { period })}</p>
            <strong className={styles.insightNumber}>{percentText(topShare)}</strong><h3>{copy.distribution.insightTitle}</h3>
            <p>{text(copy.distribution.leaders, { countries: new Intl.ListFormat(copy.locale, { type: "conjunction" }).format(leaders.map((row) => row.name)) })}</p>
            <div className={styles.shareStrip} role="img" aria-label={text(copy.distribution.shareAlt, { leaders: percentText(topShare), rest: percentText(100 - topShare) })}><i style={{ width: `${topShare}%` }} /><i className={styles.shareRest} style={{ width: `${100 - topShare}%` }} /></div>
            <div className={styles.shareLegend}><span><i /> {copy.distribution.leadersLabel} <strong>{percentText(topShare)}</strong></span><span><i /> {copy.distribution.othersLabel} <strong>{percentText(100 - topShare)}</strong></span></div>
            <p className={styles.insightNote}>{copy.distribution.insightNote}</p><Link href={href("/debt-to-gdp")}>{copy.distribution.ratioLink} <span aria-hidden="true">→</span></Link>
          </aside>
        </div>
        <details className={styles.dataTable}>
          <summary>{copy.distribution.tableToggle} <span aria-hidden="true">+</span></summary>
          <div><table><caption>{text(copy.distribution.tableCaption, { period })}</caption><thead><tr><th scope="col">{copy.distribution.country}</th><th scope="col">{copy.distribution.debt}</th><th scope="col">{copy.distribution.share}</th></tr></thead>
            <tbody>{countries.map((row) => <tr key={row.code}><th scope="row"><Link href={href(`/country/${row.code.toLowerCase()}`)}>{row.name}</Link></th><td>{amount(row.valueEUR, "billions")}</td><td>{percentText(row.sharePct)}</td></tr>)}</tbody>
            <tfoot><tr><th scope="row">{copy.distribution.total}</th><td>{amount(latest.totalDebtEUR, "billions")}</td><td>{percentText(100)}</td></tr></tfoot>
          </table></div><p className={styles.barNote}>{copy.distribution.rounding}</p>
        </details>
      </div></section>

      <section className={`${styles.container} ${styles.section}`} id="betekenis" aria-labelledby="meaning-title">
        <header className={styles.sectionHeader}><div><p className={styles.eyebrow}>{copy.meaning.eyebrow}</p><h2 id="meaning-title">{copy.meaning.title}</h2></div><p>{copy.meaning.intro}</p></header>
        <div className={styles.contextGrid}>{copy.meaning.cards.map((card, index) => <article key={card.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{card.title}</h3><p>{card.text}</p>{card.path ? <Link href={href(card.path)}>{card.link} →</Link> : null}</article>)}</div>
      </section>

      {!preview ? <div className={styles.container}><InArticleAd /></div> : null}
      <section className={styles.sources} id="bronnen" aria-labelledby="sources-title"><div className={styles.container}>
        <div><p className={styles.eyebrow}>{copy.sources.eyebrow}</p><h2 id="sources-title">{copy.sources.title}</h2><p>{copy.sources.intro}</p><p>{copy.sources.scope} {overview.provisional ? `${copy.sources.flags} ` : ""}{copy.sources.calculation}</p><small>{copy.sources.updated}: {updated}</small></div>
        <div className={styles.sourceLinks}>
          <a href="https://ec.europa.eu/eurostat/cache/metadata/en/gov_10q_ggdebt_esms.htm" target="_blank" rel="noreferrer"><span>{copy.sources.primary}</span><strong>{copy.sources.metadata} ↗</strong></a>
          <Link href={href("/debt-growth#debt-growth-methodology")}><span>{copy.sources.calculations}</span><strong>{copy.sources.growth} →</strong></Link>
          <Link href={href("/methodology")}><span>{copy.sources.site}</span><strong>{copy.sources.method} →</strong></Link>
        </div>
      </div></section>
    </div>
  );
}
