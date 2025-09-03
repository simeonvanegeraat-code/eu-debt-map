"use client";

import { useMemo } from "react";
import { countries } from "@/lib/data";

const nf0 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
const nf2 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });

export default function CountryFacts({ code }) {
  const c = useMemo(() => {
    const want = String(code || "").toLowerCase();
    return countries.find((x) => x.code.toLowerCase() === want) || null;
  }, [code]);

  if (!c) return null;

  const v0 = Number(c.prev_value_eur) || 0;
  const v1 = Number(c.last_value_eur) || 0;
  const delta = v1 - v0;
  const perSec = Number.isFinite(c._perSecond) ? c._perSecond : 0;
  const trend =
    delta > 0 ? { label: "rising", color: "var(--bad)", arrow: "↑ +" } :
    delta < 0 ? { label: "falling", color: "var(--ok)", arrow: "↓ -" } :
    { label: "flat", color: "#9ca3af", arrow: "→ " };

  // Safety: toon geen ‘0/NaN’ onnodig luid
  const rateText =
    Math.abs(perSec) < 0.005 ? "≈ €0.00 / s" : `€${nf2.format(perSec)} / s`;

  return (
    <aside
      className="card"
      style={{
        border: "1px solid #1f2b3a",
        background: "#0f172a",
        borderRadius: 12,
        padding: 12,
        marginTop: 12,
      }}
      aria-label="Debt facts"
    >
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
        Based on Eurostat last two quarters ({c.prev_date} → {c.last_date}). Simple linear estimate (demo).
      </div>
    </aside>
  );
}
