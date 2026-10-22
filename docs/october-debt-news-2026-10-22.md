# October quarterly debt news — editorial dossier, 22 October 2026

## Commission and release boundary

The owner requested a new country-specific article for each website edition and
explicitly authorized publication once quality and release checks pass. Scope:
NL for the Netherlands, FR for France, DE for Germany, EN for a European story
centred on Finland. These are four distinct news reports, not translations;
do not add reciprocal translation alternates between them. No old article,
official snapshot, production configuration or public URL is being replaced.

Starting clean checkout and remote main match at
`b89e3efb64438b915eac4f1576fc2285993fb0e3`. The recent homepage, direct country
navigation and shared sticky navigation changes must remain included. The user
has not authorized Search Console submissions. Existing article manifest entries
must remain; append the four new URLs only.

## Shared claim ledger and source check

Reviewed 22 October, before drafting:

- [Eurostat quarterly release, 21 October 2026](https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-21102026-bp):
  Q2 2026 observations, not October debt levels. Provisional figures. Euro area
  means EA21 here; EU means EU27. Do not substitute the separate annual EDP
  notification published on the same date (`2-21102026-ap`).
- [Quarterly debt methodology](https://ec.europa.eu/eurostat/cache/metadata/en/gov_10q_ggdebt_esms.htm):
  consolidated gross general-government debt at face value; GDP denominator is
  the sum of the last four quarters. Not just central government, net debt,
  current market yields or a continuous official debt measurement.
- Direct read-only comparison of the two full API URLs recorded in
  `lib/fiscal/growth.gen.json`: all **162** checked observations matched stored
  inputs, covering debt and ratios for all 27 countries at 2025-Q2, 2026-Q1 and
  2026-Q2. Source updated 21 October at 11:00 +0200. No importer or data refresh
  was run. Exact inputs and dates remain available through those source URLs.
- [CBS, 23 September](https://www.cbs.nl/nl-nl/nieuws/2026/39/overheid-kwam-8-miljard-euro-tekort-in-eerste-helft-van-2026):
  Dutch June level had already been reported at rounded EUR524bn; the first-half
  comparison is not the Q1-to-Q2 comparison. Do not advertise every Dutch input
  as first revealed in October.
- [Insee, 29 September](https://www.insee.fr/fr/statistiques/9053525):
  earlier French Q2 release reports EUR3,595.5bn, +EUR59.6bn and 119.0% of GDP.
  October Eurostat reports 119.1%, with Q1 revised to 117.7%. Keep vintages apart;
  the later ratio is not a fresh quarter of borrowing since September.

| Claim | Verified inputs | Status and use |
| --- | --- | --- |
| NL quarter debt increase | EUR523,795m minus EUR517,377m = EUR6,418m | Original subtraction; report EUR6.4bn, not gross bond issuance or a deficit |
| NL ratio | Q1 43.8%, Q2 43.7%; release's independently rounded quarter change 0.0pp | Say virtually stable, not a sharp decline or a precisely measured -0.1pp; rounded endpoints need not reproduce separately rounded changes |
| NL model direction | +EUR6.418bn over 91 days, about +EUR816/s | Existing site's linear model, not observed cash flows or a forecast |
| FR quarter debt increase | EUR3,595,524.9m minus EUR3,535,928.6m = EUR59,596.3m | Original subtraction; report +EUR59.6bn |
| FR ratio comparison | 119.1% vs 117.7% in Q1 and 115.4% a year earlier | +1.4pp quarterly, +3.7pp yearly within October vintage; third-highest EU ratio |
| DE quarter debt increase | EUR2,924,674.2m minus EUR2,902,262.5m = EUR22,411.7m | Report EUR22.4bn increase, stock EUR2.925tn; whole government |
| DE ratio | Q2 63.4%, Q1 63.5%, year-earlier 61.4% | Slight quarter decline alongside higher debt; old July Q1 64.4% cannot be subtracted as a like-vintage comparison |
| FI quarter movement | EUR259,585m vs EUR254,813m; ratio 90.2% vs 89.5% | +EUR4.772bn, rounded EUR4.8bn; no claim of a first-ever historical crossing |
| EU grouping above 90% | GR, IT, FR, BE, ES, PT, FI in Q2; same group without FI in Q1 | Original count, seven versus six; 90% is our comparison category, not a legal ceiling or risk rating |
| Aggregate context | EU27 82.9% vs 82.5%; EA21 88.8% vs 88.4% | Official aggregates from the quarterly release, not an average of national ratios |

The press table differs from the stored API for Latvia's rounded Q2 ratio
(48.1% versus 48.0%). The articles do not use that country observation or infer
counts of rising/falling ratios from rounded endpoints. This discrepancy does not
affect the named above-90% group. No generated file is manually corrected.

## Four pre-draft briefs

### NL — a quarterly increase, not a new October debt stock

- Reader question: why does the Dutch counter move upward again, and where does
  the Netherlands sit in the new European comparison?
- News answer: +EUR6.4bn in Q2 to EUR523.8bn, while the ratio was virtually stable
  at 43.7%. The new release puts countries on the same quarter and vintage.
- Considered angles: another cash-buffer explanation (reject: duplicates recent
  analysis); dramatic fall in the ratio (reject: rounding would overstate it);
  dated quarterly increase with EU context (choose).
- Concrete contribution: reproducible stock subtraction, quarter/half-year
  distinction and a restrained explanation of the model's change of direction.
- Destination `/nl/country/nl`; supporting `/nl/debt-to-gdp`. Link to the recent
  cash-buffer analysis only to resolve the different comparison windows.
- Do not attribute the increase to a named spending programme without a fiscal
  reconciliation. Target a concise news report, not a mandatory 600-word essay.

### FR — France in the new common European release

- Reader question: what does the October European comparison add to the French
  June debt level already known from Insee?
- News answer: Eurostat puts France at 119.1%, third in the EU; its ratio rose
  3.7 points over the year while the euro area rose 1.5 points.
- Considered angles: another budget-2027 test (reject: overlap); new record first
  discovered yesterday (reject: Insee publication predates it); comparable
  European position and the source-vintage distinction (choose).
- Show the +EUR59.6bn quarter movement, but do not call it the deficit, interest
  expense or debt caused by October unrest. No default date or crisis prediction.
- Destination `/fr/country/fr`; supporting `/fr/debt-to-gdp`. Explain 119.0% versus
  119.1% as different publications, without asserting an unverified single cause
  for the revision. Short news structure, no three-test checklist.

### DE — higher debt, modestly lower quarter ratio

- Reader question: what rose by EUR22.4bn, and is that the federal budget alone?
- News answer: Maastricht debt of the whole government reached EUR2.925tn, with
  a 63.4% ratio; this is not EUR22.4bn of federal deficit or a measurement of
  infrastructure-programme success.
- Considered angles: repeat the investment-clock evaluation (reject); describe
  a collapse from July's old 64.4% (reject: source-vintage mixing); latest stock,
  general-government coverage and revised baseline (choose).
- Concrete contribution: exact subtraction and the within-vintage Q1 63.5%
  comparison. No need for another fictional-country exercise.
- Destination `/de/country/de`; supporting `/de/debt-to-gdp` and methodology.

### EN — Finland joins the above-90% group this quarter

- Reader question: what changed outside the familiar high-debt-country headlines?
- News answer: Finland moved from 89.5% to 90.2%; the comparable EU27 group above
  90% grew from six countries to seven. This is a dated count, not a risk model.
- Considered angles: Greece versus France again (reject: just published); generic
  EU debt explainer (reject: existing evergreen); Finland plus the original
  grouping calculation (choose). English takes a European, not a British, lens.
- No first-ever crossing claim; no implication that 90% changes legal status,
  proves distress or establishes a causal threshold for growth.
- Destination `/country/fi`; supporting `/debt-to-gdp`. Aggregate EA21 and EU27
  context is labeled explicitly; no summation mistaken for consolidated EU debt.

## Archive comparison, responsibility and review plan

Inspected titles, openings, headings and endings of three related pieces per
edition: NL cash-buffer, France unrest and debt-per-person; FR deficit/debt,
national debt record and France-US; DE investment clock, live debt explanation
and cash-versus-national-accounts deficit; EN Greece-France, France unrest and
EU debt ranking. All twelve are existing archive material, not independent proof
of their claims. Avoid their recurring contrast/example/three-tests structure.

Responsible publication identity: EU Debt Map Research. AI performs research
assistance, full drafting and separate source/arithmetic/language passes. No
independent human or native-language review is claimed. A simulated read-aloud
pass is not human feedback. Public footers disclose the actual contribution.

Before declaring ready: record actual prose edits and the six readiness decisions,
inspect distinct images and localized links on desktop/mobile, run audit/tests/
lint/build, and verify the complete local, exact-preview and public inventories.
Current checks in this document are evidence only for what has already run.

## Prose-edit record and editorial decisions

Separate skeptical and line-edit passes completed before publication. No test
reader or native-language human has supplied feedback. These are AI editorial
decisions, not independent endorsements.

- NL: replace a draft explanation about rounded figures “lying further apart”
  with the explicit mechanism: the rounded endpoints need not give the same
  difference as the separately calculated change. Retain the official 0.0pp
  qualification beside 43.8/43.7, not only in this dossier. Replace the repeated
  October-versus-June warning in the ending with the practical distinction
  between the first-half and quarter comparison. Do not manufacture an exact
  -0.1pp headline. Each paragraph now advances from stock, to ratio, comparison
  window, model and EU context.
- FR: replace the subheading “Un écart européen qui se creuse, pas une échéance de
  défaut” with “Une hausse plus rapide que dans la zone euro”. It names the
  verified development without another “not X but Y” crisis frame. The 119.0%
  Insee/119.1% Eurostat distinction remains in the article. No asserted single
  cause of the revision or attribution of June debt to October events.
- DE: shorten the visible title from “Neue Eurostat-Zahlen: Deutschlands
  Staatsschulden steigen um 22,4 Milliarden Euro” to “Deutschlands Staatsschulden
  steigen um 22,4 Milliarden Euro”. Eurostat attribution stays in the lead.
  This removes a generic announcement and improves mobile wrapping without
  changing the promise. Explain the whole-government scope in ordinary German.
  Use current-vintage Q1 63.5%; do not introduce the old 64.4% as a comparator.
- EN: cut the padded paragraph explaining that Finland was not included because
  of its region or another country's financing problems. Replace it with the
  narrower quarter-to-quarter count and one sentence about non-identical risks.
  Shorten the 90% disclaimer and replace the repeated reference-date ending
  with an actual comparison: Finland +0.7pp, EU/EA +0.4pp. Keep the non-legal
  status of the grouping prominent. No claim of a first-ever crossing.

All four are complete short news reports rather than opinion columns. They
answer distinct country questions, with no fictional examples, FAQ, oversized
comparison table, or quota-driven padding. Source attribution remains in prose;
external links are in the sources disclosure. The new stories use different
illustrations and are not registered as equivalent translations.

### Compact sign-off

| Edition | Promise | Evidence | Progression and voice | Reader path | Accountability |
| --- | --- | --- | --- | --- | --- |
| NL | Ready: Q2 increase is delivered immediately, ratio qualified | Ready: stock subtraction, official rounding, CBS publication date and 91-day model reproduced | Ready after rounding/ending edits; no recycled cash-buffer tutorial | Ready: Dutch country, ranking and earlier explainer; desktop/mobile checked | AI contribution disclosed; independent human/native review unverified |
| FR | Ready: current European ratio and relative deterioration, not a newly discovered June stock | Ready: common-vintage +3.7pp vs EA +1.5pp; Insee vintage separate | Ready after headline-section edit; news before methodology caveat | Ready: French country and ranking; desktop/mobile checked | AI contribution disclosed; independent human/native review unverified |
| DE | Ready: whole-government increase, not federal deficit | Ready: +22.4bn and same-vintage 63.5 to 63.4; year comparison separate | Ready after title cut; fiscal scope earns its section | Ready: German country and ranking; desktop/mobile checked | AI contribution disclosed; independent human/native review unverified |
| EN | Ready: Finland and the seven-country group, not another France/Greece essay | Ready: +4.8bn, 89.5 to 90.2; 90% explicitly a chosen category | Ready after removing defensive filler; ends with aggregate comparison | Ready: Finland country and EU ranking; desktop/mobile checked | AI contribution disclosed; independent human/native review unverified |

Accuracy and sourcing: common-vintage observations match the direct API check;
the release/metadata and CBS/Insee pages were opened and read. Original contribution:
reproducible stock differences, the Dutch rounding explanation, the French
relative movement, German scope and Finland group count. Fairness: no inference
of default, programme effectiveness or political causation from a stock alone.
Readability/local relevance: local terminology and decimal conventions; concise
news lengths, not literal translations. Internal links: describe the actual
destination and stay in the same locale. Mobile: no tables or horizontal page
overflow at 390px; source disclosures tested open. No numeric quality score or
traffic/Discover guarantee is claimed.

## Images: production record and prompt set

Generated with the built-in imagegen tool, four separate assets, no reference
image. All four outputs were visually inspected: no visible readable labels,
badges, data claims or identifiable people; distinct scenes and crop-safe
subjects. The French asset is an evocation of institutional architecture, not a
documentary photograph of Bercy. The Finland scene is Helsinki-inspired, not an
assertion that a photographed event occurred.

JPEG export: Sharp, quality 86, mozjpeg, no enlargement or alteration of content.
All four measured outputs are **1672 × 941**, above the large-image requirement.
Alt text and image credits are localized. The public source disclosures state
that the generated scenes do not document actual news events.

### NL

Output: `public/images/articles/netherlands-quarterly-debt-civic-square-2026.jpg`.

Prompt:

> Use case: photorealistic-natural. Asset type: original editorial illustration for a Dutch financial-news article about quarterly government debt, not a photograph documenting an event. A calm contemporary Dutch civic square near a modern glass-and-brick municipal building, one anonymous adult seen from behind standing beside a city bicycle, small human scale, face invisible. Clean geometric street-level composition, wide 16:9 with the building and person in the central crop-safe area, natural dry morning light and honest brick, glass and metal textures. No canal balustrade, raincoat on a bridge, desks, coins, scales or stacked finance props. No press event or identifiable real person. No readable signs, letters, numbers, charts, flags, seals, brands, logos or watermark. Sober European financial-journalism realism, not glossy stock photography or a disaster scene.

### FR

Output: `public/images/articles/france-quarterly-debt-bercy-river-2026.jpg`.

Prompt:

> Use case: photorealistic-natural. Asset type: original realistic editorial illustration for French public-finance news, not an actual news photograph. Wide 16:9 architectural scene evoking the modern public-finance buildings at Bercy beside the Seine, observed from a quiet riverside walkway. Contemporary institutional geometry and a restrained portion of river, soft early-evening natural light, textured pale concrete, glass and water. No foreground finance props, no desk, no staged folders or money, no postcard monuments. Clear central architectural focal point, sophisticated perspective, crop-safe thumbnail readability, calm and credible. No people, no claimed meeting or event, no riots, damage, smoke or flames. No text, numbers, signage, charts, flags, logos, official seals or watermark.

### DE

Output: `public/images/articles/germany-quarterly-debt-government-courtyard-2026.jpg`.

Prompt:

> Use case: photorealistic-natural. Asset type: original photographic-looking editorial illustration for German national debt news, explicitly not documentary coverage. An anonymous adult office commuter seen from the back crossing a spacious Berlin-style government-quarter courtyard between pale stone and modern glass institutional facades. Medium-wide 16:9 framing, clean strong horizontal perspective and one understated human focal point, subject inside central crop-safe area. Crisp soft daylight, worn natural paving and believable fabric and glass textures, quiet professional atmosphere. No train platform, stairs, skyline postcard, financial desk, calculators, coins, scales or paperwork. No identifiable public figure or official event. No readable signs, text, numbers, charts, flags, badges, seals, logos or watermark.

### EN

Output: `public/images/articles/finland-quarterly-debt-helsinki-harbour-2026.jpg`.

Prompt:

> Use case: photorealistic-natural. Asset type: original editorial illustration for European debt news focused on Finland, not a documentary photo of a statistical release. A quiet Helsinki-inspired civic waterfront with northern granite architecture and a modest ferry terminal softly behind, an anonymous bundled adult seen from behind at a plain public railing watching the harbour. Wide 16:9 with a clear central scene and human scale, restrained blue-grey Nordic daylight, real stone, painted metal and rippled water, understated autumn atmosphere without rows of decorative leaves. No finance desk, coins, balance scales, folders, maps, charts or data symbols. No distressed people, officials or invented political event. No readable vessel names, signs, text, numbers, flags, logos, seals or watermark. Calm premium financial-journalism editorial realism, not a travel advertisement.


## Checks executed before the release commit

- Article audit: all 99 articles pass; all use the modern standard.
- Full Node suite: 221 passed, 0 failed, including two new news safeguards.
  Updater tests use test fixtures; no production data importer was run.
- ESLint: 0 errors, 30 existing warnings outside this change (including ignored
  historical cache copies). No cache directory was used as a release source.
- Production build: succeeded, 336 static pages; stored data validated only.
- Browser: all four new articles viewed at desktop 1280px and mobile 390px.
  Images loaded at measured size, no horizontal page overflow; source disclosures
  open in all four languages. Article-to-country links were exercised. The
  initial sandbox-hosted server timed out; the same local build became reachable
  when the checks server was started with the required local-process access.
- Browser console check during the flow returned no errors or warnings.
- Publication manifest appends four entries; existing articles and translation
  records have not been edited. `git diff --check` passed.

Exact clean-commit rebuild, complete local HTTP verification, immediate release
preflight, exact preview verification and strict public verification must still
run after this record. This dossier does not pre-claim those results. Report their
actual output at handoff. Human/native-language independent review remains absent.
