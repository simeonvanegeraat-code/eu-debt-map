// app/country/[code]/twitter-image.jsx
import { ImageResponse } from "next/og";
import { countries } from "@/lib/data";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function findCountry(code) {
  const want = String(code).toLowerCase();
  return countries.find((x) => x.code.toLowerCase() === want) || null;
}

export default async function TwitterImage({ params }) {
  const c = findCountry(params.code) ?? {
    code: params.code?.toUpperCase?.() ?? "??",
    name: "Unknown country",
    flag: "🌍",
    last_value_eur: 0,
    prev_date: "",
    last_date: "",
  };

  const nf0 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
  const amount = `€${nf0.format(Math.round(c.last_value_eur || 0))}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
          padding: 64,
          background:
            "linear-gradient(135deg, #0b1220 0%, #12203a 50%, #0b1220 100%)",
          color: "#e7ecf3",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ fontSize: 80 }}>{c.flag || "🇪🇺"}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 52, fontWeight: 900 }}>{c.name}</div>
            <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: -0.5 }}>
              {amount}
            </div>
          </div>
        </div>

        <div style={{ fontSize: 26, opacity: 0.9 }}>
          Eurostat last two quarters: {c.prev_date} → {c.last_date}
        </div>

        <div
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 24,
            opacity: 0.9,
          }}
        >
          <div
            style={{
              display: "grid",
              placeItems: "center",
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "linear-gradient(135deg,#1d4ed8,#60a5fa)",
              color: "white",
              fontWeight: 800,
            }}
          >
            EU
          </div>
          <div>EU Debt Map</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
