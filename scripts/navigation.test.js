const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { COUNTRY_NAMES } = require('../lib/countries.js');
const { EU27 } = require('../lib/fiscal/indicators');
const {
  navigationFor,
  localeAwareHref,
  isActivePath,
  normalizeNavigationSearch,
} = require('../lib/navigation');
const { COUNTRY_DISCOVERY_ORDER, nextDiscoveryCountries } = require('../lib/country-discovery');
const { toolNavigationFor } = require('../lib/tool-navigation');
const { nextScrollNavigation } = require('../lib/scroll-navigation');

test('scroll navigation waits for deliberate movement and resets direction after a reversal', () => {
  const options = { enabled: true, locked: false, headerHeight: 128 };
  let state = { y: 200, direction: 0, distance: 0, hidden: false };
  for (const y of [204, 208]) {
    state = nextScrollNavigation(state, y, options);
    assert.equal(state.hidden, false);
  }
  state = nextScrollNavigation(state, 212, options);
  assert.equal(state.hidden, true);
  for (const y of [208, 202]) {
    state = nextScrollNavigation(state, y, options);
    assert.equal(state.hidden, true);
  }
  state = nextScrollNavigation(state, 200, options);
  assert.equal(state.hidden, false);
  state = nextScrollNavigation(state, 205, options);
  assert.equal(state.hidden, false);
  state = nextScrollNavigation(state, 201, options);
  state = nextScrollNavigation(state, 208, options);
  assert.equal(state.hidden, false, 'opposing small movements do not accumulate');
  assert.equal(nextScrollNavigation(state, 213, options).hidden, true);
});

test('top-of-page, mobile and menu/focus locks always reveal navigation and clear pending movement', () => {
  const hidden = { y: 500, direction: 1, distance: 100, hidden: true };
  for (const [y, options] of [
    [152, { enabled: true, locked: false, headerHeight: 128 }],
    [-20, { enabled: true, locked: false, headerHeight: 128 }],
    [700, { enabled: false, locked: false, headerHeight: 128 }],
    [700, { enabled: true, locked: true, headerHeight: 128 }],
  ]) {
    const state = nextScrollNavigation(hidden, y, options);
    assert.deepEqual(state, { y: Math.max(0, y), direction: 0, distance: 0, hidden: false });
  }
  const options = { enabled: true, locked: false, headerHeight: 128 };
  assert.deepEqual(nextScrollNavigation(hidden, 500, options), hidden, 'measurement changes without scroll do not change visibility');
});

test('tool navigation keeps localized destinations stable across content pages and highlights only the current tool', () => {
  const routes = ['/debt-to-gdp', '/debt-per-capita', '/debt-growth', '/eu-debt', '/deficit', '/interest-cost', '/government-spending'];
  for (const lang of ['en', 'nl', 'de', 'fr']) {
    const base = lang === 'en' ? '' : `/${lang}`;
    const home = toolNavigationFor(base || '/');
    assert.equal(home.home, true);
    assert.equal(home.items[0].href, '#atlas-map');
    assert.equal(home.items.filter(item => item.current).length, 1);
    const expected = [`${base || '/'}#atlas-map`, ...routes.map(route => base + route)];
    for (const route of [...routes, '/country/nl', '/articles/example', '/articles/page/2', '/inflation', '/debt', '/methodology', '/about', '/debt-vs-deficit', '/stability-and-growth-pact']) {
      const nav = toolNavigationFor(base + route);
      assert.ok(nav, `${lang}${route}: content navigation`);
      assert.equal(nav.home, false);
      assert.deepEqual(nav.items.map(item => item.href), expected);
      assert.deepEqual(nav.items.map(item => item.label), home.items.map(item => item.label));
      assert.deepEqual(nav.items.filter(item => item.current).map(item => item.href), routes.includes(route) ? [base + route] : []);
    }
    assert.equal(toolNavigationFor(base + '/government-spending/').items.at(-1).current, true);
    for (const route of ['/privacy', '/cookies', '/debug', '/ads-test', '/preview/home', '/unknown']) assert.equal(toolNavigationFor(base + route), null);
  }
  assert.equal(toolNavigationFor('/nl/preview/home-atlas').home, true);
  assert.equal(toolNavigationFor('/nl/staatsobligaties-nederland').items[0].href, '/nl#atlas-map');
  assert.equal(toolNavigationFor('/nlx/debt-to-gdp'), null);
  assert.equal(toolNavigationFor('/nl/debt-to-gdp-extra'), null);
});

