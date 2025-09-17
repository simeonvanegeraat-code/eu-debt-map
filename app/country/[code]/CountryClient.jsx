"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { interpolateDebt } from "@/lib/data";

import MapCTA from "@/components/MapCTA";
import LabelsBar from "@/components/LabelsBar";
import ShareBar from "@/components/ShareBar";
import LatestArticles from "@/components/LatestArticles";
import CountryFacts from "./CountryFacts";

import { countryName } from "@/lib/countries";
import { getLocaleFromPathname } from "@/lib/locale";

// Toegestane talen ("" = EN op root)
const SUPPORTED = new Set(["", "en", "nl", "de", "fr"]);
const norm = (x) => (x === "" ? "en" : x);

// UI labels
const LIVE_LABELS = {
  en: "Estimated public debt (live):",
  nl: "Staatsschuld (live):",
  de: "Staatsschulden (live):",
  fr: "Dette publique estimée (live) :",
};

const BACK_LABELS = {
  en: "← Back",
  nl: "← Terug",
  de: "← Zurück",
  fr: "← Retour",
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

  // 1) Taal bepalen: prop > URL > EN
  const pathname = usePathname() || "/";
  const fromUrl = getLocaleFromPathname ? getLocaleFromPathname(pathname) : "";
  const effLang = useMemo(() => {
    const p = norm(lang);
    const u = norm(fromUrl);
    if (SUPPORTED.has(p)) return p;
    if (SUPPORTED.has(u)) return u;
    return "en";
  }, [lang, fromUrl]);

  // 2) Vertaalde weergavenaam van het land
  const displayName = safeCountry
    ? countryName(safeCountry.code, effLang)
    : "";

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
  const liveLabel = LIVE_LABELS[effLang] || LIVE_LABELS.en;

  const backHref =
    effLang === "nl" ? "/nl" :
    effLang === "de" ? "/de" :
    effLang === "fr" ? "/fr" : "/";

  const backText = BACK_LABELS[effLang] || BACK_LABELS.en;

  const shareTitle = (SHARE_TITLES[effLang] || SHARE_TITLES.en)(displayName);

  return (
    <>
      <Link className="btn" href={backHref} prefetch>
        {backText}
      </Link>

      <h2 style={{ marginTop: 12 }}>
        {safeCountry.flag} {displayName}
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

      <div
        className="grid"
        style={{ gridTemplateColumns: "1fr", gap: 16, marginTop: 16 }}
      >
        <div className="grid" style={{ gap: 16 }}>
          {/* Geef vertaalde naam door aan de CTA */}
          <MapCTA code={safeCountry.code} name={displayName} lang={effLang} />
          <LatestArticles max={1} />
        </div>
      </div>
    </>
  );
}
