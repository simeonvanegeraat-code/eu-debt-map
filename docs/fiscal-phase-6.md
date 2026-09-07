# Phase 6 — country fiscal dashboard

Completed locally on 7 September 2026. No commit, push or deployment has been made. Phase 7 has not started.

## Delivered

The existing 27 country routes in all four languages now present a coherent fiscal overview instead of a sequence of separately added feature blocks. The navy hero, debt counter, country URLs and established visual language remain. The visible heading describes government finances; the existing search metadata and country-specific editorial material retain their current ownership and content.

The page now contains:

1. The existing live/official debt switch and a broader country heading and introduction.
2. Seven official or explicitly calculated key figures: debt, debt/GDP, debt per resident, EDP budget balance, annual interest expenditure, expenditure/GDP and revenue/GDP. Interest/GDP and expenditure/revenue euro amounts are secondary values. Every metric identifies its reporting period and links to its source methodology.
3. Deterministic observations about five-year debt/GDP movement, EU debt rank, annual budget-balance change and annual interest growth. Opposite movements in nominal debt and debt/GDP are called out when both comparisons are valid.
4. Visible historical debt, fiscal-balance and interest charts, with exact-value tables available on demand. The 1/5/10-year debt comparison remains available.
5. One EU comparison table and one fixed country comparison group covering annual debt/GDP, EDP balance/GDP, expenditure/GDP, revenue/GDP and interest/revenue.
6. Expandable explanations for debt per resident, existing country editorial debt context, the two latest debt quarters and the annual spending/revenue accounts. These retain the earlier calculations, source details, historical tables and onward links while reducing the initial page length.

The two-quarter comparison still exposes the modelled per-second pace. The existing debt model, default live mode, official toggle, consent/advertising identifiers, sharing, related articles and Dutch bond-guide link remain. The new summary always uses official observations and never follows the live counter.

The local chapter navigation now leads to key figures, debt trend, balance, interest, EU context and sources. The global site header is unchanged; its restructuring remains Phase 7.

## Architecture and files

`createCountryFiscalSlots` prepares overview, trend and comparison sections on the server. Thin locale route wrappers pass the rendered sections through the existing client boundary. The browser does not receive an additional bundle of raw fiscal snapshots. Existing chart and country-metric components are reused; earlier standalone indicator pages retain their behavior.

| Area | Important files |
| --- | --- |
| Pure calculation and comparison model | `lib/fiscal/country-dashboard.js` |
| Server composition and content | `components/country/CountryFiscalDashboard.jsx` |
| Four-language copy and layout | `components/country/country-fiscal-copy.js`, `country-fiscal.module.css` |
| Integration | Four country route wrappers, `app/country/[code]/CountryClient.jsx`, `components/country/CountryPageExperience.jsx`, `country-page.module.css` |
| Existing charts adapted for the dashboard | `components/fiscal/CountryGrowth.jsx`, `CountryInterest.jsx`, `GrowthTrend.jsx`, `growth.module.css` |
| Verification and dates | `scripts/country-dashboard.test.js`, five earlier fiscal integration tests, `layout-stability.test.js`, `package.json`, `app/sitemap.js` |
| Durable notes | This report and `docs/public-finance-expansion-plan.md` |

CountryGrowth and CountryInterest gained an optional visible-history mode. Their default remains unchanged. The debt chart has an optional larger-label layout with additional axis space, enabled only for the country dashboard. Budget chart labels are enlarged only within the new country composition.

No dependency was added. No API update command ran, and no generated snapshot, original debt/model input, global header, article or public asset changed. The existing quarterly country preview retains its fallback composition.

## Periods, sources and calculations

The definitions were checked against primary Eurostat metadata on 7 September:

