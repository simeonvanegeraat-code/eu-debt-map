// lib/ads.js
// AdSense config for EU Debt Map
// -------------------------------------------------
// HOW TO USE
// 1) In AdSense, create "By ad unit" → Display → Responsive units.
// 2) Copy each unit's numeric Slot ID and paste it below.
// 3) Ensure your domain is verified in AdSense (Sites → Ready/Live).
// 4) Keep public/ads.txt published at https://yourdomain/ads.txt
// -------------------------------------------------

export const ADS_CLIENT = "ca-pub-9252617114074571";

// Live mode (set to false for production). If true, AdSense serves test ads only.
export const AD_TEST = false;

// Fill these with your real Slot IDs from AdSense.
export const SLOTS = {
  // TODO: replace with your real slot id, e.g. "1234567890"
  homeTop: "REPLACE_WITH_SLOT_ID",

  // TODO: replace with your real slot id
  homeBottom: "REPLACE_WITH_SLOT_ID",

  // TODO: replace with your real slot id
  countryUnder: "REPLACE_WITH_SLOT_ID",

  // Optional article/detail slot
  articleBottom: "REPLACE_WITH_SLOT_ID",
};
