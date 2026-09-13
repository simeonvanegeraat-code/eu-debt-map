import Link from "next/link";
import growth from "@/lib/fiscal/growth.gen.json";
import balance from "@/lib/fiscal/balance.gen.json";
import interest from "@/lib/fiscal/interest.gen.json";
import accounts from "@/lib/fiscal/accounts.gen.json";
import perCapita from "@/lib/fiscal/per-capita.gen.json";
import { countries } from "@/lib/data";
import { countryName } from "@/lib/countries";
import { countryGrowthPoints, endpointChange, growthRows } from "@/lib/fiscal/growth";
import { balanceRows } from "@/lib/fiscal/balance-core";
import { interestRows } from "@/lib/fiscal/interest";
import { accountPoints, accountRows } from "@/lib/fiscal/accounts";
import { perCapitaRows } from "@/lib/fiscal/per-capita";
import CountryIntro from "@/components/CountryIntro";
import CountryRelatedArticleServer from "@/components/CountryRelatedArticleServer";
import ShareBar from "@/components/ShareBar";
import { getCountryCopy } from "@/components/country/country-copy";
import CountryPreviewHero from "./CountryPreviewHero";
import CountryDebtTrend from "./CountryDebtTrend";
import typography from "@/components/typography/typography.module.css";
import countryStyles from "@/components/country/country-page.module.css";
import styles from "./country-preview.module.css";

function quarter(value) {
  const match = /^(\d{4})-?Q([1-4])$/i.exec(String(value || ""));
  return match ? `${match[1]} Q${match[2]}` : value || "—";
}

function money(value, compact = true) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 2 : 0,
  }).format(value);
}

function percent(value, signed = false) {
  if (!Number.isFinite(value)) return "—";
  const sign = signed && value > 0 ? "+" : "";
  return `${sign}${new Intl.NumberFormat("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value)}%`;
}

