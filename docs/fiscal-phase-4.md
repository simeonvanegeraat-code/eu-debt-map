# Phase 4 — Government interest expenditure

Completed locally on 6 September 2026 following the owner's authorization. Phase 5 has not started. No commit, push, pull request or deployment was made.

## Outcome

`/interest-cost` and its Dutch, German and French equivalents show official annual government interest expenditure for all 27 EU countries. The page adds a GDP-scaled map, four ranking modes, exact annual values, separate euro/GDP trend charts, year-on-year changes and an explicitly dated debt comparison. Existing country pages gain a compact four-metric interest section and expandable history. There are no duplicate country routes or artificial live interest counters.

The shared map, country geography, ranking/search and chart discontinuity helper are reused. The existing visual language, header and prior fiscal features remain. Header restructuring is still Phase 7.

## Verified definitions and sources

The following primary sources were reviewed on 6 September 2026:

- [Eurostat annual government finance metadata](https://ec.europa.eu/eurostat/cache/metadata/en/gov_10a_main_esms.htm): ESA 2010 annual general-government accounts, interest expenditure, units, consolidation and currency conversion.
- [Eurostat demographic indicator metadata](https://ec.europa.eu/eurostat/cache/metadata/en/demo_gind_esms.htm): the official average annual population denominator.
- [ESA 2010, Regulation 549/2013, paragraph 4.50](https://eur-lex.europa.eu/eli/reg/2013/549/oj/eng): interest accrues over time and is assigned to the period in which it accrues, independently of the cash-payment date.

| Measure | Dataset | Filters |
| --- | --- | --- |
| Annual interest amount | `gov_10a_main` | `freq=A`, `sector=S13`, `na_item=D41PAY`, `unit=MIO_EUR` |
| Interest / GDP | `gov_10a_main` | `freq=A`, `sector=S13`, `na_item=D41PAY`, `unit=PC_GDP` |
| Government revenue denominator | `gov_10a_main` | `freq=A`, `sector=S13`, `na_item=TR`, `unit=MIO_EUR` |
| Average annual population | `demo_gind` | `freq=A`, `indic_de=AVG` |

The API labels `D41PAY` as **Interest, expenditure** and `AVG` as **Average population - total**. The geography is current EU27 throughout, mapping Eurostat `EL` to site code `GR`. All four inputs cover 2015–2025, with 297 observations each. The three government-account responses share source update `2026-07-21T11:00:00+0200`; population has its own update `2026-07-21T23:00:00+0200`. Access was `2026-09-06T12:26:11.662Z`. Exact query URLs and filters are stored in the generated snapshot and displayed in the expandable methodology.

S13 interest and revenue are consolidated within general government; subsector totals must not be added to recreate this series. Interest expenditure is an accrued expense, without subtracting interest receipts. Principal repayments are excluded. It is not the entire financing burden or the weighted average interest rate on government bonds.

Eurostat converts annual national-currency flows using annual average exchange rates; historical euro-area observations can use fixed conversion rates. Euro amounts are nominal, not inflation adjusted. Currency effects can affect historical euro comparisons.

## Calculations and period alignment

- Euro amount = published million euro × 1,000,000.
- Interest/GDP uses Eurostat's published percentage directly.
- Interest per resident = annual interest in euro / official average population for the same calendar year. Eurostat defines the average using population on 1 January of that year and the next. This is different from the matched stock dates used for debt per capita in Phase 2; neither earlier input nor its methodology was changed.
- Interest/revenue = `D41PAY / TR × 100`, using identical units, sector, year and government-account source vintage. Revenue is included only as this denominator; no Phase 5 spending/revenue page has been created.
- Annual euro change = year Y minus exactly Y−1. Relative annual change divides this difference by the positive starting value. GDP changes are percentage points. Missing endpoints are never replaced by nearby years.
- The headline is the sum of all 27 countries' annual interest expenditure, **EUR 357.4916 billion in 2025**, marked with the combined source flags. It is not a budget of EU institutions or an unweighted country average. No EU GDP ratio is reconstructed from rounded country ratios.
- Rankings descend by the selected measure, using displayed precision: whole euro or one decimal for percentages. Equal displayed values share competition rank, and search retains EU rank. Map colours always encode interest/GDP, independently of ranking choice; bands are descriptive, not legal or sustainability thresholds.

For the Netherlands in 2025, the source records EUR 8.496 billion interest, 0.7% of GDP, EUR 510.195 billion revenue and 18,087,118 average residents. Derived figures round to EUR 470 per resident and 1.7% of revenue. Annual interest increased EUR 614 million, or 7.8%, from 2024; the published GDP ratio was unchanged at one-decimal precision. The provisional flags remain visible.

The adjacent debt comparison uses the separately dated annual `gov_10dd_edpt1` data already stored in Phase 2, only when its debt year matches the interest year. Its methodology link exposes its own source update/access dates (the government-debt source was updated 22 April 2026). This is not a harmonized revision of the quarterly debt/model inputs. No interest/debt rate is calculated. Country modules explicitly distinguish their annual interest period from quarterly or modelled debt elsewhere on the page.

## Data integrity and delivery

Run `npm run update:interest` only for an intended refresh. The initial successful refresh on this Windows host used `node --use-system-ca scripts/update-eurostat-interest.js`, retaining TLS certificate verification through the system trust store. The new annual adapter makes four filtered API requests and reuses the JSON-stat decoder. It validates dataset identity, axes, filters, periods, geography, source timestamps and observations before replacement.

The government accounts must share their latest reporting year and source vintage. Current/future years and forecasts are excluded. Latest-year coverage must be complete for all four inputs and all 27 countries. A refresh cannot regress periods/access/source dates or discard a previously valid observation within the retained history. Historical gaps may remain null. Zero interest is valid; denominators must be positive. Derived uncertainty includes all inputs, comparisons crossing `b`/`d` breaks are withheld, and chart segments do not bridge gaps or marked breaks. Provisional/estimated and other source flags remain visible; revisions can also occur without flags.

The updater writes a temporary file, validates its serialized contents, then renames one complete bundle. Failure preserves the previous snapshot. `prebuild` validates the local 42.3 KB generated snapshot; a normal build or page visit does not call Eurostat. The interactive page receives transformed annual country series, not raw API responses. No dependency was added.

## Important files

| Area | Files |
| --- | --- |
| Definitions, calculations and ranking | `lib/fiscal/interest.js` |
| Generated data | `lib/fiscal/interest.gen.json`, written by the updater only |
| Annual source adapter and integrity | `scripts/eurostat-annual-source.js`, `eurostat-interest-core.js`, `update-eurostat-interest.js`, `validate-eurostat-interest.js`, `eurostat-interest-core.test.js` |
| Page and interaction | `components/fiscal/InterestPage.jsx`, `InterestExplorer.jsx`, `InterestHistory.jsx`, `FiscalTrendChart.jsx` |
| Country, sources and localization | `components/fiscal/CountryInterest.jsx`, `InterestSource.jsx`, `interest-copy.js`, `interest.module.css` |
| Routes | `app/interest-cost/page.jsx` and the `/nl`, `/de`, `/fr` wrappers |
| Integration | Four country route wrappers, `CountryClient.jsx`, `CountryPageExperience.jsx`, methodology page, footer, sitemap, `package.json` |
| Durable notes | This report and `docs/public-finance-expansion-plan.md` |

New routes have localized titles/descriptions, canonical/hreflang links and WebPage/Dataset/Breadcrumb schema. The derived Dataset credits EU Debt Map and cites Eurostat, without implying endorsement. Four interest URLs are added to the sitemap; affected country/methodology modification dates reflect the substantive addition. Existing metadata and structured data remain intact.

## Verification

- `npm test`: **140 passed**, including 11 interest tests covering source validation, shuffled axes/Greece, source vintages, annual periods, calculations, denominators, flags/breaks, rank ties, aggregation, saved observations, non-regression, failed/successful updates and locale integration.
- `npm run lint`: **0 errors, 24 pre-existing warnings**, no new fiscal warnings.
- `npm run build`: **passed**, 187 static pages; local data validators and the 62-article quality audit passed. Existing Edge-runtime warnings remain. Typecheck: not applicable — JavaScript project with no separate static type checker.
- Production route capture: **226 HTTP 200 routes**, including 223 sitemap URLs. All 222 Phase 3 routes remain; exactly four interest routes were added. Existing metadata, canonical/hreflang, structured data, selected headers and integration contracts match the Phase 3 capture.
- Article, asset and original generated-Eurostat fingerprints are unchanged. Separate hashes verify unchanged earlier fiscal snapshots/page components, quarterly/model inputs, home trend implementation and Next configuration.
- All four interest locale pages were inspected at desktop 1280×800 and mobile 390×844, retaining 27 ranking rows without document-level horizontal overflow. Dutch map, legends, ranking and charts, all localized heroes, and mobile country modules were visually reviewed. Small-screen graph labels were enlarged after the first review.
- All four ranking modes produced the expected leaders (Italy for GDP, euro amount and per resident; Hungary for revenue share). Dutch search retained Netherlands rank, no-results/clear worked, French `Suede` matched `Suède`, and keyboard selection of Malta worked. Country selection changed the history. Expanded history exposed 11 annual values, and mobile horizontal scrolling reached the final ranking columns.
- Representative English/Greek, Dutch/Netherlands, German/Germany and French/France country routes show the new interest module alongside earlier fiscal content without mobile overflow. Dutch desktop and French mobile histories expand into two charts. Country-to-methodology and the separate debt-source links reach the correct dated source sections, including all exact API filters.
- Existing homepage map modes and its Malta country selector were exercised. No browser warnings/errors were captured in sampled production flows.

Temporary route evidence: `eu-debt-map-fiscal-phase-4-final-20260906.json`, compared with `eu-debt-map-fiscal-phase-3-final-20260906.json`, in the system temp directory. The tracked diff and Phase 4 files pass whitespace checks. A broader check also identified an existing extra final blank line in the earlier `lib/eu-map-geography.js`; that unrelated file was preserved.

## Previews and boundaries

| Preview | URL |
| --- | --- |
| Phase 1, preserved | `http://127.0.0.1:3010/nl/deficit` |
| Phase 2, preserved | `http://127.0.0.1:3011/nl/debt-per-capita` |
| Phase 3, preserved during Phase 4 | `http://127.0.0.1:3012/nl/debt-growth` |
| Phase 4, cumulative | `http://127.0.0.1:3013/nl/interest-cost` |

All four previews returned HTTP 200, and the three earlier previews contain no interest-page footer link. These local previews require their local processes to remain running. The Phase 3 frozen build lives in the system temp directory, `eu-debt-map-phase-3-preview-20260906`; rebuilding the repository no longer overwrites it. The project note and phase reports preserve decisions and progress. A push is a separate backup/publication decision, not a requirement for retaining the task context.

Verification does not include physical devices, exhaustive screen-reader review, Lighthouse/Core Web Vitals measurement or production advertising behavior. Statistical revisions remain possible; refreshes are explicit and unscheduled. The Phase 0 model-consistency and mobile-drawer focus findings remain separately scoped. **Stop after Phase 4. Phase 5 requires the owner's next instruction.**
