"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { countries as data } from "@/lib/data";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const NAME_TO_ISO2 = {
  "Austria":"AT","Belgium":"BE","Bulgaria":"BG","Croatia":"HR","Cyprus":"CY",
  "Czechia":"CZ","Czech Republic":"CZ","Denmark":"DK","Estonia":"EE","Finland":"FI",
  "France":"FR","Germany":"DE","Greece":"GR","Hungary":"HU","Ireland":"IE","Italy":"IT",
  "Latvia":"LV","Lithuania":"LT","Luxembourg":"LU","Malta":"MT","Netherlands":"NL",
  "Poland":"PL","Portugal":"PT","Romania":"RO","Slovakia":"SK","Slovenia":"SI",
  "Spain":"ES","Sweden":"SE"
};

export default function EuropeMap(){
  const fillFor = (code2)=>{
    const c = data.find(x=> x.code.toUpperCase() === code2);
    if(!c) return "rgba(255,255,255,0.06)";
    const d = c.last_value_eur - c.prev_value_eur;
    if (Math.abs(d) < 1) return "#9ca3af";
    return d >= 0 ? "#ef4444" : "#22c55e";
  };
  return (
    <ComposableMap projection="geoAzimuthalEqualArea" projectionConfig={{ rotate: [-10,-52,0], scale: 900 }}>
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies
            .filter((g)=>{
              const [x0,y0,x1,y1] = g.bbox;
              return x1>-30 && x0<60 && y1>30 && y0<75;
            })
            .map((geo) => {
              const name = geo.properties.name;
              const code2 = NAME_TO_ISO2[name];
              return (
                <Geography key={geo.rsmKey} geography={geo}
                  style={{
                    default:{ fill: code2 ? fillFor(code2) : "rgba(255,255,255,0.06)", outline:"none" },
                    hover:{ fill:"#60a5fa", outline:"none" },
                    pressed:{ outline:"none" }
                  }}
                  onClick={()=>{
                    if(code2 && data.some(c=> c.code.toUpperCase()===code2)){
                      window.location.href = `/country/${code2.toLowerCase()}`;
                    }
                  }}
                />
              );
            })
        }
      </Geographies>
    </ComposableMap>
  );
}
