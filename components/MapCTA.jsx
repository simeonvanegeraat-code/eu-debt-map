// components/MapCTA.jsx
import Link from "next/link";

export default function MapCTA({ code, name }) {
  return (
    <div className="card" style={{ padding: 12 }}>
      <h3 className="text-base font-semibold mb-2">Explore the map</h3>
      <p className="text-sm text-slate-300">
        View all EU countries and quickly switch to another one. Current: <strong>{name}</strong>.
      </p>
      <div className="flex gap-2 mt-3">
        <Link className="btn" href="/#map">Open interactive map</Link>
      </div>
    </div>
  );
}
