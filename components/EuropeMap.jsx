"use client";

import { useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { countries as DATA, livePerSecondFor } from "@/lib/data";
import { getLocaleFromPathname, withLocale } from "@/lib/locale";

const GEO_URL = "/maps/countries-110m.json";

const STYLE = {
  stroke: "#ffffff",
  strokeWidth: 0.7,

  colorRising: "#ef4444",
  colorRisingSoft: "#f87171",

  colorFalling: "#22c55e",
  colorFallingSoft: "#34d399",

  colorNoData: "#cbd5e1",
  hoverColor: "#2563eb",
};

const NAME_TO_ISO2 = {
  Austria: "AT",
  Belgium: "BE",
  Bulgaria: "BG",
  Croatia: "HR",
  Cyprus: "CY",
  Czechia: "CZ",
  Denmark: "DK",
  Estonia: "EE",
  Finland: "FI",
  France: "FR",
  Germany: "DE",
  Greece: "GR",
  Hungary: "HU",
  Ireland: "IE",
  Italy: "IT",
  Latvia: "LV",
  Lithuania: "LT",
  Luxembourg: "LU",
  Malta: "MT",
  Netherlands: "NL",
  Poland: "PL",
  Portugal: "PT",
  Romania: "RO",
  Slovakia: "SK",
  Slovenia: "SI",
  Spain: "ES",
  Sweden: "SE",
};

const ALT_NAME_TO_ISO2 = {
  "Czech Republic": "CZ",
  "Kingdom of the Netherlands": "NL",
  "Republic of Cyprus": "CY",
  "Republic of Ireland": "IE",
  "Federal Republic of Germany": "DE",
  "Hellenic Republic": "GR",
  "Republic of Poland": "PL",
  "Republic of Slovenia": "SI",
  "Republic of Croatia": "HR",
  "Portuguese Republic": "PT",
  "Kingdom of Spain": "ES",
  "Kingdom of Sweden": "SE",
  "Italian Republic": "IT",
  "French Republic": "FR",
};

function nameToIso2(rawName) {
  if (!rawName) return null;

  if (NAME_TO_ISO2[rawName]) return NAME_TO_ISO2[rawName];
  if (ALT_NAME_TO_ISO2[rawName]) return ALT_NAME_TO_ISO2[rawName];

  const n = String(rawName).replace(/\s*\(.*?\)\s*/g, "").trim();

  if (NAME_TO_ISO2[n]) return NAME_TO_ISO2[n];
  if (ALT_NAME_TO_ISO2[n]) return ALT_NAME_TO_ISO2[n];

  const lower = n.toLowerCase();

  if (lower.includes("czech")) return "CZ";
  if (lower.includes("netherland")) return "NL";
  if (lower.includes("germany")) return "DE";
  if (lower.includes("greece") || lower.includes("hellenic")) return "GR";
  if (lower.includes("ireland")) return "IE";
  if (lower.includes("cyprus")) return "CY";
  if (lower.includes("slovak")) return "SK";
  if (lower.includes("sloven")) return "SI";
  if (lower.includes("croat")) return "HR";
  if (lower.includes("portugal")) return "PT";
  if (lower.includes("spain")) return "ES";
  if (lower.includes("swed")) return "SE";
  if (lower.includes("france")) return "FR";
  if (lower.includes("ital")) return "IT";
  if (lower.includes("romania")) return "RO";
  if (lower.includes("poland")) return "PL";
  if (lower.includes("bulgar")) return "BG";
  if (lower.includes("estonia")) return "EE";
  if (lower.includes("latvia")) return "LV";
  if (lower.includes("lithuan")) return "LT";
  if (lower.includes("luxem")) return "LU";
  if (lower.includes("malta")) return "MT";
  if (lower.includes("austria")) return "AT";
  if (lower.includes("belg")) return "BE";
  if (lower.includes("denmark")) return "DK";
  if (lower.includes("finland")) return "FI";
  if (lower.includes("hungary")) return "HU";

  return null;
}

function formatShortEuro(value) {
  if (!Number.isFinite(value)) return "No data";

  const abs = Math.abs(value);

  if (abs >= 1_000_000_000_000) {
    return `€${(value / 1_000_000_000_000).toFixed(2)}tn`;
  }

  if (abs >= 1_000_000_000) {
    return `€${(value / 1_000_000_000).toFixed(2)}bn`;
  }

  if (abs >= 1_000_000) {
    return `€${(value / 1_000_000).toFixed(1)}m`;
  }

  return `€${Math.round(value).toLocaleString("en-GB")}`;
}

function formatPerSecond(value) {
  if (!Number.isFinite(value)) return "€0/s";

  const sign = value >= 0 ? "+" : "−";
  const abs = Math.abs(value);

  return `${sign}€${Math.round(abs).toLocaleString("en-GB")}/s`;
}

function getCountryTrend(country) {
  if (!country) return 0;
  return (Number(country.last_value_eur) || 0) - (Number(country.prev_value_eur) || 0);
}

function getFill(country) {
  if (!country || !country.last_value_eur || !country.prev_value_eur) {
    return STYLE.colorNoData;
  }

  const trend = getCountryTrend(country);

  if (trend > 0) return STYLE.colorRisingSoft;
  if (trend < 0) return STYLE.colorFallingSoft;

  return STYLE.colorNoData;
}

function getTrendLabel(country) {
  const trend = getCountryTrend(country);

  if (trend > 0) return "Rising debt";
  if (trend < 0) return "Falling debt";

  return "Flat or unavailable";
}

export default function EuropeMap() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname);
  const frameRef = useRef(null);

  const [tooltip, setTooltip] = useState(null);

  const countriesByCode = useMemo(() => {
    const map = new Map();

    for (const country of DATA || []) {
      if (country?.code) {
        map.set(country.code.toUpperCase(), country);
      }
    }

    return map;
  }, []);

  function setTooltipForCountry(country, iso2, event, fallbackPosition = false) {
    if (!frameRef.current || !country) return;

    const rect = frameRef.current.getBoundingClientRect();

    let x = rect.width * 0.56;
    let y = rect.height * 0.38;

    if (
      !fallbackPosition &&
      event &&
      typeof event.clientX === "number" &&
      typeof event.clientY === "number"
    ) {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }

    setTooltip({
      iso2,
      name: country.name,
      flag: country.flag,
      debt: country.last_value_eur,
      trend: getCountryTrend(country),
      trendLabel: getTrendLabel(country),
      perSecond: livePerSecondFor(country),
      x,
      y,
    });
  }

  function clearTooltip() {
    setTooltip(null);
  }

  function handleCountryClick(iso2, country) {
    if (!country) return;

    const href = withLocale(`/country/${iso2.toLowerCase()}`, locale);
    router.push(href);
  }

  function handleCountryKeyDown(event, iso2, country) {
    if (!country) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCountryClick(iso2, country);
    }
  }

  return (
    <div className="eu-map-frame" ref={frameRef}>
      <ComposableMap
        className="eu-map-svg"
        projection="geoAzimuthalEqualArea"
        projectionConfig={{ rotate: [-10, -52, 0], scale: 900 }}
        aria-label="Interactive map of EU government debt by country"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies
              .map((geo) => {
                const props = geo.properties || {};
                const rawName =
                  props.name || props.NAME || props.NAME_EN || props.admin || props.ADMIN;

                const iso2 = nameToIso2(rawName);
                if (!iso2) return null;

                const country = countriesByCode.get(iso2);
                const clickable = Boolean(country);
                const trend = getCountryTrend(country);
                const fill = getFill(country);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    className="eu-map-country"
                    tabIndex={clickable ? 0 : -1}
                    role={clickable ? "button" : "img"}
                    aria-label={
                      clickable
                        ? `${country.flag} ${country.name}, ${getTrendLabel(country)}, click to open country debt page`
                        : `${rawName || "Country"}, no debt data available`
                    }
                    stroke={STYLE.stroke}
                    strokeWidth={STYLE.strokeWidth}
                    onClick={() => handleCountryClick(iso2, country)}
                    onKeyDown={(event) => handleCountryKeyDown(event, iso2, country)}
                    onMouseEnter={(event) => setTooltipForCountry(country, iso2, event)}
                    onMouseMove={(event) => setTooltipForCountry(country, iso2, event)}
                    onMouseLeave={clearTooltip}
                    onFocus={(event) => setTooltipForCountry(country, iso2, event, true)}
                    onBlur={clearTooltip}
                    style={{
                      default: {
                        fill,
                        outline: "none",
                        cursor: clickable ? "pointer" : "default",
                        transition:
                          "fill 160ms ease, stroke-width 160ms ease, filter 160ms ease",
                      },
                      hover: {
                        fill: clickable ? STYLE.hoverColor : STYLE.colorNoData,
                        outline: "none",
                        cursor: clickable ? "pointer" : "default",
                        strokeWidth: 1.15,
                        filter: clickable
                          ? "drop-shadow(0 5px 8px rgba(37, 99, 235, 0.25))"
                          : "none",
                      },
                      pressed: {
                        fill: clickable ? "#1d4ed8" : STYLE.colorNoData,
                        outline: "none",
                      },
                    }}
                    data-trend={trend > 0 ? "rising" : trend < 0 ? "falling" : "flat"}
                  />
                );
              })
              .filter(Boolean)
          }
        </Geographies>
      </ComposableMap>

      <div className="eu-map-hint">
        <span className="eu-map-hint-dot" aria-hidden />
        Select a country to open its live debt page
      </div>

      {tooltip && (
        <div
          className="eu-map-tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
          aria-hidden
        >
          <div className="eu-map-tooltip-title">
            <span>{tooltip.flag}</span>
            <strong>{tooltip.name}</strong>
          </div>

          <div className="eu-map-tooltip-row">
            <span>Debt</span>
            <strong>{formatShortEuro(tooltip.debt)}</strong>
          </div>

          <div className="eu-map-tooltip-row">
            <span>Trend</span>
            <strong className={tooltip.trend >= 0 ? "is-rising" : "is-falling"}>
              {tooltip.trendLabel}
            </strong>
          </div>

          <div className="eu-map-tooltip-row">
            <span>Live</span>
            <strong className={tooltip.perSecond >= 0 ? "is-rising" : "is-falling"}>
              {formatPerSecond(tooltip.perSecond)}
            </strong>
          </div>
        </div>
      )}

      <style jsx global>{`
        .eu-map-frame {
          position: relative;
          width: 100%;
          min-height: 420px;
          overflow: hidden;
          border-radius: 16px;
          background:
            radial-gradient(circle at 25% 18%, rgba(255, 255, 255, 0.95), transparent 34%),
            linear-gradient(180deg, #ffffff 0%, #f8fafc 58%, #f1f5f9 100%);
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.85),
            inset 0 -16px 40px rgba(15, 23, 42, 0.03);
        }

        .eu-map-svg {
          position: relative;
          z-index: 2;
          display: block;
          width: 100%;
          height: auto;
          min-height: 420px;
        }

        .eu-map-country {
          vector-effect: non-scaling-stroke;
        }

        .eu-map-country:focus-visible {
          outline: none;
          stroke: #0f172a !important;
          stroke-width: 1.4 !important;
          filter: drop-shadow(0 6px 10px rgba(37, 99, 235, 0.32));
        }

        .eu-map-hint {
          position: absolute;
          left: 14px;
          bottom: 14px;
          z-index: 4;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 34px;
          padding: 0 12px;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(10px);
          color: #1e293b;
          font-size: 0.78rem;
          line-height: 1;
          font-weight: 800;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
        }

        .eu-map-hint-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
        }

        .eu-map-tooltip {
          position: absolute;
          z-index: 10;
          min-width: 210px;
          max-width: 250px;
          transform: translate(14px, -50%);
          padding: 12px;
          border: 1px solid rgba(203, 213, 225, 0.95);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          box-shadow: 0 18px 36px rgba(15, 23, 42, 0.16);
          pointer-events: none;
        }

        .eu-map-tooltip-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 9px;
          color: #0f172a;
          font-size: 0.96rem;
          line-height: 1.2;
        }

        .eu-map-tooltip-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 7px;
          margin-top: 7px;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 0.78rem;
          line-height: 1.2;
        }

        .eu-map-tooltip-row strong {
          color: #0f172a;
          font-size: 0.82rem;
          white-space: nowrap;
        }

        .eu-map-tooltip-row strong.is-rising {
          color: #dc2626;
        }

        .eu-map-tooltip-row strong.is-falling {
          color: #16a34a;
        }

        @media (max-width: 820px) {
          .eu-map-frame {
            min-height: 320px;
          }

          .eu-map-svg {
            min-height: 320px;
          }

          .eu-map-tooltip {
            display: none;
          }

          .eu-map-hint {
            left: 10px;
            right: 10px;
            bottom: 10px;
            justify-content: center;
            white-space: normal;
            line-height: 1.25;
            padding: 8px 12px;
          }
        }

        @media (max-width: 560px) {
          .eu-map-frame {
            min-height: 260px;
          }

          .eu-map-svg {
            min-height: 260px;
          }
        }
      `}</style>
    </div>
  );
}