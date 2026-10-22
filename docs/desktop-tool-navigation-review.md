# Shared desktop tool navigation

Implemented and locally reviewed on 22 October 2026. The user authorized the shared navigation, the additional fiscal links, sticky desktop behavior and publication.

## Behavior

`ToolNavigation` is shared by the header across country profiles, tools, articles and explanatory pages. It contains eight localized links in a stable order. Only the current tool is marked; country and article pages have no selected tool. The map link returns to the matching language homepage and its map anchor.

At 1180px and above, the main header and compact tool row stick as one block. Below that breakpoint, only the main header sticks. The homepage retains its scrolling mobile tool row; other content pages use the existing mobile drawer.

The header measures its visible height with ResizeObserver. Section navigation uses that height, while anchor scrolling adds only the extra desktop row to the existing page offsets. Horizontal page overflow uses `clip` so it does not create an ancestor scroll container that prevents sticky positioning. The existing sticky-section assertion for the government bond guide now checks the shared height with its previous fallback values.

Legal pages, debug routes and unrelated design previews do not gain the extra row. Public paths, article content, metadata, structured data, official snapshots, advertising, consent and analytics settings are unchanged.

## Local checks actually completed

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
