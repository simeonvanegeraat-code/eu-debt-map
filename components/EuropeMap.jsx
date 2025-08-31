'use client';
import { VectorMap } from '@react-jvectormap/core';
import { europeMill } from '@react-jvectormap/europe';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Props:
 *  countries: [{ code:'FR', rising:true|false, hasData:true|false }]
 */
export default function EuropeMap({ countries = [] }) {
  const router = useRouter();

  // map country codes to values for coloring
  const values = useMemo(() => {
    const v = {};
    countries.forEach(c => {
      if (!c || !c.code) return;
      const k = c.code.toLowerCase();
      if (c.hasData === false) {
        v[k] = 0;
      } else {
        v[k] = c.rising ? 1 : -1;
      }
    });
    return v;
  }, [countries]);

  const series = {
    regions: [
      {
        values,
        min: -1,
        max: 1,
        scale: ['#1b4d36', '#6b1b1b'], // green, red
      },
    ],
  };

  return (
    <div style={{ width: '100%', height: '420px' }} className="card">
      <VectorMap
        map={europeMill}
        backgroundColor="transparent"
        zoomOnScroll={false}
        containerStyle={{ width: '100%', height: '100%' }}
        regionStyle={{
          initial: { fill: '#0e1621', 'fill-opacity': 1, stroke: '#223147', 'stroke-width': 1 },
          hover: { 'fill-opacity': 0.9, cursor: 'pointer' },
        }}
        series={series}
        onRegionTipShow={(e, el, code) => {
          const cc = code.toUpperCase();
          const found = countries.find(c => c.code === cc);
          if (found) {
            el.html(`${cc} ${found.name} <br/> ${found.rising ? 'Rising' : 'Falling'}`);
          } else {
            el.html(`${cc}`);
          }
        }}
        onRegionClick={(e, code) => {
          const cc = code.toUpperCase();
          const found = countries.find(c => c.code === cc);
          if (found) router.push(`/country/${cc}`);
        }}
      />
    </div>
  );
}
