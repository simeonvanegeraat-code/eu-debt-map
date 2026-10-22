"use client";

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import geographyData from "@/public/maps/countries-110m.json";
import { nameToIso2 } from "@/lib/eu-map-geography";
import { MAP_SCALE_COLORS } from "@/lib/map-colors";
import { localeAwareHref } from "@/lib/navigation";
import { getHomeAtlasCopy } from "./home-atlas-copy";
import styles from "./home-atlas.module.css";

function ratioFill(value) {
  if (!Number.isFinite(value)) return MAP_SCALE_COLORS.missing;
  if (value < 60) return MAP_SCALE_COLORS.low;
  if (value < 90) return MAP_SCALE_COLORS.medium;
  if (value < 120) return MAP_SCALE_COLORS.high;
  return MAP_SCALE_COLORS.highest;
}

export default function AtlasMap({ lang = "en", countries, activeCode, onPreview }) {
  const copy = getHomeAtlasCopy(lang);
  const byCode = new Map(countries.map(country => [country.code, country]));

  function interactions(code) {
    const country = byCode.get(code);
    return {
      href: localeAwareHref(`/country/${code.toLowerCase()}`, lang),
      className: styles.mapLink,
      tabIndex: 0,
      "aria-label": copy.openCountry(country.localizedName),
      "data-country": code,
      onMouseEnter: () => onPreview(code),
      onMouseLeave: () => onPreview(null),
      onFocus: () => onPreview(code),
      onBlur: () => onPreview(null),
    };
  }

  return (
    <ComposableMap
      className={styles.mapSvg}
      projection="geoAzimuthalEqualArea"
      projectionConfig={{ rotate: [-10, -52, 0], scale: 720 }}
      width={800}
      height={600}
      role="group"
      aria-label={copy.mapLabel}
    >
      <Geographies geography={geographyData}>
        {({ geographies }) => geographies.map(geo => {
          const code = nameToIso2(geo.properties.name);
          const country = byCode.get(code);
          if (!country) return null;
          return (
            <a key={geo.rsmKey} {...interactions(code)}>
              <Geography
                geography={geo}
                tabIndex={-1}
                aria-hidden="true"
                className={`${styles.country} ${activeCode === code ? styles.countryActive : ""}`}
                fill={ratioFill(country.official_debt_to_gdp_pct)}
              />
            </a>
          );
        })}
      </Geographies>
      {/* Malta is smaller than the resolution of the shared 110m geography. */}
      <Marker coordinates={[14.3754, 35.9375]}>
        <a {...interactions("MT")}>
          <circle
            aria-hidden="true"
            r={6}
            className={`${styles.country} ${activeCode === "MT" ? styles.countryActive : ""}`}
            fill={ratioFill(byCode.get("MT")?.official_debt_to_gdp_pct)}
          />
        </a>
      </Marker>
    </ComposableMap>
  );
}
