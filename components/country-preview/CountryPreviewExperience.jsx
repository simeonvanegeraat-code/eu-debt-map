import Link from "next/link";
import growth from "@/lib/fiscal/growth.gen.json";
import balance from "@/lib/fiscal/balance.gen.json";
import interest from "@/lib/fiscal/interest.gen.json";
import accounts from "@/lib/fiscal/accounts.gen.json";
import perCapita from "@/lib/fiscal/per-capita.gen.json";
import { countries } from "@/lib/data";
import { countryName } from "@/lib/countries";
import { countryGrowthPoints, growthRows } from "@/lib/fiscal/growth";
import { balanceRows } from "@/lib/fiscal/balance-core";
import { interestRows } from "@/lib/fiscal/interest";
import { accountPoints, accountRows } from "@/lib/fiscal/accounts";
import { perCapitaRows } from "@/lib/fiscal/per-capita";
import CountryIntro from "@/components/CountryIntro";
import CountryRelatedArticleServer from "@/components/CountryRelatedArticleServer";
import ShareBar from "@/components/ShareBar";
import { getCountryCopy, localeBase, localeFor } from "@/components/country/country-copy";
import { fiscalPath } from "@/lib/fiscal/paths";
import CountryPreviewHero from "./CountryPreviewHero";
import CountryDebtTrend from "./CountryDebtTrend";
import { getCountryRedesignCopy } from "./country-redesign-copy";
import typography from "@/components/typography/typography.module.css";
import countryStyles from "@/components/country/country-page.module.css";
import styles from "./country-preview.module.css";

function quarter(value, lang) {
  const match = /^(\d{4})-?Q([1-4])$/i.exec(String(value || ""));
  if (!match) return value || "—";
  return lang === "fr" ? `T${match[2]} ${match[1]}` : `${match[1]} Q${match[2]}`;
}

function money(value, locale, compact = true) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 2 : 0,
  }).format(value);
}

function percent(value, locale, signed = false) {
  if (!Number.isFinite(value)) return "—";
  const sign = signed && value > 0 ? "+" : "";
  return `${sign}${new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value)}%`;
}

function MetricCard({ title, value, period, signal, text, href, cta, values = null }) {
  return (
    <article className={styles.metricCard}>
      <div>
        <p>{title}</p>
        {values || <strong>{value}</strong>}
        <span>{period}</span>
      </div>
      <p className={styles.metricSignal}>{signal}</p>
      <p className={styles.metricText}>{text}</p>
      <Link href={href}>{cta} <span aria-hidden="true">→</span></Link>
    </article>
  );
}

