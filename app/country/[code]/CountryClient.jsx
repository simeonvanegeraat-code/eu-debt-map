// app/country/[code]/CountryClient.jsx
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
import DebtToGDPPill from "@/components/DebtToGDPPill";

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
  introSlot = null,

  // Optioneel: kan nog steeds via SSR worden meegegeven, maar is niet vereist
  gdpAbs: gdpAbsFromServer = null,
  gdpPeriod: gdpPeriodFromServer = null,
  yearLabel = "Latest",
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

  // 2) Vertaalde weergavenaam
  const displayName = safeCountry ? countryName(safeCountry.code, effLang) : "";

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

  // ---------- NIEUW: GDP client-side ophalen ----------
  const [gdpAbs, setGdpAbs] = useState(
    Number.isFinite(gdpAbsFromServer) ? gdpAbsFromServer : null
  );
  const [gdpPeriod, setGdpPeriod] = useState(gdpPeriodFromServer || null);

  useEffect(() => {
    if (!safeCountry || Number.isFinite(gdpAbsFromServer)) return; // al via SSR
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/gdp?geo=${encodeURIComponent(safeCountry.code)}`, {
          method: "GET",
          cache: "no-store",
        });
        const json = await res.json();
        if (!cancelled && json?.ok && Number.isFinite(json.gdp_eur)) {
          setGdpAbs(json.gdp_eur);
          setGdpPeriod(json.period || null);
        }
      } catch {
        // stil falen; UI blijft werken zonder GDP
      }
    })();
    return () => { cancelled = true; };
  }, [safeCountry, gdpAbsFromServer]);

  if (!safeCountry) return <div className="container card">Unknown country</div>;

  const rateBoxId = "country-rate-desc";
  const liveLabel = LIVE_LABELS[effLang] || LIVE_LABELS.en;

  const backHref =
    effLang === "nl" ? "/nl" :
    effLang === "de" ? "/de" :
    effLang === "fr" ? "/fr" : "/";

  const backText = BACK_LABELS[effLang] || BACK_LABELS.en;
  const shareTitle = (SHARE_TITLES[effLang] || SHARE_TITLES.en)(displayName);

  // Live Debt/GDP (alleen als GDP bekend is)
  const ratioPct =
    Number.isFinite(gdpAbs) && gdpAbs > 0 ? (current / gdpAbs) * 100 : null;

  return (
    <>
      {/* Back knop */}
      <div style={{ marginBottom: 8 }}>
        <Link className="btn" href={backHref} prefetch>
          {backText}
        </Link>
      </div>

      {/* Landtitel */}
      <h1 style={{ margin: 0 }}>
        {safeCountry.flag ? <span style={{ marginRight: 8 }}>{safeCountry.flag}</span> : null}
        {displayName}
      </h1>

      {/* Labels + subtiele Debt/GDP pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginTop: 6,
        }}
      >
        <LabelsBar country={safeCountry} valueNow={current} />
        <DebtToGDPPill ratioPct={ratioPct} />
      </div>

      {/* Live bedrag */}
      <div
        className="mono"
        style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 10 }}
        aria-live="polite"
        aria-describedby={rateBoxId}
      >
        <span className="tag" style={{ whiteSpace: "nowrap" }}>
          {liveLabel}
        </span>
        <span className="ticker-hero num" suppressHydrationWarning>
          €{nf.format(Math.round(current))}
        </span>
      </div>

      {/* Delen */}
      <div style={{ marginTop: 8 }}>
        <ShareBar title={shareTitle} />
      </div>

      {/* Feitenblok — toont Debt-to-GDP zodra gdpAbs bekend is */}
      <div id={rateBoxId} style={{ marginTop: 8 }}>
        <CountryFacts
          code={safeCountry.code}
          gdpAbs={Number.isFinite(gdpAbs) ? gdpAbs : undefined}
          yearLabel={yearLabel}
        />
        {/* Debug-tip:
        {Number.isFinite(gdpAbs) && <div className="tag">GDP: €{nf.format(Math.round(gdpAbs))} ({gdpPeriod || "—"})</div>}
        */}
      </div>

      {/* Taal-specifieke SEO-intro */}
      {introSlot}

      {/* CTA + artikel */}
      <div
        className="grid"
        style={{ gridTemplateColumns: "1fr", gap: 16, marginTop: 16 }}
      >
        <div className="grid" style={{ gap: 16 }}>
          <MapCTA code={safeCountry.code} name={displayName} lang={effLang} />
          <LatestArticles max={1} />
        </div>
      </div>
    </>
  );
}
