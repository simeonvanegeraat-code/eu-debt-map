import Link from 'next/link';
import { COUNTRY_NAMES, countryName } from '@/lib/countries';
import typography from '@/components/typography/typography.module.css';
import { getDebtDeficitCopy, DEBT_DEFICIT_SOURCE } from '@/components/debt-guide/debt-deficit-copy';
import { getGuideCopy } from './guide-copy';
import { getGuideSchemas } from './guide-schema';
import { BorrowingSteps, CountryPicker, DebtModel, GuideNavigation } from './GuideControls';
import styles from './guide.module.css';

const SOURCES = [
  'https://ec.europa.eu/eurostat/cache/metadata/en/gov_10dd_esms.htm',
  DEBT_DEFICIT_SOURCE,
  'https://www.ecb.europa.eu/press/economic-bulletin/articles/2021/html/ecb.ebart202103_02~6612ab7923.en.html',
  'https://eur-lex.europa.eu/eli/treaty/tfeu_2016/pro_12/oj/eng',
];

function SectionHeading({ number, title, intro }) {
  return <header className={styles.sectionHeading}><span className={styles.sectionNumber}>{number}</span><div><h2>{title}</h2>{intro && <p>{intro}</p>}</div></header>;
}

export default function DebtGuidePreview({ lang = 'en', preview = true }) {
  const copy = getGuideCopy(lang);
  const deficitCopy = getDebtDeficitCopy(lang);
  const prefix = lang === 'en' ? '' : `/${lang}`;
  const countries = Object.keys(COUNTRY_NAMES).map(code => ({ code, name: countryName(code, lang) })).sort((a, b) => a.name.localeCompare(b.name, copy.locale));
  const faqs = [...copy.faqs, deficitCopy.ratioFAQ];
  const amount = value => lang === 'fr' ? `${new Intl.NumberFormat(copy.locale).format(value)} ${copy.unit}` : `€ ${new Intl.NumberFormat(copy.locale).format(value)} ${copy.unit}`;
  return <article className={`${typography.page} ${styles.page}`} lang={lang} aria-labelledby="page-title">
    {!preview && getGuideSchemas(lang).map(schema => <script key={schema['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}/>) }
    <section className={styles.hero} id="government-debt-in-one-sentence">
      <div className={styles.container}>{preview && <div className={styles.previewBar}><span><i aria-hidden="true"/>{copy.preview}</span><Link href={`${prefix}/debt`}>{copy.current} ↗</Link></div>}
        <div className={styles.heroGrid}><div><p className={styles.eyebrow}>{copy.eyebrow}</p><h1 id="page-title">{copy.title}</h1><p className={styles.definition}>{copy.definition}</p><div className={styles.heroActions}><a className={styles.primaryButton} href="#how-government-debt-works">{copy.start} ↓</a><a className={styles.secondaryButton} href="#explore-countries">{copy.explore} ↗</a></div><details className={styles.precise}><summary>{copy.precise}</summary><p>{copy.preciseText}</p><a href="#guide-sources">Eurostat ↘</a></details></div>
          <figure className={styles.ledger}><figcaption>{copy.example}<small>{copy.fictional}</small></figcaption><div className={styles.ledgerRows}><div><span>{copy.borrowed}</span><strong>€ 100</strong></div><div><span>− {copy.repaid}</span><strong>€ 20</strong></div><div><span>{copy.outstanding}</span><strong>€ 80</strong></div></div><div className={styles.ledgerTrack} aria-hidden="true"><span/></div><div className={styles.ledgerEquation} aria-hidden="true">100 − 20 = <strong>80</strong></div></figure>
        </div>
      </div>
    </section>
    <GuideNavigation copy={copy}/>
    <div className={styles.container}>
      <section className={styles.section} id="how-government-debt-works"><SectionHeading number="01" title={copy.mechanism} intro={copy.mechanismIntro}/><BorrowingSteps copy={copy}/></section>
      <section className={styles.section} id="debt-vs-deficit"><SectionHeading number="02" title={deficitCopy.title}/><dl className={styles.comparison}>{deficitCopy.facts.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl><DebtModel copy={copy}/><p className={styles.relation}>{deficitCopy.relationship}</p><a className={styles.textLink} href="#guide-sources">{deficitCopy.source} ↘</a><a className={styles.shortcut} href="#explore-countries">{copy.shortcut} <span aria-hidden="true">→</span></a></section>
      <section className={styles.section} id="who-holds-government-debt"><SectionHeading number="03" title={copy.creditorsTitle} intro={copy.creditorsIntro}/><ul className={styles.creditors}>{copy.creditors.map(([title, text], index) => <li key={title}><span className={styles.creditorMark} aria-hidden="true">0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ul><p className={styles.note}>{copy.creditorsNote}</p></section>
      <section className={styles.section} id="why-debt-to-gdp-matters"><SectionHeading number="04" title={copy.meaningTitle} intro={copy.meaningIntro}/><div className={styles.ratioExamples}>{[1000, 2000].map((gdp, index) => <div key={gdp}><p className={styles.eyebrow}>{copy.economy} {index ? 'B' : 'A'}</p><dl><div><dt>{copy.debt}</dt><dd>{amount(500)}</dd></div><div><dt>{copy.gdp}</dt><dd>{amount(gdp)}</dd></div></dl><div className={styles.ratioTrack} aria-hidden="true"><span style={{width: `${500 / gdp * 100}%`}}/></div><div className={styles.ratioValue}><span>{copy.ratio}</span><strong>{new Intl.NumberFormat(copy.locale, {style: 'percent'}).format(500 / gdp)}</strong></div></div>)}</div><p className={styles.note}>{copy.ratioNote}</p><Link className={styles.textLink} href={`${prefix}/debt-to-gdp`}>{copy.ratioLink} ↗</Link><ul className={styles.risks}>{copy.risks.map(([title, text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ul><p className={styles.note}>{copy.riskNote}</p></section>
      <section className={`${styles.section} ${styles.apply}`} id="explore-countries"><SectionHeading number="05" title={copy.applyTitle} intro={copy.applyIntro}/><CountryPicker copy={copy} countries={countries} prefix={prefix}/><Link className={styles.textLink} href={`${prefix}/eu-debt`}>{copy.euAction} ↗</Link></section>
      <section className={`${styles.section} ${styles.endSection}`}><div><h2>{copy.faqTitle}</h2><div className={styles.faqs}>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div><aside id="guide-sources" className={styles.sources}><h2>{copy.sourcesTitle}</h2><p>{copy.sourcesIntro}</p><ol>{SOURCES.map((url, index) => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{copy.sourceNames[index]} ↗</a></li>)}</ol><p className={styles.note}>{copy.reviewed}: <time dateTime="2026-10-31">{new Intl.DateTimeFormat(copy.locale, {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'}).format(new Date('2026-10-31T12:00:00Z'))}</time></p><Link className={styles.textLink} href={`${prefix}/methodology`}>{copy.methodology} ↗</Link></aside></section>
    </div>
  </article>;
}
