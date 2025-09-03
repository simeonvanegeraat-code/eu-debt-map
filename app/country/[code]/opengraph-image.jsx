// app/country/[code]/opengraph-image.jsx
import { ImageResponse } from "next/og";
import { countries } from "@/lib/data";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function findCountry(code) {
  const want = String(code).toLowerCase();
  return countries.find((x) => x.code.toLowerCase() === want) || null;
}

export default async function OgImage({ params }) {
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
          justifyContent: "space-between",
          padding: 48,
          background:
            "linear-gradient(135deg, #0b1220 0%, #12203a 50%, #0b1220 100%)",
          color: "#e7ecf3",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
        }}
      >
        {/* Header: branding */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              display: "grid",
              placeItems: "center",
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "linear-gradient(135deg,#1d4ed8,#60a5fa)",
              fontWeight: 800,
              color: "white",
              letterSpacing: 0.5,
            }}
          >
            EU
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, opacity: 0.9 }}>
            EU Debt Map
          </div>
        </div>

        {/* Center: country + value */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ fontSize: 72 }}>{c.flag || "🇪🇺"}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 48, fontWeight: 800 }}>{c.name}</div>
            <div
              style={{
                marginTop: 8,
                fontSize: 56,
                fontWeight: 900,
                letterSpacing: -0.5,
              }}
            >
              {amount}
            </div>
          </div>
        </div>

        {/* Footer: note + dates */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            opacity: 0.9,
          }}
        >
          <div>
            Live ticking estimate based on Eurostat last two quarters.
          </div>
          <div style={{ textAlign: "right" }}>
            {c.prev_date} → {c.last_date}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
