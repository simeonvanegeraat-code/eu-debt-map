# Eurostat data refresh — 21 October 2026

## Scope and release state

Refresh requested on 21 October 2026. Started from clean `main` at
`5a0af7260add559ee33a79a974e65e802d8a6ab7`, matching remote `main` at the
start of the task. The local data review below was completed before publication.
The user subsequently authorized publishing this checked update. Release
completion requires the clean-commit preflight, exact-deployment verification
and post-release production checks; local success alone is not a release result.
No Search Console submission is part of this task.

Existing importers generated all changed snapshots. No generated file was
edited manually. No production component, calculation methodology, layout,
advertising/consent configuration, URL or SEO configuration was changed.
Published article prose and dates were not rewritten to reflect a new vintage.

## Source review

Read the official API using the exact filters and URLs recorded in the
snapshots/importers. Final direct-source check: **2026-10-21 09:31:22 UTC**
(11:31:22 Europe/Amsterdam). Dataset landing pages:

- [Quarterly government debt — gov_10q_ggdebt](https://ec.europa.eu/eurostat/databrowser/view/gov_10q_ggdebt/default/table?lang=en)
- [EDP government deficit and debt — gov_10dd_edpt1](https://ec.europa.eu/eurostat/databrowser/view/gov_10dd_edpt1/default/table?lang=en)
- [Annual government accounts — gov_10a_main](https://ec.europa.eu/eurostat/databrowser/view/gov_10a_main/default/table?lang=en)
- [Population indicators — demo_gind](https://ec.europa.eu/eurostat/databrowser/view/demo_gind/default/table?lang=en)
- The existing inflation import request is defined by `scripts/eurostat-inflation-core.js`;
  its full official API URL and filters remain in `lib/inflation/inflation.gen.json`.

| Dataset/view | Latest period | Decision |
| --- | --- | --- |
| Quarterly debt and debt/GDP | 2026-Q2 | Updated for all 27 countries; source vintage 21 October, 11:00 +0200 |
| Quarterly history and debt growth | 2016-Q2–2026-Q2 (41 points) | Updated, including historical revisions |
| EDP budget balance and matched annual debt/GDP | 2025 | Updated, including revisions to earlier years; official EU aggregate retained |
| Debt per resident | Debt at 31 December 2025; population at 1 January 2026 | Updated debt/ratio inputs; population source remains 30 September |
| Annual interest costs | 2025 | New candidate rejected; previous complete snapshot retained |
| Annual spending/revenue/accounts | 2025 | New candidate rejected; previous complete snapshot retained |
| Inflation | September 2026 | Already current; direct comparison found no change, so original bytes retained |

The annual series must not be relabelled as 2026: the latest completed annual
period remains 2025. Quarterly figures end on 30 June 2026. Live amounts remain
modelled estimates extrapolated from the latest two official quarters, not new
observations or forecasts.

## Blocked annual-account refreshes

The 21 October `gov_10a_main` response contains **null** Danish (`DK`) revenue
(`TR`) observations for 2024 and 2025, in both euros and GDP percentages. The
same years are also null for the checked Danish balance (`B9`) euro series.
The raw status strings are empty: these are not finite values discarded as
forecasts by our parser. The requested annual time axis remains 2015–2025.

The existing accounts importer correctly fails with
`Government accounts: incomplete latest DK revenue`. The interest importer,
which needs revenue denominators, correctly fails with
`Interest snapshot: incomplete latest revenue: DK`. One initial interest
attempt also hit a transient `ECONNRESET`; retrying reached the same source-data
validation failure. A later direct API check confirmed that the null values
were still present.

Both complete previous snapshots retain their real July source vintage and
September retrieval timestamp. Their valid values were not overwritten, mixed
with a new vintage, reconstructed from other measures, or stamped as newly
updated. Neither validator was weakened. Re-run the two existing importers
when Eurostat supplies a complete, internally consistent response, then repeat
tests, build and rendered-page verification. Do not claim these two datasets
have received the October revision before that succeeds.

## Revision and consistency review

Compared observations by country **and reporting period**, not rolling-array
position. Against the previous checkout:

- All 27 countries have the new quarter; no carried-forward current values.
- In 40 overlapping quarters: 370 debt observations, 391 GDP ratios and two
  observation flags changed.
- In annual EDP history: 194 numeric balance/debt-ratio observations changed.
- In per-resident inputs: 52 numeric debt/debt-ratio observations changed.
- Current debt, short history, extended growth history and current ratios agree
  across every overlapping quarter/country, with normal floating-point euro
  conversion tolerance. Current debt and its short history share one snapshot ID.
- Annual EDP debt ratios and the per-resident ratio inputs agree for all 27
  countries in 2025.
- Four annual debt amounts differ slightly from the separately published
  2025-Q4 series: BE −0.1, DK +0.1, LV −0.1 and ES −0.2 million euro
  (annual minus quarterly). These are actual source observations, not import
  differences. Both original source values and their distinct datasets were
  retained; no forced equality or manual correction was applied.
- A fresh raw API comparison matched **2,603 numeric observations**, plus the
  quarterly flags, against the stored inputs. Inflation matched its existing
  complete snapshot apart from the deliberately ignored candidate retrieval time.

Selected official observations, not live modelled amounts:

| Country | Debt 2026-Q2, EUR million | Debt/GDP 2026-Q2 | EDP balance 2025 | Debt per resident, 2025 stock |
| --- | ---: | ---: | ---: | ---: |
| Netherlands | 523,795 | 43.7% | −1.6% | EUR 28,887 |
| France | 3,595,524.9 | 119.1% | −5.1% | EUR 50,065 |
| Germany | 2,924,674.2 | 63.4% | −2.9% | EUR 34,097 |
| Greece | 358,647 | 140.8% | +2.0% | EUR 35,016 |

The Dutch model now increases because official debt increased from 2026-Q1 to
2026-Q2. This is the result of the existing model, not a methodology change.

## Regression coverage and verification

Updated `scripts/country-dashboard.test.js` so source-integration assertions
follow each snapshot's actual period and raw values. Arithmetic and missing/
non-comparable-data behaviour retain explicit controlled test values.
`scripts/eurostat-growth-core.test.js` now always reconciles the shared
quarterly bundle, rather than silently skipping that check after July's vintage.

Executed successfully:

- `npm test`: **215 passed**, zero failures/skips.
- `npm run lint`: exit 0, **zero errors, 30 existing warnings**, including ignored
  deployment-cache copies and unchanged components. No cleanup outside scope.
- `npm run build`: all data validators and the article audit passed;
  **333 pages generated**. Existing Edge Runtime deprecation/static-generation
  warnings remain unrelated to the data update.
- `npm run verify:publication -- --base-url http://localhost:3028`:
  **95 articles, 56 images and three additional canonical checks passed**;
  sitemap, translation targets, Article schema, redirects and real 404 behaviour
  were verified.
- Local production HTTP checks: **148 pages** across four languages, including
  every EU27 country profile, all seven data topics, the EU debt page,
  methodology and home. HTTP status, self-canonical and indexability checks
  passed; all **28 Dataset nodes** retained a license. Home/country responses
  expose the new official quarter server-side.
- Browser checks: desktop Netherlands and France; **12 mobile pages** across
  English, Dutch, German and French at 390×844. No horizontal overflow or
  application console errors found. Official/live switching and the ten-year
  country chart were exercised. Viewport override was reset afterwards.

Local production preview: `http://localhost:3028/nl`.
Before a future authorized publication, recheck current remote `main`, run the
mandatory publication preflight from the exact clean release commit, verify the
exact preview, and verify the live site after release.
