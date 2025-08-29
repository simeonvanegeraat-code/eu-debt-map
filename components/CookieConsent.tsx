"use client";
import {useEffect,useState} from "react";
type Consent = "accepted"|"rejected"|null;
const KEY = "cookie-consent";
export default function CookieConsent({onChange}:{onChange?:(c:Consent)=>void}){
  const [consent,setConsent] = useState<Consent>(null);
  useEffect(()=>{ setConsent((localStorage.getItem(KEY) as Consent) ?? null); },[]);
  useEffect(()=>{ onChange?.(consent); },[consent,onChange]);
  if(consent) return null;
  return (
    <div className="cookie">
      <div>
        <strong>Cookies voor advertenties</strong>
        <div className="small">We gebruiken cookies voor (niet-)gepersonaliseerde advertenties. Dit is een demo-banner; voor EU/EEA is een IAB TCF CMP aanbevolen.</div>
      </div>
      <div className="actions">
        <button onClick={()=>{localStorage.setItem(KEY,"rejected");setConsent("rejected");}}>Alleen noodzakelijke</button>
        <button className="primary" onClick={()=>{localStorage.setItem(KEY,"accepted");setConsent("accepted");}}>Accepteren</button>
      </div>
    </div>
  );
}
