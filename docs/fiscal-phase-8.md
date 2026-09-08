# Phase 8 — Fiscal source registry and release

Completed on 7 September 2026 after the owner explicitly requested Phase 8 and publication of the expanded website. Phases 9 and 10 are not included.

## Outcome

The existing methodology page now starts with a compact source registry in EN/NL/DE/FR. Fourteen entries cover quarterly debt and debt/GDP, year-end debt/GDP, EDP budget balance, debt per resident, debt growth, interest, interest per resident, interest/revenue, spending, revenue, annual-accounts balance, modelled debt and modelled debt/GDP.

Each entry identifies official, calculated or modelled provenance, reporting/input periods, dataset, API request, filters, frequency, units, access date, source update date where recorded, transformation and update logic. The registry reads metadata from the validated local snapshots. Older quarterly snapshots do not record the source update timestamp; the registry says so instead of borrowing the newer history snapshot's date. January population for debt per resident stays distinct from annual-average population for interest per resident. Original detailed methodology anchors are preserved.

The page explains EU aggregates, period matching, revisions, missing values, source flags, EDP versus annual-accounts vintages and independent attribution. The existing homepage versus country-counter timing difference is explicitly disclosed. Date-only UTC model anchors and the classification of the dormant GDP-based fallback are described accurately. This phase does not change model calculations or refresh data.

Methodology titles/descriptions and TechArticle review information now reflect the broader subject. Only methodology sitemap dates advance; existing canonical URLs, hreflang relationships and other route metadata are preserved. The quarterly Dataset schema continues to describe quarterly debt, rather than presenting the entire calculated platform as an official Eurostat dataset.

## Important files

- `lib/fiscal/methodology-registry.js`: metadata-only registry and reviewed date.
- `components/methodology-preview/DatasetRegistry.jsx`, `registry-copy.js`, `registry.module.css`: server-rendered, localized source disclosures.
- `components/methodology-preview/MethodologyPreviewPage.jsx`, `methodology-copy.js`: integration, review record and accurate model explanation.
- Four existing `app/**/methodology/page.jsx` routes and `app/sitemap.js`: methodology metadata and review dates.
- `scripts/methodology-registry.test.js`, `package.json`: three added tests covering provenance, source dates, periods, JAN/AVG, localization, anchors and immutable metadata inputs.
- This report, `fiscal-phase-7.md` and `public-finance-expansion-plan.md`: durable delivery record.

## Sources reviewed

Eurostat primary metadata reviewed on 7 September 2026:

- [Quarterly government debt](https://ec.europa.eu/eurostat/cache/metadata/en/gov_10q_ggdebt_esms.htm).
- [EDP deficit and debt](https://ec.europa.eu/eurostat/cache/metadata/en/gov_10dd_esms.htm).
- [Government revenue, expenditure and aggregates](https://ec.europa.eu/eurostat/cache/metadata/en/gov_10a_main_esms.htm).
- [Demographic indicators](https://ec.europa.eu/eurostat/cache/metadata/en/demo_gind_esms.htm).

No Eurostat data update command ran. No generated snapshot was edited. No dependency or deployment configuration changed.

## Verification and release gate

- `npm test`: **166 passed**.
- `npm run lint`: **0 errors, 22 pre-existing warnings**.
- Production build: 191 static pages, all data validators and the 62-article audit. No separate typecheck applies to this JavaScript project.
- Local route capture covers all **230 routes**, including 227 sitemap URLs. Methodology is the intended content/metadata change; other route contracts and stored observations are checked against Phase 7.
- Browser inspection covered all four locales, desktop at 1280px, mobile at 390px and French at 320px. The registry and expanded Dutch per-resident details fit without document overflow. Keyboard disclosures work; the full-methodology link reaches the preserved per-resident anchor. Access/source-update dates were checked against the saved inputs. No browser warnings/errors were captured.
- No physical-device, exhaustive screen-reader, Core Web Vitals or new editorial factual audit is claimed. Phases 9 and 10 remain for later work.

The final local preview is `http://127.0.0.1:3017/nl/methodology`. Phase 7 was frozen in `eu-debt-map-phase-7-preview-20260907` on port 3016 before the Phase 8 build; earlier phase previews remain on ports 3010–3015.

The owner authorized publishing the cumulative Phases 1–8. The existing GitHub `main` → Vercel Production integration was verified, with production and remote main still based on `d553c7973a796a0b79237160669f1fdb14c6b298` before this release. Publication uses a normal forward update, not a force push. The GitHub Production deployment status and live site must be checked before reporting the release as live.

Release verification: commit `b91c8158f4f0c2cbc61aa099b3382d7a43582423` was pushed to `main`; GitHub run `34147126293` and Vercel Production deployment `6313373399` both succeeded on 7 September 2026. All 230 live routes returned HTTP 200. The localized source registry was verified at `https://www.eudebtmap.com/nl/methodology#dataset-registry`. This records the completed Phase 8 release; subsequent Phase 9 work is a separate local change.

The separately scoped model-consistency repair remains outstanding: the homepage starts its modelled total at page load, while country counters extrapolate from their reference date. The registry discloses the difference; official fiscal statistics remain unchanged. No unsupported unified real-time total is introduced.
