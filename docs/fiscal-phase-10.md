# Phase 10 — Final quality audit

Completed locally on 8 September 2026. The cumulative preview is `http://127.0.0.1:3019/nl/deficit`. Phase 9 is retained on port 3018. At audit completion, Phases 1–8 were the published release (`b91c815`) and Phases 9–10 were local changes. The owner subsequently authorized publication on 8 September 2026 through the existing GitHub `main` to Vercel Production integration. Publication must be verified against the resulting commit and live routes.

## Result and correction

The expanded site retains its focus on European government finances. The audit checked the saved fiscal observations against the official API, recalculated comparisons, exercised the interfaces, and verified production routes and SEO contracts. There was no data refresh, snapshot edit, new dependency or change to the existing debt model.

One calculation edge case was corrected: the deficit comparison previously calculated an annual change even when either observation carried a series-break, differing-definition or forecast flag (`b/d/f`). It now suppresses that change and its improvement/deterioration insight. The original observations remain visible. Provisional and estimated flags (`p/e`) are combined and retained beside calculated changes. The country dashboard already suppressed non-comparable changes; this makes the deficit comparison consistent with it.

The current latest two EDP years contain no `b/d/f` flags, so no current balance, annual change or ranking changed. Regression coverage exercises each flag on either endpoint, and verifies that provisional/estimated observations remain usable and attributed. The calculation explanation was reviewed in English, Dutch, German and French. The methodology review date and method record reflect the actual audit; source publication/access dates were preserved.

## Data evidence

Read-only requests to the 17 saved source URLs compared **5,947 observations and their status codes** with current Eurostat responses. All matched, with no request errors or value/flag differences. A separate coordinate decoder was used for this comparison, rather than the production transformation code. Normal builds and visits still use local snapshots.

| Saved dataset | Observations checked | Definition and period |
| --- | ---: | --- |
| EDP balance and annual debt ratio | 616 | `gov_10dd_edpt1`, A/S13/B9 or GD/PC_GDP; 2015–2025; EU27 plus the official aggregate. |
| Debt per resident inputs | 81 | `gov_10dd_edpt1` GD/MIO_EUR and PC_GDP for 31 December 2025; `demo_gind` JAN for 1 January 2026. |
| Debt growth history | 2,214 | `gov_10q_ggdebt`, Q/S13/GD, MIO_EUR and PC_GDP; 41 quarters from 2016-Q1 through 2026-Q1. |
| Interest inputs | 1,188 | `gov_10a_main`, A/S13/D41PAY in MIO_EUR and PC_GDP, TR/MIO_EUR, and `demo_gind` AVG; 2015–2025. |
| Government accounts | 1,848 | `gov_10a_main`, A/S13/TE, TR and B9, MIO_EUR and PC_GDP; 2015–2025; EU27 plus the official aggregate. |

An independent arithmetic audit also passed:

- 81 comparisons between the legacy current/previous debt values and ratios and the extended quarterly snapshot, covering all 27 countries.
- 162 debt-change and debt-ratio-change comparisons over exact 1/5/10-year endpoints.
- 616 revenue-minus-expenditure identities, in euro amounts and GDP ratios, within the documented rounding tolerances.
- 594 interest-per-resident and interest/revenue calculations, and 297 matching same-vintage revenue observations across the interest and accounts snapshots.
- All 27 debt-per-resident calculations, same-year annual ratios, adjacent year-end/1-January dates, and the population-weighted EU comparison.

The latest accounts balance differs from the earlier EDP publication for DK (3.0 versus 2.9), FI (-3.9 versus -3.4) and SE (-1.4 versus -1.3), all as % GDP for 2025. Both source values matched the API. Existing source-vintage disclosures correctly preserve those differences rather than silently overwriting them. EU aggregates are not treated as a simple mean of country ratios. Interest is an annual accrual expense, not a bond yield or principal repayment.

## Verification

- `npm test`: **172 passed**, including the new endpoint-flag regression test.
- `npm run lint`: **0 errors, 22 existing warnings**.
- `npm run build`: successful production build, **191 static pages**. All seven debt/ratio/fiscal validators passed; the prebuild article audit checked **62 articles**, all passing.
- Typecheck: not applicable to this JavaScript project; Next.js printing a TypeScript stage is not a separate JavaScript static-check result.
- Production route capture: **230 HTTP 200 responses**, with **227 unchanged sitemap URLs**. Expanded link crawl: **240 fetched targets/pages and 1,252 unique internal destinations**, including fragments, with no broken destinations or missing anchors.
- **20 configured permanent redirects** returned the intended 308 destinations; five invalid country/page paths correctly returned 404. Three existing preview routes retained `noindex`.
- Page titles, descriptions, canonicals, language alternates and integration markers matched the Phase 9 baseline. No duplicate titles or descriptions were found. The four deficit Dataset descriptions now include the corrected calculation rule; their source dates, units, periods and other properties remain unchanged. Methodology article/review dates advance to 8 September after the actual review. Other Dataset objects remain unchanged.
- Source control confirms no changes to generated fiscal/legacy snapshots, article bodies, public assets, package lock or deployment configuration.

