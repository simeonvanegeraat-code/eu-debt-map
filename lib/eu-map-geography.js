const NAME_TO_ISO2 = {
  Austria: "AT",
  Belgium: "BE",
  Bulgaria: "BG",
  Croatia: "HR",
  Cyprus: "CY",
  Czechia: "CZ",
  "Czech Republic": "CZ",
  Denmark: "DK",
  Estonia: "EE",
  Finland: "FI",
  France: "FR",
  Germany: "DE",
  Greece: "GR",
  Hungary: "HU",
  Ireland: "IE",
  Italy: "IT",
  Latvia: "LV",
  Lithuania: "LT",
  Luxembourg: "LU",
  Malta: "MT",
  Netherlands: "NL",
  Poland: "PL",
  Portugal: "PT",
  Romania: "RO",
  Slovakia: "SK",
  Slovenia: "SI",
  Spain: "ES",
  Sweden: "SE",
};

export function nameToIso2(rawName) {
  if (!rawName) return null;
  if (NAME_TO_ISO2[rawName]) return NAME_TO_ISO2[rawName];

  const name = String(rawName).replace(/\s*\(.*?\)\s*/g, "").trim().toLowerCase();
  if (name === "n. cyprus" || name.includes("northern cyprus")) return null;
  const aliases = [
    ["netherland", "NL"], ["german", "DE"], ["hellenic", "GR"],
    ["greece", "GR"], ["czech", "CZ"], ["ireland", "IE"],
    ["cyprus", "CY"], ["slovak", "SK"], ["sloven", "SI"],
    ["croat", "HR"], ["portugal", "PT"], ["spain", "ES"],
    ["swed", "SE"], ["france", "FR"], ["ital", "IT"],
    ["romania", "RO"], ["poland", "PL"], ["bulgar", "BG"],
    ["estonia", "EE"], ["latvia", "LV"], ["lithuan", "LT"],
    ["luxem", "LU"], ["malta", "MT"], ["austria", "AT"],
    ["belg", "BE"], ["denmark", "DK"], ["finland", "FI"],
    ["hungary", "HU"],
  ];

  return aliases.find(([fragment]) => name.includes(fragment))?.[1] || null;
}
