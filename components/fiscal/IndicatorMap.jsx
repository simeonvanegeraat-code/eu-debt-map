"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import geographyData from "@/public/maps/countries-110m.json";
import { nameToIso2 } from "@/lib/eu-map-geography";
import styles from "./fiscal.module.css";

// Indicator-independent geography: values, labels and colors arrive as compact rows.
export default function IndicatorMap({ rows, selectedCode, onSelect, label }) {
  const byCode = new Map(rows.map((row) => [row.code, row]));
  return (
    <ComposableMap projection="geoAzimuthalEqualArea" projectionConfig={{ rotate: [-10, -52, 0], scale: 720 }}
      width={800} height={520} role="group" aria-label={label} className={styles.mapSvg}>
      <Geographies geography={geographyData}>
        {({ geographies }) => geographies.map((geo) => {
          const properties = geo.properties || {};
          const code = nameToIso2(properties.name || properties.NAME || properties.NAME_EN || properties.admin);
          const row = byCode.get(code);
          if (!row) return null;
          const selected = code === selectedCode;
          return <Geography key={geo.rsmKey} geography={geo} tabIndex={0} role="button"
            aria-label={row.label} aria-pressed={selected} data-country={code}
            className={styles.mapCountry} fill={row.color} stroke={selected ? "#071b39" : "#ffffff"}
            strokeWidth={selected ? 2.2 : 0.8} onClick={() => onSelect(code)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(code); }
            }}><title>{row.label}</title></Geography>;
        })}
      </Geographies>
    </ComposableMap>
  );
}
