"use client";
import { useParams } from "next/navigation";
import { getCountry, perSecondRate, projectedNow } from "@/lib/data";
import { useEffect, useMemo, useState } from "react";
import AdSlot from "@/components/AdSlot";
import CookieConsent from "@/components/CookieConsent";
import Link from "next/link";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

type T = "accepted"|"rejected"|null;

export default function CountryPage(){
  const { code } = useParams<{code:string}>();
  const country = getCountry(code);
  const [consent,setConsent] = useState<T>(null);

  if(!country){
    return <main className="container"><div className="card">Unknown country code: {code}. <Link href="/">Go back</Link></div></main>
  }

  const client="ca-pub-9252617114074571";
  const [nowValue,setNowValue] = useState(projectedNow(country));
  const rate = perSecondRate(country);
  const trend = country.last_value_eur - country.prev_value_eur;

  useEffect(()=>{
    const id = setInterval(()=> setNowValue(v=> v + rate), 1000);
    return ()=> clearInterval(id);
  },[rate]);

  const hist = useMemo(()=> country.history.map(h=>({ name:h.date.slice(0,7), value: Math.round(h.value_eur/1e9) })),[country]);

  return (
    <main className="container">
      <CookieConsent onChange={setConsent} />

      <section className="ad-card card">
        <AdSlot client={client} format="auto" fullWidthResponsive show={consent!=="rejected"} />
      </section>

      <section className="card">
        <Link className="small" href="/">← Back to map</Link>
        <h1>{country.name}</h1>
        <div className="legend" style={{margin:"8px 0 16px"}}>
          <span className={trend>=0 ? "badge bad":"badge good"}>
            {trend>=0 ? "Increasing (est.)":"Decreasing (est.)"}
          </span>
          <span className="badge">Last update: {country.last_date}</span>
        </div>
        <div className="grid">
          <div className="card">
            <h2>Estimated Public Debt (live)</h2>
            <p style={{fontSize:38, margin:0}}>
              € {Math.max(0, Math.round(nowValue)).toLocaleString()}
            </p>
            <div className="small">Est. rate: { (rate>=0?"+":"") + Math.round(rate).toLocaleString() } €/sec • Based on last two periods</div>
            <p className="small">Disclaimer: This is an interpolated estimate between official releases; it is not an official live figure.</p>
          </div>
          <div className="card">
            <h2>Recent trend</h2>
            <div className="spark">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart margin={{top:10,right:10,left:0,bottom:10}} data={hist}>
                  <Tooltip formatter={(v)=>[`${v} bn €`,"Debt"]} labelFormatter={(l)=>`Period ${l}`} />
                  <Line type="monotone" dataKey="value" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="small">Values shown in billions of euros (bn €), demo data.</div>
          </div>
        </div>
      </section>

      <section className="ad-card card">
        <AdSlot client={client} format="auto" fullWidthResponsive show={consent!=="rejected"} />
      </section>
    </main>
  );
}
