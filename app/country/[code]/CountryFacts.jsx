"use client";

import { useMemo } from "react";
import DebtToGDPBlock from "@/components/DebtToGDPBlock";
import { countries } from "@/lib/data";

// Vertaalde labels voor de statistieken
const LABELS = {
  en: {
    change: "Change since last quarter",
    rate: "Rate (approx)",
    derived: "Derived from the last two reference dates.",
    source: "Source: Eurostat (Debt: ",
    perSec: "/ s",
  },
  nl: {
    change: "Verandering sinds vorig kwartaal",
    rate: "Tempo (geschat)",
    derived: "Afgeleid van de laatste twee peildatums.",
    source: "Bron: Eurostat (Schuld: ",
    perSec: "/ s",
  },
  de: {
    change: "Veränderung seit letztem Quartal",
    rate: "Anstiegsrate (ca.)",
    derived: "Basierend auf den letzten zwei Stichtagen.",
    source: "Quelle: Eurostat (Schulden: ",
    perSec: "/ s",
  },
  fr: {
    change: "Variation depuis le dernier trimestre",
    rate: "Taux (approx)",
    derived: "Dérivé des deux dernières dates de référence.",
    source: "Source : Eurostat (Dette : ",
    perSec: "/ s",
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

  // Dynamische nummer-formatting op basis van taal (Punten vs Komma's)
  const nfLocale =
    effLang === "nl" || effLang === "de"
      ? "de-DE" // Punten als duizendtallen (1.000,00)
      : effLang === "fr"
      ? "fr-FR" // Spaties (1 000,00)
      : "en-GB"; // Komma's (1,000.00)

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

  // 2. GDP Bepaling
  const gdpFromDataEUR = Number.isFinite(Number(c?.gdp_eur))
    ? Number(c.gdp_eur)
    : Number.isFinite(Number(c?.gdp_meur))
    ? Number(c.gdp_meur) * 1_000_000
    : NaN;

  const gdpAbs = Number.isFinite(Number(gdpAbsProp))
    ? Number(gdpAbsProp)
    : gdpFromDataEUR;
  const showDebtToGDP = Number.isFinite(gdpAbs) && gdpAbs > 0;

  // 3. Label Bepaling
  const yearLabel =
    yearLabelProp ||
    (c?.last_date ? `FY ${c.last_date.slice(0, 4)}` : "Latest Est.");

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
      aria-label="Debt facts"
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
        <section className="card" style={{ marginTop: 16 }}>
          {/* We geven nu 'lang' door aan het child component */}
          <DebtToGDPBlock
            countryName={c?.name || c?.code?.toUpperCase() || "Country"}
            yearLabel={yearLabel}
            debt={v1}
            gdp={gdpAbs}
            lang={effLang}
          />
        </section>
      )}
    </aside>
  );
}