# Article publication recovery, 15 October 2026

## Evidence and cause

Search Console listed 69 excluded URLs across six categories. Direct HTTP
checks found that the 14 intentional redirects and two historical redirect
errors all resolve to working pages. The 49 URLs in the crawled/discovered
categories also resolve successfully, including three now-retired article URLs
that permanently redirect. One response is a social image rather than an HTML
page. These categories do not justify changing article URLs or rewriting prose.

The reported French inflation article is genuinely missing. The same applies
to five other inflation articles published on GitHub between 4 and 7 October.
All six remain in GitHub main at `bc5b97858cb2c0eb0c37c270e317396a9770ab60`,
but were absent from the live sitemap and returned HTTP 404 on 15 October.

Vercel production `dpl_o9bAXjnnu69HCP88HrhkqXcYaact` was created on 11 October.
Its metadata references source deployment `dpl_EVCE1FtRvwnRhboH7UAm7CXvpHwr`.
The source records `source: cli`, `gitDirty: 1` and base commit
`eac170e7e4b407a602d44f34432e5d44f0ac2328`, an ancestor that predates the six
publications. A newer local article revision was uploaded from this older
checkout, losing the later GitHub additions.

## Recovery

The recovery worktree starts from current GitHub main, then incorporates the
existing local edits and six additional October 11 articles. All 87 articles
are retained. The six restored files and their assets remain byte-identical to
GitHub. Their publication/review dates, wording, URLs and source claims are not
editorially updated by this technical recovery. The translation registry keeps
both the restored groups and the October 11 additions.

Existing mobile navigation and fiscal ranking fixes from main are retained
when integrating the newer local work. No advertising, consent, analytics,
security policy, official data or deployment settings are changed.

## Canonical anomaly

Search Console's stored August crawls for `/fr/articles`, `/nl/articles` and
`/de/country/lt` reported no user canonical and selected the same unrelated
external gambling domain. The historical cause is unconfirmed. The current
HTTP responses contain one correct self-referencing canonical. Google's live
inspection of `/fr/articles` on 15 October at 17:28 CEST succeeded, permitted
indexing and reported the correct user canonical. A live test cannot establish
which canonical Google will select after indexing.

Search Console's Security Issues and Manual Actions reports both stated that
no issues were detected. These checks do not establish that no historical
incident occurred. Do not change a currently correct canonical merely to clear
an old report, and do not open the unrelated external URL during investigation.

## Release checks

- `npm run validate:publication` is offline and runs before every build. The
  publication manifest records public URLs independently of the article files
  and translation registry. Missing or malformed articles, duplicate URLs,
  broken translations and unrecorded new articles fail validation.
- Add each new public article URL to the manifest. When retiring an article,
  retain its old manifest entry and configure one permanent redirect to a real
  replacement article. Do not regenerate the manifest from whichever checkout
  happens to be on disk.
- `npm run preflight:publication` checks a clean release tree, includes the
  current remote main commit, and compares the proposed release against both
  GitHub articles and the production sitemap. It reads remote state but never
  fetches into Git, commits, deploys or changes aliases. Run it immediately
  before a release after the intended changes have been committed.
- Run `npm run verify:publication -- --base-url http://localhost:3022` against
  the production build, then against the exact deployed preview and production
  URLs when deployment is authorized. It checks all article responses,
  canonicals, indexability, Article schema, translation alternates, sitemap
  membership, permanent redirects and genuine 404 behavior.
- Prefer an authorized GitHub main release. If CLI deployment is explicitly
  required, deploy the same clean, checked commit. Never deploy from an older
  dirty checkout or reuse a preview without verifying its contents.

These are repository safeguards, not an enforcement change to Vercel. An
older checkout without the checks, or a CLI command that bypasses the release
procedure, can still be deployed. No production settings were changed.

## Search Console follow-up after publication

Verify the six restored URLs on production first. Then inspect the restored
French URL, request indexing where appropriate and validate its 404 issue.
Recheck the two old redirect errors and three canonical cases using live
inspection before requesting indexing or validation. Do not validate normal
intentional redirects as if their source URLs should become indexed. Google's
indexing timing and eventual canonical selection cannot be guaranteed.

No indexing requests or issue validations were submitted during diagnosis.

## Local verification, 16 October 2026

- Full Node test suite: 209 passed, zero failures.
- ESLint: zero errors; 15 existing warnings remain outside this recovery.
- Production build: succeeded, 333 static pages generated; article audit passed
  for all 87 articles. Official data snapshots were validated, not refreshed.
- HTTP verification against the production build at `http://localhost:3022`:
  all 87 article pages, 51 distinct editorial images, three canonical rechecks,
  translation alternates, Article schema, sitemap membership, permanent
  redirects and unknown-article HTTP 404 behavior passed.
- The restored French energy article renders with its original hero image.
  Browser console inspection reported no warnings or errors before release.
- Project-wide publication instructions in `AGENTS.md` apply to all article
  chats, explicitly including `telegraaf.`. The old ignored publishing scripts
  are not an approved release path. The primary project checkout must be brought
  forward to the tested release so future work actually has the new checks.

The user authorized committing, pushing to main and publishing this recovery
on 16 October. Production and Search Console results must be checked separately;
local success is not evidence that a public deployment has completed.

References:

- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://support.google.com/webmasters/answer/9012289
