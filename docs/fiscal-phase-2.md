# Phase 2 — Government debt per resident

Status: completed locally on 6 September 2026. The owner authorized Phase 2 while retaining the Phase 1 preview for review. No commit, push or production deployment was made. Stop after this phase; Phase 3 needs a separate instruction.

## Result

Added `/debt-per-capita` and its Dutch, German and French equivalents using the existing design and shared fiscal map. Each page contains an interactive EU map, country selector, explicit controls for small countries, searchable ranking, government debt in euros, official debt/GDP, population, and a weighted EU27 comparison. All 27 countries are covered. The calculated value is also integrated into existing country profiles; no duplicate country pages were created.

The new measure is labelled as an EU Debt Map calculation from official Eurostat inputs. It is not part of the live debt model. Visible copy explains the reporting dates, provisional/estimated observations, rounding, and that residents do not personally owe the displayed amount. The map's blue scale describes nominal debt per resident, not financial health. Purchasing power, government assets and taxpayer-only populations are not implied.

## Sources and matching dates

The official Eurostat JSON-stat API was queried on **5 September 2026**. Normal builds and visits use the local validated snapshot, not API requests.

| Input | Dataset and filters | Reference date | Source update |
| --- | --- | --- | --- |
| Gross consolidated general government debt, million euros | `gov_10dd_edpt1`: `freq=A`, `sector=S13`, `na_item=GD`, `unit=MIO_EUR` | 31 December 2025 | 22 April 2026 |
| Official debt/GDP ratio | `gov_10dd_edpt1`: `freq=A`, `sector=S13`, `na_item=GD`, `unit=PC_GDP` | Year-end 2025 | 22 April 2026 |
| Total population, persons | `demo_gind`: `freq=A`, `indic_de=JAN` | 1 January 2026 | 21 July 2026 |

Definitions reviewed on 5 September 2026:

