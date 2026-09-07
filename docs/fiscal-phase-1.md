# Phase 1 — government budget balance

Completed locally on 5 September 2026 on `codex/deficit`. No commit, push or deployment has been made. Phase 2 has not started.

## Delivered

- `/deficit`, `/nl/deficit`, `/de/deficit`, `/fr/deficit`: official annual government balance, interactive EU map, country selector, accessible small-country controls, ranking, previous year, percentage-point change and matched annual debt ratio.
- All 27 existing country pages in each of four languages receive a shared server-rendered fiscal block: balance, previous year, change, EU rank, annual debt context, an eleven-year chart and an expandable numerical history table.
- Four map categories distinguish surplus, zero, deficit down to −3%, and deficit below −3%; missing data has its own style. Green is reserved for actual surpluses. The map shows 26 geographic shapes; Malta remains accessible through its explicit control, selector and ranking. The new map's projection fits northern Europe.
- Country selection updates the map, details, deterministic insight and annual chart. Search retains each country's EU-wide rank. Every ranking value and annual series also has a numerical table.
- Public explanations cover the annual flow versus debt stock, the 3% EU reference value, stock-flow adjustments and the distinction from the existing modelled debt counter.
- Localized titles, descriptions, canonical URLs, reciprocal hreflang, WebPage/Dataset/BreadcrumbList schema and sitemap entries. Existing country titles/canonicals were preserved.
- Small discovery links on the homepage and footer, plus links among comparisons, country profiles and methodology. The top navigation was not reorganized.
- A shared source/methodology block appears on both the new section and existing methodology pages.

## Data and calculations

