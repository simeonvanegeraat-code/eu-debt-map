// components/AdSlot.jsx
"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight AdSense slot.
 * - Reserveert hoogte (minH) om CLS te voorkomen
 * - data-full-width-responsive = true voor responsive behavior
 * - sticky = true voor desktop sidebar
 */
export default function AdSlot({
  slot,                    // bv. "1234567890"
  format = "auto",         // "auto" | "rectangle" | "horizontal" | "vertical"
  fullWidth = true,
  minH = 270,              // 270–320 is prima voor mobiele rectangles
  sticky = false,          // maak 'm sticky (alleen desktop laten zien via CSS)
  label = "Advertisement",
  style,
  adTest = false,          // zet op true als je wilt testen
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !slot) return;
    try {
      // push alleen 1x per mount
      if (ref.current.dataset.filled !== "true") {
        // eslint-disable-next-line no-undef
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        ref.current.dataset.filled = "true";
      }
    } catch {
      // stil falen is ok
    }
  }, [slot]);

  const base = {
    display: "block",
    minHeight: `${minH}px`,
    borderRadius: "12px",
    overflow: "hidden",
    background: "#f3f4f6",
    border: "1px solid var(--border)",
  };

  const stickyStyle = sticky ? { position: "sticky", top: 12 } : null;

  return (
    <div role="region" aria-label={label}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ ...base, ...stickyStyle, ...style }}
        data-ad-client="ca-pub-9252617114074571"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidth ? "true" : "false"}
        {...(adTest ? { "data-adtest": "on" } : {})}
      />
    </div>
  );
}
