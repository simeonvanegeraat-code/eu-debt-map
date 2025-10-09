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
 * - gdpAbs (number, optioneel): GDP in euro (absolute waarde)
 * - yearLabel (string, optioneel): bv. "2024" of "Latest"
 *
 * Werking:
 * - Toont trend en per-seconde-schatting op basis van countries[] uit lib/data.
 * - Toont Debt-to-GDP-balk + SEO-tekst (Optie D) ALS er een GDP-waarde beschikbaar is
 *   (via prop gdpAbs of via c.gdp_eur / c.gdp_meur in je data).
 */
export default function CountryFacts({ code, gdpAbs: gdpAbsProp, yearLabel: yearLabelProp }) {
  const c = useMemo(() => {
    const want = String(code || "").toLowerCase();
    return countries.find((x) => x.code.toLowerCase() === want) || null;
  }, [code]);

  if (!c) return null;

  // Debt en trend
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

  // Probeer GDP te vinden:
  // 1) Prop gdpAbs (voorrang)
  // 2) c.gdp_eur (rechtstreeks in euro’s)
  // 3) c.gdp_meur (miljoen euro) → * 1e6
  const gdpFromDataEUR =
    Number.isFinite(Number(c?.gdp_eur))
      ? Number(c.gdp_eur)
      : Number.isFinite(Number(c?.gdp_meur))
      ? Number(c.gdp_meur) * 1_000_000
      : NaN;

  const gdpAbs = Number.isFinite(Number(gdpAbsProp)) ? Number(gdpAbsProp) : gdpFromDataEUR;
  const showDebtToGDP = Number.isFinite(gdpAbs) && gdpAbs > 0;

  // Yearlabel (optioneel, nice voor SEO-tekst)
  const yearLabel =
    yearLabelProp ||
    c?.last_date?.slice(0, 4) || // bv. "2024"
    "Latest";

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
        Source: Eurostat (last two quarters, {c.prev_date} → {c.last_date})
      </div>

      {/* Debt-to-GDP blok + SEO-tekst (Optie B + C + D) */}
      {showDebtToGDP && (
        <section className="card" style={{ marginTop: 16 }}>
          <DebtToGDPBlock
            countryName={c?.name || c?.code?.toUpperCase() || "Country"}
            yearLabel={yearLabel}
            debt={v1 /* laatste peildatum, consistent met je teller */}
            gdp={gdpAbs}
          />
        </section>
      )}
    </aside>
  );
}
