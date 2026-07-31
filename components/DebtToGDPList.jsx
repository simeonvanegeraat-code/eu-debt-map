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

const COPY = {
  en: {
    official: "Official Eurostat ratios",
    live: "Live estimates",
    officialNote: (period) =>
      `Official comparable ratios for all EU-27 countries (${period}).`,
    liveNote:
      "Estimated ratios today, extending the latest official debt trend while holding the official GDP basis constant.",
    sortHigh: "High → Low",
    sortLow: "Low → High",
    debt: "Debt",
    open: "Open country →",
    source:
      "Source: Eurostat quarterly government debt, unit PC_GDP. Live values are estimates, not official real-time ratios.",
    estimated: "Estimated",
  },
  nl: {
    official: "Officiële Eurostat-cijfers",
    live: "Live schattingen",
    officialNote: (period) =>
      `Officiële, vergelijkbare schuldquotes voor alle 27 EU-landen (${period}).`,
    liveNote:
      "Geschatte schuldquotes vandaag, waarbij de laatste officiële schuldtrend wordt doorgetrokken en de officiële bbp-basis gelijk blijft.",
    sortHigh: "Hoog → Laag",
    sortLow: "Laag → Hoog",
    debt: "Schuld",
    open: "Open land →",
    source:
      "Bron: Eurostat kwartaaldata overheidsschuld, eenheid PC_GDP. Live waarden zijn schattingen, geen officiële realtime schuldquotes.",
    estimated: "Geschat",
  },
  de: {
    official: "Offizielle Eurostat-Werte",
    live: "Live-Schätzungen",
    officialNote: (period) =>
      `Offizielle, vergleichbare Schuldenquoten für alle 27 EU-Länder (${period}).`,
    liveNote:
      "Heutige Schätzwerte auf Basis des fortgeschriebenen offiziellen Schuldentrends bei unveränderter offizieller BIP-Basis.",
    sortHigh: "Hoch → Niedrig",
    sortLow: "Niedrig → Hoch",
    debt: "Schulden",
    open: "Land öffnen →",
    source:
      "Quelle: Vierteljährliche Eurostat-Staatsschulden, Einheit PC_GDP. Live-Werte sind Schätzungen und keine offiziellen Echtzeitquoten.",
    estimated: "Geschätzt",
  },
  fr: {
    official: "Ratios officiels d’Eurostat",
    live: "Estimations en direct",
    officialNote: (period) =>
      `Ratios officiels et comparables pour les 27 pays de l’UE (${period}).`,
    liveNote:
      "Estimations actuelles prolongeant la dernière tendance officielle de la dette avec une base de PIB officielle constante.",
    sortHigh: "Haut → Bas",
    sortLow: "Bas → Haut",
    debt: "Dette",
    open: "Ouvrir le pays →",
    source:
      "Source : dette publique trimestrielle d’Eurostat, unité PC_GDP. Les valeurs en direct sont des estimations, pas des ratios officiels en temps réel.",
    estimated: "Estimé",
  },
};

function colorFor(pct) {
  if (!Number.isFinite(pct)) return "#cbd5e1";
  return pct < 60 ? "var(--ok)" : pct < 90 ? "#f59e0b" : "var(--bad)";
}

function localeFor(lang) {
  if (lang === "nl") return "nl-NL";
  if (lang === "de") return "de-DE";
  if (lang === "fr") return "fr-FR";
  return "en-GB";
}

function formatPeriod(period, lang) {
  const match = /^(\d{4})-?Q([1-4])$/i.exec(String(period || "").trim());
  if (!match) return period || "";
  return lang === "fr" ? `T${match[2]} ${match[1]}` : `${match[1]} Q${match[2]}`;
}

function countryHref(code, lang) {
  const prefix = ["nl", "de", "fr"].includes(lang) ? `/${lang}` : "";
  return `${prefix}/country/${String(code).toLowerCase()}`;
}