- [Quarterly government debt](https://ec.europa.eu/eurostat/cache/metadata/en/gov_10q_ggdebt_esms.htm): quarter-end stock, general government, nominal values and units.
- [Government deficit and debt](https://ec.europa.eu/eurostat/cache/metadata/en/gov_10dd_esms.htm): annual debt and EDP balance.
- [Government revenue, expenditure and main aggregates](https://ec.europa.eu/eurostat/cache/metadata/en/gov_10a_main_esms.htm): annual government accounts and consistency across sources.

This phase reuses the validated Phase 1–5 snapshots, with their original access dates and source vintages. The content review date does not replace a data-access date.

| Display | Stored source and period |
| --- | --- |
| Latest debt and debt/GDP | `gov_10q_ggdebt`, 2026 Q1, from the Phase 3 history bundle |
| Debt per resident | `gov_10dd_edpt1` debt at 31 December 2025 / `demo_gind` population at 1 January 2026 |
| Headline budget balance | `gov_10dd_edpt1`, calendar year 2025, existing EDP vintage |
| Interest amount and GDP ratio | `gov_10a_main`, `D41PAY`, calendar year 2025 |
| Spending and revenue | `gov_10a_main`, `TE` and `TR`, calendar year 2025 |
| Annual EU debt and balance comparisons | `gov_10dd_edpt1`, country and official `EU27_2020` values for 2025 |
| Annual EU expenditure and revenue comparisons | `gov_10a_main`, country and official `EU27_2020` values for 2025 |
| EU interest/revenue | Sum of national `D41PAY` / sum of national `TR` × 100, aligned 2025 inputs from Phase 4 |

Every comparison row carries its own source and reporting period. No common year is inferred across different snapshots, and an annual EU ratio is not compared against the newer quarterly country ratio. The EU interest/revenue ratio is labelled as calculated, not as an unweighted average or a newly fetched official EU observation. No new population calculation, interest/debt rate, fiscal-health score or real-time fiscal statistic was introduced.

The existing EDP balance remains the headline balance. The annual-account reconciliation remains visible for the current mismatched observations (Denmark, Finland and Sweden). For example, Finland's 2025 headline is −3.4% EDP; the notice also shows −3.9% from the annual accounts and links to their separately dated sources. Neither value is silently overwritten or treated as proof of a specific revision cause.

New calculations are limited to presentation and comparison:

- Debt/GDP rank uses the same latest quarter for all available EU27 observations, one-decimal precision and competition ties (1, 2, 2, 4).
- Five-year debt/GDP change uses exact quarter endpoints via the existing growth helper. Missing endpoints and marked breaks suppress the change.
- Budget-balance change uses exactly Y and Y−1 from the EDP series. A rising balance is described as an improvement; a declining balance as deterioration; zero change is described at published precision. Breaks and missing observations suppress the insight.
- Interest growth reuses the existing annual helper and requires a positive starting value. Source flags accompany the result.
- EU gaps subtract the same-period EU ratio from the country ratio and display percentage points. Interest/revenue gaps use the underlying calculated ratios before display rounding. Ranks use displayed precision, while missing values or `b`/`d`/`f` marks suppress comparable ranks and gaps. The denominator shows the actual comparable-country count.
- The fixed peer group is Germany, France, Italy and Spain plus the current country once. The text identifies it as a stable selection, not a geographic-neighbour list or the full EU ranking.

Examples verified from the stored observations:

| Country | Debt/GDP change, 2021 Q1–2026 Q1 | Quarterly debt/GDP EU rank | EDP balance change, 2024–2025 | Interest growth, 2024–2025 |
| --- | --- | --- | --- | --- |
| Netherlands | −10.0 pp | 20 / 27 | −0.9 pp | +7.8% |
| France | −0.1 pp | 3 / 27 | +0.7 pp | +10.8% |
| Germany | −4.4 pp | 11 / 27 | 0.0 pp | +8.1% |
| Greece | −69.4 pp | 1 / 27 | +0.4 pp | −4.7% |

France's headline quarterly ratio is 117.6% for 2026 Q1; the annual EU comparison instead uses 115.6% for 2025 against 81.7% for the EU, a 33.9 pp gap. This distinction is intentional and explained directly above the comparison.

## SEO and preservation

The on-page H1 now describes government finances in each locale. Existing titles/descriptions, canonical/hreflang contracts, structured data and country-specific breadcrumb/editorial content were retained after review; the wider search positioning remains part of Phase 9. Country sitemap modification dates now reflect this substantive dashboard update. Methodology and unrelated sitemap dates were not advanced for this phase.

The previous selected-country debt bar comparison is replaced in the full dashboard by the multi-indicator EU and peer tables. The isolated earlier country preview retains the old comparison. Existing source-specific details and the two-quarter chart are available through disclosures, rather than being removed.

## Verification

- `npm test`: **159 passed**, including seven new dashboard tests covering the seven sourced values, exact periods, official EU aggregates, calculated EU interest/revenue, rounded ties, missing/broken data, source-vintage differences, deterministic changes, immutable input data, peer deduplication and locale/server integration. Existing slot and chapter-navigation checks were updated for the new composition.
- `npm run lint`: **0 errors, 24 pre-existing warnings**.
- `npm run build`: **passed**, 191 static pages; all stored-data validators and the **62-article audit** passed. Typecheck: not applicable — JavaScript project without a separate static type checker.
- Final production capture: **230 HTTP 200 routes**, including 227 sitemap URLs, with no added or removed public routes. Existing metadata, canonical/hreflang, schema, selected response headers and integration contracts match the Phase 5 baseline.
- All **108 localized country routes** were additionally checked for seven summary metrics, both comparison tables, and unique overview/trend heading IDs.
- Article/asset/original-Eurostat fingerprints and preserved fiscal/model file hashes match Phase 5. Only four previously existing fiscal display files changed as listed above; snapshots, calculations from earlier phases and the global header are unchanged.
- Browser review covered Dutch/Netherlands, German/Germany, French/France and English/Greece layouts at desktop and mobile widths, plus the Finnish source-difference case. A long Dutch heading, small chart labels and a narrow German amount were corrected during review. Final inspected headings and metric blocks fit their containers; sampled pages had no document-level horizontal overflow.
- Mobile EU tables initially show the indicator, its period and the current country's value. Horizontal scrolling reached the final EU gap and rank columns. The source hint and calculated-aggregate label remain visible.
- The live/official toggle works; the official summary remains fixed while the modelled counter changes. The official Netherlands counter displayed EUR 517,377,000,000, matching the summary's compact value. Keyboard Enter opened debt-per-resident, annual-account and two-quarter disclosures; the latter retains the modelled pace. Debt history exposes all 41 quarters, and the interest section shows both charts directly. Chapter navigation lands below the fixed header in the sampled flows.
- The new metric source link reached its exact methodology anchor. The peer-table link navigated from the Netherlands to France while retaining `/nl`. The Finnish headline and annual-account notice retain both source values.
- An additional 320px check confirmed that all seven Dutch metric blocks and the Dutch heading fit after making the primary debt value responsive; the German metric blocks also fit at this width.
- No browser warnings/errors were captured in the sampled production flows. `git diff --check` and focused whitespace checks for all 26 Phase 6 files passed after documentation was completed.

Temporary evidence: `eu-debt-map-fiscal-phase-6-final-20260907.json`, compared with the final Phase 5 route capture; `eu-debt-map-phase-5-preserved-20260907.json`; and `eu-debt-map-phase-6-{tests,lint,build}.log`, all in the system temp directory.

Verification did not include physical devices, exhaustive screen-reader testing, Lighthouse/Core Web Vitals or production advertising behavior. The earlier homepage/country model-consistency finding remains separately scoped; this phase deliberately preserves the model. The known global mobile-drawer focus issue remains for Phase 7.

## Previews and next phase

| Preview | URL |
| --- | --- |
| Phase 1 | `http://127.0.0.1:3010/nl/deficit` |
| Phase 2 | `http://127.0.0.1:3011/nl/debt-per-capita` |
| Phase 3 | `http://127.0.0.1:3012/nl/debt-growth` |
| Phase 4 | `http://127.0.0.1:3013/nl/interest-cost` |
| Phase 5, preserved | `http://127.0.0.1:3014/nl/government-spending` |
| Phase 6, cumulative | `http://127.0.0.1:3015/nl/country/fr` |

Before implementation, Phase 5 build `nLDEhjU7vnY3k-iEzRnr5` was copied to the system temp directory `eu-debt-map-phase-5-preview-20260907` and restarted from there. Rebuilding the repository no longer overwrites it. Phase 6 runs the repository's production build in a hidden local process; preserve this build before a later phase rebuild if its exact review state is needed. These are local processes, not public deployments.

All six preview ports returned HTTP 200 at final delivery. The preserved Phase 5 country page retains its previous composition; the Phase 6 country page contains the seven-metric dashboard.

**Stop after Phase 6.** Phase 7 will review the site header and navigation for the expanded set of indicators, including mobile and keyboard behavior. It requires the owner's next instruction.
