# German and French country articles — 24 October 2026

## Scope and baseline

The owner authorized research followed by writing two distinct country articles,
not publication. Clean local main and current remote main both start at
`2f97ed63ea46147ad9205f2c02075fb582f92908`. Local working branch:
`codex/de-fr-country-articles-2026-10-24`. No commit, push, production deployment,
Search Console submission, official-data refresh, or historical article rewrite
is authorized by this assignment. Preserve all 99 existing articles and manifest
entries. Append the two new local routes for normal validation; do not invent a
translation relationship between unrelated German and French articles.

## German editorial brief (before drafting)

- Locale/scope: German, municipalities in Germany; distinguish municipalities
  excluding city states from federal and general-government data.
- Genre: analysis, with a concrete public-service question rather than another
  generic debt-record report or an imitation of a newspaper columnist.
- Reader question: why can municipal budgets remain strained even when major
  infrastructure funding is available?
- Hook: Bundesbank analysis published 21 October 2026, read alongside Destatis's
  1 October release about the first half of 2026.
- Distinct intent: the existing 98.8/71.3bn article explains statistical systems;
  the investment-clock opinion assesses output versus disbursement; the new piece
  explains municipal operating needs, financing responsibility and how investment
  aid can free budget resources without curing a recurring gap.
- Main answer: investment support can help substantially, including indirectly,
  but a finite capital envelope and the recurring cost of local services are
  different financing questions.
- Alternatives rejected: a second generic Sondervermögen explainer duplicates
  the reform and investment-clock pieces; a claim that every town is bankrupt
  is unsupported. A new generic national deficit record adds too little.
- Original contribution: connect three official reporting perspectives and show
  the substitution mechanism with an explicitly general example, not invented
  reporting from a town. No sum of an annual/half-year gap and a multi-year fund.
- Supporting claims: half-year cash deficit EUR20.1bn; capital spending declined
  despite investment transfers rising; the EUR100bn state/municipality envelope
  is not all a municipal allocation and does not require automatic additionality.
- Strongest alternative: new investment transfers can lower municipal deficits.
  Acknowledge the Bundesbank's expectation that 2026 municipal deficits could
  fall, and explain how replacing already planned own-financed investment frees
  other funds. Do not claim support cannot help operating budgets at all.
- What could change the assessment: sustained recurring revenue/expense balance
  and demonstrably additional investment; no unverified assertion about the
  final 2026 result or any particular town's cuts.
- Reader destination: `/de/government-spending` for annual harmonized national
  accounts, clearly not a municipal dashboard; `/de/country/de` for the complete
  state's official debt/model distinction; related deficit and investment-clock
  articles only where they answer a separate question.
- Structure: direct municipal-service opening; the measured squeeze; scope of
  the EUR100bn; the indirect budget benefit; state responsibility; consequence
  for judging future announcements. Approximately 750–950 words, no table/FAQ.
- Accountability: AI research, full drafting, calculations and simulated language
  review for EU Debt Map Research. No independent human or native-speaker review.

## French editorial brief (before drafting)

- Locale/scope: French readers, French versus German sovereign financing.
- Genre: explainer/analysis, not a prediction of default or investment advice.
- Reader question: why do two governments borrowing in euros pay different
  market yields, and when does that difference affect public finances?
- Hook: current debate around the OAT–Bund spread; OFCE analysis on 20 October.
  Use the latest available complete comparable monthly official series rather
  than mixing a French intraday/TEC10 value with a German monthly observation.
- Distinct intent: the existing debt-cost explainer describes the total French
  interest bill; the unrest opinion discusses credibility and services; the new
  piece separates the common currency/common rate environment from the relative
  national premium and demonstrates the difference between yield and spread.
- Main answer: one monetary policy does not merge national issuers, budgets,
  maturity structures or investor demand. The spread is informative, but not a
  probability of default or the average rate on all debt.
- Alternatives rejected: another France–US comparison duplicates October 11;
  a default countdown exaggerates the evidence; a daily-rate scoop cannot be
  supported by subtracting observations of different dates or constructions.
- Original contribution: reproduce two-country August/September spread arithmetic
  from matching ECB/Eurostat series, separate a common rate increase from the
  widening gap, and bound a hypothetical new-loan calculation.
- Strongest competing explanation: both countries' yields rose. Show that this
  does not explain away the September widening, while noting that a spread can
  also change through the German reference rather than French deterioration.
- Limit: observed differences cannot isolate the share due to any one political
  event, default risk or liquidity. No same-day October spread is claimed.
