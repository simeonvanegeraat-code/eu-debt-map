"use client";
import {useEffect} from "react";
import Script from "next/script";
declare global{ interface Window{ adsbygoogle?: Array<object>; } }
export default function AdSlot({client,slot,format="auto",fullWidthResponsive=true,show=true,style}:{client:string;slot?:string;format?:string;fullWidthResponsive?:boolean;show?:boolean;style?:React.CSSProperties;}){
  useEffect(()=>{
    if(!show) return;
    try{ (window.adsbygoogle = window.adsbygoogle || []).push({}); }catch{}
  },[show]);
  return (
    <>
      <Script id="adsense-init" strategy="afterInteractive" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`} crossOrigin="anonymous" />
      <ins className="adsbygoogle"
        style={style ?? {display:"block",minHeight:90}}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true":"false"}
      />
    </>
  );
}
