# Homepage final audit

Reviewed: 2026-10-22 (Europe/Amsterdam).

## Scope and outcome

The local atlas homepage implementation was reviewed at `/`, `/nl`, `/de` and
`/fr`, using an optimized Next.js production build on `127.0.0.1:3001`.
No blocking defect remains in the checks below. This is not a deployment or a
Search Console traffic/ranking audit. The public website has not been changed.

## Corrections made

- The shared EU ticker's accessible name now includes its formatted amount.
  `aria-live="off"` prevents repeated automatic announcements. The visual ticker,
  official starting amount and calculation are unchanged.
- Keyboard focus uses a dark blue outline on light surfaces and a light blue
  outline on the blue hero and dark editorial sections. The contrast against
  the page background improved from 1.97:1 to 6.28:1; the light outline against
  the base hero blue is 6.38:1. Actual focused controls were checked in-browser.

Files: `components/home-preview/PreviewEUTicker.jsx`,
`components/home-atlas/home-atlas.module.css`,
`components/home-preview/home-preview.module.css`.

## Completed checks

| Area | Evidence | Result |
| --- | --- | --- |
| Production build | `npm run build` | Passed |
| Unit/regression suite | `npm test` | 218 passed, 0 failed |
| Lint | `npm run lint` | 0 errors, 30 existing warnings |
| Data validation | Existing prebuild validators | All stored fiscal snapshots passed; no data refresh performed |
| Article preservation | Existing prebuild publication and quality validators | 95 published URLs preserved; 95 articles passed mechanical checks |
| SEO preservation | `node scripts/verify-homepage-build.js` | Metadata, JSON-LD, FAQ answers and previous non-fragment links match the pre-redesign baseline in all four locales |
| Initial HTML | Build and HTTP verifiers | One H1, essential sections, 27 country links, ratios and periods per locale; no user interaction required |
| Preview isolation | Build verifier | Dutch design route stays noindex with no public canonical |
| Official displayed data | `node scripts/verify-homepage-http.js --base-url http://127.0.0.1:3001` | 108 country ratios and periods match stored generated data; EU total matches the common-period debt snapshot |
| Link destinations | Same HTTP verifier | 180 unique internal destinations returned HTTP 200 |
| Article images | Same HTTP verifier and browser inspection | 6 unique image requests returned image responses; visible article images decoded successfully |
| Responsive layout | Browser DOM geometry across all locales | 24 cases: 320, 390, 768, 1024, 1440 and 1920 px; no inspected text/control overflow |
| Country selection | Browser interactions, all 27 countries in each locale at 320 px | 108 selections: ratio, period, country link and text fit passed |
| Map semantics | Browser DOM and keyboard inspection | 27 named controls; displayed colors match ratio thresholds; Malta works with Enter |
| Navigation | Browser interactions | Explore action focuses country picker; selected-country link and comparison link reach their intended pages; mobile topic scrolling and relief toggle work |
| Accessibility structure | Browser DOM/accessibility inspection | No duplicate IDs; controls named; hidden duplicate article-image links excluded from keyboard/accessibility navigation; visible focus and ticker amount verified |
| Console | Production browser logs and server stderr | No errors or warnings observed during final production navigation |
| Whitespace | `git diff --check` | Passed |

The first test attempt inside the Windows sandbox encountered EPERM while
renaming temporary fixture files. The full suite was rerun through the normal
approved execution path and passed. The initial HTTP attempt was also blocked by
sandbox localhost permissions; the approved rerun passed. Neither failure was an
application defect.

## Reproducible checks and local evidence

The new `scripts/verify-homepage-http.js` accepts an explicit localhost base URL.
It compares rendered official data with the generated snapshots, checks the
screen-reader total and requests homepage destinations/images with bounded
concurrency. It does not refresh source data or contact production.

Ignored local evidence is stored in `reports/home-atlas/`:

- `http-audit.json`
- `layout-audit.json`
- `country-selection-audit.json`
- `final-audit-build.log`, `final-audit-tests.log`, `final-audit-lint.log`
- Final desktop/mobile screenshots

## Limits and existing observations

- Browser testing used the available Chromium-based in-app browser, not physical
  iOS/Android devices, Safari or Firefox. Viewport tests do not certify all devices.
- Reduced-motion handling was inspected in code/CSS; no operating-system motion
  preference was changed. No full screen-reader session or formal WCAG audit was run.
- No Lighthouse score, throttled-network benchmark or field Core Web Vitals claim
  is made. Rendered HTML was approximately 85–89 KB before transport compression.
- Search Console and analytics traffic data remain unavailable, so rankings or
  traffic preservation cannot be guaranteed.
- Existing lint warnings and the build's Edge Runtime deprecation warning are
  outside this homepage change. The development server previously reported the
  site's existing smooth-scroll configuration warning; it was not reproduced in
  the final production browser log.
- Article checks were mechanical preservation checks, not a new editorial review
  of all 95 articles or a live Eurostat source refresh.
# Release navigation check, 22 October 2026

The secondary homepage navigation now links directly to debt-to-GDP, debt per resident, debt growth, EU debt history, interest costs, and spending/revenue, alongside the map anchor. It no longer repeats the main navigation categories. Labels are localized in all four languages. The scroll control is available up to 1400px to accommodate longer translations.

After this change, lint passed with the same 30 existing warnings, all 218 tests passed, and the production build passed its data and 95-article audits. The rendered homepage verifier confirms the seven localized navigation destinations and unchanged metadata, structured data, FAQs and previous links. The local production HTTP audit passed 180 destinations and six homepage images; publication verification passed all 95 articles, 56 images, canonical checks, sitemap, translations, schema, redirects and real 404 behavior. Browser checks passed at 390, 1024 and 1440px in all four languages without page overflow; the mobile scroll control and debt-per-resident navigation worked with no console errors.

The user authorized publication. Remote main matched the starting commit `4b9eb5e2ea4681115ee5f03a71842a1c10d22d45`. The checks above describe local validation; preview and production require separate verification of the exact release commit.
