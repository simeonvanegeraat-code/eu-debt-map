// lib/i18n.js
// Kleine, file-based i18n (zonder libs). Genoeg voor UI + metadata.

export const I18N = {
  en: {
    dtg: {
      title: "Debt-to-GDP",
      why:
        "Why it matters: The EU reference value is 60%. Countries below ~60% usually have more fiscal room and lower refinancing risk. Persistently high ratios (>90%) make public finances more sensitive to rate shocks and recessions.",
      loading: "Loading GDP from Eurostat…",
      sortHighLow: "High → Low",
      sortLowHigh: "Low → High",
      liveRank: "Live ranking by",
      debtGDP: "Debt / GDP",
      openCountry: "Open country →",
      legend: { low: "<60%", mid: "60–90%", high: ">90%" }
    }
  },
  nl: {
    dtg: {
      title: "Schuld-/bbp-verhouding",
      why:
        "Waarom dit telt: De EU-referentiewaarde is 60%. Landen onder ~60% hebben doorgaans meer begrotingsruimte en een lager herfinancieringsrisico. Aanhoudend hoge verhoudingen (>90%) maken overheidsfinanciën gevoeliger voor renteschokken en recessies.",
      loading: "Eurostat-gegevens laden…",
      sortHighLow: "Hoog → Laag",
      sortLowHigh: "Laag → Hoog",
      liveRank: "Live ranglijst op",
      debtGDP: "Schuld / bbp",
      openCountry: "Open land →",
      legend: { low: "<60%", mid: "60–90%", high: ">90%" }
    }
  },
  de: {
    dtg: {
      title: "Schulden-zu-BIP",
      why:
        "Warum es wichtig ist: Der EU-Referenzwert liegt bei 60 %. Länder unter ~60 % haben meist mehr fiskalischen Spielraum und ein geringeres Refinanzierungsrisiko. Anhaltend hohe Quoten (>90 %) erhöhen die Anfälligkeit für Zins- und Konjunkturschocks.",
      loading: "Eurostat-Daten werden geladen…",
      sortHighLow: "Hoch → Niedrig",
      sortLowHigh: "Niedrig → Hoch",
      liveRank: "Live-Ranking nach",
      debtGDP: "Schulden / BIP",
      openCountry: "Land öffnen →",
      legend: { low: "<60 %", mid: "60–90 %", high: ">90 %" }
    }
  },
  fr: {
    dtg: {
      title: "Dette / PIB",
      why:
        "Pourquoi c’est important : la valeur de référence de l’UE est 60 %. En dessous de ~60 %, les pays ont en général plus de marge budgétaire et un risque de refinancement plus faible. Des ratios durablement élevés (>90 %) rendent les finances publiques plus sensibles aux chocs de taux et aux récessions.",
      loading: "Chargement des données Eurostat…",
      sortHighLow: "Haut → Bas",
      sortLowHigh: "Bas → Haut",
      liveRank: "Classement en direct par",
      debtGDP: "Dette / PIB",
      openCountry: "Ouvrir le pays →",
      legend: { low: "<60 %", mid: "60–90 %", high: ">90 %" }
    }
  }
};

// helper: haal de juiste subtree; val terug op EN
export function t(lang, path, fallback = "") {
  try {
    const segs = path.split(".");
    let obj = I18N[lang] || I18N.en;
    for (const s of segs) obj = obj[s];
    return obj ?? fallback ?? "";
  } catch {
    return fallback ?? "";
  }
}
