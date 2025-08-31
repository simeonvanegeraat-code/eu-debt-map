'use client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCountry } from '@/data/eu27';
import { formatEURFromCentsBigInt } from '@/utils/format';
import { useDebtTicker } from '@/utils/useDebtTicker';

export default function CountryPage({ params }) {
  const country = getCountry(params.code);
  if (!country) return notFound();
  const { nowCents, rising } = useDebtTicker(country);

  return (
    <div className="card">
      <Link href="/" className="small">← Back</Link>
      <h2 className="text-2xl font-bold mt-2">{country.code} {country.name}</h2>
      <p style={{fontSize: '22px', marginTop: 8}}>
        Current estimate: <span className="mono">{formatEURFromCentsBigInt(nowCents)}</span>
      </p>
      <p className="small">
        From {new Date(country.t0).toLocaleDateString('en-GB')} to {new Date(country.t1).toLocaleDateString('en-GB')} —{" "}
        <span className={rising ? "badge red" : "badge green"}>{rising ? "Rising" : "Falling"}</span>
      </p>
      <div className="ad" style={{marginTop:16}}>Ad space (AdSense)</div>
    </div>
  );
}
