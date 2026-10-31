# Government debt guide release

The owner explicitly authorized publication of the reviewed four-language
preview on 31 October 2026. The release baseline is current remote main at
`3655ed83f54362432937cd2582410d4a23ab0c48`; there were no remote changes to
integrate at the start of publication.

## Scope

The existing `/debt`, `/nl/debt`, `/de/debt` and `/fr/debt` routes now render
the approved shared experience. English rendering and the three-language
wrapper both use `components/debt-guide-preview/DebtGuidePreview.jsx` with
`preview={false}`. The four noindex preview routes remain available.

The public experience omits the design-preview banner. The definition,
self-paced borrowing steps, illustrative model, creditor categories, fictional
GDP comparison and neutral EU27 selector match the approved design.

Each route retains its existing title, description, canonical, language
alternates, social image and indexability. The modification date is updated
for this substantive rewrite. The shared Article and WebPage schema describe
the new visible title/definition; publisher, real logo and public URLs are
retained. FAQ schema is generated from exactly the visible localized answers.
This necessary structured-data change is covered by unit and rendered HTTP
checks. Breadcrumbs retain the localized public destinations.

All guide fragment destinations and the six published debt-versus-deficit
redirects remain intact. There are no changes to articles, publication
manifest, official snapshots, advertising, consent, analytics, CSP,
environment configuration or Vercel project settings. No new dependencies.

## Verification and release process

- Lint: no errors, 15 existing warnings.
- Full test suite: 249 passed, including FAQ/schema and language-URL coverage.
- Production build: 337 static pages; data validation and 105-article audit pass.
- Local production HTTP: four public guides and four previews passed metadata,
  schemas, unique anchors, single main landmark and neutral EU27 selector checks.
- Consolidation verifier: six one-hop redirects, four destinations, language
  alternates, FAQ schema, balance links and sitemap passed.
- Publication verifier: all 105 article pages and 66 images preserved; canonical,
  translation, sitemap, schema, redirect and real-404 checks passed.
- Browser: all four public guides at 390 and 1440 px; no clipped headings or
  controls, no horizontal overflow, empty initial country selection and no
  console errors. The model gives 1,150 from 800 plus ten annual deficits of 35.
  Earlier preview checks also cover 320 and 768 px and keyboard navigation.

Commit the authorized release, run `npm run preflight:publication` on the exact
clean commit immediately before deployment, and use the existing GitHub/Vercel
integration. Verify the exact protected preview before production. Repeat the
guide, consolidation and complete publication verifiers on the public origin
after release. Capture a live desktop/mobile browser check. Deployment IDs,
logs and screenshots are recorded in ignored `reports/debt-guide-redesign/`.
