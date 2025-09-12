// app/country/[code]/CountryClient.jsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { interpolateDebt } from "@/lib/data";

// Nieuwe helpers/blocks
import CountrySwitcher from "@/components/CountrySwitcher";
import MapCTA from "@/components/MapCTA";
import LabelsBar from "@/components/LabelsBar";
import ShareBar from "@/components/ShareBar";
import CountryPager from "@/components/CountryPager";
import LatestArticles from "@/components/LatestArticles";

// Als jouw CountryFacts in dezelfde map staat:
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
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

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

  // id voor a11y: rate-box beschrijft het live bedrag
  const rateBoxId = "country-rate-desc";

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <Link className="btn" href="/" prefetch>
          ← Back
        </Link>

        {/* Quick win #1: snelle landwissel */}
        <div className="hidden md:block" style={{ minWidth: 360 }}>
          <CountrySwitcher currentCode={safeCountry.code} />
        </div>
      </div>

      <h2 style={{ marginTop: 12 }}>
        {safeCountry.flag} {safeCountry.name}
      </h2>

      {/* Quick win #5: kleine labels als data beschikbaar is */}
      <LabelsBar country={safeCountry} valueNow={current} />

      <div
        className="mono"
        style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}
        aria-live="polite"
        aria-describedby={rateBoxId}
      >
        Estimated public debt (live): €{nf.format(Math.round(current))}
      </div>

      {/* Quick win #6: Share bar (link / X / Reddit) */}
      <ShareBar title={`${safeCountry.name} public debt`} />

      {/* Infobox met details (ongewijzigd), maar geef rate-box id door voor a11y */}
      <div id={rateBoxId}>
        <CountryFacts code={safeCountry.code} />
      </div>

      {/* Layout: twee kolommen op desktop */}
      <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 16, marginTop: 16 }}>
        {/* Links: Map-CTA + Artikelen */}
        <div className="grid" style={{ gap: 16 }}>
          {/* Quick win #2: mini-map/CTA (lichte variant die niets kan breken) */}
          <MapCTA code={safeCountry.code} name={safeCountry.name} />

          {/* Quick win #3: LAATSTE artikelen (niet land-specifiek) */}
          <LatestArticles max={3} />
        </div>

        {/* Rechts: op mobiel valt dit eronder; op desktop kun je 2 kolommen doen via CSS van je thema */}
      </div>

      {/* Quick win #4: vorige/volgende land navigatie */}
      <CountryPager code={safeCountry.code} />

      {/* Quick win #1 (mobiel): landwissel onderaan */}
      <div className="md:hidden" style={{ marginTop: 16 }}>
        <CountrySwitcher currentCode={safeCountry.code} />
      </div>
    </>
  );
}
