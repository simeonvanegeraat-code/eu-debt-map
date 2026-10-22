# Shared desktop tool navigation

Implemented and locally reviewed on 22 October 2026. The user authorized the shared navigation, the additional fiscal links, sticky desktop behavior and publication.

## Behavior

`ToolNavigation` is shared by the header across country profiles, tools, articles and explanatory pages. It contains eight localized links in a stable order. Only the current tool is marked; country and article pages have no selected tool. The map link returns to the matching language homepage and its map anchor.

At 1180px and above, the main header and compact tool row form one sticky block. After passing the top-of-page area, 12px of deliberate downward movement hides the block and 12px upward reveals it. Direction reversals reset the accumulated movement. Open disclosures and keyboard focus inside navigation keep it visible; Tab reveals it before focus moves. Below that breakpoint, only the main header sticks and scroll-direction hiding is disabled. The homepage retains its scrolling mobile tool row; other content pages use the existing mobile drawer.

The header measures its full height with ResizeObserver. Section navigation follows that height plus the shared reveal shift, so hidden navigation leaves no empty strip. Anchor scrolling preserves the full safe offset. The 180ms transition is disabled for reduced-motion preferences and visible keyboard focus. Horizontal page overflow uses `clip` so it does not create an ancestor scroll container that prevents sticky positioning. The existing sticky-section assertion for the government bond guide checks the shared height and shift with its previous fallback values.

Legal pages, debug routes and unrelated design previews do not gain the extra row. Public paths, article content, metadata, structured data, official snapshots, advertising, consent and analytics settings are unchanged.

## Initial sticky release checks

- Lint passed: zero errors and the same 30 existing warnings.
- All 219 Node tests passed.
- Production build passed, including the article and official-data audits.
- Four-language homepage baseline verification passed for metadata, structured data, FAQ answers and previous links.
- Local production publication verification passed: 95 articles, 56 images, three additional canonical checks, sitemap, translation alternates, Article schema, redirects and real 404 behavior.
- Homepage HTTP audit passed: 180 internal destinations, six images, all 108 country ratios and the EU total matched the stored official data.
- Browser scroll matrix passed: country, tool, article and methodology pages in all four languages at 1440, 1180 and 390px (48 checks), without page overflow. Main headers remained at the viewport top; desktop tool rows remained attached and mobile content-page rows remained hidden.
- The mobile homepage retained only the main sticky header; its tool row scrolled away.
- Debt, public-finance, country and language dropdowns opened above the tool row while scrolled, and Escape closed them.
- Country section navigation aligned below the shared header and section content remained readable after following its anchor. Production browser console reported no warnings or errors in inspected flows.
- `git diff --check` passed.

Browser checks used Chromium viewport emulation. They do not constitute physical-device, Safari, Firefox or full screen-reader testing. Exact preview and public-origin verification must be recorded separately after the clean release commit is deployed.

## Scroll-direction update, 22 October 2026

The update starts from current main `38e944b`, including four more published articles. Lint passed with the same 30 existing warnings, all 223 tests passed and the production build passed its data/article audits. Two scroll-state regression tests cover accumulated thresholds, reversals, near-top behavior, mobile disablement, menu/focus locks and zero-movement measurements.

Local production publication verification passed all 99 articles, 60 images, three canonical rechecks, sitemap, translations, Article schema, redirects and real 404 behavior. A 36-case browser matrix covered downward hiding and upward reveal on tools, country pages and methodology in four languages at 1440, 1180 and 390px. All four mobile homepages retained the existing sticky main header and scrolling tool row. Open-menu and keyboard-focus locks passed. Country section navigation aligned at viewport top when hidden and exactly below the shared header when shown. The inspected production-browser flows had no console errors or warnings.

The old homepage baseline checker reports a missing teaser link because the latest-article selection changed in main before this task. The old link was already absent on current production. A separate four-language comparison against the actual current production homepages passed every link, metadata tag, structured-data block and FAQ answer; no baseline file was overwritten. All published article URLs remain verified.
