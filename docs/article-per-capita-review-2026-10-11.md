# Dutch debt-per-capita article: targeted review

Review date: 11 October 2026. Status: published after explicit user approval and verified live.

## Editorial brief

- Locale and scope: Dutch, all EU-27 countries, Q1 2026 debt / January 2026 population.
- Genre and reader question: analysis; which countries have the highest debt per
  resident, and what does that tell us?
- Update an existing article. The user reports good Google performance; Search
  Console was not accessed. Preserve the URL, publication date, headline, SEO
  title, image and complete 27-country ranking. No redirect or consolidation.
- Main answer: Belgium, Italy and France lead this comparison, but debt per
  resident is neither a personal liability nor a complete fiscal risk measure.
- Considered approaches: replace the ranking with the annual tool; rewrite as an
  opinion; retain the quarterly analysis and strengthen the path to the tool.
  Choose the third to preserve the reader intent and useful existing material.
- Destination: `/nl/debt-per-capita`, where readers can select a country on a map
  or dropdown and inspect debt, population, debt/GDP and the searchable ranking.
- Original contribution: explain the weighted national-debt calculation and the
  distinction from Eurostat's consolidated EU debt; retain Germany/Greece as an
  example of the limits of ranking by population alone.
- Strongest objection: visitors may see different amounts on the linked tool.
  Explain the reference dates beside the first link, not only in a footer.
- Boundary: this is not a data refresh of the annual tool or country dashboards.
  No independent human editorial approval or reader test has been performed.

## Claim ledger and reproducible check

Official inputs were opened and queried on 11 October 2026:

- Quarterly release, published 21 July 2026; next release listed as 21 October:
  https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-21072026-ap
- Quarterly dataset, `gov_10q_ggdebt`, `freq=Q`, `time=2026-Q1`, `sector=S13`,
  `na_item=GD`, `unit=MIO_EUR`; source updated 21 July 2026:
  https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt?lang=en&freq=Q&time=2026-Q1&sector=S13&na_item=GD&unit=MIO_EUR
- Population, `demo_gind`, `freq=A`, `time=2026`, `indic_de=JAN`; source updated
  30 September 2026:
  https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_gind?lang=en&freq=A&time=2026&indic_de=JAN

The read-only calculation used the 27 country codes from the annual snapshot,
mapping internal `GR` to Eurostat `EL`. For each country: debt in millions of
euros × 1,000,000 / population, rounded after division to €100. Every existing
country amount and their ordering were confirmed; no country value was changed.

- Sum of national Q1 debts: €15,913,839.9 million.
- Sum of January populations: 451,990,314.
- Weighted result: €35,208.364885 per resident, displayed as approximately €35,200.
- Eurostat consolidated EU debt: €15,704,593 million.
- Difference: €209,246.9 million, matching the release's €209,247 million in
  intergovernmental lending within rounding. Explain both aggregates explicitly.
- Q1 debt data are provisional; population may be provisional or estimated.
- These are original derived values, not an official Eurostat per-capita series.

The destination was inspected in source and on the public website. Its saved
snapshot uses debt on 31 December 2025 / population on 1 January 2026. It must
not be described as the same Q1 ranking or a live-moving counter. Both anchor
targets exist: `per-capita-ranking-title` and `debt-per-capita-methodology`.

## Prose-edit record

- Keep the direct quantitative opening, unlike the question-led budget article,
  the illustrative electricity-network investment article and the recent
  Greece/France comparison. This is a targeted edit, not a formulaic rewrite.
- Correct the summary's attribution: the per-capita result is our calculation
  using Eurostat inputs, not a number directly published by Eurostat.
- Add a descriptive link after the introductory explanation, a ranking link
  after the country table, and a methodology link where the calculation matters.
  Each has a distinct reader purpose; no keyword-only link block was inserted.
- Remove the unchecked historical Italian population-change assertion; explain
  the denominator's mechanism without adding a new time-series claim.
- Replace the unsupported claim that the date mismatch is "small enough" with
  its actual limitation: January–March population changes are not included.
- Clarify weighting and consolidation, the main reasoning step likely to confuse
  readers. Retain the strongest objection about differing destination amounts.
- Shorten the table header to "Per inwoner" and add column-header scope. Retain
  all 27 rows; the table has three columns and fits on mobile without scrolling.
- Ending: connect the ranking to fiscal capacity and interest costs instead of
  merely repeating the title. The Germany/Greece contrast earns that conclusion.
- Model-based spoken-language review only; no human listening or reader feedback.

## Verification

- Article audit passed: 75 articles, zero errors.
- Focused article tests passed: 24 tests.
- Full suite passed: 195 tests. The initial sandbox run failed on temporary-file
  rename permissions; the approved rerun outside the sandbox passed.
- Production build passed. The initial sandbox build failed on path access;
  the approved rerun passed. Existing Edge Runtime warnings remain.
- Desktop browser: 1,270px content viewport, no horizontal document overflow.
- Mobile browser: 390 × 844 override, 380px content viewport; document width
  equals scroll width; table width 348px, entirely within the viewport. All 27
  rows remain available. The table was also visually inspected.
- The new introductory link was activated with Enter and reached the local
  debt-per-capita page, showing the annual period and the expected tool.
- No captured browser console errors. Temporary mobile viewport reset.
- SEO regression checks preserve slug, titles, publication date and all country
  amounts; they also require the early link and explicit period distinction.

Only the Dutch article, its focused regression test and this note were changed
for this request. No shared data, other locale articles, canonical/hreflang
configuration, advertising or production state was changed. Rankings and link
click-through effects remain unmeasured.

## Publication — 11 October 2026

After explicit approval, published against the current live source manifest,
reusing all 603 other source files unchanged. No Git commit or push was made.
The first live check identified that the ranking's DOM anchor is
`per-capita-ranking-title`, not the section prop `per-capita-ranking`. Corrected
the article link, regression expectation and this note, then reran the article
audit (75 articles), focused tests (24 passing) and whitespace check successfully.

Final deployment `dpl_FxPBVAfPaTt2NUTXzmKG69WajADA` reached `READY` with both
production domain aliases. The public article returned HTTP 200 with the updated
date, introductory link, corrected ranking link and period distinction. Both
ranking and methodology anchors were verified in the live destination HTML.
The Vercel production build passed. No unrelated website work was published.
