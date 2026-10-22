# Article quality refresh — 22 October 2026

## Authorization and preservation

The owner approved the five identified improvement groups and publication.
Start: clean main and remote main at
`2d7f5d396173674f12dd5b4c9d7f047eb1a1a9b4`.
Preserve the recent navigation and header-spacing changes. Work on
`codex/article-quality-refresh-2026-10-22`. This is an update of 21 existing
URLs, not 21 new articles. Preserve all original publication dates, slugs,
translation groups, redirects and the 99-entry publication manifest. Do not
touch the four new 22 October news reports, unrelated archive stories, data
snapshots, advertisements, consent or production settings.

No page-level Search Console export was available. Therefore do not merge,
redirect, delete or retarget articles on assumptions about traffic. In particular
keep the Dutch per-capita article's search intent, headline, SEO title and all
27 countries. Metadata changes are limited to reviewed summaries/titles that
incorrectly promise a falling/current counter, genuine modification/review
dates, source records and accurate genre labeling. Cover those with regressions.

## Source ledger, checked before drafting

- Eurostat debt release, 21 October 2026:
  https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-21102026-bp
  Provisional debt at 30 June 2026. EA21 88.8% versus 88.4% in March; EU27
  82.9% versus 82.5%. Use October-vintage endpoints; never mix old Q1 ratios
  with the revised release.
- Quarterly debt metadata:
  https://ec.europa.eu/eurostat/cache/metadata/en/gov_10q_ggdebt_esms.htm
  Consolidated nominal gross general-government debt; the denominator is
  trailing-four-quarter nominal GDP.
- Eurostat inflation release, 16 October:
  https://ec.europa.eu/eurostat/en/web/products-euro-indicators/w/2-16102026-ap
  September rates NL 3.0%, DE 3.3%, FR 3.4%, euro area 3.8%. Do not keep calling
  September a flash estimate or August the latest full month.
- ECB explanation of inflation, weighting, personal experience and the
  euro-area medium-term 2% target:
  https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/what_is_inflation.en.html
  It does not prove that all consumers are frightened or that attention alone
  explains perceived inflation.
- Insee, 29 September:
  https://www.insee.fr/fr/statistiques/9053525
  Earlier Q2 ratio 119.0% and debt EUR3,595.5bn. Eurostat October's 119.1% is a
  later vintage of the same quarter, not extra debt since September.
- Destatis, 29 September:
  https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/09/PD26_341_713.html
  Read directly after the web reader returned 403. Public HTTP200 content:
  EUR2,753.5bn public-budget debt to the non-public sector at Q2, +EUR26.3bn.
  Different definition from Eurostat EUR2,924.7bn, not hidden debt. Do not use
  the earlier Q1 EUR2,726.5bn as the latest comparator.
- Council explanation of fiscal rules:
  https://www.consilium.europa.eu/en/policies/economic-governance-framework/
  60% debt and 3% deficit reference values remain; national multiyear spending
  paths and financing risks cannot be replaced by a ranking.
- ESM Greece background:
  https://www.esm.europa.eu/content/when-will-greece-repay-esm-and-efsf-loans
  Web reader returned 403; direct public HTTP200 content was inspected.
  ESM loan repayments run from 2034 to 2060; reprofiled EFSF repayments run
  from 2023 to 2070. These periods describe those facilities, not the entire
  Greek debt portfolio. No new portfolio quantity or maturity average is claimed.

Direct read-only API comparison used the full debt/ratio/population/inflation
URLs recorded in the existing snapshots. **1,317 observations matched**:
27 countries × 3 debt quarters × 2 measures; 27 January-2026 populations; and
4 inflation series × 141 months × 2 measures. Sources last updated 21 October,
30 September and 16 October respectively. No data importer was run.

## Reproducible calculations

- NL debt: EUR523,795m - EUR517,377m = EUR6,418m, across 91 days,
  about +EUR816/s. Q2 ratio 43.7%; official separately rounded quarterly change
  0.0pp despite displayed Q1 43.8%. Say virtually stable.
- DE: EUR2,924,674.2m - EUR2,902,262.5m = EUR22,411.7m, +EUR2,850.490944/s,
  displayed as approximately +EUR2,850/s; Q1 63.5%, Q2 63.4%.
