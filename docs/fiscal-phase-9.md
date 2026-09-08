# Phase 9 — SEO and useful internal links

Completed locally on 8 September 2026. Baseline: production commit `b91c815` (Phases 1–8). The original Phase 9 preview is retained at `http://127.0.0.1:3018/nl/debt-per-capita`. The delivery observations below describe that local completion. Phase 10 was subsequently completed and the owner explicitly authorized publishing Phases 9–10; see [the final audit](fiscal-phase-10.md).

## Audit and outcome

The 227 sitemap URLs already had unique titles/descriptions, canonicals and working routes. The five new fiscal sections had localized metadata, Dataset/WebPage/BreadcrumbList markup, visible source methodology and crawlable country ranking links. Navigation provided broad discovery, but contextual links between fiscal measures and relevant analysis were incomplete.

The concrete metadata defect was in Dutch and French country profiles: their server-rendered Open Graph and Twitter fields inherited the generic English homepage title, description and URL. These 54 profiles now have localized country-specific social previews, using the existing 1200×630 site image. All 108 country descriptions now describe the wider fiscal dashboard, retaining a sourced debt ratio and its actual quarter when available. Missing ratios are not converted to zero. Existing titles, including the Germany/France debt-clock titles, and canonical URLs remain intact. Dutch/French country alternates now also specify the English `x-default`, consistently with English/German profiles and the country sitemap.

Country metric names link directly to their EU comparison. A country-specific EDP balance sentence carries the saved value, source flag and reporting year next to the link to `/deficit`. The homepage adds contextual routes into interest and government accounts. Each fiscal comparison offers two relevant next comparisons and one curated analysis in the same language. Two existing article families (eight translated articles) provide corresponding links back into the comparisons; other articles receive no generic fiscal block.

The per-resident article family uses Q1 2026 debt and population on 1 January 2026. The newer comparison uses year-end debt and population on the following 1 January. Both directions explicitly explain the period difference. Article bodies, published/reviewed dates and historical figures are preserved. This is related navigation, not a renewed factual review of every article.

No new public URLs, thin country/indicator pages, raw datasets, dependencies or speculative keyword text were introduced. No Eurostat refresh, new fiscal calculation or model change was made. Existing detailed methodology anchors and official/calculated/modelled labels remain.

## Files and date ownership

- `lib/fiscal/discovery.js`: explicit comparison/article relationships, country descriptions, social metadata and a page-level review date.
- `components/fiscal/FiscalRelatedLinks.jsx`, `ArticleFiscalLinks.jsx`, `discovery-copy.js`, `discovery.module.css`: server-rendered context and article navigation, localized in EN/NL/DE/FR.
- Five fiscal page components, four country routes, four article routes, `CountryFiscalDashboard.jsx`, its stylesheet and `HomePreviewFinish.jsx`: integration using existing layouts.
- `app/sitemap.js`: 132 meaningful page dates advance (20 indicator routes, 108 countries, four homepages). Other dates remain unchanged. Source/data dates do not advance because navigation was edited.
- `scripts/fiscal-discovery.test.js`, `package.json`: five regression tests covering route validity, real translations, period context, missing values, social metadata and date precedence.

The 20 fiscal WebPage schema dates reflect this page review. Their Dataset objects, including dateModified, periods and attribution, are byte-for-byte equivalent to the Phase 8 capture. Article metadata/schema and dates remain unchanged. Robots, redirects, RSS, news sitemap, consent, ads and CSP configuration were not changed.

## Verification

- `npm test`: **171 passed**.
- `npm run lint`: **0 errors, 22 existing warnings**.
- `npm run audit:articles`: **62 articles passed**.
- `npm run build`: successful production build, all data validators and 191 static pages.
- Production-mode route capture: **230 HTTP 200 responses**, 227 unchanged sitemap URLs. Titles and canonicals preserved; no duplicate titles/descriptions; no existing alternate or content link removed. All 27 countries remain linked from each fiscal ranking in every locale.
- **84 additional page-to-destination content links** in the route capture. Every new destination resolves. The seven metric links and balance-to-comparison sentence render on every country profile. Site-wide header/footer links are excluded from that count.
- Browser review: NL desktop context/homepage, NL mobile country metrics and article navigation at 390px, DE/FR comparison blocks at 320px, and EN desktop interest context. Keyboard focus is visible; checked layouts have no document overflow. The comparison-to-analysis flow and new cross-indicator navigation were exercised. Browser console checks found no warnings or errors in the local preview.
- Compared compressed initial script sizes with the preceding build: **no increase** on sampled indicator pages or the French country profile in Dutch; homepage **+2,075 bytes gzip** for localized link copy. Added compressed HTML is 706–865 bytes on sampled indicator pages and 369 bytes on that country profile. This is a build-payload comparison, not a Core Web Vitals field measurement.
- `git diff --check`: clean. No separate TypeScript check applies to this JavaScript project.

Verification evidence is retained in the system temporary directory as `eu-debt-map-fiscal-phase-9-final-20260908.json`, `eu-debt-map-phase-9-verification.json`, `eu-debt-map-phase-9-before-sizes.json` and the Phase 9 build/test/lint logs.

## Remaining limitations

The shared root layout still emits raw `<html lang="en">`; the existing `DocumentLanguage` inline script and effect set the actual locale, and the localized fiscal article carries its own `lang`. Rendered NL/DE/FR document languages were verified. Changing this architecture is a separate locale-layout task, not a reason to turn static pages into request-dependent rendering in this phase.

Search Console account data and real-user Core Web Vitals were not inspected; no physical-device or exhaustive screen-reader audit was performed. No traffic or rich-result outcome is promised. Existing model-counter timing differences remain documented in Phase 8. Phase 10 remains the comprehensive final-quality audit.

## Primary implementation guidance reviewed

Google Search Central, reviewed 8 September 2026:

- [Crawlable links and useful anchor text](https://developers.google.com/search/docs/crawling-indexing/links-crawlable).
- [Canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- [Localized versions and hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions).
- [Sitemaps and meaningful lastmod values](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- [Dataset structured data](https://developers.google.com/search/docs/appearance/structured-data/dataset).

The installed Next.js 16.3.2 metadata and linking/navigation guides were also consulted before implementation.
