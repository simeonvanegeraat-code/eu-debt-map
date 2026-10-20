# Article release, 20 October 2026

The user authorized publishing all completed article work, then researching a new opinion piece. Released commit: `0dbb1fcac3e71ba6b33e3aa91db5c6cd3845a561` (article commit `55ec27d` plus a documentation whitespace correction). Current remote main was checked before work and before promotion. The release started from `8b3f1ce5d7943ae6c0f5db2a323ce1710808d333`; no remote additions were discarded.

## Released scope

Four new country/language analyses, four distinct illustrations, and the four previously completed priority revisions (two Dutch budget pieces, the French fuel-support piece, and the English historical debt comparison). All 87 pre-existing article URLs were preserved; four URLs were appended to the publication manifest. No official snapshot, translation relationship, advertising setting, production configuration or Search Console state changed.

The new articles explain already published observations. They do not anticipate the Eurostat release scheduled for 21 October. The earlier suggestion to wait until tomorrow was superseded by the user's explicit request to publish today. Human/native-language final review has not been claimed or supplied by deployment authorization.

## Checks actually completed

- Strict article audit: 91 articles passed.
- Full Node tests: 214 passed. The first sandboxed run hit Windows temporary-file rename permission errors; the complete unsandboxed rerun passed without changing tests or snapshots.
- ESLint: zero errors, 30 existing warnings. Production build of the clean release commit: passed, 333 static pages; existing Edge Runtime warnings remain.
- Publication preflight passed immediately before each Git push: current main included; 87 GitHub articles and 87 live articles preserved.
- Exact local production build at `http://127.0.0.1:3038`: all 91 article pages, 55 images, three canonical rechecks, sitemap, translations, Article schema, redirects and real 404 behavior passed.
- GitHub CI's lint/test/build check passed on the release commit.
- Exact preview `https://eu-debt-9sodarwrs-simeonvanegeraat-codes-projects.vercel.app`: full verifier passed. The first unauthenticated attempt encountered the expected deployment-protection redirect. The existing CLI session was refreshed and an already-existing project authorization was used in process memory for the successful check. No new access key was created or protection weakened. The preview-only response-header noindex exception was not used for production.
- GitHub main was fast-forwarded and pushed, triggering Production deployment `7195337370`, status success, for the same release commit. Deployment URL: `https://eu-debt-1lang6145-simeonvanegeraat-codes-projects.vercel.app`.
- Public origin `https://www.eudebtmap.com`: all 91 article pages, 55 images and three canonical rechecks passed the strict verifier, including sitemap, translations, schema, redirects and real 404 behavior.
- Additional public checks confirmed the updated title, image path and review date for all eight changed articles. A transient network failure on the first supplementary attempt was resolved on retry; it did not require a release change.
- Desktop and mobile browser checks confirmed the new titles and no horizontal overflow. Images were visually inspected locally before release and requested successfully on the public origin; initial public screenshots sometimes preceded image completion. Mobile viewport overrides were reset.

No raw CLI upload, copied production snapshot, ignored deployment cache, prebuilt upload or Search Console submission was used. GitHub retained the preview branch for traceability. New opinion research is separate local documentation, not a second publication.
