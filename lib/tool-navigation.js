const { localeAwareHref } = require('./navigation');

const TOOL_PATHS = ['/', '/debt-to-gdp', '/debt-per-capita', '/debt-growth', '/eu-debt', '/deficit', '/interest-cost', '/government-spending'];
const CONTENT_PATHS = new Set([...TOOL_PATHS, '/inflation', '/articles', '/methodology', '/about', '/debt', '/debt-vs-deficit', '/stability-and-growth-pact', '/staatsobligaties-nederland']);
const TEXT = {
  en: {
    label: 'Explore the topics', browse: 'Browse the topics',
    items: ['Debt map', 'Debt-to-GDP', 'Debt per resident', 'Debt growth', 'EU debt trend', 'Deficit & surplus', 'Interest costs', 'Spending & revenue'],
  },
  nl: {
    label: 'Ontdek de onderwerpen', browse: 'Blader door de onderwerpen',
    items: ['Schuldenkaart', 'Schuldquote', 'Schuld per inwoner', 'Schuldgroei', 'EU-schuldtrend', 'Tekort & overschot', 'Rentelasten', 'Uitgaven & inkomsten'],
  },
  de: {
    label: 'Themen entdecken', browse: 'Durch die Themen blättern',
    items: ['Schuldenkarte', 'Schuldenquote', 'Schulden pro Kopf', 'Schuldenentwicklung', 'EU-Schuldentrend', 'Defizit & Überschuss', 'Zinsausgaben', 'Ausgaben & Einnahmen'],
  },
  fr: {
    label: 'Explorer les thèmes', browse: 'Parcourir les thèmes',
    items: ['Carte de la dette', 'Dette/PIB', 'Dette par habitant', 'Évolution de la dette', 'Tendance dans l’UE', 'Déficit & excédent', 'Charges d’intérêts', 'Dépenses & recettes'],
  },
};

function toolNavigationFor(pathname = '/') {
  const path = pathname.replace(/\/+$/, '') || '/';
  const locale = path.match(/^\/(nl|de|fr)(?:\/|$)/)?.[1] || 'en';
  const localePath = locale === 'en' ? path : path.slice(locale.length + 1) || '/';
  const relative = localePath === '/preview/debt' ? '/debt' : locale === 'nl' && localePath === '/preview/eu-debt' ? '/eu-debt' : localePath;
  const home = relative === '/' || relative === '/preview/home-atlas';
  if (!home && !CONTENT_PATHS.has(relative) && !/^\/country\/[a-z]{2}$/.test(relative) && !/^\/articles\/(?:[^/]+|page\/\d+)$/.test(relative)) return null;
  const text = TEXT[locale];
  return {
    label: text.label,
    browse: text.browse,
    home,
    items: TOOL_PATHS.map((route, index) => ({
      href: index === 0 ? home ? '#atlas-map' : `${localeAwareHref('/', locale)}#atlas-map` : localeAwareHref(route, locale),
      label: text.items[index],
      current: index === 0 ? home : relative === route,
    })),
  };
}

module.exports = { toolNavigationFor };
