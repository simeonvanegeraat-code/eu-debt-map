# Government debt guide preview

Initial preview record. Public release was subsequently authorized; see
`debt-guide-release-2026-10-31.md` for the production integration.

Implemented the approved design in a shared preview experience for English,
Dutch, German and French. The public guide, its metadata and the six published
debt-versus-deficit redirects remain unchanged.

## Routes and implementation

- `/preview/debt`, `/nl/preview/debt`, `/de/preview/debt`, `/fr/preview/debt`.
- Each preview is noindex, with no inherited canonical. No sitemap entries.
- `components/debt-guide-preview/DebtGuidePreview.jsx` owns the shared rendering;
  `GuideControls.jsx` supplies self-paced steps, chapter navigation, the model
  and country selection. `guide-copy.js` contains reviewed locale-specific copy.
- The opening defines debt immediately and labels its 100 minus 20 example as
  fictional. All previous guide fragment destinations are preserved.
- Four selectable borrowing steps replace the scroll-driven sequence. Direct
  selection, previous/next and arrow/Home/End keyboard navigation are available.
  No autoplay or forced scrolling. A noscript fallback exposes every step.
- `lib/debt-guide-model.js` preserves the illustrative linear calculation,
  slider ranges and defaults. No official data or live-counter model changes.
  A readable table accompanies the visual chart. No additional interest model.
- The country selector starts empty and contains all EU27 countries, sorted by
  localized name. Language never implies country selection; destinations retain
  the language. There is also a separate EU comparison link.
- The guide reuses shared hero surfaces and header positioning variables.
  Topic-navigation recognition is extended only to the new preview paths.
- No new dependencies, public SEO changes, advertising changes or deployment.

## Editorial basis

Official definitions and the deficit/debt distinction were checked on
31 October 2026 against Eurostat's `gov_10dd` metadata and its January 2026
deficit-debt explainer. Creditor categories follow the ECB's 2021 analysis;
no historical holding shares are presented as current figures. The existing
EU Treaty Protocol 12 source remains linked for the 60% reference value.
Monetary examples and both GDP comparisons are explicitly fictional. Source
links and consultation date are visible in each language.

## Verification

Lint: no errors, 15 existing warnings. All 247 tests passed, including four
new tests for accumulation, zero-deficit and boundary cases, invalid model
inputs and localized preview topic navigation. The initial restricted-sandbox
test run exposed a nested main landmark, which was fixed, and temporary-file
rename restrictions; the complete rerun outside the sandbox passed.

Production build: 337 static pages generated. Article audit: 105 passed.
The consolidation verifier passed all six direct redirects and four public
guides. Full local publication verification passed 105 article pages, 66
images, canonicals, translations, schema, sitemap and 404 behavior.

Browser checks cover 320, 390, 768 and 1440 px in every language. No horizontal
overflow or clipped headings/controls was found. All country selectors start
empty with 27 countries. At 390 px the definition and primary action are in the
opening viewport. Tested step selection and End keyboard navigation, model
minimum/maximum deficit, German language switching with fragment preservation,
and navigation from the German guide to Italy. Header dropdowns remain above
chapter navigation. A queued chapter-position callback could run after unmount
during rapid navigation. It now checks disposal and the live navigation ref.
Replaying preview-to-country navigation with viewport changes in all four
languages produced no console errors in a fresh browser tab.

Screenshots and local logs are in ignored `reports/debt-guide-redesign/`.
At the same 1440 x 1000 viewport the closed-state Dutch document height changed
from 12,326 to 5,334 CSS pixels. This measures layout length, not reader outcomes;
the four borrowing steps are now selectable instead of requiring long scrolling.

At the initial preview stage, published FAQ schema remained untouched. The
subsequently authorized release generates FAQ schema from the final visible
copy and retains route-owned metadata. See the release record.
