"use client";

import { useMemo } from "react";
import DebtToGDPBlock from "@/components/DebtToGDPBlock";
import { countries } from "@/lib/data";
import { countryName } from "@/lib/countries";

// Vertaalde labels voor de statistieken
const LABELS = {
  en: {
    change: "Change between official quarters",
    rate: "Live rate (approx)",
    derived: "Live rate extrapolated from the last two official Eurostat debt quarters.",
    sourcePeriods: "Source: Eurostat official debt periods:",
    sourceDates: "Quarter-end dates:",
    sourceLive: "Live estimate extends the latest official figure to today.",
    sourceFallback:
      "Source note: official Eurostat debt periods are unavailable, so the live ticker is using a fallback estimate.",
    perSec: "/ s",
    factsAria: "Debt facts",
    latest: "Latest Est.",
  },
  nl: {
    change: "Verandering tussen officiële kwartalen",
    rate: "Live tempo (geschat)",
    derived: "Het live tempo is geëxtrapoleerd uit de laatste twee officiële Eurostat-schuldkwartalen.",
    sourcePeriods: "Bron: officiële Eurostat-schuldperioden:",
    sourceDates: "Kwartaaleindes:",
    sourceLive: "De live schatting trekt de laatste officiële stand door tot vandaag.",
    sourceFallback:
      "Bronopmerking: officiële Eurostat-schuldperioden ontbreken, dus de live teller gebruikt een fallbackschatting.",
    perSec: "/ s",
    factsAria: "Schuldfeiten",
    latest: "Laatste schatting",
  },
  de: {
    change: "Veränderung zwischen offiziellen Quartalen",
    rate: "Live-Tempo (ca.)",
    derived: "Die Live-Rate wird aus den letzten zwei offiziellen Eurostat-Schuldenquartalen extrapoliert.",
    sourcePeriods: "Quelle: offizielle Eurostat-Schuldenperioden:",
    sourceDates: "Quartalsenden:",
    sourceLive: "Die Live-Schätzung verlängert den letzten offiziellen Stand bis heute.",
    sourceFallback:
      "Quellenhinweis: Offizielle Eurostat-Schuldenperioden sind nicht verfügbar, daher nutzt der Live-Ticker eine Fallback-Schätzung.",
    perSec: "/ s",
    factsAria: "Schuldenfakten",
    latest: "Neueste Schätzung",
  },
  fr: {
    change: "Variation entre les trimestres officiels",
    rate: "Rythme en direct (approx.)",
    derived: "Le rythme en direct est extrapolé à partir des deux derniers trimestres officiels de dette d’Eurostat.",
    sourcePeriods: "Source : périodes officielles de dette Eurostat :",
    sourceDates: "Fins de trimestre :",
    sourceLive: "L’estimation en direct prolonge la dernière valeur officielle jusqu’à aujourd’hui.",
    sourceFallback:
      "Note sur la source : les périodes officielles de dette Eurostat ne sont pas disponibles, donc le compteur en direct utilise une estimation de secours.",
    perSec: "/ s",
    factsAria: "Faits sur la dette",
    latest: "Dernière estimation",
  },
};

function formatQuarterKey(key) {
  const m = /^(\d{4})-?Q([1-4])$/i.exec(String(key || "").trim());
  if (!m) return key || null;
  return `${m[1]} Q${m[2]}`;
}

/**
 * CountryFacts
 * ------------
 * Props:
 * - code (string, vereist): landcode (bv. "NL", "FR")
 * - lang (string, optioneel): taalcode (bv. "en", "de")
 * - gdpAbs (number, optioneel): Live GDP in euro
 * - yearLabel (string, optioneel): De bronperiode
 */
