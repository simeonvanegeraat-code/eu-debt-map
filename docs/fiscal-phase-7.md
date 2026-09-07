# Phase 7 — Header and navigation

Completed locally on 7 September 2026 after explicit owner authorization. The owner subsequently requested Phase 8 and production publication; Phase 9 and Phase 10 remain outside that instruction.

## Outcome

The existing header now groups the expanded platform into Debt, Public finances and Countries. Dutch labels are Schuld, Begroting and Landen. Articles, Methodology and About remain direct links; the logo returns to the localized map. The Debt menu retains the explainer and EU history. Spending and revenue share their existing combined route. All 27 country profiles are sorted by their localized names.

Desktop uses button disclosures with real links, active page indications, Escape and outside/focus dismissal. Mobile uses a native modal with collapsible groups, an explicit Tab/Shift+Tab loop, background isolation, scroll locking, close/backdrop/Escape handling and focus restoration. Enlarging the viewport closes the mobile dialog and focuses the visible brand link. Language switching retains translated article slugs, archive fallbacks, query strings and anchors. Navigation links disable bulk prefetching, so opening the country list does not fetch 27 dashboards.

## Files and data

- `components/Header.jsx`: shared desktop/mobile navigation, language controls and accessible modal.
- `app/globals.css`: header panels and responsive mobile navigation; established brand, colors and width retained.
- `lib/navigation.js`: shared destinations, translations, locale paths and active-state helpers; no fiscal snapshot imports.
- `scripts/navigation.test.js`, `scripts/layout-stability.test.js`, `package.json`: destination, locale, country coverage and active-state regression checks.
- `docs/public-finance-expansion-plan.md`, this report: durable progress record.

No data source was fetched or changed. No new calculations, public URLs, dependencies, model behavior, metadata, sitemap entries or deployment configuration were introduced.

## Verification

- Final `npm test`: **163 passed**, including four new navigation tests.
- Final `npm run lint`: **0 errors, 22 remaining pre-existing warnings**, down from 24 after replacing the old drawer effects.
- Final `npm run build`: **passed**, 191 static pages, all fiscal validators and the 62-article audit passed. No standalone typecheck applies to this JavaScript project.
- Final production capture: **230 routes returned HTTP 200**. All 227 sitemap entries, metadata, canonicals/hreflang, schema, headings, main-content links, selected response headers and integration contracts match Phase 6. Text-hash differences on 24 English country pages are confined to hero numbers from the later build's existing modelled counters.
- All **156 localized navigation destinations** appear as real server-rendered links; every header disclosure references one existing unique ID.
- A 509-file pre-phase manifest confirms that only four pre-existing implementation/test files changed. All prior fiscal helpers/snapshots, article content, assets, configuration and model files are identical.
- Browser review covered EN/NL/DE/FR; desktop at 1280px and the 1180px breakpoint; mobile at 390px and 320px, plus a 768px tablet. Sampled headers/panels had no horizontal overflow. Screenshots reviewed desktop disclosures, localized mobile groups, the country grid and tablet backdrop.
- Tested menu switching, active groups/pages, country navigation to Malta, new per-resident and spending routes, localized homepage return, article pagination and translation with a preserved `#content` anchor. The Dutch map selector, total-debt mode and link to the Netherlands dashboard still work.
- The final explicit focus loop was verified in both directions: last language button → close button, close button → last language button. Escape restores the menu trigger and clears the body scroll lock. Clicking the tablet backdrop closes the dialog. Closed language controls retain valid ARIA relationships.
- No warnings/errors were captured in the sampled browser flows. No physical devices, exhaustive screen-reader test or Core Web Vitals measurement was performed.

Evidence is in the system temp directory: `eu-debt-map-fiscal-phase-7-final-20260907.json`, `eu-debt-map-phase-7-before-20260907.json`, `eu-debt-map-phase-7-{tests,lint,build,verification}.log` and the focused verification script.

## Preview

Phase 7: `http://127.0.0.1:3016/nl`. Phase 6 was preserved in `eu-debt-map-phase-6-preview-20260907` on port 3015 before rebuilding. All seven previews on ports 3010–3016 responded with HTTP 200 at the phase boundary. These remain local previews. Production publication is handled in the subsequent, explicitly authorized Phase 8 delivery.
