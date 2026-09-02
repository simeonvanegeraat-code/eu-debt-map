import Link from "next/link";
import InArticleAd from "@/components/InArticleAd";
import ChartsClient from "@/app/eu-debt/ChartsClient";
import { countryName } from "@/lib/countries";
import { withLocale } from "@/lib/locale";
import {
  EUROSTAT_DEBT_HISTORY,
  EUROSTAT_DEBT_HISTORY_UPDATED_AT,
} from "@/lib/eurostat.debt.history.gen";

const SITE = "https://www.eudebtmap.com";

const LOCALE_META = {
  en: { intl: "en-GB", prefix: "" },
  nl: { intl: "nl-NL", prefix: "nl" },
  de: { intl: "de-DE", prefix: "de" },
  fr: { intl: "fr-FR", prefix: "fr" },
};

const TEXT = {
  en: {
    metaTitle: "EU Debt in 2026: 5-Year Chart and Debt by Country | EU Debt Map",
    headline: "EU debt in 2026: 5-year chart and debt by country",
    description:
      "See total EU debt in 2026, how it has changed over the last 5 years, and which countries carry the biggest share. Includes a 5-year chart and country breakdown based on Eurostat data.",
    eyebrow: "EU Debt",
    standfirstBefore: "EU debt now stands above",
    standfirstAfter:
      "when you add together the public debt of all 27 EU countries. This page shows how that total has changed over the last five years, which countries account for the biggest share, and why the debt burden is far from evenly spread across Europe.",
    latestQuarter: "Latest quarter",
    updated: "Updated",
    source: "Source: Eurostat quarterly government debt",
    cards: {
      total: "Latest EU-27 debt sum",
      change: "5-year change",
      growth: "Growth since first quarter in chart",
    },
    p1:
      "The chart above adds together the national government debt of all 27 EU member states quarter by quarter over the last five years. It follows the same basic idea as the live total on the homepage, but here the point is historical context rather than a running estimate.",
    p2Before: "That matters because the phrase",
    p2Strong: "EU debt",
    p2After:
      "sounds simple, but it can mean different things. It can refer to the official Eurostat EU aggregate. It can also mean the combined debt of all EU countries added together. Those two are closely related, but they are not always identical in every quarter.",
    distributionTitle: "The total is huge, but the distribution matters more",
    distributionP1Before: "The latest quarter in this chart comes in at roughly",
    distributionP1After:
      "That is the combined debt pile across the EU-27. But Europe does not borrow like a single state. The total sits across many borrowers, with different fiscal positions, political constraints and refinancing risks.",
    sharesBefore:
      "In the latest quarter, the biggest shares in this summed EU debt pile sit with",
    sharesAfter:
      "That is why a country breakdown matters just as much as the total line.",
    deeperBefore: "If you want to go deeper, compare the country pages side by side. Start with",
    deeperAfter:
      "The aggregate tells you how large the debt pile is. The country pages tell you where the burden actually sits.",
    and: "and",
    scopeTitle: "What this page shows, and what it does not",
    scopeP1:
      "This page sums national debt values quarter by quarter across the EU-27. That is useful for showing scale and long-term direction. It is also easier to understand than a table full of separate country entries.",
    scopeP2:
      "But it should not be confused with a single sovereign borrower. Europe is not one treasury. So the chart is best used as a map of scale, not as proof that all fiscal risk in Europe is evenly shared.",
    whyTitle: "Why the line still matters in 2026",
    whyP1:
      "A debt line that keeps rising does not automatically mean a crisis is close. But it does mean the amount that has to be managed, refinanced and defended politically keeps growing. That is why nominal debt still matters, even when debt-to-GDP ratios sometimes look calmer than the raw totals.",
    whyP2:
      "Over the last five years, the summed EU debt line has moved steadily higher. That does not tell you everything, but it does tell you one important thing: Europe is still carrying a very large public debt pile, and it is not evenly distributed.",
    finalBeforeLive: "For the live running estimate, go back to the",
    finalLive: "EU overview",
    finalBeforeRatio: "For relative burden, open the",
    finalRatio: "debt-to-GDP overview",
    finalAfter:
      "And for country-level detail, dive into the individual country pages.",
    note:
      "Method note: this page adds together the quarterly national debt values of all EU-27 member states using Eurostat’s quarterly government debt dataset. It is designed to show scale and distribution clearly. It is not a substitute for the official EU aggregate in every analytical context.",
  },
  nl: {
    metaTitle: "EU-schuld in 2026: 5-jaarsgrafiek en schuld per land | EU Debt Map",
    headline: "EU-schuld in 2026: 5-jaarsgrafiek en schuld per land",
    description:
      "Bekijk de totale EU-schuld in 2026, de ontwikkeling over de afgelopen vijf jaar en welke landen het grootste aandeel hebben. Met 5-jaarsgrafiek en landenverdeling op basis van Eurostat-data.",
    eyebrow: "EU-schuld",
    standfirstBefore: "De totale EU-schuld ligt nu boven",
    standfirstAfter:
      "wanneer je de overheidsschuld van alle 27 EU-landen bij elkaar optelt. Deze pagina laat zien hoe dat totaal de afgelopen vijf jaar is veranderd, welke landen het grootste aandeel hebben en waarom de schuldenlast ongelijk over Europa is verdeeld.",
    latestQuarter: "Laatste kwartaal",
    updated: "Bijgewerkt",
    source: "Bron: driemaandelijkse overheidsschuld van Eurostat",
    cards: {
      total: "Laatste totale schuld EU-27",
      change: "Verandering in 5 jaar",
      growth: "Groei sinds het eerste kwartaal in de grafiek",
    },
    p1:
      "De grafiek hierboven telt de nationale overheidsschuld van alle 27 EU-lidstaten per kwartaal bij elkaar op over de afgelopen vijf jaar. Het uitgangspunt is hetzelfde als bij de live teller op de homepage, maar hier draait het om historische context in plaats van een doorlopende schatting.",
    p2Before: "Dat is belangrijk, omdat de term",
    p2Strong: "EU-schuld",
    p2After:
      "eenvoudig klinkt, maar verschillende betekenissen kan hebben. De term kan verwijzen naar het officiële EU-totaal van Eurostat, maar ook naar de opgetelde schuld van alle afzonderlijke EU-landen. Die cijfers liggen dicht bij elkaar, maar zijn niet in elk kwartaal volledig gelijk.",
    distributionTitle: "Het totaal is enorm, maar de verdeling is belangrijker",
    distributionP1Before: "Het laatste kwartaal in deze grafiek komt uit op ongeveer",
    distributionP1After:
      "Dat is de gezamenlijke schuld van de EU-27. Europa leent echter niet als één staat. Het totaal is verdeeld over verschillende overheden, ieder met een eigen begrotingspositie, politieke beperkingen en herfinancieringsrisico’s.",
    sharesBefore:
      "In het laatste kwartaal liggen de grootste aandelen in deze opgetelde EU-schuld bij",
    sharesAfter:
      "Daarom is de verdeling per land minstens zo belangrijk als de totale lijn.",
    deeperBefore: "Vergelijk voor meer detail de landenpagina’s naast elkaar. Begin met",
    deeperAfter:
      "Het EU-totaal laat zien hoe groot de schuld is. De landenpagina’s laten zien waar die schuld daadwerkelijk zit.",
    and: "en",
    scopeTitle: "Wat deze pagina wel en niet laat zien",
    scopeP1:
      "Deze pagina telt de nationale schuldcijfers van de EU-27 per kwartaal bij elkaar op. Dat is nuttig om de omvang en de langetermijnrichting te tonen. Het is ook eenvoudiger te begrijpen dan een tabel met 27 losse landen.",
    scopeP2:
      "Het totaal moet niet worden gezien als de schuld van één gezamenlijke overheid. Europa heeft geen enkele schatkist die voor alle schuld verantwoordelijk is. Gebruik de grafiek daarom vooral om de schaal te begrijpen, niet als bewijs dat alle begrotingsrisico’s gelijk worden gedeeld.",
    whyTitle: "Waarom deze lijn in 2026 nog steeds belangrijk is",
    whyP1:
      "Een stijgende schuldlijn betekent niet automatisch dat een crisis dichtbij is. Het betekent wel dat steeds meer schuld moet worden beheerd, geherfinancierd en politiek verantwoord. Daarom blijft de nominale schuld relevant, ook wanneer schuld-bbp-ratio’s soms rustiger ogen dan de absolute bedragen.",
    whyP2:
      "In de afgelopen vijf jaar is de opgetelde EU-schuld geleidelijk verder gestegen. Dat vertelt niet het hele verhaal, maar wel iets belangrijks: Europa draagt nog altijd een zeer grote overheidsschuld en die is niet gelijk over de lidstaten verdeeld.",
    finalBeforeLive: "Ga voor de live schatting terug naar het",
    finalLive: "EU-overzicht",
    finalBeforeRatio: "Bekijk voor de relatieve schuldenlast het",
    finalRatio: "schuld-bbp-overzicht",
    finalAfter:
      "Open voor details per land de afzonderlijke landenpagina’s.",
    note:
      "Methodetoelichting: deze pagina telt de driemaandelijkse nationale schuldcijfers van alle EU-27-lidstaten op met de dataset voor driemaandelijkse overheidsschuld van Eurostat. De pagina is bedoeld om omvang en verdeling duidelijk te tonen en vervangt niet in iedere analyse het officiële EU-totaal.",
  },
  de: {
    metaTitle: "EU-Schulden 2026: 5-Jahres-Chart und Schulden nach Land | EU Debt Map",
    headline: "EU-Schulden 2026: 5-Jahres-Chart und Schulden nach Land",
    description:
      "Sehen Sie die gesamten EU-Schulden 2026, ihre Entwicklung in den vergangenen fünf Jahren und die Länder mit den größten Anteilen. Mit 5-Jahres-Chart und Ländervergleich auf Basis von Eurostat-Daten.",
    eyebrow: "EU-Schulden",
    standfirstBefore: "Die gesamten EU-Schulden liegen inzwischen über",
    standfirstAfter:
      "wenn man die Staatsschulden aller 27 EU-Länder addiert. Diese Seite zeigt, wie sich die Summe in den vergangenen fünf Jahren verändert hat, welche Länder den größten Anteil tragen und warum die Schuldenlast in Europa sehr ungleich verteilt ist.",
    latestQuarter: "Letztes Quartal",
    updated: "Aktualisiert",
    source: "Quelle: vierteljährliche Staatsschulden von Eurostat",
    cards: {
      total: "Neueste Schuldsumme der EU-27",
      change: "Veränderung in 5 Jahren",
      growth: "Wachstum seit dem ersten Quartal im Chart",
    },
    p1:
      "Der Chart oben addiert die nationalen Staatsschulden aller 27 EU-Mitgliedstaaten für jedes Quartal der vergangenen fünf Jahre. Die Grundidee entspricht der Live-Summe auf der Startseite, hier geht es jedoch um den historischen Verlauf statt um eine laufende Schätzung.",
    p2Before: "Das ist wichtig, weil der Begriff",
    p2Strong: "EU-Schulden",
    p2After:
      "einfach klingt, aber unterschiedliche Bedeutungen haben kann. Er kann sich auf das offizielle EU-Aggregat von Eurostat beziehen oder auf die addierten Schulden aller einzelnen EU-Länder. Beide Werte hängen eng zusammen, sind aber nicht in jedem Quartal vollständig identisch.",
    distributionTitle: "Die Gesamtsumme ist riesig, doch die Verteilung ist wichtiger",
    distributionP1Before: "Das letzte Quartal in diesem Chart liegt bei ungefähr",
    distributionP1After:
      "Das ist die gemeinsame Schuldsumme der EU-27. Europa nimmt jedoch nicht wie ein einzelner Staat Kredite auf. Die Summe verteilt sich auf viele Schuldner mit unterschiedlichen Haushaltslagen, politischen Einschränkungen und Refinanzierungsrisiken.",
    sharesBefore:
      "Im letzten Quartal entfallen die größten Anteile dieser addierten EU-Schulden auf",
    sharesAfter:
      "Darum ist die Aufteilung nach Ländern ebenso wichtig wie die Gesamtkurve.",
    deeperBefore: "Für mehr Details können Sie die Länderseiten direkt vergleichen. Beginnen Sie mit",
    deeperAfter:
      "Die Gesamtsumme zeigt die Größenordnung. Die Länderseiten zeigen, wo die Schulden tatsächlich liegen.",
    and: "und",
    scopeTitle: "Was diese Seite zeigt und was nicht",
    scopeP1:
      "Diese Seite addiert die nationalen Schuldenwerte der EU-27 Quartal für Quartal. Das zeigt Größenordnung und langfristige Richtung und ist leichter verständlich als eine Tabelle mit 27 einzelnen Ländern.",
    scopeP2:
      "Die Summe darf jedoch nicht mit den Schulden eines einzigen staatlichen Kreditnehmers verwechselt werden. Europa hat keine gemeinsame Staatskasse für diese gesamte Summe. Der Chart zeigt daher vor allem die Größenordnung und nicht, dass alle Haushaltsrisiken gleichmäßig geteilt werden.",
    whyTitle: "Warum die Kurve auch 2026 wichtig bleibt",
    whyP1:
      "Eine steigende Schuldenkurve bedeutet nicht automatisch, dass eine Krise unmittelbar bevorsteht. Sie bedeutet jedoch, dass ein wachsender Betrag verwaltet, refinanziert und politisch begründet werden muss. Deshalb bleiben nominale Schulden wichtig, auch wenn Schuldenquoten manchmal ruhiger wirken als die absoluten Summen.",
    whyP2:
      "In den vergangenen fünf Jahren ist die addierte EU-Schuldenkurve stetig gestiegen. Das erklärt nicht alles, zeigt aber einen wichtigen Punkt: Europa trägt weiterhin eine sehr große öffentliche Schuldenlast, die ungleich verteilt ist.",
    finalBeforeLive: "Zur laufenden Live-Schätzung geht es zurück zur",
    finalLive: "EU-Übersicht",
    finalBeforeRatio: "Für die relative Belastung öffnen Sie die",
    finalRatio: "Schuldenquote-Übersicht",
    finalAfter:
      "Für Details zu einzelnen Ländern öffnen Sie die jeweiligen Länderseiten.",
    note:
      "Methodischer Hinweis: Diese Seite addiert die vierteljährlichen nationalen Schuldenwerte aller EU-27-Mitgliedstaaten anhand des Eurostat-Datensatzes zur vierteljährlichen Staatsverschuldung. Sie zeigt Größenordnung und Verteilung, ersetzt aber nicht in jedem analytischen Zusammenhang das offizielle EU-Aggregat.",
  },
  fr: {
    metaTitle: "Dette de l’UE en 2026 : graphique sur 5 ans et dette par pays | EU Debt Map",
    headline: "Dette de l’UE en 2026 : graphique sur 5 ans et dette par pays",
    description:
      "Consultez la dette totale de l’UE en 2026, son évolution sur cinq ans et les pays qui en représentent la plus grande part. Graphique sur 5 ans et répartition par pays à partir des données d’Eurostat.",
    eyebrow: "Dette de l’UE",
    standfirstBefore: "La dette totale de l’UE dépasse désormais",
    standfirstAfter:
      "lorsque l’on additionne la dette publique des 27 pays de l’Union. Cette page montre l’évolution de ce total sur cinq ans, les pays qui en représentent la plus grande part et la forte inégalité de sa répartition en Europe.",
    latestQuarter: "Dernier trimestre",
    updated: "Mis à jour",
    source: "Source : dette publique trimestrielle d’Eurostat",
    cards: {
      total: "Dernière dette totale de l’UE-27",
      change: "Évolution sur 5 ans",
      growth: "Croissance depuis le premier trimestre du graphique",
    },
    p1:
      "Le graphique ci-dessus additionne, trimestre par trimestre, la dette publique nationale des 27 États membres de l’UE sur les cinq dernières années. Le principe est le même que pour le total en direct de la page d’accueil, mais l’objectif est ici de fournir un contexte historique plutôt qu’une estimation continue.",
    p2Before: "Cette distinction est importante, car l’expression",
    p2Strong: "dette de l’UE",
    p2After:
      "semble simple mais peut désigner plusieurs choses. Elle peut faire référence à l’agrégat officiel de l’Union publié par Eurostat ou à la somme des dettes de tous les pays membres. Ces deux mesures sont étroitement liées, sans être toujours parfaitement identiques chaque trimestre.",
    distributionTitle: "Le total est immense, mais sa répartition compte davantage",
    distributionP1Before: "Le dernier trimestre du graphique atteint environ",
    distributionP1After:
      "Il s’agit de la dette cumulée de l’UE-27. L’Europe n’emprunte toutefois pas comme un État unique. Le total est réparti entre plusieurs emprunteurs, avec des situations budgétaires, des contraintes politiques et des risques de refinancement différents.",
    sharesBefore:
      "Au dernier trimestre, les plus grandes parts de cette dette cumulée reviennent à",
    sharesAfter:
      "La répartition par pays est donc aussi importante que la courbe totale.",
    deeperBefore: "Pour aller plus loin, comparez les pages nationales. Commencez par",
    deeperAfter:
      "Le total européen montre l’ampleur de la dette. Les pages nationales indiquent où elle se situe réellement.",
    and: "et",
    scopeTitle: "Ce que montre cette page, et ce qu’elle ne montre pas",
    scopeP1:
      "Cette page additionne les dettes nationales de l’UE-27 trimestre par trimestre. Cette approche permet de comprendre l’échelle et la tendance de long terme, plus facilement qu’avec un tableau composé de 27 lignes distinctes.",
    scopeP2:
      "Ce total ne doit cependant pas être confondu avec la dette d’un emprunteur souverain unique. L’Europe ne dispose pas d’un seul Trésor responsable de l’ensemble de cette somme. Le graphique sert donc surtout à mesurer l’échelle, et non à prouver que tous les risques budgétaires sont partagés de manière égale.",
    whyTitle: "Pourquoi cette courbe reste importante en 2026",
    whyP1:
      "Une dette qui augmente ne signifie pas automatiquement qu’une crise est imminente. Elle indique toutefois qu’un montant croissant doit être géré, refinancé et défendu politiquement. La dette nominale reste donc pertinente, même lorsque les ratios dette-PIB semblent parfois plus stables que les montants bruts.",
    whyP2:
      "Sur les cinq dernières années, la dette cumulée de l’UE a progressé de manière régulière. Cela ne dit pas tout, mais souligne un point essentiel : l’Europe porte encore une dette publique très importante, répartie de façon inégale.",
    finalBeforeLive: "Pour l’estimation en direct, revenez à la",
    finalLive: "vue d’ensemble de l’UE",
    finalBeforeRatio: "Pour comparer le poids relatif de la dette, consultez la",
    finalRatio: "vue dette-PIB",
    finalAfter:
      "Pour les détails nationaux, ouvrez les pages consacrées à chaque pays.",
    note:
      "Note méthodologique : cette page additionne les valeurs trimestrielles de dette nationale des 27 États membres à partir du jeu de données d’Eurostat sur la dette publique trimestrielle. Elle vise à présenter clairement l’échelle et la répartition, sans remplacer l’agrégat officiel de l’UE dans tous les contextes d’analyse.",
  },
};

