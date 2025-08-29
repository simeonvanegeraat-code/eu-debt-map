"use client";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { countries as data } from "@/lib/data";
import { useRouter } from "next/navigation";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const NAME_TO_CODE: Record<string,string> = {
  "Austria":"AT","Belgium":"BE","Bulgaria":"BG","Croatia":"HR","Cyprus":"CY",
  "Czechia":"CZ","Denmark":"DK","Estonia":"EE","Finland":"FI","France":"FR",
  "Germany":"DE","Greece":"GR","Hungary":"HU","Ireland":"IE","Italy":"IT",
  "Latvia":"LV","Lithuania":"LT","Luxembourg":"LU","Malta":"MT","Netherlands":"NL",
  "Poland":"PL","Portugal":"PT","Romania":"RO","Slovakia":"SK","Slovenia":"SI",
  "Spain":"ES","Sweden":"SE",
  "Czech Republic":"CZ"
};

export default function EuropeMap(){
  const router = useRouter();
  const fillFor = (code2:string)=>{
    const c = data[code2];
    if(!c) return "#2a2f45";
    const delta = c.last_value_eur - c.prev_value_eur;
    if (Math.abs(delta) < Math.max(1e-6, c.last_value_eur * 1e-6)) return "#40506c";
    return delta >= 0 ? "#a24b4b" : "#2f8e5a";
  };
  return (
    <div className="mapWrap card">
      <ComposableMap projection="geoAzimuthalEqualArea" projectionConfig={{ rotate: [-10, -52, 0], scale: 900 }} style={{width:"100%", height:"100%"}}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) => geographies
            .filter((geo) => {
              const name = (geo.properties as any).name as string;
              const code2 = NAME_TO_CODE[name];
              return !!code2;
            })
            .map((geo) => {
              const name = (geo.properties as any).name as string;
              const code2 = NAME_TO_CODE[name];
              return (
                <Geography key={geo.rsmKey} geography={geo}
                  onClick={()=> router.push(`/country/${code2}`)}
                  style={{
                    default: { fill: fillFor(code2), stroke: "#1b2235", strokeWidth: .8, outline: "none" },
                    hover:   { fill: "#6f86ff", stroke: "#0b0e14", strokeWidth: 1.2, outline: "none" },
                    pressed: { fill: "#6f86ff", stroke: "#0b0e14", strokeWidth: 1.2, outline: "none" }
                  }}
                />
              );
            })}
        </Geographies>
      </ComposableMap>
      <div className="small" style={{marginTop:8}}>
        <span className="badge good">Green: debt decreasing</span>{" "}
        <span className="badge bad">Red: debt increasing</span>
      </div>
    </div>
  );
}