- [Eurostat government deficit and debt metadata](https://ec.europa.eu/eurostat/cache/metadata/en/gov_10dd_esms.htm): annual general government debt is a nominal, consolidated gross stock at year-end. Non-euro-country amounts expressed in euros use the relevant exchange-rate conversion; these are nominal euro comparisons.
- [Eurostat population metadata](https://ec.europa.eu/eurostat/cache/metadata/en/demo_pop_esms.htm): Eurostat conventionally publishes the population at 31 December under 1 January of the next year. National population methods can differ. The metadata identifies `demo_gind` as potentially more current than detailed population tables.

`demo_pjan` was investigated but returned January 2025 as the latest year in the checked detailed population query. `demo_gind/JAN` supplied January 2026 for all 27 countries. It is therefore the suitable total-population source for matching year-end 2025 debt. `JAN` denotes persons; this table has no separate `unit` dimension. Greece's API geography `EL` is normalized to the existing site code `GR`.

Annual debt avoids silently pairing the existing 2026-Q1 debt headline with a January population observation. Both annual input dates appear on the new comparison and country modules. Existing quarterly headlines, per-capita articles and redirects remain intact and retain their own reference periods.

## Calculations and interpretation

`debt per resident = debt in million euros × 1,000,000 / population`

Values are rounded to whole euros after division. Ranks run from highest to lowest using the displayed whole-euro values; equal amounts share a competition rank, and filtering does not recompute ranks. The map uses the same rounded values with fixed bands below €15,000, €15,000–<€30,000, €30,000–<€45,000 and at least €45,000. Missing values have a distinct state.

The weighted EU comparison is `sum of 27 national debt stocks / sum of their populations`. It is not the arithmetic mean of country values and is not presented as Eurostat's separately consolidated EU debt aggregate. Debt consolidated within each country can still contain lending between EU governments; the cross-country consolidation boundary matters.

Independent arithmetic check against saved inputs:

- Netherlands: €523,541,000,000 / 18,130,208 = **€28,877** after rounding, EU rank 11.
- EU27 comparison: €15,587,805,900,000 / 451,990,314 = **€34,487** after rounding.

Debt/GDP is the official published ratio, not derived from population. Population flags are preserved: `p` provisional, `e` estimated, `ep` both. Calculations inherit the uncertainty of their inputs, including the weighted EU comparison. Other supplied Eurostat status codes remain beside source values. No interpolation, population substitution or artificial real-time updates are introduced.

## Pipeline and reusable architecture

Run `npm run update:per-capita` only when an explicit refresh is intended. On this Windows host the successful initial update used `node --use-system-ca scripts/update-eurostat-per-capita.js` to use the system certificate trust store while retaining TLS verification.

The updater requests debt, debt/GDP and population, decodes the existing shared JSON-stat format, and validates dataset identity, axes, filters, annual periods, values, flags, source update times and exact EU27 coverage. Debt and debt/GDP must share a reporting year and source vintage. Population has its own documented source vintage and must match the following January date. Current/future debt years and forecast observations are excluded. Missing, zero or non-integer population, incomplete releases and regressions reject the update.

Only a fully validated snapshot replaces `lib/fiscal/per-capita.gen.json`, using a temporary file, serialized-data validation and one rename. Failed fetches and validation failures preserve the previous snapshot. No old debt or Phase 1 balance snapshot was refreshed. Prebuild validates this new local snapshot alongside the existing checks. It is approximately 6.8 KB; raw API responses are not delivered to visitors.

The Phase 1 `IndicatorMap`, geography, locale paths and fiscal layout are reused without modifying the deficit implementation. New `IndicatorRanking` accepts compact, formatted column/row projections, keeping indicator definitions outside the shared UI. Thin locale route wrappers use one page component. Server-rendered country and methodology slots keep the data and explanations available in page HTML.

## Important files

| Area | Files |
| --- | --- |
| Data definitions and calculation | `lib/fiscal/per-capita.js` |
| Generated snapshot | `lib/fiscal/per-capita.gen.json`, generated by the updater only |
| Fetch, validate and tests | `scripts/eurostat-per-capita-core.js`, `scripts/update-eurostat-per-capita.js`, `scripts/validate-eurostat-per-capita.js`, `scripts/eurostat-per-capita-core.test.js` |
| Page and interactive UI | `components/fiscal/PerCapitaPage.jsx`, `PerCapitaExplorer.jsx`, `IndicatorRanking.jsx` |
| Country, source and localized content | `components/fiscal/CountryPerCapita.jsx`, `PerCapitaSource.jsx`, `per-capita-copy.js`, `per-capita.module.css` |
| Routes | `app/debt-per-capita/page.jsx` and equivalents under `app/nl`, `app/de`, `app/fr` |
| Integration | Four country route wrappers, `app/country/[code]/CountryClient.jsx`, `components/country/CountryPageExperience.jsx`, `components/methodology-preview/MethodologyPreviewPage.jsx`, `components/Footer.jsx` |
| SEO and commands | `app/sitemap.js`, `package.json` |
| Project note | This report and `docs/public-finance-expansion-plan.md` |

New routes have localized titles, descriptions, canonicals, hreflang and WebPage/Dataset/Breadcrumb structured data. The derived Dataset identifies EU Debt Map as creator and cites Eurostat inputs. Sitemap changes add only the four new routes and update affected country/methodology modification dates. Existing canonical, metadata, response-header and integration contracts were compared to Phase 1. No dependency, lockfile, redirect, advertising, consent, deployment or debt-model configuration changed.

## Verification

- **`npm test`: 118 passed.** Nine new tests cover conversions, zero/missing inputs, stock-date matching, dimension/filter/source validation, forecast and partial releases, vintage/period regression, Greece, statuses, weighted aggregation, rounded ties, band boundaries, local snapshot validity, successful/failed atomic updates and route/integration contracts. Fetch tests use fixtures.
- **`npm run lint`: 0 errors, 24 pre-existing warnings.** No new warnings in the fiscal implementation.
- **`npm run build`: passed**, 179 static pages. Local data validation and the audit of all 62 articles also passed. Existing Edge-runtime warnings remain. No standalone typecheck applies to this JavaScript project.
- Production route capture on 6 September: **218 routes returned HTTP 200**, including 215 sitemap URLs. Exactly four routes were added; none disappeared. Existing metadata, selected response headers and integration contracts match Phase 1.
- All previous article, public-asset and generated quarterly-Eurostat fingerprints match Phase 1. Separate fingerprints also confirm unchanged Phase 1 balance data/components, `lib/data.js` and `next.config.mjs`.
- Desktop **1280×800** and mobile **390×844**: all four new locale pages have 27 ranking rows and no document-level horizontal overflow. Map paths load; Malta has its explicit accessible control.
- Visually inspected Dutch desktop/mobile hero, map, country detail and ranking; Dutch desktop country module; French/German mobile country modules. Four representative country routes (`/country/gr`, `/nl/country/nl`, `/de/country/de`, `/fr/country/fr`) contain both new indicators and have no mobile document overflow.
- Keyboard map selection, native country selection, Malta control, retained Dutch rank 11 during search, no-results state, accent-insensitive French search, mobile access to the last table columns, country navigation and return link, methodology anchor, and Dutch-to-German locale switching passed.
- Existing homepage quarterly-change/total-debt controls and Malta selection still work. No warning/error messages were captured in the sampled browser flows. Viewport overrides were reset.
- Diff and new-file whitespace checks were run after documentation completion.

Temporary route evidence: `eu-debt-map-fiscal-phase-2-final-20260906.json` in the system temp directory, compared with the final Phase 1 capture.

## Preview and boundaries

The Phase 1 production build is preserved separately in the system temp directory and served at `http://127.0.0.1:3010/nl/deficit`. It was checked after Phase 2 build: HTTP 200, with no new per-capita footer link. Phase 2 is available at `http://127.0.0.1:3011/nl/debt-per-capita`. These are local previews, not public deployments; they require their local server processes to remain running.

Verification does not include real-device testing, exhaustive screen-reader or third-party-link review, Lighthouse/Core Web Vitals measurement or production advertising behavior. Eurostat revisions remain possible; refreshes are explicit and unscheduled. Existing Phase 0 debt-model consistency and mobile-drawer focus findings remain separately scoped. The next planned phase is debt growth over exact 1-, 5- and 10-year endpoints, subject to source coverage; it has not started.
