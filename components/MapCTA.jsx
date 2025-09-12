// components/MapCTA.jsx
import Link from "next/link";
import { countries } from "@/lib/data";

export default function MapCTA({ code, name }) {
  // Bepaal prev/next alfabetisch
  const base = Array.isArray(countries) ? [...countries] : [];
  base.sort((a, b) => a.name.localeCompare(b.name));
  const idx = base.findIndex(
    (c) => String(c.code).toLowerCase() === String(code).toLowerCase()
  );
  const prev = idx >= 0 ? base[(idx - 1 + base.length) % base.length] : null;
  const next = idx >= 0 ? base[(idx + 1) % base.length] : null;

  return (
    <div className="card" style={{ padding: 12 }}>
      <h3 className="text-base font-semibold mb-2">Explore the map</h3>
      <p className="text-sm text-slate-300">
        View all EU countries and quickly switch to another one. Current:{" "}
        <strong>{name}</strong>.
      </p>

      {/* CTA + pager netjes onder elkaar */}
      <div className="flex flex-col gap-3 mt-3">
        <div>
          <Link className="btn" href="/#map" aria-label="Open interactive map">
            Open interactive map
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {prev && (
            <Link
              className="btn"
              href={`/country/${String(prev.code).toLowerCase()}`}
              prefetch
              aria-label={`Go to ${prev.name}`}
              title={prev.name}
            >
              ← {prev.name}
            </Link>
          )}
          {next && (
            <Link
              className="btn"
              href={`/country/${String(next.code).toLowerCase()}`}
              prefetch
              aria-label={`Go to ${next.name}`}
              title={next.name}
            >
              {next.name} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
