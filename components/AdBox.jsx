// components/AdBox.jsx
"use client";
import { useEffect, useRef } from "react";

export default function AdBox({ slot, test = false, style }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !slot) return;
    try {
      ref.current.innerHTML = "";

      const ins = document.createElement("ins");
      ins.className = "adsbygoogle";
      ins.style.display = "block";
      ins.setAttribute("data-ad-client", "ca-pub-9252617114074571");
      ins.setAttribute("data-ad-slot", String(slot));
      ins.setAttribute("data-ad-format", "auto");
      ins.setAttribute("data-full-width-responsive", "true");
      if (test) ins.setAttribute("data-adtest", "on"); // ⬅️ forceer test-ads
      ref.current.appendChild(ins);

      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (_) {}
  }, [slot, test]);

  return (
    <div
      ref={ref}
      style={{ minHeight: 250, margin: "16px 0", ...style }}
      aria-label="Advertisement"
      role="complementary"
    />
  );
}
