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
import styles from "./eu-debt-preview.module.css";

const number = (value, digits = 1) => new Intl.NumberFormat("nl-NL", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
const trillions = (value) => `€ ${number(value / 1e12, 2)} bln.`;
const billions = (value) => `€ ${number(value / 1e9, 0)} mld.`;

export default function EUDebtPageExperience({ preview = false }) {
  const overview = fiveYearOverview(snapshot);
  const first = overview.quarters[0];
  const latest = overview.quarters.at(-1);
  const previous = overview.quarters.at(-2);
  const quarterChange = latest.totalDebtEUR - previous.totalDebtEUR;
  const quarterPercent = quarterChange / previous.totalDebtEUR * 100;
  const change = latest.totalDebtEUR - first.totalDebtEUR;
  const percent = change / first.totalDebtEUR * 100;
  const countries = overview.latestBreakdown.map((row) => ({ ...row, name: countryName(row.code, "nl") }));
  const leaders = countries.slice(0, 4);
  const topShare = leaders.reduce((sum, row) => sum + row.sharePct, 0);
  const rest = countries.slice(7);
  const bars = [...countries.slice(0, 7), { code: "REST", name: "Overige 20 EU-landen", valueEUR: rest.reduce((sum, row) => sum + row.valueEUR, 0), sharePct: rest.reduce((sum, row) => sum + row.sharePct, 0) }];
  const updated = new Intl.DateTimeFormat("nl-NL", { dateStyle: "long", timeZone: "Europe/Amsterdam" }).format(new Date(snapshot.fetchedAt));
  const commonPeriod = debtDataSummary.dominantLatestTime;
  const tickerCountries = liveCountries.filter((country) => country.official_latest_time === commonPeriod && country.last_value_eur > 0);
  const officialTotal = tickerCountries.reduce((sum, country) => sum + country.last_value_eur, 0);
  const perSecond = tickerCountries.reduce((sum, country) => sum + livePerSecondFor(country), 0);
  if (tickerCountries.length !== 27 || commonPeriod !== latest.quarter || Math.abs(officialTotal - latest.totalDebtEUR) > 1) {
    throw new Error("EU debt preview requires matching, complete official ticker and history totals");
  }

  return (
    <div className={styles.page} lang="nl">
      {!preview ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateEUDebtArticleSchema("nl")) }} /> : null}
      <section className={styles.hero} aria-labelledby="eu-debt-title">
        <div className={styles.container}>
          {preview ? <div className={styles.previewBar}><span><i /> Ontwerpvoorbeeld · Nederlands</span><Link href="/nl/eu-debt">Huidige pagina bekijken ↗</Link></div> : null}
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.eyebrow}>EU-27 · Overheidsschuld in perspectief</p>
              <h1 id="eu-debt-title">De staatsschuld<br />van de <span>EU-landen.</span></h1>
              <p className={styles.lede}>De overheidsschuld van 27 landen opgeteld. Bekijk de ontwikkeling over vijf jaar en het aandeel van ieder land.</p>
              <div className={styles.actions}><a href="#trend">Bekijk de schuldtrend <span aria-hidden="true">↓</span></a><a href="#verdeling">Vergelijk de landen <span aria-hidden="true">↗</span></a></div>
            </div>
            <EUDebtSummary officialTotal={officialTotal} perSecond={perSecond} period={commonPeriod}>
              <dl>
                <div><dt>Sinds vorig kwartaal</dt><dd>{quarterChange >= 0 ? "+" : "−"}{billions(Math.abs(quarterChange))}</dd><span>{quarterPercent >= 0 ? "+" : "−"}{number(Math.abs(quarterPercent))}% · {previous.quarter} → {latest.quarter}</span></div>
                <div><dt>Verandering in 5 jaar</dt><dd>{percent >= 0 ? "+" : "−"}{number(Math.abs(percent))}%</dd><span>{change >= 0 ? "+" : "−"}{trillions(Math.abs(change))} · {first.quarter} → {latest.quarter}</span></div>
              </dl>
              <small>Eurostat · 27 van 27 landen · dezelfde verslagperiode</small>
            </EUDebtSummary>
          </div>
        </div>
      </section>

      <EUDebtSectionNav />

      <section className={`${styles.container} ${styles.section}`} id="trend" aria-labelledby="trend-title">
        <header className={styles.sectionHeader}><div><p className={styles.eyebrow}>01 — Vijf jaar in beeld</p><h2 id="trend-title">{number(Math.abs(percent))}% {percent < 0 ? "minder" : "meer"} overheidsschuld in vijf jaar.</h2></div><p>Van {trillions(first.totalDebtEUR)} naar {trillions(latest.totalDebtEUR)} De vergelijking gebruikt nominale euro’s, zonder correctie voor inflatie of economische groei.</p></header>
        <DebtTrend rows={overview.quarters} />
        <div className={styles.chartFootnote}><span><i /> Dezelfde 27 landen · {overview.quarters.length} kwartaalwaarnemingen</span><span>Eenheden: 1 biljoen (bln.) = 1.000 miljard (mld.).</span></div>
      </section>

      <section className={styles.distribution} id="verdeling" aria-labelledby="distribution-title"><div className={styles.container}>
        <header className={styles.sectionHeader}><div><p className={styles.eyebrow}>02 — De verdeling</p><h2 id="distribution-title">Waar zit de schuld?</h2></div><p>Grote economieën wegen zwaar in het totaal. Dit is een vergelijking van bedragen; voor de relatieve schuldenlast gebruik je de schuldquote.</p></header>
        <div className={styles.distributionGrid}>
          <div className={styles.barCard}><div className={styles.cardHeader}><strong>Overheidsschuld per land</strong><span>Nieuwste kwartaal · {latest.quarter}</span></div><p className={styles.distributionPeriod}>Deze verdeling toont altijd {latest.quarter}, onafhankelijk van je selectie in de trendgrafiek.</p><div className={styles.barHead}><span>Land</span><span>Bedrag / aandeel EU-27</span></div><ol className={styles.bars}>{bars.map((row) => <li key={row.code}><div className={styles.barLabel}>{row.code === "REST" ? <span>{row.name}</span> : <Link href={`/nl/country/${row.code.toLowerCase()}`}>{row.name} <span aria-hidden="true">↗</span></Link>}<strong>{billions(row.valueEUR)} <small>{number(row.sharePct)}%</small></strong></div><div className={styles.track}><i className={row.code === "REST" ? styles.rest : ""} style={{ width: `${row.valueEUR / bars[0].valueEUR * 100}%` }} /></div></li>)}</ol><p className={styles.barNote}>Bedragen in miljard euro, afgerond op hele miljarden. Alle balken gebruiken dezelfde schaal vanaf nul. De overige 20 landen zijn samengevoegd.</p></div>
          <aside className={styles.insight}><p className={styles.eyebrow}>Het totaal in perspectief · {latest.quarter}</p><strong className={styles.insightNumber}>{number(topShare)}%</strong><h3>van de opgetelde schuld zit bij vier landen.</h3><p>{new Intl.ListFormat("nl-NL", { type: "conjunction" }).format(leaders.map((row) => row.name))} hebben samen het grootste aandeel in het absolute bedrag.</p><div className={styles.shareStrip} role="img" aria-label={`Vier grootste landen: ${number(topShare)} procent. Overige 23 landen: ${number(100 - topShare)} procent.`}><i style={{ width: `${topShare}%` }} /><i className={styles.shareRest} style={{ width: `${100 - topShare}%` }} /></div><div className={styles.shareLegend}><span><i /> Vier grootste landen <strong>{number(topShare)}%</strong></span><span><i /> Overige 23 landen <strong>{number(100 - topShare)}%</strong></span></div><p className={styles.insightNote}>Een groot aandeel betekent niet automatisch een hogere schuld ten opzichte van de economie.</p><Link href="/nl/debt-to-gdp">Vergelijk de schuldquotes <span aria-hidden="true">→</span></Link></aside>
        </div>
        <details className={styles.dataTable}><summary>Bekijk de bedragen van alle 27 landen <span aria-hidden="true">+</span></summary><div><table><caption>Nieuwste kwartaal: {latest.quarter} · bedragen afgerond op hele miljarden; aandelen op één decimaal</caption><thead><tr><th scope="col">Land</th><th scope="col">Schuld (mld.)</th><th scope="col">Aandeel</th></tr></thead><tbody>{countries.map((row) => <tr key={row.code}><th scope="row"><Link href={`/nl/country/${row.code.toLowerCase()}`}>{row.name}</Link></th><td>{billions(row.valueEUR)}</td><td>{number(row.sharePct)}%</td></tr>)}</tbody><tfoot><tr><th scope="row">Totaal EU-27</th><td>{billions(latest.totalDebtEUR)}</td><td>100,0%</td></tr></tfoot></table></div><p className={styles.barNote}>Het totaal en de aandelen zijn berekend met onafgeronde bronwaarden. Afgeronde bedragen of percentages tellen daardoor niet altijd precies op.</p></details>
      </div></section>

      <section className={`${styles.container} ${styles.section}`} id="betekenis" aria-labelledby="meaning-title"><header className={styles.sectionHeader}><div><p className={styles.eyebrow}>03 — Lees de cijfers goed</p><h2 id="meaning-title">Eén totaal. Verschillende verhalen.</h2></div><p>Het bedrag toont de omvang. De economische betekenis vraagt om meer context.</p></header><div className={styles.contextGrid}><article><span>01</span><h3>Een som van landen</h3><p>Deze cijfers tellen nationale overheidsschulden op. Het is geen schuld waarvoor één gezamenlijke schatkist verantwoordelijk is, en ook geen overzicht van leningen van de EU-instellingen zelf.</p></article><article><span>02</span><h3>Bedrag en draagkracht</h3><p>Een grote economie kan meer schuld hebben in euro’s en tegelijk een lagere schuldquote. Bekijk daarom ook de verhouding tot het bbp.</p><Link href="/nl/debt-to-gdp">Naar de schuldquotes →</Link></article><article><span>03</span><h3>Waarneming en schatting</h3><p>Deze grafiek toont officiële kwartaalwaarnemingen. De bewegende teller op de homepage trekt de nieuwste trend door en is een gemodelleerde schatting.</p><Link href="/nl">Naar de live schuldenkaart →</Link></article></div></section>

      {!preview ? <div className={styles.container}><InArticleAd /></div> : null}
      <section className={styles.sources} id="bronnen" aria-labelledby="sources-title"><div className={styles.container}><div><p className={styles.eyebrow}>04 — Bron en methode</p><h2 id="sources-title">Cijfers die je kunt herleiden.</h2><p>Gebaseerd op Eurostat, dataset <strong>gov_10q_ggdebt</strong>: driemaandelijkse bruto overheidsschuld, sector S13, in miljoenen euro’s. De bedragen zijn omgerekend naar euro’s en per kwartaal opgeteld voor dezelfde 27 EU-landen.</p><p>Deze berekende som kan afwijken van het officiële EU-aggregaat. {overview.provisional ? "Sommige broncijfers zijn voorlopig of geraamd. " : ""}Het verschil over vijf jaar gebruikt de eerste en laatste waarneming van de grafiek; de procentuele verandering is berekend ten opzichte van de eerste waarneming.</p><small>Gegevens bijgewerkt: {updated}</small></div><div className={styles.sourceLinks}><a href="https://ec.europa.eu/eurostat/cache/metadata/en/gov_10q_ggdebt_esms.htm" target="_blank" rel="noreferrer"><span>Primaire bron</span><strong>Eurostat · definities en metadata ↗</strong></a><Link href="/nl/debt-growth#debt-growth-methodology"><span>Berekeningen</span><strong>Bronstatus en schuldgroei →</strong></Link><Link href="/nl/methodology"><span>EU Debt Map</span><strong>Volledige methodologie →</strong></Link></div></div></section>
    </div>
  );
}
