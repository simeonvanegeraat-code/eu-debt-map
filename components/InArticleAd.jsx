"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function InArticleAd() {
  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (e) {
      // voorkom crash als AdSense nog niet klaar is
    }
  }, []);

  return (
    <div style={{ margin: "40px 0" }}>
      <p
        style={{
          margin: "0 0 10px",
          fontSize: "0.75rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#6b7280",
          fontFamily: "var(--font-sans, sans-serif)",
        }}
      >
        Advertisement
      </p>

      <Script
        id="adsbygoogle-inarticle-script"
        strategy="afterInteractive"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9252617114074571"
        crossOrigin="anonymous"
      />

      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-9252617114074571"
        data-ad-slot="8569800942"
      />
    </div>
  );
}