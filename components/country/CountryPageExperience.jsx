"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { countries, interpolateDebt } from "@/lib/data";
import { countryName } from "@/lib/countries";
import { getCountryCopy, localeBase, localeFor } from "./country-copy";
import styles from "./country-page.module.css";

const COMPARISON_CODES = ["GR", "IT", "FR", "NL", "EE"];
const MAJOR_CODES = ["DE", "FR", "IT", "ES", "NL", "PL", "BE", "SE"];

function formatQuarter(value, lang) {
  const match = /^(\d{4})-?Q([1-4])$/i.exec(String(value || ""));
  if (!match) return value || "—";
  return lang === "fr" ? `T${match[2]} ${match[1]}` : `${match[1]} Q${match[2]}`;
}

function formatDate(value, locale) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

function pageTitleFor(lang, name) {
  if (lang === "nl") return `Staatsschuld ${name} (live)`;
  if (lang === "de") return `${name} Schuldenuhr (live)`;
  if (lang === "fr") return `Dette publique ${name} (en direct)`;
  return `${name} public debt (live)`;
}

function buildExploreCountries(currentCode, lang) {
  const list = [...countries].sort((a, b) =>
    countryName(a.code, lang).localeCompare(countryName(b.code, lang), localeFor(lang))
  );
  const index = list.findIndex((item) => item.code === currentCode);
  const selected = [];

  function add(item) {
    if (!item || item.code === currentCode || selected.some((entry) => entry.code === item.code)) {
      return;
    }
    const ratio = Number(item.official_debt_to_gdp_pct);
    if (!Number.isFinite(ratio) || ratio <= 0) return;
    selected.push({ code: item.code, name: countryName(item.code, lang), ratio });
  }

  if (index >= 0) {
    add(list[(index - 1 + list.length) % list.length]);
    add(list[(index + 1) % list.length]);
  }
  for (const code of MAJOR_CODES) add(countries.find((item) => item.code === code));
  return selected.slice(0, 5);
}

function buildComparisons(currentCountry, lang) {
  const codes = [...new Set([...COMPARISON_CODES, currentCountry.code])];
  return codes
    .map((code) => countries.find((item) => item.code === code))
    .filter(Boolean)
    .map((item) => ({
      code: item.code,
      name: countryName(item.code, lang),
      ratio: Number(item.official_debt_to_gdp_pct),
    }))
    .filter((item) => Number.isFinite(item.ratio) && item.ratio > 0)
    .sort((a, b) => b.ratio - a.ratio);
}

