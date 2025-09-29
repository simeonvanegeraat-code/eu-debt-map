// components/ConsentDebug.jsx
"use client";
import { useEffect, useState } from "react";

export default function ConsentDebug() {
  const [state, setState] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    function getCookie(name){
      return ('; '+document.cookie).split('; '+name+'=').pop().split(';')[0] || '';
    }
    function read(){
      let cookie = "";
      try { cookie = decodeURIComponent(getCookie("CookieScriptConsent")); } catch {}
      const dl = (window.dataLayer || []).filter(e => e[0]==="consent" || e.event==="consent");
      setEvents(dl.slice(-5));
      setState({
        cookieScriptConsent: cookie || "(none)",
      });
    }
    read();
    const onUpd = () => setTimeout(read, 50);
    document.addEventListener("CookieScriptLoaded", onUpd);
    document.addEventListener("CookieScriptConsentUpdated", onUpd);
    const t = setInterval(read, 2000);
    return () => {
      clearInterval(t);
      document.removeEventListener("CookieScriptLoaded", onUpd);
      document.removeEventListener("CookieScriptConsentUpdated", onUpd);
    };
  }, []);

  useEffect(() => {
    // Toon actuele Consent Mode status via gtag API (indien beschikbaar)
    try {
      window.gtag?.("get", "consent", "default", (c)=> {
        setState(s => ({ ...(s||{}), defaultConsent: c }));
      });
      window.gtag?.("get", "consent", "update", (c)=> {
        setState(s => ({ ...(s||{}), lastUpdate: c }));
      });
    } catch {}
  }, []);

  return (
    <div style={{
      position:"fixed", bottom: 10, right: 10, zIndex: 99999,
      background: "rgba(10,12,20,.9)", color:"#fff", padding: "10px 12px",
      borderRadius: 10, fontSize: 12, maxWidth: 340, lineHeight: 1.4
    }}>
      <div style={{fontWeight:700, marginBottom:6}}>Consent Debug</div>
      <div><strong>CookieScriptConsent</strong>:</div>
      <pre style={{whiteSpace:"pre-wrap"}}>{state?.cookieScriptConsent}</pre>
      <div style={{marginTop:6}}><strong>Consent defaults</strong>:</div>
      <pre>{JSON.stringify(state?.defaultConsent || {}, null, 2)}</pre>
      <div style={{marginTop:6}}><strong>Last consent update</strong>:</div>
      <pre>{JSON.stringify(state?.lastUpdate || {}, null, 2)}</pre>
      <div style={{marginTop:6}}><strong>Recent dataLayer consent events</strong>:</div>
      <pre style={{maxHeight:150, overflow:"auto"}}>{JSON.stringify(events, null, 2)}</pre>
    </div>
  );
}