const latestQuarter = EUROSTAT_DEBT_HISTORY?.latestQuarter || null;
const latestTotal = Number(EUROSTAT_DEBT_HISTORY?.latestTotalDebtEUR || 0);
const quarters = Array.isArray(EUROSTAT_DEBT_HISTORY?.quarters)
  ? EUROSTAT_DEBT_HISTORY.quarters
  : [];
const earliest = quarters[0] || null;
const latest = quarters[quarters.length - 1] || null;
const absoluteChange =
  earliest && latest ? Number(latest.totalDebtEUR) - Number(earliest.totalDebtEUR) : 0;
const pctChange =
  earliest && earliest.totalDebtEUR > 0
    ? (absoluteChange / Number(earliest.totalDebtEUR)) * 100
    : null;
const historyRows = quarters.map((q) => ({
  quarter: q.quarter,
  totalDebtEUR: q.totalDebtEUR,
}));

function safeLang(lang) {
  return TEXT[lang] ? lang : "en";
}

function routeFor(lang, path) {
  const safe = safeLang(lang);
  return withLocale(path, LOCALE_META[safe].prefix);
}

function absoluteRouteFor(lang, path) {
  return `${SITE}${routeFor(lang, path)}`;
}

function formatTrillions(value, lang) {
  const safe = safeLang(lang);
  const units = { en: "tn", nl: "bln", de: "Bio.", fr: "Bn" };
  const formatted = new Intl.NumberFormat(LOCALE_META[safe].intl, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 1e12);
  return `€${formatted} ${units[safe]}`;
}

