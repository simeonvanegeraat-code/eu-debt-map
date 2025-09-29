// components/AdBox.jsx
"use client";
import { useEffect, useRef } from "react";

export default function AdBox({ slot }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    try {
      // reset voor her-mounts (SPA navigatie)
      ref.current.innerHTML = "";
      const ins = document.createElement("ins");
      ins.className = "adsbygoogle";
      ins.style.display = "block";
      ins.setAttribute("data-ad-client", "ca-pub-9252617114074571");
      ins.setAttribute("data-ad-slot", slot);
      ins.setAttribute("data-ad-format", "auto");
      ins.setAttribute("data-full-width-responsive", "true");
      ref.current.appendChild(ins);
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // stilhouden
    }
  }, [slot]);

  return (
    <div
      ref={ref}
      style={{ minHeight: 250, margin: "16px 0" }} // voorkomt CLS
      aria-label="Advertisement"
      role="complementary"
    />
  );
}