Source: [Eurostat gov_10dd_edpt1](https://ec.europa.eu/eurostat/databrowser/view/gov_10dd_edpt1/default/table?lang=en).

| Property | Implementation |
| --- | --- |
| Frequency | Annual, `freq=A` |
| Sector | General government, `sector=S13` |
| Balance | Net lending (+) / net borrowing (−), `na_item=B9` |
| Companion debt | Consolidated gross government debt at year-end, `na_item=GD` |
| Unit | Both use `unit=PC_GDP`; values are already percentages of GDP |
| Geography | Fixed EU27 plus official `EU27_2020`; Eurostat `EL` maps to application `GR` |
| Stored annual range | 2015–2025, eleven annual observations |
| Current comparison | 2025 versus 2024 |
| Eurostat vintage | 22 April 2026, 11:00 +0200 |
| Access | 5 September 2026; exact timestamp and API requests stored in the generated snapshot |
| Annual change | Current balance minus previous calendar-year balance, rounded to one decimal, in percentage points |
| Ranking | Descending published balance; competition ranks for ties, e.g. 1, 2, 2, 4; stable country-code order inside ties |
| EU headline | Eurostat's official aggregate, never the arithmetic mean of national percentages |
| Reference count | Strictly less than −3%; a country exactly at −3% is excluded from this count |
| Model status | Annual observations are official statistics, not forecasts or live estimates; ranking/change/insights are EU Debt Map calculations |

Sanity checks against Eurostat's April 2026 release included EU balance −3.1%, five surplus countries, Cyprus +3.4%, Greece +1.7%, France −5.1%, and Romania −7.9%. France's paired year-end debt ratio is 115.6%. The Dutch API observation is −1.6%, compared with −0.7% in 2024: a deterioration of 0.9 percentage points. Ten countries have a published balance strictly below −3%; Croatia is exactly at −3%.

Definitions reviewed on 5 September 2026:

- [Eurostat EDP metadata](https://ec.europa.eu/eurostat/cache/metadata/en/gov_10dd_esms.htm).
- [Eurostat 2025 debt and deficit release, 22 April 2026](https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-22042026-ap).
- [Council explanation of the excessive deficit procedure](https://www.consilium.europa.eu/en/policies/excessive-deficit-procedure/).

The website explains that a reference-value crossing alone does not establish a legal breach. It makes no country-specific claim about compliance proceedings.

## Update and failure behavior

Run `npm run update:balance` only for an intended fiscal refresh. It requests B9 and GD from the official Eurostat JSON-stat API, validates them together, writes a temporary file, validates the serialized file and replaces the local snapshot with a single rename. HTTP failures, incomplete latest comparisons, invalid units/filters, mismatched source vintages or period regressions leave the previous snapshot intact.

On this Windows host, the successful initial fetch used `node --use-system-ca scripts/update-eurostat-balance.js` because the network's certificate chain was recognized by the system trust store. Certificate verification was retained. No global TLS or environment settings were changed.

Normal builds run the new local validator and make no fiscal API request. The existing debt updater and `update:data` command remain separate; quarterly debt snapshots were not refreshed in this phase.

The JSON-stat decoder respects axis order and sparse/dense numeric observations, retaining zero, negative values, nulls and observation flags. Annual adapters explicitly verify the dataset, source, filters, dates and geography. Current/future calendar years and explicitly forecast observations are excluded. The latest two annual periods must have balance and debt ratios for all 27 countries and the EU aggregate. This intentionally fails closed on partial releases rather than mixing reporting years or silently retaining individual stale countries. Older missing observations remain null.

The generated snapshot is about 42 KB on disk. Server components create small client projections with current comparison rows and balance history. Raw Eurostat responses are not shipped to visitors. Existing debt data/model code has not been migrated into this new layer.

## Files

| Area | Files |
| --- | --- |
| Four route wrappers | `app/deficit/page.jsx`, `app/nl/deficit/page.jsx`, `app/de/deficit/page.jsx`, `app/fr/deficit/page.jsx` |
| Fiscal data model | `lib/fiscal/indicators.js`, `lib/fiscal/balance-core.js`, `lib/fiscal/paths.js` |
| Generated data | `lib/fiscal/balance.gen.json`, written by the updater; do not edit manually |
| Fetch/validation | `scripts/eurostat-jsonstat.js`, `scripts/eurostat-balance-core.js`, `scripts/update-eurostat-balance.js`, `scripts/validate-eurostat-balance.js` |
| Page and interactive UI | `components/fiscal/BalancePage.jsx`, `BalanceExplorer.jsx`, `IndicatorMap.jsx`, `BalanceTrend.jsx`, `fiscal.module.css` |
| Shared country/source/copy | `components/fiscal/CountryBalance.jsx`, `BalanceSource.jsx`, `balance-copy.js` |
| Country integration | All four `app/[locale]/country/[code]/page.jsx` variants (English at root), `app/country/[code]/CountryClient.jsx`, `components/country/CountryPageExperience.jsx` |
| Existing map reuse | `lib/eu-map-geography.js`; name-to-ISO mapping extracted unchanged from `components/home-preview/HomeMapPreview.jsx` |
| Discovery/methodology | `components/Footer.jsx`, `components/home-preview/HomePreviewFinish.jsx`, `components/methodology-preview/MethodologyPreviewPage.jsx` |
| Sitemap and checks | `app/sitemap.js`, `package.json`, `scripts/eurostat-balance-core.test.js` |
| Documentation | This report and `docs/public-finance-expansion-plan.md` |

No dependencies were added. The project remains JavaScript-only.

## Verification

- `npm test`: **109 tests passed**. Eight new tests cover signed/null decoding, reordered dimensions, invalid source filters, forecasts, incomplete releases, vintage/period regressions, tie ranking, exact −3% behavior, locale paths/anchors, snapshot validation and successful/failed atomic updates. Fetch tests use local fixtures rather than updating real data.
- `npm run lint`: **0 errors, 24 pre-existing warnings**; no new warnings in the fiscal implementation.
- `npm run build`: **passed**, 175 static pages generated. Debt, ratio, new annual fiscal validator and all 62 articles passed the prebuild checks. Existing Edge-runtime warnings remain.
- Typecheck: not applicable; there is no separate TypeScript/typecheck configuration. The short TypeScript stage printed by Next.js is not presented as an additional JavaScript typecheck.
- Production route capture: **214 HTTP 200 responses**, including 211 sitemap routes. Exactly four routes were added; no previous sitemap route disappeared.
- Baseline comparison: existing response-header/metadata/integration contracts unchanged. Existing article, public-asset and generated quarterly-Eurostat file fingerprints unchanged. Existing debt model and data helpers have no diff.
- Desktop 1280×800 and mobile 390×844: all four deficit locales contain 27 ranking rows and have no document-level horizontal overflow. Four representative existing country pages (`/country/gr`, `/nl/country/nl`, `/de/country/de`, `/fr/country/fr`) contain the fiscal block and have no mobile overflow.
- Visual checks: Dutch mobile hero, map, table and country fiscal block; desktop map/country detail and Dutch methodology block. The new map scale was reduced after review so northern Europe fits inside its view.
- Interactions: map keyboard selection, selector, Malta's explicit control, annual history disclosure (11 rows), search preserving the Dutch rank of 7, mobile horizontal access to remaining table columns, country navigation, homepage discovery link and Dutch-to-German deficit language switch passed.
- Existing homepage checks: map paths loaded; debt-ratio/quarterly-change/total-debt modes and Malta selection still work after the shared geography extraction.
- No warnings or errors captured in the inspected browser flows. Temporary viewport overrides were reset.
- Diff whitespace and untracked source whitespace checks were run after documentation completion.

Temporary route evidence is stored outside the repository in the system temp directory as `eu-debt-map-fiscal-phase-1-final-20260905.json`; the earlier Phase 0 capture was used for comparison.

## Boundaries and remaining risks

- Verification used a local production build. Production deployment, real-device testing, an exhaustive screen-reader audit, Lighthouse/Core Web Vitals measurements and production advertising behavior were not tested.
- Eurostat can revise annual figures. Refreshes are explicit, not scheduled; the displayed access and reporting dates make the snapshot age visible.
- Countries show latest quarterly debt alongside annual fiscal data, with separate period labels. The annual debt value paired with balance uses the same year and EDP vintage, so it can differ from the more recent quarterly headline.
- The original Phase 0 homepage/country live-model consistency issue and mobile drawer focus issue remain separately scoped findings. No unrelated model or navigation rewrite was included.

Stop after Phase 1. Phase 2 (debt per capita) requires a new instruction from the owner.
