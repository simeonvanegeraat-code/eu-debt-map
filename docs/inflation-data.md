# Inflation section

The independent `/inflation` section is available in English, Dutch, German and French. Existing country debt pages contain a compact link that opens the matching country in the inflation hub. They do not duplicate its inflation widgets. Country-specific inflation landing pages are a later extension.

## Source and definitions

Reviewed on 2026-10-04:

- [Eurostat monthly HICP](https://ec.europa.eu/eurostat/databrowser/view/prc_hicp_minr/default/table?lang=en): `prc_hicp_minr`, `freq=M`, `coicop18=TOTAL`, `unit=RCH_A` (annual percentage change) and `RCH_M` (monthly percentage change, not seasonally adjusted).
- [HICP metadata](https://ec.europa.eu/eurostat/cache/metadata/en/prc_hicp_esms.htm).
- [Publication policy and the 2026 transition](https://ec.europa.eu/eurostat/web/hicp/information-data): the current dataset replaces the archived classification. Retrieve history from the current series, without manually splicing the old dataset.
- [ECB membership dates](https://www.ecb.europa.eu/euro/intro/html/index.en.html): the map filter follows membership in the selected reference month, including Croatia from 2023-01 and Bulgaria from 2026-01.

The euro area comparison is Eurostat's `EA` changing-composition aggregate, not the fixed `EA21` backcast or an average calculated from country rates. The EU benchmark is `EU27_2020`. All 27 countries are stored; Eurostat's `EL` maps to the site's `GR`.

## Updating

Run `npm run update:inflation` explicitly after a monthly publication. This fetches only inflation data and replaces `lib/inflation/inflation.gen.json` atomically after validation. On machines where Node needs Windows certificate roots, use `node --use-system-ca scripts/update-eurostat-inflation.js`; never disable certificate verification.

The importer chooses the latest common, completed calendar month with both indicators for all 27 countries and both aggregates, excluding `e`, `p` and `f` flags from that final month. This conservative completeness rule excludes flash estimates but can lag a release if one country remains estimated or provisional. We do not infer publication status merely from the calendar or the presence of a value. If no qualifying month exists, or it would regress the saved period, the import fails and preserves the old file.

History starts in 2015-01. Values, nulls and flags remain separate. Forecast values are excluded; historical estimates/provisional observations are labelled. Missing values and `b` series breaks interrupt chart lines. Source retrieval time, update time, the exact request URL and status labels are stored. Existing numeric observations cannot silently disappear in an update. Source corrections to existing values are allowed and should be reviewed in the generated diff.

Run `npm run validate:inflation`, `npm test` and `npm run build` after an update. The production prebuild validates the saved file offline. Normal rendering and builds do not call Eurostat. Updating the local snapshot does not publish the site; deployment remains a separate, explicitly requested action. No scheduled update or external service configuration was added.

Monthly maintenance checklist:

1. Check the official release calendar and trigger the update after the full monthly release.
2. Review the snapshot diff: selected reference month, both indicators, source timestamps, flags and any historical revisions. Do not manually alter values or advance the reference month.
3. Run the validation, tests and production build listed above. Inspect the latest month in the browser in all four locales.
4. Publish only when deployment has been explicitly requested. A failed fetch or validation leaves the previous snapshot available; investigate the source response before retrying.

## Display and discovery

The hero always identifies the latest complete comparison month. The map, country panel and ranking share the selected month. The historical chart ends at that selected month and offers 1, 5 and 10 years (bounded by available history). Rate differences are percentage points, not percentages. Annual and monthly rates are displayed as published, not calculated from rounded indices.

Selections are shareable through `country`, `month`, `area`, `years` and `sort` query parameters. Back/forward navigation and locale switching preserve them. Invalid parameters fall back to valid available values; country-only links automatically select the EU scope for countries outside the euro area. Canonical URLs remain query-free. Separate year and month controls expose only available periods. On mobile, the ranking uses expandable rows; the chart supports tapping and a keyboard-accessible month slider.

The new routes have their own canonical and reciprocal hreflang URLs, localized metadata, structured dataset description and sitemap modification date. Existing debt routes and their metadata are unchanged. Shared navigation and the footer link to the new section. Unit tests cover source parsing, incomplete releases, flags, negative/zero/missing observations, membership transitions, atomic update failure and locale metadata.
