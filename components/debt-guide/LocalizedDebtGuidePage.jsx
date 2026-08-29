import Link from "next/link";
import { countries, debtDataSummary } from "@/lib/data";
import { countryName } from "@/lib/countries";
import { editorialDisplay } from "@/lib/editorial-font";
import { DebtBuilder, DebtMechanismStory } from "@/app/debt/DebtExperience";
import styles from "@/app/debt/debt.module.css";
import { getDebtGuideCopy } from "./debt-guide-copy";

const SITE = "https://www.eudebtmap.com";
const REVIEW_DATE = "2026-08-28";
const SOURCE_URLS = [
  "https://ec.europa.eu/eurostat/cache/metadata/en/gov_10q_ggdebt_esms.htm",
  "https://ec.europa.eu/eurostat/cache/metadata/en/gov_10dd_esms.htm",
  "https://commission.europa.eu/strategy-and-policy/eu-budget/eu-borrower-investor-relations/how-eu-issuance-works_en",
  "https://eur-lex.europa.eu/eli/treaty/tfeu_2016/pro_12/oj/eng",
];

function formatTrillions(value, locale) {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 1_000_000_000_000);
}

function formatBillions(value, locale) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
    value / 1_000_000_000
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

function SourceLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}<span aria-hidden="true"> ↗</span>
    </a>
  );
}

function HeroLedger({ copy }) {
  return (
    <div className={styles.heroLedger} aria-label={copy.aria} role="img">
      <div className={styles.ledgerTopline}>
        <span>{copy.title}</span>
        <span>{copy.period}</span>
      </div>
      <div className={styles.ledgerRows}>
        <div className={styles.ledgerRow}>
          <div><span>{copy.revenue}</span><strong>€94</strong></div>
          <div className={styles.ledgerTrack}><span className={styles.revenueBar} /></div>
        </div>
        <div className={styles.ledgerRow}>
          <div><span>{copy.spending}</span><strong>€100</strong></div>
          <div className={styles.ledgerTrack}><span className={styles.spendingBar} /></div>
        </div>
      </div>
      <div className={styles.ledgerResult}>
        <div><span>{copy.deficit}</span><strong>€6</strong></div>
        <div className={styles.ledgerArrow} aria-hidden="true"><i /><i /><i /></div>
        <div><span>{copy.added}</span><strong>+€6</strong></div>
      </div>
    </div>
  );
}

function DefinitionStrip({ copy }) {
  const operators = ["−", "=", "→", "→"];
  return (
    <div className={styles.definitionStrip} aria-label={copy.stripAria}>
      {copy.strip.map(([label, detail], index) => (
        <div key={label} style={{ display: "contents" }}>
          <div className={index === 2 ? styles.definitionAccent : index === 4 ? styles.definitionFinal : undefined}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{label}</strong>
            <small>{detail}</small>
          </div>
          {operators[index] ? <b aria-hidden="true">{operators[index]}</b> : null}
        </div>
      ))}
    </div>
  );
}

