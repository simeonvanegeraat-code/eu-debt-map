import Link from "next/link";
import dynamic from "next/dynamic";
import QuickList from "@/components/QuickList";
import ArticleCard from "@/components/ArticleCard";
import EUTotalTicker from "@/components/EUTotalTicker";
import { listArticles } from "@/lib/articles";
import { countries, trendFor, livePerSecondFor } from "@/lib/data";
import { countryName } from "@/lib/countries";

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

const TEXT = {
  en: {
    locale: "en-GB",
    basePath: "",
    title: "EU Debt Map | Live Government Debt by Country (EU-27, 2025)",
    description:
      "Track EU government debt live, country by country. Interactive EU-27 debt map with live estimates, debt growth, and country comparisons based on Eurostat data.",
    heroTitle: ["Live EU", "Government", "Debt Map"],
    lede:
      "Add together the public debt of all 27 EU countries and you get the figure below: a live estimate that keeps moving every second.",
    intro:
      "EU Debt Map turns Eurostat debt data into a simple way to explore government debt across the European Union. Use the interactive map to compare countries such as France, Germany, Italy, Spain, and the Netherlands. Then open any country page for a live debt ticker, recent trend, and debt-to-GDP context.",
    facts: ["🇪🇺 EU-27 coverage", "🧾 Based on Eurostat data", "📈 Live estimated ticker"],
    primaryCta: "View EU debt trends →",
    secondaryCta: "Read the debt explainer →",
    source:
      "Source: Eurostat. Live values are estimated from the latest quarterly data and are shown for educational purposes, not as official real-time statistics.",
    totalTickerLabel: "EU-27 total government debt (live estimate)",
    totalTickerAria: "EU-27 total government debt live estimate",
    largestDebt: "Largest debt",
    largestDebtDescription: "Open the country page for the largest debt stock in the EU.",
    fastestGrowing: "Fastest growing",
    fastestGrowingDescription: "Open the country page with the strongest recent absolute increase.",
    liveEstimate: "live estimate",
    noData: "No data available.",
    overviewTitle: "EU overview",
    overviewText:
      "The map shows whether government debt has risen or fallen between the latest two reference points. Open any country to see its live debt estimate, recent movement, and country context.",
    legendAria: "Map legend",
    fallingDebt: "Falling debt",
    risingDebt: "Rising debt",
    falling: "falling",
    rising: "rising",
    mapAria: "Interactive EU map",
    mapMainAction: "Click any country on the map to open its live debt ticker.",
    fiveYearChart: "5-year EU debt chart",
    debtExplainer: "What government debt means",
    snapshotTitle: "EU debt snapshot",
    snapshotText:
      "A quick reading of the latest movement across the EU-27. This avoids repeating the same largest-debt cards from the hero.",
    countriesRising: "Countries rising",
    countriesRisingNote: "Debt increased between the latest two reference points.",
    countriesFalling: "Countries falling",
    countriesFallingNote: "Debt decreased between the latest two reference points.",
    euMovement: "EU movement",
    euMovementNote: "Estimated combined movement per second.",
    latestPeriod: "Latest reference period",
    flatCountries: (count) => `${count} countries are currently flat in this dataset.`,
    whyTitle: "Why EU government debt matters",
    insight1Title: "Borrowing costs",
    insight1Text: "Higher debt can make countries more exposed when interest rates rise.",
    insight2Title: "Fiscal flexibility",
    insight2Text: "Debt levels shape how much room governments have for spending and crisis response.",
    insight3Title: "EU comparison",
    insight3Text: "The map makes it easier to compare very different fiscal positions inside one bloc.",
    faqTitle: "FAQ: EU government debt",
    faq1Q: "How is the live estimate calculated?",
    faq1A:
      "We use the latest Eurostat reference values and estimate the movement per second from the recent change between official data points.",
    faq2Q: "Is this an official real-time statistic?",
    faq2A:
      "No. The underlying data comes from official Eurostat releases, but the live counter is an educational estimate.",
    faq3Q: "What is the difference between debt and deficit?",
    faq3A:
      "Debt is the accumulated stock of what a government owes. A deficit is the yearly gap between government spending and revenue.",
    quickTitle: "Quick list",
    showAll: "Show all",
    showLess: "Show less",
    quickRising: "↑ rising",
    quickFalling: "↓ falling",
    quickFlat: "→ flat",
    more: "more",
    latestArticles: "Latest articles",
    viewAll: "View all →",
    noArticles: "No articles yet. More coming soon.",
    articlesHref: "/articles",
    debtHref: "/debt",
  },

  nl: {
    locale: "nl-NL",
    basePath: "/nl",
    title: "EU Schuldenkaart | Live staatsschuld per land (EU-27, 2025)",
    description:
      "Bekijk de overheidsschuld van de EU live, land per land. Interactieve EU-27 kaart met live schattingen, schuldgroei en vergelijkingen op basis van Eurostat-data.",
    heroTitle: ["Live EU", "Staatsschuld", "Kaart"],
    lede:
      "Tel de overheidsschuld van alle 27 EU-landen bij elkaar op en je krijgt het onderstaande bedrag: een live schatting die elke seconde beweegt.",
    intro:
      "EU Debt Map zet Eurostat-schulddata om in een eenvoudige manier om overheidsschuld in de Europese Unie te bekijken. Gebruik de interactieve kaart om landen zoals Frankrijk, Duitsland, Italië, Spanje en Nederland te vergelijken. Open daarna een landenpagina voor een live schuldteller, recente trend en schuld-bbp context.",
    facts: ["🇪🇺 EU-27 dekking", "🧾 Gebaseerd op Eurostat-data", "📈 Live geschatte teller"],
    primaryCta: "Bekijk EU-schuldtrends →",
    secondaryCta: "Lees de schulduitleg →",
    source:
      "Bron: Eurostat. Live waarden zijn schattingen op basis van de laatste kwartaaldata en worden getoond voor educatieve doeleinden, niet als officiële realtime statistiek.",
    totalTickerLabel: "Totale overheidsschuld EU-27 (live schatting)",
    totalTickerAria: "Totale overheidsschuld EU-27 live schatting",
    largestDebt: "Grootste schuld",
    largestDebtDescription: "Open de landenpagina met de grootste totale schuldpositie in de EU.",
    fastestGrowing: "Snelst groeiend",
    fastestGrowingDescription: "Open de landenpagina met de sterkste recente absolute stijging.",
    liveEstimate: "live schatting",
    noData: "Geen data beschikbaar.",
    overviewTitle: "EU-overzicht",
    overviewText:
      "De kaart laat zien of de overheidsschuld is gestegen of gedaald tussen de laatste twee referentiepunten. Open een land om de live schuldschatting, recente beweging en landencontext te bekijken.",
    legendAria: "Kaartlegenda",
    fallingDebt: "Dalende schuld",
    risingDebt: "Stijgende schuld",
    falling: "dalend",
    rising: "stijgend",
    mapAria: "Interactieve EU-kaart",
    mapMainAction: "Klik op een land op de kaart om de live schuldteller te openen.",
    fiveYearChart: "5-jaars EU-schuldgrafiek",
    debtExplainer: "Wat overheidsschuld betekent",
    snapshotTitle: "EU-schuldsnapshot",
    snapshotText:
      "Een snelle lezing van de laatste beweging binnen de EU-27. Zo herhalen we niet dezelfde grootste-schuld kaarten uit de hero.",
    countriesRising: "Landen stijgend",
    countriesRisingNote: "De schuld steeg tussen de laatste twee referentiepunten.",
    countriesFalling: "Landen dalend",
    countriesFallingNote: "De schuld daalde tussen de laatste twee referentiepunten.",
    euMovement: "EU-beweging",
    euMovementNote: "Geschatte gezamenlijke beweging per seconde.",
    latestPeriod: "Laatste referentieperiode",
    flatCountries: (count) => `${count} landen zijn momenteel vlak in deze dataset.`,
    whyTitle: "Waarom EU-overheidsschuld ertoe doet",
    insight1Title: "Leenkosten",
    insight1Text: "Hogere schuld kan landen kwetsbaarder maken wanneer rentes stijgen.",
    insight2Title: "Begrotingsruimte",
    insight2Text: "Schuldniveaus bepalen hoeveel ruimte overheden hebben voor uitgaven en crisisbeleid.",
    insight3Title: "EU-vergelijking",
    insight3Text:
      "De kaart maakt het makkelijker om zeer verschillende begrotingsposities binnen één blok te vergelijken.",
    faqTitle: "FAQ: EU-overheidsschuld",
    faq1Q: "Hoe wordt de live schatting berekend?",
    faq1A:
      "We gebruiken de laatste Eurostat-referentiewaarden en schatten de beweging per seconde op basis van de recente verandering tussen officiële datapunten.",
    faq2Q: "Is dit een officiële realtime statistiek?",
    faq2A:
      "Nee. De onderliggende data komt uit officiële Eurostat-publicaties, maar de live teller is een educatieve schatting.",
    faq3Q: "Wat is het verschil tussen schuld en tekort?",
    faq3A:
      "Schuld is de opgebouwde voorraad van wat een overheid verschuldigd is. Een tekort is het jaarlijkse gat tussen overheidsuitgaven en inkomsten.",
    quickTitle: "Snel overzicht",
    showAll: "Toon alles",
    showLess: "Toon minder",
    quickRising: "↑ stijgt",
    quickFalling: "↓ daalt",
    quickFlat: "→ vlak",
    more: "meer",
    latestArticles: "Laatste artikelen",
    viewAll: "Bekijk alles →",
    noArticles: "Nog geen artikelen. Binnenkort meer.",
    articlesHref: "/nl/articles",
    debtHref: "/nl/debt",
  },

  de: {
    locale: "de-DE",
    basePath: "/de",
    title: "EU-Schuldenkarte | Live-Staatsschulden nach Land (EU-27, 2025)",
    description:
      "Verfolgen Sie die Staatsschulden der EU live, Land für Land. Interaktive EU-27 Schuldenkarte mit Live-Schätzungen, Schuldenwachstum und Ländervergleichen auf Basis von Eurostat-Daten.",
    heroTitle: ["Live EU", "Staats-", "schuldenkarte"],
    lede:
      "Addiert man die öffentlichen Schulden aller 27 EU-Länder, ergibt sich die Zahl unten: eine Live-Schätzung, die sich jede Sekunde bewegt.",
    intro:
      "EU Debt Map macht Eurostat-Schuldendaten einfach verständlich. Nutzen Sie die interaktive Karte, um Länder wie Frankreich, Deutschland, Italien, Spanien und die Niederlande zu vergleichen. Öffnen Sie anschließend eine Länderseite für einen Live-Schuldenticker, den jüngsten Trend und den Schulden-BIP-Kontext.",
    facts: ["🇪🇺 EU-27 Abdeckung", "🧾 Basierend auf Eurostat-Daten", "📈 Live geschätzter Ticker"],
    primaryCta: "EU-Schuldentrends ansehen →",
    secondaryCta: "Schuldenerklärung lesen →",
    source:
      "Quelle: Eurostat. Live-Werte sind Schätzungen auf Basis der neuesten Quartalsdaten und dienen Bildungszwecken, nicht als offizielle Echtzeitstatistik.",
    totalTickerLabel: "Gesamte Staatsschulden der EU-27 (Live-Schätzung)",
    totalTickerAria: "Gesamte Staatsschulden der EU-27 Live-Schätzung",
    largestDebt: "Höchste Schulden",
    largestDebtDescription: "Öffnen Sie die Länderseite mit dem größten Schuldenbestand in der EU.",
    fastestGrowing: "Schnellstes Wachstum",
    fastestGrowingDescription:
      "Öffnen Sie die Länderseite mit dem stärksten jüngsten absoluten Anstieg.",
    liveEstimate: "Live-Schätzung",
    noData: "Keine Daten verfügbar.",
    overviewTitle: "EU-Übersicht",
    overviewText:
      "Die Karte zeigt, ob die Staatsschulden zwischen den letzten zwei Referenzpunkten gestiegen oder gefallen sind. Öffnen Sie ein Land, um die Live-Schätzung, die jüngste Bewegung und den Länder-Kontext zu sehen.",
    legendAria: "Kartenlegende",
    fallingDebt: "Sinkende Schulden",
    risingDebt: "Steigende Schulden",
    falling: "sinkend",
    rising: "steigend",
    mapAria: "Interaktive EU-Karte",
    mapMainAction: "Klicken Sie auf ein Land auf der Karte, um den Live-Schuldenticker zu öffnen.",
    fiveYearChart: "5-Jahres-Grafik der EU-Schulden",
    debtExplainer: "Was Staatsschulden bedeuten",
    snapshotTitle: "EU-Schuldenüberblick",
    snapshotText:
      "Ein schneller Blick auf die jüngste Bewegung in der EU-27. So werden die größten Schuldenkarten aus dem Hero nicht wiederholt.",
    countriesRising: "Länder steigend",
    countriesRisingNote: "Die Schulden stiegen zwischen den letzten zwei Referenzpunkten.",
    countriesFalling: "Länder sinkend",
    countriesFallingNote: "Die Schulden sanken zwischen den letzten zwei Referenzpunkten.",
    euMovement: "EU-Bewegung",
    euMovementNote: "Geschätzte gemeinsame Bewegung pro Sekunde.",
    latestPeriod: "Letzte Referenzperiode",
    flatCountries: (count) => `${count} Länder sind in diesem Datensatz derzeit stabil.`,
    whyTitle: "Warum EU-Staatsschulden wichtig sind",
    insight1Title: "Finanzierungskosten",
    insight1Text: "Höhere Schulden können Länder anfälliger machen, wenn die Zinsen steigen.",
    insight2Title: "Fiskalischer Spielraum",
    insight2Text:
      "Schuldenstände bestimmen, wie viel Raum Regierungen für Ausgaben und Krisenreaktionen haben.",
    insight3Title: "EU-Vergleich",
    insight3Text:
      "Die Karte erleichtert den Vergleich sehr unterschiedlicher Haushaltslagen innerhalb eines Blocks.",
    faqTitle: "FAQ: EU-Staatsschulden",
    faq1Q: "Wie wird die Live-Schätzung berechnet?",
    faq1A:
      "Wir verwenden die neuesten Eurostat-Referenzwerte und schätzen die Bewegung pro Sekunde anhand der jüngsten Veränderung zwischen offiziellen Datenpunkten.",
    faq2Q: "Ist das eine offizielle Echtzeitstatistik?",
    faq2A:
      "Nein. Die zugrunde liegenden Daten stammen aus offiziellen Eurostat-Veröffentlichungen, aber der Live-Zähler ist eine pädagogische Schätzung.",
    faq3Q: "Was ist der Unterschied zwischen Schulden und Defizit?",
    faq3A:
      "Schulden sind der angesammelte Bestand dessen, was eine Regierung schuldet. Ein Defizit ist die jährliche Lücke zwischen Staatsausgaben und Einnahmen.",
    quickTitle: "Schnellliste",
    showAll: "Alle anzeigen",
    showLess: "Weniger anzeigen",
    quickRising: "↑ steigend",
    quickFalling: "↓ sinkend",
    quickFlat: "→ stabil",
    more: "mehr",
    latestArticles: "Neueste Artikel",
    viewAll: "Alle ansehen →",
    noArticles: "Noch keine Artikel. Bald verfügbar.",
    articlesHref: "/de/articles",
    debtHref: "/de/debt",
  },

  fr: {
    locale: "fr-FR",
    basePath: "/fr",
    title: "Carte de la dette de l’UE | Dette publique en direct par pays (UE-27, 2025)",
    description:
      "Suivez la dette publique de l’UE en direct, pays par pays. Carte interactive de l’UE-27 avec estimations en direct, évolution de la dette et comparaisons basées sur Eurostat.",
    heroTitle: ["Carte UE", "Dette", "Publique"],
    lede:
      "Additionnez la dette publique des 27 pays de l’UE et vous obtenez le chiffre ci-dessous : une estimation en direct qui évolue chaque seconde.",
    intro:
      "EU Debt Map transforme les données Eurostat sur la dette en une manière simple d’explorer la dette publique dans l’Union européenne. Utilisez la carte interactive pour comparer des pays comme la France, l’Allemagne, l’Italie, l’Espagne et les Pays-Bas. Ouvrez ensuite une page pays pour voir un compteur de dette en direct, la tendance récente et le contexte dette-PIB.",
    facts: ["🇪🇺 Couverture UE-27", "🧾 Basé sur les données Eurostat", "📈 Compteur estimé en direct"],
    primaryCta: "Voir les tendances de la dette UE →",
    secondaryCta: "Lire l’explication sur la dette →",
    source:
      "Source : Eurostat. Les valeurs en direct sont estimées à partir des dernières données trimestrielles et sont présentées à des fins éducatives, pas comme statistiques officielles en temps réel.",
    totalTickerLabel: "Dette publique totale de l’UE-27 (estimation en direct)",
    totalTickerAria: "Dette publique totale de l’UE-27 estimation en direct",
    largestDebt: "Dette la plus élevée",
    largestDebtDescription: "Ouvrez la page du pays avec le plus grand stock de dette dans l’UE.",
    fastestGrowing: "Croissance la plus rapide",
    fastestGrowingDescription: "Ouvrez la page du pays avec la plus forte hausse absolue récente.",
    liveEstimate: "estimation en direct",
    noData: "Aucune donnée disponible.",
    overviewTitle: "Aperçu de l’UE",
    overviewText:
      "La carte montre si la dette publique a augmenté ou diminué entre les deux derniers points de référence. Ouvrez un pays pour voir son estimation en direct, son mouvement récent et son contexte national.",
    legendAria: "Légende de la carte",
    fallingDebt: "Dette en baisse",
    risingDebt: "Dette en hausse",
    falling: "en baisse",
    rising: "en hausse",
    mapAria: "Carte interactive de l’UE",
    mapMainAction: "Cliquez sur un pays sur la carte pour ouvrir son compteur de dette en direct.",
    fiveYearChart: "Graphique de la dette UE sur 5 ans",
    debtExplainer: "Ce que signifie la dette publique",
    snapshotTitle: "Instantané de la dette UE",
    snapshotText:
      "Une lecture rapide du dernier mouvement dans l’UE-27. Cela évite de répéter les mêmes cartes de dette les plus élevées du bloc hero.",
    countriesRising: "Pays en hausse",
    countriesRisingNote: "La dette a augmenté entre les deux derniers points de référence.",
    countriesFalling: "Pays en baisse",
    countriesFallingNote: "La dette a diminué entre les deux derniers points de référence.",
    euMovement: "Mouvement UE",
    euMovementNote: "Mouvement combiné estimé par seconde.",
    latestPeriod: "Dernière période de référence",
    flatCountries: (count) => `${count} pays sont actuellement stables dans ce jeu de données.`,
    whyTitle: "Pourquoi la dette publique de l’UE compte",
    insight1Title: "Coûts d’emprunt",
    insight1Text:
      "Une dette plus élevée peut rendre les pays plus exposés lorsque les taux d’intérêt augmentent.",
    insight2Title: "Marge budgétaire",
    insight2Text:
      "Les niveaux de dette influencent la capacité des gouvernements à dépenser et à répondre aux crises.",
    insight3Title: "Comparaison UE",
    insight3Text:
      "La carte facilite la comparaison de positions budgétaires très différentes au sein d’un même bloc.",
    faqTitle: "FAQ : dette publique de l’UE",
    faq1Q: "Comment l’estimation en direct est-elle calculée ?",
    faq1A:
      "Nous utilisons les dernières valeurs de référence d’Eurostat et estimons le mouvement par seconde à partir de la variation récente entre les points de données officiels.",
    faq2Q: "Est-ce une statistique officielle en temps réel ?",
    faq2A:
      "Non. Les données sous-jacentes proviennent des publications officielles d’Eurostat, mais le compteur en direct est une estimation éducative.",
    faq3Q: "Quelle est la différence entre dette et déficit ?",
    faq3A:
      "La dette est le stock accumulé de ce qu’un gouvernement doit. Un déficit est l’écart annuel entre les dépenses publiques et les recettes.",
    quickTitle: "Liste rapide",
    showAll: "Voir tout",
    showLess: "Voir moins",
    quickRising: "↑ hausse",
    quickFalling: "↓ baisse",
    quickFlat: "→ stable",
    more: "plus",
    latestArticles: "Derniers articles",
    viewAll: "Voir tout →",
    noArticles: "Aucun article pour le moment. D’autres arrivent bientôt.",
    articlesHref: "/fr/articles",
    debtHref: "/fr/debt",
  },
};

