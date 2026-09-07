# Phase 3 — Government debt growth

Completed locally on 6 September 2026. The owner authorized Phase 3; Phase 4 has not started. No commit, push or deployment was made. Earlier Phase 1 and 2 work remains intact.

## Result

`/debt-growth` and its Dutch, German and French equivalents compare all 27 EU countries over exactly 1, 5 or 10 years. Visitors can rank percentage debt growth, euro changes, debt/GDP increases and debt/GDP declines. Search retains the selected EU rank; displayed ties share competition ranks. Negative changes remain visible in every ranking, with explanatory labels.

The selected country's debt stock and official debt/GDP ratio have separate labelled charts and an expandable table of exact quarterly observations. Existing country pages gain a three-horizon summary, deterministic five-year observations and expandable ten-year charts. This adds historical context to the existing URLs and their deficit/per-capita modules.

The page explains why rising euro debt can coexist with a falling debt ratio, why debt growth is not simply accumulated deficits, and how inflation and exchange rates affect interpretation. Methodology and source links are available beside the data. No new live fiscal counter or composite health score was introduced.

## Official source and periods

Source: [Eurostat quarterly government debt metadata](https://ec.europa.eu/eurostat/cache/metadata/en/gov_10q_ggdebt_esms.htm), reviewed 6 September 2026.

| Field | Selection |
| --- | --- |
| Dataset | `gov_10q_ggdebt` |
| Frequency | `Q`, quarterly |
| Sector | `S13`, general government |
| Item | `GD`, consolidated gross government debt at nominal value |
| Units | `MIO_EUR` and `PC_GDP` |
| Geography | Current EU27 throughout; Eurostat `EL` maps to site code `GR` |
| History | 2016-Q1 through 2026-Q1, 41 observations per country and unit |
| Source update | Both responses: 21 July 2026, 11:00 +0200 |
| Access | 6 September 2026; exact timestamp and request URLs are stored in the snapshot |

The updater made two filtered requests to the official [Eurostat statistics API](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10q_ggdebt?lang=EN&freq=Q&sector=S13&na_item=GD&unit=MIO_EUR&lastTimePeriod=41&geo=NL). The linked request illustrates the Netherlands debt series; stored request URLs contain all 27 countries. Both actual responses contain 1,107 observations. Latest observations are marked provisional (`p`); source flags remain visible in values and calculations.

Euro debt is nominal, without inflation adjustment. For non-euro currencies, quarter-end exchange rates can change euro amounts independently of changes in national-currency debt. Published `PC_GDP` ratios are used directly; no synthetic historical GDP denominator is calculated.

## Calculations and missing data

- Euro change: ending debt minus starting debt, after converting million euro to euro.
- Debt growth: `(end − start) / start × 100`, the cumulative percentage over the selected period, not an annual rate or CAGR.
- Debt/GDP change: ending published percentage minus starting published percentage, in percentage points.
- Endpoints have identical quarters, exactly 4, 20 or 40 quarterly intervals apart. Missing endpoints are never replaced by nearby quarters.
- A zero starting debt produces no percentage growth. Null values stay null. Comparisons crossing `b`/`d` flags are suppressed for the affected measure; forecasts are excluded. Chart lines break at gaps and marked discontinuities.
- `p`/`e` flags are preserved; derived values inherit source uncertainty. Other supplied flags remain visible. Revisions can occur without a status code.
- Rankings use displayed precision: whole euro changes and one decimal for percentages/percentage points. The interface distinguishes relative from absolute growth and keeps the ranking during search.

For example, Netherlands debt rose from EUR 440.682 billion in 2021-Q1 to EUR 517.377 billion in 2026-Q1: EUR 76.695 billion or 17.4%. Its official debt/GDP ratio fell from 53.8% to 43.8%, a change of −10.0 percentage points. This describes the data; it does not establish the cause or prove sustainability.

## Data pipeline and shared history

Run `npm run update:growth` only for an intended refresh. The successful initial refresh on this Windows host used `node --use-system-ca scripts/update-eurostat-growth.js`, retaining certificate verification with the system trust store.

The adapter reuses the existing JSON-stat decoder and checks axes, dataset, filters, geography, units, reporting periods, source update times, flags and values. Debt and ratios must use the same source vintage and latest quarter. Updates reject unfinished/forecast latest observations, incomplete EU27 coverage, lost previously valid observations and period/time regressions. A temporary file, serialized-data validation and a single rename ensure failed updates preserve the previous snapshot.

`lib/fiscal/growth.gen.json` is approximately 66.6 KB. Builds validate local data and do not require a live API response. The interactive explorer receives only transformed periods and country series; the homepage receives just 21 aggregate rows. No raw Eurostat dataset is shipped to visitors.

The earlier homepage and EU overview called a 20-observation series “five years”, although it covered 19 intervals (4.75 years). Both now use a shared server-side selector with 21 observations, 2021-Q1 to 2026-Q1. The selector requires complete, comparable debt observations for all current EU27 countries; a refresh fails rather than publishing partial totals or joining across breaks. Older gaps can still suppress ten-year country comparisons independently.

The overview is explicitly the sum of country debt, not a separately consolidated EU institution statistic: EUR 12.7187544 trillion to EUR 15.9138399 trillion, +25.1%. Its latest country breakdown is unchanged. All 540 overlapping country debt observations reconcile with the earlier snapshot (within EUR 1 floating-point tolerance). The original generated quarterly files and live-model inputs were not changed.

## Important files

| Area | Files |
| --- | --- |
| Definitions, exact periods, rankings and series | `lib/fiscal/growth.js` |
| Generated history | `lib/fiscal/growth.gen.json`, generated only by the updater |
| Fetch, validation and regression checks | `scripts/eurostat-growth-core.js`, `scripts/update-eurostat-growth.js`, `scripts/validate-eurostat-growth.js`, `scripts/eurostat-growth-core.test.js` |
| Page and interaction | `components/fiscal/GrowthPage.jsx`, `GrowthExplorer.jsx`, `GrowthTrend.jsx`, existing shared `IndicatorRanking.jsx` |
| Country, sources and translations | `components/fiscal/CountryGrowth.jsx`, `GrowthSource.jsx`, `growth-copy.js`, `growth.module.css` |
| Routes | `app/debt-growth/page.jsx`, equivalents under `app/nl`, `app/de`, `app/fr` |
| Integration | Four country route wrappers, `CountryClient.jsx`, `CountryPageExperience.jsx`, methodology page, footer |
| Correct five-year history | `HomePageExperience.jsx`, `HomePreviewExperience.jsx`, `HomeTrendPreview.jsx`, `LocalizedEUDebtPage.jsx`, `app/eu-debt/ChartsClient.jsx` |
| SEO, commands and regression contract | `app/sitemap.js`, `package.json`, `scripts/technical-seo.test.js` |
| Project note | This report and `docs/public-finance-expansion-plan.md` |

New routes have localized metadata, canonical/hreflang links and WebPage/Dataset/Breadcrumb schema. The derived Dataset credits EU Debt Map and cites Eurostat. Sitemap additions are limited to the four new routes; affected country, methodology and overview modification dates reflect the new content. Existing EU overview schema publication dates are preserved. No dependency, redirect, consent, advertising, deployment or debt-model configuration changed. Header restructuring remains Phase 7.

## Verification

- `npm test`: **129 passed**. Eleven new tests cover exact intervals/calculations, JSON-stat axis order and Greece, filters/units/source identity, flags, incomplete/unfinished releases, gaps and breaks, zero denominators, rank ties, exact 21-point totals, snapshot reconciliation/non-regression, failed/successful atomic updates and locale integration.
- `npm run lint`: **0 errors, 24 pre-existing warnings**, with no new fiscal warnings.
- `npm run build`: **passed**, 183 static pages. All local data validators and the 62-article quality audit passed. Existing Edge-runtime warnings remain. This JavaScript project has no standalone TypeScript check.
- Production route capture: **222 HTTP 200 routes**, including 219 sitemap URLs. All 218 earlier routes remain; precisely four growth routes were added. Existing metadata, canonical/hreflang, selected headers and integration contracts match Phase 2. Existing structured data differs only in the four intentionally updated EU overview modification dates.
- Article, asset and original generated-Eurostat fingerprints match Phase 2. Separate protected-file hashes confirm unchanged Phase 1 balance data, Phase 2 per-capita data, both prior page components, live-model inputs and Next configuration.
- Desktop 1280×800 and mobile 390×844: four locale pages retain 27 ranking rows without document-level horizontal overflow. Screenshots reviewed for desktop graphs/rankings, Dutch and French mobile layouts, Dutch desktop/mobile country modules and French mobile country content.
- Horizon controls produce 5/21/41 quarterly rows. Ranking modes, country selection, Dutch search with retained rank, no-results/clear flow, keyboard horizon selection and horizontal access to the final table columns were exercised. Netherlands and Greece sample endpoint values matched the calculations.
- Representative English/Greek, Dutch/Netherlands, German/Germany and French/France country routes show all three new fiscal modules and no mobile page overflow. Country charts expand and contain the expected 41-point series. The country methodology link lands on the growth explanation; earlier source sections remain.
- Existing homepage map modes and Malta selection work. The homepage historical chart and EU overview show the corrected 2021-Q1–2026-Q1 interval; the EU overview area and country bars render.
- Browser inspection caught a React hydration mismatch caused by multiple text children in SVG titles. Titles now use one complete string, so labels are present in server HTML. No warnings/errors were captured in the subsequent sampled production flows. Mobile cell wrapping and the dark-background homepage source-link contrast were corrected during review.

Temporary route evidence is `eu-debt-map-fiscal-phase-3-final-20260906.json` in the system temp directory, compared with the final Phase 2 capture. Diff and new-file whitespace checks are included in completion verification.

## Preview and remaining boundaries

- Phase 1 remains at `http://127.0.0.1:3010/nl/deficit` in a preserved build.
- Phase 2 remains at `http://127.0.0.1:3011/nl/debt-per-capita` in a preserved build.
- Phase 3 is at `http://127.0.0.1:3012/nl/debt-growth` and includes all three phases.

The earlier previews returned HTTP 200 without later-phase footer links. These are local previews and require their local processes to remain running.

Verification does not include physical devices, exhaustive screen-reader review, third-party-link auditing, Lighthouse/Core Web Vitals measurements or production advertising behavior. Future Eurostat revisions remain possible; refreshes are explicit and unscheduled. The Phase 0 model-consistency and mobile-drawer focus findings remain separately scoped. **Stop after Phase 3. Phase 4 requires the owner's next instruction.**
