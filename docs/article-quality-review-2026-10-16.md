# Archive-wide article quality review — 16 October 2026

## Outcome

The 87 current articles share the mechanical publication standard, but do not yet
demonstrate uniform editorial quality. Technical validity is not an independent
fact-check, a writing score, or evidence of Google Discover eligibility in practice.

Follow-up on 16 October: the four P1 articles below have subsequently been revised
and verified locally. See [the revision brief and checks](article-priority-revisions-2026-10-16.md).
The inventory and findings in this report describe the original audit snapshot;
they are not silently recalculated after editing. These changes are not published.

No articles, metadata, dates, images, translation relationships, publication
manifest entries, advertising configuration or production state were changed.
This report is a read-only assessment plus a local documentation artifact.

## Baseline and coverage

- Clean local `main`: `940358ece0e0e9b925b5172f0116dfcee38afcb2`.
- `git ls-remote origin refs/heads/main` returned the same commit on 16 October.
  No previous deployment snapshot or ignored publishing helper was used as baseline.
- Inventory: 87 articles — 25 Dutch, 16 French, 21 German and 25 English.
- Every article was included in metadata/body-structure, sources-field, link,
  image-file/dimension, publication inventory and live HTTP verification.
- Archive-level editorial screening covered titles, genre, date/reference-period
  language, source-section presence, link destinations, structure and length.
  Detailed reading was risk-based, including the three national inflation opinion
  articles, both Prinsjesdag pieces, the English debt update, French fuel support,
  newer Dutch explainers, French US comparison, and selected specialist analysis.
- This is NOT a fresh line-by-line fact-check of all claims in all 87 texts.
  There are 230 distinct source URLs in the structured source lists. Only the
  sources necessary to test the specific findings below were newly opened.
- Mobile geometry inspected on eight live pages at 390px; selected screenshots
  assessed for reading flow. Desktop inspected at 1280px on the dense Dutch
  budget article and the new English inflation/debt article. This is not visual
  certification of every table, chart, crop or language edition.

## Checks actually executed

| Check | Result |
| --- | --- |
| `npm run audit:articles` | Passed: 87 strict-standard articles, no legacy backlog |
| `npm run validate:publication` | Passed: 87 recorded URLs preserved; translations valid |
| `npm run verify:publication -- --base-url https://www.eudebtmap.com` | Passed: 87 article pages, 51 distinct hero images, 3 canonical checks, sitemap, translation alternates, Article schema, permanent redirects and genuine 404 behavior |
| `node --test scripts/article-quality-core.test.js scripts/article-publication.test.js` | 15 passed, 0 failed |
| Remote baseline comparison | Local HEAD equals current remote main |
| Live mobile sample | No document-wide horizontal overflow in eight inspected pages; some tables require substantial horizontal scrolling |
| Browser error log | No captured errors at the end of the sampled flow |

No build, preflight, commit, push, deployment or Search Console action was needed
or performed for this research-only request. A build is not a substitute for
editorial review; a future content release must run the full release workflow.

## What the current automated audit does and does not establish

The audit verifies required fields, parseable dates, source URL/date formatting,
image existence and actual dimensions, metadata completeness and ad-marker count.
It does not open source URLs, test whether a claim follows from a source, judge
idiomatic language or counterarguments, find an expired announcement, or ensure
that structured `sources` actually render as public links. It does not enforce
the substance of the section 5a prose edit.

All 87 carry `discover-2026-v1`; that is an internal mechanical gate, not a
certificate that each article scores eight out of ten on every editorial dimension.

## P1 — confirmed updates to do first

### 1. Two Dutch Prinsjesdag articles still describe the pre-publication situation