- FR: EUR3,595,524.9m - EUR3,535,928.6m = EUR59,596.3m, approximately
  +EUR7,580/s; Q1 117.7%, Q2 119.1%.
- GR: EUR358,647m; ratio 140.8%, from 143.5% in March and 152.0% a year earlier.
  Annual -11.2pp; France annual +3.7pp. A lower debt ratio is not by itself
  proof of lower refinancing risk.
- Per person: Q2-2026 national debt / population at 1 January 2026, rounded
  only after division to EUR100. Population changes during the six months are
  not included. All 27 countries retained. Equal rounded values share a rank.
  National debt sum EUR16,157,459.3m / 451,990,314 people = EUR35,747.3574,
  shown as approximately EUR35,700. Consolidated EU release total EUR15,950,729m
  differs by approximately EUR206.7bn because intergovernmental lending is
  removed at EU level; our per-person comparison sums national stocks.
- Inflation cumulative approximations compound rounded monthly rates:
  product(1 + monthlyRate / 100) - 1, excluding the starting month's change.
  September 2016–September 2026: NL 40.7%, DE 35.5%, FR 28.1%, EA 32.2%.
  February 2020–September 2026: NL 33.3%, DE 30.0%, FR 22.4%, EA 27.7%.
  Label as approximate original calculations, not official index-level ratios.
  Rebuild the existing Dutch ten-year SVG from the same checked annual series.

## Pre-draft briefs

### Live-counter explanations — five articles

Reader question: what does today's moving number measure? Retain practical
explanations, replace obsolete current endpoints and direction, and use the
observed quarter rather than forecasts. NL/EN explain the now positive model
without erasing the historical Q1 decline. DE preserves the useful
Eurostat/Destatis distinction with Q2 on both sides. FR/NL preserve the difference
between the French national release and common European series. The French
article becomes a genuine evergreen explainer instead of a news-labeled long
tutorial. Remove duplicate FAQ/recap sections; retain necessary scope and limits.
Primary destinations are the localized country page and methodology. Link the
new dated news article as a follow-up, not as a replacement URL.

### Inflation opinion — NL, DE, FR

Reader question: does a lower rate than the crisis peak mean relief at the till?
Thesis: neither a crisis replay nor an all-clear follows from one headline rate;
discuss the accumulated bill, the renewed September rise and households' income.
The reasonable objection is the real renewed acceleration: meet it explicitly,
not by saying 3% must be normal. Different local cumulative magnitudes and peaks
earn each edition. Cut unsupported mass-psychology/media-behavior claims,
repeated FAQs and duplicated conclusions. Restore meaning, do not merely replace
2.8 with 3.0. Keep the Dutch ten-year chart and date it correctly.
Primary destination: each locale's inflation tool, with country selector links.

### EU ranking — four existing translations

Reader question: which countries rank highest on the common debt-to-GDP scale?
Retain the title's purpose and common-vintage ranking, explain who is high and who
is moving differently, then send readers to the full ranking tool. Do not repeat
the entire debt-risk essay. No counts of quarterly increases derived from rounded
endpoints; Latvia press/API rounding differs, so avoid that observation. Do not
confuse EU aggregate ratios with simple country averages.

### Euro-area analysis — four existing translations

Reader question: why does a given ratio create different risks in different
countries? Keep this distinct from the ranking: financing timing, nominal GDP,
budget flows and the GR/FR direction comparison. Use EA21 and common periods.
Remove old near-term forecast numbers rather than pretending a quarterly stock
release updates those forecasts. Keep the limitations close to the claim without
turning every paragraph into a disclaimer. Country, interest-cost, growth and
ranking links should each serve a specific reading need.

### Per-capita analysis — four existing translations

Reader question: which countries have the highest debt per resident, and is it
a household bill? Keep the full 27-country table, weighting explanation and
Germany/Greece comparison. Update to June debt with explicitly January
population. The linked tool still uses the matching year-end/January dates.
State the six-month mismatch beside the first link. Preserve the Dutch headline,
SEO title and original date because its search intent remains unchanged.
No population interpolation or model-based live per-person values.

### Greece/France — Dutch

Reader question: is France repeating the Greek crisis? Retain the cautious
answer and explanatory debt structure, replace Q1 with verified Q2 and a
common-vintage annual comparison. Do not convert an older Q2 PDMA estimate into
an official Eurostat fact without attribution. Preserve the Greece-country and
debt-ratio destinations. Avoid a new default prediction or claim that a ratio
alone makes Greece safe.