export function generateLocalizedHomeMetadata(lang) {
  const t = TEXT[lang] || TEXT.en;
  const base = new URL("https://www.eudebtmap.com");
  const url = lang === "en" ? "https://www.eudebtmap.com/" : `https://www.eudebtmap.com${t.basePath}`;

  return {
    metadataBase: base,
    title: t.title,
    description: t.description,
    alternates: {
      canonical: url,
      languages: {
        en: "https://www.eudebtmap.com/",
        nl: "https://www.eudebtmap.com/nl",
        de: "https://www.eudebtmap.com/de",
        fr: "https://www.eudebtmap.com/fr",
        "x-default": "https://www.eudebtmap.com/",
      },
    },
    openGraph: {
      title: t.title,
      description: t.description,
      url,
      siteName: "EU Debt Map",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
    },
  };
}

function countryHref(country, lang) {
  if (!country?.code) return "/";

  if (lang === "en") {
    return `/country/${country.code.toLowerCase()}`;
  }

  return `/${lang}/country/${country.code.toLowerCase()}`;
}

function localizedCountry(country, lang) {
  return {
    ...country,
    name: countryName(country.code, lang) || country.name,
  };
}

function formatShortEuro(value, locale) {
  if (!Number.isFinite(value)) return "€0";

  const abs = Math.abs(value);
  const nf2 = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const nf1 = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const nf0 = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  });

  if (abs >= 1_000_000_000_000) {
    return `€${nf2.format(value / 1_000_000_000_000)}tn`;
  }

  if (abs >= 1_000_000_000) {
    return `€${nf2.format(value / 1_000_000_000)}bn`;
  }

  if (abs >= 1_000_000) {
    return `€${nf1.format(value / 1_000_000)}m`;
  }

  return `€${nf0.format(Math.round(value))}`;
}

