// components/EUTotalTicker.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { countries } from "@/lib/data";

export default function EUTotalTicker() {
  // Zelfde logica: som van last en prev op basis van landen met geldige waarden
  const totals = useMemo(() => {
    const valid = (countries || []).filter(
      (c) => c && c.last_value_eur > 0 && c.prev_value_eur > 0
    );
    const last = valid.reduce((sum, c) => sum + c.last_value_eur, 0);
    const prev = valid.reduce((sum, c) => sum + c.prev_value_eur, 0);
    return { last, prev };
  }, []);

  // Zelfde aanname: ~90 dagen tussen twee kwartalen
  const SECONDS = 90 * 24 * 60 * 60;
  const perSecond = (totals.last - totals.prev) / SECONDS;

  const [value, setValue] = useState(totals.last);
  const startedRef = useRef(false);

  // Zelfde updatefrequentie: elke 250 ms, op basis van elapsed tijd
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const t0 = Date.now();
    const id = setInterval(() => {
      const elapsed = (Date.now() - t0) / 1000;
      setValue(totals.last + perSecond * elapsed);
    }, 250);
    return () => clearInterval(id);
  }, [totals.last, perSecond]);

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
        border: "1px solid var(--header-border)",
        borderRadius: 18,
        padding: 18,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="tag" style={{ color: "#334155", marginBottom: 6 }}>
        EU-27 total government debt (live estimate)
      </div>

      {/* ✅ Nieuwe typografie: groot, Space Grotesk + tabular-nums */}
      <div className="ticker-hero num">
        <span suppressHydrationWarning>€{formatted}</span>
      </div>
    </div>
  );
}
