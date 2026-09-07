# Phase 5 — government expenditure and revenue

Implemented locally on 6 September 2026; verification and delivery completed on 7 September 2026. No commit, push or deployment has been made. Phase 6 has not started.

## Delivered

- One combined fiscal overview at `/government-spending`, with `/nl`, `/de` and `/fr` counterparts. Expenditure, revenue and balance belong together; a separate `/government-revenue` page would currently duplicate the same comparison rather than provide a distinct useful destination.
- The existing map and ranking primitives now support three annual government-account measures. Both metric selectors stay synchronized. Rankings include all 27 countries, expenditure/revenue/balance as a percentage of GDP, the preceding year for the selected measure, annual percentage-point change and difference from the official EU aggregate. Search retains EU rank; equal displayed values share rank.
- Selected-country figures show annual euro amounts and published GDP ratios. Expenditure and revenue share a historical chart and axis; a separate balance chart includes zero. An expandable table exposes all six annual values and source flags for 2015–2025. Narrow tables scroll within their own region.
- Existing country routes receive a compact expenditure/revenue/balance module, EU comparisons, deterministic annual-change observations and expandable history. Existing debt, deficit, per-capita, growth and interest modules retain their sources and behavior. The complete country-dashboard composition remains Phase 6.
- All four languages have reviewed public copy, metadata, canonical/hreflang relationships and WebPage/Dataset/Breadcrumb structured data. The footer has one spending/revenue link, and methodology has a dated source section. Header restructuring remains Phase 7.

## Verified sources and accounting

Primary sources reviewed on 6 September 2026:

