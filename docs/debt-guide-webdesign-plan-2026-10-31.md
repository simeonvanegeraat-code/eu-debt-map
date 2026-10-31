# Government debt guide: webdesign plan

Status: implemented in four languages; public release authorized on
31 October 2026. See `debt-guide-preview-2026-10-31.md` for the initial preview
record and `debt-guide-release-2026-10-31.md` for the release scope and checks.

## Purpose and audience

Create one general guide to government debt, presented in English, Dutch,
German and French. Language does not imply a country focus. Visitors should
understand the basic concept, explore a simple example and then interpret the
European comparisons or select any of the 27 EU countries.

The country pages establish the visual quality reference: clear hierarchy,
purposeful visuals, restrained surfaces and an obvious next action. The guide
uses those principles for learning rather than duplicating a country dashboard.

Follow `docs/design-direction.md`: shared navy/blue surfaces, system typography,
open editorial layouts and restrained borders. Avoid green/mint brand accents
and a succession of decorative rounded cards.

## Proposed page structure

| Section | Reader outcome | Design |
| --- | --- | --- |
| Opening and definition | Understand government debt immediately | Concise title and definition, a small illustrative borrowing/repayment balance, two clear actions. |
| How governments borrow | Understand the mechanism | Four selectable steps with one diagram and a short explanation for the selected step. |
| Debt versus deficit | Distinguish a period's shortfall from an outstanding stock | Compact comparison, existing two-slider model, a visible caveat and primary source. |
| Who holds the debt | Understand the other side of borrowing | An open, labeled arrangement of creditor categories with concise explanations. |
| How to interpret debt | Understand the role of economic size and financing conditions | Two explicitly fictional economies demonstrate the debt/GDP ratio; a short list explains interest costs, maturity and confidence. |
| Explore real European figures | Apply the explanation | A neutral country selector containing all 27 countries and a separate EU comparison link. |
| Questions and sources | Find further detail and verify claims | Focused FAQs, clearly labeled primary sources and access to methodology. |

### 1. Opening

- Keep the recognizable shared hero background; reuse `--surface-hero` and its
  responsive fade rather than creating another gradient.
- Answer the title's question before mentioning deficits or bonds. Draft
  language must remain simple while the precise Eurostat definition stays
  accessible in the deeper explanation.
- Replace the introductory budget calculation with a simple stock example:
  EUR 100 borrowed, EUR 20 repaid, EUR 80 outstanding. Label it fictional and
  illustrative. It is neither official data nor a live estimate.
- Primary action: start the explanation. Secondary action: explore the figures.
- Keep review information subordinate to the definition and actions. Review
  dates must reflect actual editorial work, not the date a design was changed.
- Move the useful definition into this opening. Remove the separate five-part
  definition strip once its meaning is covered, avoiding another introduction.

### 2. Compact borrowing mechanism

Use four selectable steps instead of requiring several screen heights of
scrolling to advance the current diagram. Suggested concepts:

1. The government needs financing, including refinancing existing borrowing.
2. Investors provide money through a bond or loan.
3. The outstanding borrowing forms part of the debt stock.
4. Interest, repayments and refinancing follow their own schedules.

Desktop: step list and short explanation beside the diagram. Mobile: compact
step controls, explanation and diagram in normal document flow. The user can
choose any step or use Previous/Next; there is no autoplay, scroll locking or
timed progression. Labels are meaningful in every language.

Use appropriate keyboard navigation and visible focus. Do not communicate a
stage through color alone. Provide readable explanations even when animation
or JavaScript is unavailable, and respect reduced-motion preferences.

### 3. Debt and deficit model

- Preserve the new comparison and the direct destination
  `#debt-vs-deficit`. A redirected visitor must see the relevant question and
  definitions immediately rather than being sent to the top of the whole guide.
- Explain the difference once, then let the model demonstrate accumulation.
- Reuse the existing opening-debt and annual-deficit inputs. Preserve the
  calculation and do not introduce interest-rate assumptions or forecasts.
- Keep the simplified model's limitations and the explanation that actual debt
  changes need not equal deficits. Definitions and primary attribution remain
  available without requiring the reader to operate the model.
- Place a short route to real country/EU figures after the example, without
  automatically choosing a country based on language.

### 4. Creditors and economic meaning

Keep each section focused on a distinct question. Use an open labeled diagram
for creditor categories rather than a large decorative orbit with excessive
empty space. These are possible holders, not invented country-specific shares.