function Row({ c, ratio, debt, rank, lang, mode }) {
  const copy = COPY[lang];
  const pct = Number.isFinite(ratio) ? Math.max(0, Math.min(300, ratio)) : null;
  const fill = Number.isFinite(pct) ? Math.min(100, pct) : 0;
  const color = colorFor(pct);
  const locale = localeFor(lang);
  const period = formatPeriod(c.official_debt_to_gdp_time, lang);

  return (
    <article
      className="card debtgdp-ranking-row"
      style={{
        padding: 12,
        borderRadius: 12,
        display: "grid",
        gap: 12,
        alignItems: "center",
      }}
    >
      <div className="mono tag" style={{ textAlign: "right" }}>
        #{rank}
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
          <strong>
            {c.flag ? <span style={{ marginRight: 6 }}>{c.flag}</span> : null}
            {countryName(c.code, lang)}
          </strong>
          <span className="tag" style={{ fontVariantNumeric: "tabular-nums" }}>
            {copy.debt}: €{Math.round(debt).toLocaleString(locale)}
          </span>
        </div>

        <div
          aria-label={`${countryName(c.code, lang)} debt to GDP`}
          style={{
            height: 10,
            borderRadius: 999,
            background: "#e5edff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${fill}%`,
              height: "100%",
              background: color,
              borderRadius: 999,
              transition: "width .4s ease",
            }}
          />
        </div>

        <div className="tag">
          {mode === "official" ? period : copy.estimated} · &lt;60% / 60–90% / &gt;90%
        </div>
      </div>

      <div className="debtgdp-ranking-ratio" style={{ textAlign: "right" }}>
        <div
          className="mono"
          style={{
            display: "inline-block",
            padding: "6px 10px",
            borderRadius: 999,
            border: "1px solid var(--border)",
            background: "#fff",
            minWidth: 68,
            textAlign: "center",
            color,
            fontWeight: 700,
          }}
        >
          {Number.isFinite(pct)
            ? `${pct.toLocaleString(locale, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}%`
            : "—"}
        </div>
        <div className="tag" style={{ marginTop: 6 }}>
          <Link href={countryHref(c.code, lang)}>{copy.open}</Link>
        </div>
      </div>
    </article>
  );
}

export default function DebtToGDPList({ lang: langProp = "en" }) {
  const lang = ["en", "nl", "de", "fr"].includes(langProp) ? langProp : "en";
  const copy = COPY[lang];
  const [mode, setMode] = useState("official");
  const [order, setOrder] = useState("desc");
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (mode !== "live") return undefined;
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [mode]);

  const rows = useMemo(() => {
    const result = countries.map((c) => {
      const officialRatio = officialDebtToGDPRatio(c);
      const liveRatio = estimatedLiveDebtToGDPRatio(c, nowMs);
      const ratio = mode === "live" && Number.isFinite(liveRatio) ? liveRatio : officialRatio;
      const debt = mode === "live" ? interpolateDebt(c, nowMs) : Number(c.last_value_eur);
      return { c, ratio, debt };
    });

    result.sort((a, b) => {
      const left = Number.isFinite(a.ratio) ? a.ratio : -1;
      const right = Number.isFinite(b.ratio) ? b.ratio : -1;
      return order === "desc" ? right - left : left - right;
    });
    return result;
  }, [mode, nowMs, order]);

  const commonPeriod = formatPeriod(countries[0]?.official_debt_to_gdp_time, lang);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div className="tag">
          {mode === "official" ? copy.officialNote(commonPeriod) : copy.liveNote}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <button
            className="btn"
            type="button"
            aria-pressed={mode === "official"}
            onClick={() => setMode("official")}
          >
            {copy.official}
          </button>
          <button
            className="btn"
            type="button"
            aria-pressed={mode === "live"}
            onClick={() => setMode("live")}
          >
            {copy.live}
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => setOrder((value) => (value === "desc" ? "asc" : "desc"))}
            aria-label={order === "desc" ? copy.sortHigh : copy.sortLow}
          >
            {order === "desc" ? copy.sortHigh : copy.sortLow}
          </button>
        </div>
      </div>

      {rows.map((row, index) => (
        <Row
          key={row.c.code}
          c={row.c}
          ratio={row.ratio}
          debt={row.debt}
          rank={index + 1}
          lang={lang}
          mode={mode}
        />
      ))}

      <div className="tag" style={{ marginTop: 8 }}>
        {copy.source}
      </div>

      <style jsx global>{`
        .debtgdp-ranking-row {
          grid-template-columns: 42px minmax(180px, 1fr) minmax(120px, 180px);
        }
        @media (max-width: 640px) {
          .debtgdp-ranking-row {
            grid-template-columns: 32px minmax(0, 1fr);
          }
          .debtgdp-ranking-ratio {
            grid-column: 2;
            text-align: left !important;
          }
        }
      `}</style>
    </div>
  );
}