- [Eurostat annual government-finance metadata](https://ec.europa.eu/eurostat/cache/metadata/en/gov_10a_main_esms.htm): ESA 2010 annual accounts, sector coverage, consolidation, units, transmission, conversion and consistency with EDP.
- [Eurostat government-finance overview](https://ec.europa.eu/eurostat/web/government-finance-statistics): revenue, expenditure, deficit/surplus and debt context.
- [Eurostat EDP metadata](https://ec.europa.eu/eurostat/cache/metadata/en/gov_10dd_esms.htm): the separately published deficit source used in Phase 1.
- [Statistics Finland, 21 April 2026](https://stat.fi/en/publication/cmfp84qj49mre08uri1wltj3s): the earlier Finnish 2025 deficit release. This corroborates the earlier source vintage, not a specific cause for a later revision.

All six requests use `gov_10a_main`, annual frequency `A`, general government `S13`, the EU27 countries and official `EU27_2020` aggregate. Greece uses the API geography `EL`, mapped to the site's `GR` code.

| Measure | ESA item | Units fetched |
| --- | --- | --- |
| Total government expenditure | `TE` | `MIO_EUR`, `PC_GDP` |
| Total government revenue | `TR` | `MIO_EUR`, `PC_GDP` |
| Net lending (+) / net borrowing (−) | `B9` | `MIO_EUR`, `PC_GDP` |

The snapshot was accessed at `2026-09-06T18:50:26.171Z`; all six source responses identify the same update, `2026-07-21T11:00:00+0200`. It contains 11 completed calendar years, 2015–2025, for 27 countries plus the EU aggregate: 1,848 observations across six measures. Exact filtered API URLs are stored with the snapshot and exposed in the methodology disclosure.

S13 totals are consolidated within general government; adding subsectors can double-count transfers. Borrowing is not revenue. Interest is already included in expenditure and must not be added again. Expenditure/GDP describes scale relative to the economy, not public-sector production share or service quality. A high spending or revenue rank is not a fiscal-health score. The balance map describes −3% as an EU reference value without implying an automatic legal finding.

## Calculations and consistency

- Euro amounts = published `MIO_EUR × 1,000,000`. GDP ratios are Eurostat's published `PC_GDP`, not reconstructed ratios. Euro amounts are nominal; exchange rates can affect comparisons, with annual-flow currency conversion explained in the source text.
- Revenue minus expenditure equals net lending/borrowing in the accounts. The UI displays official B9, never the subtraction of already rounded GDP ratios.
- Annual changes compare exactly Y and Y−1. GDP-ratio changes and gaps are percentage points. Comparisons with missing endpoints or marked breaks are suppressed; another year is never substituted.
- EU comparison uses the official aggregate for the same year, not a simple mean of country percentages or the EU institutions' budget. EU monetary aggregates are validated against country totals without replacing the published aggregate.
- Rankings use one-decimal GDP precision and competition ties (1, 2, 2, 4). Country search does not renumber the ranking. Map bands for expenditure/revenue are descriptive, not sustainability thresholds.
- Source flags remain visible; derived differences combine source flags. Forecasts are excluded, and charts do not connect gaps or marked breaks. Statistical revisions can occur without a flag.

In 2025 the official EU aggregate is EUR 9,317,906,500,000 expenditure (49.5% GDP), EUR 8,740,198,300,000 revenue (46.4%) and EUR −577,708,600,000 balance (−3.1%). The independently rounded monetary values leave a EUR 400,000 subtraction residual; B9 remains the published value.

For the Netherlands, the corresponding values are EUR 529.090 billion / 44.9%, EUR 510.195 billion / 43.3%, and EUR −18.895 billion / −1.6%, with provisional flags. Spending/GDP rose 0.5 pp and revenue/GDP fell 0.3 pp from 2024. All 297 overlapping country revenue observations match the existing Phase 4 interest/revenue denominator snapshot from the same vintage.

### Separate annual-account and EDP vintages

Phase 1 retains `gov_10dd_edpt1`, updated 22 April 2026 and accessed 5 September. The new annual accounts are updated 21 July. Published 2025 GDP balances differ for:

| Country | Annual accounts | Existing EDP | Difference |
| --- | --- | --- | --- |
| Denmark | +3.0% | +2.9% | +0.1 pp |
| Finland | −3.9% | −3.4% | −0.5 pp |
| Sweden | −1.4% | −1.3% | −0.1 pp |

There are 12 differences across the shared 2015–2025 country history at published GDP precision, disclosed in an expandable comparison. The 11 official EU aggregate ratios agree with the EDP snapshot. Selected-country and country-page notices identify the current mismatch and link to both source versions and access dates.

A direct read-only EDP API check confirmed that Finland's 2025 EDP observation still reported −3.4% and EUR −9.613 billion with the April update. Annual accounts report −3.9% and EUR −10.814 billion. Eurostat describes possible differences in transmission timing and GDP vintages, but the specific cause of each national revision was not established. The site does not invent that cause or silently overwrite either source. This reconciliation compares GDP ratios; the existing Phase 1 bundle does not store EDP balance euro amounts.

## Data pipeline and important files

`npm run update:accounts` performs six filtered API requests and replaces one validated local snapshot atomically. The successful initial command on this host was `node --use-system-ca scripts/update-eurostat-accounts.js`, retaining TLS verification through the system trust store. Normal builds and page visits do not call Eurostat. No existing generated snapshot was refreshed, and no dependency was added.

Validation covers source identity, dimensions, filters, matching vintages, 11 consecutive annual periods, complete latest-year coverage, flags, bounds and non-regression. A refresh cannot lose an existing valid overlapping observation, regress dates or publish a partial latest year. Temporary serialized output is validated before replacement; failures preserve the old bundle.

The accounting identity permits at most 1.5 `MIO_EUR` (three independently rounded terms, conservatively allowing whole-million reporting) or 0.15 pp (three one-decimal ratios), plus numerical epsilon. The EU monetary sum check permits 14 `MIO_EUR` across 27 countries and one aggregate. These bounded allowances handle rounding, not arbitrary source inconsistencies. The generated bundle is 65,787 bytes; interactive views receive compact transformed series rather than raw API responses.

| Area | Important files |
| --- | --- |
| Registry, calculations, ranks and source comparison | `lib/fiscal/accounts.js` |
| Generated snapshot | `lib/fiscal/accounts.gen.json`, written by the updater |
| Adapter and validation | `scripts/eurostat-annual-source.js`, `eurostat-accounts-core.js`, `update-eurostat-accounts.js`, `validate-eurostat-accounts.js`, `eurostat-accounts-core.test.js` |
| Main feature | `components/fiscal/AccountsPage.jsx`, `AccountsExplorer.jsx`, `AccountsHistory.jsx`, `FiscalComparisonChart.jsx` |
| Country and source transparency | `CountryAccounts.jsx`, `AccountsSource.jsx`, `AccountsReconciliation.jsx`, `AccountSourceDifference.jsx` in `components/fiscal` |
| Localization and styles | `components/fiscal/accounts-copy.js`, `accounts.module.css` |
| Routes and integration | Four new route wrappers, four country wrappers, `CountryClient.jsx`, `CountryPageExperience.jsx`, footer, methodology, sitemap and `package.json` |
| Durable notes | This report and `docs/public-finance-expansion-plan.md` |

The shared annual adapter gained an optional explicit geography list; its default EU27 behavior used by Phase 4 remains intact. Existing source adapters, map/ranking controls and number formatting were reused without a broad refactor.

## Verification

- `npm test`: **152 passed**, including 12 accounts tests for definitions, shuffled axes/Greece, explicit aggregate geography, completeness/vintages, rounding bounds, flags/breaks, exact periods, ties, saved data, EDP differences, non-regression, atomic updates and localized integration.
- `npm run lint`: **0 errors, 24 pre-existing warnings**.
- `git diff --check` and focused whitespace checks for all 23 Phase 5 files: **passed**.
- `npm run build`: **passed**, 191 static pages. Local data validation and the **62-article audit** passed. Typecheck: not applicable — JavaScript project without a separate static type checker. Existing Edge-runtime warnings remain.
- Final production capture: **230 HTTP 200 routes**, including 227 sitemap URLs. All 226 Phase 4 routes remain, with exactly four new overview routes. Existing metadata, canonical/hreflang, structured data, selected headers and integration contracts match the prior capture.
- Article/asset/original-Eurostat fingerprints and 15 separately protected file hashes match Phase 4. Earlier fiscal snapshots and page components, quarterly/model inputs, home trend and Next configuration remain intact.
- Desktop review covered all four overview languages. Mobile review covered Dutch, English and German heroes, Dutch/French charts, Dutch ranking and country modules in all four languages. The inspected pages had no document-level horizontal overflow. The new country's six-value historical table exposes 11 years; mobile ranking scroll reaches its last columns.
- All three metric modes produced the expected ranking leaders; the two selectors synchronize. Search preserves rank, no-results/clear works, French `Suede` finds `Suède`, and keyboard Enter selects Malta. Country selection changes the history. Mobile language switching preserved the new route from French to German.
- Finland's country page retains all earlier fiscal modules and displays both 2025 source values with their reconciliation link. Expanded country history renders two charts and 11 rows. The country methodology link reaches the correct section; its disclosure exposes all six exact API requests. Latest reconciliation has three rows and historical reconciliation 12.
- The final additional French country and English/Greek country reviews were completed on 7 September after explicit owner approval allowed the previously blocked browser checks to resume. Both mobile modules fit at 390×844, preserve earlier fiscal sections and expand into two charts and 11 annual rows. France's latest row shows EUR 1,714.1372 billion expenditure, EUR 1,561.6261 billion revenue and EUR −152.5111 billion balance; Greece shows EUR 119.875 billion, EUR 124.165 billion and EUR +4.290 billion. The English/Greek module was also visually checked at 1280px desktop width. No warnings/errors were captured in either flow. No implementation change was needed.

Temporary evidence lives in the system temp directory: `eu-debt-map-fiscal-phase-5-final-20260906.json`, `eu-debt-map-phase-4-preserved-20260906.json` and `eu-debt-map-phase-5-{tests,lint,build}.log`. Physical devices, an exhaustive screen-reader review, Lighthouse/Core Web Vitals and production advertising behavior were not tested. The Phase 0 model-consistency and mobile-drawer focus findings remain separately scoped.

## Previews and next phase

| Preview | URL |
| --- | --- |
| Phase 1 | `http://127.0.0.1:3010/nl/deficit` |
| Phase 2 | `http://127.0.0.1:3011/nl/debt-per-capita` |
| Phase 3 | `http://127.0.0.1:3012/nl/debt-growth` |
| Phase 4 | `http://127.0.0.1:3013/nl/interest-cost` |
| Phase 5, cumulative | `http://127.0.0.1:3014/nl/government-spending` |

All five local ports were confirmed listening on 7 September. Phase 4 was preserved in the system temp directory `eu-debt-map-phase-4-preview-20260906` before rebuilding, alongside the earlier frozen previews. Phase 5 runs the repository's production build in a hidden local process; freeze this build before a subsequent phase rebuild if retaining its exact review state. Previews require their processes to remain running and are not public deployments.

**Stop after Phase 5.** All planned Phase 5 checks are complete within the verification limits above. Phase 6 requires a new instruction and will organize the available indicators into a coherent country fiscal dashboard. The header/navigation review remains Phase 7.
