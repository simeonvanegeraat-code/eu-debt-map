// components/EUTotalTicker.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { countries } from "@/lib/data";
import { interpolateDebt } from "@/lib/data"; // bestaat al in jullie project

function perSecondRateForCountry(c) {
  // Vereist geldige waarden en datums
  const last = Number(c?.last_value_eur);
  const prev = Number(c?.prev_value_eur);
  const lastDate = c?.last_date;
  const prevDate = c?.prev_date;
  if (!Number.isFinite(last) || !Number.isFinite(prev) || !lastDate || !prevDate) return 0;

  const dtMs = new Date(lastDate).getTime() - new Date(prevDate).getTime();
  if (dtMs <= 0) return 0;

  const delta = last - prev;
  return delta / (dtMs / 1000); // €/s
}

export default function EUTotalTicker({ intervalMs = 120 }) {
  const [now, setNow] = useState(() => Date.now());
  const ref = useRef(null);

  useEffect(() => {
    ref.current = setInterval(() => setNow(Date.now()), intervalMs);
    return () => ref.current && clearInterval(ref.current);
  }, [intervalMs]);

  // Huidige som
  const totalNow = useMemo(() => {
    const t = countries.reduce((sum, c) => sum + (interpolateDebt(c, now) || 0), 0);
    return Math.max(0, t); // geen negatieve rare fallback
  }, [now]);

  // Geaggregeerde €/s snelheid
  const ratePerSec = useMemo(() => {
    return countries.reduce((sum, c) => sum + perSecondRateForCountry(c), 0);
  }, []); // constant binnen dit datasetvenster

  const nf = new Intl.NumberFormat("en-GB");
  const sign = ratePerSec >= 0 ? "+" : "−"; // typografische minus

  return (
    <div className="card" style={{ display: "grid", gap: 8 }}>
      <div className="tag">EU-27 total (live estimate)</div>
      <div
        className="mono"
        aria-live="polite"
        style={{ fontSize: 28, fontWeight: 800 }}
      >
        €{nf.format(Math.round(totalNow))}
      </div>
      <div className="tag">
        Rate (approx): {sign}€{nf.format(Math.abs(ratePerSec).toFixed(2))} / s
      </div>
    </div>
  );
}
