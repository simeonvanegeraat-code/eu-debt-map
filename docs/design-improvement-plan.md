# Design improvement plan

The owner authorized implementing the typography and layout report step by step, with an explicit emphasis on design and preservation of content and SEO. This work follows the completed public-finance expansion and the separately published shared background theme.

Reference: [Dutch audit](../reports/typography-layout-2026-09-10/rapport.md), including measurements and recommendations for 233 public pages.

## Guardrails

- Keep the approved country-derived background tokens and existing product identity.
- Preserve published wording, heading hierarchy, URLs, redirects, metadata, canonical and language links, structured data, sitemap and robots behavior during visual changes.
- Preserve official data, calculations, periods, sources, advertising and consent behavior.
- Implement one reviewable design step at a time. Do not publish, commit or push without a new explicit request for that action.
- Compare English, Dutch, German and French, including long words and narrow screens. Use meaningful browser checks alongside lint, tests and a production build.
- An audit suggestion to shorten a title or rewrite an introduction is not authorization to change editorial content during a design-only step.

## Sequence

| Step | Scope | Status |
| --- | --- | --- |
| 1 | Repair mobile text clipping and homepage map anchor offset | Implemented; final preview verification on 12 September 2026 |
| 2 | Centralize font roles and type scale; pilot country, deficit, methodology and article templates | Pilot implemented and verified in preview; remaining page families pending |
| 3 | Align containers and introductory sections; improve where meaningful content begins | Planned |
| 4 | Improve mobile tables, chart labels and source lines | Planned |
| 5 | Refine editorial indexes and guides, preserving their content | Planned |
| 6 | Separately review advertising placement against reading hierarchy | Review only until any protected advertising changes are explicitly authorized |

For step 2, use Inter as the proposed common family, with distinct roles for titles, reading text, labels and tabular figures. Treat the report's sizes as starting points, not fixed values that override translation fit or semantic hierarchy. Do not combine the typography pilot with a page-order redesign.

## Step 1 implementation

- `components/methodology-preview/methodology-preview.module.css`: allow grid children to shrink, constrain mobile titles, and wrap long mobile section headings.
- `components/debt-to-gdp-preview/debt-to-gdp-preview.module.css`: the same overflow treatment for ratio comparison pages.
- `app/debt/debt.module.css`: shrinkable mobile grids, constrained titles, wrapping section headings and a stacked mobile closing action row.
- `components/home-preview/home-preview.module.css`: reserve 100px of scroll margin for the existing `#map` target.

These are CSS-only application changes. Mobile titles use `clamp(2.125rem, 9vw, 2.5rem)` with 1.08 line height, locale-aware hyphenation and an emergency word wrap. Existing desktop type sizes are preserved for the next step.

Evidence and limitations: [step 1 verification](../reports/design-step-1-2026-09-10/verification.md).

The preview runs at `http://127.0.0.1:3020/nl/methodology`. Step 1 has not been published. Two previously modified fiscal-plan documents are unrelated to this design step and have been preserved.

## Step 2 pilot

Implemented on 12 September 2026. `components/typography/typography.module.css` provides opt-in Inter font roles and responsive sizes for page titles, article titles, section headings, introductions, reading text and labels. It reuses the existing root font; there are no new dependencies or global font changes.

The shared country, deficit, methodology and four localized article templates use these roles. This covers 108 country routes, 62 articles, four deficit pages and four methodology pages. Related country section headings consume the same variables, with their original values retained as fallbacks elsewhere. Numeric display sizes, chart scales, navigation, layout order and published copy remain intact.

Typical sizes are 48px for desktop page titles and 34–35px on mobile; article titles are about 44px and 32–33px. Country titles also respect the width of their text column (about 43px in the 1280px test). Automatic hyphenation is limited where practical so normal words remain together. The existing mobile safeguards remain available for long words.

Validation: lint passed with 22 existing warnings, all 172 tests passed, production build passed, and content/SEO comparison passed on 184 routes. Browser checks covered 48 representative route/viewport combinations plus all 62 articles at 320px. Evidence: [step 2 verification](../reports/design-step-2-2026-09-12/verification.md).

Next: review this pilot, then apply the shared roles to the remaining page families within step 2. Container alignment and the position where page content begins remain step 3. Do not publish automatically. Both completed design increments remain local previews.