function formatPerSecond(value, locale) {
  if (!Number.isFinite(value)) return "€0/s";

  const sign = value >= 0 ? "+" : "−";
  const abs = Math.abs(value);
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(Math.round(abs));

  return `${sign}€${formatted}/s`;
}

function MetricLinkCard({ label, country, description, tone = "blue", lang, locale, t }) {
  if (!country) {
    return <div className="eu-home-mini-card">{t.noData}</div>;
  }

  const perSecond = livePerSecondFor(country);
  const isRising = perSecond >= 0;

  return (
    <Link
      href={countryHref(country, lang)}
      className="eu-home-mini-link"
      aria-label={`${label}: ${country.name}`}
    >
      <div className={`eu-home-mini-card eu-home-mini-card-${tone}`}>
        <div className="eu-home-mini-topline">
          <span className="eu-home-mini-label">{label}</span>
          <span className="eu-home-mini-arrow" aria-hidden>
            →
          </span>
        </div>

        <div className="eu-home-mini-country">
          <span aria-hidden>{country.flag}</span>
          <strong>{country.name}</strong>
        </div>

        <div className="eu-home-mini-value">{formatShortEuro(country.last_value_eur, locale)}</div>

        <div className={isRising ? "eu-home-mini-trend is-rising" : "eu-home-mini-trend is-falling"}>
          {isRising ? "↑" : "↓"} {formatPerSecond(perSecond, locale)} · {t.liveEstimate}
        </div>

        <p>{description}</p>
      </div>
    </Link>
  );
}

