// components/CookiePrefsButton.jsx
"use client";

export default function CookiePrefsButton({ label = "Open cookie preferences" }) {
  const reopen = (e) => {
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
      // no-op
    }
  };

  return (
    <button
      onClick={reopen}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 10,
        border: "1px solid #2b3a4f",
        background: "#0d1424",
        color: "white",
        padding: "10px 14px",
        cursor: "pointer",
      }}
      aria-label="Open cookie preferences"
    >
      {label}
    </button>
  );
}
