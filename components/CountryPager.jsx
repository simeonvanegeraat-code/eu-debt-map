// components/CountryPager.jsx
import Link from "next/link";
import { countries } from "@/lib/data";

export default function CountryPager({ code }) {
  const base = Array.isArray(countries) ? [...countries] : [];
  if (!base.length) return null;

  // alfabetisch; stabiel ongeacht originele volgorde
  base.sort((a, b) => a.name.localeCompare(b.name));
  const idx = base.findIndex(c => String(c.code).toLowerCase() === String(code).toLowerCase());
  if (idx === -1) return null;

  const prev = base[(idx - 1 + base.length) % base.length];
  const next = base[(idx + 1) % base.length];

  return (
    <div className="flex justify-between items-center mt-6">
      <Link className="btn" href={`/country/${String(prev.code).toLowerCase()}`} prefetch>
        ← {prev.name}
      </Link>
      <Link className="btn" href={`/country/${String(next.code).toLowerCase()}`} prefetch>
        {next.name} →
      </Link>
    </div>
  );
}