export default function LocalizedDebtGuidePage({ lang }) {
  const copy = getDebtGuideCopy(lang);
  const latestPeriod = debtDataSummary.dominantLatestTime;
  const currentCountries = countries.filter(
    (country) => country.official_latest_time === latestPeriod && country.last_value_eur > 0
  );
  const summedDebt = currentCountries.reduce((sum, country) => sum + country.last_value_eur, 0);
  const largestCountries = [...currentCountries]
    .sort((a, b) => b.last_value_eur - a.last_value_eur)
    .slice(0, 5);
  const largestValue = largestCountries[0]?.last_value_eur || 1;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: copy.headline,
    description: copy.schemaDescription,
    inLanguage: copy.inLanguage,
    dateModified: REVIEW_DATE,
    isAccessibleForFree: true,
    author: { "@type": "Organization", name: "EU Debt Map", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "EU Debt Map",
      url: SITE,
      logo: { "@type": "ImageObject", url: `${SITE}/eu_favicon_512.png` },
    },
    mainEntityOfPage: `${SITE}${copy.path}`,
    about: copy.definition.strip.map(([label]) => label),
  };
  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: copy.headline,
    url: `${SITE}${copy.path}`,
    description: copy.schemaDescription,
    inLanguage: copy.inLanguage,
  };
  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: copy.breadcrumbHome, item: `${SITE}${copy.base}` },
      { "@type": "ListItem", position: 2, name: copy.breadcrumbCurrent, item: `${SITE}${copy.path}` },
    ],
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
  const chapterHrefs = [
    "#government-debt-in-one-sentence",
    "#how-government-debt-works",
    "#debt-vs-deficit",
    "#who-holds-government-debt",
    "#why-debt-to-gdp-matters",
  ];

  return (
    <div className={`${styles.page} ${editorialDisplay.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className={styles.hero} aria-labelledby="page-title">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>{copy.hero.eyebrow}</p>
            <h1 id="page-title">{copy.hero.title}</h1>
            <p className={styles.heroThesis}>{copy.hero.thesis}</p>
            <p className={styles.heroIntro}>{copy.hero.intro}</p>
            <div className={styles.heroMeta}>
              {copy.hero.meta.map((item) => <span key={item}>{item}</span>)}
            </div>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="#government-debt-in-one-sentence">{copy.hero.primaryAction} <ArrowIcon /></a>
              <Link className={styles.secondaryAction} href={copy.base}>{copy.hero.secondaryAction}</Link>
            </div>
          </div>
          <HeroLedger copy={copy.ledger} />
        </div>
      </section>

      <nav className={styles.chapterNav} aria-label={copy.chapters.label}>
        <div>
          <span>{copy.chapters.eyebrow}</span>
          {copy.chapters.links.map((label, index) => <a href={chapterHrefs[index]} key={label}>{label}</a>)}
        </div>
      </nav>

      <section className={styles.definitionSection} id="government-debt-in-one-sentence" aria-labelledby="definition-title">
        <div className={styles.definitionLead}>
          <p className={styles.eyebrow}>{copy.definition.eyebrow}</p>
          <h2 id="definition-title">{copy.definition.title}</h2>
          <p>{copy.definition.text}</p>
          <SourceLink href={SOURCE_URLS[0]}>{copy.definition.source}</SourceLink>
        </div>
        <DefinitionStrip copy={copy.definition} />
      </section>

      <DebtMechanismStory copy={copy.story} />
      <DebtBuilder copy={copy.builder} locale={copy.locale} />

      <section className={styles.holdersSection} id="who-holds-government-debt" aria-labelledby="holders-title">
        <div className={styles.holdersGraphic} aria-hidden="true">
          <div className={styles.holderOrbit}>
            <div className={styles.holderCore}><span>{copy.holders.core[0]}</span><strong>{copy.holders.core[1]}</strong><small>{copy.holders.core[2]}</small></div>
            <span className={`${styles.holder} ${styles.holderBanks}`}>{copy.holders.labels[0]}</span>
            <span className={`${styles.holder} ${styles.holderPensions}`}>{copy.holders.labels[1]}</span>
            <span className={`${styles.holder} ${styles.holderForeign}`}>{copy.holders.labels[2]}</span>
            <span className={`${styles.holder} ${styles.holderCentral}`}>{copy.holders.labels[3]}</span>
            <span className={`${styles.holder} ${styles.holderHouseholds}`}>{copy.holders.labels[4]}</span>
          </div>
        </div>
        <div className={styles.holdersCopy}>
          <p className={styles.eyebrow}>{copy.holders.eyebrow}</p>
          <h2 id="holders-title">{copy.holders.title}</h2>
          {copy.holders.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <SourceLink href="https://www.ecb.europa.eu/press/economic-bulletin/articles/2021/html/ecb.ebart202103_02~6612ab7923.en.html">{copy.holders.source}</SourceLink>
        </div>
      </section>

      <section className={styles.riskSection} aria-labelledby="risk-title">
        <div className={styles.riskHeading}>
          <p className={styles.eyebrow}>{copy.risk.eyebrow}</p>
          <h2 id="risk-title">{copy.risk.title}</h2>
          <p>{copy.risk.intro}</p>
        </div>
        <div className={styles.riskLines}>
          {copy.risk.items.map(([title, text], index) => (
            <div key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></div>
          ))}
        </div>
      </section>

      <section className={styles.euSection} aria-labelledby="eu-context-title">
        <div className={styles.euHeader}>
          <div><p className={styles.eyebrow}>{copy.eu.eyebrow(latestPeriod)}</p><h2 id="eu-context-title">{copy.eu.title}</h2></div>
          <div className={styles.euTotal}>
            <span>{copy.eu.totalLabel}</span>
            <strong>€{formatTrillions(summedDebt, copy.locale)} {copy.trillions}</strong>
            <small>{copy.eu.coverage(currentCountries.length)}</small>
          </div>
        </div>
        <div className={styles.countryBars}>
          {largestCountries.map((country, index) => (
            <Link href={`${copy.base}/country/${country.code.toLowerCase()}`} className={styles.countryBarRow} key={country.code}>
              <span className={styles.countryRank}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.countryName}>{countryName(country.code, lang)}</span>
              <span className={styles.countryTrack}><i style={{ width: `${(country.last_value_eur / largestValue) * 100}%` }} /></span>
              <strong>€{formatBillions(country.last_value_eur, copy.locale)} {copy.billions}</strong>
            </Link>
          ))}
        </div>
        <p className={styles.euMethodNote}>{copy.eu.method}<Link href={`${copy.base}/methodology`}> {copy.eu.methodology}</Link></p>
      </section>

      <section className={styles.ratioSection} id="why-debt-to-gdp-matters" aria-labelledby="ratio-title">
        <div className={styles.ratioCopy}>
          <p className={styles.eyebrow}>{copy.ratio.eyebrow}</p>
          <h2 id="ratio-title">{copy.ratio.title}</h2>
          {copy.ratio.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className={styles.ratioLinks}>
            <Link href={`${copy.base}/debt-to-gdp`}>{copy.ratio.ranking} <ArrowIcon /></Link>
            <SourceLink href={SOURCE_URLS[3]}>{copy.ratio.treaty}</SourceLink>
          </div>
        </div>
        <div className={styles.ratioVisual} role="img" aria-label={copy.ratio.visualAria}>
          <div className={styles.ratioNumber}>60<span>%</span></div>
          <div className={styles.ratioRule}><span /><i /></div>
          <div className={styles.ratioLabels}><span>0%</span><strong>{copy.ratio.reference}</strong><span>120%+</span></div>
          <p>{copy.ratio.note}</p>
        </div>
      </section>

      <section className={styles.faqSection} aria-labelledby="faq-title">
        <div className={styles.faqHeading}><p className={styles.eyebrow}>{copy.faqEyebrow}</p><h2 id="faq-title">{copy.faqTitle}</h2></div>
        <div className={styles.faqList}>
          {copy.faq.map(([question, answer], index) => (
            <details key={question}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<i aria-hidden="true" /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.sourcesSection} aria-labelledby="sources-title">
        <div><p className={styles.eyebrow}>{copy.sources.eyebrow}</p><h2 id="sources-title">{copy.sources.title}</h2><p>{copy.sources.intro}</p></div>
        <ol>
          {copy.sources.labels.map((label, index) => <li key={label}><SourceLink href={SOURCE_URLS[index]}>{label}</SourceLink></li>)}
        </ol>
      </section>

      <section className={styles.nextSection} aria-labelledby="next-title">
        <div><p className={styles.eyebrow}>{copy.next.eyebrow}</p><h2 id="next-title">{copy.next.title}</h2></div>
        <div className={styles.nextLinks}>
          {[copy.base, `${copy.base}/debt-to-gdp`, `${copy.base}/debt-vs-deficit`, `${copy.base}/methodology`].map((href, index) => (
            <Link href={href} key={href}><span>{String(index + 1).padStart(2, "0")}</span><strong>{copy.next.links[index]}</strong><ArrowIcon /></Link>
          ))}
        </div>
      </section>
    </div>
  );
}
