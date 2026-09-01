"use client";

import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import geographyData from "@/public/maps/countries-110m.json";
import { countries, trendFor } from "@/lib/data";
import { countryName } from "@/lib/countries";
import { getHomePreviewCopy } from "./home-preview-copy";
import styles from "./home-preview.module.css";

const NAME_TO_ISO2 = {
  Austria: "AT",
  Belgium: "BE",
  Bulgaria: "BG",
  Croatia: "HR",
  Cyprus: "CY",
  Czechia: "CZ",
  "Czech Republic": "CZ",
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

function nameToIso2(rawName) {
  if (!rawName) return null;
  if (NAME_TO_ISO2[rawName]) return NAME_TO_ISO2[rawName];

  const name = String(rawName).replace(/\s*\(.*?\)\s*/g, "").trim().toLowerCase();
  if (name === "n. cyprus" || name.includes("northern cyprus")) return null;
  const aliases = [
    ["netherland", "NL"], ["german", "DE"], ["hellenic", "GR"],
    ["greece", "GR"], ["czech", "CZ"], ["ireland", "IE"],
    ["cyprus", "CY"], ["slovak", "SK"], ["sloven", "SI"],
    ["croat", "HR"], ["portugal", "PT"], ["spain", "ES"],
    ["swed", "SE"], ["france", "FR"], ["ital", "IT"],
    ["romania", "RO"], ["poland", "PL"], ["bulgar", "BG"],
    ["estonia", "EE"], ["latvia", "LV"], ["lithuan", "LT"],
    ["luxem", "LU"], ["malta", "MT"], ["austria", "AT"],
    ["belg", "BE"], ["denmark", "DK"], ["finland", "FI"],
    ["hungary", "HU"],
  ];

  return aliases.find(([fragment]) => name.includes(fragment))?.[1] || null;
}

function ratioFill(value) {
  if (!Number.isFinite(value)) return "#d8dee8";
  if (value < 60) return "#c7daf8";
  if (value < 90) return "#85b1f3";
  if (value < 120) return "#3478dc";
  return "#123b80";
}

function trendFill(value) {
  if (!Number.isFinite(value)) return "#d8dee8";
  if (value < -5_000_000_000) return "#27b88a";
  if (value < 0) return "#8adfc4";
  if (value < 5_000_000_000) return "#d7dee9";
  if (value < 30_000_000_000) return "#f3a3a7";
  return "#d9545c";
}

function totalFill(value, maxValue) {
  if (!Number.isFinite(value) || value <= 0 || maxValue <= 0) return "#d8dee8";
  const normalized = Math.log10(value) / Math.log10(maxValue);
  if (normalized < 0.78) return "#d7e4f8";
  if (normalized < 0.9) return "#90b7ee";
  if (normalized < 0.97) return "#4b83d6";
  return "#173f7f";
}

function metricText(country, mode, locale) {
  if (mode === "ratio") {
    const ratio = Number(country?.official_debt_to_gdp_pct);
    return Number.isFinite(ratio)
      ? `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(ratio)}%`
      : "—";
  }

  const value = mode === "trend" ? trendFor(country) : Number(country?.last_value_eur);
  if (!Number.isFinite(value)) return "—";
  const sign = mode === "trend" && value > 0 ? "+" : "";
  return `${sign}${new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)}`;
}

export default function HomeMapPreview({ lang, mode, activeCode, onPreview }) {
  const copy = getHomePreviewCopy(lang);
  const [showTapCue, setShowTapCue] = useState(true);
  const countriesByCode = useMemo(
    () => new Map(countries.map((country) => [country.code, country])),
    []
  );
  const maxDebt = useMemo(
    () => Math.max(...countries.map((country) => Number(country.last_value_eur) || 0), 1),
    []
  );

  function previewCountry(iso2) {
    if (iso2) setShowTapCue(false);
    onPreview(iso2);
  }

  return (
    <div className={styles.mapFrame} onPointerDown={() => setShowTapCue(false)}>
      <span className={styles.mapWatermark} aria-hidden="true">EU-27</span>
      {showTapCue && (
        <span className={styles.mapTapCue} aria-hidden="true">
          <span className={styles.mapTapPulse} />
          <svg
            className={styles.mapTapHand}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="rotate(-135 32 32)">
              <path d="M22 32V14a5 5 0 0 1 10 0v16" />
              <path d="M32 27v-6a5 5 0 0 1 10 0v11" />
              <path d="M42 29v-3a5 5 0 0 1 10 0v12c0 11.05-8.95 20-20 20h-5.5c-7.15 0-12.23-3.16-16.1-9.05L4.8 40.4a5 5 0 0 1 8.16-5.77L22 45" />
            </g>
          </svg>
        </span>
      )}
      <ComposableMap
        className={styles.mapSvg}
        projection="geoAzimuthalEqualArea"
        projectionConfig={{ rotate: [-10, -52, 0], scale: 900 }}
        width={800}
        height={520}
        role="group"
        aria-label={copy.mapAria}
      >
        <Geographies geography={geographyData}>
          {({ geographies }) =>
            geographies
              .map((geo) => {
                const properties = geo.properties || {};
                const rawName =
                  properties.name || properties.NAME || properties.NAME_EN || properties.admin;
                const iso2 = nameToIso2(rawName);
                if (!iso2) return null;

                const country = countriesByCode.get(iso2);
                if (!country) return null;

                const value =
                  mode === "ratio"
                    ? Number(country.official_debt_to_gdp_pct)
                    : mode === "trend"
                      ? trendFor(country)
                      : Number(country.last_value_eur);
                const fill =
                  mode === "ratio"
                    ? ratioFill(value)
                    : mode === "trend"
                      ? trendFill(value)
                      : totalFill(value, maxDebt);
                const isActive = activeCode === iso2;
                const localizedName = countryName(iso2, lang);
                const metric = metricText(country, mode, copy.locale);
                const countryHref = `${copy.base}/country/${iso2.toLowerCase()}`;

                return (
                  <a
                    key={geo.rsmKey}
                    href={countryHref}
                    aria-label={copy.countryAria(localizedName, metric)}
                    onFocus={() => previewCountry(iso2)}
                    onBlur={() => onPreview(null)}
                  >
                    <title>{copy.countryLinkText(localizedName)}</title>
                    <Geography
                      geography={geo}
                      className={styles.mapCountry}
                      data-country={iso2}
                      onMouseEnter={() => previewCountry(iso2)}
                      onMouseLeave={() => onPreview(null)}
                      stroke={isActive ? "#5ce5bf" : "#ffffff"}
                      strokeWidth={isActive ? 2.2 : 0.8}
                      style={{
                        default: {
                          fill,
                          outline: "none",
                          cursor: "pointer",
                          filter: isActive
                            ? "drop-shadow(0 7px 12px rgba(8, 31, 65, 0.3))"
                            : "none",
                          transition: "fill 150ms ease, stroke 150ms ease, filter 150ms ease",
                        },
                        hover: {
                          fill,
                          outline: "none",
                          cursor: "pointer",
                          stroke: "#071b39",
                          strokeWidth: 1.8,
                          filter: "drop-shadow(0 7px 12px rgba(8, 31, 65, 0.22))",
                        },
                        pressed: {
                          fill: "#5ce5bf",
                          outline: "none",
                          stroke: "#071b39",
                          strokeWidth: 1.8,
                        },
                      }}
                    />
                  </a>
                );
              })
              .filter(Boolean)
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
