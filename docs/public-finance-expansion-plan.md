# European Public Finance Expansion Plan

Status: Phases 0–8 completed and published as `b91c815`. Phases 9–10 completed locally on 8 September 2026; cumulative preview on port 3019, with Phase 9 retained on port 3018. The owner has now explicitly authorized committing, pushing and publishing the reviewed Phases 9–10 through the existing production integration. See the final audit for verification and remaining model/accessibility/performance limitations.

Audit reviewed: 5 September 2026. Delivery status updated: 8 September 2026. Original repository baseline: `d553c79`; Phase 9 baseline: `b91c815`.

This is the durable project note for expanding EU Debt Map. It records the owner's proposed phases, the repository audit, and recommended adjustments. Phase 0 changed documentation only; the owner subsequently authorized Phases 1–7, followed by Phase 8 and production publication, then Phases 9 and 10 individually. Completing a phase does not authorize further implementation, data refreshes, commits, pushes, or deployment.

## 1. Product direction and delivery rules

Keep the existing website, routes, working functionality, and visual identity. Expand its subject from government debt to **European government finances**, helping visitors answer: “How healthy are European government finances?”

Include debt, deficit/surplus, revenue, expenditure, government interest expenditure, and carefully defined fiscal comparisons. Population is a calculation input for per-resident measures, not a new general-interest section. Do not add unrelated Eurostat topics or a generic data explorer. Do not introduce an unsupported composite “fiscal health score”.

Use the existing navy, EU blue, white, editorial typography, open rows, and restrained containers. Follow `docs/design-direction.md`; green is reserved for meaningful data states rather than a recurring new interface accent.

Work on one numbered phase at a time. Inspect its affected implementation, explain the intended change, implement, verify, report, and **stop**. Continue only after the owner explicitly requests the next phase. Internal steps within a phase do not authorize starting another phase.

Keep JavaScript. There is no TypeScript migration or framework migration in this project plan. Preserve the existing locale model: English at the root, Dutch/German/French under `/nl`, `/de`, `/fr`. Review translated meanings, links, labels, and metadata in each delivery.

## 2. Current architecture

### Framework and repository structure

The installed/package-declared stack is **Next.js 16.3.2, React 19.2.8**, JavaScript/JSX, App Router, CSS Modules plus global CSS. `README.md` and the project-purpose sentence in `AGENTS.md` still say Next.js 14; those descriptions are stale. `npm run lint` runs ESLint 9 directly. The current Next.js guides are available under `node_modules/next/dist/docs/` and should be consulted for implementation work.

The project uses `react-simple-maps` through its React 19-compatible package alias and Recharts 2.15.4. Vercel configuration exists; there is no `.openai/hosting.json`. No new hosting system or production dependency is needed for the proposed expansion.

| Area | Active implementation | Implication for expansion |
| --- | --- | --- |
| Site shell | `app/layout.jsx`, `app/globals.css`, `components/Header.jsx`, `components/Footer.jsx` | Retain the header, footer, consent/advertising behavior, and established layout. |
| Localized routes | Explicit root/NL/DE/FR route files; `lib/locale.js`, `lib/countries.js`, feature copy modules | Thin locale wrappers around shared features already work. |
| Homepage | `components/HomePageExperience.jsx` → `components/home-preview/HomePreviewExperience.jsx` | The `preview` directory name does not imply unused code: these components power production routes. |
| EU map | `components/home-preview/HomeMapPreview.jsx`, `public/maps/countries-110m.json` | Active map already supports debt/GDP, quarterly euro change, and total debt. |
| Country pages | Four `app/**/country/[code]/page.jsx` wrappers → `app/country/[code]/CountryClient.jsx` → `components/country/CountryPageExperience.jsx` | Reuse the existing 27 country URLs in each language. Route wrappers own locale-specific metadata and special country copy. |
| Debt/GDP ranking | `components/debt-to-gdp-preview/DebtToGDPPreviewPage.jsx` and its copy/CSS files | Search, sorting, official/modelled modes, comparison bands, and mobile rows are available as patterns. |
| Historical EU charts | `components/LocalizedEUDebtPage.jsx` → `app/eu-debt/ChartsClient.jsx` | Server prepares compact totals/breakdown props; Recharts renders area/bar charts. |
| Homepage historical chart | `components/home-preview/HomeTrendPreview.jsx` | Lightweight SVG chart, but imported inside the homepage client subtree. |
| Methodology | `components/methodology-preview/MethodologyPreviewPage.jsx` and `methodology-copy.js` | Already explains definitions, snapshots, formula, safeguards, revisions, and sources. Extend it. |
| Articles | `content/articles/{lang}/{year}`, `lib/articles.js`, `lib/articlePageCore.cjs`, `content/article-translations.json` | Shared article metadata/schema and translation relationships; do not fold articles into indicator snapshots. |
| Verification | `scripts/*.test.js`, validators, `.github/workflows/ci.yml` | CI runs lint, tests, and build; the build validates stored data and article quality. |

