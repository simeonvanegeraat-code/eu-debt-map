"use client";

import { useEffect } from "react";
import { ADS_CLIENT, AD_TEST } from "@/lib/ads";

/**
 * Reusable AdSense block.
 * props.slot    = je AdSense slot ID (string)
 * props.format  = "auto" (default) of "rectangle"/"horizontal" etc.
 * props.styles  = extra style; we reserveren standaard al hoogte voor CLS
 */
export default function AdSlot({ slot, format = "auto", styles }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (_) { /* adblock of nog niet geladen: negeren */ }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: "block",
        minHeight: 280,          // reserveer hoogte (pas aan per plek)
        width: "100%",
        ...styles,
      }}
      data-ad-client={ADS_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
      {...(AD_TEST ? { "data-adtest": "on" } : {})}
    />
  );
}
