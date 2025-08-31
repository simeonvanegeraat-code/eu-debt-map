'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { EU27 } from '@/data/eu27';

const EuropeMap = dynamic(() => import('@/components/EuropeMap'), { ssr: false });

export default function Home() {
  const countries = EU27.map(c => ({
    code: c.code,
    name: c.name,
    rising: c.endDebtCents > c.startDebtCents,
    hasData: !!(c.startDebtCents && c.endDebtCents && c.t0 && c.t1)
  }));

  return (
    <div className="space-y-3">
      <EuropeMap countries={countries} />
      <div className="card">
        <h2 className="text-2xl font-bold mb-3">EU-27 overview</h2>
        <div className="grid">
          {countries.map(c => (
            <Link key={c.code} href={`/country/${c.code}`} className="country">
              <div className="small">{c.code}</div>
              <div style={{fontWeight:700}}>{c.name}</div>
              <div className={"badge " + (c.rising ? "red" : "green")}>{c.rising ? "Rising" : "Falling"}</div>
            </Link>
          ))}
          <div className="ad">Ad space (AdSense)</div>
        </div>
      </div>
    </div>
  );
}
