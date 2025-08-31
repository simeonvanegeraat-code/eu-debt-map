'use client';
import Link from 'next/link';
import { EU27 } from '@/data/eu27';

export default function EuropeGrid() {
  return (
    <div className="grid">
      {EU27.map(c => {
        const rising = c.endDebtCents > c.startDebtCents;
        return (
          <Link key={c.code} href={`/country/${c.code}`} className="country">
            <div className="small">{c.code}</div>
            <div style={{fontWeight:700}}>{c.name}</div>
            <div className={"badge " + (rising ? "red" : "green")}>{rising ? "Rising" : "Falling"}</div>
          </Link>
        );
      })}
      <div className="ad">Ad space (AdSense)</div>
    </div>
  );
}
