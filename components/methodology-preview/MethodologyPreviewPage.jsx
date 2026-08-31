import Link from "next/link";
import { countries, debtDataSummary, livePerSecondFor, officialDebtToGDPRatio } from "@/lib/data";
import { EUROSTAT_UPDATED_AT } from "@/lib/eurostat.debt.gen";
import { EUROSTAT_RATIO_UPDATED_AT } from "@/lib/eurostat.ratio.gen";
import { editorialDisplay } from "@/lib/editorial-font";
import { getMethodologyCopy } from "./methodology-copy";
import styles from "./methodology-preview.module.css";

const SITE = "https://www.eudebtmap.com";
const EUROSTAT_METADATA = "https://ec.europa.eu/eurostat/cache/metadata/en/gov_10q_ggdebt_esms.htm";
const EUROSTAT_DATASET = "https://ec.europa.eu/eurostat/en/web/products-datasets/-/GOV_10Q_GGDEBT";
const EUROSTAT_API = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt?lang=EN&format=JSON&freq=Q&sector=S13&na_item=GD&unit=MIO_EUR&lastTimePeriod=20";
const NAV_HREFS = ["#overview", "#definition", "#pipeline", "#calculation", "#safeguards", "#limitations", "#sources"];

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" /></svg>;
}

function formatDate(value, locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function formatMoney(value, locale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatSignedMoney(value, locale) {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${formatMoney(Math.abs(value), locale)}`;
}

function formatRate(value, locale) {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}€${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.abs(value))}/s`;
}

function SectionIntro({ eyebrow, title, intro, id, dark = false }) {
  return (
    <header className={`${styles.sectionIntro} ${styles.anchorTarget} ${dark ? styles.sectionIntroDark : ""}`} id={id}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 id={`${id}-title`}>{title}</h2>
      <p>{intro}</p>
    </header>
  );
}

export default function MethodologyPreviewPage({ lang = "en", preview = false }) {
  const copy = getMethodologyCopy(lang);
  const example = countries.find((country) => country.code === "DE") || countries[0];
  const previousDebt = Number(example?.prev_value_eur) || 0;
  const latestDebt = Number(example?.last_value_eur) || 0;
  const movement = latestDebt - previousDebt;
  const elapsedSeconds = Math.max(1, (Date.parse(example?.last_date) - Date.parse(example?.prev_date)) / 1000);
  const elapsedDays = Math.round(elapsedSeconds / 86_400);
  const pace = livePerSecondFor(example);
  const ratio = officialDebtToGDPRatio(example);
  const period = debtDataSummary.dominantLatestTime || example?.official_latest_time || "—";
  const coverage = debtDataSummary.dominantCoverage || 0;
  const path = `${copy.base}/methodology`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: copy.schema.headline,
    description: copy.lede,
    dateModified: "2026-08-30",
    datePublished: "2025-10-27",
    inLanguage: lang,
    mainEntityOfPage: `${SITE}${path}`,
    author: { "@type": "Organization", name: "EU Debt Map", url: SITE },
    citation: [EUROSTAT_METADATA, EUROSTAT_DATASET],
  };
  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: copy.schema.datasetName,
    description: copy.schema.datasetDescription,
    creator: { "@type": "Organization", name: "Eurostat" },
    isBasedOn: EUROSTAT_METADATA,
    spatialCoverage: copy.schema.spatialCoverage,
    temporalCoverage: period,
    measurementTechnique: "Eurostat gov_10q_ggdebt; Q, S13, GD, MIO_EUR and PC_GDP",
    license: "https://ec.europa.eu/eurostat/about/policies/copyright",
    distribution: [{ "@type": "DataDownload", encodingFormat: "application/json", contentUrl: EUROSTAT_API }],
  };
  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: copy.schema.home, item: `${SITE}${copy.base || "/"}` },
      { "@type": "ListItem", position: 2, name: copy.schema.page, item: `${SITE}${path}` },
    ],
  };

  return (
    <article className={`${styles.page} ${editorialDisplay.variable} google-anno-skip`}>
      {!preview ? (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
        </>
      ) : null}

      <section className={styles.hero} aria-labelledby="methodology-title">
        <div className={styles.shell}>
          {preview ? (
            <div className={styles.previewBar}>
              <span>{copy.previewLabel}</span>
              <Link href={path}>{copy.currentPage}</Link>
            </div>
          ) : null}

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>{copy.eyebrow}</p>
              <h1 id="methodology-title">{copy.title}</h1>
              <p className={styles.heroLede}>{copy.lede}</p>
              <div className={styles.heroActions}>
                <a href="#overview">{copy.heroAction} <ArrowIcon /></a>
                <span>{copy.heroNote}</span>
              </div>
            </div>

            <aside className={styles.lineagePanel} aria-label={copy.sourcePanel}>
              <p>{copy.sourcePanel}</p>
              <ol>
                {copy.sourceSteps.map(([number, title, text], index) => (
                  <li key={title}>
                    <span>{number}</span>
                    <div><strong>{title}</strong><small>{text}</small></div>
                    {index < copy.sourceSteps.length - 1 ? <i aria-hidden="true" /> : null}
                  </li>
                ))}
              </ol>
            </aside>
          </div>

          <dl className={styles.heroFacts}>
            <div><dt>{copy.facts.source}</dt><dd>Eurostat</dd><small>gov_10q_ggdebt</small></div>
            <div><dt>{copy.facts.coverage}</dt><dd>EU-27</dd><small>{copy.facts.coverageNote(coverage)}</small></div>
            <div><dt>{copy.facts.reference}</dt><dd>{period}</dd><small>{copy.facts.referenceNote}</small></div>
            <div><dt>{copy.facts.fetched}</dt><dd>{formatDate(EUROSTAT_UPDATED_AT, copy.locale)}</dd><small>{copy.facts.fetchedNote}</small></div>
          </dl>
        </div>
      </section>

      <nav className={styles.chapterNav} aria-label={copy.navLabel}>
        <div className={styles.shell}>
          <span>{copy.navLabel}</span>
          {copy.nav.map((label, index) => <a href={NAV_HREFS[index]} key={label}>{label}</a>)}
        </div>
      </nav>

      <section className={`${styles.overviewSection} ${styles.shell}`} aria-labelledby="overview-title">
        <SectionIntro id="overview" eyebrow={copy.overview.eyebrow} title={copy.overview.title} intro={copy.overview.intro} />
        <div className={styles.truthGrid}>
          <article className={styles.officialCard}>
            <p>{copy.overview.officialLabel}</p>
            <h3>{copy.overview.officialTitle}</h3>
            <strong>{period}</strong>
            <span>{copy.overview.officialText}</span>
          </article>
          <article className={styles.modelCard}>
            <p>{copy.overview.modelLabel}</p>
            <h3>{copy.overview.modelTitle}</h3>
            <strong>{formatRate(pace, copy.locale)}</strong>
            <span>{copy.overview.modelText}</span>
          </article>
        </div>
        <aside className={styles.governingRule}>
          <span>{copy.overview.ruleLabel}</span>
          <strong>{copy.overview.rule}</strong>
        </aside>
      </section>

      <section className={styles.definitionSection} aria-labelledby="definition-title">
        <div className={styles.shell}>
          <SectionIntro id="definition" eyebrow={copy.definition.eyebrow} title={copy.definition.title} intro={copy.definition.intro} />
          <div className={styles.definitionGrid}>
            <article className={styles.instrumentPanel}>
              <p>{copy.definition.includedTitle}</p>
              <div>{copy.definition.included.map(([code, label]) => <span key={code}><b>{code}</b><strong>{label}</strong></span>)}</div>
            </article>
            <article className={styles.coveragePanel}>
              <p>{copy.definition.coverageTitle}</p>
              <ul>{copy.definition.coverage.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className={styles.excludedPanel}>
              <p>{copy.definition.excludedTitle}</p>
              <ul>{copy.definition.excluded.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </div>
          <a className={styles.sourceArrow} href={EUROSTAT_METADATA} target="_blank" rel="noreferrer">{copy.definition.sourceLink} <ArrowIcon /></a>
        </div>
      </section>

      <section className={styles.pipelineSection} aria-labelledby="pipeline-title">
        <div className={styles.shell}>
          <SectionIntro dark id="pipeline" eyebrow={copy.pipeline.eyebrow} title={copy.pipeline.title} intro={copy.pipeline.intro} />
          <ol className={styles.pipelineGrid}>
            {copy.pipeline.steps.map(([title, text], index) => (
              <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></li>
            ))}
          </ol>
          <div className={styles.snapshotPanel}>
            <p>{copy.pipeline.statusLabel}</p>
            <dl>
              <div><dt>{copy.pipeline.dataGenerated}</dt><dd>{formatDate(EUROSTAT_UPDATED_AT, copy.locale)}</dd></div>
              <div><dt>{copy.pipeline.ratioGenerated}</dt><dd>{formatDate(EUROSTAT_RATIO_UPDATED_AT, copy.locale)}</dd></div>
              <div><dt>{copy.pipeline.coverage}</dt><dd>{coverage}/27</dd></div>
              <div><dt>{copy.pipeline.period}</dt><dd>{period}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className={`${styles.calculationSection} ${styles.shell}`} aria-labelledby="calculation-title">
        <SectionIntro id="calculation" eyebrow={copy.calculation.eyebrow} title={copy.calculation.title} intro={copy.calculation.intro} />
        <div className={styles.formulaGrid}>
          <article><span>{copy.calculation.rateLabel}</span><strong>{copy.calculation.rateFormula}</strong></article>
          <article><span>{copy.calculation.estimateLabel}</span><strong>{copy.calculation.estimateFormula}</strong></article>
        </div>
        <div className={styles.examplePanel}>
          <header><p>{copy.calculation.exampleEyebrow}</p><span>{example?.official_previous_time} → {example?.official_latest_time}</span></header>
          <dl>
            <div><dt>{copy.calculation.previous}</dt><dd>{formatMoney(previousDebt, copy.locale)}</dd></div>
            <div><dt>{copy.calculation.latest}</dt><dd>{formatMoney(latestDebt, copy.locale)}</dd></div>
            <div><dt>{copy.calculation.movement}</dt><dd className={movement >= 0 ? styles.positive : styles.negative}>{formatSignedMoney(movement, copy.locale)}</dd></div>
            <div><dt>{copy.calculation.elapsed}</dt><dd>{copy.calculation.days(elapsedDays)}</dd></div>
            <div><dt>{copy.calculation.pace}</dt><dd className={pace >= 0 ? styles.positive : styles.negative}>{formatRate(pace, copy.locale)}</dd></div>
          </dl>
          <small>{copy.calculation.exampleNote}</small>
        </div>
        <article className={styles.ratioPanel}>
          <div>
            <p>{copy.calculation.ratioTitle}</p>
            <h3>{Number.isFinite(ratio) ? `${new Intl.NumberFormat(copy.locale, { maximumFractionDigits: 1 }).format(ratio)}%` : "—"}</h3>
            <span>{copy.calculation.ratioText}</span>
          </div>
          <div className={styles.ratioFormula}><strong>{copy.calculation.ratioFormula}</strong><small>{copy.calculation.ratioWarning}</small></div>
        </article>
      </section>

      <section className={styles.safeguardsSection} aria-labelledby="safeguards-title">
        <div className={styles.shell}>
          <SectionIntro id="safeguards" eyebrow={copy.safeguards.eyebrow} title={copy.safeguards.title} intro={copy.safeguards.intro} />
          <div className={styles.safeguardGrid}>{copy.safeguards.cards.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section className={`${styles.limitationsSection} ${styles.shell}`} aria-labelledby="limitations-title">
        <SectionIntro id="limitations" eyebrow={copy.limitations.eyebrow} title={copy.limitations.title} intro={copy.limitations.intro} />
        <div className={styles.limitGrid}>{copy.limitations.items.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className={styles.updatesSection} aria-labelledby="updates-title">
        <div className={styles.shell}>
          <SectionIntro id="updates" eyebrow={copy.updates.eyebrow} title={copy.updates.title} intro={copy.updates.intro} />
          <div className={styles.updateGrid}>{copy.updates.cards.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
          <div className={styles.changelog}>
            <p>{copy.updates.changelogTitle}</p>
            {copy.updates.changelog.map(([version, date, text]) => <div key={version}><strong>{version}</strong><time>{date}</time><span>{text}</span></div>)}
          </div>
        </div>
      </section>

      <section className={`${styles.sourcesSection} ${styles.shell}`} aria-labelledby="sources-title">
        <SectionIntro id="sources" eyebrow={copy.sources.eyebrow} title={copy.sources.title} intro={copy.sources.intro} />
        <div className={styles.sourceCards}>{copy.sources.sourceCards.map(([label, value, note]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}</div>
        <details className={styles.technicalDetails}>
          <summary>{copy.sources.detailsTitle}<span>+</span></summary>
          <div>
            <pre><code>{`GET /eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt
  ?lang=EN&format=JSON&freq=Q&sector=S13&na_item=GD
  &unit=MIO_EUR&lastTimePeriod=20&geo=DE&geo=FR&geo=IT…`}</code></pre>
            <pre><code>{`rate_per_second =
  clamp((latest_debt - previous_debt) / seconds_between_dates,
        -50000,
        +50000)

estimate_now = latest_debt + rate_per_second * seconds_since_latest`}</code></pre>
          </div>
        </details>
        <div className={styles.citationGrid}>
          <article><p>{copy.sources.citationTitle}</p><blockquote>{copy.sources.citation}</blockquote><small>{copy.sources.copyHint}</small></article>
          <div className={styles.auditLinks}>
            <a href={EUROSTAT_METADATA} target="_blank" rel="noreferrer"><span>{copy.sources.linkLabels[0]}</span><strong>{copy.sources.primary}</strong><ArrowIcon /></a>
            <a href={EUROSTAT_DATASET} target="_blank" rel="noreferrer"><span>{copy.sources.linkLabels[1]}</span><strong>{copy.sources.dataset}</strong><ArrowIcon /></a>
            <a href={EUROSTAT_API} target="_blank" rel="noreferrer"><span>{copy.sources.linkLabels[2]}</span><strong>{copy.sources.api}</strong><ArrowIcon /></a>
          </div>
        </div>
        <div className={styles.nextPanel}>
          <p>{copy.sources.nextTitle}</p>
          <div>{copy.sources.next.map(([label, href]) => <Link href={href} key={href}>{label}<ArrowIcon /></Link>)}</div>
        </div>
      </section>
    </article>
  );
}
