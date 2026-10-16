# France-US debt article: editorial and publication review

Date: 2026-10-11. New French article; publication authorized after local review. Research and the
pre-draft brief are in `article-france-us-debt-research-2026-10-11.md`.

## Editorial decisions and skeptical edit

- Reader question: does higher American public debt make French debt concerns
  excessive? Answer: another country's financing advantages do not transfer with
  its debt ratio; euro membership offers protection with real constraints.
- Chosen angle: a French budget argument, rather than another general Europe-US
  institutional guide or a prediction about the dollar collapsing. The existing
  Europe-US article explains general capacity; this article tests the specific
  claim that Washington's borrowing permits Paris to borrow more without concern.
- Current hook: Insee's Q2 2026 release on 29 September. Annual comparison kept
  separately at 2025, with the American IMF estimate explicitly dated April 2026.
- Strongest objection: France cannot tailor monetary policy or a national
  devaluation to its own needs. The fourth section acknowledges this, explains
  the conditional ECB safety mechanism, and avoids claiming that euro exit would
  either solve or certainly worsen financing without a separate analysis.
- Evidence that would weaken the conclusion: comparable evidence establishing
  that French obligations have the same structural global demand as Treasuries,
  or an unconditional common guarantee of national debt. Neither follows from
  the reviewed sources. We do not infer current comparative market fear or yields.
- The same-year figures cover general government, but accounting conventions are
  not identical. No precise risk ranking or percentage-point safety gap is drawn.
- The French country page still uses the Eurostat vintage. Prose explicitly says
  national releases can be more recent; no snapshot refresh was performed.
- CBO interest projections are conditional federal flows, not another comparable
  public debt stock. The Fed is not described as a Treasury-directed printing press.
- Reader action: inspect `/fr/country/fr` and then `/fr/debt-to-gdp`. Source links
  stay at the end, in an accessible native disclosure, without removing attribution.

## Separate prose edit, section 5a

- Concrete detail: 115.7% France and 123.9% US in 2025 make the argument testable.
  The latest French 119.0% is separately dated rather than blended into the pair.
- Comprehension risk: debt stock versus annual GDP and annual funding needs.
  A paragraph explains that the whole ratio is not a bill due next year.
- Repetitive passage avoided: no second generic list of US advantages, wide data
  table, FAQ or boilerplate collapse scenario. The last section moves from currency
  institutions to the actual choices a French budget must explain.
- Local idiom/rhythm pass was AI-assisted and text-based, not a human read-aloud
  session. Used French terms such as adjudications and charge d'intérêts, avoided
  unexplained reserve-share statistics, and defined PIB and the CBO on first use.
- Compared with three related French articles: the Europe-US capacity guide opens
  with a broad question and lists institutional differences; the US 40-trillion
  article begins from the federal headline; the French interest-cost article
  begins from its financing bill. This introduction instead tests a reassurance
  argument and announces the bounded editorial judgment within two paragraphs.
- Ending adds three tests for a French budget: purpose, growth contribution and
  resilience if growth disappoints. It does not promise imminent insolvency or
  finish with a promotional instruction.
- Human reader feedback and independent native-French review: not performed.
  Research, full draft and editing were AI-assisted; no named human is credited.

## Image

Built-in image generation was used (not CLI/API fallback). Original output:
`C:/Users/simeo/.codex/generated_images/01a0b0a2-7412-75f2-a916-ebed26a0d7f1/exec-a359351f-2404-4e29-91ab-cc7d063cc573.png`.

Final asset: `public/images/articles/dette-france-etats-unis-euro-dollar-comparaison.jpg`.
Measured 1672 x 941 pixels; optimized JPEG, 241274 bytes.

Prompt:

