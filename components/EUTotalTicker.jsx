"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { countries } from "@/lib/data";

export default function EUTotalTicker() {
  const totals = useMemo(() => {
    const valid = countries.filter((c) => c.last_value_eur > 0 && c.prev_value_eur > 0);
    const last = valid.reduce((sum, c) => sum + c.last_value_eur, 0);
    const prev = valid.reduce((sum, c) => sum + c.prev_value_eur, 0);
    return { last, prev };
  }, []);

  const SECONDS = 90 * 24 * 60 * 60;
  const perSecond = (totals.last - totals.prev) / SECONDS;

  const [value, setValue] = useState(totals.last);
  const startedRef = useRef(false);

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

  const formatted = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 })
    .format(Math.max(0, Math.round(value)));

  return (
    <div className="card" style={{ display: "grid", gap: 8 }}>
      <div className="tag">EU-27 total government debt (live estimate)</div>
      <div className="mono" style={{ fontSize: 28 }}>
        <span suppressHydrationWarning>€{formatted}</span>
      </div>
    </div>
  );
}
