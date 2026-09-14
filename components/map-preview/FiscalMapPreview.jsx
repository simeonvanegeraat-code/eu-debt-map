"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { countryName } from "@/lib/countries";
import { balanceBand } from "@/lib/fiscal/balance-core";
import { interestBand } from "@/lib/fiscal/interest";
import { MAP_BALANCE_COLORS, MAP_SCALE_COLORS } from "@/lib/map-colors";
import styles from "./fiscal-map-preview.module.css";

const IndicatorMap = dynamic(() => import("@/components/fiscal/IndicatorMap"), {
  ssr: false,
  loading: () => <div className={styles.loading}>Loading EU map…</div>,
});

const MODES = {
  balance: {
    eyebrow: "Official annual data",
    title: "Europe’s annual budget balance",
    intro: "Positive values show a surplus; negative values show a deficit. The −3% line is an EU reference value, not an automatic legal verdict.",
    metric: "Budget balance",
    colours: MAP_BALANCE_COLORS,
    bands: [
      ["surplus", "Surplus > 0%"],
      ["balanced", "Balanced: 0%"],
      ["smallDeficit", "Deficit: −3% to < 0%"],
      ["largeDeficit", "Deficit < −3%"],
      ["missing", "No data"],
    ],
  },
  interest: {
    eyebrow: "Official annual data",
    title: "Government interest costs",
    intro: "Compare annual government interest expenditure as a share of GDP. These colour classes describe scale and are not sustainability thresholds.",
    metric: "Interest / GDP",
    colours: MAP_SCALE_COLORS,
    bands: [
      ["low", "Below 1% of GDP"],
      ["medium", "1% to below 2%"],
      ["high", "2% to below 3%"],
      ["highest", "3% or more"],
      ["missing", "No data"],
    ],
  },
};

const number = new Intl.NumberFormat("en-IE", { maximumFractionDigits: 1 });
const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
  maximumFractionDigits: 1,
});

function percent(value, signed = false) {
  if (!Number.isFinite(value)) return "—";
  const sign = signed && value > 0 ? "+" : "";
  return `${sign}${number.format(value)}%`;
}

function pp(value) {
  if (!Number.isFinite(value)) return "—";
  return `${value > 0 ? "+" : ""}${number.format(value)} pp`;
}

function bandFor(mode, value) {
  return mode === "balance" ? balanceBand(value) : interestBand(value);
}

export default function FiscalMapPreview({ balanceRows, balanceYear, interestRows, interestYear }) {
  const [mode, setMode] = useState("balance");
  const [selectedCode, setSelectedCode] = useState("NL");
  const config = MODES[mode];
  const year = mode === "balance" ? balanceYear : interestYear;
  const sourceRows = mode === "balance" ? balanceRows : interestRows;
  const rows = useMemo(
    () => sourceRows.map((row) => ({ ...row, name: countryName(row.code, "en") }))
      .sort((a, b) => a.name.localeCompare(b.name, "en-IE")),
    [sourceRows]
  );
  const selected = rows.find((row) => row.code === selectedCode) || rows[0];
  const mapRows = rows.map((row) => ({
    code: row.code,
    color: config.colours[bandFor(mode, row.value)],
    label: `${row.name}: ${percent(row.value, mode === "balance")} · ${config.metric} · ${year}`,
  }));

  return (
    <article className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.shell}>
          <p className={styles.kicker}>Design preview · not indexed</p>
          <h1>One map system for European public finances.</h1>
          <p className={styles.lede}>This preview gives budget balance and interest costs the same visual structure. Switch the indicator to compare the system without changing page width, typography or interaction.</p>
        </div>
      </header>

      <div className={styles.shell}>
        <section className={styles.preview} aria-labelledby="preview-map-title">
          <div className={styles.headingRow}>
            <div>
              <p className={styles.eyebrow}>{config.eyebrow} · {year}</p>
              <h2 id="preview-map-title">{config.title}</h2>
              <p>{config.intro}</p>
            </div>
            <div className={styles.modeSwitch} role="group" aria-label="Choose a fiscal indicator">
              <button type="button" aria-pressed={mode === "balance"} onClick={() => setMode("balance")}>Budget balance</button>
              <button type="button" aria-pressed={mode === "interest"} onClick={() => setMode("interest")}>Interest costs</button>
            </div>
          </div>

          <div className={styles.mapLayout}>
            <div className={styles.mapColumn}>
              <div className={styles.mapFrame}>
                <IndicatorMap
                  rows={mapRows}
                  selectedCode={selected.code}
                  onSelect={setSelectedCode}
                  label={`${config.title} · ${year}`}
                />
              </div>

              <div className={styles.smallCountries} aria-label="Small countries">
                {["CY", "LU", "MT"].map((code) => {
                  const row = rows.find((item) => item.code === code);
                  return (
                    <button type="button" key={code} aria-pressed={selected.code === code} onClick={() => setSelectedCode(code)}>
                      <i aria-hidden="true" style={{ background: config.colours[bandFor(mode, row.value)] }} />
                      <span>{row.name}</span>
                      <strong>{percent(row.value, mode === "balance")}</strong>
                    </button>
                  );
                })}
              </div>

              <ul className={styles.legend} aria-label={`${config.metric} colour scale`}>
                {config.bands.map(([key, label]) => (
                  <li key={key}><i aria-hidden="true" style={{ background: config.colours[key] }} />{label}</li>
                ))}
              </ul>
            </div>

            <aside className={styles.panel} aria-live="polite">
              <label htmlFor="preview-country">Explore a country</label>
              <select id="preview-country" value={selected.code} onChange={(event) => setSelectedCode(event.target.value)}>
                {rows.map((row) => <option key={row.code} value={row.code}>{row.name}</option>)}
              </select>
              <p className={styles.panelYear}>{selected.name} · {year}</p>
              <p className={styles.bigValue}>{percent(selected.value, mode === "balance")}</p>
              <p className={styles.metricLabel}>{config.metric}</p>

              {mode === "balance" ? (
                <dl className={styles.facts}>
                  <div><dt>Previous year</dt><dd>{percent(selected.previous, true)}</dd></div>
                  <div><dt>Annual change</dt><dd>{pp(selected.change)}</dd></div>
                  <div><dt>EU rank</dt><dd>{selected.rank} / 27</dd></div>
                  <div><dt>Government debt / GDP</dt><dd>{percent(selected.debtRatio)}</dd></div>
                </dl>
              ) : (
                <dl className={styles.facts}>
                  <div><dt>Annual interest expenditure</dt><dd>{euro.format(selected.amount)}</dd></div>
                  <div><dt>Interest per resident</dt><dd>{euro.format(selected.perCapita)}</dd></div>
                  <div><dt>Interest / revenue</dt><dd>{percent(selected.revenueShare)}</dd></div>
                  <div><dt>EU rank</dt><dd>{selected.rank} / 27</dd></div>
                </dl>
              )}
            </aside>
          </div>

          <footer className={styles.note}>
            <strong>Preview scope</strong>
            <span>The existing local map geometry and official snapshots are used. A more detailed EU-only geometry can be evaluated separately after the layout is approved.</span>
          </footer>
        </section>
      </div>
    </article>
  );
}
