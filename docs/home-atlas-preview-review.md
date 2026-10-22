# Home atlas preview: design and SEO review

Reviewed: 2026-10-21. Scope: local implementation of the atlas homepage at `/`,
`/nl`, `/de` and `/fr`, plus the isolated Dutch design route.

The completed production-build audit and subsequent accessibility corrections
are recorded in [the final audit](home-atlas-final-audit.md), reviewed 2026-10-22.

## Homepage integration

The four public home routes render `HomePageExperience`, now composed from
`HomeAtlasExperience` and server-rendered `HomeAtlasContent`. They still use
`generateLocalizedHomeMetadata` from `components/LocalizedHomePage.jsx`. Their
URLs, titles, descriptions, canonicals, hreflang links, Open Graph and Twitter
metadata have not been changed. Neither have robots, sitemaps or the shared
layout's Organization structured data.

The separate `/nl/preview/home-atlas` route declares `noindex`, `nofollow`,
`nocache` and no canonical. Its metadata is not imported by the public routes.
The new topic navigation consists of real links, available in the initial HTML
and on both desktop and mobile; the mobile arrow only scrolls that navigation.

## Preserved content and interaction changes

- The short visible introduction identifies EU government debt in every locale.
  Eurostat attribution, the official anchor, covered-country count and modelled
  live-estimate labels remain visible.
- All 27 localized country links and ratios remain in the initial HTML. Reference
  periods are now shown alongside each ratio; no selection is required.
- The median ratio, largest debt stock and common-period coverage remain below
  the hero. The five-year chart still uses `fiveYearOverview(growthSnapshot)`.
- Latest article selection, article images and links, explanatory text, FAQ
  answers, source descriptions and methodology links reuse the existing components
  and localized copy. Editorial article files and dates have not been changed.
- The hero map now focuses on debt-to-GDP. Quarterly changes and total debt are
  available through explicit links below the country directory, and country pages
  retain their detailed figures. The three old map modes are not duplicated.
- Country selection supports keyboard, pointer and touch. Small countries remain
  accessible through the dropdown and directory; Malta has a separate map marker.
- Blue action blocks use a short staggered border-light animation. It pauses on
  hover/focus and is disabled by the reduced-motion preference.
- The original `#map` and `#country-directory` anchors remain. Head metadata,
  sitemap, robots, advertising, consent and analytics configuration are untouched.

## Verification

- `npm run lint`: zero errors; 30 existing warnings.
- `npm test`: 218 tests passed.
- `npm run build`: passed, including the existing data and article validation.
- `node scripts/verify-homepage-build.js`: all four rendered homepages retained
  their metadata, JSON-LD, FAQ answers, previous non-fragment links and 27 country
  links compared with the pre-change build. The preview remains noindex.
- A local baseline was captured with `--capture` before changing the shared
  homepage wrapper, in ignored `reports/home-atlas/homepage-baseline.json`.
  Without that baseline, the verifier still checks essential rendered sections,
  country links, indexability and preview isolation.
- Browser review covers desktop/mobile layouts, localized routes, map selection,
  keyboard selection of Malta, the country-page link, comparison action, mobile
  topic scrolling and relief toggle. No application errors were observed; Next
  reports an existing global smooth-scroll configuration warning.

This is a local implementation review, not a Search Console, traffic, ranking or
field-performance audit. No traffic preservation guarantee is implied. Publication
remains a separate, explicitly authorized action; nothing has been deployed.

## Primary guidance reviewed

Accessed 2026-10-21:

- Google Search Central, [Mobile-first indexing best practices](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing).
- Google Search Central, [Crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable).
- Google Search Central, [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
