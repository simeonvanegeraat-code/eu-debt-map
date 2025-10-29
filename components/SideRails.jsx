// components/SideRails.jsx
"use client";

import AdSlot from "@/components/AdSlot";

/**
 * Twee vaste, sticky rails links en rechts, alleen op desktop.
 * Verberg op <1280px via CSS (zie globals.css).
 */
export default function SideRails() {
  return (
    <>
      {/* Linker rail */}
      <aside className="rail rail--left" aria-hidden="true">
        {/* Vervang met jouw eigen Sidebar slot-ID */}
        <AdSlot slot="YOUR_LEFT_SIDEBAR_SLOT" width={300} height={600} />
        <div className="rail-gap" />
        {/* Optioneel 2e blok */}
        <AdSlot slot="YOUR_LEFT_SIDEBAR_SLOT_2" width={300} height={250} />
      </aside>

      {/* Rechter rail */}
      <aside className="rail rail--right" aria-hidden="true">
        <AdSlot slot="YOUR_RIGHT_SIDEBAR_SLOT" width={300} height={600} />
        <div className="rail-gap" />
        <AdSlot slot="YOUR_RIGHT_SIDEBAR_SLOT_2" width={300} height={250} />
      </aside>
    </>
  );
}
