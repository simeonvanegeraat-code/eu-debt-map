"use client";

import { useEffect, useState } from "react";
import CountryPageExperience from "@/components/country/CountryPageExperience";
import MapCTA from "@/components/MapCTA";
import ShareBar from "@/components/ShareBar";
import { countryName } from "@/lib/countries";

const GDP_TTL_MS = 6 * 60 * 60 * 1000;

const UNKNOWN_COUNTRY = {
  en: "Unknown country",
  nl: "Onbekend land",
  de: "Unbekanntes Land",
  fr: "Pays inconnu",
};

const SHARE_TITLES = {
  en: (name) => `${name} public debt`,
  nl: (name) => `${name} staatsschuld`,
  de: (name) => `${name} Staatsschulden`,
  fr: (name) => `Dette publique ${name}`,
};

const AD_LABELS = {
  en: "Advertisement",
  nl: "Advertentie",
  de: "Anzeige",
  fr: "Publicité",
};

function pageTitleFor(lang, name) {
  if (lang === "nl") return `Staatsschuld ${name} (live)`;
  if (lang === "de") return `${name} Schuldenuhr (live)`;
  if (lang === "fr") return `Dette publique ${name} (en direct)`;
  return `${name} public debt (live)`;
}

function readGDPCache(iso2) {
  try {
    const raw = sessionStorage.getItem(`gdp:${iso2}`);
    if (!raw) return null;
    const value = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    if (Date.now() - (value.ts || 0) > GDP_TTL_MS) return null;
    if (!Number.isFinite(value.value)) return null;
    return { value: value.value, period: value.period || null };
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
    // Storage may be unavailable in privacy modes; the page still works without the cache.
  }
}

function ManualAd({ lang }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: 100,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <span
        style={{
          marginBottom: 4,
          color: "#94a3b8",
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {AD_LABELS[lang] || AD_LABELS.en}
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-9252617114074571"
        data-ad-slot="8705915822"
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export default function CountryClient({
  country,
  lang = "en",
  introSlot = null,
  relatedArticleSlot = null,
  breadcrumbSlot = null,
  titleOverride = null,
  gdpAbs: gdpAbsProp = null,
  gdpPeriod: gdpPeriodProp = null,
  yearLabel = "Latest",
}) {
  const effLang = ["en", "nl", "de", "fr"].includes(lang) ? lang : "en";
  const safeCountry = country || null;
  const serverGdp = safeCountry?.gdp || gdpAbsProp;
  const serverPeriod = safeCountry?.gdpPeriod || gdpPeriodProp;
  const hasOfficialRatio =
    Number.isFinite(Number(safeCountry?.official_debt_to_gdp_pct)) &&
    Number(safeCountry?.official_debt_to_gdp_pct) > 0;
  const [gdpAbs, setGdpAbs] = useState(Number.isFinite(serverGdp) ? serverGdp : null);
  const [gdpPeriod, setGdpPeriod] = useState(serverPeriod || null);

  useEffect(() => {
    if (!safeCountry || hasOfficialRatio || Number.isFinite(serverGdp)) return undefined;

    const geo = String(safeCountry.code || "").toUpperCase();
    const cached = readGDPCache(geo);
    if (cached) {
      const timer = window.setTimeout(() => {
        setGdpAbs(cached.value);
        setGdpPeriod(cached.period);
      }, 0);
      return () => window.clearTimeout(timer);
    }

    let cancelled = false;
    const controller = new AbortController();

    async function loadGDP() {
      try {
        const response = await fetch(`/api/gdp?geo=${encodeURIComponent(geo)}`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });
        const json = await response.json();
        if (!cancelled && json?.ok && Number.isFinite(json.gdp_eur)) {
          setGdpAbs(json.gdp_eur);
          setGdpPeriod(json.period || null);
          writeGDPCache(geo, json.gdp_eur, json.period || null);
        }
      } catch {
        // The official ratio remains the primary path; this fallback may fail silently.
      }
    }

    loadGDP();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [safeCountry, hasOfficialRatio, serverGdp]);

  if (!safeCountry) {
    return <div className="container card">{UNKNOWN_COUNTRY[effLang]}</div>;
  }

  const displayName = countryName(safeCountry.code, effLang);
  const title = titleOverride || pageTitleFor(effLang, displayName);
  const shareTitle = SHARE_TITLES[effLang](displayName);

  return (
    <CountryPageExperience
      country={safeCountry}
      lang={effLang}
      title={title}
      displayName={displayName}
      gdpAbs={gdpAbs}
      gdpPeriod={gdpPeriod || yearLabel}
      breadcrumbSlot={breadcrumbSlot}
      introSlot={introSlot}
      adSlot={<ManualAd lang={effLang} />}
      shareSlot={<ShareBar title={shareTitle} lang={effLang} />}
      mapSlot={<MapCTA code={safeCountry.code} name={displayName} lang={effLang} />}
      relatedArticleSlot={relatedArticleSlot}
    />
  );
}
