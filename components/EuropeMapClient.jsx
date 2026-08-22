"use client";

import dynamic from "next/dynamic";

const EuropeMap = dynamic(() => import("@/components/EuropeMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{ height: 420, display: "grid", placeItems: "center" }}
      className="card"
      aria-busy="true"
    >
      Loading map…
    </div>
  ),
});

export default EuropeMap;