Combine the ratio explanation and the financial-risk context into a coherent
section. Two fictional economies with the same debt but different GDP provide
a simple ratio comparison. Clearly label fictional amounts and assumptions.
Avoid binary healthy/unhealthy labels or treating 60% as a safety certificate.
Retain the useful reference and link to the existing detailed comparison.

## Layout, typography and mobile

- Reuse shared type roles and page surfaces; keep changes scoped to the guide.
- Use one coherent content width aligned with the country-page system.
- Keep body paragraphs around 60–70 characters wide on desktop where practical.
- Size headings to fit their columns; test German and French wrapping rather
  than copying a fixed height from the Dutch version.
- On 390 x 844, the title, concise definition and primary action should be
  available in the opening viewport. The illustration may follow naturally;
  it must not displace the essential answer below a tall decorative opening.
- Stack explanations naturally on narrow screens. Interactive controls should
  offer approximately 44 px touch targets and remain usable at 320 px.
- Keep a compact chapter navigation with a discoverable mobile scroll/browse
  affordance. Align its sticky position with the site's header variables and
  scroll-up behavior; dropdown menus must remain above it.
- Remove full-screen minimum heights from individual learning steps. Whitespace
  should separate ideas rather than force scrolling to reveal the next sentence.
- Distinguish the core reading route from optional technical detail. Keep core
  definitions and model limitations visible; use expandable detail for the
  longer technical explanations and FAQs.

## Multilingual structure and protected behavior

- Use the same component structure and interactions in EN/NL/DE/FR. Move the
  English visual rendering into the shared guide experience as part of this
  page's work, while retaining each route's metadata ownership.
- Review translations for meaning and terminology; localize numbers, units,
  dates, creditor labels, controls, accessible names and internal links.
- Preserve `/debt`, `/nl/debt`, `/de/debt` and `/fr/debt`, their canonical URLs
  and language relationships.
- Preserve existing destinations:
  `#government-debt-in-one-sentence`, `#how-government-debt-works`,
  `#debt-vs-deficit`, `#who-holds-government-debt` and
  `#why-debt-to-gdp-matters`. Move them with the corresponding explanations,
  not to empty or unrelated placeholders.
- Keep all six published debt-versus-deficit redirects working in one hop.
- Retain source attribution and align FAQ structured data with visible answers.
  Update content/review dates only after the relevant substantive work is done.
- Do not refresh official snapshots, modify the live debt model, introduce new
  production dependencies or change advertising, consent, analytics, security
  policy or deployment configuration as part of the redesign.

## Implementation sequence and deliverables

1. **Content outline and wireframes:** finalize the purpose of every section,
   identify duplicated explanations and produce desktop/mobile layouts. The
   clickable four-step mechanism is the proposed interaction direction.
2. **Local preview:** build the shared experience and four noindex preview
   routes, reuse the established visual system and add translated copy. Keep
   the published experience available during design review.
3. **Verification and refinement:** check layout and behavior in all languages,
   compare screenshots and resolve any remaining wrapping or navigation issues.
4. **Authorized release:** integrate current remote main, retain the article
   inventory and publish only through the normal protected release workflow.

Expected implementation areas: `app/debt/DebtExperience.jsx`,
`app/debt/debt.module.css`, `components/debt-guide/LocalizedDebtGuidePage.jsx`,
guide translation modules, the English route's renderer and isolated preview
route wrappers. Existing public metadata exports remain in their route files.

## Acceptance checks

- The definition appears before concepts that require explanation.
- Every main section answers a distinct reader question; repeated introductions
  and the redundant definition strip are removed or integrated.
- The four-step mechanism is self-paced and keyboard/touch accessible.
- The model still produces EUR 1,100 from EUR 800 plus EUR 30 for ten years;
  its assumptions are explicit and actual source values are not modified.
- All existing anchor links, six redirects and direct article/budget links
  arrive at the relevant explanation in the selected language.
- Country selection includes all 27 countries and has no language-to-country
  assumption. All destinations preserve the selected language.
- No clipped text, diagrams or controls at 320 and 390 px; inspect tablet and
  desktop at 768 and 1440 px, including long translations.
- Header, chapter navigation, dropdowns, focus states, reduced motion, sources
  and FAQ controls behave correctly; check browser console errors.
- Run lint, the full test suite, article audit and production build. Add or
  update meaningful regression coverage for changed behavior.
- Run `scripts/verify-debt-guide-consolidation.js` and the full publication
  verifier against the local production build, then the exact preview and
  production origin during an authorized release. Preserve every article and
  translation relationship.
- Record a same-viewport comparison with the current page. Assess the reduction
  in unnecessary scrolling without imposing an arbitrary page-length target
  or claiming measured visitor improvements before real user testing.
