import Link from "next/link";
import growth from "@/lib/fiscal/growth.gen.json";
import balance from "@/lib/fiscal/balance.gen.json";
import interest from "@/lib/fiscal/interest.gen.json";
import accounts from "@/lib/fiscal/accounts.gen.json";
import perCapita from "@/lib/fiscal/per-capita.gen.json";
import { countryDashboard } from "@/lib/fiscal/country-dashboard";
import { countryName } from "@/lib/countries";
import { fiscalPath } from "@/lib/fiscal/paths";
import { METRIC_ROUTES } from "@/lib/fiscal/discovery";
import { getDiscoveryCopy } from "@/components/fiscal/discovery-copy";
import CountryBalance from "@/components/fiscal/CountryBalance";
import CountryPerCapita from "@/components/fiscal/CountryPerCapita";
import CountryGrowth from "@/components/fiscal/CountryGrowth";
import CountryInterest from "@/components/fiscal/CountryInterest";
import CountryAccounts from "@/components/fiscal/CountryAccounts";
import AccountSourceDifference from "@/components/fiscal/AccountSourceDifference";
import { accountNumber, accountDate, getAccountsCopy } from "@/components/fiscal/accounts-copy";
import { growthQuarter } from "@/components/fiscal/growth-copy";
import { getCountryFiscalCopy } from "./country-fiscal-copy";
import styles from "./country-fiscal.module.css";

function periodLabel(period, lang) {
  return period.includes("Q") ? growthQuarter(period, lang) : period.length === 10 ? accountDate(period, lang) : period;
}
function Value({ point, lang, type = "percent", signed = false }) {
  return <>{accountNumber(point?.value, lang, type, signed)}<sup>{point?.status || ""}</sup></>;
}
function Source({ source, lang, copy, label }) {
  return <Link href={fiscalPath(`/methodology#${source.method}`, lang)} aria-label={`${copy.source}: ${label}`} title={`${source.dataset} · ${copy.accessed}: ${accountDate(source.accessed, lang)}`}>{copy.source} ↗</Link>;
}

function Overview({ data, lang }) {
  const copy = getCountryFiscalCopy(lang), number = (value, type = "pp", signed = true) => accountNumber(value, lang, type, signed);
  const { ratioChange, debtChange, balanceChange, interestChange, debtRanks } = data;
  const discovery = getDiscoveryCopy(lang), balance = data.metrics.find(metric => metric.key === "balance");
  return <div className={styles.overview}>
    <p id="snapshot" className={styles.eyebrow}>{copy.overviewLabel}</p>
    <h2 id="country-fiscal-title">{copy.overview}</h2>
    <p className={styles.lede}>{copy.overviewNote}</p>
    <dl className={styles.metrics}>{data.metrics.map(metric => <div key={metric.key} data-fiscal-metric={metric.key} className={metric.key === "debt" ? styles.primaryMetric : undefined}>
      <dt><Link href={fiscalPath(METRIC_ROUTES[metric.key], lang)} prefetch={false}>{copy.labels[metric.key]}</Link></dt>
      <dd><Value point={metric} lang={lang} type={metric.type} signed={metric.key === "balance"} /></dd>
      {metric.secondary && <p className={styles.secondaryValue}><Value point={metric.secondary} lang={lang} type={metric.key === "interest" ? "percent" : "compact"} />{metric.key === "interest" ? ` · ${{ en: "GDP", nl: "bbp", de: "BIP", fr: "PIB" }[lang]}` : ""}</p>}
      <p className={styles.period}>{metric.calculated ? copy.calculated : copy.official} · <time>{periodLabel(metric.period, lang)}</time></p>
      <Source source={metric.source} lang={lang} copy={copy} label={copy.labels[metric.key]} />
    </div>)}</dl>
    <p className={styles.note}>{copy.capitaNote}</p>
    <AccountSourceDifference comparison={data.sourceDifference} lang={lang} />
    <section className={styles.interpretation} aria-labelledby="country-insights-title">
      <h3 id="country-insights-title">{copy.interpretation}</h3>
      <ul>
        {ratioChange.change !== null && <li>{copy.ratioInsight(number(ratioChange.change), periodLabel(ratioChange.start, lang), periodLabel(ratioChange.end, lang))}<sup>{ratioChange.status}</sup></li>}
        {debtRanks.rank !== null && <li>{copy.rankInsight(debtRanks.rank, debtRanks.count, periodLabel(data.metrics[1].period, lang))}<sup>{data.metrics[1].status}</sup></li>}
        {balanceChange.change !== null && <li>{balanceChange.change === 0 ? copy.balanceUnchanged(balanceChange.startYear, balanceChange.endYear) : copy.balanceInsight(number(Math.abs(balanceChange.change), "pp", false), balanceChange.change, balanceChange.startYear, balanceChange.endYear)}<sup>{balanceChange.status}</sup></li>}
        {interestChange.percent !== null && <li>{copy.interestInsight(number(interestChange.percent, "percent"), interestChange.startYear, interestChange.endYear)}<sup>{interestChange.status}</sup></li>}
      </ul>
      {debtChange.change > 0 && ratioChange.change < 0 && <p className={styles.callout}>{copy.divergence}<sup>{[...new Set(`${debtChange.status}${ratioChange.status}`)].join("")}</sup></p>}
      <p className={styles.note}>{copy.insightNote}</p>
      {Number.isFinite(balance?.value) && <p data-country-balance-link>
        {discovery.countryBalance(countryName(data.code, lang), accountNumber(balance.value, lang, "percent", true), balance.period)}<sup>{balance.status}</sup>{" "}
        <Link href={fiscalPath("/deficit", lang)} prefetch={false}>{discovery.balanceLink} →</Link>
      </p>}
    </section>
    <details className={styles.details}><summary>{copy.capitaDetails}</summary><CountryPerCapita code={data.code} lang={lang} /></details>
  </div>;
}

