// components/CookiePrefsButton.jsx
"use client";
import { useEffect, useState, useCallback } from "react";

export default function CookiePrefsButton({ label = "Open cookie preferences" }) {
  const [ready, setReady] = useState(false);

  // check elke 300ms tot CookieScript of __tcfapi klaar is (max ~5s)
  useEffect(() => {
    let tries = 0;
    const iv = setInterval(() => {
      const hasCS =
        typeof window !== "undefined" &&
        window.CookieScript &&
        (typeof window.CookieScript.renew === "function" ||
         typeof window.CookieScript.show === "function" ||
         typeof window.CookieScript.open === "function");
      const hasTCF = typeof window !== "undefined" && typeof window.__tcfapi === "function";
      if (hasCS || hasTCF || ++tries > 16) { // ~16 * 300ms = ~4.8s
        setReady(hasCS || hasTCF);
        clearInterval(iv);
      }
    }, 300);
    return () => clearInterval(iv);
  }, []);

  const reopen = useCallback((e) => {
    e.preventDefault();
    try {
      const cs = window.CookieScript || {};
      if (typeof cs.renew === "function") return cs.renew();
      if (typeof cs.show === "function") return cs.show();
      if (typeof cs.open === "function") return cs.open();
      if (typeof window.__tcfapi === "function") {
        return window.__tcfapi("displayConsentUi", 2, () => {});
      }
      alert("Cookie preferences are currently unavailable. Please try again.");
    } catch {
      alert("Cookie preferences are currently unavailable. Please try again.");
    }
  }, []);

  return (
    <button
      onClick={reopen}
      disabled={!ready}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 10,
        border: "1px solid #2b3a4f",
        background: ready ? "#0d1424" : "#1a2235",
        color: "white",
        padding: "10px 14px",
        opacity: ready ? 1 : 0.6,
        cursor: ready ? "pointer" : "not-allowed",
      }}
      aria-label="Open cookie preferences"
      title={ready ? "Open cookie preferences" : "Loading consent manager…"}
    >
      {label}
    </button>
  );
}
