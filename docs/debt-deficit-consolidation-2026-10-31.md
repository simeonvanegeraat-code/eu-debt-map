# Debt and deficit guide consolidation

## Intent and scope

The user approved consolidating the standalone debt-versus-deficit explainer
into the existing government debt guide. The guide already answers the same
reader question and contains an interactive model at `#debt-vs-deficit`.
The standalone page had a mobile layout defect and less precise explanations.

Each retired route redirects permanently in one HTTP 308 response:

| Retired route | Final destination |
| --- | --- |
| `/debt-vs-deficit` | `/debt#debt-vs-deficit` |
| `/nl/debt-vs-deficit` | `/nl/debt#debt-vs-deficit` |
| `/de/debt-vs-deficit` | `/de/debt#debt-vs-deficit` |
| `/fr/debt-vs-deficit` | `/fr/debt#debt-vs-deficit` |
| `/de/de/debt-vs-deficit` | `/de/debt#debt-vs-deficit` |
| `/fr/fr/debt-vs-deficit` | `/fr/debt#debt-vs-deficit` |

The last two historical redirects point directly to the guide to avoid chains.
Query parameters are retained. The destination fragment opens the relevant
section; the guide retains its existing fragment-free canonical and four-language
alternates. Retired routes and their alternates are removed from the sitemap.
No robots block is added: crawlers must be able to follow the redirects.

## Content and internal links

The shared model section gains a short stock/flow comparison and an explanation
of why debt changes need not equal deficits. The simplified model remains
explicitly illustrative. A localized FAQ explains how debt-to-GDP can fall
despite a deficit without using the misleading blanket condition `g > r`.
Its visible answer and FAQ schema use the same copy.

Only this added explanation is dated as checked on 31 October 2026; the guide's
older overall review date is not presented as a fresh review of every section.

The debt guide's former link to the retired explainer is replaced with a useful
link to budget balance data. Budget balance pages and 15 references in 11
existing articles point directly to the localized explanation. Article prose,
dates, canonical URLs, publication records and translation groups are preserved;
only link destinations change.

## Evidence and boundaries

Definitions and the deficit/debt relationship were checked on 31 October 2026:

- Eurostat, *Government finance statistics: deficit-debt relation*:
  https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260122-1
- Google Search Central, *Redirects and Google Search*:
  https://developers.google.com/search/docs/crawling-indexing/301-redirects
- Installed Next.js documentation:
  `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md`

This work does not change the debt model, official data, advertising, consent,
analytics, security headers or production settings. The user explicitly
authorized publication on 31 October 2026. Publication must use the repository's
normal safeguards. Search Console submissions are outside this authorization.

## Verification

Run lint, the full test suite, article audit and production build. Then run:

```bash
node scripts/verify-debt-guide-consolidation.js --base-url http://127.0.0.1:3022
npm run verify:publication -- --base-url http://127.0.0.1:3022
```

The consolidation check covers all six HTTP redirects, query parameters,
destination anchors, canonical URLs, language alternates, FAQ schema and sitemap
membership. Inspect redirected pages on desktop and mobile in all four languages,
exercise the sliders, and verify internal article links as well.

Before any authorized publication, run `npm run preflight:publication` from the
exact clean release commit. Repeat both URL-based checks on the exact preview
and public production origin as appropriate. Preview authorization must follow
the existing publication workflow; production must pass strict indexability
checks.

### Local results, 31 October 2026

- ESLint: zero errors; 15 pre-existing warnings.
- Full test suite: 243 passed.
- Production build and article audit: passed; 105 articles preserved.
- Consolidation HTTP check: all six redirects and four destinations passed,
  including query preservation, sitemap and localized metadata/schema checks.
- Full publication verifier: 105 article pages, 66 images, canonical checks,
  translation targets, article redirects and real 404 behavior passed locally.
- Existing guide titles, metadata, canonicals, hreflang and Article schema
  compared with production and preserved in all four languages. FAQ additions
  are separately checked against their visible localized answers.
- Desktop and mobile inspection passed in all four languages; the German
  explanation also fits at 320 px without clipped content. Model controls
  verified the illustrative 200-to-250 result for an annual deficit of 5 over
  ten years. The link from the budget balance page opens the explanation.
- The eleven article-file diffs were compared with the baseline: only the
  fifteen intended URL replacements changed, ignoring checkout line endings.
- At the end of local implementation, no commit, push, deployment or Search
  Console change had been performed. Publication was subsequently authorized.
