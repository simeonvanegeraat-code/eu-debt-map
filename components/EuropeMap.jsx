"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { countries as DATA } from "@/lib/data";

const GEO_URL = "/maps/countries-110m.json";

// Canonieke namen → ISO2
const NAME_TO_ISO2 = {
  Austria: "AT", Belgium: "BE", Bulgaria: "BG", Croatia: "HR", Cyprus: "CY",
  Czechia: "CZ", Denmark: "DK", Estonia: "EE", Finland: "FI", France: "FR",
  Germany: "DE", Greece: "GR", Hungary: "HU", Ireland: "IE", Italy: "IT",
  Latvia: "LV", Lithuania: "LT", Luxembourg: "LU", Malta: "MT", Netherlands: "NL",
  Poland: "PL", Portugal: "PT", Romania: "RO", Slovakia: "SK", Slovenia: "SI",
  Spain: "ES", Sweden: "SE"
};

// Aliasnamen die soms in (Topo)JSON staan → ISO2
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
  // Exacte match eerst
  if (NAME_TO_ISO2[rawName]) return NAME_TO_ISO2[rawName];
  if (ALT_NAME_TO_ISO2[rawName]) return ALT_NAME_TO_ISO2[rawName];

  // Soms staan er toevoegingen, probeer te normaliseren
  const n = String(rawName).replace(/\s*\(.*?\)\s*/g, "").trim(); // verwijder (…)
  if (NAME_TO_ISO2[n]) return NAME_TO_ISO2[n];
  if (ALT_NAME_TO_ISO2[n]) return ALT_NAME_TO_ISO2[n];

  // Als laatste: bepaalde bekende varianten
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
  if (lower.includes("netherlands")) return "NL";

  return null;
}

function fallbackTrend(iso2) {
  const s = iso2.charCodeAt(0) + iso2.charCodeAt(1);
  return s % 2 === 0 ? -1 : 1;
}

export default function EuropeMap() {
  const hasData = (iso2) => DATA.some((c) => c.code.toUpperCase() === iso2);

  const fillFor = (iso2) => {
    const c = DATA.find((x) => x.code.toUpperCase() === iso2);
    if (!c) return fallbackTrend(iso2) > 0 ? "#ef4444" : "#22c55e";
    const d = c.last_value_eur - c.prev_value_eur;
    const trend = Math.abs(d) < 1 ? fallbackTrend(iso2) : d;
    return trend >= 0 ? "#ef4444" : "#22c55e";
  };

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <ComposableMap projection="geoAzimuthalEqualArea" projectionConfig={{ rotate: [-10, -52, 0], scale: 900 }}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) => {
            // DEV-only logging: laat zien welke EU-namen niet matchen
            if (process.env.NODE_ENV !== "production") {
              const seen = new Set();
              const misses = [];
              geographies.forEach((g) => {
                const props = g.properties || {};
                const rawName = props.name || props.NAME || props.NAME_EN || props.admin || props.ADMIN;
                const iso = nameToIso2(rawName);
                if (iso && !seen.has(iso)) seen.add(iso);
                if (!iso && rawName) {
                  // log alleen kandidaten die op EU kunnen lijken
                  const lower = String(rawName).toLowerCase();
                  const maybeEU = ["czech", "nether", "germ", "fran", "ital", "spain", "portu", "roman", "slov", "slove", "croa", "gree", "irl", "irel", "austr", "belg", "bulg", "est", "latv", "lithu", "lux", "malt", "pol", "den", "swed", "fin"].some(k => lower.includes(k));
                  if (maybeEU) misses.push(rawName);
                }
              });
              if (misses.length) {
                // Eén keer loggen is genoeg
                // eslint-disable-next-line no-console
                console.warn("Unmatched potential EU names from TopoJSON:", Array.from(new Set(misses)).slice(0, 12));
              }
            }

            return geographies
              .map((geo) => {
                const props = geo.properties || {};
                const rawName = props.name || props.NAME || props.NAME_EN || props.admin || props.ADMIN;
                const iso2 = nameToIso2(rawName);
                if (!iso2) return null;

                const clickable = hasData(iso2);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: fillFor(iso2), outline: "none" },
                      hover: { fill: clickable ? "#60a5fa" : "#9ca3af", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                    onClick={() => {
                      if (clickable) window.location.href = `/country/${iso2.toLowerCase()}`;
                    }}
                  />
                );
              })
              .filter(Boolean);
          }}
        </Geographies>
      </ComposableMap>
    </div>
  );
}
