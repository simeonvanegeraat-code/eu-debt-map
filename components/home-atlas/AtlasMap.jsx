"use client";

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import geographyData from "@/public/maps/countries-110m.json";
import { nameToIso2 } from "@/lib/eu-map-geography";
import { MAP_SCALE_COLORS } from "@/lib/map-colors";
import { getHomeAtlasCopy } from "./home-atlas-copy";
import styles from "./home-atlas.module.css";

function ratioFill(value) {
  if (!Number.isFinite(value)) return MAP_SCALE_COLORS.missing;
  if (value < 60) return MAP_SCALE_COLORS.low;
  if (value < 90) return MAP_SCALE_COLORS.medium;
  if (value < 120) return MAP_SCALE_COLORS.high;
  return MAP_SCALE_COLORS.highest;
}

export default function AtlasMap({ lang = "en", countries, activeCode, selectedCode, onSelect, onPreview }) {
  const copy = getHomeAtlasCopy(lang);
  const byCode = new Map(countries.map(country => [country.code, country]));

  function interactions(code) {
    const country = byCode.get(code);
    return {
      role: "button",
      tabIndex: 0,
      "aria-label": copy.selectLabel(country.localizedName),
      "aria-pressed": selectedCode === code,
      "data-country": code,
      onMouseEnter: () => onPreview(code),
      onMouseLeave: () => onPreview(null),
      onFocus: () => onPreview(code),
      onBlur: () => onPreview(null),
      onClick: () => onSelect(code),
      onKeyDown: event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(code);
        }
      },
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
            <Geography
              key={geo.rsmKey}
              geography={geo}
              {...interactions(code)}
              className={`${styles.country} ${activeCode === code ? styles.countryActive : ""}`}
              fill={ratioFill(country.official_debt_to_gdp_pct)}
            />
          );
        })}
      </Geographies>
      {/* Malta is smaller than the resolution of the shared 110m geography. */}
      <Marker coordinates={[14.3754, 35.9375]}>
        <circle
          {...interactions("MT")}
          r={6}
          className={`${styles.country} ${activeCode === "MT" ? styles.countryActive : ""}`}
          fill={ratioFill(byCode.get("MT")?.official_debt_to_gdp_pct)}
        />
      </Marker>
    </ComposableMap>
  );
}