- Destinations: early `/fr/country/fr` link for debt scope, `/fr/debt-to-gdp` for
  the France/Germany stock comparison, `/fr/interest-cost` for annual expenditure
  explicitly not a live bond-yield screen. Explain what each tool does not show.
- Structure: same euro/different financing; a comparable pair of observations;
  national issuers and investor pricing; the common-rate counterpoint; gradual
  refinancing and a clearly hypothetical example; reader implication. About
  750–950 words, two/four responsive number cards rather than a wide table.
- Accountability: same disclosed AI process; independent human/native review not
  performed. No first-person eyewitness claim or fabricated quote.

## Primary-source and claim ledger — reviewed 24 October 2026

### DE1 — observed provisional municipal cash figures

Source: Destatis, release 349, 1 October 2026:
https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/10/PD26_349_71137.html

Direct public HTTP200 text inspected after the web reader returned 403.
First half 2026, core and extra budgets of municipalities/municipal associations,
excluding city states: expenditure EUR204.1bn, revenue EUR184.0bn, deficit
EUR20.1bn, equal to the comparable first-half 2025 deficit. It is neither an
annual outcome nor a directly calculated Maastricht deficit. Capital spending
EUR21.7bn, -4.5%; construction EUR15.5bn, -2.4%; personnel +5.2%; social benefits
+3.9%; municipal interest expenditure EUR2.4bn, +13.1%. Investment transfers
from states EUR5.7bn, +8.7%. These aggregate results do not establish a cut,
insolvency, tariff increase or waste in every individual municipality.

### DE2 — analysis and bounded 2026 outlook

Source: Bundesbank monthly report, 21 October 2026, sections 1.3/1.4 and 4.1/4.2:
https://publikationen.bundesbank.de/publikationen-de/berichte-studien/monatsberichte/monatsbericht-oktober-2026-1010626?article=laender-und-gemeindefinanzen-2025-finanzlage-der-gemeinden-weiter-kritisch-1010628

Public HTTP200 text inspected, including the full relevant passages. Historical
2025 assessment and a prospective 2026 assessment are not the same period.
The Bank says local own-effort is one element of a larger adjustment and states
must ensure adequate municipal financing. It explicitly allows that municipal
deficits could fall in 2026 with higher transfers. For the state/municipality
funding pillar, H1 disbursement was approximately EUR0.5bn; surveyed states plan
EUR8.5bn for full-year 2026, roughly two-thirds for municipalities. Survey coverage
is incomplete and plans can undershoot; do not present this as a full forecast or
actual full-year disbursement. No additionality condition against a reference
year is anchored for this pillar; the Bank warns that financing already planned
investment can free funds without creating equivalent additional infrastructure.
No unsupported allegation of unlawful diversion follows from that warning.

### DE3 — scope of federal assistance

Source: BMF, 10 July 2026:
https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Oeffentliche_Finanzen/Foederale_Finanzbeziehungen/Kommunalfinanzen/entlastungen-der-kommunen-durch-den-bund.html

Public HTTP200 text inspected after the web reader failed. EUR100bn investment
envelope for states AND municipalities through 2042; states decide municipal
shares, with federal expectation of at least 60%. The latter is not an automatic
allocation to every town and is not described as a binding national municipal
minimum. Municipal functions and financial responsibility of states are stated.
Do not frame the envelope as EUR100bn per year or all already received by towns.

### FR1 — matched harmonized monthly market yields

ECB IRS series (live read-only CSV, HTTP200):
https://data-api.ecb.europa.eu/service/data/IRS/M.FR+DE.L.L40.CI.0000.EUR.N.Z?startPeriod=2026-08&format=csvdata

Eurostat JSON (HTTP200; data updated 13 October 2026 at 11:00 +0200):
https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/irt_lt_mcby_m?lang=en&geo=FR&geo=DE&sinceTimePeriod=2026-08

Same four observations in both dissemination channels; the source lineage is
shared, not two independent measures. Series: monthly convergence yields,
central-government bonds on the secondary market, around ten years' residual
maturity, percent per annum. August: FR 4.000%, DE 3.185%; September: FR 4.440%,
DE 3.473%. September is the latest complete month present when checked. The
underlying daily/benchmark construction differs from TEC10. Metadata:
https://ec.europa.eu/eurostat/cache/metadata/en/irt_lt_mcby_esms.htm

Original calculations: September (4.440 - 3.473) = 0.967 percentage point =
96.7 basis points, displayed as about 97. August 0.815pp = 81.5bp, displayed as
about 82. Widening: 15.2bp. FR yield increased 44bp; DE increased 28.8bp. The
spread did not widen by 44bp. This is a monthly comparison, not today's spread.

