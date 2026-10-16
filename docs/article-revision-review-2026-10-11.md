# Dutch article revision review

Completed: 2026-10-11. Source access and substantive content review: 2026-10-10.
Scope: three existing Dutch articles, with their public URLs, original publication
dates, images, translation mappings, and genre classifications preserved.
No deployment, commit, shared data refresh, or automatic translation was performed.

## Editorial decisions

### Dutch budget room

File: `content/articles/nl/2025/hollandse-paradox-bezuinigen-bij-lage-staatsschuld.json`.

- Reader question: why consider budget restraint when Dutch government debt is low?
- Main answer: the debt stock provides room, but recurring commitments still need
  a credible funding path; spending cuts are not the only possible response.
- Chosen angle: the distinction between a national observation and the new budget
  forecast. This is more useful now than speculation about the coming Prinsjesdag.
- Original contribution: explain why a falling debt ratio can coexist with a
  deficit, and distinguish permanent commitments from a temporary project.
- Strongest detail: the CBS June observation alongside the December 2027 forecast,
  explicitly labeled with different dates and statuses.
- Clarified reasoning: deficits do not translate one-for-one into debt changes
  because cash buffers and financial transactions also matter.
- Fair objection: ill-timed restraint can damage services and investment. The
  section on policy alternatives addresses this rather than dismissing it.
- Cut: outdated pre-Prinsjesdag political framing, duplicated conclusions, the
  wide comparison table, and old exact interest projections not reverified here.
- Ending: ask about recurrence, benefits, and downside risk for a specific measure.

### European public investment

File: `content/articles/nl/2025/europa-schuldendilemma-investeren-voor-de-toekomst.json`.

- Reader question: when does borrowing for public investment make sense?
- Main answer: durable social value can justify borrowing, but is different from
  a project financing its own repayment.
- Chosen angle: an explicitly illustrative electricity-network project, rather
  than a catalogue of investment sectors or a dramatic aggregate spending claim.
- Original contribution: separate social benefits, government receipts, funding
  sources, and responsibility for downside risk.
- Strongest detail: identify the familiar Draghi amount as a 2024 estimate, not a
  newly calculated 2026 borrowing requirement.
- Clarified reasoning: a project's social benefits do not all accrue to the public
  budget. Government debt sustainability therefore needs a separate fiscal test.
- Fair objection: not investing also has costs. Retained before asking whether a
  delayed or underused project remains affordable.
- Cut: misleading trillion terminology, overlapping FAQ and citizen checklists,
  and fragmented subsections. One decision checklist remains.
- Ending: require a funding explanation that survives a downside scenario.

### Euro-area debt risk

File: `content/articles/nl/2025/eurozone-hidden-debt-timebomb-extended.json`.

- Reader question: what does the debt ranking reveal, and what does it miss?
- Main answer: level and direction must be interpreted with financing structure,
  budget flows, and the economic outlook.
- Chosen angle: the contrasting Greek and French paths, rather than another
  opening asserting that a crisis is or is not imminent.
- Original contribution: connect a comparable quarterly ranking to refinancing
  mechanics and the distinction between real and nominal economic growth.
- Strongest detail: Greece and France moved in opposite directions over the same
  reference year. This is not sufficient to rank their overall credit risk.
- Clarified reasoning: current bond yields are not the effective rate on all debt;
  higher market rates feed through as debt is refinanced.
- Fair objection: excessive cuts can undermine growth. The fiscal-policy section
  preserves this limitation instead of assuming consolidation is costless.
- Cut: repeated time-bomb rebuttals, the wide table, older forecast comparisons,
  and an outdated financial-stability report presented as current market evidence.
- Ending: assess whether an improvement survives weaker conditions, not just the
  ranking at the next release.

## Claim ledger: retained numerical anchors

All links below were inspected on 2026-10-10. Sources, access dates, and relevant
periods are also recorded in each article's `sources` and `sourceNote` fields.

- [CBS half-year release, 23 September 2026](https://www.cbs.nl/item?sc_itemid=9a2b2d6f-f90b-488d-9266-c8baf42e832b&sc_lang=nl-nl):
  provisional national debt observation, June 2026; not a Eurostat-wide Q2 ranking.
- [Miljoenennota 2027, tables 1 and 5](https://www.rijksfinancien.nl/miljoenennota/2027):
  future Dutch debt and annual balance forecasts, not observed outcomes.
- [Eurostat release, 21 July 2026](https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-21072026-ap):
  provisional Q1 debt ratios and annual changes, fixed EA21 composition. The
  page identifies 21 October 2026 as its next release.
- [ECB historical projection table](https://www.ecb.europa.eu/mopo/devel/ecana/html/table.sr.html):
  September 2026 staff forecast, distinct from earlier spring projections.
- [Draghi report, Part A, chapter 5](https://commission.europa.eu/document/download/97e481fd-2dc3-412d-be4c-f152a8232961_en?filename=The+future+of+European+competitiveness+_+A+competitiveness+strategy+for+Europe.pdf):
  historical annual additional public/private investment estimate, not new public debt.
- [EIB Investment Report 2025/2026](https://www.eib.org/en/publications/20250379-investment-report-2025):
  publication date and public-financing context; no invented project results.
- [Council fiscal framework](https://www.consilium.europa.eu/en/policies/economic-governance-framework/):
  reference values, expenditure paths, and conditional investment flexibility.

## Prose and presentation review

Openings and structures were compared with the Dutch articles on 2027 interest
costs, the changing EU debt trend, and the EU debt burden. The revisions avoid
their repeated crisis disclaimers, statistical opening, and FAQ/conclusion pattern.
The three revised pieces open respectively with a public-budget question, an
illustrative physical investment, and a country contrast.

A model-based spoken-language pass was performed, not human listening. Technical
terms are explained in context; repetition and long numerical lists were removed.
No independent human reader test or human editorial approval was performed.

Browser checks used the local production build on desktop and a 390 × 844 mobile
viewport. All three pages fit without horizontal document overflow. Both sets of
number cards stack on mobile; article bodies no longer contain wide tables. The
link to the Dutch country page was exercised successfully. No browser console
errors were captured during those checks.

## Verification and remaining boundaries

- `npm run audit:articles`: passed, 75 articles checked.
- `npm test`: passed, 194 tests, including revised content regression coverage.
- `npm run build`: passed, 332 generated pages. Existing Edge Runtime warnings remain.
- `npm run lint`: passed with zero errors and 44 warnings in existing code/cache files.
- Targeted `git diff --check`: passed.

The shared country dashboard still uses its stored Eurostat Q1 snapshot; the
newer CBS observation does not replace or silently alter that snapshot. Other
language editions have not received these editorial or forecast updates.
Search Console performance was not accessed, no URLs were consolidated, and no
ranking, Discover, or audience-comprehension improvement has been measured.

## Publication verification — 11 October 2026

Published after explicit user approval. Deployment `dpl_CGongRWfMoDpZBRMbZPDEkqHXHhc`
reached `READY` and received both production domain aliases. Its source manifest
was compared with the immediately preceding live deployment
`dpl_CysbDBKrz3Pzv6XvCNt518b5DeYC`: only the three reviewed Dutch article JSON
files changed; all other 601 source files were reused unchanged. Unrelated local
work was not published. No Git commit or push was performed.

All three public article URLs returned HTTP 200, contained the revised text and
10 October review date, retained canonical markup, and contained no wide HTML
tables. The production build completed successfully. Search ranking effects
remain unmeasured.