## Accountability and review plan

Responsible update identity: EU Debt Map Research. Keep original author
attribution and dates, but do not claim the original author independently checked
this AI-generated update. Set reviewedBy to the research organization. Public
source disclosures describe actual AI research, substantial drafting, calculations
and separate language/source checks. Independent human/native review remains
unperformed. Authorization to publish is not evidence of human review.

Opening/structure comparison uses the related existing archive and the four
22 October country news pieces: do not turn these into copies of those reports.
Before release record actual before/after edits, skeptical decisions and each
group's six readiness gates, inspect updated bodies/chart on desktop/mobile, run
audit/tests/lint/build and full local/exact-preview/public verification.

## Files in scope

- `content/articles/de/eu-debt-burden-2026.json`
- `content/articles/de/eu-pro-kopf-verschuldung-2026-analyse.json`
- `content/articles/de/eurozone-hidden-debt-timebomb-extended.json`
- `content/articles/de/Staatschuld.json`
- `content/articles/fr/dette-publique-france-compteur-live-record.json`
- `content/articles/fr/dette-publique-ue-par-habitant-2026-analyse.json`
- `content/articles/fr/eu-debt-burden-2026.json`
- `content/articles/fr/eurozone-hidden-debt-timebomb-extended.json`
- `content/articles/de/2026/inflation-deutschland-fast-normal-angst-bleibt.json`
- `content/articles/en/2025/eurozone-hidden-debt-timebomb-extended.json`
- `content/articles/en/2025/netherlands-national-debt-live-counter.json`
- `content/articles/en/2026/eu-debt-burden-2026.json`
- `content/articles/en/2026/eu-debt-per-capita-2026-inequality-report.json`
- `content/articles/fr/2026/inflation-france-prix-peur-apres-crise.json`
- `content/articles/nl/2025/eurozone-hidden-debt-timebomb-extended.json`
- `content/articles/nl/2025/franse-staatsschuld-live-teller-record.json`
- `content/articles/nl/2025/Staatschuld.json`
- `content/articles/nl/2026/eu-debt-burden-2026.json`
- `content/articles/nl/2026/eu-staatsschuld-per-inwoner-2026-analyse.json`
- `content/articles/nl/2026/inflatie-nederland-10-jaar-prijzen-sinds-corona.json`
- `content/articles/nl/2026/staatsschuld-griekenland-2026-frankrijk-vergelijking.json`

## Actual prose edit and skeptical decisions

These are AI research, skeptical-edit and simulated read-aloud passes, not
independent human-reader feedback. No human or native-language reader test was
performed. The source/API and arithmetic checks are distinct from rereading prose.

### Counter group

Question: what does the moving number measure? Answer: an extension of the
latest measured quarterly movement, not real-time issuance. The concrete
NL EUR6.418bn / 91 days / 7,862,400 seconds calculation makes the inference visible.
The previous Dutch title “€517 miljard en waarom de live teller daalt” is now
“€523,8 miljard en hoe de live teller werkt”. The English opening now explicitly
says the counter moves upwards. Both retain Q1's EUR6.343bn decline as history.
The old French EUR9,723/s heading is replaced by the verified current EUR7,580/s.
Germany's differently scoped Destatis comparison is retained, but the old Q1
EUR2.7265tn comparator and a second clock's obsolete rate are removed.
The French piece now opens with what the counter measures rather than claiming
a freshly reported record, and is labeled explainer. Its 119.0/119.1 distinction
does not fabricate a cause for every revision.

Deleted the repeated FAQ/conclusion structures and unsupported forward-looking
assertions. The ending directs the reader to the dated observation and the
separate budget question rather than repeating the speed. No shopping anecdote,
political reporting or actual location is invented. The Eurostat/Destatis and
Insee comparisons preserve the strongest alternative interpretation: apparently
different figures can be valid without representing new borrowing or hidden debt.

### Inflation group

Question: does a lower rate than the peak mean households have been relieved?
Answer: it does not erase the accumulated price rise, and the latest monthly
direction actually rose. The old Dutch title “de inflatie is bijna normaal, maar
onze angst is dat nog niet” is replaced by “minder inflatie is nog geen verlichting
aan de kassa”. The old German assertion “Die Inflationskrise ist vorbei” and
French focus on continuing fear no longer supply the thesis. The strongest
objection, September's renewed acceleration, appears in the opening and first
section, rather than being buried behind reassurance.

