"use client";
import { useMemo } from "react";
import { countries } from "@/lib/data";

const nf0 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
const nf2 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });

export default function CountryFacts({ code }) {
  const c = useMemo(() => {
    const want = String(code).toLowerCase();
    return countries.find(x => x.code.toLowerCase() === want) || null;
  }, [code]);

  if (!c) return null;

  const delta = (c.last_value_eur ?? 0) - (c.prev_value_eur ?? 0);
  const trend = delta > 0 ? "rising" : delta < 0 ? "falling" : "flat";
  const perSec = c._perSecond ?? 0;

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
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div className="tag">Change since last quarter</div>
          <div className="mono" style={{ color: delta >= 0 ? "var(--bad)" : "var(--ok)" }}>
            {delta >= 0 ? "↑ +" : "↓ -"}€{nf0.format(Math.abs(delta))}
          </div>
        </div>
        <div>
          <div className="tag">Rate (approx)</div>
          <div className="mono">
            €{nf2.format(perSec)} / s
          </div>
        </div>
      </div>
      <div className="tag" style={{ marginTop: 8 }}>
        Based on Eurostat last two quarters ({c.prev_date} → {c.last_date}). Simple linear estimate.
      </div>
    </aside>
  );
}
