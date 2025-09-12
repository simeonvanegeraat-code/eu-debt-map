// app/country/[code]/CountryClient.jsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { interpolateDebt } from "@/lib/data";

import MapCTA from "@/components/MapCTA";
import LabelsBar from "@/components/LabelsBar";
import ShareBar from "@/components/ShareBar";
import LatestArticles from "@/components/LatestArticles";
import CountryFacts from "./CountryFacts";

const LIVE_LABELS = {
  en: "Estimated public debt (live):",
  nl: "Staatsschuld (live):",
  de: "Staatsschulden (live):",
  fr: "Dette publique estimée (live) :",
};

const SHARE_TITLES = {
  en: (name) => `${name} public debt`,
  nl: (name) => `${name} staatsschuld`,
  de: (name) => `${name} Staatsschulden`,
  fr: (name) => `${name} dette publique`,
};

export default function CountryClient({
  country,
  lang = "en",
  introSlot = null, // optioneel: taal-tekst boven de map
}) {
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

  if (!safeCountry) return <div className="container card">Unknown country</div>;

  const rateBoxId = "country-rate-desc";
  const liveLabel = LIVE_LABELS[lang] || LIVE_LABELS.en;

  const backHref =
    lang === "nl" ? "/nl" :
    lang === "de" ? "/de" :
    lang === "fr" ? "/fr" : "/";

  const shareTitle = (SHARE_TITLES[lang] || SHARE_TITLES.en)(safeCountry.name);

  return (
    <>
      <Link className="btn" href={backHref} prefetch>← Back</Link>

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
        {liveLabel} €{nf.format(Math.round(current))}
      </div>

      <ShareBar title={shareTitle} />

      <div id={rateBoxId}>
        <CountryFacts code={safeCountry.code} />
      </div>

      {/* Taal-specifieke SEO-intro (zelfde plek in elke taal) */}
      {introSlot}

      <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 16, marginTop: 16 }}>
        <div className="grid" style={{ gap: 16 }}>
          <MapCTA code={safeCountry.code} name={safeCountry.name} />
          <LatestArticles max={1} />
        </div>
      </div>
    </>
  );
}