Some older implementations remain: the body of `LocalizedHomePage.jsx`, `EuropeMap.jsx`, `EuropeMapClient.jsx`, `DebtToGDPList.jsx`, and `CountryFacts.jsx`. The current homepage still imports its metadata function from `LocalizedHomePage.jsx`, but uses the newer visual experience. Do not extract new shared components from an obsolete branch of this import graph or delete apparently old files without checking consumers.

### Current map and country experience

The active map uses local geometry, an azimuthal equal-area projection, country-name-to-ISO mapping, and localized country links. It is dynamically loaded with SSR disabled; crawlable country links also exist outside the map. Hover/focus previews a country, while the country selector and separate Cyprus/Luxembourg/Malta controls make small countries accessible. Malta has no separate shape in the rendered low-resolution map; the controls and directory provide coverage.

The country experience provides an official/modelled debt switch, debt/GDP, quarter-to-quarter movement, modelled pace, EU rank, comparisons, an explicitly labelled country median, sources, localized related articles, and sharing. It has **two-quarter comparison bars**, not an existing multi-year country debt chart. The proposed country debt trend therefore requires adding a real historical series view.

Country comparisons use a fixed illustrative set (`GR`, `IT`, `FR`, `NL`, `EE`) plus the current country. The suggested next-country list combines alphabetic neighbors and major economies. These are not geographic-neighbor calculations.

### Current SEO and discovery

Canonical URLs use `https://www.eudebtmap.com`; the apex-to-www redirect is in `vercel.json`. Existing redirects are in `next.config.mjs`. Static/localized page and country metadata are owned by route wrappers or feature copy helpers. Articles use shared metadata/schema helpers.

The root emits `Organization` JSON-LD. The current homepage and ordinary country pages do not add a general page-specific Dataset/WebPage schema; special German/French debt-clock routes add breadcrumbs. Debt/GDP emits WebPage/BreadcrumbList, methodology emits TechArticle/Dataset/BreadcrumbList, and the EU history page emits Article. Article schemas distinguish editorial types.

`app/sitemap.js` explicitly lists localized sections, all country pages, and published articles. It currently uses the debt snapshot timestamp for all general static/country entries. RSS, the news sitemap, article pagination, and translation mappings have dedicated helpers/tests. Preview/debug indexing rules are separate from published routes.

The root HTML initially declares `lang="en"`. Localized layouts use `DocumentLanguage` to set the language with an inline script and effect; the browser ends up with the correct language, but raw HTML remains English. Keep this distinction in the later SEO/accessibility audit. `x-default` coverage also differs between country route variants.

## 3. Current Eurostat pipeline

### Official debt and ratio snapshots

1. An explicit `npm run update:data` runs `update:debt`, then `update:ratios`. Builds do not run those updates. The old `fetch:data`/`fetch:history` commands point to the shared update workflow.
2. `scripts/update-eurostat-debt.js` requests `gov_10q_ggdebt` with `freq=Q`, `sector=S13`, `na_item=GD`, `unit=MIO_EUR`, the 27 countries, and the last 20 quarters. It maps app code `GR` to Eurostat `EL`.
3. `scripts/eurostat-debt-core.js` decodes JSON-stat by dimension order/strides, accepts a single selected value in dimensions other than geography/time, normalizes quarter keys, and converts million euros into euros.
4. It builds the latest two observations per country plus country history, complete EU27 sums, partial quarters, and update reports. Missing or regressed country responses retain last-known-good observations with their original periods. Only complete 27-country history rows appear in the EU total series.
5. Generated debt/history outputs are validated before replacement, share a snapshot ID/timestamp, and are written through temporary/probe files with rollback handling. This is not a transaction covering every indicator: the ratio update is a separate operation and can fail after debt has updated.
6. `scripts/update-eurostat-ratios.js` requests the same quarterly debt dataset with `unit=PC_GDP`, reading eight quarters but storing only the latest ratio per country. It reuses the debt parser and has its own validated replacement/report.
7. `lib/data.js` combines country identity, official snapshots, reference periods, fallback behavior, and model helpers into `countries` objects consumed by the UI.
8. `prebuild` validates both snapshot families, debt/history correspondence, and article quality before Next.js builds the site. Normal fiscal views need no live Eurostat response.

| Stored file | Observed content on 5 September 2026 |
| --- | --- |
| `lib/eurostat.debt.gen.js` | All 27 countries at 2026-Q1, previous period 2025-Q4; fetched 31 July 2026 at 11:54:33 UTC. |
| `lib/eurostat.debt.history.gen.js` | 20 complete quarters, 2021-Q2–2026-Q1, no partial quarters; same snapshot ID/time as debt. |
| `lib/eurostat.ratio.gen.js` | All 27 countries at 2026-Q1; fetched 31 July 2026 at 16:55:06 UTC; latest ratios only. |

These are observations about the committed local snapshots, not a claim that they contain every subsequent Eurostat revision. No data update was executed during Phase 0.

### Modelled debt and the remaining runtime GDP path

