# Editorial standard operational review — 21 October 2026

## Decision and scope

The owner requested stronger writing rules before commissioning the next news
report and authorized publishing the rule update. Starting checkout and current
remote main both resolve to `00c6cac945bc696d9b72492f4a57928d808c8159`.

The existing standard already covers sourcing, economic distinctions, separate
drafting and verification, language adaptation, honest AI disclosure and mobile
presentation. Retain those protections. This review sharpens the editing task
and its evidence rather than replacing the standard with a rigid template.
No set of rules can be established as universally best, guarantee readership or
substitute for actual independent reader/native-language feedback.

## Evidence reviewed and its limits

Reviewed the existing editorial standard, publication workflow, craft research,
newsroom AI research and mechanical quality checker. The earlier conversational
review inspected these three recent article bodies; this rule update does not
rewrite them or independently reverify all their factual claims:

- Dutch France unrest opinion: `frankrijk-rellen-rente-vertrouwen-begroting`.
- Dutch cash-buffer explanation: `nederland-begrotingstekort-staatsschuld-gelijk-kasbuffer`.
- French deficit/debt analysis: `deficit-baisse-dette-augmente-budget-france`.

The concrete editorial concern is application, not absent rules: repeated
contrast-driven openings, generic precision/importance transitions, and phrasing
such as “the strongest counterargument” can expose the commission's scaffolding.
These are contextual editing judgments, not banned words or measured causes of
traffic loss. No controlled audience experiment or independent reader test was
conducted for this rule update.

Primary pages reopened on 21 October:

- [AP, newsroom AI standards, 23 July 2026](https://www.ap.org/the-definitive-source/announcements/ap-updates-newsroom-standards-for-artificial-intelligence/):
  approved assistance still requires AP journalist review and accountability.
  Its policy does not prove how a particular published story was produced, nor
  does it establish that complete AI drafting is standard newspaper practice.
- [Mediahuis annual report for 2024, AI and NewsSearch](https://annual-report.mediahuis.com/2024/2024/naar-een-centraal-technologieplatform):
  describes archive research, summaries, headline suggestions and experimental
  tools. This historical self-report is not evidence that Telegraaf opinion
  columns are predominantly AI-written or that a planned rollout was completed.
- [Kate Moran, NN/G, How People Read Online, 5 April 2020](https://www.nngroup.com/articles/how-people-read-online/):
  summarizes eye-tracking studies over 13 years with more than 500 participants.
  Supports attending to scanning, meaningful headings and early information.
  It is not a test of these financial articles, AI versus human authorship,
  an ideal word count, or the proposed six editorial readiness decisions.

Google's helpful-content page was inspected in the preceding conversation; a
fresh retrieval during this implementation failed. No new Google policy claim
is inferred from that failure. Prior research notes keep their original review
dates and source limitations; this is not a claim that every older reference
has been rechecked. Adopted rules are our editorial application, not a proven
performance formula or an imitation of one named writer.

## Implemented decisions

1. Distinguish news, analysis/explainer and opinion by their reader promise and
   opening. Do not force counterarguments, fictional calculations, FAQs or
   concluding recaps into every news report. `news-analysis` retains an analysis
   obligation; changing labels cannot substitute for an appropriate review.
2. Preserve truthful dated news as archive material, while maintaining pages
   that promise a current position. A new statistical development may deserve a
   new report. Explain revisions and compare like periods/source vintages.
3. Check openings, headings and endings against recent related work. Keep useful
   definitions but challenge repeated rhetorical hooks and editorial scaffolding.
   Explain essential limitations near the claim without needless repetition.
4. Record concrete prose edits and genre-appropriate readiness decisions in the
   existing dossier, rather than adding a second template or inventing changes.
   Separate mechanical success from fact-checking, writing quality and actual
   human review. Retain explicit stop conditions for unsupported material claims.
5. Suppress only the generic below-600-word warning for exact `articleType: news`.
   Other genres retain a non-blocking depth-review prompt with explicit no-padding
   wording. Keep source, required body, image and advertising checks intact.
6. Record transferable craft observations when reference research is requested.
   Do not infer authorship from style or call examples best-read without audience
   evidence. Independent human/native-language review cannot be simulated into
   existence by another AI pass.

## Publication boundary

This release concerns internal editorial documentation and its mechanical audit,
not a new article, a public editorial-policy page, a rewritten archive or a data
refresh. Article files, dates, public URLs, translation relationships, images,
official snapshots and production configuration remain unchanged. The update
does not claim that existing articles have passed the new editorial sign-off.
The owner authorized committing, pushing and publishing this rules update;
release results are reported only after the required checks actually complete.

## Local checks before the release commit

- Focused quality-check tests: 9 passed, including the exact-news length exception,
  retained non-news prompts and unchanged source/body/image/advertising guards.
- Full Node suite: 218 passed, zero failures or skips.
- Article audit: all 95 articles passed the mechanical checks; no editorial
  reassessment of those published articles is implied.
- ESLint: zero errors, 30 pre-existing warnings outside the changed logic.
- All seven local documentation links in the changed documents resolve.
- Diff and whitespace review passed; no article, snapshot, URL, image, translation
  registry, dependency or production configuration was modified.

The production build, clean-commit publication preflight and full local,
exact-preview and public-origin inventory verification remain release gates.
Their completion must be checked rather than inferred from the results above.