- [Budget process](https://www.eudebtmap.com/nl/articles/prinsjesdag-2026-begroting-2027-gevolgen)
- [Leaked documents](https://www.eudebtmap.com/nl/articles/prinsjesdagstukken-2026-gelekt-begroting-2027)

Both were last reviewed on 2 September. They still describe the 15 September
publication as forthcoming. The leak article explicitly promises a comparison
with the official budget on that date; the text still does not deliver it.
Its careful distinction between annual, structural and cumulative amounts is a
strength, but does not repair the stale framing.

The [official Miljoenennota 2027](https://www.rijksfinancien.nl/miljoenennota/2027),
opened on 16 October, now gives a 2027 debt projection of 46.9% of GDP rather than
the old 48.0% spring baseline, and a projected deficit of EUR 36.7bn. The deficit
ratio remains 2.9%; an unchanged percentage does not mean every old amount remains
current.

Action: update the analysis against official tables, preserve original publication
dates and URLs, explain what changed from the leaked or spring figures, and add
a real update/review date only after that work. Do not silently erase the original
reporting context.

### 2. French fuel-support article has been overtaken by a concrete policy extension

[French fuel-support analysis](https://www.eudebtmap.com/fr/articles/prix-carburant-france-plus-les-moyens-de-tout-compenser)
still describes the 19 August situation: roughly three million intended
beneficiaries, an old application deadline and EUR 100 equivalent to 20 cents per
litre over six months.

The [Economy Ministry page](https://www.economie.gouv.fr/actualites/carburant-laide-pour-les-travailleurs-grands-rouleurs),
updated and opened on 16 October, describes an October–December extension,
5.5 million people, revised eligibility and a new application opening on
27 October. It presents EUR 100 over three months as approximately 40 cents per
litre. The public article's policy explanation remains useful, but its practical
conditions need a current-status box and a substantive update.

Do not infer personal eligibility from this report or treat the old article as
application guidance. Confirm the linked decree and official conditions during
revision.

### 3. One English article has neither visible primary-source links nor current framing

[EU debt update](https://www.eudebtmap.com/articles/eu-debt-update-ratio-fell-but-total-still-rose)
describes Q4 2025 as the latest/today's release although its source list already
includes the later Q1 2026 release. The Q1 release is available on
[Eurostat's official publication page](https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-21072026-ap).
Keeping a historical Q4 analysis is valid; presenting it as today's update is not.

The JSON contains two sources, but the live article has no Eurostat links or
visible sources section. The shared English template does not automatically
render the `sources` array. The automated audit still passes it.

Action: make the period explicit, either substantively update or clearly retain
historical analysis, and provide visible source links. Also replace unspecific
present-tense claims about the fastest live estimate with a dated, explained
model reference if retained.

## P2 — important editorial consistency work

### Inflation: release status and the limits of the opinion thesis

Seven pieces form the first review batch: NL/DE/FR opinion pieces, NL/DE/FR
September energy explainers, and the English euro-area energy explainer.

[September CBS results](https://www.cbs.nl/nl-nl/nieuws/2026/42/inflatie-stijgt-naar-3-4-procent-in-september)
and [September Destatis results](https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/10/PD26_364_611.html)
were published on 13 October. These confirm the cited national headline rates,
but the articles still describe the results as provisional. A historical flash
estimate can remain historical; a current explainer should state that final
results are now available. Do not substitute national CPI for HICP.

The French opinion article still says final results will be published on
15 October. Check the actual Insee release before changing it. The complete
Eurostat September page could not be retrieved during this review: do not assert
that the full harmonised snapshot has been updated or invent its final values.
No official snapshots were refreshed.

The Dutch opinion's claims about permanent attention, media incentives and what
almost everyone feels go beyond what its inflation chart proves.
[ECB's explanation of perceived inflation](https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/what_is_inflation.en.html)
supports mechanisms such as frequent purchases and personal baskets, not a new
Dutch survey establishing a pandemic-caused psychological change. The German
and French pieces contain more country-specific survey attribution, which is
stronger, but expectations, perceived inflation and attention are different
concepts. Their causal language still needs care.

Action: retain the useful rate-versus-price-level argument, qualify collective
psychology as interpretation or substantiate it, and fairly address renewed
energy pressure. A clear opinion label does not waive evidence requirements.

### Localized conversion routes are not equally developed

The revised Dutch per-capita article links directly to
`/nl/debt-per-capita` with useful period caveats. The EN/DE/FR equivalents do not
link to their localized per-capita explorer in the prose. They send readers to
country or debt-to-GDP pages instead. They therefore do not perform the same
reader-routing job, despite equivalent core data.

The English edition also links to a Dutch ownership article. That may be a useful
cross-language reference, but needs a language cue or an appropriate English
destination. Three France-borrowing editions intentionally point to the French
country route, consistent with the owner's earlier request; those are not
broken links or an automatic reason to change protected URLs.

Action: when those three editions receive a real revision, add the useful
localized destination and verify its reference period and functionality.
Do not merely translate the newer Dutch text without checking its meaning.

### Mobile: distinguish a broken page from a demanding table

There are 86 tables across 49 articles; 59 have no more than four data rows.
These short comparisons are candidates for cards or prose, not proof that a
table is wrong.

In the live mobile sample:

- The dense Dutch leak matrix is 760px wide inside a 348px area; the other table
  is approximately 772px. Both have labeled, keyboard-focusable scroll wrappers.
  They are technically contained but remain hard to read across several columns.
- The Dutch debt-ownership article has three 680px tables inside 348px areas.
  Their wrappers scroll but lack `tabindex` and an accessible scroll label.
  These are concrete accessibility/presentation gaps.
- The Dutch 27-country per-capita table fits within 348px and is legible in the
  screenshot. Its wrapper lacks a scroll label/focus attribute, but it does not
  need horizontal scrolling at that tested width. Do not label it broken merely
  because a generic wrapper rule is absent.
- The French debt-cost tables have 680px widths, labels and focusable wrappers.
  They are contained but could still benefit from a simpler reading layout.
- No document-wide overflow was observed on the eight pages inspected. This is
  not a claim that every table in all 87 pages was visually tested.

## P3 — archive-wide improvements, not wholesale rewriting

### Image credit is stored more consistently than it is displayed

All 87 hero files pass size/metadata checks; 51 distinct files are used. No hero
path is reused for two different articles within the same locale. Reuse across
equivalent language editions is appropriate and is not duplicate editorial work.

Only the French article template renders `article.imageCredit` below the hero.
The NL/DE/EN templates do not. A static body/source-note scan found 54 articles
without a matching illustration disclosure in public body text. This is a
candidate set for a shared template improvement, not a judgment that all 54
images are deceptive. Caption truthfulness and actual image content still need
review. Image existence alone does not establish licensing or visual suitability.

### Length, rhythm and structure

Body text before recognized source sections ranges from about 689 to 2,006 words;
21 articles exceed 1,600 words. Longer articles may be justified. The concern is
repeated explanations, repeated FAQ answers and generic conclusion sections,
rather than a word-count quota.

The older inflation opinion pieces repeatedly explain rate versus price level in
the opening, key numbers, body, FAQ and conclusion. The French opinion is about
1,849 words. Its local surveys add value, but several restatements can be merged
without losing evidence. The newer Dutch budget explainer (about 942 words) and
inflation/debt explainer (about 737 words) show a clearer one-question argument,
explicit assumptions and endings that move the reader forward.

Do not remove essential qualifications merely to shorten a piece. Do not use an
AI detector, punctuation count or the presence of a dash as a quality measure.

### Author and review claims need actual evidence

Twenty-three articles mention Simeon in author/reviewer fields or body text.
Some say the named person checked the thesis, sources and calculations. This
audit cannot establish whether those checks happened. Publication authorization
alone is not proof of a human reading or fact-check.

Newer pieces explicitly describe AI drafting/research and outstanding independent
human review. That is a more auditable process description. Keep real human
attribution when warranted; verify its factual basis rather than removing or
inventing it. This audit itself has no independent human/native-language review.

## Suggested work order

1. Revise the two Prinsjesdag pages, the French fuel-support article and the
   English debt update. Keep their URLs, retain historical context and verify
   consequential changes against primary sources.
2. Review the seven inflation pieces as one evidence/terminology batch; do not
   describe a release as pending after it is available.
3. Improve shared image-credit rendering and the three debt-ownership table
   wrappers, with localized browser regression checks.
4. Bring EN/DE/FR per-capita routing up to the useful Dutch approach.
5. Edit older, long pieces in small topic batches, prioritizing real Search
   Console performance and reader needs. No Search Console data was accessed in
   this review, so no claim about which URL currently earns most traffic is made.

Do not retire, merge or redirect pages solely because they are old or overlap in
topic. Such decisions require intent and performance evidence, preservation of
published inventory, and separate authorization.

## Complete screening register

Every row passed the technical audit and live publication verifier. Priorities
below are review queues, NOT overall quality grades or a failure count.

- **P1:** confirmed stale/current framing or public source-disclosure problem.
- **P2:** targeted evidence, destination or accessibility review.
- **P3:** presentation/prose candidates only.
- **Screened:** no additional flag in this screening; not an independent factual
  or native-language sign-off.
- **U:** urgent update/framing; **S:** missing visible source section;
  **F:** inflation release-status/argument review; **D:** localized destination;
  **A:** known scrolling-wrapper accessibility gap; **I:** illustration-credit
  display candidate; **L:** over 1,600 words, review need for length;
  **T:** table present, inspect when editing (not an assertion it is broken).

Counts: 4 P1, 11 P2, 61 P3, 11 without an additional screening flag.
Word counts exclude recognized sources sections and are approximate; punctuation
and multilingual tokenization affect them.

| Locale | Article | Words | Last recorded review | Priority | Flags |
| --- | --- | ---: | --- | --- | --- |
| DE | [Wenn Staatsschulden Banken treffen: Was die Bundesbank-Analyse für Deutschland zeigt](https://www.eudebtmap.com/de/articles/bundesbank-staatsanleihen-banken-risiko-2026) | 1389 | 2026-09-21 | P3 | T |
| DE | [Deutschlands Haushalte 98,8 Milliarden Euro im Minus: Warum zugleich 71,3 Milliarden gemeldet werden](https://www.eudebtmap.com/de/articles/deutschland-finanzierungsdefizit-98-8-milliarden-2026) | 1488 | 2026-10-03 | P3 | I, T |
| DE | [Deutschlands Staatsdefizit steigt auf 71,3 Milliarden Euro](https://www.eudebtmap.com/de/articles/deutschland-staatsdefizit-71-milliarden-2026) | 1543 | 2026-08-31 | P3 | I, T |
| DE | [Deutschlands Zinsausgaben steigen bis 2030 auf 80,7 Milliarden Euro](https://www.eudebtmap.com/de/articles/deutschland-zinsausgaben-80-milliarden-2030) | 1581 | 2026-08-26 | P3 | I |
| DE | [Frankreich muss rekordhohe 340 Milliarden Euro aufnehmen: Schuldenlast steigt auf 72,9 Milliarden](https://www.eudebtmap.com/de/articles/frankreich-rekord-kreditaufnahme-340-milliarden-zinslast-2027) | 1652 | 2026-10-02 | P3 | I, L, T |
| DE | [Frankreich erwartet 121,7% Staatsschulden: Warum 60% keine harte EU-Grenze sind](https://www.eudebtmap.com/de/articles/frankreich-rekordschulden-121-7-prozent-2027) | 1373 | 2026-09-19 | P3 | I, T |
| DE | [Deutschlands Inflation steigt auf 3,3% – Energie ist das Warnsignal](https://www.eudebtmap.com/de/articles/inflation-deutschland-33-prozent-energie-warnsignal-2026) | 703 | 2026-10-07 | P2 | F, I |
| DE | [Meinung: Die Inflationskrise ist vorbei – die Angst vor ihr nicht](https://www.eudebtmap.com/de/articles/inflation-deutschland-fast-normal-angst-bleibt) | 1419 | 2026-10-04 | P2 | F, I |
| DE | [Italiens Schuldenrätsel 2026: Warum 3,16 Billionen Euro trotz Primärüberschuss weiter steigen](https://www.eudebtmap.com/de/articles/italien-staatsschuld-primaerueberschuss-2026) | 1596 | 2026-08-24 | P3 | I |
| DE | [Kann Inflation die Staatsschulden abbauen? Warum die Rechnung nicht aufgeht](https://www.eudebtmap.com/de/articles/kann-inflation-staatsschulden-abbauen) | 689 | 2026-10-11 | Screened | — |
| DE | [Niederlande verlagern Gold nach London – Deutschlands Reserven im Vergleich](https://www.eudebtmap.com/de/articles/niederlande-goldreserven-deutschland-vergleich) | 953 | 2026-09-03 | P3 | T |
| DE | [Österreichs Staatsschuld bei 431,4 Milliarden Euro: Warum die Zinslast 2026 steigt](https://www.eudebtmap.com/de/articles/oesterreich-staatsschuld-431-milliarden-zinskosten-2026) | 1469 | 2026-08-24 | P3 | I |
| DE | [31.887 Euro Schulden pro Kopf: Deutschlands Schulden 2026 erklärt](https://www.eudebtmap.com/de/articles/schulden-pro-kopf-deutschland-2026) | 1403 | 2026-08-23 | P3 | I, T |
| DE | [US-Staatsschulden über 40 Billionen Dollar: Was die Zinsen wirklich kosten](https://www.eudebtmap.com/de/articles/us-staatsschulden-40-billionen-zinskosten-2026) | 1400 | 2026-08-23 | P3 | I, T |
| DE | [Deutschlands Staatsverschuldung 2026: 2,90 Billionen Euro – was die Schuldenuhr zeigt](https://www.eudebtmap.com/de/articles/aktuelle-staatsverschuldung-deutschland-live-schuldenuhr) | 1298 | 2026-08-23 | P3 | I, T |
| DE | [Schuldenbremse Deutschland 2026: Was die Reform wirklich verändert](https://www.eudebtmap.com/de/articles/deutsches-schuldenparadox-schuldenbremse-zwickmuehle) | 1428 | 2026-08-14 | P3 | I, T |
| DE | [EU-Schuldenlast 2026: Welche Länder haben die höchsten Schuldenquoten?](https://www.eudebtmap.com/de/articles/eu-debt-burden-2026) | 1177 | 2026-08-20 | P3 | I |
| DE | [EU-Staatsschuld pro Kopf 2026: Belgien, Italien und Frankreich vorn](https://www.eudebtmap.com/de/articles/eu-pro-kopf-verschuldung-2026-analyse) | 1129 | 2026-08-09 | P2 | D, I, T |
| DE | [USA oder Europa: Wer kann mehr Staatsschulden tragen?](https://www.eudebtmap.com/de/articles/eu-vs-us-debt-capacity-2025) | 1534 | 2026-08-20 | P3 | I |
| DE | [Staatsverschuldung im Euroraum 2026: Zahlen, Trends und Risiken](https://www.eudebtmap.com/de/articles/eurozone-hidden-debt-timebomb-extended) | 1261 | 2026-08-12 | P3 | I, T |
| DE | [Wer hält Deutschlands Staatsschulden? Zentralbanken, Banken und internationale Investoren](https://www.eudebtmap.com/de/articles/wer-haelt-deutsche-staatsschulden-2026) | 1429 | 2026-08-20 | P3 | I |
| EN | [Digital Euro in 2026: Pilot, Privacy and the Road to 2029](https://www.eudebtmap.com/articles/digital-euro-2025-explainer) | 1981 | 2026-08-14 | P3 | I, L, T |
| EN | [Debt Interest vs Schools and Healthcare: What EU Budgets Really Show](https://www.eudebtmap.com/articles/eu-interest-vs-education-health-2025) | 1384 | 2026-08-15 | P3 | T |
| EN | [Can the US Really Carry More Debt Than Europe? A 2026 Comparison](https://www.eudebtmap.com/articles/eu-vs-us-debt-capacity-2025) | 1887 | 2026-08-15 | P3 | L, T |
| EN | [Europe's Trillion-Euro Question: When Is National Debt an Investment?](https://www.eudebtmap.com/articles/europes-debt-dilemma-investing-in-tomorrow-or-burdening-the-future) | 1184 | 2026-08-24 | P3 | I |
| EN | [Euro Area Government Debt in 2026: Data, Trends and Risks](https://www.eudebtmap.com/articles/eurozone-hidden-debt-timebomb-extended) | 1366 | 2026-08-12 | P3 | I, T |
| EN | [France’s Public Debt Reaches €3.54 Trillion: What the Latest Figures Mean](https://www.eudebtmap.com/articles/france-debt-2025) | 1420 | 2026-08-24 | P3 | I |
| EN | [France’s Debt Outlook in 2026: The Real Risks Behind 117.6% of GDP](https://www.eudebtmap.com/articles/france-debt-to-gdp-crisis-2025-nyt) | 1427 | 2026-08-24 | P3 | I |
| EN | [Germany’s Debt Brake in 2026: What the Reform Really Changes](https://www.eudebtmap.com/articles/german-debt-paradox-schuldenbremse-straitjacket) | 1601 | 2026-08-14 | P3 | I, L, T |
| EN | [Netherlands National Debt Live Counter: Why It Currently Runs Backwards](https://www.eudebtmap.com/articles/netherlands-national-debt-live-counter-2025) | 919 | 2026-08-24 | P3 | I, T |
| EN | [Is the Netherlands Still Europe’s ‘Frugal’ Leader? The 2026 Debt Outlook](https://www.eudebtmap.com/articles/netherlands-national-debt-live-tracker-eu) | 1044 | 2026-08-24 | P3 | I, T |
| EN | [Europe’s Government Debt Is Getting More Expensive: How Refinancing Changes Budgets](https://www.eudebtmap.com/articles/end-of-free-money-europes-silent-debt-crisis) | 1172 | 2026-08-24 | P3 | I |
| EN | [Sweden's Debt Is Rising—Why the Live Counter Can Still Turn Green](https://www.eudebtmap.com/articles/sweden-national-debt-live-tracker-falling) | 1567 | 2026-08-15 | P3 | I, T |
| EN | [Who Owns EU Government Debt in 2026? The Real Holder Map](https://www.eudebtmap.com/articles/who-owns-eu-debt-2025) | 1651 | 2026-08-15 | P3 | I, L, T |
| EN | [EU Debt Explained: Why Adding It All Up Helps, and Misleads](https://www.eudebtmap.com/articles/eu-debt-explained-why-adding-it-all-up-helps-and-misleads) | 1198 | 2026-08-24 | P3 | I |
| EN | [EU debt update: the ratio fell, but the pile still grew to €15.37tn](https://www.eudebtmap.com/articles/eu-debt-update-ratio-fell-but-total-still-rose) | 806 | 2026-08-24 | P1 | U, S, I |
| EN | [Can inflation make government debt disappear? The bill moves too](https://www.eudebtmap.com/articles/can-inflation-reduce-government-debt) | 756 | 2026-10-11 | Screened | — |
| EN | [Europe’s Defence Bill Is Rising: What It Means for Government Debt](https://www.eudebtmap.com/articles/fiscal-frontline-europe-defense-debt-2026) | 1212 | 2026-08-24 | P3 | I |
| EN | [Strong Euro, Weak Dollar: What Exchange Rates Really Do to European Debt](https://www.eudebtmap.com/articles/dollar-dip-euro-surge-sovereign-debt-impact) | 1086 | 2026-08-24 | P3 | I, T |
| EN | [EU Debt Burden in 2026: Which Countries Are Under the Most Pressure?](https://www.eudebtmap.com/articles/eu-debt-burden-2026) | 1265 | 2026-08-01 | Screened | — |
| EN | [EU Debt per Person in 2026: Belgium, Italy and France Lead](https://www.eudebtmap.com/articles/eu-debt-per-capita-2026-inequality-report) | 1058 | 2026-08-09 | P2 | D, T |
| EN | [Europe’s debt isn’t exploding — but something feels different in 2026](https://www.eudebtmap.com/articles/eu-debt-trend-change-2026) | 1165 | 2026-08-24 | P3 | T |
| EN | [Euro area inflation is rising again — but this is not yet 2022](https://www.eudebtmap.com/articles/euro-area-inflation-38-energy-warning-2026) | 1537 | 2026-10-07 | P2 | F, I |
| EN | [France must borrow a record €340 billion as its debt bill rises to €72.9 billion](https://www.eudebtmap.com/articles/france-record-340-billion-borrowing-interest-bill-2027) | 1692 | 2026-10-02 | P3 | I, L, T |
| EN | [France expects debt to reach 121.7% of GDP: why 60% is not a hard EU ceiling](https://www.eudebtmap.com/articles/france-record-debt-121-7-percent-2027) | 1597 | 2026-09-19 | P3 | T |
| EN | [U.S. National Debt Passes $40 Trillion: What the Interest Bill Actually Costs](https://www.eudebtmap.com/articles/us-national-debt-40-trillion-interest-cost-2026) | 1648 | 2026-08-23 | P3 | L, T |
| FR | [Combien coûte la dette française en 2026 ? Intérêts, taux et refinancement expliqués](https://www.eudebtmap.com/fr/articles/cout-dette-francaise-2026-interets-taux-refinancement) | 1848 | 2026-09-30 | P3 | L, T |
| FR | [La dette américaine dépasse 40 000 milliards de dollars : le vrai coût des intérêts](https://www.eudebtmap.com/fr/articles/dette-americaine-40000-milliards-cout-interets-2026) | 1785 | 2026-08-23 | P3 | L, T |
| FR | [Les États-Unis sont plus endettés : pourquoi cela ne rassure pas la France](https://www.eudebtmap.com/fr/articles/dette-france-etats-unis-euro-dollar-comparaison) | 1166 | 2026-10-11 | Screened | — |
| FR | [La France prévoit une dette à 121,7% du PIB : pourquoi 60% n'est pas un plafond strict](https://www.eudebtmap.com/fr/articles/dette-france-record-121-7-pour-cent-2027) | 1713 | 2026-09-19 | P3 | L, T |
| FR | [La France devra emprunter un record de 340 milliards d’euros : la charge de la dette grimpe à 72,9 milliards](https://www.eudebtmap.com/fr/articles/france-emprunt-record-340-milliards-charge-dette-2027) | 1922 | 2026-10-02 | P3 | L, T |
| FR | [Inflation en France : l’énergie pousse l’IPCH à 3,4 %, sans retour à 2022](https://www.eudebtmap.com/fr/articles/inflation-france-energie-34-pour-cent-septembre-2026) | 1020 | 2026-10-07 | P2 | F |
| FR | [Opinion : l’inflation a reflué en France, pas la peur des prix](https://www.eudebtmap.com/fr/articles/inflation-france-prix-peur-apres-crise) | 1849 | 2026-10-05 | P2 | F, L |
| FR | [L’inflation peut-elle effacer la dette publique ? Le piège pour la France](https://www.eudebtmap.com/fr/articles/inflation-peut-elle-effacer-dette-publique) | 810 | 2026-10-11 | Screened | — |
| FR | [Qui détient la dette française en 2026 ? Étrangers, banques et assureurs](https://www.eudebtmap.com/fr/articles/qui-detient-dette-francaise-2026) | 1997 | 2026-08-26 | P3 | L |
| FR | [Dette publique française : 3 595,5 milliards d’euros et 119 % du PIB, que signifie ce record ?](https://www.eudebtmap.com/fr/articles/dette-publique-france-compteur-live-record) | 1736 | 2026-09-30 | P3 | L, T |
| FR | [Dette publique par habitant en 2026 : Belgique, Italie et France en tête](https://www.eudebtmap.com/fr/articles/dette-publique-ue-par-habitant-2026-analyse) | 1402 | 2026-08-09 | P2 | D, T |
| FR | [Dette de l’UE en 2026 : quels pays ont les ratios les plus élevés ?](https://www.eudebtmap.com/fr/articles/eu-debt-burden-2026) | 1468 | 2026-08-19 | Screened | — |
| FR | [Les États-Unis peuvent-ils supporter plus de dette que l’Europe ?](https://www.eudebtmap.com/fr/articles/eu-vs-us-debt-capacity-2025) | 1929 | 2026-08-19 | P3 | L |
| FR | [Dette publique de la zone euro en 2026 : chiffres, tendances et risques](https://www.eudebtmap.com/fr/articles/eurozone-hidden-debt-timebomb-extended) | 1654 | 2026-08-19 | P3 | L, T |
| FR | [Dette publique française en 2026 : les risques réels derrière les chiffres](https://www.eudebtmap.com/fr/articles/france-dette-pib-crise-2025-nyt) | 1745 | 2026-08-19 | P3 | L |
| FR | [Prix des carburants en France en 2026 : pourquoi l’aide est ciblée](https://www.eudebtmap.com/fr/articles/prix-carburant-france-plus-les-moyens-de-tout-compenser) | 1508 | 2026-08-19 | P1 | U |
| NL | [Staatsschuld Nederland 2026: €517 miljard en waarom de live teller daalt](https://www.eudebtmap.com/nl/articles/actuele-staatsschuld-nederland-live-inzicht) | 1427 | 2026-08-13 | P3 | I, T |
| NL | [Kan de VS werkelijk meer staatsschuld dragen dan Europa?](https://www.eudebtmap.com/nl/articles/eu-vs-us-debt-capacity-2025) | 1282 | 2026-08-24 | P3 | I, T |
| NL | [Meer lenen voor Europa: wanneer is staatsschuld een investering?](https://www.eudebtmap.com/nl/articles/europa-schuldendilemma-investeren-voor-de-toekomst) | 959 | 2026-10-10 | Screened | — |
| NL | [Staatsschuld in de eurozone in 2026: cijfers, trends en risico’s](https://www.eudebtmap.com/nl/articles/eurozone-hidden-debt-timebomb-extended) | 834 | 2026-10-10 | Screened | — |
| NL | [Franse staatsschuld live: wat de teller werkelijk meet](https://www.eudebtmap.com/nl/articles/franse-staatsschuld-live-teller-record) | 1189 | 2026-08-24 | Screened | — |
| NL | [Waarom bezuinigen als de Nederlandse staatsschuld laag is?](https://www.eudebtmap.com/nl/articles/hollandse-paradox-bezuinigen-bij-lage-staatsschuld) | 942 | 2026-10-10 | Screened | — |
| NL | [Europese staatsschuld wordt duurder: zo werkt herfinanciering door in de begroting](https://www.eudebtmap.com/nl/articles/einde-van-gratis-geld-europas-stille-schuldencrisis) | 1096 | 2026-08-24 | P3 | I |
| NL | [Zweedse staatsschuld stijgt — waarom de live teller toch groen kan zijn](https://www.eudebtmap.com/nl/articles/zweedse-staatsschuld-live-teller-dalend) | 1291 | 2026-08-24 | P3 | I, T |
| NL | [Amerikaanse staatsschuld boven $40 biljoen: wat de rente echt kost](https://www.eudebtmap.com/nl/articles/amerikaanse-staatsschuld-40-biljoen-rentekosten-2026) | 1544 | 2026-08-23 | P3 | I, T |
| NL | [Sterke euro, zwakke dollar: wat wisselkoersen echt doen met staatsschuld](https://www.eudebtmap.com/nl/articles/dollar-crash-euro-rally-gevolgen-europese-staatsschuld) | 955 | 2026-08-24 | P3 | I, T |
| NL | [EU-schuldenlast 2026: welke landen hebben de hoogste schuldquote?](https://www.eudebtmap.com/nl/articles/eu-debt-burden-2026) | 1254 | 2026-08-01 | P3 | I |
| NL | [De Europese staatsschuld explodeert niet — maar er verandert iets in 2026](https://www.eudebtmap.com/nl/articles/eu-schuld-trend-verandering-2026) | 1112 | 2026-08-24 | P3 | I, T |
| NL | [EU-staatsschuld per inwoner in 2026: België, Italië en Frankrijk bovenaan](https://www.eudebtmap.com/nl/articles/eu-staatsschuld-per-inwoner-2026-analyse) | 1399 | 2026-10-11 | P3 | I, T |
| NL | [Frankrijk moet recordbedrag van €340 miljard lenen: renterekening stijgt naar €72,9 miljard](https://www.eudebtmap.com/nl/articles/frankrijk-340-miljard-lenen-rentelast-2027) | 1726 | 2026-10-02 | P3 | I, L, T |
| NL | [Frankrijk verwacht 121,7% staatsschuld: waarom 60% geen harde EU-grens is](https://www.eudebtmap.com/nl/articles/frankrijk-recordschuld-121-7-procent-2027) | 1701 | 2026-09-19 | P3 | I, L, T |
| NL | [Wat als Frankrijk in een schuldencrisis belandt? Dit merkt Nederland](https://www.eudebtmap.com/nl/articles/frankrijk-schuldencrisis-gevolgen-nederland) | 1275 | 2026-10-11 | P3 | I |
| NL | [Opinie: de inflatie is bijna normaal, maar onze angst is dat nog niet](https://www.eudebtmap.com/nl/articles/inflatie-nederland-10-jaar-prijzen-sinds-corona) | 1562 | 2026-10-04 | P2 | F, I |
| NL | [Kan inflatie de staatsschuld laten verdwijnen? De rekening schuift mee](https://www.eudebtmap.com/nl/articles/kan-inflatie-staatsschuld-laten-verdwijnen) | 737 | 2026-10-11 | Screened | — |
| NL | [€17 miljard extra rente voor Nederland: wat de nieuwe berekening betekent](https://www.eudebtmap.com/nl/articles/nederland-17-miljard-extra-rente-staatsschuld) | 1522 | 2026-08-31 | P3 | I, T |
| NL | [Nederlandse inflatie stijgt weer: 3,4% in de winkelmand, 3,0% volgens Europa](https://www.eudebtmap.com/nl/articles/nederlandse-inflatie-energie-waarschuwing-september-2026) | 1016 | 2026-10-07 | P2 | F, I |
| NL | [Prinsjesdag 2026: hoe de begroting voor 2027 tot stand komt](https://www.eudebtmap.com/nl/articles/prinsjesdag-2026-begroting-2027-gevolgen) | 1362 | 2026-09-02 | P1 | U, I, T |
| NL | [Prinsjesdagstukken 2026 gelekt: minder bezuinigen, dekking nog onvolledig](https://www.eudebtmap.com/nl/articles/prinsjesdagstukken-2026-gelekt-begroting-2027) | 2006 | 2026-09-02 | P1 | U, I, L, T |
| NL | [Nederland betaalt richting €12 miljard rente: waarom de staatsschuld duurder wordt](https://www.eudebtmap.com/nl/articles/rentelasten-staatsschuld-nederland-2027) | 1698 | 2026-08-21 | P3 | I, L, T |
| NL | [Staatsschuld Griekenland 2026: wordt Frankrijk het nieuwe Griekenland?](https://www.eudebtmap.com/nl/articles/staatsschuld-griekenland-2026-frankrijk-vergelijking) | 1517 | 2026-09-27 | P3 | T |
| NL | [Wie bezit de Nederlandse staatsschuld? Buitenland, DNB, banken en pensioenfondsen](https://www.eudebtmap.com/nl/articles/wie-bezit-nederlandse-staatsschuld-2026) | 1434 | 2026-08-12 | P2 | A, I, T |
