import Link from "next/link";
import { countries, debtDataSummary } from "@/lib/data";
import { DebtBuilder, DebtMechanismStory } from "./DebtExperience";
import styles from "./debt.module.css";

const SITE = "https://www.eudebtmap.com";
const PATH = "/debt";
const REVIEW_DATE = "2026-08-28";

export async function generateMetadata() {
  const title = "What Is Government Debt? Debt, Deficits and Bonds Explained";
  const description =
    "Understand government debt visually: see how deficits become bonds and public debt, who holds it, when it matters, and why debt-to-GDP is used.";

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical: `${SITE}${PATH}`,
      languages: {
        en: `${SITE}${PATH}`,
        nl: `${SITE}/nl${PATH}`,
        de: `${SITE}/de${PATH}`,
        fr: `${SITE}/fr${PATH}`,
        "x-default": `${SITE}${PATH}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE}${PATH}`,
      siteName: "EU Debt Map",
      modifiedTime: REVIEW_DATE,
      images: [{
        url: "/og/debt-explainer-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Visual guide explaining government debt, deficits and bonds",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og/debt-explainer-1200x630.jpg"],
    },
    robots: { index: true, follow: true, "max-image-preview": "large" },
  };
}

function formatTrillions(value) {
  return new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 1_000_000_000_000);
}

function formatBillions(value) {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(
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

function HeroLedger() {
  return (
    <div className={styles.heroLedger} aria-label="Illustration showing a budget deficit adding to government debt" role="img">
      <div className={styles.ledgerTopline}>
        <span>Illustrative public budget</span>
        <span>One period</span>
      </div>
      <div className={styles.ledgerRows}>
        <div className={styles.ledgerRow}>
          <div><span>Revenue</span><strong>€94</strong></div>
          <div className={styles.ledgerTrack}><span className={styles.revenueBar} /></div>
        </div>
        <div className={styles.ledgerRow}>
          <div><span>Spending</span><strong>€100</strong></div>
          <div className={styles.ledgerTrack}><span className={styles.spendingBar} /></div>
        </div>
      </div>
      <div className={styles.ledgerResult}>
        <div><span>Annual deficit</span><strong>€6</strong></div>
        <div className={styles.ledgerArrow} aria-hidden="true"><i /><i /><i /></div>
        <div><span>Added to debt</span><strong>+€6</strong></div>
      </div>
    </div>
  );
}

function DefinitionStrip() {
  return (
    <div className={styles.definitionStrip} aria-label="The relationship between revenue, spending, deficit, borrowing and debt">
      <div><span>01</span><strong>Revenue</strong><small>Money coming in</small></div>
      <b aria-hidden="true">−</b>
      <div><span>02</span><strong>Spending</strong><small>Money going out</small></div>
      <b aria-hidden="true">=</b>
      <div className={styles.definitionAccent}><span>03</span><strong>Deficit</strong><small>The period’s gap</small></div>
      <b aria-hidden="true">→</b>
      <div><span>04</span><strong>Borrowing</strong><small>Bonds and loans</small></div>
      <b aria-hidden="true">→</b>
      <div className={styles.definitionFinal}><span>05</span><strong>Debt</strong><small>The remaining stock</small></div>
    </div>
  );
}

function SourceLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}<span aria-hidden="true"> ↗</span>
    </a>
  );
}