function Trends({ code, lang }) {
  const copy = getCountryFiscalCopy(lang);
  return <div className={styles.trends} id="movement">
    <CountryGrowth code={code} lang={lang} showHistory />
    <CountryBalance code={code} lang={lang} />
    <CountryInterest code={code} lang={lang} showHistory />
    <details className={styles.details}><summary>{copy.fiscalDetails}</summary><CountryAccounts code={code} lang={lang} /></details>
  </div>;
}

function Comparisons({ data, lang }) {
  const copy = getCountryFiscalCopy(lang), name = countryName(data.code, lang);
  return <section className={styles.comparisons} aria-labelledby="country-comparison-title">
    <p id="context" className={styles.eyebrow}>{copy.comparisonLabel}</p>
    <h2 id="country-comparison-title">{copy.comparison}</h2>
    <p className={styles.lede}>{copy.comparisonNote}</p>
    <p className={styles.note}>{getAccountsCopy(lang).scrollHint}</p>
    <div className={styles.tableScroll} tabIndex={0} role="region" aria-labelledby="country-comparison-title">
      <table data-fiscal-comparison="eu"><caption>{name} · {copy.eu}</caption><thead><tr><th scope="col">{copy.metric}</th><th scope="col">{name}</th><th scope="col">{copy.eu}</th><th scope="col">{copy.gap}</th><th scope="col">{copy.rank}</th></tr></thead>
        <tbody>{data.comparisons.map(row => <tr key={row.key}><th scope="row">{copy.labels[row.key]}<small>{row.period} · <Source source={row.source} lang={lang} copy={copy} label={copy.labels[row.key]} /></small></th><td><Value point={row.current} lang={lang} signed={row.key === "balance"} /></td><td><Value point={row.eu} lang={lang} signed={row.key === "balance"} />{row.calculated && <small>{copy.calculated}</small>}</td><td><Value point={{ value: row.gap, status: row.status }} lang={lang} type="pp" signed /></td><td>{row.rank === null ? "—" : `${row.rank} / ${row.count}`}</td></tr>)}</tbody>
      </table>
    </div>
    <p className={styles.note}>{copy.aggregateNote}</p><p className={styles.note}>{copy.rankNote}</p>
    <h3 id="compare">{copy.peers}</h3><p>{copy.peersNote}</p>
    <div className={styles.tableScroll} tabIndex={0} role="region" aria-labelledby="compare"><table data-fiscal-comparison="peers"><caption>{copy.peers}</caption><thead><tr><th scope="col">{copy.country}</th>{data.comparisons.map(row => <th scope="col" key={row.key}>{copy.labels[row.key]}<small>{row.period}</small></th>)}</tr></thead>
      <tbody>{data.peers.map(row => <tr key={row.code} className={row.code === data.code ? styles.currentRow : undefined}><th scope="row">{row.code === data.code ? <span aria-current="true">{countryName(row.code, lang)}</span> : <Link href={fiscalPath(`/country/${row.code.toLowerCase()}`, lang)}>{countryName(row.code, lang)}</Link>}</th>{row.values.map((value, i) => <td key={data.comparisons[i].key}><Value point={value} lang={lang} signed={data.comparisons[i].key === "balance"} /></td>)}</tr>)}</tbody>
    </table></div>
    <p className={styles.note}>{getAccountsCopy(lang).flags}</p>
    <nav className={styles.links} aria-label={copy.more}>{[["/debt-to-gdp", "debtRatio"], ["/deficit", "balance"], ["/interest-cost", "interest"], ["/government-spending", "expenditure"]].map(([href, key]) => <Link href={fiscalPath(href, lang)} key={href}>{copy.labels[key]} →</Link>)}</nav>
  </section>;
}

// Compose on the server; only rendered slots cross the existing client boundary.
export function createCountryFiscalSlots(code, lang = "en") {
  const data = countryDashboard(code, { growth, balance, interest, accounts, perCapita });
  return { overview: <Overview data={data} lang={lang} />, trends: <Trends code={code} lang={lang} />, comparisons: <Comparisons data={data} lang={lang} /> };
}