function Metric({ label, value, detail, accent = false }) {
  return (
    <div className={styles.metric}>
      <span>{label}</span>
      <strong className={accent ? styles.metricAccent : undefined}>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

export default function CountryPageExperience({
  country,
  lang = "en",
  title = null,
  displayName = null,
  rank = null,
  rankedCount = null,
  euMedian = null,
  comparisons = null,
  exploreCountries = null,
  gdpAbs = null,
  gdpPeriod = null,
  introSlot = null,
  breadcrumbSlot = null,
  adSlot = null,
  shareSlot = null,
  mapSlot = null,
  relatedArticleSlot = null,
  isPreview = false,
}) {
  const effLang = ["en", "nl", "de", "fr"].includes(lang) ? lang : "en";
  const copy = getCountryCopy(effLang);
  const locale = localeFor(effLang);
  const base = localeBase(effLang);
  const name = displayName || countryName(country.code, effLang);
  const pageTitle = title || pageTitleFor(effLang, name);

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
    [locale]
  );
  const compactFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 2 }),
    [locale]
  );
  const ratioFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    [locale]
  );

  const ranked = useMemo(
    () =>
      countries
        .map((item) => ({ code: item.code, ratio: Number(item.official_debt_to_gdp_pct) }))
        .filter((item) => Number.isFinite(item.ratio) && item.ratio > 0)
        .sort((a, b) => b.ratio - a.ratio),
    []
  );

  const officialDebt = Number(country.last_value_eur);
  const previousDebt = Number(country.prev_value_eur);
  const officialRatio = Number(country.official_debt_to_gdp_pct);
  const fallbackRatio =
    Number.isFinite(Number(gdpAbs)) && Number(gdpAbs) > 0
      ? (officialDebt / Number(gdpAbs)) * 100
      : null;
  const ratio =
    Number.isFinite(officialRatio) && officialRatio > 0 ? officialRatio : fallbackRatio;
  const ratioPeriod =
    Number.isFinite(officialRatio) && officialRatio > 0
      ? country.official_debt_to_gdp_time
      : gdpPeriod;
  const resolvedRank = rank || ranked.findIndex((item) => item.code === country.code) + 1;
  const resolvedCount = rankedCount || ranked.length;
  const sortedRatios = ranked.map((item) => item.ratio).sort((a, b) => a - b);
  const middle = Math.floor(sortedRatios.length / 2);
  const calculatedMedian = sortedRatios.length
    ? sortedRatios.length % 2
      ? sortedRatios[middle]
      : (sortedRatios[middle - 1] + sortedRatios[middle]) / 2
    : null;
  const resolvedMedian =
    euMedian !== null && euMedian !== undefined && Number.isFinite(Number(euMedian))
      ? Number(euMedian)
      : calculatedMedian;
  const resolvedComparisons = useMemo(
    () =>
      Array.isArray(comparisons) && comparisons.length
        ? comparisons
        : buildComparisons(country, effLang),
    [comparisons, country, effLang]
  );
  const resolvedExploreCountries = useMemo(
    () =>
      Array.isArray(exploreCountries) && exploreCountries.length
        ? exploreCountries
        : buildExploreCountries(country.code, effLang),
    [exploreCountries, country.code, effLang]
  );

  const [now, setNow] = useState(() => Date.now());
  const [showOfficial, setShowOfficial] = useState(false);

  useEffect(() => {
    if (country.isDebtTickerFrozen) return undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const interval = window.setInterval(() => setNow(Date.now()), reducedMotion ? 1000 : 180);
    return () => window.clearInterval(interval);
  }, [country.isDebtTickerFrozen]);

  const liveDebt = useMemo(() => interpolateDebt(country, now), [country, now]);
  const quarterlyChange = officialDebt - previousDebt;
  const shownDebt = showOfficial ? officialDebt : liveDebt;
  const liveChange = liveDebt - officialDebt;
  const maxComparison = Math.max(
    ...resolvedComparisons.map((item) => Number(item.ratio) || 0),
    100
  );
  const referencePosition = Math.min((60 / maxComparison) * 100, 100);
  const movementDirection =
    quarterlyChange > 0 ? copy.rising : quarterlyChange < 0 ? copy.falling : copy.unchanged;
  const signedCompact = (value) => {
    const sign = value > 0 ? "+" : value < 0 ? "−" : "";
    return `${sign}€${compactFormatter.format(Math.abs(value))}`;
  };
  const ratioText = Number.isFinite(ratio) ? `${ratioFormatter.format(ratio)}%` : "—";
  const currentHref = `${base}/country/${country.code.toLowerCase()}`;
  const overviewHref = base || "/";
  const methodHref = `${base}/methodology`;
  const officialPeriodsAvailable = Boolean(
    country.hasOfficialDebtSeries && country.official_previous_time && country.official_latest_time
  );

  return (
    <article className={styles.page}>
      <section className={styles.hero} aria-labelledby="country-page-title">
        <div className={styles.heroInner}>
          {isPreview ? (
            <div className={styles.previewBar}>
              <span>{copy.previewLabel}</span>
              <Link href={currentHref}>{copy.viewCurrent}</Link>
            </div>
          ) : null}

          {breadcrumbSlot ? (
            <div className={styles.breadcrumbSlot}>{breadcrumbSlot}</div>
          ) : null}

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>{copy.eyebrow(name)}</p>
              <h1
                id="country-page-title"
                className={pageTitle.length > 40 ? styles.heroTitleLong : undefined}
              >
                {pageTitle}
              </h1>
              <p className={styles.lede}>{copy.lede}</p>

              <div className={styles.dataStatus}>
                <span className={styles.statusDot} aria-hidden="true" />
                <span>
                  {copy.verified} · Eurostat {formatQuarter(country.official_latest_time, effLang)}
                </span>
              </div>

              <dl className={styles.heroFacts}>
                <div>
                  <dt>{copy.debtToGdp}</dt>
                  <dd>{ratioText}</dd>
                </div>
                <div>
                  <dt>{copy.euPosition}</dt>
                  <dd>{resolvedRank > 0 ? copy.ranked(resolvedRank, resolvedCount) : "—"}</dd>
                </div>
                <div>
                  <dt>{copy.officialPeriod}</dt>
                  <dd>{formatQuarter(country.official_latest_time, effLang)}</dd>
                </div>
              </dl>
            </div>

            <div className={styles.livePanel}>
              <div className={styles.panelTopline}>
                <span>{showOfficial ? copy.officialValue : copy.liveMonitor}</span>
                <div className={styles.modeSwitch} aria-label={copy.liveMonitor}>
                  <button
                    type="button"
                    className={!showOfficial ? styles.modeActive : undefined}
                    onClick={() => setShowOfficial(false)}
                    aria-pressed={!showOfficial}
                  >
                    {copy.live}
                  </button>
                  <button
                    type="button"
                    className={showOfficial ? styles.modeActive : undefined}
                    onClick={() => setShowOfficial(true)}
                    aria-pressed={showOfficial}
                  >
                    {copy.official}
                  </button>
                </div>
              </div>

              <output className={styles.debtNumber} aria-live="off" suppressHydrationWarning>
                €{numberFormatter.format(Math.round(shownDebt))}
              </output>
              <div className={styles.debtShort} suppressHydrationWarning>
                €{compactFormatter.format(shownDebt)}
                <span>
                  {showOfficial ? formatDate(country.official_last_date, locale) : copy.modelledEstimate}
                </span>
              </div>

              <div className={styles.estimateRoute}>
                <div className={styles.routeLine} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <div className={styles.routeLabels}>
                  <span>
                    <small>{formatQuarter(country.official_previous_time, effLang)}</small>
                    <strong>€{compactFormatter.format(previousDebt)}</strong>
                  </span>
                  <span>
                    <small>{formatQuarter(country.official_latest_time, effLang)}</small>
                    <strong>€{compactFormatter.format(officialDebt)}</strong>
                  </span>
                  <span>
                    <small>{copy.estimatedNow}</small>
                    <strong suppressHydrationWarning>€{compactFormatter.format(liveDebt)}</strong>
                  </span>
                </div>
              </div>

              <p className={styles.modelNote} suppressHydrationWarning>
                {showOfficial
                  ? copy.officialObservation
                  : country.isDebtTickerFrozen
                  ? copy.frozenEstimate
                  : copy.sinceAnchor(signedCompact(liveChange))}
              </p>
            </div>
          </div>

          <a className={styles.scrollCue} href="#snapshot">
            <span>
              <small>{copy.continue}</small>
              <strong>{copy.exploreSignals}</strong>
            </span>
            <i aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M12 4v14m0 0 5-5m-5 5-5-5" />
              </svg>
            </i>
          </a>
        </div>
      </section>

      <nav className={styles.chapterNav} aria-label={copy.pageNav}>
        <div>
          <span>{name} / {country.code}</span>
          <a href="#snapshot">{copy.nav.snapshot}</a>
          <a href="#compare">{copy.nav.compare}</a>
          <a href="#movement">{copy.nav.movement}</a>
          <a href="#context">{copy.nav.context}</a>
          <a href="#method">{copy.nav.method}</a>
        </div>
      </nav>

      <section className={styles.snapshot} id="snapshot">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>{copy.snapshotEyebrow}</p>
          <h2>{copy.snapshotTitle}</h2>
          <p>{copy.snapshotIntro}</p>
        </div>

        <div className={styles.metricsGrid}>
          <Metric
            label={copy.debtToGdp}
            value={ratioText}
            detail={`${copy.official} · ${formatQuarter(ratioPeriod, effLang)}`}
            accent
          />
          <Metric
            label={copy.quarterlyMovement}
            value={signedCompact(quarterlyChange)}
            detail={`${formatQuarter(country.official_previous_time, effLang)} → ${formatQuarter(
              country.official_latest_time,
              effLang
            )}`}
          />
          <Metric
            label={copy.modelledPace}
            value={`${country._perSecond > 0 ? "+" : country._perSecond < 0 ? "−" : ""}€${numberFormatter.format(
              Math.abs(country._perSecond)
            )}/s`}
            detail={country.isDebtTickerFrozen ? copy.frozenEstimate : copy.derivedPace}
          />
          <Metric
            label={copy.euPosition}
            value={resolvedRank > 0 ? copy.ranked(resolvedRank, resolvedCount) : "—"}
            detail={copy.rankedDetail}
          />
        </div>

        <div className={styles.exploreModule} id="compare">
          <div className={styles.exploreHeader}>
            <div>
              <p className={styles.eyebrow}>{copy.compareEyebrow}</p>
              <h2>{copy.compareTitle(name)}</h2>
              <p>{copy.compareIntro}</p>
            </div>

            <Link className={styles.overviewLink} href={overviewHref}>
              <span>
                <small>{copy.allCountries(resolvedCount)}</small>
                <strong>{copy.exploreOverview}</strong>
              </span>
              <b aria-hidden="true">→</b>
            </Link>
          </div>

          <nav className={styles.countryChoices} aria-label={copy.compareAria(name)}>
            {resolvedExploreCountries.map((item) => {
              const itemRatio = Number(item.ratio);
              const difference = itemRatio - ratio;
              const direction = difference >= 0 ? copy.higher : copy.lower;

              return (
                <Link
                  href={`${base}/country/${item.code.toLowerCase()}`}
                  className={styles.countryChoice}
                  key={item.code}
                  aria-label={copy.compareLinkAria(
                    name,
                    item.name,
                    `${ratioFormatter.format(itemRatio)}%`
                  )}
                >
                  <span className={styles.choiceTopline}>
                    <i>{item.code}</i>
                    <b aria-hidden="true">↗</b>
                  </span>
                  <strong>{item.name}</strong>
                  <span className={styles.choiceRatio}>{ratioFormatter.format(itemRatio)}%</span>
                  <small>
                    {copy.difference(
                      ratioFormatter.format(Math.abs(difference)),
                      direction,
                      name
                    )}
                  </small>
                </Link>
              );
            })}
          </nav>
        </div>

        {isPreview ? (
          <aside className={styles.adPreview} aria-label={copy.recommendedAd}>
            <div className={styles.adPreviewLabel}>
              <span>{copy.advertisement}</span>
              <small>{copy.recommendedAd}</small>
            </div>
            <div className={styles.adPreviewCanvas}>
              <span>{copy.adPlaceholder}</span>
              <small>{copy.adDetail}</small>
            </div>
          </aside>
        ) : adSlot ? (
          <aside className={styles.adSlot} aria-label={copy.advertisement}>{adSlot}</aside>
        ) : null}

        {introSlot ? <div className={styles.introSlot}>{introSlot}</div> : null}
      </section>

      <section className={styles.movement} id="movement">
        <div className={styles.movementGrid}>
          <div className={styles.movementCopy}>
            <p className={styles.eyebrow}>{copy.movementEyebrow}</p>
            <h2>{copy.movementTitle}</h2>
            <p>
              {copy.movementIntro(
                name,
                `€${compactFormatter.format(previousDebt)}`,
                `€${compactFormatter.format(officialDebt)}`
              )}
            </p>
            <p className={styles.callout}>{copy.movementCallout}</p>
          </div>

          <div className={styles.quarterVisual} aria-label={copy.quarterlyMovement}>
            <div className={styles.quarterHeader}>
              <span>{copy.officialDebtStock}</span>
              <strong>{movementDirection}</strong>
            </div>
            <div className={styles.quarterBars}>
              <div className={styles.barRow}>
                <span>{formatQuarter(country.official_previous_time, effLang)}</span>
                <div>
                  <i style={{ width: `${(previousDebt / Math.max(previousDebt, officialDebt, 1)) * 100}%` }} />
                </div>
                <strong>€{compactFormatter.format(previousDebt)}</strong>
              </div>
              <div className={`${styles.barRow} ${styles.barRowLatest}`}>
                <span>{formatQuarter(country.official_latest_time, effLang)}</span>
                <div>
                  <i style={{ width: `${(officialDebt / Math.max(previousDebt, officialDebt, 1)) * 100}%` }} />
                </div>
                <strong>€{compactFormatter.format(officialDebt)}</strong>
              </div>
            </div>
            <div className={styles.deltaBadge}>
              <span>{copy.quarterOnQuarter}</span>
              <strong>{signedCompact(quarterlyChange)}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.context} id="context">
        <div className={styles.contextHeader}>
          <div>
            <p className={styles.eyebrow}>{copy.contextEyebrow}</p>
            <h2>{copy.contextTitle(name)}</h2>
          </div>
          <div className={styles.contextStatement}>
            <strong>{ratioText}</strong>
            <span>{name}</span>
            <i />
            <strong>
              {Number.isFinite(resolvedMedian) ? `${ratioFormatter.format(resolvedMedian)}%` : "—"}
            </strong>
            <span>{copy.euMedian}</span>
          </div>
        </div>

        <div className={styles.comparisonChart}>
          <div className={styles.chartScale} aria-hidden="true">
            <div className={styles.chartScaleTrack}>
              <span style={{ left: `${referencePosition}%` }}>{copy.reference}</span>
            </div>
          </div>
          {resolvedComparisons.map((item) => {
            const isCurrentCountry = item.code === country.code;
            const ratioLabel = `${ratioFormatter.format(item.ratio)}%`;
            const rowContent = (
              <>
                <span>{item.code}</span>
                <strong>{item.name}</strong>
                <div>
                  <i style={{ width: `${(item.ratio / maxComparison) * 100}%` }} />
                  <span
                    className={styles.trackReference}
                    style={{ left: `${referencePosition}%` }}
                    aria-hidden="true"
                  />
                </div>
                <b>{ratioLabel}</b>
              </>
            );

            if (isCurrentCountry) {
              return (
                <div
                  className={`${styles.compareRow} ${styles.compareRowActive}`}
                  key={item.code}
                  aria-current="true"
                >
                  {rowContent}
                </div>
              );
            }

            return (
              <Link
                className={`${styles.compareRow} ${styles.compareRowLink}`}
                href={`${base}/country/${item.code.toLowerCase()}`}
                key={item.code}
                aria-label={copy.compareLinkAria(name, item.name, ratioLabel)}
              >
                {rowContent}
              </Link>
            );
          })}
        </div>

        <p className={styles.chartNote}>{copy.chartNote}</p>
      </section>

      <section className={styles.method} id="method">
        <div className={styles.methodCard}>
          <p className={styles.eyebrow}>{copy.methodEyebrow}</p>
          <h2>{copy.methodTitle}</h2>
          <div className={styles.methodSteps}>
            {copy.methodSteps.map(([heading, text], index) => (
              <div key={heading}>
                <span>{index + 1}</span>
                <h3>{heading}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <p className={styles.methodWarning}>
            {country.isDebtTickerFrozen ? copy.frozenEstimate : copy.methodWarning}
          </p>
          <dl className={styles.sourceFacts}>
            <div>
              <dt>{copy.sourcePeriods}</dt>
              <dd>
                {officialPeriodsAvailable
                  ? `${formatQuarter(country.official_previous_time, effLang)} → ${formatQuarter(
                      country.official_latest_time,
                      effLang
                    )}`
                  : copy.fallbackSource}
              </dd>
            </div>
            <div>
              <dt>{copy.sourceDates}</dt>
              <dd>{country.official_prev_date || "—"} → {country.official_last_date || "—"}</dd>
            </div>
          </dl>
          <div className={styles.actions}>
            <Link href={methodHref}>{copy.readMethod}</Link>
            <a
              href="https://ec.europa.eu/eurostat/cache/metadata/en/gov_10q_ggdebt_esms.htm"
              target="_blank"
              rel="noreferrer"
            >
              {copy.openEurostat} ↗
            </a>
          </div>
        </div>

        <aside className={styles.nextCard}>
          <span>{copy.continueExploring}</span>
          <h2>{copy.relatedReading}</h2>
          <Link href={overviewHref}>{copy.exploreMap} <span>→</span></Link>
          <Link href={methodHref}>{copy.readMethod} <span>→</span></Link>
        </aside>
      </section>

      {shareSlot || mapSlot || relatedArticleSlot ? (
        <section className={styles.supportingContent}>
          {shareSlot ? <div className={styles.shareSlot}>{shareSlot}</div> : null}
          <div className={styles.supportingGrid}>
            {mapSlot}
            {relatedArticleSlot}
          </div>
        </section>
      ) : null}
    </article>
  );
}
