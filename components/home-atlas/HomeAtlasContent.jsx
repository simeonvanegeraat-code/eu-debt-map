import Link from "next/link";
import { countries, debtDataSummary } from "@/lib/data";
import { countryName } from "@/lib/countries";
import { getHomePreviewCopy } from "@/components/home-preview/home-preview-copy";
import HomeTrendPreview from "@/components/home-preview/HomeTrendPreview";
import HomePreviewFinish from "@/components/home-preview/HomePreviewFinish";
import shared from "@/components/home-preview/home-preview.module.css";
import styles from "./home-atlas.module.css";

export default function HomeAtlasContent({ lang, articles, historyRows, historyProvisional }) {
  const copy = getHomePreviewCopy(lang);
  const commonPeriod = debtDataSummary.dominantLatestTime;
  const commonCountries = countries.filter(country => country.official_latest_time === commonPeriod && country.last_value_eur > 0);
  const localizedCountries = countries.map(country => ({ ...country, name: countryName(country.code, lang) }))
    .sort((a, b) => a.name.localeCompare(b.name, copy.locale));
  const ratios = countries.map(country => country.official_debt_to_gdp_pct).filter(Number.isFinite).sort((a, b) => a - b);
  const middle = Math.floor(ratios.length / 2);
  const median = ratios.length ? (ratios.length % 2 ? ratios[middle] : (ratios[middle - 1] + ratios[middle]) / 2) : null;
  const largest = [...commonCountries].sort((a, b) => b.last_value_eur - a.last_value_eur)[0];
  const formatter = new Intl.NumberFormat(copy.locale, { maximumFractionDigits: 1 });
  const ratioText = value => Number.isFinite(value) ? `${formatter.format(value)}%` : "—";

  return (
    <div className={`${shared.page} ${shared.atlasContent}`}>
      <section className={`${styles.inner} ${styles.directory}`} id="country-directory" aria-labelledby="country-directory-title">
        <header className={styles.directoryHeader}>
          <div>
            <p className={styles.followEyebrow}>{copy.countryDirectoryEyebrow}</p>
            <h2 id="country-directory-title">{copy.countryDirectoryTitle}</h2>
            <p>{copy.countryDirectoryIntro}</p>
            <p className={styles.directoryPeriod}>Eurostat · {copy.debtRatio}</p>
          </div>
          <dl className={styles.overview}>
            <div><dt>{copy.medianRatio}</dt><dd>{ratioText(median)}</dd></div>
            <div><dt>{copy.largestStock}</dt><dd>{largest ? countryName(largest.code, lang) : "—"}</dd></div>
            <div><dt>{copy.countriesCovered}</dt><dd>{commonCountries.length}/27</dd></div>
          </dl>
        </header>
        <nav className={styles.directoryLinks} aria-label={copy.countryDirectoryTitle}>
          {localizedCountries.map(country => (
            <Link href={`${copy.base}/country/${country.code.toLowerCase()}`} key={country.code}>
              <span aria-hidden="true">{country.flag}</span>
              <strong>{country.name}</strong>
              <span className={styles.directoryValue}>{ratioText(country.official_debt_to_gdp_pct)}<small>{country.official_debt_to_gdp_time || "—"}</small></span>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
        <nav className={styles.metricLinks} aria-label={copy.modeAria}>
          <Link href={`${copy.base}/debt-to-gdp`}>{copy.modes.ratio} <span aria-hidden="true">→</span></Link>
          <Link href={`${copy.base}/debt-growth`}>{copy.modes.trend} <span aria-hidden="true">→</span></Link>
          <Link href={`${copy.base}/eu-debt`}>{copy.modes.total} <span aria-hidden="true">→</span></Link>
        </nav>
        <p className={styles.directoryNote}>{copy.officialNote}</p>
      </section>
      <HomeTrendPreview lang={lang} copy={copy} rows={historyRows} provisional={historyProvisional} />
      <HomePreviewFinish articles={articles} copy={copy} commonPeriod={commonPeriod || "—"} countryCount={commonCountries.length} />
    </div>
  );
}
