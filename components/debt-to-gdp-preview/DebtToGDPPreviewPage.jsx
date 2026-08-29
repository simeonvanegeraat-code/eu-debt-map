"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  countries,
  estimatedLiveDebtToGDPRatio,
  interpolateDebt,
  officialDebtToGDPRatio,
} from "@/lib/data";
import { countryName } from "@/lib/countries";
import styles from "./debt-to-gdp-preview.module.css";

const SCALE_MAX = 160;
const EUROSTAT_RELEASE =
  "https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-21072026-ap";
const EUROSTAT_METHOD =
  "https://ec.europa.eu/eurostat/cache/metadata/en/gov_10q_ggdebt_esms.htm";

function formatPeriod(period) {
  const match = /^(\d{4})-?Q([1-4])$/i.exec(String(period || "").trim());
  return match ? `${match[1]} Q${match[2]}` : period || "Latest quarter";
}

function formatRatio(value) {
  return Number.isFinite(value)
    ? `${value.toLocaleString("en-GB", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}%`
    : "—";
}

function formatDebt(value, compact = true) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 2 : 0,
  }).format(value);
}

function bandFor(ratio) {
  if (!Number.isFinite(ratio)) return "unknown";
  if (ratio < 60) return "below";
  if (ratio <= 90) return "reference";
  return "high";
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 7l5 5-5 5" />
    </svg>
  );
}

