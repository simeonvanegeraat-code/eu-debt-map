// components/CountrySwitcher.jsx
"use client";

import { useRouter } from "next/navigation";
import { countries } from "@/lib/data";

export default function CountrySwitcher({ currentCode }) {
  const router = useRouter();

  // alfabetisch
  const list = Array.isArray(countries)
    ? [...countries].sort((a, b) => a.name.localeCompare(b.name))
    : [];

  // gedeelde knop-stijl + expliciete margins (robust tegen globale CSS)
  const btnStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 12,
    paddingInline: 14,
    whiteSpace: "nowrap",
    marginRight: 12,   // spacing rechts
    marginBottom: 12,  // spacing onder
  };

  return (
    <div className="card" style={{ padding: 12 }}>
      <div className="mono text-slate-400 text-xs" style={{ marginBottom: 8 }}>
        Change country
      </div>

      {/* Wrap-grid via flex; spacing komt van per-button margins */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {list.map((c) => {
          const active =
            String(c.code).toLowerCase() === String(currentCode).toLowerCase();
          return (
            <button
              key={c.code}
              onClick={() =>
                router.push(`/country/${String(c.code).toLowerCase()}`)
              }
              className={`btn ${active ? "btn--active" : ""}`}
              aria-label={`Go to ${c.name}`}
              title={c.name}
              style={btnStyle}
            >
              <span style={{ fontSize: 18, marginRight: 8 }}>{c.flag}</span>
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
