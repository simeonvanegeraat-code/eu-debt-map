"use client";

import { useMemo } from "react";
import DebtToGDPBlock from "@/components/DebtToGDPBlock";
import { countries } from "@/lib/data";

const nf0 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
const nf2 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });

/**
 * CountryFacts
 * ------------
 * Props:
 * - code (string, vereist): landcode (bv. "NL", "FR")
 * - gdpAbs (number, optioneel): Live GDP in euro (kwartaal run-rate of jaarlijks)
 * - yearLabel (string, optioneel): De bronperiode, bv "2025-Q3"
 *
 * Werking:
 * - Toont trend en per-seconde-schatting op basis van countries[] uit lib/data.
 * - Rendert Debt-to-GDP-balk + SEO-tekst.
 */
export default function CountryFacts({ code, gdpAbs: gdpAbsProp, yearLabel: yearLabelProp }) {
  const c = useMemo(() => {
    const want = String(code || "").toLowerCase();
    return countries.find((x) => x.code.toLowerCase() === want) || null;
  }, [code]);

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

  const rateText = Math.abs(perSec) < 0.005 ? "≈ €0.00 / s" : `€${nf2.format(perSec)} / s`;

  // 2. GDP Bepaling
  // Prioriteit: 1. Live Prop (vers van Eurostat), 2. Fallback data (lib/data)
  const gdpFromDataEUR =
    Number.isFinite(Number(c?.gdp_eur))
      ? Number(c.gdp_eur)
      : Number.isFinite(Number(c?.gdp_meur))
      ? Number(c.gdp_meur) * 1_000_000
      : NaN;

  const gdpAbs = Number.isFinite(Number(gdpAbsProp)) ? Number(gdpAbsProp) : gdpFromDataEUR;
  const showDebtToGDP = Number.isFinite(gdpAbs) && gdpAbs > 0;

  // 3. Label Bepaling (Cruciaal voor de tekst)
  // Als we prop data hebben (bv "2025-Q3"), gebruiken we die.
  // Anders vallen we terug op een generieke term zodat we niet per ongeluk "2024" zeggen bij 2025 data.
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
          <div className="tag">Change since last quarter</div>
          <div className="mono" style={{ color: trend.color, marginTop: 4 }}>
            {trend.arrow}€{nf0.format(Math.abs(delta))}
          </div>
        </div>

        <div>
          <div className="tag">Rate (approx)</div>
          <div className="mono" style={{ marginTop: 4 }}>{rateText}</div>
          <div className="tag" style={{ marginTop: 4, opacity: 0.8 }}>
            Derived from the last two reference dates.
          </div>
        </div>
      </div>

      <div className="tag" style={{ marginTop: 10 }}>
        Source: Eurostat (Debt: {c.prev_date} → {c.last_date})
      </div>

      {/* Debt-to-GDP blok + SEO-tekst */}
      {showDebtToGDP && (
        <section className="card" style={{ marginTop: 16 }}>
          <DebtToGDPBlock
            countryName={c?.name || c?.code?.toUpperCase() || "Country"}
            yearLabel={yearLabel}
            debt={v1} 
            gdp={gdpAbs}
          />
        </section>
      )}
    </aside>
  );
}