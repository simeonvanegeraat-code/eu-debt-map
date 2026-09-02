import Link from "next/link";
import { editorialDisplay } from "@/lib/editorial-font";
import { getStabilityPactCopy, SITE } from "./stability-pact-copy";
import styles from "./stability-pact-preview.module.css";

const SOURCES = {
  reform: "https://www.consilium.europa.eu/en/press/press-releases/2024/04/29/economic-governance-review-council-adopts-reform-of-fiscal-rules/",
  regulation: "https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A32024R1263",
  framework: "https://economy-finance.ec.europa.eu/economic-governance-framework/what-economic-governance-framework_en",
  annualData: "https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-22042026-ap",
  defence: "https://www.consilium.europa.eu/en/policies/national-escape-clause-for-defence-expenditure-nec/",
  legalBasis: "https://economy-finance.ec.europa.eu/economic-governance-framework/stability-and-growth-pact/legal-basis-stability-and-growth-pact_en",
};

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 7l5 5-5 5" /></svg>;
}

export default function StabilityPactPreviewPage({ lang = "en", preview = false }) {
  const copy = getStabilityPactCopy(lang);
  const articleLd = {
    "@context": "https://schema.org", "@type": "Article", headline: copy.meta.title.split(" | ")[0],
    description: copy.meta.description, inLanguage: copy.inLanguage, dateModified: "2026-08-30",
    isAccessibleForFree: true, author: { "@type": "Organization", name: "EU Debt Map", url: SITE },
    publisher: { "@type": "Organization", name: "EU Debt Map", url: SITE, logo: { "@type": "ImageObject", url: `${SITE}/eu_favicon_512.png` } },
    mainEntityOfPage: `${SITE}${copy.path}`, about: ["Stability and Growth Pact", "EU fiscal rules", "government deficit", "government debt", "net expenditure"],
  };
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: copy.faq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };
  const breadcrumbsLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: copy.breadcrumbHome, item: `${SITE}${copy.base}` }, { "@type": "ListItem", position: 2, name: copy.breadcrumbCurrent, item: `${SITE}${copy.path}` }] };
  const navHrefs = ["#what-changed", "#how-it-works", "#numbers", "#today", "#sources"];

  return (
    <div className={`${styles.page} ${editorialDisplay.variable}`}>
      {!preview ? <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} /></> : null}
      <section className={styles.hero} aria-labelledby="sgp-page-title">
        <div className={styles.heroInner}>
          {preview ? <div className={styles.previewBar}><span>Fiscal-rules design study · isolated preview</span><Link href="/stability-and-growth-pact">View current page</Link></div> : null}
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>{copy.hero.eyebrow}</p><h1 id="sgp-page-title">{copy.hero.title}</h1><p className={styles.lede}>{copy.hero.lede}</p>
              <div className={styles.heroActions}><a href="#how-it-works">{copy.hero.action} <ArrowIcon /></a><span>{copy.hero.reviewed}</span></div>
            </div>
            <aside className={styles.heroPanel} aria-label={copy.hero.panelTitle}>
              <p>{copy.hero.panelTitle}</p><div className={styles.referencePair}><div><strong>3%</strong><span>{copy.hero.deficit}</span><small>{copy.hero.share}</small></div><div><strong>60%</strong><span>{copy.hero.debt}</span><small>{copy.hero.share}</small></div></div>
              <div className={styles.heroClarifier}><b>{copy.hero.warning}</b><span>{copy.hero.warningText}</span></div>
              <a href={SOURCES.regulation} target="_blank" rel="noreferrer">Regulation (EU) 2024/1263 <ArrowIcon /></a>
            </aside>
          </div>
        </div>
      </section>

      <nav className={styles.chapterNav} aria-label={copy.breadcrumbCurrent}><div><span>{copy.hero.eyebrow.split(" · ")[0]}</span>{copy.nav.map((label, index) => <a href={navHrefs[index]} key={label}>{label}</a>)}</div></nav>

      <section className={styles.reformSection} aria-labelledby="reform-title">
        <header className={`${styles.sectionIntro} ${styles.anchorTarget}`} id="what-changed"><p className={styles.eyebrow}>{copy.reform.eyebrow}</p><h2 id="reform-title">{copy.reform.title}</h2><p>{copy.reform.intro}</p></header>
        <div className={styles.beforeAfter}>
          <article><span>{copy.reform.stayedLabel}</span><h3>{copy.reform.stayedTitle}</h3><ul>{copy.reform.stayed.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className={styles.afterCard}><span>{copy.reform.changedLabel}</span><h3>{copy.reform.changedTitle}</h3><ul>{copy.reform.changed.map((item) => <li key={item}>{item}</li>)}</ul></article>
        </div>
        <a className={styles.sourceLink} href={SOURCES.reform} target="_blank" rel="noreferrer">{copy.reform.source} <ArrowIcon /></a>
      </section>

      <section className={styles.processSection} aria-labelledby="process-title">
        <header className={`${styles.processIntro} ${styles.anchorTarget}`} id="how-it-works"><p className={styles.eyebrow}>{copy.process.eyebrow}</p><h2 id="process-title">{copy.process.title}</h2><p>{copy.process.intro}</p></header>
        <ol className={styles.processGrid}>{copy.process.steps.map(([title, text], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
        <div className={styles.definitionCallout}><div><p>{copy.process.definitionLabel}</p><strong>{copy.process.definitionTitle}</strong></div><p>{copy.process.definitionText}</p></div>
      </section>

      <section className={styles.numbersSection} aria-labelledby="numbers-title">
        <header className={`${styles.sectionIntro} ${styles.anchorTarget}`} id="numbers"><p className={styles.eyebrow}>{copy.numbers.eyebrow}</p><h2 id="numbers-title">{copy.numbers.title}</h2><p>{copy.numbers.intro}</p></header>
        <div className={styles.numberGrid}>{copy.numbers.cards.map(([value, title, text]) => <article key={title}><strong>{value}</strong><h3>{title}</h3><p>{text}</p></article>)}</div>
        <div className={styles.warningCard}><span>{copy.numbers.warningLabel}</span><h3>{copy.numbers.warningTitle}</h3><p>{copy.numbers.warningText}</p><Link href={`${copy.base}/debt-to-gdp`}>{copy.numbers.rankingLink} <ArrowIcon /></Link></div>
      </section>

      <section className={styles.todaySection} aria-labelledby="today-title">
        <header className={`${styles.todayIntro} ${styles.anchorTarget}`} id="today"><p className={styles.eyebrow}>{copy.today.eyebrow}</p><h2 id="today-title">{copy.today.title}</h2><p>{copy.today.intro}</p></header>
        <div className={styles.snapshotGrid}>{copy.today.stats.map(([label, value, text]) => <article key={label}><span>{label}</span><strong>{value}</strong><p>{text}</p></article>)}</div>
        <div className={styles.currentGrid}>
          <article><p className={styles.eyebrow}>{copy.today.correctiveLabel}</p><h3>{copy.today.correctiveTitle}</h3><p>{copy.today.correctiveText}</p><a href={SOURCES.framework} target="_blank" rel="noreferrer">{copy.today.correctiveLink} <ArrowIcon /></a></article>
          <article><p className={styles.eyebrow}>{copy.today.flexibilityLabel}</p><h3>{copy.today.flexibilityTitle}</h3><p>{copy.today.flexibilityText}</p><a href={SOURCES.defence} target="_blank" rel="noreferrer">{copy.today.flexibilityLink} <ArrowIcon /></a></article>
        </div>
        <a className={styles.sourceLink} href={SOURCES.annualData} target="_blank" rel="noreferrer">{copy.today.dataLink} <ArrowIcon /></a>
      </section>

      <section className={styles.faqSection} aria-labelledby="faq-title"><header><p className={styles.eyebrow}>{copy.faqEyebrow}</p><h2 id="faq-title">{copy.faqTitle}</h2></header><div className={styles.faqList}>{copy.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>

      <section className={styles.sourcesSection} id="sources" aria-labelledby="sources-title">
        <header><p className={styles.eyebrow}>{copy.sources.eyebrow}</p><h2 id="sources-title">{copy.sources.title}</h2><p>{copy.sources.intro}</p></header>
        <div className={styles.sourceGrid}>{[[SOURCES.regulation, copy.sources.labels[0]], [SOURCES.legalBasis, copy.sources.labels[1]], [SOURCES.annualData, copy.sources.labels[2]]].map(([href, label], index) => <a href={href} target="_blank" rel="noreferrer" key={href}><span>{copy.sources.categories[index]}</span><strong>{label}</strong><ArrowIcon /></a>)}<Link href={`${copy.base}/methodology`}><span>{copy.sources.categories[3]}</span><strong>{copy.sources.labels[3]}</strong><ArrowIcon /></Link></div>
        <p className={styles.reviewNote}>{copy.sources.reviewed}</p>
      </section>
    </div>
  );
}