export default function CountryPreviewExperience({
  country,
  lang = "en",
  title,
  displayName = null,
  breadcrumbSlot = null,
  introSlot = null,
  relatedArticleSlot = null,
  shareSlot = null,
  adSlot = null,
  isPreview = false,
}) {
  const name = displayName || countryName(country.code, lang);
  const locale = localeFor(lang);
  const base = localeBase(lang);
  const copy = getCountryCopy(lang);
  const redesign = getCountryRedesignCopy(lang);
  const rankedDebt = [...countries]
    .filter((item) => Number.isFinite(Number(item.official_debt_to_gdp_pct)))
    .sort((a, b) => Number(b.official_debt_to_gdp_pct) - Number(a.official_debt_to_gdp_pct));
  const rank = rankedDebt.findIndex((item) => item.code === country.code) + 1;
  const ratios = rankedDebt.map((item) => Number(item.official_debt_to_gdp_pct)).sort((a, b) => a - b);
  const middle = Math.floor(ratios.length / 2);
  const median = ratios.length % 2 ? ratios[middle] : (ratios[middle - 1] + ratios[middle]) / 2;
  const debtPoints = countryGrowthPoints(growth, country.code);
  const growthRank = growthRows(growth, 5, "percent").find((row) => row.code === country.code);
  const capita = perCapitaRows(perCapita).find((row) => row.code === country.code);
  const balanceRow = balanceRows(balance).find((row) => row.code === country.code);
  const interestRow = interestRows(interest, "ratio").find((row) => row.code === country.code);
  const account = accountPoints(accounts, country.code).at(-1);
  const spendingRank = accountRows(accounts, "expenditureRatio").find((row) => row.code === country.code);
  const officialDebt = Number(country.last_value_eur);
  const previousDebt = Number(country.prev_value_eur);
  const quarterChange = officialDebt - previousDebt;
  const pace = Number(country._perSecond);
  const publicUrl = `https://www.eudebtmap.com${base}/country/${country.code.toLowerCase()}`;
  const latestQuarter = quarter(country.official_latest_time, lang);
  const previousQuarter = quarter(country.official_previous_time, lang);

  return (
    <article className={`${styles.page} ${typography.page}`} lang={lang}>
      <CountryPreviewHero country={country} name={name} title={title} rank={rank} count={rankedDebt.length} lang={lang} breadcrumbSlot={breadcrumbSlot} isPreview={isPreview} />

      <nav className={styles.chapterNav} aria-label={copy.pageNav}>
        <div className={styles.shell}>
          <a href="#debt-picture">{redesign.nav.debt}</a>
          <a href="#snapshot">{redesign.nav.finances}</a>
          <a href="#sources">{redesign.nav.sources}</a>
          <a href="#country-context">{redesign.nav.about} {name}</a>
        </div>
      </nav>

      <div>
        <section className={`${styles.debtWorkspace} ${styles.shell}`} id="debt-picture" aria-labelledby="debt-picture-title">
          <header className={styles.debtWorkspaceHeading}>
            <p className={styles.eyebrow}>{redesign.debtEyebrow}</p>
            <h2 id="debt-picture-title">{redesign.debtTitle(name)}</h2>
            <p>{redesign.debtIntro}</p>
          </header>

          <div className={styles.officialUpdate}>
            <p>{redesign.latestQuarter}</p>
            <dl>
              <div><dt>{redesign.officialDebt}</dt><dd>{money(officialDebt, locale)}</dd><small>{latestQuarter}</small></div>
              <div><dt>{redesign.quarterlyChange}</dt><dd>{quarterChange > 0 ? "+" : ""}{money(quarterChange, locale)}</dd><small>{previousQuarter} → {latestQuarter}</small></div>
              <div><dt>{redesign.modelledPace}</dt><dd>{pace > 0 ? "+" : pace < 0 ? "−" : ""}{money(Math.abs(pace), locale, false)}/s</dd><small>{redesign.paceBasis}</small></div>
            </dl>
            <span>{redesign.paceNote}</span>
          </div>

          <CountryDebtTrend
            points={debtPoints}
            name={name}
            latestQuarter={growth.latestQuarter}
            ratio={Number(country.official_debt_to_gdp_pct)}
            rank={rank}
            count={rankedDebt.length}
            median={median}
            growthRank={growthRank.rank}
            lang={lang}
            growthLink={<Link href={fiscalPath("/debt-growth", lang)}>{redesign.growthCta(name)} <span aria-hidden="true">→</span></Link>}
            ratioLink={<Link href={fiscalPath("/debt-to-gdp", lang)}>{redesign.rankingCta} <span aria-hidden="true">→</span></Link>}
          />
        </section>

        <section className={`${styles.section} ${styles.snapshot} ${styles.shell}`} id="snapshot" aria-labelledby="snapshot-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>{redesign.snapshotEyebrow}</p>
              <h2 id="snapshot-title">{redesign.snapshotTitle}</h2>
              <p>{redesign.snapshotIntro}</p>
            </div>
          </div>
          <div className={styles.cardGrid}>
            <MetricCard title={redesign.perCapita} value={money(capita.displayValue, locale, false)} period={`${redesign.calculated} · ${perCapita.debtDate}`} signal={redesign.perCapitaSignal(capita.rank)} text={redesign.perCapitaText} href={fiscalPath("/debt-per-capita", lang)} cta={redesign.perCapitaCta} />
            <MetricCard title={redesign.balance} value={percent(balanceRow.balance, locale, true)} period={`${redesign.official} · ${balance.latestCompleteYear}`} signal={redesign.balanceSignal(balanceRow.rank)} text={redesign.balanceText(balanceRow.balance)} href={fiscalPath("/deficit", lang)} cta={redesign.balanceCta} />
            <MetricCard title={redesign.interest} value={money(interestRow.amount, locale)} period={`${redesign.official} · ${interest.latestYear}`} signal={redesign.interestSignal(interestRow.rank)} text={redesign.interestText(percent(interestRow.ratio, locale))} href={fiscalPath("/interest-cost", lang)} cta={redesign.interestCta} />
            <MetricCard
              title={redesign.accounts}
              period={`${redesign.official} · ${accounts.latestYear}`}
              signal={redesign.accountsSignal(spendingRank.rank)}
              text={redesign.accountsText}
              href={fiscalPath("/government-spending", lang)}
              cta={redesign.accountsCta}
              values={<dl className={styles.accountValues}><div><dt>{redesign.spending}</dt><dd>{percent(account.expenditureRatio, locale)}</dd></div><div><dt>{redesign.revenue}</dt><dd>{percent(account.revenueRatio, locale)}</dd></div></dl>}
            />
          </div>
        </section>

        {isPreview ? (
          <aside className={`${countryStyles.adPreview} ${styles.shell}`} aria-label={copy.recommendedAd}>
            <div className={countryStyles.adPreviewLabel}>
              <span>{copy.advertisement}</span>
              <small>{copy.recommendedAd}</small>
            </div>
            <div className={countryStyles.adPreviewCanvas}>
              <span>{copy.adPlaceholder}</span>
              <small>{copy.adDetail}</small>
            </div>
          </aside>
        ) : adSlot ? <aside className={`${styles.publicAd} ${styles.shell}`} aria-label={copy.advertisement}>{adSlot}</aside> : null}

        <section className={`${styles.section} ${styles.sources} ${styles.shell}`} id="sources" aria-labelledby="sources-title">
          <div className={styles.sourceIntro}>
            <p className={styles.eyebrow}>{redesign.sourcesEyebrow}</p>
            <h2 id="sources-title">{redesign.sourcesTitle}</h2>
            <p>{redesign.sourcesIntro}</p>
            <strong>{redesign.liveWarning}</strong>
          </div>
          <dl className={styles.sourceFacts}>
            <div><dt>{redesign.source}</dt><dd>Eurostat · gov_10q_ggdebt</dd></div>
            <div><dt>{redesign.latestPeriod}</dt><dd>{latestQuarter}</dd></div>
            <div><dt>{redesign.quarterEnd}</dt><dd>{country.official_last_date}</dd></div>
          </dl>
          <div className={styles.sourceLinks}>
            <Link href={`${base}/methodology`}>{redesign.methodology} →</Link>
            <a href="https://ec.europa.eu/eurostat/cache/metadata/en/gov_10q_ggdebt_esms.htm" target="_blank" rel="noreferrer">{redesign.eurostat} ↗</a>
          </div>
          <details className={styles.methodDetails}>
            <summary>{redesign.details}</summary>
            <ol>
              {redesign.steps.map(([label, text], index) => (
                <li key={label}>
                  <strong>{label}</strong>
                  <span>{index === 0 ? text(latestQuarter) : text(previousQuarter, latestQuarter, country.official_last_date)}</span>
                </li>
              ))}
            </ol>
            <p>{redesign.detailsNote}</p>
          </details>
        </section>

        <section className={`${styles.countryContext} ${styles.shell}`} id="country-context">
          <div className={styles.introSlot}>{introSlot || <CountryIntro country={country} lang={lang} />}</div>
          {lang === "nl" && country.code === "NL" && !isPreview ? (
            <Link className={styles.bondGuideLink} href="/nl/staatsobligaties-nederland">
              <span><small>Praktische gids</small><strong>Nederlandse staatsobligaties kopen: hoe werkt dat?</strong></span>
              <p>Kooproute, ISIN, marktprijs, kosten en risico’s uitgelegd.</p>
              <b aria-hidden="true">→</b>
            </Link>
          ) : null}
        </section>
        <section className={`${styles.related} ${styles.shell}`}>
          {relatedArticleSlot || <CountryRelatedArticleServer code={country.code} lang={lang} />}
          <div className={styles.shareWrap}>{shareSlot || <ShareBar url={publicUrl} title={title} summary={title} lang={lang} variant="country" />}</div>
        </section>
      </div>
    </article>
  );
}