The country model derives a per-second rate from the latest two official euro debt stocks and elapsed reference time. After the latest date, `interpolateDebt` adds elapsed seconds times that rate. `lib/data.js` includes rate normalization, a ±€50,000/s cap, date fallbacks, and a freeze for a country more than one quarter behind the dominant country period. That freeze is relative to other countries; it does not stop all counters when the entire snapshot becomes old.

The optional modelled debt/GDP ratio scales the official ratio by `modelled debt / official debt`, only when the official debt and ratio periods match. Its GDP basis is held fixed.

There is also an older runtime GDP fallback: `CountryClient.jsx` can call `/api/gdp`, backed by `lib/eurostat.live.js`, if the official ratio is missing. It uses `namq_10_gdp`, `B1GQ`, `CP_MEUR`, `SCA`, annualizes one quarterly observation by multiplying by four, and caches for six hours in memory/session storage. `/api/gdp-all` exposes the related bulk path. All current countries have official ratios, so this path is dormant in ordinary current country views. It must not become the denominator source for new official fiscal metrics. `lib/eurostat.gen.js` contains another legacy GDP helper used by debug code despite its generated-looking filename.

The source definition for quarterly Maastricht debt is documented in [Eurostat's quarterly debt metadata](https://ec.europa.eu/eurostat/cache/metadata/en/gov_10q_ggdebt_esms.htm), reviewed 5 September 2026.

## 4. Findings that affect the expansion

| Priority / timing | Finding and evidence | Recommended handling |
| --- | --- | --- |
| Before trusting a unified live total | `home-preview/PreviewEUTicker.jsx` starts from the official total and adds time since page load. Country counters add time since the official reference date. Reloading the homepage resets its starting value. Reduced-motion mode freezes that homepage number at the official total. | Record a separate focused model-consistency repair before combining model outputs. Use one shared “value at timestamp” calculation and make reduced motion affect animation only. This protected model change requires explicit scope; it was not implemented in Phase 0. |
| Required in Phase 1 | `parseEurostatDataset` in `scripts/eurostat-debt-core.js` accepts only quarter keys and drops values `<= 0`. Directly reusing it would drop deficits and balanced budgets and reject annual observations. | Separate JSON-stat decoding from period/value rules. Keep debt's positive-only validation in its adapter; allow signed and zero balances in the new adapter. Add regression tests before sharing decoding. |
| Required in Phase 1 | Current parsing verifies dimension cardinality, but does not retain/check all requested dimension labels, source update metadata, or observation status flags. EU aggregates are classified as unknown geographies. | Validate exact returned filters; preserve flags and source dates; explicitly allow EU27_2020 as an aggregate in new dataset adapters. Keep countries and aggregates separate. |
| Required for comparisons | “Dominant period”, “latest available period”, and “latest complete period” are different concepts. Some ranking/map code assumes a single period or derives a page label from one country. The homepage sums countries in the dominant debt period even if coverage drops below 27. | New rankings use a selected common period, expose coverage, and show missing entries. Never label a partial sum as a complete EU total. Do not relabel carried-forward observations as current. |
| Required in Phase 3 | Twenty quarterly observations cover 19 quarter-to-quarter intervals: the stored 2021-Q2–2026-Q1 window is 4.75 years. There is no historical debt/GDP snapshot. | Fetch/retain at least 21 points for a true five-year endpoint comparison and 41 for ten years; retrieve matching official ratio history. Select exact period keys, not array offsets. Correct existing “5-year change” wording when that historical work is in scope. |
| Required when extracting data helpers | `lib/data.js` mixes country identity, snapshots, demo seeds, rates, and rendering convenience fields. `Number(null)` is treated as zero in some homepage map/median paths. | Introduce explicit null-safe observations and pure selectors. Never carry demo values or missing-to-zero conversion into new indicators. Keep existing debt exports compatible until individually migrated. Current validated snapshots mask these missing-data risks. |
| Required when touching source/fallback UI | The dormant GDP fallback can calculate a ratio while the country experience uses the “Official” detail label. Methodology says missing ratios are not substituted. Model date strings also truncate stored UTC quarter-end timestamps to date-only anchors. | Resolve label/definition and anchor-time consistency in a targeted follow-up; do not silently remove or repurpose the fallback during a deficit feature. |
| At the relevant UI extraction | Active home/map/ranking/country experiences import global debt data directly, and formatting, scales, period labels, country lists, and ranks are repeated. Homepage history enters its client subtree. | Pass compact prepared view models. Extract useful shared parts from active components incrementally; avoid multiplying full-country histories across every client feature. |
| Ranking contract | Existing ranking assigns rank after sort direction; France changes from #3 to #25 when sorting lowest-first. Filtering retains the selected ordering's position. | Define new indicator EU rank independently of table sort/search, including a documented tie policy. Do not confuse row position with a stable fiscal rank. |
| Mobile accessibility | Opening the mobile drawer leaves keyboard focus on the hamburger. Pressing Tab moves to the background map controls while the drawer is open; Escape closes it. | Add focus entry, containment, and return when navigation is in scope. The current layout fits mobile, but this is an observed accessibility issue. |
| SEO maintenance | Country wrappers duplicate metadata logic; generic schemas are limited; static sitemap dates follow debt only; debt/GDP links a fixed July 2026 release regardless of later snapshot periods. | Give new indicators shared metadata/source helpers from launch. Review existing SEO contracts incrementally with regression coverage, then comprehensively in Phase 9. |
| Documentation/build maintenance | README/AGENTS stack descriptions are stale. Build warns about the Edge runtime used by social images. Lint reports 24 existing warnings. | Record as maintenance work; do not combine unrelated framework, lint, or advertising changes with indicator delivery. |

The first row is a current inconsistency, not a proposed change to the meaning of official statistics. The remaining high-priority data rows explain why the existing infrastructure should be extended carefully rather than copied unchanged.

## 5. Recommended architecture

### Keep the local-snapshot architecture

Use a small, explicit pipeline:

```text
Eurostat dataset + verified filters
        ↓ explicit update command
Shared HTTP/JSON-stat decoding + dataset-specific adapter
        ↓ validation, revision/coverage report, safe replacement
Compact versioned local snapshots
        ↓ server-side selectors and reproducible calculations
Indicator page / existing country page
        ↓ small props for interactive islands
Shared map, ranking, trend chart, metric row, source note
```

No database, browser-side raw Eurostat downloads, generic dashboard builder, or new production package is needed initially. Build-time consumption of checked-in snapshots fits the current site. Fetch only through intentional update scripts; public page requests must not refresh fiscal snapshots.

### Distinguish three contracts

**Dataset definition:** dataset ID, reference-metadata URL, exact filters, geography mapping, units/conversion, frequency, accounting basis, expected coverage, and update policy. Dataset-specific rules remain close to the adapter. Deficit, population, and debt cannot share positive-value or quarter-only assumptions.

**Indicator definition:** stable ID, units and display precision, stock/annual-flow meaning, source or calculation dependencies, localized labels/explanations, rank direction, scale bands/reference markers, methodology anchor, and available localized routes. A dataset can supply several indicators; a calculated indicator can depend on more than one dataset. Presentation metadata must not determine accounting definitions.

**Observation:** country or aggregate code, value or explicit `null`, reference period/frequency, unit, provenance, observation flags, source snapshot ID, and status such as observed/missing/carried-forward. Derived values additionally retain input observation periods/IDs and calculation version. Modelled debt additionally records its evaluation timestamp and model version. Keep fetched-at, source-updated-at, reviewed-at, and reporting period distinct; an unavailable source timestamp stays null.

Potential files, introduced only when needed:

```text
scripts/eurostat/json-stat.cjs       # shared decoding, no fiscal sign assumptions
scripts/eurostat/fetch.cjs           # timeout, bounded retry, clear errors
scripts/eurostat/<dataset>.cjs       # exact filters, transforms, validation
scripts/update-fiscal-<name>.js      # explicit per-dataset update entry point
scripts/validate-fiscal-data.js     # validate the added snapshot families
lib/fiscal/indicator-registry.cjs   # shared definitions usable by Node and Next
lib/fiscal/selectors.cjs            # pure period/coverage/ranking helpers
lib/fiscal/calculations.cjs         # only calculations actually introduced
lib/fiscal/data.server.js           # server-only snapshot selection/composition
lib/fiscal/generated/<name>.gen.js  # generated; never hand-edited
components/indicators/              # shared active visual components
components/indicators/<name>-copy.js # reviewed localized public text
```

These paths are a proposal, not files created in Phase 0. Use CommonJS `.cjs` for pure helpers shared by existing Node scripts/tests and the app, as the article helpers already do. Do not introduce a build tool simply to share configuration. Keep existing `lib/eurostat*.gen.js` outputs and `lib/data.js` interfaces working while adding new adapters.

A minimal first implementation needs a signed annual decoder/adapter, a small registry, period-aware selectors, and map/ranking/source/metric reuse. A generic chart abstraction can wait for a second real trend use case. Do not rename every `preview` folder as a prerequisite.

### Data and calculation rules

- Preserve the fixed EU27 country cohort, independent of historical membership; do not accidentally use the euro area. Map `EL`/`GR` centrally and explicitly distinguish EU27_2020 from country records.
- For a default cross-country ranking, select the latest complete comparable period. If a newer partial view is useful, label it as partial, retain every country row, and exclude missing observations from ranking calculations.
- Preserve positive, negative, zero, and missing as different states. Do not interpolate missing observations, connect chart gaps as real observations, or use a previous year as if it were the selected year.
- Compare annual fiscal flows with annual flows and end-year debt with the stated year-end stock. Country pages may display the newest quarterly debt beside annual deficit, provided each number has its own conspicuous period label. Joint calculations require a documented period match.
- Prefer official Eurostat EU ratios where available. A country median, simple country average, population-weighted per-capita measure, and official consolidated EU aggregate must have different names. Do not average country debt/GDP percentages and call the result “EU debt/GDP”.
- For a per-resident country-sum comparison, use `sum(country debt) / sum(matched resident populations)` over the same cohort and dates. Label the numerator as a sum of national debts; do not silently substitute the official EU debt aggregate.
- Budget balance keeps Eurostat's sign: positive surplus, zero balance, negative deficit. Improvement is `current balance − previous balance`, measured in percentage points for GDP ratios. A move from −5% to −3% is +2 pp.
- A deficit is not identical to the change in gross debt. Avoid deterministic statements that a surplus must reduce debt or that a deficit alone determines debt pressure. Debt ratios also depend on GDP and stock-flow effects. [Eurostat's deficit/debt metadata](https://ec.europa.eu/eurostat/cache/metadata/en/gov_10dd_esms.htm) explains this distinction; reviewed 5 September 2026.
- Store enough validated history for the offered endpoints and revisions. Do not accept an old source response that silently regresses the latest record. When preserving a previous valid observation, preserve its provenance and report that it was retained.
- Validate dependent snapshots as a compatible bundle before publishing calculated metrics. Use a shared release manifest/IDs if multiple files must move together; timestamps alone do not prove compatibility. Request a consistent refresh and inspect revisions across complete dependency windows.
- Provide an exact numeric/text alternative to every map/chart. Use a visible zero baseline for signed balances, clear reference markers, predictable bands, keyboard access, and small-country controls. Missing data gets a separate style. Do not use color alone to communicate surplus/deficit or official/modelled status.
- Render explanatory text, source notes, and an initial ranking in server HTML. Send the browser only the current indicator's comparison rows or a selected country's trend. Retain useful server-readable navigation even when charts/maps load later.

## 6. Adjustments to the original phase plan

Keep the owner's numbered order and stop rule. Make these changes to the execution approach:

1. Treat source registration, period handling, basic accessibility, localized SEO, and methodology as part of each feature's definition of done. Phases 8–9 consolidate/audit them; they are not the first time these requirements are implemented.
2. Build the minimum shared foundation inside Phase 1, then expand it only when another indicator needs it. Avoid a separate large architecture rewrite.
3. Treat Phase 3 as a historical-data expansion as well as a visualization task. Existing snapshots cannot deliver the requested five-/ten-year debt and ratio comparisons.
4. Research population freshness before choosing a table. Eurostat's population metadata identifies `demo_gind` as potentially more current for national totals than detailed demographic tables. Compare it with `demo_pjan`; choose one documented population definition consistently. [Eurostat population metadata](https://ec.europa.eu/eurostat/cache/metadata/en/demo_pop_esms.htm), reviewed 5 September 2026.
5. For the first debt-per-capita view, prefer end-year debt in year Y matched with population on 1 January Y+1. This makes the stock dates closely aligned. If the product later uses a newer quarterly stock with annual population, display both periods and explicitly describe the population proxy; do not silently present it as an exact same-date measure.
6. Source annual interest, spending, and revenue coherently. `gov_10a_main` is the candidate family for Phases 4–5. Its annual revenue minus expenditure is B.9, but timing/revisions can make it differ from EDP B.9; do not force reconciliation or overwrite the Phase 1 headline series. [Eurostat annual government-finance metadata](https://ec.europa.eu/eurostat/cache/metadata/en/gov_10a_main_esms.htm), reviewed 5 September 2026.
7. Add modest links as new sections launch. Reserve the complete menu reorganization for Phase 7, so earlier pages are discoverable without prematurely building a large navigation system.
8. Track the existing live-total inconsistency as a separate, explicitly scoped repair. It is not a reason to change official debt data or to implement a new model during this audit.

## 7. Phase-by-phase roadmap

All routes below are proposed additions, with equivalent locale-prefixed routes following reviewed translations. No new indicator page is published merely because its URL appears here.

### Phase 0 — Audit and plan — COMPLETE

Deliver this note, map the existing architecture and data flow, establish checks, record gaps, and recommend a minimal expansion design. No website or data changes. Stop.

### Phase 1 — Budget deficit/surplus — COMPLETED LOCALLY

Primary route: `/deficit`. Proposed source: `gov_10dd_edpt1`, annual general government (`A`, `S13`), net lending/net borrowing (`B9`), `PC_GDP`. The official metadata supports the EDP balance concept; verify exact live dimension codes, statuses, reporting years, EU27 coverage, and revisions during this phase before implementing the adapter. Phase 0 is not a production data sign-off.

Implement the minimum common data/indicator contracts, validated local annual balance history, an EU map with surplus/zero/deficit distinctions, and a ranking from largest surplus to largest deficit. Show current year, previous year, change in pp, and stable EU rank. Mark −3% as the EU deficit reference value, not an automatic finding of illegality; consult current primary EU sources for that explanatory text.

Explain government balance, debt versus deficit, and why the measure matters. Enrich existing country pages with a compact official balance module and a meaningful link back to the comparison. Put debt/GDP beside balance where useful, with explicit periods; use a matched year-end debt observation for any same-year joint analysis. Do not imply causation or sustainability from two values alone.

Deliver all locale text/metadata/source notes, source dataset ID and access/update dates, appropriate page schema, sitemap inclusion, and modest internal links. Tests must cover a negative balance, surplus, exact zero, missing values, year changes, sign of improvement, −3% boundary, tied ranks, Greece mapping, partial EU27 coverage, and mismatched periods. Recheck existing debt routes and stop after Phase 1.

### Phase 2 — Debt per capita — COMPLETED LOCALLY

Route: `/debt-per-capita`. Use official debt and one verified Eurostat resident-population series. Prefer the matched stock dates described above; record numerator/denominator provenance. Show the map, ranking, euros per resident, total debt, debt/GDP, and a correctly labelled weighted EU-country comparison where complete data permits it. Integrate the metric into existing country pages.

State that residents do not personally owe this amount. No live/modelled numerator in the official view. Validate missing/zero population, units, coverage, date matching, and the aggregate calculation. Keep existing per-capita articles and redirects intact; any substantive article updates require their own source review. Stop.

### Phase 3 — Debt growth — COMPLETED LOCALLY

Route: `/debt-growth`. Extend the official quarterly debt history and store official historical debt/GDP ratios. Fetch enough endpoint history for 1, 5, and 10 years; offer a horizon only where both exact dates exist and flags/definition changes allow comparison.

Show euro debt before/after, absolute euro change, relative debt-stock growth where useful, and debt/GDP change in pp as distinct measures. Add rankings for absolute/relative increases and ratio increases/declines with unambiguous labels. Never call the largest euro increase the fastest percentage growth. Add genuine country trend charts and reproducible observations when euro debt rises while the ratio falls. Document the effect of exchange-rate changes on non-euro-country debt expressed in euros. Stop.

### Phase 4 — Government interest expenditure — COMPLETED LOCALLY

Route: `/interest-cost`. Verified source: `gov_10a_main`, `A`, `S13`, interest expenditure (`D41PAY`), `MIO_EUR` and `PC_GDP`. Accrual accounting, consolidation, flags and currency conversion were reviewed against current primary metadata. This measures government interest expenditure, not total principal-and-interest debt service or an observed average bond interest rate. See [the Phase 4 report](fiscal-phase-4.md) for the completed scope, annual `demo_gind` `AVG` denominator and aligned `TR` revenue dependency.

Show annual euros, % GDP, historical change, rank, and euros per resident with a documented annual-flow population denominator. Do not automatically reuse a year-end population choice without considering annual-average population. Add a compact country module. Interest/revenue is optional only if annual S13 revenue and interest definitions, units, periods, and source vintages match. If included, bring in the minimum verified revenue dependency; the full revenue page remains Phase 5. Stop.

### Phase 5 — Government spending and revenue — COMPLETED LOCALLY

Delivered one combined `/government-spending` overview in all four languages. A separate `/government-revenue` route is deferred until it supports a distinct useful page. Verified source: annual `gov_10a_main`, `A`, `S13`, `TE`, `TR` and `B9`, each in `PC_GDP` and `MIO_EUR`, including the official `EU27_2020` aggregate. See [the Phase 5 report](fiscal-phase-5.md) for the source definitions, 2015–2025 data, source-vintage reconciliation and verification limits.

Show expenditure, revenue, balance, historical movement, and appropriate EU comparisons. Reuse the Phase 4 adapter infrastructure. Test `revenue − expenditure` against the same-snapshot balance with rounding-aware tolerance. A discrepancy with the EDP balance must be disclosed/investigated, never silently corrected. Keep the existing EDP source identity. Add compact country fiscal metrics. Stop.

### Phase 6 — Country fiscal dashboard — COMPLETED LOCALLY

Enrich the existing country experience and preserve its URL identity. Group official debt, debt/GDP, debt per capita, balance, interest, expenditure, and revenue in a readable fiscal overview; keep the debt model visibly distinct.

Delivered on 7 September 2026: seven sourced metrics, visible debt/balance/interest histories, reproducible insights, period-matched EU comparisons and a clearly identified fixed peer group. Existing detail modules remain available through disclosures. See [the Phase 6 report](fiscal-phase-6.md) for the architecture, retained SEO contracts, calculations and verification.

Add debt, balance, and interest trends with exact period labels and missing-data states. Compare with a clearly identified EU aggregate/median and a justified peer set. Use deterministic insight rules whose result carries its input periods and calculation: ratio change in pp, stable EU rank, balance improvement/deterioration, and interest growth when the base is valid. No AI-generated filler or artificial precision. Revisit country titles/metadata carefully without changing canonical/hreflang contracts. Stop.

### Phase 7 — Navigation and information architecture — COMPLETED AND PUBLISHED

Review Debt, Fiscal Health, Countries, and Methodology as potential groups. Preserve direct access to the existing map, guides, and articles. Keep mobile controls short and clear; do not simply add all new pages to the current six-item desktop row. Fix the documented mobile-drawer focus issue when touching navigation. Test keyboard, touch, active states, locale switching, and source/indicator cross-links. Stop.

### Phase 8 — Methodology and source transparency — COMPLETED AND PUBLISHED

Consolidate the definitions already delivered with each indicator into a clear registry-driven source overview. For every metric list dataset ID, filters, frequency, reporting period, units, calculation, update logic, source dates, and official/calculated/modelled status. Explain revisions, flags, partial coverage, aggregate definitions, and period matching. Review code-versus-methodology consistency, including any separately authorized debt-model repair.

Use attribution such as “Source: Eurostat, dataset … . Visualisation and calculations by EU Debt Map.” Do not imply Eurostat endorsement. Preserve a meaningful methodology review history. Stop.

### Phase 9 — SEO and internal linking — COMPLETED LOCALLY

Audit useful links between the map, deficit, interest, countries, and relevant articles. Prefer comparisons derived from validated observations with their periods. Review canonical URLs, locale availability/hreflang, titles, descriptions, schema, sitemap lastmod ownership, crawlability, raw/rendered language, thin/duplicate content, and performance implications. Do not create masses of programmatic country/indicator URLs. Existing country profiles remain the destination for country context. Stop.

Delivered localized contextual links, country metric-to-comparison links, period-aware article navigation and wider country descriptions. Fixed inherited English social metadata on Dutch/French country profiles. Titles, canonicals, data and Dataset schema remain intact. See [the Phase 9 report](fiscal-phase-9.md) for 171 passing tests, 230 working routes, payload comparison and remaining limits.

### Phase 10 — Final quality audit

Audit definitions, source vintages, units, calculations, EU27 coverage, flags, null handling, endpoint alignment, chart scales, official versus modelled labels, accessibility, desktop/mobile layout, route/link health, console errors, SEO, source attribution, performance, build, lint, and tests.

Use “typecheck: not applicable — JavaScript project” unless a real check has been intentionally introduced by then. Next.js printing a TypeScript stage does not constitute comprehensive static checking of this JavaScript codebase. Verify that the product still reads as “EU Debt Map — European government debt and public finances explained visually.” Stop and report the remaining issues honestly.

## 8. Shared acceptance gate for every implementation phase

1. Review the affected code, this note, repository instructions, current source definitions, and existing user changes.
2. State the bounded intended change and any material assumption. Dataset filters and calculation definitions must be concrete before visual implementation.
3. Implement only the current phase and the small shared pieces it requires. Any change to protected behavior needs a risk explanation and relevant regression coverage.
4. Run lint, the full Node suite, and production build for substantive code work. Run article audit/relevant checks when editorial content changes. Data updates occur only where explicitly part of the phase; never hand-edit generated snapshots.
5. Verify old and new URLs, missing-country behavior, source and period labels, ranked results, map interaction, keyboard access, console, and desktop/mobile layouts. Include all supported locales; do not invent hreflang targets for unimplemented translations.
6. Report important files, features, sources, calculations, actual checks/results, assumptions, and remaining risks. Record completion/evidence in this note.
7. Stop. A successful build is not permission to commit, deploy, or start the next phase.

For meaningful calculation/data changes, test edge cases and expected results independently of rendering. Extend the existing test suite; do not add a new framework merely to test simple pure functions.

## 9. Phase 0 verification evidence and limitations

| Check | Result |
| --- | --- |
| Initial worktree | Clean before audit artifacts were created. |
| `npm run lint` | Passed with 0 errors and 24 existing warnings, mainly image and React-hook rules. |
| `npm test` | 101 passed, 0 failed. Initial sandbox attempt could not spawn workers (`EPERM`); normal execution outside that restriction succeeded. |
| `npm run build` | Passed; 171 static pages generated. Debt and ratio validators passed at 27/27 coverage for 2026-Q1; all 62 articles passed the prebuild quality audit. Initial restricted worker spawn failed; the subsequent complete build succeeded. |
| Build warnings | Existing Edge-runtime deprecation and the static-generation limitation for Edge image routes. |
| Typecheck | No standalone command, no TypeScript project; not claimed as a separate check. |
| Route baseline | Existing `capture-next-migration-baseline.js` checked 210 routes: 207 sitemap URLs plus robots, RSS, and news sitemap. All returned HTTP 200. |
| Additional internal links | Two additional main-content route targets absent from the baseline also returned HTTP 200. This is not a complete third-party-link or redirect-chain audit. |
| Desktop browser | 1280×720. Homepage map modes, country selection/navigation, France official/modelled switch, ranking search/sort/modelled switch, localized home/country pages, EU charts, and methodology inspected. No page-level horizontal overflow in measured pages. |
| Mobile browser | 390×844. All four home locales; NL, DE, FR country profiles; EN/FR rankings; NL EU history; EN methodology checked for document overflow. None found. Screenshots inspected for representative home, country, ranking, and navigation layouts. |
| Interaction/accessibility | Country selector including Malta, map metric controls, ranking controls, and mobile menu open/Escape worked. Mobile focus escapes the open drawer: recorded above. |
| Console | No captured warning/error messages in the sampled local browser flows. |
| Sources | Official Eurostat debt, EDP, annual government-finance, and population metadata reviewed for architectural planning. Full new-dataset filter/value validation remains part of its implementation phase. |
| Documentation diff | Checked separately after writing this note. |

The audit covers repository structure, active feature/data paths, shared libraries, configuration, tests, representative editorial infrastructure, and the public-route baseline. It is not a fresh factual review of every sentence in every article. Browser checks used a local production build, not a verified production deployment. No Core Web Vitals/Lighthouse measurement, exhaustive screen-reader assessment, real-device test, production advertising/consent check, or live GDP-fallback request was performed. Those limitations must not be interpreted as passing results.

For Phase 0, only this documentation note was a repository deliverable. Temporary route evidence was kept outside tracked source. No public page, generated fiscal snapshot, dependency, SEO configuration, model calculation, or external service was changed during that audit.

## 10. Delivery log and next action

Earlier entries below describe the delivery state at the end of each phase. Their local-only status was superseded by the cumulative Phase 8 release.

Phase 1 was explicitly authorized and completed locally on 5 September 2026. See [the Phase 1 implementation and verification report](fiscal-phase-1.md) for the annual EDP data pipeline, four deficit routes, country integration and checks. No deployment has been made.

Phase 2 was subsequently authorized and completed locally on 6 September 2026. See [the Phase 2 implementation and verification report](fiscal-phase-2.md) for the matched annual debt/population API sources, calculation, country integration and checks. The Phase 1 preview is preserved separately for owner review. No deployment has been made.

Phase 3 was subsequently authorized and completed locally on 6 September 2026. See [the Phase 3 implementation and verification report](fiscal-phase-3.md) for the 41-quarter Eurostat history, exact endpoint calculations, rankings, country charts, corrected five-year overview and checks. Phase 3 is available at `http://127.0.0.1:3012/nl/debt-growth`; the earlier previews remain on ports 3010 and 3011. No deployment has been made.

Phase 4 was subsequently authorized and completed locally on 6 September 2026. See [the Phase 4 implementation and verification report](fiscal-phase-4.md) for annual interest expenditure, four rankings, 2015–2025 history, country integration, verified definitions and checks. The cumulative Phase 4 preview is `http://127.0.0.1:3013/nl/interest-cost`. Phase 3 was preserved on port 3012, alongside the earlier previews on 3010 and 3011. Nothing has been committed, pushed or deployed as part of these phases.

Phase 5 was subsequently authorized and completed locally on 6–7 September 2026. See [the Phase 5 implementation and verification report](fiscal-phase-5.md) for spending/revenue/balance, EU comparisons, source-vintage disclosures, country integration and completed browser checks. The cumulative preview is `http://127.0.0.1:3014/nl/government-spending`. Phase 4 is preserved on port 3013; earlier previews remain on 3010–3012. Nothing has been committed, pushed or deployed.

Phase 6 was subsequently authorized and completed locally on 7 September 2026. See [the Phase 6 implementation and verification report](fiscal-phase-6.md) for the consolidated country dashboard and 159 passing tests. Its cumulative preview is `http://127.0.0.1:3015/nl/country/fr`. Phase 5 is preserved on port 3014; earlier previews remain on 3010–3013. Nothing has been committed, pushed or deployed.

Phase 7 was completed locally on 7 September 2026: [implementation and verification report](fiscal-phase-7.md), preview `http://127.0.0.1:3016/nl`. Its navigation passed 163 tests, the build and multilingual desktop/mobile checks.

The owner explicitly requested Phase 8 and publication of the expanded website on 7 September 2026. Complete source transparency and the necessary deployment checks, then publish through the existing production integration. Do not begin Phase 9 or Phase 10. The existing homepage/country model-consistency repair is a separate code change; Phase 8 must accurately disclose the current behavior.


Phase 8 was completed on 7 September 2026: [source registry and release report](fiscal-phase-8.md). The methodology page now identifies 14 official, calculated and modelled metrics in all four locales. The suite has 166 passing tests. Source definitions were reviewed without refreshing the saved observations or changing the debt model. The cumulative local preview is `http://127.0.0.1:3017/nl/methodology`.

Phases 1–8 were published through GitHub `main` and Vercel as `b91c8158f4f0c2cbc61aa099b3382d7a43582423`. GitHub CI and Production deployment `6313373399` succeeded. The live site returned HTTP 200 for all 230 routes and displayed the source registry.

The owner then explicitly requested Phase 9. It is complete locally: [implementation and verification report](fiscal-phase-9.md), preview `http://127.0.0.1:3018/nl/debt-per-capita`. No Phase 9 commit, push or deployment was requested or performed. Previous preview builds are retained in the temporary directory, but their servers may need to be restarted after a new session.

The owner subsequently authorized Phase 10. The [final quality audit](fiscal-phase-10.md) is complete locally: 5,947 source observations and flags matched the Eurostat API, 172 tests passed, the production build passed, and 1,252 internal destinations resolved. Annual balance changes now suppress non-comparable observations and retain their source flags. The cumulative preview is `http://127.0.0.1:3019/nl/deficit`. The live-counter consistency repair and other explicit audit limitations remain recorded separately.

The owner explicitly requested publication on 8 September 2026. The reviewed Phases 9–10 may be committed and pushed as a normal forward update to GitHub `main`, triggering the existing Vercel Production deployment. Confirm the CI result, deployment commit and live routes before reporting success. Do not begin the separately scoped model repair or another feature as part of this release.