Illustrative calculation, NOT an observed emission: EUR1bn newly borrowed at
par for a full year with a fixed annual cost difference equal to 0.967pp gives
EUR9.67m extra annual interest. No transaction fees, same principal and maturity,
constant illustrative difference; do not apply it to the full debt stock or
automatically multiply by ten years. This is not a claim about an actual AFT bill.

### FR2 — current daily French index, deliberately not paired with a monthly rate

Source: AFT, TEC10 page, observed value for Friday 23 October 2026: 5.05%.
https://www.aft.gouv.fr/fr/tec-10-du-jour

Web reader's full primary page inspected and exact current value located. Direct
Node HTTP reader received a protection page; no bypass was attempted. This is
one French constant-ten-year daily index, not a matched October France/Germany
pair, not an average borrowing cost, and not a verified spread. If mentioned,
its date and difference from the September comparison must be immediate.

### FR3 — pricing, monetary policy and sovereign-stock context

ECB monetary policy introduction, inspected:
https://www.ecb.europa.eu/mopo/intro/html/index.fr.html
Policy rates influence financing conditions; no assertion that the ECB fixes
the national ten-year yields individually.

ECB Financial Stability Review, November 2025, pp. 105–106, text inspected:
https://www.ecb.europa.eu/press/financial-stability-publications/fsr/pdf/ecb.fsr202511~263b5810d4.en.pdf
Multiple sovereign issuers, different credit quality/issuance practices/market
structures; liquidity matters. This is conceptual context from 2025, not a new
assessment of the October 2026 event. A relative spread is not pure default odds.

Eurostat debt release, 21 October 2026, common vintage at 30 June, provisional:
https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-21102026-bp
France debt/GDP 119.1%, Germany 63.4%. These are general-government stocks,
whereas the benchmark yields concern central-government securities. No causal
percentage of the spread is derived from this stock comparison.

OFCE, Mathieu Plane and Pierre Madec, 20 October 2026:
https://www.ofce.fr/blog2024/fr/2026/20261020_mp_eg/index.html
Primary original analysis and public text inspected. The rendered page contains
chart-generation errors; its graph was not used as a numerical source. Retain
only clearly attributed qualitative political/budget uncertainty context, or
omit it from the final article if it adds no new explanatory work. Do not copy
its plotted daily levels or claim an event's isolated causal effect.

## Verification and release boundary

Before completion: separate skeptical/source/arithmetic/line-edit passes, actual
prose-edit record, image inspection, audit, relevant/full tests, production build,
desktop/mobile and local HTTP checks. Public/preview verification and the clean
release preflight remain for a later explicitly authorized publication turn.
All source access dates here are 24 October 2026. No generated official snapshot
is edited or refreshed. The final report must distinguish local draft completion
from publication and must not promise a rank, audience response or perfect score.

## Separate editorial passes and actual prose-edit record

### German analysis

Main question/answer: municipal investment help and a sustainable operating
budget are different problems; help can ease the second indirectly without
permanently solving it. Strongest detail: state investment transfers increased
8.7% while municipal capital expenditure declined 4.5% in the same half-year.
This is a comparison, not a causal decomposition or allegation of misuse.

The skeptical pass rejected an absolute assertion that investment aid cannot
help the operating budget. The drafted mechanism explicitly explains relief
of previously planned own financing and recognizes that efficient buildings can
reduce future costs. The Bank's conditional 2026 deficit improvement remains
visible in the opening. The 100bn envelope is multi-year and partly for states;
60% is an expectation, not a promise to each town. The hypothetical sports-hall
opening does not claim a real interview, project or closure.

Comparison articles inspected: German October 22 debt news, October 20
investment-clock opinion, and October 3 cash/ESVG deficit explainer. The new
opening uses recurring services rather than another record-debt announcement or
a duplicate judgment of the investment clock. It contains no FAQ, concluding
recap, wide table or copied case-reporting scene.

Actual final language edit: changed the abstract heading
“Zwischen Rathaus, Land und Bund liegt Verantwortung” to
“Wer die laufenden Aufgaben finanzieren muss”. It now identifies the reader's
question rather than leaving responsibility rhetorically between institutions.
The rest of the simulated read-aloud pass retained the short concrete opening
and longer explanatory paragraphs because they make different steps. No
invented revision is claimed. The ending adds the cost of operating the asset
after opening, rather than repeating the half-year deficit.

