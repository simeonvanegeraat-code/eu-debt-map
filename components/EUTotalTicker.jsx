// components/EUTotalTicker.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { countries, livePerSecondFor } from "@/lib/data";

export default function EUTotalTicker() {
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

  const formatted = new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)));

  return (
    <div
      role="region"
      aria-label="EU-27 total government debt (live)"
      style={{
        background: "#ffffff",
        color: "#0b1220",
        border: "1px solid var(--header-border, #e2e8f0)",
        borderRadius: 18,
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
          marginBottom: 6,
          fontSize: "0.875rem",
          lineHeight: "1.25rem"
        }}
      >
        EU-27 total government debt (live estimate)
      </div>

      <div
        className="ticker-hero num"
        style={{
          marginTop: "0.5rem"
        }}
      >
        <span
          suppressHydrationWarning
          style={{
            fontSize: "clamp(1.5rem, 6vw, 3.5rem)",
            fontWeight: 700,
            color: "#2563eb",
            lineHeight: 1.1,
            fontVariantNumeric: "tabular-nums",
            display: "block",
            wordBreak: "break-word"
          }}
        >
          €{formatted}
        </span>
      </div>
    </div>
  );
}