function SnapshotStat({ label, value, note, tone = "neutral" }) {
  return (
    <div className={`eu-home-snapshot-stat eu-home-snapshot-${tone}`}>
      <div className="eu-home-snapshot-label">{label}</div>
      <div className="eu-home-snapshot-value">{value}</div>
      <div className="eu-home-snapshot-note">{note}</div>
    </div>
  );
}

function InsightItem({ icon, title, children }) {
  return (
    <div className="eu-home-insight-item">
      <div className="eu-home-insight-icon" aria-hidden>
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

export default function LocalizedHomePage({ lang = "en" }) {
  const t = TEXT[lang] || TEXT.en;
  const locale = t.locale;

  const valid = countries
    .filter((c) => c && c.last_value_eur > 0 && c.prev_value_eur > 0)
    .map((c) => localizedCountry(c, lang));

  const largestDebt =
    valid.length > 0 ? valid.reduce((a, b) => (a.last_value_eur > b.last_value_eur ? a : b)) : null;

  const withDelta = valid.map((c) => ({
    ...c,
    delta: c.last_value_eur - c.prev_value_eur,
  }));

  const fastestGrowing =
    withDelta.length > 0 ? withDelta.reduce((a, b) => (a.delta > b.delta ? a : b)) : null;

  const quickItems = valid.map((c) => ({
    code: c.code,
    name: c.name,
    flag: c.flag,
    trend: trendFor(c),
  }));

  const fallingCount = valid.filter((c) => trendFor(c) < 0).length;
  const risingCount = valid.filter((c) => trendFor(c) > 0).length;
  const flatCount = valid.filter((c) => trendFor(c) === 0).length;

  const totalPerSecond = valid.reduce((sum, c) => sum + livePerSecondFor(c), 0);
  const latestPeriod =
    valid.find((c) => c.official_latest_time)?.official_latest_time ||
    valid.find((c) => c.last_date)?.last_date ||
    "Eurostat";

  const topArticles = listArticles({ lang }).slice(0, 3);

  return (
    <main className="eu-home-v2">
      <section className="eu-home-hero">
        <div className="eu-home-hero-copy">
          <h1 className="eu-home-title">
            {t.heroTitle.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>

          <p className="eu-home-lede">
            <strong>{t.lede}</strong>
          </p>

          <p className="eu-home-copy">{t.intro}</p>

          <div className="eu-home-meta" aria-label="Key facts">
            {t.facts.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
          </div>

          <div className="eu-home-actions">
            <Link href="/eu-debt" className="eu-home-btn eu-home-btn-primary">
              {t.primaryCta}
            </Link>
            <Link href={t.debtHref} className="eu-home-btn eu-home-btn-secondary">
              {t.secondaryCta}
            </Link>
          </div>

          <p className="eu-home-source">{t.source}</p>
        </div>

        <div className="eu-home-hero-dashboard">
          <div className="eu-home-total-shell">
            <EUTotalTicker
              label={t.totalTickerLabel}
              ariaLabel={t.totalTickerAria}
              locale={locale}
            />
          </div>

          <div className="eu-home-hero-stats">
            <MetricLinkCard
              label={t.largestDebt}
              country={largestDebt}
              description={t.largestDebtDescription}
              tone="blue"
              lang={lang}
              locale={locale}
              t={t}
            />

            <MetricLinkCard
              label={t.fastestGrowing}
              country={fastestGrowing}
              description={t.fastestGrowingDescription}
              tone="green"
              lang={lang}
              locale={locale}
              t={t}
            />
          </div>
        </div>
      </section>

      <section className="eu-home-main-grid">
        <section className="eu-home-card eu-home-map-card">
          <div className="eu-home-card-header eu-home-map-header">
            <div>
              <h2>{t.overviewTitle}</h2>
              <p>{t.overviewText}</p>
            </div>

            <div className="eu-home-map-pills" aria-label={t.legendAria}>
              <span className="eu-home-pill eu-home-pill-green">{t.fallingDebt}</span>
              <span className="eu-home-pill eu-home-pill-red">{t.risingDebt}</span>
              <span className="eu-home-pill">
                {fallingCount} {t.falling} · {risingCount} {t.rising}
              </span>
            </div>
          </div>

          <div className="eu-home-map-shell" role="region" aria-label={t.mapAria}>
            <EuropeMap />
          </div>

          <div className="eu-home-map-actions">
            <div className="eu-home-map-action eu-home-map-action-main">
              <span aria-hidden>➜</span>
              <strong>{t.mapMainAction}</strong>
            </div>

            <Link href="/eu-debt" className="eu-home-map-action">
              <span aria-hidden>⌁</span>
              <strong>{t.fiveYearChart}</strong>
            </Link>

            <Link href={t.debtHref} className="eu-home-map-action">
              <span aria-hidden>▣</span>
              <strong>{t.debtExplainer}</strong>
            </Link>
          </div>
        </section>

        <aside className="eu-home-side-stack">
          <section className="eu-home-card eu-home-side-card">
            <div className="eu-home-card-header">
              <div>
                <h2>{t.snapshotTitle}</h2>
                <p>{t.snapshotText}</p>
              </div>
            </div>

            <div className="eu-home-snapshot-grid">
              <SnapshotStat
                label={t.countriesRising}
                value={risingCount}
                note={t.countriesRisingNote}
                tone="red"
              />

              <SnapshotStat
                label={t.countriesFalling}
                value={fallingCount}
                note={t.countriesFallingNote}
                tone="green"
              />

              <SnapshotStat
                label={t.euMovement}
                value={formatPerSecond(totalPerSecond, locale)}
                note={t.euMovementNote}
                tone={totalPerSecond >= 0 ? "red" : "green"}
              />
            </div>

            <div className="eu-home-period-box">
              <span>{t.latestPeriod}</span>
              <strong>{latestPeriod}</strong>
              {flatCount > 0 && <small>{t.flatCountries(flatCount)}</small>}
            </div>
          </section>

          <section className="eu-home-card eu-home-side-card">
            <div className="eu-home-card-header">
              <div>
                <h2>{t.whyTitle}</h2>
              </div>
            </div>

            <div className="eu-home-insights">
              <InsightItem icon="%" title={t.insight1Title}>
                {t.insight1Text}
              </InsightItem>

              <InsightItem icon="🏛" title={t.insight2Title}>
                {t.insight2Text}
              </InsightItem>

              <InsightItem icon="🇪🇺" title={t.insight3Title}>
                {t.insight3Text}
              </InsightItem>
            </div>
          </section>

          <section className="eu-home-card eu-home-side-card eu-home-faq-card">
            <div className="eu-home-card-header">
              <div>
                <h2>{t.faqTitle}</h2>
              </div>
            </div>

            <details>
              <summary>{t.faq1Q}</summary>
              <p>{t.faq1A}</p>
            </details>

            <details>
              <summary>{t.faq2Q}</summary>
              <p>{t.faq2A}</p>
            </details>

            <details>
              <summary>{t.faq3Q}</summary>
              <p>{t.faq3A}</p>
            </details>
          </section>
        </aside>
      </section>

      <section className="eu-home-lower-grid">
        <div className="eu-home-quick-wrap">
          <QuickList
            items={quickItems}
            initialCount={10}
            strings={{
              title: t.quickTitle,
              showAll: t.showAll,
              showLess: t.showLess,
              rising: t.quickRising,
              falling: t.quickFalling,
              flat: t.quickFlat,
              more: t.more,
            }}
          />
        </div>

        <section className="eu-home-card eu-home-lower-card">
          <div className="eu-home-articles-head">
            <h2>{t.latestArticles}</h2>
            <Link href={t.articlesHref} className="eu-home-small-link">
              {t.viewAll}
            </Link>
          </div>

          <div className="eu-home-articles-list">
            {topArticles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}

            {topArticles.length === 0 && <div className="eu-home-empty">{t.noArticles}</div>}
          </div>
        </section>
      </section>

      <style>{`
        .eu-home-v2 {
          width: min(calc(100% - 48px), 1500px);
          max-width: 1500px;
          margin: 0 auto;
          padding: 28px 0 56px;
          display: grid;
          gap: 18px;
          align-items: start;
        }

        .site-header .container,
        .site-header .header-inner {
          max-width: 1500px !important;
        }

        .eu-home-hero,
        .eu-home-card,
        .eu-home-quick-wrap > .card {
          background: #ffffff;
          border: 1px solid rgba(203, 213, 225, 0.8);
          border-radius: 18px;
          box-shadow: 0 14px 36px rgba(15, 23, 42, 0.06);
        }

        .eu-home-hero {
          display: grid;
          grid-template-columns: minmax(410px, 0.82fr) minmax(640px, 1.18fr);
          gap: clamp(28px, 3.2vw, 54px);
          padding: clamp(28px, 3vw, 44px);
          overflow: hidden;
          background:
            radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 36%),
            linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
        }

        .eu-home-hero-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .eu-home-title {
          margin: 0 0 18px;
          font-family: var(--font-display);
          font-size: clamp(3rem, 4.05vw, 4.45rem);
          line-height: 0.95;
          letter-spacing: -0.06em;
          font-weight: 850;
          background: linear-gradient(120deg, #1d4ed8 0%, #1266d6 54%, #00966b 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .eu-home-title span {
          display: block;
          white-space: nowrap;
        }

        .eu-home-lede {
          margin: 0;
          max-width: 560px;
          color: #1f3553;
          font-size: clamp(1rem, 0.7vw + 0.82rem, 1.13rem);
          line-height: 1.5;
        }

        .eu-home-copy {
          margin: 14px 0 0;
          max-width: 590px;
          color: #334b6b;
          font-size: 0.98rem;
          line-height: 1.62;
        }

        .eu-home-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 18px;
        }

        .eu-home-meta span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 32px;
          padding: 0 12px;
          border: 1px solid #dbe5f0;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          color: #405a78;
          font-size: 0.8rem;
          font-weight: 750;
          line-height: 1;
          white-space: nowrap;
        }

        .eu-home-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 18px;
        }

        .eu-home-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 20px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 800;
          transition:
            transform 0.1s ease,
            box-shadow 0.18s ease,
            background 0.18s ease,
            border-color 0.18s ease;
        }

        .eu-home-btn:hover {
          transform: translateY(-1px);
          text-decoration: none;
        }

        .eu-home-btn-primary {
          color: #ffffff;
          background: linear-gradient(180deg, #1764e8, #0f55d4);
          border: 1px solid #0f55d4;
          box-shadow: 0 14px 26px rgba(37, 99, 235, 0.22);
        }

        .eu-home-btn-secondary {
          color: #101827;
          background: #ffffff;
          border: 1px solid #d8e1ec;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
        }

        .eu-home-source {
          margin: 18px 0 0;
          max-width: 600px;
          color: #66758a;
          font-size: 0.78rem;
          line-height: 1.45;
        }

        .eu-home-hero-dashboard {
          min-width: 0;
          align-self: start;
          display: grid;
          gap: 16px;
          padding-top: 16px;
        }

        .eu-home-total-shell {
          min-width: 0;
          width: 100%;
        }

        .eu-home-hero-stats {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .eu-home-mini-link {
          display: block;
          color: inherit;
          text-decoration: none;
          min-width: 0;
        }

        .eu-home-mini-link:hover {
          text-decoration: none;
        }

        .eu-home-mini-card {
          min-width: 0;
          height: 100%;
          padding: 20px;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid #dbe5f0;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.045);
          transition:
            transform 0.12s ease,
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .eu-home-mini-link:hover .eu-home-mini-card {
          transform: translateY(-2px);
          border-color: #bfdbfe;
          box-shadow: 0 18px 34px rgba(37, 99, 235, 0.12);
        }

        .eu-home-mini-card-blue {
          border-color: #c9ddff;
        }

        .eu-home-mini-card-green {
          border-color: #caead5;
        }

        .eu-home-mini-topline {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
        }

        .eu-home-mini-label {
          color: #1d4ed8;
          font-size: 0.75rem;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .eu-home-mini-card-green .eu-home-mini-label {
          color: #059669;
        }

        .eu-home-mini-arrow {
          color: #94a3b8;
          font-weight: 900;
        }

        .eu-home-mini-country {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          margin-top: 10px;
          color: #111827;
          font-size: 1.08rem;
        }

        .eu-home-mini-country strong {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .eu-home-mini-value {
          margin-top: 12px;
          color: #0f172a;
          font-size: clamp(1.95rem, 2.3vw, 2.55rem);
          line-height: 1;
          font-weight: 850;
          letter-spacing: -0.04em;
          white-space: nowrap;
        }

        .eu-home-mini-trend {
          margin-top: 9px;
          font-size: 0.82rem;
          line-height: 1.35;
          font-weight: 750;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .eu-home-mini-trend.is-rising {
          color: #dc2626;
        }

        .eu-home-mini-trend.is-falling {
          color: #16a34a;
        }

        .eu-home-mini-card p {
          margin: 12px 0 0;
          color: #50647e;
          font-size: 0.88rem;
          line-height: 1.5;
        }

        .eu-home-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(360px, 0.95fr);
          gap: 18px;
          align-items: start;
        }

        .eu-home-map-card,
        .eu-home-side-card,
        .eu-home-lower-card,
        .eu-home-quick-wrap > .card {
          padding: 22px;
        }

        .eu-home-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 14px;
        }

        .eu-home-card-header h2,
        .eu-home-articles-head h2 {
          margin: 0;
          color: #0f172a;
          font-size: 1.18rem;
          letter-spacing: -0.02em;
        }

        .eu-home-card-header p {
          margin: 4px 0 0;
          max-width: 670px;
          color: #52647b;
          font-size: 0.86rem;
          line-height: 1.35;
        }

        .eu-home-map-header {
          align-items: center;
        }

        .eu-home-map-pills {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 8px;
        }

        .eu-home-pill {
          display: inline-flex;
          align-items: center;
          min-height: 32px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid #dbe5f0;
          background: #ffffff;
          color: #334155;
          font-size: 0.78rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .eu-home-pill-green {
          color: #047857;
          border-color: #bbf7d0;
          background: #ecfdf5;
        }

        .eu-home-pill-red {
          color: #dc2626;
          border-color: #fecaca;
          background: #fef2f2;
        }

        .eu-home-map-shell {
          overflow: hidden;
          min-height: 420px;
          border-radius: 16px;
          background: linear-gradient(180deg, #dbeafe, #eff6ff);
        }

        .eu-home-map-shell svg {
          display: block;
          width: 100%;
          height: auto;
        }

        .eu-home-map-actions {
          display: grid;
          grid-template-columns: 1.4fr 0.7fr 0.8fr;
          gap: 10px;
          margin-top: 12px;
        }

        .eu-home-map-action {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 44px;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid #dbe5f0;
          background: #f8fbff;
          color: #155bd6;
          text-align: center;
          text-decoration: none;
          font-size: 0.82rem;
          line-height: 1.25;
        }

        .eu-home-map-action-main {
          color: #12233b;
          background: #eff6ff;
          border-color: #bfdbfe;
        }

        .eu-home-side-stack {
          display: grid;
          gap: 14px;
        }

        .eu-home-snapshot-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .eu-home-snapshot-stat {
          min-width: 0;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .eu-home-snapshot-red {
          border-color: #fecaca;
          background: #fff7f7;
        }

        .eu-home-snapshot-green {
          border-color: #bbf7d0;
          background: #f0fdf4;
        }

        .eu-home-snapshot-label {
          color: #64748b;
          font-size: 0.76rem;
          line-height: 1.25;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .eu-home-snapshot-value {
          margin-top: 8px;
          color: #0f172a;
          font-size: clamp(1.55rem, 2vw, 2.05rem);
          line-height: 1;
          font-weight: 900;
          letter-spacing: -0.045em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .eu-home-snapshot-note {
          margin-top: 8px;
          color: #52647b;
          font-size: 0.77rem;
          line-height: 1.35;
        }

        .eu-home-period-box {
          display: grid;
          gap: 2px;
          margin-top: 12px;
          padding: 13px 14px;
          border-radius: 14px;
          border: 1px solid #dbe5f0;
          background: #ffffff;
        }

        .eu-home-period-box span {
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 750;
        }

        .eu-home-period-box strong {
          color: #0f172a;
          font-size: 1rem;
        }

        .eu-home-period-box small {
          margin-top: 4px;
          color: #64748b;
          font-size: 0.78rem;
        }

        .eu-home-insights {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0;
        }

        .eu-home-insight-item {
          padding: 4px 14px 0;
          border-left: 1px solid #edf2f7;
        }

        .eu-home-insight-item:first-child {
          border-left: 0;
          padding-left: 0;
        }

        .eu-home-insight-icon {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          margin-bottom: 9px;
          border-radius: 999px;
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 850;
        }

        .eu-home-insight-item:nth-child(2) .eu-home-insight-icon {
          background: #ecfdf5;
          color: #059669;
        }

        .eu-home-insight-item:nth-child(3) .eu-home-insight-icon {
          background: #f3e8ff;
          color: #7c3aed;
        }

        .eu-home-insight-item h3 {
          margin: 0;
          color: #0f172a;
          font-size: 0.9rem;
        }

        .eu-home-insight-item p {
          margin: 5px 0 0;
          color: #52647b;
          font-size: 0.78rem;
          line-height: 1.38;
        }

        .eu-home-faq-card {
          padding-bottom: 14px;
        }

        .eu-home-faq-card details {
          border-top: 1px solid #edf2f7;
          padding: 11px 0;
        }

        .eu-home-faq-card details:first-of-type {
          border-top: 0;
          padding-top: 0;
        }

        .eu-home-faq-card summary {
          cursor: pointer;
          color: #0f172a;
          font-weight: 800;
          font-size: 0.86rem;
          list-style-position: outside;
        }

        .eu-home-faq-card p {
          margin: 8px 0 0;
          color: #52647b;
          font-size: 0.84rem;
          line-height: 1.5;
        }

        .eu-home-lower-grid {
          display: grid;
          grid-template-columns: minmax(300px, 0.9fr) minmax(0, 1.1fr);
          gap: 18px;
          align-items: start;
        }

        .eu-home-articles-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .eu-home-small-link {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid #dbe5f0;
          background: #ffffff;
          color: #0f172a;
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .eu-home-articles-list {
          display: grid;
          gap: 12px;
        }

        .eu-home-empty {
          padding: 14px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #64748b;
          font-size: 0.9rem;
        }

        @media (max-width: 1250px) {
          .eu-home-hero {
            grid-template-columns: 1fr;
          }

          .eu-home-hero-copy {
            max-width: 760px;
          }

          .eu-home-hero-dashboard {
            padding-top: 0;
          }

          .eu-home-main-grid,
          .eu-home-lower-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 920px) {
          .eu-home-snapshot-grid,
          .eu-home-insights {
            grid-template-columns: 1fr;
          }

          .eu-home-insight-item {
            border-left: 0;
            border-top: 1px solid #edf2f7;
            padding: 14px 0 0;
          }

          .eu-home-insight-item:first-child {
            border-top: 0;
            padding-top: 0;
          }
        }

        @media (max-width: 820px) {
          .eu-home-v2 {
            width: min(calc(100% - 28px), 1500px);
            padding: 18px 0 42px;
            gap: 14px;
          }

          .eu-home-hero,
          .eu-home-map-card,
          .eu-home-side-card,
          .eu-home-lower-card,
          .eu-home-quick-wrap > .card {
            padding: 18px;
          }

          .eu-home-title {
            font-size: clamp(2.55rem, 13vw, 4.1rem);
            letter-spacing: -0.06em;
          }

          .eu-home-hero-stats,
          .eu-home-map-actions {
            grid-template-columns: 1fr;
          }

          .eu-home-card-header,
          .eu-home-map-header {
            flex-direction: column;
            align-items: stretch;
          }

          .eu-home-map-pills {
            justify-content: flex-start;
          }

          .eu-home-map-shell {
            min-height: 320px;
          }
        }

        @media (max-width: 560px) {
  .eu-home-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .eu-home-btn {
    width: 100%;
  }

  .eu-home-meta span {
    width: 100%;
    justify-content: center;
  }

  .eu-home-mini-card {
    padding: 16px;
  }

  .eu-home-map-card {
    padding: 14px;
  }

  .eu-home-map-pills {
    gap: 7px;
  }

  .eu-home-pill {
    min-height: 30px;
    padding: 0 10px;
    font-size: 0.74rem;
  }

  .eu-home-map-shell {
    min-height: 390px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .eu-home-map-shell svg {
    width: 128%;
    max-width: none;
    height: auto;
    flex: 0 0 auto;
    transform: translateY(-4px);
  }

  .eu-home-map-actions {
    gap: 9px;
    margin-top: 14px;
  }

  .eu-home-map-action {
    min-height: 52px;
    padding: 12px 14px;
    font-size: 0.86rem;
  }
}
      `}</style>
    </main>
  );
}