export default function DebtToGDPPreviewPage() {
  const [mode, setMode] = useState("official");
  const [order, setOrder] = useState("desc");
  const [query, setQuery] = useState("");
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (mode !== "live") return undefined;
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [mode]);

  const officialRows = useMemo(
    () =>
      countries
        .map((country) => ({
          country,
          ratio: officialDebtToGDPRatio(country),
          debt: Number(country.last_value_eur),
        }))
        .filter((row) => Number.isFinite(row.ratio))
        .sort((a, b) => b.ratio - a.ratio),
    []
  );

  const rows = useMemo(() => {
    const ranked = officialRows
      .map(({ country }) => {
        const officialRatio = officialDebtToGDPRatio(country);
        const liveRatio = estimatedLiveDebtToGDPRatio(country, nowMs);
        return {
          country,
          ratio:
            mode === "live" && Number.isFinite(liveRatio) ? liveRatio : officialRatio,
          debt: mode === "live" ? interpolateDebt(country, nowMs) : Number(country.last_value_eur),
        };
      })
      .sort((a, b) => (order === "desc" ? b.ratio - a.ratio : a.ratio - b.ratio))
      .map((row, index) => ({ ...row, rank: index + 1 }));

    const normalizedQuery = query.trim().toLocaleLowerCase("en-GB");
    if (!normalizedQuery) return ranked;
    return ranked.filter(({ country }) => {
      const name = countryName(country.code, "en").toLocaleLowerCase("en-GB");
      return name.includes(normalizedQuery) || country.code.toLowerCase().includes(normalizedQuery);
    });
  }, [mode, nowMs, officialRows, order, query]);

  const period = formatPeriod(officialRows[0]?.country.official_debt_to_gdp_time);
  const highest = officialRows[0];
  const lowest = officialRows.at(-1);
  const counts = officialRows.reduce(
    (result, row) => {
      result[bandFor(row.ratio)] += 1;
      return result;
    },
    { below: 0, reference: 0, high: 0, unknown: 0 }
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="preview-debt-ratio-title">
        <div className={styles.heroInner}>
          <div className={styles.previewBar}>
            <span>Debt-to-GDP design study · isolated preview</span>
            <Link href="/debt-to-gdp">View current page</Link>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>EU-27 · Official Eurostat comparison</p>
              <h1 id="preview-debt-ratio-title">EU countries by debt-to-GDP ratio.</h1>
              <p className={styles.lede}>
                Compare government debt with the size of each economy. This official {period}{" "}
                ranking covers all 27 EU countries on one consistent Eurostat measure.
              </p>
              <div className={styles.heroActions}>
                <a href="#ranking">View the full ranking <ArrowIcon /></a>
                <span>Official data first · modelled estimates optional</span>
              </div>
            </div>

            <aside className={styles.heroPanel} aria-label="EU debt-to-GDP summary">
              <p>Latest official picture</p>
              <div className={styles.heroLeader}>
                <span>Highest ratio</span>
                <strong>{countryName(highest?.country.code, "en")}</strong>
                <b>{formatRatio(highest?.ratio)}</b>
              </div>
              <dl className={styles.heroStats}>
                <div>
                  <dt>Lowest</dt>
                  <dd>{countryName(lowest?.country.code, "en")} · {formatRatio(lowest?.ratio)}</dd>
                </div>
                <div>
                  <dt>Above 90%</dt>
                  <dd>{counts.high} countries</dd>
                </div>
                <div>
                  <dt>Below 60%</dt>
                  <dd>{counts.below} countries</dd>
                </div>
                <div>
                  <dt>Reference period</dt>
                  <dd>{period}</dd>
                </div>
              </dl>
              <small>Source: Eurostat quarterly general government gross debt.</small>
            </aside>
          </div>
        </div>
      </section>

      <nav className={styles.chapterNav} aria-label="Debt-to-GDP page sections">
        <div>
          <span>EU debt-to-GDP</span>
          <a href="#ranking">Ranking</a>
          <a href="#meaning">What it means</a>
          <a href="#reference">60% reference</a>
          <a href="#method">Method</a>
        </div>
      </nav>

      <section className={styles.rankingSection} aria-labelledby="ranking-title">
        <header className={`${styles.sectionHeader} ${styles.anchorTarget}`} id="ranking">
          <div>
            <p className={styles.eyebrow}>01 — Official ranking</p>
            <h2 id="ranking-title">EU debt-to-GDP ranking by country</h2>
          </div>
          <p>
            Greece has the EU’s highest official ratio in {period}; Estonia has the lowest.
            The shared scale makes the distance from the 60% treaty reference visible without
            turning that reference into a pass-or-fail verdict.
          </p>
        </header>

        <div className={styles.rankingShell}>
          <div className={styles.rankingToolbar}>
            <div className={styles.modeSwitch} role="group" aria-label="Choose data mode">
              <button
                type="button"
                className={mode === "official" ? styles.activeButton : ""}
                aria-pressed={mode === "official"}
                onClick={() => setMode("official")}
              >
                Official {period}
              </button>
              <button
                type="button"
                className={mode === "live" ? styles.activeButton : ""}
                aria-pressed={mode === "live"}
                onClick={() => setMode("live")}
              >
                Modelled live estimate
              </button>
            </div>

            <label className={styles.searchField}>
              <span>Find a country</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Country or code"
              />
            </label>

            <button
              className={styles.sortButton}
              type="button"
              onClick={() => setOrder((value) => (value === "desc" ? "asc" : "desc"))}
            >
              {order === "desc" ? "Highest first ↓" : "Lowest first ↑"}
            </button>
          </div>

          <div className={styles.rankingNote}>
            <strong>{mode === "official" ? "Official observations" : "Modelled estimates"}</strong>
            <span>
              {mode === "official"
                ? `Comparable Eurostat ratios for all EU-27 countries, ${period}.`
                : "The latest debt trend is extended while the official GDP basis stays fixed. These are not official real-time ratios."}
            </span>
          </div>

          <div className={styles.scale} aria-hidden="true">
            <span>0%</span>
            <b>60% reference</b>
            <span>160%</span>
          </div>

          <ol className={styles.rankingList} aria-label={`EU debt-to-GDP ranking, ${period}`}>
            {rows.map(({ country, ratio, debt, rank }) => {
              const name = countryName(country.code, "en");
              const band = bandFor(ratio);
              const fill = Math.max(0, Math.min(100, (ratio / SCALE_MAX) * 100));
              return (
                <li className={styles.rankingRow} data-band={band} key={country.code}>
                  <span className={styles.rank}>#{rank}</span>
                  <div className={styles.countryCell}>
                    <span className={styles.countryCode} aria-hidden="true">{country.code}</span>
                    <div>
                      <Link href={`/country/${country.code.toLowerCase()}`}>{name}</Link>
                      <small>Government debt {formatDebt(debt)}</small>
                    </div>
                  </div>
                  <div
                    className={styles.ratioTrack}
                    aria-label={`${name}: ${formatRatio(ratio)} debt to GDP`}
                  >
                    <i style={{ width: `${fill}%` }} />
                    <span aria-hidden="true" />
                  </div>
                  <strong className={styles.ratioValue}>{formatRatio(ratio)}</strong>
                  <Link className={styles.rowLink} href={`/country/${country.code.toLowerCase()}`}>
                    Open <ArrowIcon />
                  </Link>
                </li>
              );
            })}
          </ol>

          {rows.length === 0 && (
            <p className={styles.emptyState}>No EU country matches “{query}”.</p>
          )}

          <footer className={styles.rankingFooter}>
            <div>
              <i className={styles.legendBelow} />Below 60%
              <i className={styles.legendReference} />60–90%
              <i className={styles.legendHigh} />Above 90%
            </div>
            <p>Shared visual scale: 0–160%. Ratios remain printed as exact one-decimal values.</p>
          </footer>
        </div>
      </section>

      <section className={styles.meaningSection} aria-labelledby="meaning-title">
        <div className={`${styles.meaningIntro} ${styles.anchorTarget}`} id="meaning">
          <p className={styles.eyebrow}>02 — Read the ratio correctly</p>
          <h2 id="meaning-title">What debt-to-GDP tells you—and what it doesn’t.</h2>
          <p>
            A raw debt total makes large economies look more indebted simply because they are
            larger. Debt-to-GDP puts the debt stock beside one year of economic output, creating
            a more useful common scale for cross-country comparison.
          </p>
        </div>

        <div className={styles.formulaCard}>
          <span>Government debt</span>
          <i aria-hidden="true" />
          <span>Annual GDP</span>
          <strong>× 100 = debt-to-GDP ratio</strong>
          <small>Eurostat uses the Maastricht definition of consolidated general government gross debt.</small>
        </div>

        <div className={styles.meaningGrid}>
          <article>
            <span>01</span>
            <h3>Useful for comparison</h3>
            <p>It relates a debt stock to the size of the economy supporting public revenue and repayment capacity.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Direction still matters</h3>
            <p>A country at 70% and falling can face a different path from one at 70% and rising quickly.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Not a risk score</h3>
            <p>Interest costs, maturity, growth, currency, deficits and investor confidence also shape sustainability.</p>
          </article>
        </div>
      </section>

      <section className={styles.referenceSection} id="reference" aria-labelledby="reference-title">
        <div className={styles.referenceCopy}>
          <p className={styles.eyebrow}>03 — European context</p>
          <h2 id="reference-title">The 60% line is a reference value, not a safety certificate.</h2>
          <p>
            The EU treaty framework uses 60% of GDP as a reference for government debt. It helps
            organise fiscal surveillance, but it does not mean that every country below 60% is
            automatically safe or that every country above it is in crisis.
          </p>
          <Link href="/stability-and-growth-pact">Read how the EU fiscal rules work <ArrowIcon /></Link>
        </div>
        <dl className={styles.referenceStats}>
          <div>
            <dt>Below 60%</dt>
            <dd>{counts.below}</dd>
            <small>EU countries in {period}</small>
          </div>
          <div>
            <dt>60–90%</dt>
            <dd>{counts.reference}</dd>
            <small>EU countries in {period}</small>
          </div>
          <div>
            <dt>Above 90%</dt>
            <dd>{counts.high}</dd>
            <small>EU countries in {period}</small>
          </div>
        </dl>
      </section>

      <section className={styles.methodSection} aria-labelledby="method-title">
        <header className={styles.anchorTarget} id="method">
          <p className={styles.eyebrow}>04 — Source and method</p>
          <h2 id="method-title">Official first. Estimates clearly separated.</h2>
          <p>
            The default ranking uses Eurostat’s directly published quarterly percentage-of-GDP
            observations. The optional live view extends only the latest debt trend and keeps the
            official GDP basis fixed; it is a model, not a new Eurostat observation.
          </p>
        </header>
        <div className={styles.methodLinks}>
          <a href={EUROSTAT_RELEASE} target="_blank" rel="noreferrer">
            <span>Primary release</span>
            <strong>Eurostat · Government debt, {period}</strong>
            <ArrowIcon />
          </a>
          <a href={EUROSTAT_METHOD} target="_blank" rel="noreferrer">
            <span>Definition</span>
            <strong>Quarterly government debt metadata</strong>
            <ArrowIcon />
          </a>
          <Link href="/methodology">
            <span>EU Debt Map</span>
            <strong>Read the full methodology</strong>
            <ArrowIcon />
          </Link>
        </div>
      </section>
    </div>
  );
}
