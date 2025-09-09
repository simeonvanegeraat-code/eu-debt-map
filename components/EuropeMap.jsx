"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { countries as DATA } from "@/lib/data";

const GEO_URL = "/maps/countries-110m.json";

const NAME_TO_ISO2 = {
  "Austria":"AT","Belgium":"BE","Bulgaria":"BG","Croatia":"HR","Cyprus":"CY",
  "Czechia":"CZ","Denmark":"DK","Estonia":"EE","Finland":"FI","France":"FR",
  "Germany":"DE","Greece":"GR","Hungary":"HU","Ireland":"IE","Italy":"IT",
  "Latvia":"LV","Lithuania":"LT","Luxembourg":"LU","Malta":"MT","Netherlands":"NL",
  "Poland":"PL","Portugal":"PT","Romania":"RO","Slovakia":"SK","Slovenia":"SI",
  "Spain":"ES","Sweden":"SE"
};

function fallbackTrend(iso2) {
  const s = iso2.charCodeAt(0) + iso2.charCodeAt(1);
  return s % 2 === 0 ? -1 : 1;
}

export default function EuropeMap() {
  const hasData = (iso2) => DATA.some(c => c.code.toUpperCase() === iso2);

  const fillFor = (iso2) => {
    const c = DATA.find(x => x.code.toUpperCase() === iso2);
    if (!c) return fallbackTrend(iso2) > 0 ? "#ef4444" : "#22c55e";
    const d = c.last_value_eur - c.prev_value_eur;
    const trend = Math.abs(d) < 1 ? fallbackTrend(iso2) : d;
    return trend >= 0 ? "#ef4444" : "#22c55e";
  };

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{ rotate: [-10, -52, 0], scale: 900 }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies
              .filter(g => !!NAME_TO_ISO2[g.properties?.name])
              .map((geo) => {
                const name = geo.properties.name;
                const iso2 = NAME_TO_ISO2[name];
                const clickable = hasData(iso2);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: fillFor(iso2), outline: "none" },
                      hover:   { fill: clickable ? "#60a5fa" : "#9ca3af", outline: "none" },
                      pressed: { outline: "none" }
                    }}
                    onClick={() => {
                      if (clickable) window.location.href = `/country/${iso2.toLowerCase()}`;
                    }}
                  />
                );
              })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
