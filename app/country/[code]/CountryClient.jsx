// app/country/[code]/CountryClient.jsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { interpolateDebt } from "@/lib/data";

export default function CountryClient({ country }) {
  // Fallback safeguard (zou niet voorkomen door server-check)
  const safeCountry = country ?? null;

  // Respecteer prefers-reduced-motion: minder vaak updaten voor toegankelijkheid/zuinigheid
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [nowMs, setNowMs] = useState(() => Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    // 120ms zoals je had, maar iets trager bij reduced motion
    const interval = prefersReducedMotion ? 500 : 120;
    timerRef.current = setInterval(() => setNowMs(Date.now()), interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  // Intl formatter memoriseren
  const nf = useMemo(() => new Intl.NumberFormat("en-GB"), []);
  const current = useMemo(() => {
    if (!safeCountry) return 0;
    return interpolateDebt(safeCountry, nowMs);
  }, [safeCountry, nowMs]);

  if (!safeCountry) {
    return (
      <div className="container card">
        Unknown country
      </div>
    );
  }

  return (
    <>
      <Link className="btn" href="/" prefetch>
        ← Back
      </Link>

      <h2 style={{ marginTop: 12 }}>
        {safeCountry.flag} {safeCountry.name}
      </h2>

      <div
        className="mono"
        style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}
        aria-live="polite"
      >
        Current estimate: €{nf.format(Math.round(current))}
      </div>

      {/* Infobox met details (ongewijzigd) */}
      {/* Belangrijk: CountryFacts werkt nu met safeCountry.code */}
      {/* Als jouw CountryFacts in dezelfde map staat, behoud het importpad zoals je had */}
      {/* Voor tree-shaking en stabiliteit is het netter om CountryFacts hier te importeren */}
      {/* maar we laten jouw bestaande structuur met ./CountryFacts in stand: */}
      <CountryFacts code={safeCountry.code} />
    </>
  );
}

// Let op: omdat dit bestand naast page.jsx staat,
// zorg dat je in page.jsx geen aparte import van CountryFacts nodig hebt.
// Als jouw originele CountryFacts import in page.jsx zat, verplaats 'm hierheen:
import CountryFacts from "./CountryFacts";