> Use case: photorealistic-natural. Asset type: EU Debt Map French analysis hero,
> original editorial illustration, 16:9 landscape. Primary request: illustrate
> France confronting the financing of its public debt through a calm outdoor scene
> in the La Défense financial district near Paris. Subject: one anonymous adult
> woman viewed from behind, carrying a plain slim navy folder, standing on the broad
> pedestrian esplanade looking toward the glass office towers; face not visible,
> ordinary contemporary business clothes. The person and architecture should share
> the frame, human scale against large financial institutions. Style:
> photographic-looking original editorial illustration with natural material texture,
> restrained European financial-journalism art direction, no invented news event.
> Composition: wide 16:9, person within central safe area, generous sky, clear readable
> silhouette at thumbnail scale. Soft autumn daylight, cool blue glass and warm
> limestone, realistic understated contrast. Do not use a desk or calculator scene.
> No text, numbers, readable documents, charts, flags, logos, official seals,
> signatures, watermarks, distressed people or crisis symbolism. No real or
> identifiable person. Output landscape image at least 1200 pixels wide.

Inspected the generated image: the main person is seen from behind; anonymous
background pedestrians, unreadable folder, no added figures or charts, calm outdoor
context. Illustration credit is visible below the hero; this is not a news photograph.

## Related template correction

The French article route previously printed a fixed Eurostat source line for every
article and did not display image credits. It now uses the article's `sourceNote`
with the previous text as fallback, and a conditional hero caption. No canonical,
hreflang, ad settings, translation mapping or data snapshots were changed.

## Verification and limitations

- Article audit: 77 articles, passed.
- Focused article-page tests: 26 passed.
- Full tests: 197 passed.
- Lint: exit 0, no errors, 44 warnings across existing code and cached checkouts.
- Production build: passed, 332 static pages generated; existing Edge Runtime
  deprecation/static-generation warnings remain.
- Browser: inspected desktop at 1280 pixels and mobile at 390 x 844. The mobile
  document had clientWidth/scrollWidth of 380/380; prose width 348. Hero loaded at
  1672 x 941; credit visible. No wide table was introduced.
- Sources disclosure opened using Enter: 10 source links rendered, no horizontal
  overflow. Both country and debt-to-GDP links navigated to the correct French
  pages. No console errors were captured during the mobile article/country flow.
- Final acronym edit: expanded PIB and the French name of TPI at first mention.
- Drafting step: no publication or Reddit post was authorized or performed.
- Recheck IMF vintage if publishing on or after the scheduled 13/14 October
  releases. The article currently labels the April estimate rather than implying
  a newer forecast has already been published.

## Editorial assessment (qualitative, not a traffic guarantee)

- Accuracy: periods, perimeters, provisional data and forecasts distinguished.
- Contribution: tests a specific French reassurance argument instead of repeating
  a general institutional guide. No original reporting or econometric estimate.
- Fairness: dollar advantage, euro benefits and euro constraints all included.
- Readability: six descriptive sections, short paragraphs, technical names expanded.
- Local relevance: French budget choices and conditional household consequences.
- Internal links: each supports a reader question; external links remain accessible.
- Mobile: no overflow observed on the tested viewport; source list opens by keyboard.
- Remaining editorial limitation: no independent human/native-French reading yet.

## Publication follow-up

The owner explicitly requested publication on 2026-10-11. This authorizes deployment,
not a claim of independent human editorial review. The internal publication note
was updated accordingly, without changing review dates or the public argument.

Deployment uses production baseline `dpl_6cK63jW1n9BSvrDRZPPv4DVcAJpa` and preserves
all other production source hashes. Exactly three files are included: the new
French article JSON, its JPEG, and the reviewed French article template correction.
The existing template was compared with production before replacement to ensure
there were no unrelated changes. No unrelated dirty-worktree changes are shipped.

Article audit: passed, 77 articles. Focused tests: 26 passed. Full tests: 197 passed
again after updating the internal note. One wording-sensitive assertion initially
failed after adding the word 'éditoriale'; it was adjusted without weakening the
check for honest human-review disclosure, and both suites passed subsequently.

Deployment `dpl_412Qq1PZpTQvmUWwgxc1tcUTsWEx` reached READY and is assigned to
`www.eudebtmap.com` and `eudebtmap.com`. Vercel's production build succeeded.

Live verification: the public article renders the final French title, canonical,
1672 x 941 image and article-specific source note. The sources disclosure opens
and contains all 10 links. The primary internal link reaches `/fr/country/fr`.
HTTP checks returned 200 for the French article index, sitemap, RSS and
`/fr/debt-to-gdp`; the new slug appears in the index, sitemap and RSS. The live
article tab is retained for the owner. No Reddit post was made.