Human reader feedback and native-language review: not performed. Terminology
and reasoning were checked by the AI assistant, with that limitation disclosed.

### French explainer

Main question/answer: the euro does not make national issuers identical; a
spread is a relative market price and does not instantly reprice all debt.
Strongest concrete detail: of the 44bp August–September French yield increase,
28.8bp also occurred in the German series, leaving a 15.2bp widening. The
monthly comparison and the October 23 French daily index remain separate.

The reasoning risk is that “4.44 minus 3.47” appears to give 97 rather than 96.7.
The prose says before-rounding values; the footer/source note retains 4.440 and
3.473, making the displayed approximate 97bp reproducible. The example uses a
hypothetical new EUR1bn at par with the same principal/maturity, fixed rates and
no fees, not a claimed cost of all outstanding debt.

Actual precision edits:
- “Quand un investisseur achète un titre français…” became
  “Quand un investisseur achète une obligation de l’État français…” so the issuer
  is unmistakable rather than possibly a French company.
- Replaced the blanket “ne peut pas … le multiplier automatiquement par dix
  années” with “Ce calcul ne mesure ni la facture de toute la dette française ni
  son cumul réel sur dix ans.” This limits the claim without denying valid
  arithmetic under a specified hypothetical loan duration.
- Added “non indexés” to the retained conditions of older fixed-rate bonds.
- Changed “Selon la publication d’Eurostat” to “Selon les données provisoires
  publiées par Eurostat” beside the national debt-ratio claim.
- Final reader-comprehension edit expands TEC10 at its first appearance,
  introduces the natural “spread OAT–Bund” term with both instruments explained,
  removes the later duplicate Bund definition, and explains “au pair” as a sale
  at nominal value. No unexplained acronym is used as the opening sentence.

Comparison articles inspected: French October 22 debt news, September 30 total
interest-cost explainer, and October 20 unrest/credibility opinion. Avoided a
second argument about riot attribution, a default countdown and a broad repeat
of the entire French interest bill. The separate “Le taux allemand bouge aussi”
section supplies a genuine competing explanation rather than a token objection.
The conclusion connects the relative financing price to gradual fiscal costs.

The simulated read-aloud/locale pass retained “points de base”, “marché
secondaire”, “au pair” with immediate plain-language explanation or conditions.
It is not a native-speaker test. Human reader feedback: not performed.

## Editorial sign-off

Both articles: promise **ready**, evidence **ready within stated source/period
limits**, progression **ready**, voice **ready after AI edit**, reader path
**ready locally**, accountability **ready as disclosed**. Independent
human/native review remains **unverified**, not silently counted as passed.
Neither a perfect-quality score nor a ranking/Discover result is promised.

Accuracy: inspected primary pages and reproduced arithmetic. Originality:
municipal fiscal-substitution mechanism versus same-currency relative pricing.
Fairness: acknowledge aid's benefits and the changing German reference yield.
Readability: short paragraphs, relevant headings, no FAQ padding or wide tables.
Local relevance: municipal-service stakes in Germany, public-financing stakes
in France. Links: country and comparison tools explain their own coverage.
Mobile presentation: checked separately from content truth.

## Image-generation record

Used the built-in image tool via the imagegen skill, not the fallback CLI/API.
Two brand-new, separately prompted assets, no reference-image edits. Inspected
both full outputs: anonymous back-view subjects, no identifiable faces, readable
documents, text overlays, logos or fictitious political events. The German civic
environment and French financial-district staircase have different scene types,
viewpoints and light. They are illustrative fictional scenes, not evidence of
a particular town, a real resident, an event or an exact location.

Final workspace JPEG assets, exported with Sharp/mozjpeg quality 86:
- `public/images/articles/kommunen-investitionsmilliarden-haushaltskrise.jpg`
- `public/images/articles/france-allemagne-ecart-taux-emprunt-euro.jpg`

Both measured 1672 × 941 pixels; metadata and localized alt/credit match.
Generated originals remain in the default Codex generated-images directory.

Complete German prompt:

> Use case: photorealistic-natural. Asset type: original EU Debt Map editorial hero illustration for an analysis about German municipal budgets, investment funding and the recurring cost of public services. Scene: a quiet ordinary German town civic square in autumn, a modest modern municipal library and community-services building with a small adjoining public sports hall, authentic brick, pale plaster, weathered paving and practical cycle racks. Subject: one anonymous adult resident walking a bicycle across the square, seen from behind at small human scale, face not visible. Show functioning everyday public infrastructure, neither luxury nor dereliction. Composition: wide 16:9 landscape, eye-level candid photographic realism, one coherent crop-safe scene, people and building entrance in the central safe area, not a collage. Soft cool overcast daylight, restrained autumn leaves and subtle warm interior lighting. Natural material texture, calm trustworthy European financial journalism. No desks, paperwork, coins, money stacks, calculators, clocks, bridges, scales, spirit levels or repeated finance props. No claim of an actual location, closure, protest or documented project. No text, readable signs, logos, flags, seals, numbers, charts or watermark.