test('country discovery reaches every EU country before repeating and offers two forward steps', () => {
  assert.equal(COUNTRY_DISCOVERY_ORDER.length, 27);
  assert.deepEqual([...COUNTRY_DISCOVERY_ORDER].sort(), [...EU27].sort());
  for (const start of EU27) {
    let current = start;
    const visited = [];
    for (let step = 0; step < 27; step++) {
      assert(!visited.includes(current), `Early repeat from ${start}: ${current}`);
      visited.push(current);
      const next = nextDiscoveryCountries(current);
      assert.equal(next.length, 2);
      assert(!next.includes(current));
      assert.equal(new Set(next).size, 2);
      assert.equal(next[1], nextDiscoveryCountries(next[0])[0]);
      current = next[0];
    }
    assert.equal(current, start);
    assert.deepEqual(visited.sort(), [...EU27].sort());
  }
  assert.deepEqual(nextDiscoveryCountries('nl'), ['DE', 'FR']);
  assert.deepEqual(nextDiscoveryCountries('DE'), ['FR', 'IT']);
  assert.deepEqual(nextDiscoveryCountries('FR'), ['IT', 'ES']);
  assert.deepEqual(nextDiscoveryCountries('unknown'), []);
  assert.deepEqual(nextDiscoveryCountries(null), []);
});

const SECTIONS = ['/', '/debt-to-gdp', '/debt-per-capita', '/debt-growth', '/eu-debt', '/debt', '/deficit', '/interest-cost', '/government-spending', '/inflation', '/articles', '/methodology', '/about'];

test('every navigation destination exists in all four locales without new duplicate routes', () => {
  for (const lang of ['en', 'nl', 'de', 'fr']) {
    const { groups, links } = navigationFor(lang, COUNTRY_NAMES);
    const sections = [...groups.filter(group => group.key !== 'countries').flatMap(group => group.items), ...links];
    assert.deepEqual(sections.map(item => item.href).sort(), [...SECTIONS].sort());
    for (const item of sections) {
      const href = localeAwareHref(item.href, lang);
      const file = path.join(__dirname, '..', 'app', href, 'page.jsx');
      assert(fs.existsSync(file), `Missing destination: ${href}`);
      assert(item.label.trim().length > 0);
    }
  }
});

test('country menus contain every EU27 profile once and sort by the displayed language', () => {
  for (const lang of ['en', 'nl', 'de', 'fr']) {
    const { groups } = navigationFor(lang, COUNTRY_NAMES);
    const countries = groups.find(group => group.key === 'countries').items;
    assert.equal(countries.length, 27);
    assert.deepEqual(countries.map(item => item.key).sort(), [...EU27].sort());
    for (const [index, item] of countries.entries()) {
      assert.equal(item.label, COUNTRY_NAMES[item.key][lang]);
      assert.equal(item.href, `/country/${item.key.toLowerCase()}`);
      if (index > 0) assert(countries[index - 1].label.localeCompare(item.label, lang) <= 0);
    }
    const prefix = lang === 'en' ? '' : lang;
    assert(fs.existsSync(path.join(__dirname, '..', 'app', prefix, 'country', '[code]', 'page.jsx')));
  }
});

test('mobile navigation controls are translated in every locale', () => {
  const keys = ['back', 'currentPage', 'searchCountries', 'noCountries', 'language'];
  for (const lang of ['en', 'nl', 'de', 'fr']) {
    const { t } = navigationFor(lang, COUNTRY_NAMES);
    for (const key of keys) assert.equal(typeof t[key], 'string', `${lang}.${key}`);
  }
});

test('country search normalizes the root English locale without throwing', () => {
  assert.equal(normalizeNavigationSearch('  Countries  ', ''), 'countries');
  assert.equal(normalizeNavigationSearch('  PAYS  ', 'fr'), 'pays');
});

test('active routes respect locale boundaries, exact home roots and nested article pages', () => {
  for (const locale of ['', 'en', 'nl', 'de', 'fr']) {
    const home = localeAwareHref('/', locale);
    const deficit = localeAwareHref('/deficit', locale);
    const article = localeAwareHref('/articles', locale);
    assert(isActivePath(home, '/', locale));
    assert(!isActivePath(deficit, '/', locale));
    assert(isActivePath(deficit, '/deficit', locale));
    assert(!isActivePath(`${deficit}-other`, '/deficit', locale));
    assert(isActivePath(`${article}/example`, '/articles', locale));
    assert(isActivePath(`${article}/page/2`, '/articles', locale));
    assert(!isActivePath(`${article}-other`, '/articles', locale));
    assert(!isActivePath('/fr/country/fr', '/country/fr', 'nl'));
  }
});

test('each page activates one navigation destination and unknown locales fall back to English', () => {
  for (const lang of ['en', 'nl', 'de', 'fr']) {
    const { groups, links } = navigationFor(lang, COUNTRY_NAMES);
    const items = [...groups.flatMap(group => group.items), ...links];
    for (const item of items) {
      const active = items.filter(candidate => isActivePath(localeAwareHref(item.href, lang), candidate.href, lang));
      assert.deepEqual(active, [item]);
    }
  }
  assert.deepEqual(navigationFor('unknown', COUNTRY_NAMES), navigationFor('en', COUNTRY_NAMES));
  assert.equal(localeAwareHref('/deficit', 'unknown'), '/deficit');
});
