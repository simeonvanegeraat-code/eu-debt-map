// components/MapCTA.jsx
import Link from "next/link";

export default function MapCTA({ code, name }) {
  const lower = String(code || "").toLowerCase();
  return (
    <div className="card" style={{ padding: 12 }}>
      <h3 className="text-base font-semibold mb-2">Explore the map</h3>
      <p className="text-sm text-slate-300">
        View all EU countries and pick another one to compare with <strong>{name}</strong>.
      </p>
      <div className="flex gap-2 mt-3">
        <Link className="btn" href="/#map">Open interactive map</Link>
        <Link className="btn" href={`/country/${lower}`} prefetch>
          Back to {name}
        </Link>
      </div>
    </div>
  );
}
