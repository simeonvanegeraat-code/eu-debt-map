// components/EUTotalTicker.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { countries, livePerSecondFor } from "@/lib/data";

export default function EUTotalTicker({
  label = "EU-27 total government debt (live estimate)",
  ariaLabel = "EU-27 total government debt live estimate",
  locale = "en-GB",
}) {
  const totals = useMemo(() => {
    const valid = (countries || []).filter(
      (c) => c && c.last_value_eur > 0 && c.prev_value_eur > 0
    );

    const last = valid.reduce((sum, c) => sum + c.last_value_eur, 0);
    const perSecond = valid.reduce((sum, c) => sum + livePerSecondFor(c), 0);

    return { last, perSecond };
  }, []);

  const [value, setValue] = useState(totals.last);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const t0 = Date.now();
    const id = setInterval(() => {
      const elapsed = (Date.now() - t0) / 1000;
      setValue(totals.last + totals.perSecond * elapsed);
    }, 250);

    return () => clearInterval(id);
  }, [totals.last, totals.perSecond]);

  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)));

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      style={{
        background: "#ffffff",
        color: "#0b1220",
        border: "1px solid var(--header-border, #e2e8f0)",
        borderRadius: 20,
        padding: 18,
        boxShadow: "var(--shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05))",
        maxWidth: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        className="tag"
        style={{
          color: "#334155",
          marginBottom: 10,
          fontSize: "0.95rem",
          lineHeight: "1.35rem",
          fontWeight: 600,
        }}
      >
        {label}
      </div>

      <div className="ticker-hero num" style={{ marginTop: 0 }}>
        <span
          suppressHydrationWarning
          style={{
            fontSize: "clamp(2rem, 4.1vw, 3.8rem)",
            fontWeight: 700,
            color: "#2563eb",
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            fontVariantNumeric: "tabular-nums",
            display: "block",
            whiteSpace: "normal",
            wordBreak: "normal",
            overflowWrap: "anywhere",
          }}
        >
          €{formatted}
        </span>
      </div>
    </div>
  );
}