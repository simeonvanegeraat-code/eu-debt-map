"use client";

import { useEffect } from "react";

const LABELS = {
  en: "Advertisement",
  nl: "Advertentie",
  de: "Anzeige",
  fr: "Publicité",
};

export default function CountryAd({ lang = "en" }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: 100,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <span
        style={{
          marginBottom: 4,
          color: "#94a3b8",
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {LABELS[lang] || LABELS.en}
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-9252617114074571"
        data-ad-slot="8705915822"
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  );
}
