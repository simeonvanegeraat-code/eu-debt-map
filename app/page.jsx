import dynamic from 'next/dynamic';
const EuropeGrid = dynamic(() => import('@/components/EuropeGrid'), { ssr: false });

export default function Home() {
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-3">EU-27 overview</h2>
      <EuropeGrid />
    </div>
  );
}
