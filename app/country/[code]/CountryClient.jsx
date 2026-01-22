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

// UI labels (al meertalig)
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

// Kleine client cache voor GDP-API (fallback, wordt nu minder gebruikt)
const GDP_TTL_MS = 6 * 60 * 60 * 1000; // 6 uur
function readGDPCache(iso2) {
  try {
    const raw = sessionStorage.getItem(`gdp:${iso2}`);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== "object") return null;
    if (Date.now() - (obj.ts || 0) > GDP_TTL_MS) return null;
    if (!Number.isFinite(obj.value)) return null;
    return { value: obj.value, period: obj.period || null };
  } catch {
    return null;
  }
}
function writeGDPCache(iso2, value, period) {
  try {
    sessionStorage.setItem(
      `gdp:${iso2}`,
      JSON.stringify({ value, period: period || null, ts: Date.now() })
    );
  } catch {
    /* ignore */
  }
}

// Visually hidden style (val niet terug op sr-only class)
const SR_ONLY = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

// --- NIEUW: De Handmatige Advertentie Component ---
function ManualAd() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div
      style={{
        margin: "24px 0",
        textAlign: "center",
        minHeight: "100px", // Reserveer ruimte om verspringen te voorkomen
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <span style={{ fontSize: "10px", color: "#cbd5e1", marginBottom: "4px", textTransform: "uppercase" }}>
        Advertisement
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9252617114074571"
        data-ad-slot="8705915822"
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}

export default function CountryClient({
  country,
  lang = "en",
  introSlot = null,

  // Optioneel: kan via SSR worden meegegeven
  gdpAbs: gdpAbsProp = null,
  gdpPeriod: gdpPeriodProp = null,
  yearLabel = "Latest", // Fallback label
}) {
  const safeCountry = country ?? null;

  // 1) Taal bepalen
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

  // --- AANGEPAST: Slimme formatter voor DE (punten) en EN (komma's) ---
  const nf = useMemo(() => {
    const localeMap = {
      nl: "nl-NL", // Punten (1.000)
      de: "de-DE", // Punten (1.000)
      fr: "fr-FR", // Spaties (1 000)
      en: "en-GB", // Komma's (1,000)
    };
    // Kies de juiste locale op basis van effLang, of val terug op Engels
    return new Intl.NumberFormat(localeMap[effLang] || "en-GB");
  }, [effLang]);
  // --------------------------------------------------------------------

  const current = useMemo(() => {
    if (!safeCountry) return 0;
    return interpolateDebt(safeCountry, nowMs);
  }, [safeCountry, nowMs]);

  // ---------- GDP Logic (FIXED) ----------
  // We geven prioriteit aan data die al in het 'country' object zit (van de server)
  // Dit zorgt dat de "5.5% fix" behouden blijft.
  const serverGdp = safeCountry?.gdp || gdpAbsProp;
  const serverPeriod = safeCountry?.gdpPeriod || gdpPeriodProp;

  const [gdpAbs, setGdpAbs] = useState(
    Number.isFinite(serverGdp) ? serverGdp : null
  );
  const [gdpPeriod, setGdpPeriod] = useState(serverPeriod || null);

  useEffect(() => {
    if (!safeCountry) return;
    
    // BELANGRIJK: Als de server al GDP data heeft meegegeven (onze fix),
    // dan hoeven we NIET te fetchen. Dit voorkomt dat we oude data laden.
    if (Number.isFinite(serverGdp)) {
        return; 
    }

    const geo = String(safeCountry.code || "").toUpperCase();
    const cached = typeof window !== "undefined" ? readGDPCache(geo) : null;
    if (cached) {
      setGdpAbs(cached.value);
      setGdpPeriod(cached.period);
      return;
    }

    let cancelled = false;
    const ctrl = new AbortController();

    (async () => {
      try {
        const res = await fetch(`/api/gdp?geo=${encodeURIComponent(geo)}`, {
          method: "GET",
          cache: "no-store",
          signal: ctrl.signal,
        });
        const json = await res.json();
        if (!cancelled && json?.ok && Number.isFinite(json.gdp_eur)) {
          setGdpAbs(json.gdp_eur);
          setGdpPeriod(json.period || null);
          writeGDPCache(geo, json.gdp_eur, json.period || null);
        }
      } catch {
        // stil falen
      }
    })();

    return () => {
      cancelled = true;
      try { ctrl.abort(); } catch {}
    };
  }, [safeCountry, serverGdp]);

  if (!safeCountry) return <div className="container card">Unknown country</div>;

  const rateBoxId = "country-rate-desc";
  const liveLabel = LIVE_LABELS[effLang] || LIVE_LABELS.en;

  const backHref =
    effLang === "nl"
      ? "/nl"
      : effLang === "de"
      ? "/de"
      : effLang === "fr"
      ? "/fr"
      : "/";

  const backText = BACK_LABELS[effLang] || BACK_LABELS.en;
  const shareTitle = (SHARE_TITLES[effLang] || SHARE_TITLES.en)(displayName);

  // Live Debt/GDP (alleen als GDP bekend is)
  const ratioPct =
    Number.isFinite(gdpAbs) && gdpAbs > 0 ? (current / gdpAbs) * 100 : null;

  // Bepaal het label voor de tabel: Gebruik de periode (Live Estimate) indien beschikbaar
  const finalYearLabel = gdpPeriod || yearLabel;

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
        {safeCountry.flag ? (
          <span style={{ marginRight: 8 }}>{safeCountry.flag}</span>
        ) : null}
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
        style={{
          marginTop: 14,
          textAlign: "center",
        }}
        aria-live="polite"
        aria-describedby={rateBoxId}
      >
        <span style={SR_ONLY}>{liveLabel}</span>

        <span
          className="ticker-hero num"
          suppressHydrationWarning
          style={{
            display: "inline-block",
            lineHeight: 1.1,
            fontWeight: 800,
            fontSize: "clamp(38px, 8.8vw, 68px)",
            letterSpacing: "0.2px",
            textShadow: "0 1px 0 rgba(15,23,42,0.18)",
          }}
        >
          €{nf.format(Math.round(current))}
        </span>
      </div>

      {/* Infobox */}
      <div
        style={{
          marginTop: 12,
          width: "100%",
          border: "1px solid rgba(15,23,42,0.08)",
          background: "rgba(241,245,249,0.6)",
          borderRadius: 12,
          padding: "10px 16px",
          fontSize: 13.5,
          color: "rgb(71,85,105)",
          textAlign: "left",
        }}
        id={rateBoxId}
      >
        Based on the latest Eurostat data. Live estimate using linearized
        growth between releases.
      </div>

      <hr
        aria-hidden="true"
        style={{
          marginTop: 12,
          marginBottom: 6,
          border: 0,
          borderTop: "1px solid rgba(15,23,42,0.08)",
        }}
      />

      {/* Delen */}
      <div style={{ marginTop: 8 }}>
        <ShareBar title={shareTitle} />
      </div>

      {/* Feitenblok */}
      <div style={{ marginTop: 8 }}>
        <CountryFacts
          code={safeCountry.code}
          gdpAbs={Number.isFinite(gdpAbs) ? gdpAbs : undefined}
          yearLabel={finalYearLabel}
        />
      </div>

      {/* --- JOUW NIEUWE HORIZONTALE ADVERTENTIE --- */}
      <ManualAd />

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