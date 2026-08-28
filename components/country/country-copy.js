const COPY = {
  en: {
    previewLabel: "Country data profile · isolated preview",
    viewCurrent: "View current page",
    eyebrow: (name) => `${name} · official public-finance data`,
    lede:
      "The latest official debt figure, a transparent live estimate and the European context needed to interpret both.",
    verified: "Verified source",
    debtToGdp: "Debt-to-GDP",
    euPosition: "EU position",
    officialPeriod: "Official period",
    liveMonitor: "Live debt monitor",
    officialValue: "Official quarter-end value",
    live: "Live",
    official: "Official",
    modelledEstimate: "modelled estimate",
    estimatedNow: "Estimated now",
    officialObservation:
      "Observed value at the end of the latest official reference quarter.",
    sinceAnchor: (change) =>
      `${change} since the official anchor, extrapolated from the two latest quarters.`,
    frozenEstimate:
      "The latest official value is held steady because this country is more than one quarter behind the main dataset.",
    fallbackSource:
      "Official Eurostat debt periods are unavailable; the counter uses the documented fallback estimate.",
    continue: "Continue the story",
    exploreSignals: "Explore the four signals",
    pageNav: "On this page",
    nav: {
      snapshot: "Snapshot",
      compare: "Compare",
      movement: "Movement",
      context: "EU context",
      method: "Method",
    },
    snapshotEyebrow: "01 — The snapshot",
    snapshotTitle: "Read the debt position in four signals.",
    snapshotIntro:
      "The total shows the scale. The ratio makes countries comparable. The quarterly movement shows direction. The rank adds European context.",
    quarterlyMovement: "Quarterly movement",
    modelledPace: "Modelled pace",
    derivedPace: "Derived from the latest two official quarters",
    ranked: (rank, count) => `#${rank} of ${count}`,
    rankedDetail: "Ranked by debt-to-GDP, highest first",
    compareEyebrow: "Choose your next comparison",
    compareTitle: (name) => `Put ${name} beside another economy.`,
    compareIntro:
      "Continue with a neighbouring country, a different debt ratio or the complete EU overview.",
    allCountries: (count) => `All ${count} countries`,
    exploreOverview: "Explore the EU overview",
    compareAria: (name) => `Compare ${name} with another country`,
    compareLinkAria: (current, other, ratio) =>
      `Compare ${current} with ${other}: ${ratio} debt-to-GDP`,
    difference: (value, direction, current) =>
      `${value} pp ${direction} than ${current}`,
    higher: "higher",
    lower: "lower",
    advertisement: "Advertisement",
    recommendedAd: "Recommended primary position",
    adPlaceholder: "Responsive display advertisement",
    adDetail: "Shown after the main data and internal comparison choices",
    movementEyebrow: "02 — What moved",
    movementTitle: "The latest official quarter changed the debt stock.",
    movementIntro: (name, previous, latest) =>
      `${name}’s gross government debt moved from ${previous} to ${latest} between the two latest Eurostat observations.`,
    movementCallout:
      "A rising debt total does not automatically mean the debt burden rose at the same rate. GDP can grow or shrink at the same time — which is why the ratio deserves equal prominence.",
    officialDebtStock: "Official debt stock",
    rising: "Rising",
    falling: "Falling",
    unchanged: "Unchanged",
    quarterOnQuarter: "Quarter-on-quarter",
    contextEyebrow: "03 — European context",
    contextTitle: (name) => `How ${name} compares inside the EU.`,
    euMedian: "EU-country median",
    reference: "60% reference",
    chartNote:
      "Selected EU countries, not a full ranking. The 60% line is the Treaty reference value, not a pass-or-fail test for debt sustainability.",
    methodEyebrow: "04 — Trust the number",
    methodTitle: "Official where possible. Modelled where necessary.",
    methodSteps: [
      ["Anchor", "Eurostat provides the official quarterly debt stock."],
      ["Measure", "The change between the latest two quarters becomes a per-second pace."],
      ["Extend", "The live number extends that pace beyond the latest official date."],
    ],
    methodWarning:
      "The live counter is an estimate, not a new official observation and not a forecast.",
    readMethod: "Read the full methodology",
    openEurostat: "Open the Eurostat metadata",
    sourcePeriods: "Official Eurostat debt periods",
    sourceDates: "Quarter-end dates",
    continueExploring: "Continue exploring",
    exploreMap: "Explore the EU map",
    relatedReading: "Related analysis and country context",
  },
  nl: {
    previewLabel: "Landprofiel · geïsoleerde preview",
    viewCurrent: "Bekijk huidige pagina",
    eyebrow: (name) => `${name} · officiële overheidsfinanciën`,
    lede:
      "Het nieuwste officiële schuldcijfer, een transparante live schatting en de Europese context om beide goed te begrijpen.",
    verified: "Gecontroleerde bron",
    debtToGdp: "Schuldquote",
    euPosition: "Positie in de EU",
    officialPeriod: "Officiële periode",
    liveMonitor: "Live schuldmeter",
    officialValue: "Officiële waarde aan het einde van het kwartaal",
    live: "Live",
    official: "Officieel",
    modelledEstimate: "gemodelleerde schatting",
    estimatedNow: "Schatting nu",
    officialObservation:
      "Waargenomen waarde aan het einde van het nieuwste officiële referentiekwartaal.",
    sinceAnchor: (change) =>
      `${change} sinds het officiële ankerpunt, doorgerekend vanuit de twee nieuwste kwartalen.`,
    frozenEstimate:
      "De laatste officiële waarde blijft staan omdat dit land meer dan één kwartaal achterloopt op de hoofddataset.",
    fallbackSource:
      "Officiële Eurostat-schuldperioden ontbreken; de teller gebruikt de gedocumenteerde fallbackschatting.",
    continue: "Ga verder",
    exploreSignals: "Bekijk de vier kernsignalen",
    pageNav: "Op deze pagina",
    nav: {
      snapshot: "Kerncijfers",
      compare: "Vergelijken",
      movement: "Ontwikkeling",
      context: "EU-context",
      method: "Methode",
    },
    snapshotEyebrow: "01 — De kerncijfers",
    snapshotTitle: "Lees de schuldpositie in vier signalen.",
    snapshotIntro:
      "Het totaal toont de omvang. De schuldquote maakt landen vergelijkbaar. De kwartaalbeweging toont de richting. De rang geeft Europese context.",
    quarterlyMovement: "Kwartaalbeweging",
    modelledPace: "Gemodelleerd tempo",
    derivedPace: "Afgeleid uit de twee nieuwste officiële kwartalen",
    ranked: (rank, count) => `#${rank} van ${count}`,
    rankedDetail: "Gerangschikt op schuldquote, hoogste eerst",
    compareEyebrow: "Kies je volgende vergelijking",
    compareTitle: (name) => `Vergelijk ${name} met een andere economie.`,
    compareIntro:
      "Ga verder met een buurland, een andere schuldquote of het volledige EU-overzicht.",
    allCountries: (count) => `Alle ${count} landen`,
    exploreOverview: "Bekijk het EU-overzicht",
    compareAria: (name) => `Vergelijk ${name} met een ander land`,
    compareLinkAria: (current, other, ratio) =>
      `Vergelijk ${current} met ${other}: schuldquote ${ratio}`,
    difference: (value, direction, current) =>
      `${value} procentpunt ${direction} dan ${current}`,
    higher: "hoger",
    lower: "lager",
    advertisement: "Advertentie",
    recommendedAd: "Aanbevolen primaire positie",
    adPlaceholder: "Responsieve displayadvertentie",
    adDetail: "Na de belangrijkste data en interne vergelijkingen",
    movementEyebrow: "02 — Wat veranderde",
    movementTitle: "Het nieuwste officiële kwartaal veranderde de schuldstand.",
    movementIntro: (name, previous, latest) =>
      `De bruto overheidsschuld van ${name} ging tussen de twee nieuwste Eurostat-waarnemingen van ${previous} naar ${latest}.`,
    movementCallout:
      "Een stijgende schuld betekent niet automatisch dat de schuldenlast even snel steeg. Het bbp kan tegelijk groeien of krimpen — daarom verdient de schuldquote evenveel aandacht.",
    officialDebtStock: "Officiële schuldstand",
    rising: "Stijgend",
    falling: "Dalend",
    unchanged: "Onveranderd",
    quarterOnQuarter: "Kwartaal op kwartaal",
    contextEyebrow: "03 — Europese context",
    contextTitle: (name) => `Hoe ${name} zich binnen de EU verhoudt.`,
    euMedian: "Mediaan van EU-landen",
    reference: "60%-referentie",
    chartNote:
      "Selectie van EU-landen, geen volledige ranglijst. De 60%-lijn is de verdragsreferentie en geen simpele voldoende-onvoldoendetoets voor schuldhoudbaarheid.",
    methodEyebrow: "04 — Vertrouw het cijfer",
    methodTitle: "Officieel waar mogelijk. Gemodelleerd waar nodig.",
    methodSteps: [
      ["Anker", "Eurostat levert de officiële kwartaalschuld."],
      ["Meten", "De verandering tussen de twee nieuwste kwartalen wordt omgerekend naar een tempo per seconde."],
      ["Doortrekken", "De live teller trekt dat tempo door na de nieuwste officiële datum."],
    ],
    methodWarning:
      "De live teller is een schatting, geen nieuwe officiële waarneming en geen voorspelling.",
    readMethod: "Lees de volledige methodologie",
    openEurostat: "Open de Eurostat-metadata",
    sourcePeriods: "Officiële Eurostat-schuldperioden",
    sourceDates: "Kwartaaleindes",
    continueExploring: "Verder ontdekken",
    exploreMap: "Bekijk de EU-kaart",
    relatedReading: "Gerelateerde analyse en landencontext",
  },
  de: {
    previewLabel: "Länderprofil · isolierte Vorschau",
    viewCurrent: "Aktuelle Seite ansehen",
    eyebrow: (name) => `${name} · offizielle Finanzdaten`,
    lede:
      "Der neueste offizielle Schuldenstand, eine transparente Live-Schätzung und der europäische Kontext zur Einordnung.",
    verified: "Geprüfte Quelle",
    debtToGdp: "Schuldenquote",
    euPosition: "Position in der EU",
    officialPeriod: "Offizieller Zeitraum",
    liveMonitor: "Live-Schuldenuhr",
    officialValue: "Offizieller Wert zum Quartalsende",
    live: "Live",
    official: "Offiziell",
    modelledEstimate: "modellierte Schätzung",
    estimatedNow: "Schätzung heute",
    officialObservation:
      "Beobachteter Wert am Ende des jüngsten offiziellen Referenzquartals.",
    sinceAnchor: (change) =>
      `${change} seit dem offiziellen Ausgangswert, fortgeschrieben aus den zwei jüngsten Quartalen.`,
    frozenEstimate:
      "Der jüngste offizielle Wert bleibt unverändert, weil dieses Land mehr als ein Quartal hinter dem Hauptdatensatz liegt.",
    fallbackSource:
      "Offizielle Eurostat-Schuldenperioden fehlen; der Zähler nutzt die dokumentierte Ersatzschätzung.",
    continue: "Weiterlesen",
    exploreSignals: "Die vier Kennzahlen ansehen",
    pageNav: "Auf dieser Seite",
    nav: {
      snapshot: "Überblick",
      compare: "Vergleich",
      movement: "Entwicklung",
      context: "EU-Kontext",
      method: "Methode",
    },
    snapshotEyebrow: "01 — Der Überblick",
    snapshotTitle: "Vier Kennzahlen zeigen die Schuldenposition.",
    snapshotIntro:
      "Der Gesamtbetrag zeigt die Größenordnung. Die Quote macht Länder vergleichbar. Die Quartalsbewegung zeigt die Richtung. Der Rang liefert europäischen Kontext.",
    quarterlyMovement: "Quartalsbewegung",
    modelledPace: "Modelliertes Tempo",
    derivedPace: "Aus den zwei jüngsten offiziellen Quartalen abgeleitet",
    ranked: (rank, count) => `#${rank} von ${count}`,
    rankedDetail: "Nach Schuldenquote geordnet, höchste zuerst",
    compareEyebrow: "Nächsten Vergleich wählen",
    compareTitle: (name) => `${name} mit einer anderen Volkswirtschaft vergleichen.`,
    compareIntro:
      "Vergleichen Sie ein Nachbarland, eine andere Schuldenquote oder den vollständigen EU-Überblick.",
    allCountries: (count) => `Alle ${count} Länder`,
    exploreOverview: "EU-Überblick öffnen",
    compareAria: (name) => `${name} mit einem anderen Land vergleichen`,
    compareLinkAria: (current, other, ratio) =>
      `${current} mit ${other} vergleichen: Schuldenquote ${ratio}`,
    difference: (value, direction, current) =>
      `${value} Prozentpunkte ${direction} als ${current}`,
    higher: "höher",
    lower: "niedriger",
    advertisement: "Anzeige",
    recommendedAd: "Empfohlene Hauptposition",
    adPlaceholder: "Responsive Display-Anzeige",
    adDetail: "Nach den wichtigsten Daten und internen Vergleichen",
    movementEyebrow: "02 — Was sich verändert hat",
    movementTitle: "Das jüngste offizielle Quartal veränderte den Schuldenstand.",
    movementIntro: (name, previous, latest) =>
      `Die Bruttostaatsverschuldung von ${name} veränderte sich zwischen den zwei jüngsten Eurostat-Beobachtungen von ${previous} auf ${latest}`,
    movementCallout:
      "Ein steigender Schuldenstand bedeutet nicht automatisch, dass die Schuldenlast im gleichen Tempo zunahm. Das BIP kann gleichzeitig wachsen oder schrumpfen — deshalb ist die Quote ebenso wichtig.",
    officialDebtStock: "Offizieller Schuldenstand",
    rising: "Steigend",
    falling: "Fallend",
    unchanged: "Unverändert",
    quarterOnQuarter: "Gegenüber dem Vorquartal",
    contextEyebrow: "03 — Europäischer Kontext",
    contextTitle: (name) => `${name} im Vergleich innerhalb der EU.`,
    euMedian: "Median der EU-Länder",
    reference: "60-%-Referenz",
    chartNote:
      "Ausgewählte EU-Länder, keine vollständige Rangliste. Die 60-%-Linie ist der Referenzwert des Vertrags und kein einfacher Nachhaltigkeitstest.",
    methodEyebrow: "04 — Die Zahl verstehen",
    methodTitle: "Offiziell, wo möglich. Modelliert, wo nötig.",
    methodSteps: [
      ["Ausgangspunkt", "Eurostat liefert den offiziellen vierteljährlichen Schuldenstand."],
      ["Messung", "Die Veränderung zwischen den zwei jüngsten Quartalen wird in ein Tempo pro Sekunde umgerechnet."],
      ["Fortschreibung", "Die Live-Zahl schreibt dieses Tempo über das jüngste offizielle Datum hinaus fort."],
    ],
    methodWarning:
      "Die Live-Schuldenuhr ist eine Schätzung, keine neue offizielle Beobachtung und keine Prognose.",
    readMethod: "Vollständige Methodik lesen",
    openEurostat: "Eurostat-Metadaten öffnen",
    sourcePeriods: "Offizielle Eurostat-Schuldenperioden",
    sourceDates: "Quartalsenden",
    continueExploring: "Weiter erkunden",
    exploreMap: "EU-Karte öffnen",
    relatedReading: "Weiterführende Analyse und Länderkontext",
  },
  fr: {
    previewLabel: "Profil pays · aperçu isolé",
    viewCurrent: "Voir la page actuelle",
    eyebrow: (name) => `${name} · données officielles de finances publiques`,
    lede:
      "Le dernier niveau de dette officiel, une estimation en direct transparente et le contexte européen nécessaire pour les interpréter.",
    verified: "Source vérifiée",
    debtToGdp: "Ratio dette/PIB",
    euPosition: "Position dans l’UE",
    officialPeriod: "Période officielle",
    liveMonitor: "Compteur de dette en direct",
    officialValue: "Valeur officielle en fin de trimestre",
    live: "Direct",
    official: "Officiel",
    modelledEstimate: "estimation modélisée",
    estimatedNow: "Estimation actuelle",
    officialObservation:
      "Valeur observée à la fin du dernier trimestre de référence officiel.",
    sinceAnchor: (change) =>
      `${change} depuis le point officiel, prolongé à partir des deux derniers trimestres.`,
    frozenEstimate:
      "La dernière valeur officielle reste stable car ce pays a plus d’un trimestre de retard sur le jeu de données principal.",
    fallbackSource:
      "Les périodes officielles de dette Eurostat ne sont pas disponibles ; le compteur utilise l’estimation de secours documentée.",
    continue: "Poursuivre",
    exploreSignals: "Voir les quatre indicateurs",
    pageNav: "Sur cette page",
    nav: {
      snapshot: "Synthèse",
      compare: "Comparer",
      movement: "Évolution",
      context: "Contexte UE",
      method: "Méthode",
    },
    snapshotEyebrow: "01 — La synthèse",
    snapshotTitle: "Quatre indicateurs résument la position d’endettement.",
    snapshotIntro:
      "Le total montre l’ampleur. Le ratio permet de comparer les pays. L’évolution trimestrielle indique la direction. Le rang apporte le contexte européen.",
    quarterlyMovement: "Évolution trimestrielle",
    modelledPace: "Rythme modélisé",
    derivedPace: "Calculé à partir des deux derniers trimestres officiels",
    ranked: (rank, count) => `N° ${rank} sur ${count}`,
    rankedDetail: "Classement par ratio dette/PIB, du plus élevé au plus faible",
    compareEyebrow: "Choisir la prochaine comparaison",
    compareTitle: (name) => `Comparer ${name} à une autre économie.`,
    compareIntro:
      "Poursuivez avec un pays voisin, un autre ratio d’endettement ou la vue d’ensemble de l’UE.",
    allCountries: (count) => `Les ${count} pays`,
    exploreOverview: "Explorer la vue d’ensemble de l’UE",
    compareAria: (name) => `Comparer ${name} à un autre pays`,
    compareLinkAria: (current, other, ratio) =>
      `Comparer ${current} à ${other} : ratio dette/PIB ${ratio}`,
    difference: (value, direction, current) =>
      `${value} points de pourcentage ${direction} que ${current}`,
    higher: "plus élevé",
    lower: "plus faible",
    advertisement: "Publicité",
    recommendedAd: "Emplacement principal recommandé",
    adPlaceholder: "Annonce display responsive",
    adDetail: "Après les données principales et les comparaisons internes",
    movementEyebrow: "02 — Ce qui a changé",
    movementTitle: "Le dernier trimestre officiel a modifié le niveau de dette.",
    movementIntro: (name, previous, latest) =>
      `La dette publique brute de ${name} est passée de ${previous} à ${latest} entre les deux dernières observations d’Eurostat.`,
    movementCallout:
      "Une hausse de la dette totale ne signifie pas automatiquement que le poids de la dette a augmenté au même rythme. Le PIB peut croître ou diminuer simultanément — d’où l’importance du ratio.",
    officialDebtStock: "Niveau de dette officiel",
    rising: "En hausse",
    falling: "En baisse",
    unchanged: "Stable",
    quarterOnQuarter: "Variation trimestrielle",
    contextEyebrow: "03 — Contexte européen",
    contextTitle: (name) => `La position de ${name} au sein de l’UE.`,
    euMedian: "Médiane des pays de l’UE",
    reference: "Référence de 60 %",
    chartNote:
      "Sélection de pays de l’UE, et non classement complet. La ligne de 60 % est la valeur de référence du traité, pas un test binaire de soutenabilité.",
    methodEyebrow: "04 — Comprendre le chiffre",
    methodTitle: "Officiel lorsque possible. Modélisé lorsque nécessaire.",
    methodSteps: [
      ["Point d’ancrage", "Eurostat fournit le niveau de dette trimestriel officiel."],
      ["Mesure", "L’évolution entre les deux derniers trimestres est convertie en rythme par seconde."],
      ["Prolongement", "Le compteur prolonge ce rythme au-delà de la dernière date officielle."],
    ],
    methodWarning:
      "Le compteur en direct est une estimation, pas une nouvelle observation officielle ni une prévision.",
    readMethod: "Lire la méthodologie complète",
    openEurostat: "Ouvrir les métadonnées d’Eurostat",
    sourcePeriods: "Périodes officielles de dette Eurostat",
    sourceDates: "Fins de trimestre",
    continueExploring: "Poursuivre l’exploration",
    exploreMap: "Explorer la carte de l’UE",
    relatedReading: "Analyse associée et contexte national",
  },
};

export function getCountryCopy(lang) {
  return COPY[lang] || COPY.en;
}

export function localeFor(lang) {
  if (lang === "nl") return "nl-NL";
  if (lang === "de") return "de-DE";
  if (lang === "fr") return "fr-FR";
  return "en-GB";
}

export function localeBase(lang) {
  return lang && lang !== "en" ? `/${lang}` : "";
}
