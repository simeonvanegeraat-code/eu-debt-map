const TEXT = {
  nl: {
    locale: "nl-NL", base: "/nl", largeDivisor: 1e12, largeUnit: "bln.", billionUnit: "mld.", currencyAfter: false,
    preview: "Ontwerpvoorbeeld · Nederlands", current: "Huidige pagina bekijken",
    eyebrow: "EU-27 · Overheidsschuld in perspectief", title: ["De staatsschuld", "van de", "EU-landen."],
    intro: "De overheidsschuld van 27 landen opgeteld. Bekijk de ontwikkeling over vijf jaar en het aandeel van ieder land.",
    explore: "Bekijk de schuldtrend", compare: "Vergelijk de landen", quarterChange: "Sinds vorig kwartaal", fiveYearChange: "Verandering in 5 jaar", coverage: "Eurostat · 27 van 27 landen · dezelfde verslagperiode",
    nav: { label: "Op deze pagina", title: "EU-schuld", browse: "Blader door paginaonderdelen", sections: ["Schuldtrend", "Verdeling per land", "Wat betekent dit?", "Bron en methode"] },
    summary: {
      label: "EU-schuldmeter", mode: "Weergave EU-schuldmeter", live: "Live", official: "Officieel", caption: "Opgetelde overheidsschuld EU-27",
      liveAria: "Overheidsschuld EU-27, gemodelleerde live schatting", officialAria: "Officiële opgetelde overheidsschuld EU-27", liveStatus: "Gemodelleerde live schatting · EU-27", officialStatus: "Berekende som · officiële cijfers · {period}", anchor: "Officieel anker",
      liveNote: "De live teller gebruikt dezelfde schatting als de homepage. Het is geen officiële realtime statistiek.", officialNote: "Dit is de laatst beschikbare kwartaalstand, berekend uit de officiële schuldcijfers van alle 27 EU-landen.", method: "Hoe werkt dit?", changes: "Veranderingen tussen officiële kwartalen",
    },
    trend: {
      eyebrow: "01 — Vijf jaar in beeld", up: "{percent} meer overheidsschuld in vijf jaar.", down: "{percent} minder overheidsschuld in vijf jaar.", flat: "De overheidsschuld is over vijf jaar gelijk gebleven.",
      intro: "Van {first} naar {last} De vergelijking gebruikt nominale euro’s, zonder correctie voor inflatie of economische groei.",
      footnote: "Dezelfde 27 landen · {count} kwartaalwaarnemingen", units: "Eenheden: 1 biljoen (bln.) = 1.000 miljard (mld.).",
      heading: "Opgetelde overheidsschuld · biljoen euro", title: "Vijf jaar officiële kwartaalcijfers", selected: "Geselecteerd kwartaal", hint: "Wijs een punt aan, tik op de grafiek of gebruik de schuifregelaar.",
      scale: "Let op: de verticale schaal begint bij {lower} biljoen euro, niet bij nul.", choose: "Kies een kwartaal", keyboard: "Ook te bedienen met de pijltjestoetsen", tableToggle: "Alle {count} kwartaalcijfers bekijken", tableCaption: "Opgetelde overheidsschuld EU-27 in biljoen euro, afgerond op twee decimalen", quarter: "Kwartaal", debt: "Schuld (bln.)",
    },
    distribution: {
      eyebrow: "02 — De verdeling", title: "Waar zit de schuld?", intro: "Grote economieën wegen zwaar in het totaal. Dit is een vergelijking van bedragen; voor de relatieve schuldenlast gebruik je de schuldquote.",
      cardTitle: "Overheidsschuld per land", latest: "Nieuwste kwartaal · {period}", periodNote: "Deze verdeling toont altijd {period}, onafhankelijk van je selectie in de trendgrafiek.", country: "Land", amountShare: "Bedrag / aandeel EU-27", rest: "Overige {count} EU-landen",
      barNote: "Bedragen in miljard euro, afgerond op hele miljarden. Alle balken gebruiken dezelfde schaal vanaf nul. De overige {count} landen zijn samengevoegd.",
      insightEyebrow: "Het totaal in perspectief · {period}", insightTitle: "van de opgetelde schuld zit bij vier landen.", leaders: "{countries} hebben samen het grootste aandeel in het absolute bedrag.",
      shareAlt: "Vier grootste landen: {leaders}. Overige 23 landen: {rest}.", leadersLabel: "Vier grootste landen", othersLabel: "Overige 23 landen", insightNote: "Een groot aandeel betekent niet automatisch een hogere schuld ten opzichte van de economie.", ratioLink: "Vergelijk de schuldquotes",
      tableToggle: "Bekijk de bedragen van alle 27 landen", tableCaption: "Nieuwste kwartaal: {period} · bedragen afgerond op hele miljarden; aandelen op één decimaal", debt: "Schuld (mld.)", share: "Aandeel", total: "Totaal EU-27", rounding: "Het totaal en de aandelen zijn berekend met onafgeronde bronwaarden. Afgeronde bedragen of percentages tellen daardoor niet altijd precies op.",
    },
    meaning: {
      eyebrow: "03 — Lees de cijfers goed", title: "Eén totaal. Verschillende verhalen.", intro: "Het bedrag toont de omvang. De economische betekenis vraagt om meer context.",
      cards: [
        { title: "Een som van landen", text: "Deze cijfers tellen nationale overheidsschulden op. Het is geen schuld waarvoor één gezamenlijke schatkist verantwoordelijk is, en ook geen overzicht van leningen van de EU-instellingen zelf." },
        { title: "Bedrag en draagkracht", text: "Een grote economie kan meer schuld hebben in euro’s en tegelijk een lagere schuldquote. Bekijk daarom ook de verhouding tot het bbp.", path: "/debt-to-gdp", link: "Naar de schuldquotes" },
        { title: "Waarneming en schatting", text: "Deze grafiek toont officiële kwartaalwaarnemingen. De bewegende teller op de homepage trekt de nieuwste trend door en is een gemodelleerde schatting.", path: "/", link: "Naar de live schuldenkaart" },
      ],
    },
    sources: {
      eyebrow: "04 — Bron en methode", title: "Cijfers die je kunt herleiden.", intro: "Gebaseerd op Eurostat, dataset gov_10q_ggdebt: driemaandelijkse bruto overheidsschuld, sector S13, in miljoenen euro’s. De bedragen zijn omgerekend naar euro’s en per kwartaal opgeteld voor dezelfde 27 EU-landen.", scope: "Deze berekende som kan afwijken van het officiële EU-aggregaat.", flags: "Sommige broncijfers zijn voorlopig of geraamd.", calculation: "Het verschil over vijf jaar gebruikt de eerste en laatste waarneming van de grafiek; de procentuele verandering is berekend ten opzichte van de eerste waarneming.", updated: "Gegevens bijgewerkt", primary: "Primaire bron", metadata: "Eurostat · definities en metadata", calculations: "Berekeningen", growth: "Bronstatus en schuldgroei", site: "EU Debt Map", method: "Volledige methodologie",
    },
  },
  en: {
    locale: "en-GB", base: "", largeDivisor: 1e12, largeUnit: "tn", billionUnit: "bn", currencyAfter: false,
    preview: "Design preview · English", current: "View the current page",
    eyebrow: "EU-27 · Government debt in perspective", title: ["Government debt", "across", "EU countries."],
    intro: "The government debt of 27 countries added together. Explore the five-year trend and each country’s share.",
    explore: "Explore the debt trend", compare: "Compare countries", quarterChange: "Since the previous quarter", fiveYearChange: "Five-year change", coverage: "Eurostat · 27 of 27 countries · a shared reference period",
    nav: { label: "On this page", title: "EU debt", browse: "Browse page sections", sections: ["Debt trend", "Country breakdown", "What does it mean?", "Sources and method"] },
    summary: {
      label: "EU debt monitor", mode: "EU debt display", live: "Live", official: "Official", caption: "Summed government debt of the EU-27",
      liveAria: "EU-27 government debt, modelled live estimate", officialAria: "Official summed government debt of the EU-27", liveStatus: "Modelled live estimate · EU-27", officialStatus: "Calculated sum · official figures · {period}", anchor: "Official anchor",
      liveNote: "The live counter uses the same estimate as the homepage. It is not an official real-time statistic.", officialNote: "This is the latest available quarterly position, calculated from the official government debt figures of all 27 EU countries.", method: "How does it work?", changes: "Changes between official quarters",
    },
    trend: {
      eyebrow: "01 — Five years in view", up: "{percent} more government debt in five years.", down: "{percent} less government debt in five years.", flat: "Government debt is unchanged over five years.",
      intro: "From {first} to {last}. The comparison uses nominal euros, without adjusting for inflation or economic growth.",
      footnote: "The same 27 countries · {count} quarterly observations", units: "Units: €1 trillion (tn) = €1,000 billion (bn).",
      heading: "Summed government debt · trillion euros", title: "Five years of official quarterly figures", selected: "Selected quarter", hint: "Point to a quarter, tap the chart or use the slider.",
      scale: "Note: the vertical scale starts at €{lower} trillion, not zero.", choose: "Choose a quarter", keyboard: "You can also use the arrow keys", tableToggle: "View all {count} quarterly figures", tableCaption: "Summed EU-27 government debt in trillion euros, rounded to two decimal places", quarter: "Quarter", debt: "Debt (tn)",
    },
    distribution: {
      eyebrow: "02 — The breakdown", title: "Where does the debt sit?", intro: "Large economies account for much of the total. This compares amounts; use the debt-to-GDP ratio to compare the relative debt burden.",
      cardTitle: "Government debt by country", latest: "Latest quarter · {period}", periodNote: "This breakdown always shows {period}, independently of the quarter selected in the trend chart.", country: "Country", amountShare: "Amount / EU-27 share", rest: "Other {count} EU countries",
      barNote: "Amounts in billion euros, rounded to whole billions. All bars use the same scale from zero. The other {count} countries are grouped together.",
      insightEyebrow: "The total in perspective · {period}", insightTitle: "of the summed debt is accounted for by four countries.", leaders: "{countries} together account for the largest share of the absolute amount.",
      shareAlt: "Four largest countries: {leaders}. Other 23 countries: {rest}.", leadersLabel: "Four largest countries", othersLabel: "Other 23 countries", insightNote: "A large share does not automatically mean higher debt relative to the size of the economy.", ratioLink: "Compare debt-to-GDP ratios",
      tableToggle: "View the amounts for all 27 countries", tableCaption: "Latest quarter: {period} · amounts rounded to whole billions; shares to one decimal place", debt: "Debt (bn)", share: "Share", total: "EU-27 total", rounding: "The total and shares are calculated using unrounded source values. Rounded amounts and percentages may therefore not add up exactly.",
    },
    meaning: {
      eyebrow: "03 — Read the figures carefully", title: "One total. Different stories.", intro: "The amount shows the scale. Its economic meaning needs more context.",
      cards: [
        { title: "A sum of countries", text: "These figures add up national government debts. This is not debt for which a single common treasury is responsible, nor an overview of borrowing by the EU institutions themselves." },
        { title: "Amount and capacity", text: "A large economy can have more debt in euros while also having a lower debt-to-GDP ratio. Look at the size of the economy as well.", path: "/debt-to-gdp", link: "Explore debt-to-GDP ratios" },
        { title: "Observation and estimate", text: "The chart shows official quarterly observations. The moving counter on the homepage extends the latest trend and is a modelled estimate.", path: "/", link: "Explore the live debt map" },
      ],
    },
    sources: {
      eyebrow: "04 — Sources and method", title: "Figures you can trace.", intro: "Based on Eurostat dataset gov_10q_ggdebt: quarterly gross government debt, sector S13, in million euros. Amounts are converted to euros and added together each quarter for the same 27 EU countries.", scope: "This calculated sum may differ from the official EU aggregate.", flags: "Some source figures are provisional or estimated.", calculation: "The five-year change uses the first and last observations in the chart; the percentage change is calculated relative to the first observation.", updated: "Data updated", primary: "Primary source", metadata: "Eurostat · definitions and metadata", calculations: "Calculations", growth: "Source status and debt growth", site: "EU Debt Map", method: "Full methodology",
    },
  },
  de: {
    locale: "de-DE", base: "/de", largeDivisor: 1e12, largeUnit: "Bio.", billionUnit: "Mrd.", currencyAfter: true,
    preview: "Designvorschau · Deutsch", current: "Aktuelle Seite ansehen",
    eyebrow: "EU-27 · Staatsschulden im Überblick", title: ["Staatsschulden", "der", "EU-Länder."],
    intro: "Die Staatsschulden von 27 Ländern zusammengerechnet. Erkunden Sie die Entwicklung über fünf Jahre und den Anteil jedes Landes.",
    explore: "Schuldenentwicklung ansehen", compare: "Länder vergleichen", quarterChange: "Seit dem Vorquartal", fiveYearChange: "Veränderung in 5 Jahren", coverage: "Eurostat · 27 von 27 Ländern · derselbe Berichtszeitraum",
    nav: { label: "Auf dieser Seite", title: "EU-Schulden", browse: "Durch Seitenabschnitte blättern", sections: ["Schuldenentwicklung", "Verteilung nach Ländern", "Was bedeutet das?", "Quellen und Methode"] },
    summary: {
      label: "EU-Schuldenzähler", mode: "Anzeige des EU-Schuldenzählers", live: "Live", official: "Offiziell", caption: "Addierte Staatsschulden der EU-27",
      liveAria: "Staatsschulden der EU-27, modellierte Live-Schätzung", officialAria: "Offizielle addierte Staatsschulden der EU-27", liveStatus: "Modellierte Live-Schätzung · EU-27", officialStatus: "Berechnete Summe · offizielle Werte · {period}", anchor: "Offizieller Ausgangswert",
      liveNote: "Der Live-Zähler nutzt dieselbe Schätzung wie die Startseite. Er ist keine amtliche Echtzeitstatistik.", officialNote: "Dies ist der zuletzt verfügbare Quartalsstand, berechnet aus den amtlichen Schuldenwerten aller 27 EU-Länder.", method: "Wie funktioniert das?", changes: "Veränderungen zwischen offiziellen Quartalen",
    },
    trend: {
      eyebrow: "01 — Fünf Jahre im Blick", up: "{percent} mehr Staatsschulden in fünf Jahren.", down: "{percent} weniger Staatsschulden in fünf Jahren.", flat: "Die Staatsschulden sind über fünf Jahre unverändert.",
      intro: "Von {first} auf {last}. Der Vergleich verwendet nominale Eurobeträge, ohne Bereinigung um Inflation oder Wirtschaftswachstum.",
      footnote: "Dieselben 27 Länder · {count} Quartalsbeobachtungen", units: "Einheiten: 1 Billion (Bio.) Euro = 1.000 Milliarden (Mrd.) Euro.",
      heading: "Addierte Staatsschulden · Billionen Euro", title: "Fünf Jahre amtliche Quartalswerte", selected: "Ausgewähltes Quartal", hint: "Zeigen oder tippen Sie auf den Chart oder nutzen Sie den Schieberegler.",
      scale: "Hinweis: Die vertikale Skala beginnt bei {lower} Billionen Euro, nicht bei null.", choose: "Quartal auswählen", keyboard: "Auch mit den Pfeiltasten bedienbar", tableToggle: "Alle {count} Quartalswerte ansehen", tableCaption: "Addierte Staatsschulden der EU-27 in Billionen Euro, auf zwei Dezimalstellen gerundet", quarter: "Quartal", debt: "Schulden (Bio. €)",
    },
    distribution: {
      eyebrow: "02 — Die Verteilung", title: "Wo liegen die Schulden?", intro: "Große Volkswirtschaften haben ein hohes Gewicht in der Gesamtsumme. Hier werden Beträge verglichen; für die relative Schuldenlast eignet sich die Schuldenquote.",
      cardTitle: "Staatsschulden nach Land", latest: "Neuestes Quartal · {period}", periodNote: "Diese Verteilung zeigt immer {period}, unabhängig vom im Trendchart ausgewählten Quartal.", country: "Land", amountShare: "Betrag / Anteil an EU-27", rest: "Übrige {count} EU-Länder",
      barNote: "Beträge in Milliarden Euro, auf volle Milliarden gerundet. Alle Balken verwenden dieselbe Skala ab null. Die übrigen {count} Länder sind zusammengefasst.",
      insightEyebrow: "Die Gesamtsumme im Kontext · {period}", insightTitle: "der addierten Schulden entfallen auf vier Länder.", leaders: "{countries} haben zusammen den größten Anteil am absoluten Betrag.",
      shareAlt: "Vier größte Länder: {leaders}. Übrige 23 Länder: {rest}.", leadersLabel: "Vier größte Länder", othersLabel: "Übrige 23 Länder", insightNote: "Ein hoher Anteil bedeutet nicht automatisch eine höhere Verschuldung im Verhältnis zur Wirtschaftsleistung.", ratioLink: "Schuldenquoten vergleichen",
      tableToggle: "Beträge für alle 27 Länder ansehen", tableCaption: "Neuestes Quartal: {period} · Beträge auf volle Milliarden, Anteile auf eine Dezimalstelle gerundet", debt: "Schulden (Mrd. €)", share: "Anteil", total: "EU-27 insgesamt", rounding: "Gesamtsumme und Anteile werden aus ungerundeten Quelldaten berechnet. Gerundete Beträge und Prozentwerte ergeben daher nicht immer exakt die angezeigte Summe.",
    },
    meaning: {
      eyebrow: "03 — Die Zahlen richtig einordnen", title: "Eine Summe. Verschiedene Geschichten.", intro: "Der Betrag zeigt die Größenordnung. Für die wirtschaftliche Bedeutung ist mehr Kontext nötig.",
      cards: [
        { title: "Eine Summe nationaler Schulden", text: "Diese Zahlen addieren nationale Staatsschulden. Sie zeigen weder die Schulden einer einzigen gemeinsamen Staatskasse noch die Kreditaufnahme der EU-Institutionen selbst." },
        { title: "Betrag und Tragfähigkeit", text: "Eine große Volkswirtschaft kann höhere Schulden in Euro und gleichzeitig eine niedrigere Schuldenquote haben. Betrachten Sie daher auch das Verhältnis zum BIP.", path: "/debt-to-gdp", link: "Zu den Schuldenquoten" },
        { title: "Beobachtung und Schätzung", text: "Der Chart zeigt amtliche Quartalsbeobachtungen. Der laufende Zähler auf der Startseite schreibt den neuesten Trend fort und ist eine modellierte Schätzung.", path: "/", link: "Zur Live-Schuldenkarte" },
      ],
    },
    sources: {
      eyebrow: "04 — Quellen und Methode", title: "Nachvollziehbare Zahlen.", intro: "Grundlage ist der Eurostat-Datensatz gov_10q_ggdebt: vierteljährlicher Bruttoschuldenstand des Staates, Sektor S13, in Millionen Euro. Die Beträge werden in Euro umgerechnet und für dieselben 27 EU-Länder je Quartal addiert.", scope: "Diese berechnete Summe kann vom offiziellen EU-Aggregat abweichen.", flags: "Einige Quelldaten sind vorläufig oder geschätzt.", calculation: "Die Fünfjahresveränderung verwendet die erste und letzte Beobachtung im Chart; die prozentuale Veränderung bezieht sich auf die erste Beobachtung.", updated: "Daten aktualisiert", primary: "Primärquelle", metadata: "Eurostat · Definitionen und Metadaten", calculations: "Berechnungen", growth: "Datenstatus und Schuldenentwicklung", site: "EU Debt Map", method: "Vollständige Methodik",
    },
  },
  fr: {
    // Use milliards consistently to avoid the English/French billion ambiguity.
    // Reference: https://www.oecd.org/en/publications/oecd-style-guide-fourth-edition_2ca15c7e-en/full-report/component-12.html
    locale: "fr-FR", base: "/fr", largeDivisor: 1e9, largeUnit: "Md€", billionUnit: "Md€", currencyAfter: true,
    preview: "Aperçu du design · Français", current: "Voir la page actuelle",
    eyebrow: "UE-27 · La dette publique en perspective", title: ["La dette publique", "des", "pays de l’UE."],
    intro: "La dette publique de 27 pays additionnée. Découvrez son évolution sur cinq ans et la part de chaque pays.",
    explore: "Explorer la tendance", compare: "Comparer les pays", quarterChange: "Depuis le trimestre précédent", fiveYearChange: "Variation sur 5 ans", coverage: "Eurostat · 27 pays sur 27 · une même période de référence",
    nav: { label: "Sur cette page", title: "Dette de l’UE", browse: "Parcourir les rubriques", sections: ["Évolution de la dette", "Répartition par pays", "Comment l’interpréter ?", "Sources et méthode"] },
    summary: {
      label: "Compteur UE-27", mode: "Affichage du compteur UE-27", live: "En direct", official: "Officiel", caption: "Dette publique cumulée des pays de l’UE-27",
      liveAria: "Dette publique de l’UE-27, estimation modélisée en direct", officialAria: "Somme officielle des dettes publiques des pays de l’UE-27", liveStatus: "Estimation modélisée en direct · UE-27", officialStatus: "Somme calculée · données officielles · {period}", anchor: "Valeur officielle de référence",
      liveNote: "Le compteur utilise la même estimation que la page d’accueil. Il ne s’agit pas d’une statistique officielle en temps réel.", officialNote: "Il s’agit du dernier encours trimestriel disponible, calculé à partir des données officielles des 27 pays de l’UE.", method: "Comment cela fonctionne-t-il ?", changes: "Variations entre trimestres officiels",
    },
    trend: {
      eyebrow: "01 — Cinq ans en perspective", up: "{percent} de dette publique en plus en cinq ans.", down: "{percent} de dette publique en moins en cinq ans.", flat: "La dette publique est inchangée sur cinq ans.",
      intro: "De {first} à {last}. La comparaison porte sur des euros courants, sans correction de l’inflation ni de la croissance économique.",
      footnote: "Les mêmes 27 pays · {count} observations trimestrielles", units: "Unité : Md€ = milliard d’euros. Mille milliards d’euros correspondent à un billion d’euros.",
      heading: "Dette publique cumulée · milliards d’euros", title: "Cinq ans de données trimestrielles officielles", selected: "Trimestre sélectionné", hint: "Pointez un trimestre, touchez le graphique ou utilisez le curseur.",
      scale: "Attention : l’axe vertical commence à {lower} milliards d’euros, et non à zéro.", choose: "Choisir un trimestre", keyboard: "Également accessible avec les touches fléchées", tableToggle: "Voir les {count} observations trimestrielles", tableCaption: "Dette publique cumulée de l’UE-27 en milliards d’euros, arrondie à deux décimales", quarter: "Trimestre", debt: "Dette (Md€)",
    },
    distribution: {
      eyebrow: "02 — La répartition", title: "Où se situe la dette ?", intro: "Les grandes économies pèsent lourd dans le total. Cette comparaison porte sur les montants ; pour le poids relatif de la dette, utilisez le ratio dette/PIB.",
      cardTitle: "Dette publique par pays", latest: "Dernier trimestre · {period}", periodNote: "Cette répartition présente toujours {period}, indépendamment du trimestre sélectionné dans le graphique d’évolution.", country: "Pays", amountShare: "Montant / part de l’UE-27", rest: "Autres pays de l’UE ({count})",
      barNote: "Montants en milliards d’euros, arrondis à l’unité. Toutes les barres partent de zéro sur une même échelle. Les {count} autres pays sont regroupés.",
      insightEyebrow: "Le total en perspective · {period}", insightTitle: "de la dette cumulée se concentre dans quatre pays.", leaders: "{countries} représentent ensemble la plus grande part du montant total.",
      shareAlt: "Quatre principaux pays : {leaders}. Les 23 autres pays : {rest}.", leadersLabel: "Quatre principaux pays", othersLabel: "Les 23 autres pays", insightNote: "Une part élevée ne signifie pas automatiquement une dette plus importante par rapport à la taille de l’économie.", ratioLink: "Comparer les ratios dette/PIB",
      tableToggle: "Voir les montants des 27 pays", tableCaption: "Dernier trimestre : {period} · montants arrondis au milliard ; parts à une décimale", debt: "Dette (Md€)", share: "Part", total: "Total UE-27", rounding: "Le total et les parts sont calculés à partir des données sources non arrondies. La somme des montants et pourcentages arrondis peut donc différer du total affiché.",
    },
    meaning: {
      eyebrow: "03 — Bien lire les chiffres", title: "Un total. Des situations différentes.", intro: "Le montant indique l’ordre de grandeur. Sa signification économique demande davantage de contexte.",
      cards: [
        { title: "Une somme de dettes nationales", text: "Ces chiffres additionnent les dettes publiques nationales. Ils ne représentent ni la dette d’un Trésor commun unique ni un relevé des emprunts des institutions de l’UE elles-mêmes." },
        { title: "Montant et capacité économique", text: "Une grande économie peut avoir une dette plus élevée en euros et un ratio dette/PIB plus faible. Examinez donc aussi le rapport à la taille de l’économie.", path: "/debt-to-gdp", link: "Voir les ratios dette/PIB" },
        { title: "Observation et estimation", text: "Le graphique présente des observations trimestrielles officielles. Le compteur animé de la page d’accueil prolonge la tendance la plus récente : il s’agit d’une estimation modélisée.", path: "/", link: "Voir la carte de la dette en direct" },
      ],
    },
    sources: {
      eyebrow: "04 — Sources et méthode", title: "Des chiffres vérifiables.", intro: "Source : jeu de données Eurostat gov_10q_ggdebt, dette brute trimestrielle des administrations publiques, secteur S13, en millions d’euros. Les montants sont convertis en euros puis additionnés chaque trimestre pour les mêmes 27 pays de l’UE.", scope: "Cette somme calculée peut différer de l’agrégat officiel de l’UE.", flags: "Certaines données sources sont provisoires ou estimées.", calculation: "La variation sur cinq ans utilise la première et la dernière observation du graphique ; la variation en pourcentage est calculée par rapport à la première observation.", updated: "Données mises à jour", primary: "Source primaire", metadata: "Eurostat · définitions et métadonnées", calculations: "Calculs", growth: "Statut des données et évolution de la dette", site: "EU Debt Map", method: "Méthodologie complète",
    },
  },
};

