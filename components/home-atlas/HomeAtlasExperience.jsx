"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { countries, debtDataSummary, livePerSecondFor } from "@/lib/data";
import { countryName } from "@/lib/countries";
import { MAP_SCALE_COLORS } from "@/lib/map-colors";
import PreviewEUTicker from "@/components/home-preview/PreviewEUTicker";
import { getHomePreviewCopy } from "@/components/home-preview/home-preview-copy";
import { getHomeAtlasCopy } from "./home-atlas-copy";
import styles from "./home-atlas.module.css";

const AtlasMap = dynamic(() => import("./AtlasMap"), {
  ssr: false,
  loading: () => <div className={styles.mapLoading} aria-hidden="true" />,
});

const commonPeriod = debtDataSummary.dominantLatestTime;
const commonCountries = countries.filter(country => country.official_latest_time === commonPeriod && country.last_value_eur > 0);
const officialTotal = commonCountries.reduce((sum, country) => sum + country.last_value_eur, 0);
const perSecond = commonCountries.reduce((sum, country) => sum + livePerSecondFor(country), 0);
const legendColors = [MAP_SCALE_COLORS.low, MAP_SCALE_COLORS.medium, MAP_SCALE_COLORS.high, MAP_SCALE_COLORS.highest];

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true" className={styles.arrow}>{diagonal ? "↗" : "→"}</span>;
}

export default function HomeAtlasExperience({ lang = "en", children, preview = false }) {
  const copy = getHomeAtlasCopy(lang);
  const detail = getHomePreviewCopy(lang);
  const localizedCountries = useMemo(() => countries.map(country => ({
    ...country,
    localizedName: countryName(country.code, lang),
  })).sort((a, b) => a.localizedName.localeCompare(b.localizedName, detail.locale)), [lang, detail.locale]);
  const ratioFormatter = new Intl.NumberFormat(detail.locale, { maximumFractionDigits: 1 });
  const moneyFormatter = new Intl.NumberFormat(detail.locale, {
    style: "currency", currency: "EUR", notation: "compact", maximumFractionDigits: 2,
  });
  const [selectedCode, setSelectedCode] = useState(({ nl: "NL", de: "DE", fr: "FR" })[lang] || "FR");
  const [previewCode, setPreviewCode] = useState(null);
  const [relief, setRelief] = useState(true);
  const selectRef = useRef(null);
  const activeCode = previewCode || selectedCode;
  const activeCountry = localizedCountries.find(country => country.code === activeCode);
  const ratio = activeCountry.official_debt_to_gdp_pct;
  const ratioText = Number.isFinite(ratio) ? `${ratioFormatter.format(ratio)}%` : copy.missing;

  function selectCountry(code) {
    setSelectedCode(code);
    setPreviewCode(null);
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-title" id="map">
        <div className={styles.inner}>
          <div className={styles.explore}>
            <div className={styles.intro}>
              <p className={styles.eyebrow}>{copy.eyebrow}</p>
              <h1 id="home-title">{copy.title[0]} <em>{copy.title[1]}</em> {copy.title[2]}</h1>
              <p className={styles.lede}>{copy.intro}</p>
            </div>

            <div className={styles.actions}>
              <button className={styles.action} type="button" aria-label={copy.exploreLabel} onClick={() => selectRef.current?.focus()}>
                <span><small>{copy.explore[0]}</small><strong>{copy.explore[1]}</strong></span><Arrow diagonal />
              </button>
              <Link className={styles.action} href={`${detail.base}/debt-to-gdp`} aria-label={copy.compareLabel}>
                <span><small>{copy.compare[0]}</small><strong>{copy.compare[1]}</strong></span><Arrow />
              </Link>
            </div>

            <div className={styles.atlas} id="atlas-map">
              <div className={styles.mapHeading}>
                <div className={styles.mapTools}>
                  <span>{copy.mapHint}</span>
                  <button type="button" className={styles.reliefToggle} aria-label={copy.relief} aria-pressed={relief} onClick={() => setRelief(value => !value)}>{copy.relief} <span aria-hidden="true">{relief ? copy.on : copy.off}</span></button>
                </div>
              </div>
              <div className={`${styles.mapSurface} ${relief ? styles.mapRelief : ""}`}>
                <AtlasMap lang={lang} countries={localizedCountries} activeCode={activeCode} onPreview={setPreviewCode} />
              </div>
              <div className={styles.mapCaption}>
                <span className={styles.legendTitle}>{detail.debtRatio}</span>
                <div className={styles.legend} aria-label={detail.debtRatio}>
                  {copy.legend.map((label, index) => <span key={label}><i style={{ background: legendColors[index] }} aria-hidden="true" />{label}</span>)}
                </div>
              </div>
              <div className={styles.countryDetails}>
                <div className={styles.countryPicker}>
                  <label htmlFor="atlas-country">{copy.pickCountry}</label>
                  <select id="atlas-country" ref={selectRef} value={selectedCode} onChange={event => selectCountry(event.target.value)}>
                    {localizedCountries.map(country => <option key={country.code} value={country.code}>{country.localizedName}</option>)}
                  </select>
                </div>
                <div className={styles.countryInfo}>
                  <div className={styles.countryReadout} aria-live="polite" aria-atomic="true">
                    <span className={styles.countryName}>{activeCountry.localizedName}</span>
                    <strong>{ratioText}</strong>
                    <span className={styles.readoutLabel}>{detail.debtRatio}</span>
                    <span className={styles.period}>Eurostat · {activeCountry.official_debt_to_gdp_time || copy.unknownPeriod}</span>
                  </div>
                  <Link className={styles.countryLink} href={`${detail.base}/country/${activeCode.toLowerCase()}`}>
                    {copy.openCountry(activeCountry.localizedName)} <Arrow diagonal />
                  </Link>
                </div>
              </div>
            </div>

            <p className={styles.aside}>{copy.aside}</p>
          </div>

          <div className={styles.total}>
            <div><span className={styles.totalLabel}>{copy.total}</span><PreviewEUTicker officialTotal={officialTotal} perSecond={perSecond} locale={detail.locale} ariaLabel={detail.liveTotalAria} /></div>
            <p>{detail.totalLabel}<br /><span>{detail.officialAnchor(moneyFormatter.format(officialTotal), commonPeriod)}<br />{detail.coverage(commonCountries.length)}</span><br /><Link href={`${detail.base}/methodology`}>{copy.tickerMethod} <Arrow /></Link></p>
          </div>
        </div>
      </section>

      {children}
      {preview && <div className={`${styles.inner} ${styles.previewNote}`}><span>{detail.previewLabel}</span><Link href={detail.base || "/"}>{detail.viewCurrent} <Arrow /></Link></div>}
    </div>
  );
}
