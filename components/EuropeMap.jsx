"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { countries as DATA } from "@/lib/data";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// EU-27 names (Natural Earth names → ISO2)
const NAME_TO_ISO2 = {
  "Austria":"AT","Belgium":"BE","Bulgaria":"BG","Croatia":"HR","Cyprus":"CY",
  "Czechia":"CZ","Denmark":"DK","Estonia":"EE","Finland":"FI","France":"FR",
  "Germany":"DE","Greece":"GR","Hungary":"HU","Ireland":"IE","Italy":"IT",
  "Latvia":"LV","Lithuania":"LT","Luxembourg":"LU","Malta":"MT","Netherlands":"NL",
  "Poland":"PL","Portugal":"PT","Romania":"RO","Slovakia":"SK","Slovenia":"SI",
  "Spain":"ES","Sweden":"SE"
};

export default function EuropeMap(){
  const fillFor = (iso2)=>{
    const c = DATA.find(x=> x.code.toUpperCase() === iso2);
    if(!c) return "rgba(255,255,255,0.08)"; // should not happen if DATA has all EU countries
    const d = c.last_value_eur - c.prev_value_eur;
    if (Math.abs(d) < 1) return "#9ca3af";
    return d >= 0 ? "#ef4444" : "#22c55e";
  };

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <ComposableMap projection="geoAzimuthalEqualArea" projectionConfig={{ rotate: [-10, -52, 0], scale: 900 }}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies
              .filter(g => !!NAME_TO_ISO2[g.properties?.name]) // show EU only
              .map((geo) => {
                const name = geo.properties.name;
                const iso2 = NAME_TO_ISO2[name];
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: fillFor(iso2), outline: "none" },
                      hover:   { fill: "#60a5fa", outline: "none" },
                      pressed: { outline: "none" }
                    }}
                    onClick={() => { window.location.href = `/country/${iso2.toLowerCase()}`; }}
                  />
                );
              })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
