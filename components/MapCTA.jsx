// components/MapCTA.jsx
import Link from "next/link";
import { countries } from "@/lib/data";

export default function MapCTA({ code, name, lang = "en" }) {
  // taal-root: '' (en), '/nl', '/de', '/fr'
  const base = lang && lang !== "en" ? `/${lang}` : "";

  // prev/next alfabetisch
  const baseList = Array.isArray(countries) ? [...countries] : [];
  baseList.sort((a, b) => a.name.localeCompare(b.name));

  const want = String(code || "").toLowerCase();
  const idx = baseList.findIndex(
    (c) => String(c.code).toLowerCase() === want
  );

  const prev = idx >= 0 ? baseList[(idx - 1 + baseList.length) % baseList.length] : null;
  const next = idx >= 0 ? baseList[(idx + 1) % baseList.length] : null;

  // gedeelde knop-stijl + expliciete margins (robust)
  const btnStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 12,
    paddingInline: 14,
    whiteSpace: "nowrap",
    marginRight: 12,
    marginBottom: 12,
  };

  return (
    <div className="card" style={{ padding: 12 }}>
      <h3 className="text-base font-semibold mb-2">Explore the map</h3>
      <p className="text-sm text-slate-300">
        View all EU countries and quickly switch to another one. Current:{" "}
        <strong>{name}</strong>.
      </p>

      <div style={{ marginTop: 12 }}>
        <div>
          <Link
            className="btn"
            href={`${base}/#map`}
            aria-label="Open interactive map"
            style={btnStyle}
            title="Open interactive map"
          >
            Open interactive map
          </Link>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
          {prev && (
            <Link
              className="btn"
              href={`${base}/country/${String(prev.code).toLowerCase()}`}
              prefetch
              aria-label={`Go to ${prev.name}`}
              title={prev.name}
              style={btnStyle}
            >
              ← {prev.name}
            </Link>
          )}
          {next && (
            <Link
              className="btn"
              href={`${base}/country/${String(next.code).toLowerCase()}`}
              prefetch
              aria-label={`Go to ${next.name}`}
              title={next.name}
              style={btnStyle}
            >
              {next.name} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
