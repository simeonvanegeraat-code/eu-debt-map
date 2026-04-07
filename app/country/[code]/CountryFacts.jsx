"use client";

import { useMemo } from "react";
import DebtToGDPBlock from "@/components/DebtToGDPBlock";
import { countries } from "@/lib/data";
import { countryName } from "@/lib/countries";

// Vertaalde labels voor de statistieken
const LABELS = {
  en: {
    change: "Change since last quarter",
    rate: "Rate (approx)",
    derived: "Derived from the last two reference dates.",
    source: "Source: Eurostat (Debt: ",
    perSec: "/ s",
    factsAria: "Debt facts",
    latest: "Latest Est.",
  },
  nl: {
    change: "Verandering sinds vorig kwartaal",
    rate: "Tempo (geschat)",
    derived: "Afgeleid van de laatste twee peildatums.",
    source: "Bron: Eurostat (Schuld: ",
    perSec: "/ s",
    factsAria: "Schuldfeiten",
    latest: "Laatste schatting",
  },
  de: {
    change: "Veränderung seit letztem Quartal",
    rate: "Anstiegsrate (ca.)",
    derived: "Basierend auf den letzten zwei Stichtagen.",
    source: "Quelle: Eurostat (Schulden: ",
    perSec: "/ s",
    factsAria: "Schuldenfakten",
    latest: "Neueste Schätzung",
  },
  fr: {
    change: "Variation depuis le dernier trimestre",
    rate: "Taux (approx)",
    derived: "Dérivé des deux dernières dates de référence.",
    source: "Source : Eurostat (Dette : ",
    perSec: "/ s",
    factsAria: "Faits sur la dette",
    latest: "Dernière estimation",
  },
};

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

  // Bepaal de effectieve taal (fallback naar 'en')
  const effLang = ["en", "nl", "de", "fr"].includes(lang) ? lang : "en";
  const t = LABELS[effLang];

  // Dynamische nummer-formatting op basis van taal
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

  // 1. Debt en trend (uit lib/data, altijd beschikbaar)
  const v0 = Number(c.prev_value_eur) || 0;
  const v1 = Number(c.last_value_eur) || 0;
  const delta = v1 - v0;
  const perSec = Number.isFinite(c._perSecond) ? c._perSecond : 0;

  const trend =
    delta > 0
      ? { label: "rising", color: "var(--bad)", arrow: "↑ +" }
      : delta < 0
      ? { label: "falling", color: "var(--ok)", arrow: "↓ -" }
      : { label: "flat", color: "#9ca3af", arrow: "→ " };

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

  // 4. Gelokaliseerde landnaam voor child component
  const localizedCountryName =
    countryName(c.code, effLang) || c?.code?.toUpperCase() || "Country";

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
      {/* Top: kernfeiten */}
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

      <div className="tag" style={{ marginTop: 10 }}>
        {t.source}
        {c.prev_date} → {c.last_date})
      </div>

      {/* Debt-to-GDP blok + SEO-tekst */}
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