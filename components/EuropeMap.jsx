"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { countries as DATA } from "@/lib/data";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/**
 * Gebruik namen uit Natural Earth → ISO2.
 * Inclusief EU-27 + UK, NO, CH, IS, AL, MK, RS, BA, MD, UA.
 * (Als je straks cijfers toevoegt voor een land, kleurt het automatisch.)
 */
const NAME_TO_ISO2 = {
  "Albania":"AL","Andorra":"AD","Austria":"AT","Belgium":"BE","Bosnia and Herz.":"BA","Bulgaria":"BG",
  "Croatia":"HR","Cyprus":"CY","Czechia":"CZ","Denmark":"DK","Estonia":"EE","Finland":"FI","France":"FR",
  "Germany":"DE","Greece":"GR","Hungary":"HU","Iceland":"IS","Ireland":"IE","Italy":"IT","Kosovo":"XK",
  "Latvia":"LV","Liechtenstein":"LI","Lithuania":"LT","Luxembourg":"LU","Malta":"MT","Moldova":"MD",
  "Monaco":"MC","Montenegro":"ME","Netherlands":"NL","North Macedonia":"MK","Norway":"NO","Poland":"PL",
  "Portugal":"PT","Romania":"RO","San Marino":"SM","Serbia":"RS","Slovakia":"SK","Slovenia":"SI",
  "Spain":"ES","Sweden":"SE","Switzerland":"CH","Ukraine":"UA","United Kingdom":"GB"
};

export default function EuropeMap() {
  const fillFor = (iso2) => {
    const c = DATA.find(x => x.code.toUpperCase() === iso2);
    if (!c) return "rgba(255,255,255,0.08)";
    const delta = c.last_value_eur - c.prev_value_eur;
    if (Math.abs(delta) < 1) return "#9ca3af";
    return delta >= 0 ? "#ef4444" : "#22c55e";
  };

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <ComposableMap projection="geoAzimuthalEqualArea" projectionConfig={{ rotate: [-10, -52, 0], scale: 900 }}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies
              .filter((g) => {
                // Laat alleen Europese landen zien o.b.v. naam-mapping
                const name = g.properties?.name;
                return !!NAME_TO_ISO2[name];
              })
              .map((geo) => {
                const name = geo.properties.name;
                const iso2 = NAME_TO_ISO2[name];
                const hasData = !!DATA.find(c => c.code.toUpperCase() === iso2);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: fillFor(iso2), outline: "none" },
                      hover: { fill: hasData ? "#60a5fa" : "#9ca3af", outline: "none" },
                      pressed: { outline: "none" }
                    }}
                    onClick={() => {
                      if (hasData) window.location.href = `/country/${iso2.toLowerCase()}`;
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