function points(value, signed = true) {
  if (!Number.isFinite(value)) return "—";
  return `${signed && value > 0 ? "+" : ""}${new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 }).format(value)} pp`;
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

export default function CountryPreviewExperience({ country, lang = "en", title, isPreview = false }) {
  const name = countryName(country.code, lang);
  const copy = getCountryCopy(lang);
  const rankedDebt = [...countries]
    .filter((item) => Number.isFinite(Number(item.official_debt_to_gdp_pct)))
    .sort((a, b) => Number(b.official_debt_to_gdp_pct) - Number(a.official_debt_to_gdp_pct));
  const rank = rankedDebt.findIndex((item) => item.code === country.code) + 1;
  const ratios = rankedDebt.map((item) => Number(item.official_debt_to_gdp_pct)).sort((a, b) => a - b);
  const middle = Math.floor(ratios.length / 2);
  const median = ratios.length % 2 ? ratios[middle] : (ratios[middle - 1] + ratios[middle]) / 2;
  const scaleMax = 160;

  const debtPoints = countryGrowthPoints(growth, country.code);
  const fiveYearGrowth = endpointChange(debtPoints, growth.latestQuarter, 5, "debt");
  const fiveYearRatio = endpointChange(debtPoints, growth.latestQuarter, 5, "ratio");
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
  const publicUrl = `https://www.eudebtmap.com/country/${country.code.toLowerCase()}`;

  return (
    <article className={`${styles.page} ${typography.page}`} lang={lang}>
      <CountryPreviewHero country={country} name={name} title={title} rank={rank} count={rankedDebt.length} isPreview={isPreview} />

      <nav className={styles.chapterNav} aria-label="On this page">
        <div className={styles.shell}>
          <a href="#debt-now">Debt now</a>
          <a href="#recent-change">Latest quarter</a>
          <a href="#debt-trend">Debt trend</a>
          <a href="#snapshot">At a glance</a>
          <a href="#eu-context">EU context</a>
          <a href="#sources">Sources</a>
        </div>
      </nav>

      <div>
        <section className={`${styles.updateStrip} ${styles.shell}`} id="recent-change" aria-labelledby="recent-change-title">
          <div className={styles.updateHeading}>
            <p className={styles.eyebrow}>Latest official update</p>
            <h2 id="recent-change-title">The newest quarter, without repeating the story</h2>
          </div>
          <dl>
            <div><dt>Official debt</dt><dd>{money(officialDebt)}</dd><small>{quarter(country.official_latest_time)}</small></div>
            <div><dt>Quarterly change</dt><dd>{quarterChange > 0 ? "+" : ""}{money(quarterChange)}</dd><small>{quarter(country.official_previous_time)} → {quarter(country.official_latest_time)}</small></div>
            <div><dt>Modelled pace</dt><dd>{pace > 0 ? "+" : pace < 0 ? "−" : ""}{money(Math.abs(pace), false)}/s</dd><small>Derived from the latest two official quarters</small></div>
          </dl>
          <p>The live value extends this measured pace beyond the official quarter end. Annual fiscal figures below do not move with the counter.</p>
        </section>

        <div className={styles.shell}>
          <CountryDebtTrend points={debtPoints} name={name} latestQuarter={growth.latestQuarter} />
        </div>

        <section className={`${styles.section} ${styles.snapshot} ${styles.shell}`} id="snapshot" aria-labelledby="snapshot-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Government finances in brief</p>
              <h2 id="snapshot-title">{name} at a glance</h2>
              <p>Five useful signals, each with its own period and a direct route to the full European comparison.</p>
            </div>
          </div>
          <div className={styles.cardGrid}>
            <MetricCard title="Debt per resident" value={money(capita.displayValue, false)} period={`Calculated · ${perCapita.debtDate}`} signal={`EU rank: ${capita.rank} of 27, highest first`} text="A statistical comparison, not a personal amount owed by each resident." href="/debt-per-capita" cta="Compare debt per resident across Europe" />
            <MetricCard title="Debt growth" value={percent(fiveYearGrowth.percent, true)} period={`${quarter(fiveYearGrowth.start)} → ${quarter(fiveYearGrowth.end)}`} signal={`EU rank: ${growthRank.rank} of 27 by five-year growth`} text={`Debt / GDP changed by ${points(fiveYearRatio.change)} over the same period.`} href="/debt-growth" cta={`Compare ${name}’s debt growth across Europe`} />
            <MetricCard title="Budget balance" value={percent(balanceRow.balance, true)} period={`Official · ${balance.latestCompleteYear}`} signal={`EU rank: ${balanceRow.rank} of 27 by budget balance`} text={balanceRow.balance >= 0 ? "A surplus for the stated calendar year." : "A deficit for the stated calendar year."} href="/deficit" cta="Compare budget balances across Europe" />
            <MetricCard title="Annual interest expenditure" value={money(interestRow.amount)} period={`Official · ${interest.latestYear}`} signal={`EU rank: ${interestRow.rank} of 27 by interest / GDP`} text={`${percent(interestRow.ratio)} of GDP; an annual expense, not an observed bond yield.`} href="/interest-cost" cta="Compare interest costs across Europe" />
            <MetricCard
              title="Spending and revenue"
              period={`Official · ${accounts.latestYear}`}
              signal={`Spending rank: ${spendingRank.rank} of 27, highest first`}
              text="Both figures cover the same calendar year and are shown as a share of GDP."
              href="/government-spending"
              cta="Compare spending and revenue across Europe"
              values={<dl className={styles.accountValues}><div><dt>Spending</dt><dd>{percent(account.expenditureRatio)}</dd></div><div><dt>Revenue</dt><dd>{percent(account.revenueRatio)}</dd></div></dl>}
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
        ) : null}

        <section className={`${styles.section} ${styles.euContext} ${styles.shell}`} id="eu-context" aria-labelledby="eu-context-title">
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>European debt context</p><h2 id="eu-context-title">Put {name}’s debt ratio in context</h2><p>One debt comparison only. Broader fiscal comparisons stay on their dedicated topic pages.</p></div>
            <div className={styles.rankBadge}><span>EU position</span><strong>#{rank} / 27</strong><small>{quarter(country.official_debt_to_gdp_time)}</small></div>
          </div>
          <div className={styles.ratioChart}>
            <div className={styles.referenceLabel}>60% reference</div>
            <div className={styles.ratioRow}><span>{name}</span><div><i style={{ width: `${country.official_debt_to_gdp_pct / scaleMax * 100}%` }} /></div><strong>{percent(country.official_debt_to_gdp_pct)}</strong></div>
            <div className={styles.ratioRow}><span>EU-country median</span><div><i style={{ width: `${median / scaleMax * 100}%` }} /></div><strong>{percent(median)}</strong></div>
          </div>
          <p className={styles.contextNote}>The median describes the middle EU country. The 60% line is a treaty reference, not a pass-or-fail test for debt sustainability.</p>
          <Link className={styles.primaryLink} href="/debt-to-gdp">View the complete EU ranking <span aria-hidden="true">→</span></Link>
        </section>

        <section className={`${styles.section} ${styles.sources} ${styles.shell}`} id="sources" aria-labelledby="sources-title">
          <div className={styles.sourceIntro}>
            <p className={styles.eyebrow}>About this debt monitor</p>
            <h2 id="sources-title">Official debt first. The live number clearly labelled.</h2>
            <p>Eurostat provides the official quarterly government-debt observations. EU Debt Map extends the latest measured change into a live display so the official and modelled figures remain visibly distinct.</p>
            <strong>The live debt is an estimate, not a new official observation and not a forecast.</strong>
          </div>
          <dl className={styles.sourceFacts}>
            <div><dt>Official source</dt><dd>Eurostat · gov_10q_ggdebt</dd></div>
            <div><dt>Latest period</dt><dd>{quarter(country.official_latest_time)}</dd></div>
            <div><dt>Quarter end</dt><dd>{country.official_last_date}</dd></div>
          </dl>
          <div className={styles.sourceLinks}>
            <Link href="/methodology">Read the full methodology →</Link>
            <a href="https://ec.europa.eu/eurostat/cache/metadata/en/gov_10q_ggdebt_esms.htm" target="_blank" rel="noreferrer">Open Eurostat metadata ↗</a>
          </div>
          <details className={styles.methodDetails}>
            <summary>How the live estimate is calculated</summary>
            <ol>
              <li><strong>Anchor</strong><span>Start with the official debt stock for {quarter(country.official_latest_time)}.</span></li>
              <li><strong>Measure</strong><span>Measure the change from {quarter(country.official_previous_time)} to {quarter(country.official_latest_time)} and convert it to a constant pace per second.</span></li>
              <li><strong>Extend</strong><span>Apply that pace after {country.official_last_date}. The source code is Eurostat gov_10q_ggdebt, frequency Q, sector S13, item GD, unit MIO_EUR.</span></li>
            </ol>
            <p>This deliberately simple model does not react to events after the official anchor and must never be read as an official real-time observation.</p>
          </details>
        </section>

        <section className={`${styles.countryContext} ${styles.shell}`} aria-label={`About ${name}'s public debt`}><CountryIntro country={country} lang={lang} /></section>
        <section className={`${styles.related} ${styles.shell}`}>
          <CountryRelatedArticleServer code={country.code} lang={lang} />
          <div className={styles.shareWrap}><ShareBar url={publicUrl} title={`${name} public debt`} summary={title} lang={lang} variant="country" /></div>
        </section>
      </div>
    </article>
  );
}
