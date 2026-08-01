// components/ConsentDebug.jsx
"use client";
import { useEffect, useState } from "react";

export default function ConsentDebug() {
  const [state, setState] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    function read() {
      const dl = (window.dataLayer || []).filter(
        (entry) => entry?.[0] === "consent" || entry?.event === "consent"
      );
      setEvents(dl.slice(-5));
      setState({
        googleCmpScriptLoaded: Array.from(document.scripts).some((script) =>
          script.src.includes("fundingchoicesmessages.google.com")
        ),
        googleConsentApiAvailable:
          typeof window.googlefc?.showRevocationMessage === "function",
        tcfApiAvailable: typeof window.__tcfapi === "function",
      });
    }

    read();
    const timer = setInterval(read, 2000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div style={{
      position:"fixed", bottom: 10, right: 10, zIndex: 99999,
      background: "rgba(10,12,20,.9)", color:"#fff", padding: "10px 12px",
      borderRadius: 10, fontSize: 12, maxWidth: 340, lineHeight: 1.4
    }}>
      <div style={{fontWeight:700, marginBottom:6}}>Consent Debug</div>
      <div><strong>Google CMP script loaded</strong>: {String(Boolean(state?.googleCmpScriptLoaded))}</div>
      <div><strong>Google consent API available</strong>: {String(Boolean(state?.googleConsentApiAvailable))}</div>
      <div><strong>IAB TCF API available</strong>: {String(Boolean(state?.tcfApiAvailable))}</div>
      <div style={{marginTop:6}}><strong>Recent dataLayer consent events</strong>:</div>
      <pre style={{maxHeight:150, overflow:"auto"}}>{JSON.stringify(events, null, 2)}</pre>
    </div>
  );
}
