const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { COUNTRY_NAMES } = require('../lib/countries.js');
const { EU27 } = require('../lib/fiscal/indicators');
const { navigationFor, localeAwareHref, isActivePath } = require('../lib/navigation');

const SECTIONS = ['/', '/debt-to-gdp', '/debt-per-capita', '/debt-growth', '/eu-debt', '/debt', '/deficit', '/interest-cost', '/government-spending', '/articles', '/methodology', '/about'];

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