## Browser, accessibility and performance review

Reviewed the existing homepage map and country selector, NL deficit map/search/history, NL debt-growth periods/ranking, NL and EN interest views, FR government accounts, DE debt per resident, and the NL France country dashboard. Checks used a local production build, desktop around 1280px and mobile viewports of 390px and 320px. The vertical scrollbar leaves 1270/380/310px of document content width respectively. Checked pages had no document-level horizontal overflow.

The deficit search accepts accent-insensitive input and retains EU ranks when filtered; its empty-result state works. Malta remains reachable through its dedicated button despite the low-resolution geography. Enter selects a map country. The mobile menu confines focus, Escape closes it and restores focus to its trigger. The growth comparison switched to exact ten-year endpoints and declining debt ratios. The French accounts selector switched to balance and retained Finland's source-difference explanation. Interest/revenue ranking placed Hungary first for the saved 2025 figures. The France official/live switch returned the exact official debt anchor, and all seven fiscal metric links were present.

Screenshots were visually inspected for map controls, focus visibility, desktop charts/rankings, long translated mobile headings and the country layout. Fiscal charts retain labelled scales, zero/reference lines where relevant, source flags, and underlying value tables; the existing tests cover nulls, missing endpoints and series segmentation. No `NaN`/infinite chart coordinates were found on the inspected country page. Browser warning/error checks were empty during the checked flows.

Initial-script payloads were measured from rendered HTML and fetched build assets: approximately **235–239 kB gzip** for sampled fiscal comparisons, **256 kB** for the country page and **258 kB** for the homepage (decimal kB). These figures describe initial scripts, not a complete transfer including lazy assets, fonts and images. Fiscal HTML ranged from approximately 17–28 kB gzip; the country sample was approximately 39 kB. Source JSON is processed on the server and compact projections reach interactive clients. This is a payload review, not a Lighthouse or real-user Core Web Vitals score.

## Remaining work and limits

1. **Live-counter consistency remains a separate model task.** The homepage advances from page-load time; countries extrapolate from the official reference date. Reduced-motion mode also freezes the homepage at its official anchor. The methodology discloses these behaviors, but the two live views must not be treated as one reconciled current total. Official fiscal figures are unaffected.
2. **Raw localized HTML still starts with `lang="en"`.** The existing language script corrects the rendered document, which was verified for EN/NL/DE/FR, and fiscal articles carry their own locale. An eventual locale-root-layout change needs separate regression work.
3. **The dormant GDP fallback was not activated.** All 27 current official ratios exist and match the new snapshot. The legacy fallback is not a denominator for the new fiscal metrics.
4. The 22 existing lint warnings and existing Edge-runtime build notices remain. No unrelated cleanup or dependency migration was performed.
5. No physical-device, exhaustive screen-reader/contrast, production consent/advertising, Search Console, external-link availability or real-user performance audit is claimed. The article audit checks structure/quality rules; this was not a fresh factual review of every article. Production publication and its live verification require a separate owner request.

## Files and evidence

Phase 10 code changes: `lib/fiscal/balance-core.js`, `lib/fiscal/indicators.js`, `components/fiscal/BalanceExplorer.jsx`, `CountryBalance.jsx`, `balance-copy.js`, and `scripts/eurostat-balance-core.test.js`. The method review is recorded in `lib/fiscal/methodology-registry.js`, `components/methodology-preview/methodology-copy.js` and its existing registry test. This report and `public-finance-expansion-plan.md` record completion. Earlier Phase 9 changes are preserved.

Temporary audit evidence uses the `eu-debt-map-phase-10-*` prefix in the system temporary directory: `api-audit.json`, `calculations.json`, `links.json`, `regression.json`, `route-edges.json`, `payloads.json`, test/lint/build logs and the corresponding read-only audit scripts. The final route capture is `eu-debt-map-fiscal-phase-10-final-20260908.json`. Temporary files may disappear; this report is the durable result.

Primary definitions rechecked on 8 September 2026: [EDP deficit and debt](https://ec.europa.eu/eurostat/cache/metadata/en/gov_10dd_esms.htm), [quarterly government debt](https://ec.europa.eu/eurostat/cache/metadata/en/gov_10q_ggdebt_esms.htm), [government accounts](https://ec.europa.eu/eurostat/cache/metadata/en/gov_10a_main_esms.htm), and [demographic indicators, including average population](https://ec.europa.eu/eurostat/cache/metadata/en/demo_gind_esms.htm). The exact API queries and their original access dates remain in the saved snapshot metadata and public source registry.
