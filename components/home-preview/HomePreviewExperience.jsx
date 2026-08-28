"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { countries, debtDataSummary, livePerSecondFor, trendFor } from "@/lib/data";
import { countryName } from "@/lib/countries";
import { getHomePreviewCopy, HOME_PREVIEW_LANGS } from "./home-preview-copy";
import PreviewEUTicker from "./PreviewEUTicker";
import HomeTrendPreview from "./HomeTrendPreview";
import HomePreviewFinish from "./HomePreviewFinish";
import styles from "./home-preview.module.css";

const HomeMapPreview = dynamic(() => import("./HomeMapPreview"), {
  ssr: false,
  loading: () => <div className={styles.mapLoading} aria-busy="true">Loading EU-27…</div>,
});

const MODES = ["ratio", "trend", "total"];
const SMALL_COUNTRIES = ["CY", "LU", "MT"];

function previewHref(lang) {
  return lang === "en" ? "/preview/home" : `/${lang}/preview/home`;
}

function formatCurrency(value, locale, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: digits,
  }).format(value);
}

function formatSignedCurrency(value, locale) {
  if (!Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${formatCurrency(Math.abs(value), locale, 1)}`;
}

function formatRate(value, locale) {
  if (!Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.abs(value))}/s`;
}

function formatRatio(value, locale) {
  if (!Number.isFinite(value)) return "—";
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)}%`;
}

export default function HomePreviewExperience({ lang = "en", articles = [], preview = false }) {
  const copy = getHomePreviewCopy(lang);
  const [mode, setMode] = useState("ratio");
  const [selectedCode, setSelectedCode] = useState(null);
  const [previewCode, setPreviewCode] = useState(null);
  const activeCode = previewCode || selectedCode;

  const data = useMemo(() => {
    const commonPeriod = debtDataSummary.dominantLatestTime;
    const commonCountries = countries.filter(
      (country) => country.official_latest_time === commonPeriod && country.last_value_eur > 0
    );
    const ratioValues = countries
      .map((country) => Number(country.official_debt_to_gdp_pct))
      .filter((value) => Number.isFinite(value))
      .sort((a, b) => a - b);
    const middle = Math.floor(ratioValues.length / 2);
    const median = ratioValues.length % 2
      ? ratioValues[middle]
      : (ratioValues[middle - 1] + ratioValues[middle]) / 2;
    const localizedCountries = [...countries]
      .map((country) => ({ ...country, localizedName: countryName(country.code, lang) }))
      .sort((a, b) => a.localizedName.localeCompare(b.localizedName, copy.locale));
    const largest = [...commonCountries].sort(
      (a, b) => b.last_value_eur - a.last_value_eur
    )[0];

    return {
      commonPeriod,
      commonCountries,
      localizedCountries,
      median,
      largest,
      total: commonCountries.reduce((sum, country) => sum + country.last_value_eur, 0),
      perSecond: commonCountries.reduce((sum, country) => sum + livePerSecondFor(country), 0),
      byCode: new Map(localizedCountries.map((country) => [country.code, country])),
    };
  }, [copy.locale, lang]);

  const activeCountry = activeCode ? data.byCode.get(activeCode) : null;
  const activeName = activeCountry?.localizedName;
  const currentHomeHref = copy.base || "/";

  function selectCountry(code) {
    setSelectedCode(code || null);
    setPreviewCode(null);
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroOrb} aria-hidden="true" />
        <div className={`${styles.heroInner} ${preview ? "" : styles.heroInnerLive}`}>
          {preview && (
            <div className={styles.previewBar}>
              <span>{copy.previewLabel}</span>
              <nav aria-label="Preview languages">
                {HOME_PREVIEW_LANGS.map((previewLang) => (
                  <Link
                    href={previewHref(previewLang)}
                    className={previewLang === lang ? styles.previewLanguageActive : ""}
                    key={previewLang}
                    aria-current={previewLang === lang ? "page" : undefined}
                  >
                    {previewLang.toUpperCase()}
                  </Link>
                ))}
              </nav>
              <Link href={currentHomeHref}>{copy.viewCurrent}</Link>
            </div>
          )}

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrowLight}>{copy.heroEyebrow}</p>
              <h1 id="home-title">{copy.heroTitle}</h1>
              <p className={styles.heroIntro}>{copy.heroIntro}</p>
              <div className={styles.euTotal}>
                <span>{copy.totalLabel}</span>
                <PreviewEUTicker
                  officialTotal={data.total}
                  perSecond={data.perSecond}
                  locale={copy.locale}
                  ariaLabel={copy.liveTotalAria}
                />
                <small>
                  {copy.officialAnchor(formatCurrency(data.total, copy.locale), data.commonPeriod || "—")}
                  <br />
                  {copy.coverage(data.commonCountries.length)}
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.mapStage} id="map" aria-labelledby="map-stage-title">
        <header className={styles.stageHeader}>
          <div>
            <p className={styles.eyebrow}>{copy.source}</p>
            <h2 id="map-stage-title">{copy.mapTitle}</h2>
            <p>{copy.mapIntro}</p>
          </div>
          <div className={styles.stageControls}>
            <div className={styles.modeSwitch} role="group" aria-label={copy.modeAria}>
              {MODES.map((item) => (
                <button
                  type="button"
                  className={mode === item ? styles.modeActive : ""}
                  aria-pressed={mode === item}
                  onClick={() => setMode(item)}
                  key={item}
                >
                  {copy.modes[item]}
                </button>
              ))}
            </div>
            <label className={styles.countrySelect}>
              <span>{copy.findCountry}</span>
              <select value={selectedCode || ""} onChange={(event) => selectCountry(event.target.value)}>
                <option value="">{copy.chooseCountry}</option>
                {data.localizedCountries.map((country) => (
                  <option value={country.code} key={country.code}>
                    {country.localizedName}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>

        <div className={styles.mapWorkspace}>
          <div className={styles.mapColumn}>
            <HomeMapPreview
              lang={lang}
              mode={mode}
              activeCode={activeCode}
              onPreview={setPreviewCode}
            />

            <div className={styles.legend} data-mode={mode}>
              {copy.legend[mode].map((label) => (
                <span key={label}><i aria-hidden="true" />{label}</span>
              ))}
            </div>
          </div>

          <aside className={styles.inspector} id="country-inspector" aria-live="polite">
            {activeCountry ? (
              <>
                <div className={styles.inspectorHeading}>
                  <span className={styles.countryFlag}>{activeCountry.flag}</span>
                  <div>
                    <p>{copy.selectedEyebrow} · {activeCountry.code}</p>
                    <h2>{activeName}</h2>
                  </div>
                </div>

                <dl className={styles.countryMetrics}>
                  <div className={styles.metricPrimary}>
                    <dt>{copy.debtRatio}</dt>
                    <dd>{formatRatio(Number(activeCountry.official_debt_to_gdp_pct), copy.locale)}</dd>
                  </div>
                  <div>
                    <dt>{copy.officialDebt}</dt>
                    <dd>{formatCurrency(Number(activeCountry.last_value_eur), copy.locale)}</dd>
                  </div>
                  <div>
                    <dt>{copy.quarterlyChange}</dt>
                    <dd>{formatSignedCurrency(trendFor(activeCountry), copy.locale)}</dd>
                  </div>
                  <div>
                    <dt>{copy.modelledRate}</dt>
                    <dd>{formatRate(livePerSecondFor(activeCountry), copy.locale)}</dd>
                  </div>
                </dl>

                <div className={styles.periodRow}>
                  <span>{copy.officialPeriod}</span>
                  <strong>{activeCountry.official_latest_time || "—"}</strong>
                </div>

                <Link
                  className={styles.countryCta}
                  href={`${copy.base}/country/${activeCountry.code.toLowerCase()}`}
                >
                  <span>{copy.openCountry(activeName)}</span>
                  <b aria-hidden="true">→</b>
                </Link>
              </>
            ) : (
              <>
                <div className={styles.overviewMark} aria-hidden="true">EU</div>
                <p className={styles.inspectorEyebrow}>{copy.overviewEyebrow}</p>
                <h2>{copy.overviewTitle}</h2>
                <p className={styles.overviewText}>{copy.overviewText}</p>

                <dl className={styles.overviewMetrics}>
                  <div>
                    <dt>{copy.medianRatio}</dt>
                    <dd>{formatRatio(data.median, copy.locale)}</dd>
                  </div>
                  <div>
                    <dt>{copy.largestStock}</dt>
                    <dd>{data.largest ? countryName(data.largest.code, lang) : "—"}</dd>
                  </div>
                  <div>
                    <dt>{copy.countriesCovered}</dt>
                    <dd>{data.commonCountries.length}/27</dd>
                  </div>
                </dl>

                <Link className={styles.countryCta} href={currentHomeHref}>
                  <span>{copy.exploreCountries}</span>
                  <b aria-hidden="true">→</b>
                </Link>
              </>
            )}
          </aside>
        </div>

        <footer className={styles.stageFooter}>
          <div>
            <p>{copy.compactTitle}</p>
            <span>{copy.compactHint}</span>
          </div>
          <nav className={styles.smallCountryLinks} aria-label={copy.compactTitle}>
            {SMALL_COUNTRIES.map((code) => {
              const country = data.byCode.get(code);
              const isActive = activeCode === code;
              return (
                <button
                  type="button"
                  onClick={() => selectCountry(code)}
                  className={isActive ? styles.smallCountryActive : ""}
                  aria-pressed={isActive}
                  key={code}
                >
                  <span>{country?.flag}</span>
                  <strong>{country?.localizedName}</strong>
                  <b>{formatRatio(Number(country?.official_debt_to_gdp_pct), copy.locale)}</b>
                </button>
              );
            })}
          </nav>
        </footer>

        <p className={styles.officialNote}>{copy.officialNote}</p>

        <section className={styles.countryDirectory} aria-labelledby="country-directory-title">
          <header>
            <p className={styles.eyebrow}>{copy.countryDirectoryEyebrow}</p>
            <h2 id="country-directory-title">{copy.countryDirectoryTitle}</h2>
            <p>{copy.countryDirectoryIntro}</p>
          </header>
          <nav aria-label={copy.countryDirectoryTitle}>
            {data.localizedCountries.map((country) => (
              <Link
                href={`${copy.base}/country/${country.code.toLowerCase()}`}
                key={country.code}
              >
                <span>{country.flag}</span>
                <strong>{country.localizedName}</strong>
                <b>{formatRatio(Number(country.official_debt_to_gdp_pct), copy.locale)}</b>
              </Link>
            ))}
          </nav>
        </section>
      </section>

      <HomeTrendPreview lang={lang} copy={copy} />
      <HomePreviewFinish
        articles={articles}
        copy={copy}
        commonPeriod={data.commonPeriod || "—"}
        countryCount={data.commonCountries.length}
        preview={preview}
      />
    </div>
  );
}
