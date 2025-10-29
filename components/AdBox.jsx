// components/AdBox.jsx
"use client";
import AdSlot from "./AdSlot";

/**
 * Compatibiliteits-wrapper zodat oude imports blijven werken.
 * Negeert onbekende props; gebruikt jouw huidige AdSlot-implementatie.
 */
export default function AdBox({ slot, test = false, style }) {
  return <AdSlot slot={slot} test={test} style={style} />;
}
