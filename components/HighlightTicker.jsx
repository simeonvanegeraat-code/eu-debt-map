// components/HighlightTicker.jsx
"use client";

import { useEffect, useState, useMemo } from "react";

function formatEUR(v) {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(Math.round(v));
}

/**
 * Props:
 * - label: "Largest debt" | "Fastest growing" | ...
 * - flag: country flag text/emoji
 * - name: country name
 * - start: starting debt value (number, in EUR)
 * - perSecond: growth per second (can be negative)
 * - accent: optional css color for the value line
 */
export default function HighlightTicker({ label, flag, name, start, perSecond, accent }) {
  const [value, setValue] = useState(start);

  useEffect(() => {
    // tik elke seconde door
    const id = setInterval(() => setValue(v => v + perSecond), 1000);
    return () => clearInterval(id);
  }, [perSecond]);

  const trendIcon = useMemo(() => (perSecond > 0 ? "↑" : perSecond < 0 ? "↓" : "→"), [perSecond]);
  const trendColor = useMemo(() => {
    if (accent) return accent;
    if (perSecond > 0) return "var(--bad)";   // rood bij oplopende schuld
    if (perSecond < 0) return "var(--ok)";    // groen bij dalende schuld
    return "var(--muted)";
  }, [perSecond, accent]);

  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #1f2b3a",
        borderRadius: 12,
        padding: 12,
      }}
      aria-live="polite"
    >
      <div className="tag">{label}</div>
      <div style={{ marginTop: 6 }}>
        <strong>{flag} {name}</strong>
        <div className="mono" style={{ marginTop: 2 }}>
          €{formatEUR(value)}
        </div>
        <div className="tag" style={{ marginTop: 4, color: trendColor }}>
          {trendIcon} {perSecond >= 0 ? "+" : "−"}€{formatEUR(Math.abs(perSecond))}/s · live estimate
        </div>
      </div>
    </div>
  );
}