Concrete details differ: NL +40.7% over ten years and +33.3% since February 2020;
DE +35.5%/+30.0%; FR +28.1%/+22.4%, each explicitly approximate from rounded monthly
rates. The key potentially confusing reasoning step now separates rate, level
and household income. Deleted unsupported claims that the shock changed the
whole population's attention or that fear explains the discrepancy. Deleted
duplicated FAQs and the old “crisis is voorbij” recap. In the last line edit,
removed process-oriented sentences telling readers that the former August
classification is obsolete; the actual September date and full-release status
already convey the useful information.

The conclusion adds the next evaluative step: connect price movement and
accumulated prices to income, without declaring all households worse off.
HICP is expanded at first necessary use; German HVPI and French IPCH/IPC remain
distinct. The ECB medium-term euro-area target is not a national monthly ceiling.

### Ranking and euro-area analysis

The ranking answers who is highest, not who defaults next. The English title
“Which Countries Are Under the Most Pressure?” now asks which have the highest
ratios. Five short country bullets replace an oversized comparison structure.
Deleted the old “what to watch before October” and repeated takeaway/final-recap
sections. Greece's -11.2pp and France's +3.7pp, from one source vintage, show why
rank and direction differ. The conclusion adds how to compare consistent periods.

The euro-area article answers a different question: how debt reaches financing
costs and budgets. Its opening now introduces the maturity mechanism instead of
another crisis ranking. The body moves through maturities, GR/FR direction,
nominal GDP and budget flows. Removed stale near-term forecasts rather than
silently updating forecasts with observed debt stocks. The ending combines
stock, financing dates and budget additions. No current market-yield claim,
credit-rating judgment or automatic default forecast is inferred from a ratio.
The competing explanation is visible: nominal GDP can lower a ratio without
repayment, while a new yield does not instantly reprice every existing loan.

### Per-capita group

Question: which country owes most per resident, and is that a personal bill?
Answer: Belgium leads on this specific derived measure, which is not household
liability or creditworthiness. Retained the Dutch headline and SEO title.
The opening is recalculated from roughly EUR35,200 at March to EUR35,700 at June.
All 27 countries remain, including the Malta/Sweden displayed tie. The
Germany/Greece comparison now makes the denominator explicit: nearly equal
per-person amounts but very different GDP ratios.

Deleted repeated top-three/takeaway/conclusion sections. Joined the relevant
limits to the main comparison instead of repeating a disclaimer after each
country. The six-month debt/population mismatch is now beside the first tool
link, not only at the bottom. The tool remains annual and is not silently
relabeled as quarterly. In the browser pass, found a remaining Q1 statement in
the shared discovery copy and corrected that supporting copy for all four
locales, including the corresponding ranking note. This is a small directly
related correction, not a change to the data or discovery-routing behavior.

The full table earns its space as a 27-country lookup. Browser testing found the
shared 680px mobile table minimum unnecessary for its three short columns.
Added an opt-in compact ranking class, not a global change to other prose
matrices. At both 320px and 390px viewport widths all three columns fit. The
wrapper remains keyboard-focusable and describes horizontal scrolling if needed.
Ending: use output, interest and budgets to interpret the comparable amount.

### Greece/France

Question: is France repeating Greece's crisis? Answer: the trajectories differ,
but neither ratio establishes that scenario. Replaced the older national Q2
estimate with the jointly published June observation, and recomputed the annual
comparison from the same vintage. Removed stale “check after 21 October” and
duplicate FAQ/recap sections. The ESM repayment dates are confined to the ESM/EFSF
loans, not all Greek liabilities. The ending gives a bounded test for each country
rather than relabeling France as Greece or declaring Greece safe.

### Structure, rhythm and locale pass

Compared titles/openings/headings/endings across the revised archive families
and the 22 October NL, DE and FR quarterly news reports. The new reports retain
the news question “what was released”; the counter articles explain the model,
the ranking orders the common ratio, and the longer analysis explains its limits.
The inflation pieces keep their opinion stance and local price magnitudes.
Removed template-style FAQ/recap duplication rather than imposing a replacement
section quota. Shared economic definitions remain where necessary for equivalent
translations.