export default function DebtExplainer() {
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
    headline: "What Is Government Debt? Debt, Deficits and Bonds Explained",
    description: "A visual guide to government debt, deficits, government bonds, debt holders and debt-to-GDP.",
    inLanguage: "en",
    dateModified: REVIEW_DATE,
    isAccessibleForFree: true,
    author: { "@type": "Organization", name: "EU Debt Map", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "EU Debt Map",
      url: SITE,
      logo: { "@type": "ImageObject", url: `${SITE}/eu_favicon_512.png` },
    },
    mainEntityOfPage: `${SITE}${PATH}`,
    about: ["government debt", "public debt", "debt vs deficit", "government bonds", "debt-to-GDP"],
  };
  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Government debt guide", item: `${SITE}${PATH}` },
    ],
  };
  const faqItems = [
    {
      question: "Is all government debt bad?",
      answer: "No. Borrowing can finance investment or help stabilise the economy during a downturn. What matters is why the money is borrowed, the interest cost, the growth of the economy and whether the debt remains manageable.",
    },
    {
      question: "What is the difference between government debt and a deficit?",
      answer: "A deficit is the shortfall during one budget period when expenditure exceeds revenue. Government debt is the outstanding stock left by past borrowing, after repayments and other changes.",
    },
    {
      question: "Who owns government debt?",
      answer: "Government bonds can be held by banks, pension funds, insurers, investment funds, households, foreign investors and central banks. The mix differs by country and maturity.",
    },
    {
      question: "Do governments have to repay all debt at once?",
      answer: "No. Bonds mature at different dates. Governments normally repay or refinance maturing debt over time, while continuing to issue new debt when funding is needed.",
    },
    {
      question: "Why is debt compared with GDP?",
      answer: "Debt-to-GDP compares the debt stock with the size of the economy. It is more useful for comparing countries than the raw debt amount alone, although it does not by itself determine whether debt is sustainable.",
    },
  ];
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className={styles.hero} aria-labelledby="page-title">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>EU Debt Map · Visual guide 01</p>
            <h1 id="page-title">What is government debt?</h1>
            <p className={styles.heroThesis}>It starts as a gap in one budget and becomes a financial promise that can last for decades.</p>
            <p className={styles.heroIntro}>Trace how deficits become bonds, how bonds become public debt and why the size of the economy matters as much as the number itself.</p>
            <div className={styles.heroMeta}>
              <span>Reviewed 28 August 2026</span><span>8-minute visual guide</span><span>Official EU definitions</span>
            </div>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="#government-debt-in-one-sentence">Start the explanation <ArrowIcon /></a>
              <Link className={styles.secondaryAction} href="/">Open the live EU map</Link>
            </div>
          </div>
          <HeroLedger />
        </div>
      </section>

      <nav className={styles.chapterNav} aria-label="On this page">
        <div>
          <span>Explore</span>
          <a href="#government-debt-in-one-sentence">Definition</a>
          <a href="#how-government-debt-works">Borrowing cycle</a>
          <a href="#debt-vs-deficit">Debt vs deficit</a>
          <a href="#who-holds-government-debt">Debt holders</a>
          <a href="#why-debt-to-gdp-matters">Debt-to-GDP</a>
        </div>
      </nav>

      <section className={styles.definitionSection} id="government-debt-in-one-sentence" aria-labelledby="definition-title">
        <div className={styles.definitionLead}>
          <p className={styles.eyebrow}>Government debt in one sentence</p>
          <h2 id="definition-title">Government debt is the outstanding amount a state still owes after borrowing.</h2>
          <p>In EU statistics, government debt is measured as consolidated gross debt at nominal value. It covers the currency and deposits, debt securities and loans that remain outstanding for the general government sector.</p>
          <SourceLink href="https://ec.europa.eu/eurostat/cache/metadata/en/gov_10q_ggdebt_esms.htm">Eurostat definition of quarterly government debt</SourceLink>
        </div>
        <DefinitionStrip />
      </section>

      <DebtMechanismStory />
      <DebtBuilder />

      <section className={styles.holdersSection} id="who-holds-government-debt" aria-labelledby="holders-title">
        <div className={styles.holdersGraphic} aria-hidden="true">
          <div className={styles.holderOrbit}>
            <div className={styles.holderCore}><span>Government</span><strong>BOND</strong><small>principal + interest</small></div>
            <span className={`${styles.holder} ${styles.holderBanks}`}>Banks</span>
            <span className={`${styles.holder} ${styles.holderPensions}`}>Pension funds</span>
            <span className={`${styles.holder} ${styles.holderForeign}`}>Foreign investors</span>
            <span className={`${styles.holder} ${styles.holderCentral}`}>Central banks</span>
            <span className={`${styles.holder} ${styles.holderHouseholds}`}>Households</span>
          </div>
        </div>
        <div className={styles.holdersCopy}>
          <p className={styles.eyebrow}>Who holds government debt?</p>
          <h2 id="holders-title">A government’s liability is someone else’s asset.</h2>
          <p>Banks, pension funds, insurers, investment funds, households, foreign investors and central banks can all hold government bonds. Some investors buy them for income, others for liquidity, collateral or long-term matching of liabilities.</p>
          <p>The ownership mix matters because it affects demand, refinancing conditions and how financial stress can spread between governments, banks and markets.</p>
          <SourceLink href="https://www.ecb.europa.eu/press/economic-bulletin/articles/2021/html/ecb.ebart202103_02~6612ab7923.en.html">ECB analysis of government debt holders</SourceLink>
        </div>
      </section>

      <section className={styles.riskSection} aria-labelledby="risk-title">
        <div className={styles.riskHeading}>
          <p className={styles.eyebrow}>When does debt become a problem?</p>
          <h2 id="risk-title">The number alone is not the verdict.</h2>
          <p>Debt pressure emerges from the interaction between the debt stock, borrowing costs, economic growth and confidence in public institutions.</p>
        </div>
        <div className={styles.riskLines}>
          <div><span>01</span><h3>Interest costs</h3><p>Higher yields gradually raise the cost of refinancing and can absorb more public revenue.</p></div>
          <div><span>02</span><h3>Economic growth</h3><p>A growing economy can make an unchanged debt stock easier to carry relative to national income.</p></div>
          <div><span>03</span><h3>Debt maturity</h3><p>Longer maturities slow the speed at which market rates feed into the government’s interest bill.</p></div>
          <div><span>04</span><h3>Market confidence</h3><p>Credible institutions and fiscal plans influence whether investors continue to lend at manageable rates.</p></div>
        </div>
      </section>

      <section className={styles.euSection} aria-labelledby="eu-context-title">
        <div className={styles.euHeader}>
          <div><p className={styles.eyebrow}>EU context · {latestPeriod || "latest quarter"}</p><h2 id="eu-context-title">Public debt is shared unevenly across Europe.</h2></div>
          <div className={styles.euTotal}>
            <span>Sum of available national observations</span>
            <strong>€{formatTrillions(summedDebt)}tn</strong>
            <small>{currentCountries.length} EU countries at the common reference period</small>
          </div>
        </div>
        <div className={styles.countryBars}>
          {largestCountries.map((country, index) => (
            <Link href={`/country/${country.code.toLowerCase()}`} className={styles.countryBarRow} key={country.code}>
              <span className={styles.countryRank}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.countryName}>{country.name}</span>
              <span className={styles.countryTrack}><i style={{ width: `${(country.last_value_eur / largestValue) * 100}%` }} /></span>
              <strong>€{formatBillions(country.last_value_eur)}bn</strong>
            </Link>
          ))}
        </div>
        <p className={styles.euMethodNote}>This is EU Debt Map’s sum of national Eurostat observations for scale, not Eurostat’s separately consolidated EU aggregate. Loans between Member States can require different consolidation in an official EU aggregate.<Link href="/methodology"> Read the methodology.</Link></p>
      </section>

      <section className={styles.ratioSection} id="why-debt-to-gdp-matters" aria-labelledby="ratio-title">
        <div className={styles.ratioCopy}>
          <p className={styles.eyebrow}>Why debt-to-GDP matters</p>
          <h2 id="ratio-title">€500 billion does not mean the same thing in every economy.</h2>
          <p>Debt-to-GDP compares the debt stock with one year of economic output. It does not measure affordability perfectly, but it provides a common scale for countries of very different sizes.</p>
          <p>The EU treaty reference value is 60% of GDP. It is a fiscal reference, not an automatic line between “safe” and “unsafe”: direction, interest costs, maturity, growth and institutional credibility still matter.</p>
          <div className={styles.ratioLinks}>
            <Link href="/debt-to-gdp">Explore the EU debt-to-GDP ranking <ArrowIcon /></Link>
            <SourceLink href="https://eur-lex.europa.eu/eli/treaty/tfeu_2016/pro_12/oj/eng">Protocol No 12 on the excessive deficit procedure</SourceLink>
          </div>
        </div>
        <div className={styles.ratioVisual} role="img" aria-label="Illustrative debt-to-GDP scale with the EU 60 percent reference value">
          <div className={styles.ratioNumber}>60<span>%</span></div>
          <div className={styles.ratioRule}><span /><i /></div>
          <div className={styles.ratioLabels}><span>0%</span><strong>EU reference value</strong><span>120%+</span></div>
          <p>Reference point, not a standalone sustainability test.</p>
        </div>
      </section>

      <section className={styles.faqSection} aria-labelledby="faq-title">
        <div className={styles.faqHeading}><p className={styles.eyebrow}>Questions, answered</p><h2 id="faq-title">Government debt FAQ</h2></div>
        <div className={styles.faqList}>
          {faqItems.map((item, index) => (
            <details key={item.question}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span>{item.question}<i aria-hidden="true" /></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.sourcesSection} aria-labelledby="sources-title">
        <div><p className={styles.eyebrow}>Evidence and definitions</p><h2 id="sources-title">Primary sources</h2><p>The guide was reviewed against official European statistical definitions and institutional documentation on 28 August 2026.</p></div>
        <ol>
          <li><SourceLink href="https://ec.europa.eu/eurostat/cache/metadata/en/gov_10q_ggdebt_esms.htm">Eurostat — Quarterly government debt metadata</SourceLink></li>
          <li><SourceLink href="https://ec.europa.eu/eurostat/cache/metadata/en/gov_10dd_esms.htm">Eurostat — Government deficit and debt definitions</SourceLink></li>
          <li><SourceLink href="https://commission.europa.eu/strategy-and-policy/eu-budget/eu-borrower-investor-relations/how-eu-issuance-works_en">European Commission — How EU bond issuance works</SourceLink></li>
          <li><SourceLink href="https://eur-lex.europa.eu/eli/treaty/tfeu_2016/pro_12/oj/eng">EUR-Lex — Protocol No 12 on the excessive deficit procedure</SourceLink></li>
        </ol>
      </section>

      <section className={styles.nextSection} aria-labelledby="next-title">
        <div><p className={styles.eyebrow}>Continue exploring</p><h2 id="next-title">See the mechanism in real EU data.</h2></div>
        <div className={styles.nextLinks}>
          <Link href="/"><span>01</span><strong>Live EU debt map</strong><ArrowIcon /></Link>
          <Link href="/debt-to-gdp"><span>02</span><strong>Debt-to-GDP ranking</strong><ArrowIcon /></Link>
          <Link href="/debt-vs-deficit"><span>03</span><strong>Debt vs deficit</strong><ArrowIcon /></Link>
          <Link href="/methodology"><span>04</span><strong>Data methodology</strong><ArrowIcon /></Link>
        </div>
      </section>
    </div>
  );
}
