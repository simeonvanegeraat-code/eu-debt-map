// components/AdBox.jsx
"use client";
import { useEffect, useRef } from "react";

export default function AdBox({ slot, test = false, style }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !slot) return;
    try {
      // Reset de container bij elke mount
      ref.current.innerHTML = "";

      // Maak het ins-element voor Google ads
      const ins = document.createElement("ins");
      ins.className = "adsbygoogle";
      ins.style.display = "block";
      ins.setAttribute("data-ad-client", "ca-pub-9252617114074571");
      ins.setAttribute("data-ad-slot", String(slot));
      ins.setAttribute("data-ad-format", "auto");
      ins.setAttribute("data-full-width-responsive", "true");

      // Zet test-modus aan als gevraagd
      if (test) ins.setAttribute("data-adtest", "on");

      // Voeg toe aan de DOM
      ref.current.appendChild(ins);

      // Trigger AdSense
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // fout stilhouden
    }
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