Complete French prompt:

> Use case: photorealistic-natural. Asset type: original EU Debt Map editorial hero illustration for a French explainer about why French sovereign borrowing costs differ from German borrowing costs within the euro. Scene: an outdoor public stone staircase and broad plaza at the edge of a contemporary French financial district, Paris La Defense-inspired glass and limestone architecture softly in the background, no landmark reproduction necessary. Subject: one anonymous adult commuter in a dark coat climbing the shallow staircase, viewed from behind at medium distance, full figure visible, face not shown, natural posture. The steps quietly suggest the cost of accessing finance without being a literal chart. Composition: wide 16:9 horizontal, low oblique viewpoint, central crop-safe human-scale focal point, rich realistic stone and glass textures, generous but not empty scene. Soft early-morning warm sunlight with cool blue shadows, sober photographic editorial realism, neither glossy advertising nor crisis imagery. Distinct from a town square or an office-desk scene. No coins, stacks, financial documents, calculators, clocks, bridges, scales, politicians, invented press event, graphs, readable text, labels, flags, logos, seals, numbers or watermark. An illustrative fictional scene, not documentary evidence of a real person or event.

## Verification record

- Article audit passes for all 101 local articles.
- All 232 Node tests pass, including three new regression tests for these
  articles' calculation/scope limits, footer/source visibility and separate
  language identities. No translation group was invented.
- ESLint: zero errors, 30 existing warnings, including the historical ignored
  cache directories scanned by the existing command. None used for publishing.
- Production build succeeds; 336 static pages. Official datasets validated
  without refreshing or editing snapshots.
- Full local publication verification on port 3043: 101 articles, 62 images,
  three canonical rechecks, schema, sitemap, translation targets, redirects
  and real unknown-article 404 all pass.
- Desktop screenshots at 1280px: both headings, summaries and hero crops fit.
  Mobile 390px: document has no horizontal overflow, two-number cards stack
  in one column, no wide tables. Native source sections expand; 3 German and
  7 French source links and truthful AI disclosures render.
- French main country link clicked and resolved to the French country page.
  German annual-spending comparison and French interest-cost comparison also
  resolve and display the correct localized headings. The German link needed a
  keyboard activation after one browser click had no effect; its href and HTTP
  response were correct throughout. No application change was made to mask it.
- At 320px both articles also fit: document scroll width 310px, cards about
  278px wide, no clipped comparison columns. Browser console: no error/warning
  entries at these local flows. All eight distinct internal destinations return
  HTTP200. Final minor copy changes are rebuilt and checked before delivery.
- No original article content, translation registry, generated snapshot or
  production setting was modified. Manifest retains the 99 original entries
  and appends the two new local routes.

A separate concurrent edit appeared in
`components/country-preview/country-preview.module.css` during verification.
It changes country-hero spacing, is outside this writing task and was left
untouched. It must not be staged incidentally as article work. The local build
includes the current workspace state; it is not an authorized release baseline.

Status: local drafts, **not published**. No commit, push, preview/public
deployment, remote configuration change or Search Console action performed.
A later publication requires fresh main comparison, deliberate integration of
all local work, full clean-commit release checks and explicit authorization.

## Publication authorization and integrated release, 24 October 2026

The owner subsequently authorized publication of both articles ("oke zet maar
live"). The earlier local-draft status above records the writing phase, not
the outcome of this later release. Commit, push and deployment of these two
approved articles are now in scope; Search Console actions and data refreshes
remain out of scope.

Fresh remote comparison found main had advanced to
`97a2d9447b63123e32d410a0a7772cc0445d7c89`, containing the concurrent country
header-spacing improvement. The local CSS was byte-identical to that remote
version. Its local diff was saved in a path-specific recoverable Git stash,
then current main was fast-forwarded into the article branch. The spacing
improvement is preserved from main, not staged as an article change.

The integrated release must pass the audit, full tests, lint, production build,
local publication verification and clean-tree preflight before upload. The
exact preview and public domain are verified separately; neither publication
authorization nor an upload is evidence of a completed public release.
Independent human/native review remains unperformed, as disclosed above.