function formatBillions(value, lang) {
  const safe = safeLang(lang);
  const units = { en: "bn", nl: "mld", de: "Mrd.", fr: "Md" };
  const formatted = new Intl.NumberFormat(LOCALE_META[safe].intl, {
    maximumFractionDigits: 0,
  }).format(value / 1e9);
  return `€${formatted} ${units[safe]}`;
}

function formatDate(value, lang) {
  if (!value) return null;
  return new Intl.DateTimeFormat(LOCALE_META[safeLang(lang)].intl, {
    dateStyle: "long",
  }).format(new Date(value));
}

function languageAlternates() {
  return {
    "x-default": `${SITE}/eu-debt`,
    en: `${SITE}/eu-debt`,
    nl: `${SITE}/nl/eu-debt`,
    de: `${SITE}/de/eu-debt`,
    fr: `${SITE}/fr/eu-debt`,
  };
}

export function generateEUDebtMetadata(lang = "en") {
  const safe = safeLang(lang);
  const t = TEXT[safe];
  const url = absoluteRouteFor(safe, "/eu-debt");

  return {
    title: t.metaTitle,
    description: t.description,
    alternates: {
      canonical: url,
      languages: languageAlternates(),
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    openGraph: {
      title: t.headline,
      description: t.description,
      url,
      siteName: "EU Debt Map",
      type: "article",
      locale: LOCALE_META[safe].intl.replace("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title: t.headline,
      description: t.description,
    },
  };
}

function CountryLinks({ lang, codes }) {
  const t = TEXT[safeLang(lang)];

  return codes.map((code, index) => {
    const isLast = index === codes.length - 1;
    const isBeforeLast = index === codes.length - 2;
    let separator = ", ";
    if (isLast) separator = "";
    else if (isBeforeLast) separator = ` ${t.and} `;

    return (
      <span key={code}>
        <Link href={routeFor(lang, `/country/${code.toLowerCase()}`)}>
          {countryName(code, safeLang(lang))}
        </Link>
        {separator}
      </span>
    );
  });
}

export default function LocalizedEUDebtPage({ lang = "en" }) {
  const safe = safeLang(lang);
  const t = TEXT[safe];
  const breakdownRows = (EUROSTAT_DEBT_HISTORY?.latestBreakdown || [])
    .slice(0, 10)
    .map((row) => ({
      ...row,
      name: countryName(row.code, safe),
      href: routeFor(safe, `/country/${row.code.toLowerCase()}`),
      shareLabel: `${row.sharePct.toFixed(1)}%`,
    }));
  const top4 = breakdownRows.slice(0, 4);
  const top4Labels = top4.map((row) => `${row.name} (${row.shareLabel})`);
  const formattedTop4 = new Intl.ListFormat(LOCALE_META[safe].intl, {
    style: "long",
    type: "conjunction",
  }).format(top4Labels);
  const url = absoluteRouteFor(safe, "/eu-debt");

  const css = `
    .page { max-width: 980px; margin: 0 auto; padding: 0 16px 64px; }
    .article { max-width: 760px; margin: 0 auto; }
    .eyebrow { margin-top: 20px; color: #2563eb; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; font-family: var(--font-display, sans-serif); }
    .title { margin: 10px 0 14px; line-height: 1.05; font-weight: 800; font-size: clamp(2.2rem, 1.7rem + 2.8vw, 4rem); letter-spacing: -0.03em; color: #111827; font-family: var(--font-display, sans-serif); }
    .standfirst { font-size: 1.2rem; line-height: 1.65; color: #4b5563; margin: 0 0 24px; max-width: 760px; font-family: Georgia, Cambria, "Times New Roman", Times, serif; }
    .meta { display: flex; flex-wrap: wrap; gap: 14px; color: #6b7280; font-size: 0.9rem; margin-bottom: 28px; }
    .highlightGrid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin: 0 0 34px; }
    .card { border: 1px solid #e5e7eb; border-radius: 16px; padding: 18px; background: #ffffff; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04); }
    .cardLabel { color: #6b7280; font-size: 0.85rem; margin-bottom: 8px; font-weight: 600; font-family: var(--font-display, sans-serif); }
    .cardValue { color: #111827; font-size: clamp(1.3rem, 1.1rem + 1vw, 2rem); font-weight: 800; letter-spacing: -0.02em; font-family: var(--font-display, sans-serif); }
    .prose { font-family: Georgia, Cambria, "Times New Roman", Times, serif; font-size: 1.125rem; line-height: 1.85; color: #1f2937; }
    .prose p { margin-bottom: 1.45rem; }
    .prose h2 { font-family: var(--font-display, sans-serif); font-size: 1.8rem; line-height: 1.25; margin: 2.6rem 0 1rem; color: #111827; letter-spacing: -0.02em; }
    .prose a { color: #2563eb; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
    .prose a:hover { color: #1d4ed8; }
    .countryList { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 18px; margin: 18px 0 10px; padding: 0; list-style: none; }
    .countryList li { margin: 0; padding: 0; font-family: var(--font-display, sans-serif); font-size: 0.98rem; }
    .note { color: #6b7280; font-size: 0.92rem; line-height: 1.6; margin-top: 16px; }
    @media (max-width: 760px) { .highlightGrid { grid-template-columns: 1fr; } .countryList { grid-template-columns: 1fr; } }
  `;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t.headline,
    description: t.description,
    inLanguage: safe,
    datePublished: EUROSTAT_DEBT_HISTORY_UPDATED_AT || new Date().toISOString(),
    dateModified: EUROSTAT_DEBT_HISTORY_UPDATED_AT || new Date().toISOString(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "EU Debt Map" },
    publisher: {
      "@type": "Organization",
      name: "EU Debt Map",
      logo: { "@type": "ImageObject", url: `${SITE}/eu_favicon_512.png` },
    },
  };

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{css}</style>

      <article className="article">
        <div className="eyebrow">{t.eyebrow}</div>
        <h1 className="title">{t.headline}</h1>

        <p className="standfirst">
          {t.standfirstBefore} {formatTrillions(latestTotal, safe)} {t.standfirstAfter}
        </p>

        <div className="meta">
          <span>{t.latestQuarter}: {latestQuarter || "n/a"}</span>
          <span>{t.updated}: {formatDate(EUROSTAT_DEBT_HISTORY_UPDATED_AT, safe) || "n/a"}</span>
          <span>{t.source}</span>
        </div>

        <section className="highlightGrid">
          <div className="card">
            <div className="cardLabel">{t.cards.total}</div>
            <div className="cardValue">{formatTrillions(latestTotal, safe)}</div>
          </div>
          <div className="card">
            <div className="cardLabel">{t.cards.change}</div>
            <div className="cardValue">{formatTrillions(absoluteChange, safe)}</div>
          </div>
          <div className="card">
            <div className="cardLabel">{t.cards.growth}</div>
            <div className="cardValue">
              {pctChange == null ? "n/a" : `${pctChange.toFixed(1)}%`}
            </div>
          </div>
        </section>

        <ChartsClient historyRows={historyRows} breakdownRows={breakdownRows} lang={safe} />

        <div className="prose">
          <p>{t.p1}</p>
          <p>
            {t.p2Before} <strong>{t.p2Strong}</strong> {t.p2After}
          </p>

          <h2>{t.distributionTitle}</h2>
          <p>
            {t.distributionP1Before} {formatTrillions(latestTotal, safe)}. {t.distributionP1After}
          </p>
          <p>
            {t.sharesBefore} {formattedTop4}. {t.sharesAfter}
          </p>

          <ul className="countryList">
            {top4.map((row) => (
              <li key={row.code}>
                <Link href={row.href}>{row.name}</Link> — {formatBillions(row.valueEUR, safe)} ({row.shareLabel})
              </li>
            ))}
          </ul>

          <p>
            {t.deeperBefore} <CountryLinks lang={safe} codes={["FR", "IT", "DE", "ES"]} />. {t.deeperAfter}
          </p>

          <h2>{t.scopeTitle}</h2>
          <p>{t.scopeP1}</p>
          <p>{t.scopeP2}</p>

          <InArticleAd />

          <h2>{t.whyTitle}</h2>
          <p>{t.whyP1}</p>
          <p>{t.whyP2}</p>

          <p>
            {t.finalBeforeLive} <Link href={routeFor(safe, "/")}>{t.finalLive}</Link>. {t.finalBeforeRatio} <Link href={routeFor(safe, "/debt-to-gdp")}>{t.finalRatio}</Link>. {t.finalAfter}
          </p>

          <p className="note">{t.note}</p>
        </div>
      </article>
    </div>
  );
}
