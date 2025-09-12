// app/country/[code]/CountryClient.jsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { interpolateDebt } from "@/lib/data";

import MapCTA from "@/components/MapCTA";
import LabelsBar from "@/components/LabelsBar";
import ShareBar from "@/components/ShareBar";
import CountryPager from "@/components/CountryPager";
import LatestArticles from "@/components/LatestArticles";
import CountrySwitcher from "@/components/CountrySwitcher"; // alleen onderaan
import CountryFacts from "./CountryFacts";

export default function CountryClient({ country }) {
  const safeCountry = country ?? null;

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [nowMs, setNowMs] = useState(() => Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    const interval = prefersReducedMotion ? 500 : 120;
    timerRef.current = setInterval(() => setNowMs(Date.now()), interval);
    return () => timerRef.current && clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  const nf = useMemo(() => new Intl.NumberFormat("en-GB"), []);
  const current = useMemo(() => {
    if (!safeCountry) return 0;
    return interpolateDebt(safeCountry, nowMs);
  }, [safeCountry, nowMs]);

  if (!safeCountry) {
    return <div className="container card">Unknown country</div>;
  }

  const rateBoxId = "country-rate-desc";

  return (
    <>
      <Link className="btn" href="/" prefetch>
        ← Back
      </Link>

      <h2 style={{ marginTop: 12 }}>
        {safeCountry.flag} {safeCountry.name}
      </h2>

      <LabelsBar country={safeCountry} valueNow={current} />

      <div
        className="mono"
        style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}
        aria-live="polite"
        aria-describedby={rateBoxId}
      >
        Estimated public debt (live): €{nf.format(Math.round(current))}
      </div>

      {/* strakke share bar */}
      <ShareBar title={`${safeCountry.name} public debt`} />

      {/* Facts + rate uitleg */}
      <div id={rateBoxId}>
        <CountryFacts code={safeCountry.code} />
      </div>

      {/* Linker kolom: CTA + laatste artikel */}
      <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 16, marginTop: 16 }}>
        <div className="grid" style={{ gap: 16 }}>
          <MapCTA code={safeCountry.code} name={safeCountry.name} />
          <LatestArticles max={1} />
        </div>
      </div>

      <CountryPager code={safeCountry.code} />

      {/* Switcher alleen onderaan */}
      <div style={{ marginTop: 16 }}>
        <CountrySwitcher currentCode={safeCountry.code} />
      </div>
    </>
  );
}