The simulated read-aloud pass corrected French stray Dutch “peildates” to
“dates de référence”, removed Dutch “crisisgrens” in favor of “piek” (there is no
formal threshold), and removed drafting-process commentary from the three
inflation openings. Locale decimal conventions, public link labels, source
qualification and summary promises were checked separately. Human comprehension
and native-language review remain unverified.

## Image and chart record

The former falling-coin imagery no longer matched the Dutch/English counter's
direction. Generated one new metaphorical civic-bridge scene with the built-in
image tool using the imagegen skill, visually inspected it, then exported with
Sharp to JPEG quality 86 (mozjpeg). Other heroes were retained; no old asset was
deleted. This is an explicitly credited AI editorial illustration, not evidence
of a real location, event or reported person.

Saved production asset:
`public/images/articles/netherlands-debt-counter-bridge-2026-v3.jpg`
Measured: 1672 × 941, 293,128 bytes. Used by the NL/EN counter companions only.

Complete image prompt:

> Use case: photorealistic-natural. Asset type: original editorial illustration for an evergreen Dutch government-debt counter explainer, also used for its English-language companion. A contemporary Dutch civic complex viewed across a short, level glass-sided pedestrian bridge connecting two restrained public buildings. One anonymous adult commuter at small human scale halfway across, seen from a distance and behind, face not visible. The two ends and the connecting span are a subtle metaphor for estimating between official observations, not a literal chart. Wide 16:9, one clear central crop-safe focal scene, soft overcast daylight, natural weathered paving, brushed metal and realistic glass reflections. Calm European financial-journalism realism, sophisticated but not glossy. No coins, ascending or descending stacks, desks, clocks, spirit levels, calculators, financial props, crisis imagery, staged political event or identifiable person. No text, numbers, graphs, flags, readable signs, logos, seals or watermark. Not documentary photography of a real site or event.

The existing native SVG remains the Dutch inflation chart. Its 121 monthly
annual-inflation points now run September 2016–September 2026; the endpoint labels
are NL 3.0% and EA 3.8%. Regression tests reconstruct both paths from the frozen
verified historical fixture. It shows annual rates, not cumulative inflation.
Inspected the rendered chart and explanatory caption on a 390px phone viewport.

## Compact editorial sign-off

For each of the six groups above: promise **ready**, evidence **ready** within
the stated provisional/source limits, progression **ready**, voice **ready after
AI line edit**, reader path **ready locally**, accountability **ready as
disclosed**. No unsupported consequential claim was retained to force the old
thesis. Independent human feedback/native editing remains **unverified** in
every locale; publishing authorization is not recorded as a human content review.

Publication-readiness evidence already obtained:

- Article audit: all 99 articles pass mandatory mechanical checks.
- Full tests after the compact-layout and discovery-copy regressions: 229 pass.
- ESLint: zero errors, 30 pre-existing warnings, including ignored historical
  cache paths scanned by the existing lint command. No cached release used.
- Production build: succeeds, 336 static pages generated; snapshots validated,
  not refreshed.
- All 21 updated article pages inspected via rendered DOM at 1280px and 390px:
  no horizontal document overflow, current hero loaded. Offscreen recommendation
  thumbnails remain intentionally lazy-loaded.
- All four 27-row tables also checked at 320px: wrapper width equals scroll
  width (266px); at 390px each equals 336px. Screenshot review confirms the
  complete country/amount columns and visible equal ranks.
- Representative screenshot checks: NL counter/new image, NL/FR per-capita
  tables, NL inflation chart/caption and Greece/France article header.
- Clicked NL counter → Netherlands country; NL/DE/FR opinion → correct selected
  country in inflation; French per-capita methodology → existing annual method
  anchor. Expanded Dutch sources and confirmed visible links and disclosure.
  Browser console at the tested flows: no error/warning entries.
- Original dates/authors/slugs covered by a frozen 21-article fixture; no manifest,
  translation-registry, generated-snapshot or four new news-story edits.

Remaining release gates: commit the focused changes, rebuild the exact clean
commit, run complete local/exact-preview/public verification, and current-main/
live-inventory preflight immediately before each release. Do not mark deployed
from these local results alone. The final chat report must give the actual
deployment and all-article preservation results, not predicted results.