function getEUDebtCopy(lang = "nl") {
  const language = Object.hasOwn(TEXT, lang) ? lang : "nl";
  return { ...TEXT[language], lang: language };
}

function euDebtText(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    if (!Object.hasOwn(values, key)) throw new Error(`Missing EU debt text value: ${key}`);
    return String(values[key]);
  });
}

function euDebtNumber(value, lang = "nl", digits = 1) {
  return new Intl.NumberFormat(getEUDebtCopy(lang).locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
}

function euDebtPercent(value, lang = "nl") {
  return new Intl.NumberFormat(getEUDebtCopy(lang).locale, { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value / 100);
}

function euDebtAmount(value, lang = "nl", scale = "large") {
  const copy = getEUDebtCopy(lang);
  const large = scale === "large";
  const number = euDebtNumber(value / (large ? copy.largeDivisor : 1e9), lang, large ? 2 : 0);
  const unit = large ? copy.largeUnit : copy.billionUnit;
  return copy.currencyAfter ? `${number} ${unit}${copy.lang === "fr" ? "" : " €"}` : `€ ${number} ${unit}`;
}

function euDebtQuarter(quarter, lang = "nl") {
  return lang === "fr" ? quarter.replace("-Q", "-T") : quarter;
}

function euDebtHref(path, lang = "nl") {
  const { base } = getEUDebtCopy(lang);
  return path === "/" ? base || "/" : base + path;
}

module.exports = { getEUDebtCopy, euDebtText, euDebtNumber, euDebtPercent, euDebtAmount, euDebtQuarter, euDebtHref };
