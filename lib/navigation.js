const NAVIGATION_GROUPS = [
  { key: 'debt', items: [
    { key: 'map', href: '/' },
    { key: 'debtToGdp', href: '/debt-to-gdp' },
    { key: 'perCapita', href: '/debt-per-capita' },
    { key: 'growth', href: '/debt-growth' },
    { key: 'euHistory', href: '/eu-debt' },
    { key: 'whatIsDebt', href: '/debt' },
  ] },
  { key: 'fiscal', items: [
    { key: 'balance', href: '/deficit' },
    { key: 'interest', href: '/interest-cost' },
    { key: 'accounts', href: '/government-spending' },
  ] },
];

const DIRECT_LINKS = [
  { key: 'articles', href: '/articles' },
  { key: 'methodology', href: '/methodology' },
  { key: 'about', href: '/about' },
];

const TEXT = {
  "en": {
    "nav": {
      "debt": "Debt",
      "fiscal": "Public finances",
      "countries": "Countries",
      "map": "EU debt map",
      "debtToGdp": "Debt-to-GDP",
      "perCapita": "Debt per resident",
      "growth": "Debt growth",
      "euHistory": "EU debt history",
      "whatIsDebt": "What is government debt?",
      "balance": "Deficit & surplus",
      "interest": "Interest costs",
      "accounts": "Spending & revenue",
      "articles": "Articles",
      "methodology": "Methodology",
      "about": "About"
    },
    "groupIntro": {
      "debt": "Compare government debt across Europe.",
      "fiscal": "Explore government budgets and debt servicing.",
      "countries": "Government finances in all 27 EU countries."
    },
    "changeLanguage": "Change language",
    "active": "Active",
    "brandHome": "EU Debt Map – Home",
    "toggleMenu": "Open menu",
    "closeMenu": "Close menu",
    "navigation": "Main navigation",
    "language": "Language"
  },
  "nl": {
    "nav": {
      "debt": "Schuld",
      "fiscal": "Begroting",
      "countries": "Landen",
      "map": "EU-schuldkaart",
      "debtToGdp": "Schuld/bbp",
      "perCapita": "Schuld per inwoner",
      "growth": "Schuldgroei",
      "euHistory": "Historische EU-schuld",
      "whatIsDebt": "Wat is overheidsschuld?",
      "balance": "Tekort & overschot",
      "interest": "Rentelasten",
      "accounts": "Uitgaven & inkomsten",
      "articles": "Artikelen",
      "methodology": "Methodologie",
      "about": "Over"
    },
    "groupIntro": {
      "debt": "Vergelijk overheidsschuld in Europa.",
      "fiscal": "Bekijk begrotingen en de kosten van schuld.",
      "countries": "Overheidsfinanciën van alle 27 EU-landen."
    },
    "changeLanguage": "Taal wijzigen",
    "active": "Actief",
    "brandHome": "EU Debt Map – Home",
    "toggleMenu": "Menu openen",
    "closeMenu": "Menu sluiten",
    "navigation": "Hoofdnavigatie",
    "language": "Taal"
  },
  "de": {
    "nav": {
      "debt": "Schulden",
      "fiscal": "Staatsfinanzen",
      "countries": "Länder",
      "map": "EU-Schuldenkarte",
      "debtToGdp": "Schulden/BIP",
      "perCapita": "Schulden pro Kopf",
      "growth": "Schuldenentwicklung",
      "euHistory": "EU-Schulden im Zeitverlauf",
      "whatIsDebt": "Was sind Staatsschulden?",
      "balance": "Defizit & Überschuss",
      "interest": "Zinsausgaben",
      "accounts": "Ausgaben & Einnahmen",
      "articles": "Artikel",
      "methodology": "Methodik",
      "about": "Über"
    },
    "groupIntro": {
      "debt": "Staatsschulden in Europa vergleichen.",
      "fiscal": "Staatshaushalte und Schuldendienst im Überblick.",
      "countries": "Staatsfinanzen aller 27 EU-Länder."
    },
    "changeLanguage": "Sprache ändern",
    "active": "Aktiv",
    "brandHome": "EU Debt Map – Startseite",
    "toggleMenu": "Menü öffnen",
    "closeMenu": "Menü schließen",
    "navigation": "Hauptnavigation",
    "language": "Sprache"
  },
  "fr": {
    "nav": {
      "debt": "Dette",
      "fiscal": "Finances publiques",
      "countries": "Pays",
      "map": "Carte de la dette de l’UE",
      "debtToGdp": "Dette/PIB",
      "perCapita": "Dette par habitant",
      "growth": "Évolution de la dette",
      "euHistory": "Historique de la dette de l’UE",
      "whatIsDebt": "Qu’est-ce que la dette publique ?",
      "balance": "Déficit & excédent",
      "interest": "Charges d’intérêts",
      "accounts": "Dépenses & recettes",
      "articles": "Articles",
      "methodology": "Méthodologie",
      "about": "À propos"
    },
    "groupIntro": {
      "debt": "Comparer la dette publique en Europe.",
      "fiscal": "Explorer les budgets publics et le service de la dette.",
      "countries": "Les finances publiques des 27 pays de l’UE."
    },
    "changeLanguage": "Changer de langue",
    "active": "Actif",
    "brandHome": "EU Debt Map – Accueil",
    "toggleMenu": "Ouvrir le menu",
    "closeMenu": "Fermer le menu",
    "navigation": "Navigation principale",
    "language": "Langue"
  }
};

function localeAwareHref(href, locale = 'en') {
  const prefix = ['nl', 'de', 'fr'].includes(locale) ? `/${locale}` : '';
  return href === '/' ? prefix || '/' : `${prefix}${href}`;
}

function isActivePath(pathname, hrefBase, locale) {
  const target = localeAwareHref(hrefBase, locale);
  if (hrefBase === '/') return pathname === target;
  return pathname === target || pathname.startsWith(target + '/');
}

function navigationFor(locale, countryNames) {
  const lang = TEXT[locale] ? locale : 'en';
  const t = TEXT[lang];
  const groups = NAVIGATION_GROUPS.map(group => ({
    ...group,
    label: t.nav[group.key],
    intro: t.groupIntro[group.key],
    items: group.items.map(item => ({ ...item, label: t.nav[item.key] })),
  }));
  groups.push({
    key: 'countries',
    label: t.nav.countries,
    intro: t.groupIntro.countries,
    items: Object.entries(countryNames)
      .map(([code, names]) => ({ key: code, href: `/country/${code.toLowerCase()}`, label: names[lang] || names.en }))
      .sort((a, b) => a.label.localeCompare(b.label, lang)),
  });
  return {
    t,
    groups,
    links: DIRECT_LINKS.map(item => ({ ...item, label: t.nav[item.key] })),
  };
}

module.exports = { NAVIGATION_GROUPS, DIRECT_LINKS, TEXT, localeAwareHref, isActivePath, navigationFor };
