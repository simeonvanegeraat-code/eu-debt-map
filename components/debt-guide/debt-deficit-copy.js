const DEBT_DEFICIT_SOURCE = "https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260122-1";
const DEBT_DEFICIT_REVIEWED = "2026-10-31";

const COPY = {
  en: {
    eyebrow: "Debt and deficit",
    title: "What is the difference between debt and a deficit?",
    facts: [
      ["Deficit · over a period", "The shortfall when government expenditure exceeds revenue, for example during one year."],
      ["Debt · at a point in time", "The outstanding government borrowing on a particular date, after repayments and other changes."],
    ],
    relationship: "A deficit and a change in debt need not be the same amount. A government can use cash reserves or sell financial assets to finance a deficit. It can also borrow to acquire financial assets without increasing the deficit.",
    source: "Eurostat: how deficits and debt are connected",
    reviewed: "This explanation checked",
    ratioFAQ: ["Can debt-to-GDP fall while the government runs a deficit?", "Yes. The ratio can fall if nominal GDP grows faster than the debt stock. The deficit alone does not determine the change in debt: cash reserves, financial transactions and other adjustments also matter."],
  },
  nl: {
    eyebrow: "Schuld en tekort",
    title: "Wat is het verschil tussen schuld en tekort?",
    facts: [
      ["Tekort · over een periode", "Het bedrag dat een overheid meer uitgeeft dan zij ontvangt, bijvoorbeeld gedurende één jaar."],
      ["Schuld · op een meetmoment", "De openstaande leningen van een overheid op een bepaalde datum, na aflossingen en andere veranderingen."],
    ],
    relationship: "Een tekort en een schuldverandering hoeven niet hetzelfde bedrag te zijn. Een overheid kan een tekort financieren met kasreserves of door financiële bezittingen te verkopen. Zij kan ook lenen om financiële bezittingen te kopen zonder daarmee het tekort te vergroten.",
    source: "Eurostat: het verband tussen tekort en schuld",
    reviewed: "Deze uitleg gecontroleerd",
    ratioFAQ: ["Kan de schuldquote dalen bij een begrotingstekort?", "Ja. De schuldquote kan dalen als het nominale bbp sneller groeit dan de schuldvoorraad. Het tekort alleen bepaalt de schuldverandering niet: ook kasreserves, financiële transacties en andere aanpassingen spelen mee."],
  },
  de: {
    eyebrow: "Schulden und Defizit",
    title: "Was ist der Unterschied zwischen Schulden und Defizit?",
    facts: [
      ["Defizit · über einen Zeitraum", "Der Fehlbetrag, wenn die Staatsausgaben die Einnahmen übersteigen, beispielsweise innerhalb eines Jahres."],
      ["Schulden · zu einem Stichtag", "Die ausstehende Kreditaufnahme des Staates an einem bestimmten Datum, nach Tilgungen und anderen Veränderungen."],
    ],
    relationship: "Ein Defizit und die Veränderung des Schuldenstands müssen nicht gleich hoch sein. Ein Staat kann ein Defizit mit Kassenreserven oder durch den Verkauf finanzieller Vermögenswerte finanzieren. Er kann auch Kredite zum Erwerb finanzieller Vermögenswerte aufnehmen, ohne damit das Defizit zu erhöhen.",
    source: "Eurostat: Zusammenhang zwischen Defizit und Schulden",
    reviewed: "Diese Erklärung geprüft",
    ratioFAQ: ["Kann die Schuldenquote trotz eines Haushaltsdefizits sinken?", "Ja. Die Quote kann sinken, wenn das nominale BIP schneller wächst als der Schuldenstand. Das Defizit allein bestimmt die Schuldenveränderung nicht: Auch Kassenreserven, Finanztransaktionen und andere Anpassungen spielen eine Rolle."],
  },
  fr: {
    eyebrow: "Dette et déficit",
    title: "Quelle différence entre dette et déficit ?",
    facts: [
      ["Déficit · sur une période", "L’écart lorsque les dépenses publiques dépassent les recettes, par exemple pendant une année."],
      ["Dette · à une date donnée", "L’encours des emprunts publics à une date précise, après remboursements et autres variations."],
    ],
    relationship: "Un déficit et une variation de la dette ne sont pas nécessairement du même montant. Un État peut financer un déficit avec ses réserves de trésorerie ou en vendant des actifs financiers. Il peut aussi emprunter pour acquérir des actifs financiers sans accroître le déficit.",
    source: "Eurostat : le lien entre déficit et dette",
    reviewed: "Cette explication vérifiée",
    ratioFAQ: ["Le ratio dette/PIB peut-il baisser malgré un déficit public ?", "Oui. Le ratio peut baisser si le PIB nominal augmente plus vite que l’encours de dette. Le déficit ne détermine pas à lui seul la variation de la dette : la trésorerie, les opérations financières et d’autres ajustements interviennent aussi."],
  },
};

function getDebtDeficitCopy(lang = "en") {
  return COPY[lang] || COPY.en;
}

module.exports = { DEBT_DEFICIT_SOURCE, DEBT_DEFICIT_REVIEWED, getDebtDeficitCopy };