export default function CountryFacts({
  code,
  lang = "en",
  gdpAbs: gdpAbsProp,
  yearLabel: yearLabelProp,
}) {
  const c = useMemo(() => {
    const want = String(code || "").toLowerCase();
    return countries.find((x) => x.code.toLowerCase() === want) || null;
  }, [code]);

  const effLang = ["en", "nl", "de", "fr"].includes(lang) ? lang : "en";
  const t = LABELS[effLang];

  const nfLocale =
    effLang === "nl" || effLang === "de"
      ? "de-DE"
      : effLang === "fr"
      ? "fr-FR"
      : "en-GB";

  const nf0 = useMemo(
    () => new Intl.NumberFormat(nfLocale, { maximumFractionDigits: 0 }),
    [nfLocale]
  );

  const nf2 = useMemo(
    () => new Intl.NumberFormat(nfLocale, { maximumFractionDigits: 2 }),
    [nfLocale]
  );

  if (!c) return null;

  // 1. Debt en trend
  const v0 = Number(c.prev_value_eur) || 0;
  const v1 = Number(c.last_value_eur) || 0;
  const delta = v1 - v0;
  const perSec = Number.isFinite(c._perSecond) ? c._perSecond : 0;

  const trend =
    delta > 0
      ? { color: "var(--bad)", arrow: "↑ +" }
      : delta < 0
      ? { color: "var(--ok)", arrow: "↓ -" }
      : { color: "#9ca3af", arrow: "→ " };

  const rateText =
    Math.abs(perSec) < 0.005
      ? `≈ €0.00 ${t.perSec}`
      : `€${nf2.format(perSec)} ${t.perSec}`;

  // 2. GDP bepaling
  const gdpFromDataEUR = Number.isFinite(Number(c?.gdp_eur))
    ? Number(c.gdp_eur)
    : Number.isFinite(Number(c?.gdp_meur))
    ? Number(c.gdp_meur) * 1_000_000
    : NaN;

  const gdpAbs = Number.isFinite(Number(gdpAbsProp))
    ? Number(gdpAbsProp)
    : gdpFromDataEUR;

  const showDebtToGDP = Number.isFinite(gdpAbs) && gdpAbs > 0;

  // 3. Label bepaling
  const yearLabel =
    yearLabelProp ||
    (c?.last_date ? `FY ${c.last_date.slice(0, 4)}` : t.latest);

  // 4. Gelokaliseerde landnaam
  const localizedCountryName =
    countryName(c.code, effLang) || c?.code?.toUpperCase() || "Country";

  const officialPrevPeriod = formatQuarterKey(c.official_previous_time);
  const officialLatestPeriod = formatQuarterKey(c.official_latest_time);
  const officialPrevDate = c.official_prev_date || null;
  const officialLatestDate = c.official_last_date || null;
  const hasOfficialSeries =
    !!c.hasOfficialDebtSeries && !!officialPrevPeriod && !!officialLatestPeriod;

  return (
    <aside
      className="card"
      style={{
        border: "1px solid var(--border)",
        background: "var(--card)",
        borderRadius: 12,
        padding: 12,
        marginTop: 12,
      }}
      aria-label={t.factsAria}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        <div>
          <div className="tag">{t.change}</div>
          <div className="mono" style={{ color: trend.color, marginTop: 4 }}>
            {trend.arrow}€{nf0.format(Math.abs(delta))}
          </div>
        </div>

        <div>
          <div className="tag">{t.rate}</div>
          <div className="mono" style={{ marginTop: 4 }}>
            {rateText}
          </div>
          <div className="tag" style={{ marginTop: 4, opacity: 0.8 }}>
            {t.derived}
          </div>
        </div>
      </div>

      {hasOfficialSeries ? (
        <>
          <div className="tag" style={{ marginTop: 10 }}>
            {t.sourcePeriods} {officialPrevPeriod} → {officialLatestPeriod}
          </div>

          {(officialPrevDate || officialLatestDate) && (
            <div className="tag" style={{ marginTop: 4, opacity: 0.8 }}>
              {t.sourceDates} {officialPrevDate || "?"} → {officialLatestDate || "?"}
            </div>
          )}

          <div className="tag" style={{ marginTop: 4, opacity: 0.8 }}>
            {t.sourceLive}
          </div>
        </>
      ) : (
        <div className="tag" style={{ marginTop: 10, color: "var(--bad)" }}>
          {t.sourceFallback}
        </div>
      )}

      {showDebtToGDP && (
        <div
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid var(--border)",
          }}
        >
          <DebtToGDPBlock
            countryName={localizedCountryName}
            yearLabel={yearLabel}
            debt={v1}
            gdp={gdpAbs}
            lang={effLang}
          />
        </div>
      )}
    </aside>
  );
}