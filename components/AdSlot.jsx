// components/AdSlot.jsx
"use client";

import { useEffect, useRef } from "react";

export default function AdSlot({
  slot,                   // bv. "1234567890" (data-ad-slot)
  test = false,           // zet 'on' voor AdSense test mode
  width = 300,            // vaste breedte voor CLS=0
  height = 600,           // vaste hoogte voor CLS=0 (skyscraper)
  style = {},
  ariaLabel = "Advertisement",
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !slot) return;
    try {
      ref.current.innerHTML = "";
      const ins = document.createElement("ins");
      ins.className = "adsbygoogle";
      ins.style.display = "inline-block";
      ins.style.width = `${width}px`;
      ins.style.height = `${height}px`;
      ins.setAttribute("data-ad-client", "ca-pub-9252617114074571");
      ins.setAttribute("data-ad-slot", String(slot));
      ins.setAttribute("data-ad-format", "rectangle");
      ins.setAttribute("data-full-width-responsive", "false");
      if (test) ins.setAttribute("data-adtest", "on");
      ref.current.appendChild(ins);
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* stilhouden */
    }
  }, [slot, test, width, height]);

  return (
    <div
      ref={ref}
      role="complementary"
      aria-label={ariaLabel}
      style={{
        width,
        minHeight: height,
        borderRadius: 12,
        overflow: "hidden",
        ...style,
      }}
    />
  );
}
