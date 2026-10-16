# EU Debt Map Agent Instructions

## Project purpose and priorities

EU Debt Map is a multilingual Next.js 14 website that explains and visualizes EU government debt using locally stored official data.

Factual accuracy, trustworthy sourcing, and data integrity are non-negotiable. Once those requirements are satisfied, optimize in this order:

1. User experience and visual quality.
2. SEO and discoverability.
3. Maintainability.
4. Performance.
5. Delivery speed.

## Working style and autonomy

- Own an explicitly requested task end to end: inspect, implement, verify, and report the result.
- Make reasonable, reversible decisions within scope. Pause only for a material product or editorial choice, a risky or irreversible action, or a meaningful expansion of scope.
- Small adjacent improvements are allowed when they directly support the task, have low risk, and prevent future problems. Report unrelated opportunities instead of implementing them.
- Preserve all pre-existing user changes and avoid broad cleanup that is not required for the task.
- Keep changes focused and consistent with existing patterns.

## Language

- Communicate with the user and write completion reports in Dutch.
- Use English for code, identifiers, filenames, new technical comments, and technical repository documentation.
- Do not translate existing Dutch comments only for consistency. Improve them when the surrounding code is already being changed or when they are unclear.
- Write public website content in the language of its locale: English at the root, and Dutch, German, or French under `/nl`, `/de`, and `/fr`.
- Do not automatically translate published content without checking meaning, terminology, links, and metadata in the target language.

## Git and external actions

- A `codex/...` branch may be created autonomously for a new feature, risky change, or work spanning multiple areas.
- Small targeted fixes, content updates, and documentation changes may stay on the current branch.
- Create commits, push branches, open pull requests, or deploy only when the user explicitly asks.
- Never change remote services, production configuration, or public state merely because it would be a convenient next step.

## Mandatory article publication safety

- These rules apply to every chat in this project, including `telegraaf.`. Read `docs/article-publication-recovery-2026-10-15.md` and `docs/article-discover-workflow.md` before creating or publishing articles.
- Never publish from an old or dirty checkout, an ignored deployment cache, a copied production snapshot, or a previous deployment used as a source. Such a release previously removed six already-published articles. Start with current remote `main` and deliberately integrate existing local work without discarding it.
- At the start of every article task, compare this checkout with current remote `main`; a previous chat's local state or remembered deployment is not a release baseline. Do not use cached publishing scripts. If the recovery documentation or publication commands are absent, stop publication and locate the current release branch rather than bypassing the safeguards.
- Keep `content/article-publication-manifest.json` append-only: add each new article URL, and never regenerate it from a partial checkout. Removing a published article requires an explicitly approved direct permanent redirect to an existing relevant replacement, while keeping the old manifest entry.
- Before release, run the article audit, tests and production build. From the exact clean, user-authorized release commit, run `npm run preflight:publication` immediately before deploying. It must include current remote `main` and preserve both remote and live article inventories. Any failure blocks publication; do not bypass it with a raw CLI upload or cached/prebuilt release.
- Run `npm run verify:publication -- --base-url <origin>` against the local production build and the exact preview; after an authorized release, run it again against `https://www.eudebtmap.com`. This checks all articles, localized canonicals, translation targets, Article schema, sitemap, redirects and real 404 behavior. Check the new article image and desktop/mobile rendering too.
- Do not claim a release is complete after checking only the new articles. Verify existing article preservation as well. Do not change URLs, dates, canonicals or prose merely to clear a historical Search Console exclusion; distinguish current technical failures from Google's indexing choices.
- These checks do not authorize commits, pushes, deployments or Search Console submissions. Obtain the user's explicit authorization for those external actions.

## Project structure and conventions

- This is a JavaScript-only Next.js App Router project. Do not introduce TypeScript unless the user explicitly requests a migration.
- English is the default locale at the root. Dutch, German, and French use locale-prefixed routes.
- Localized articles live under `content/articles/{lang}`. Translation relationships live in `content/article-translations.json`.
- Prefer shared components and helpers over duplicating behavior across locale routes.
- Official Eurostat data is stored locally so normal builds do not depend on a live API response.
- Never manually edit `lib/eurostat*.gen.js`. Use the existing update and validation scripts.
- Do not run `npm run update:data` as routine verification: it contacts Eurostat and changes tracked snapshots. Run it only when the task includes a data refresh.

## Protected behavior

Change the following only when they are explicitly in scope, and preserve existing behavior unless the requested outcome requires otherwise:

- Public URLs, permanent redirects, canonical URLs, and hreflang relationships.
- SEO metadata, structured data, RSS feeds, robots directives, and sitemaps.
- Consent Mode, cookie controls, advertising, analytics, and Content Security Policy settings.
- Eurostat methodology, units, reference periods, validation rules, and generated snapshots.
- Environment variables, secrets, Vercel settings, and deployment configuration.

When a protected area must change, explain the risk and add or update regression coverage where practical.

## Sources and editorial integrity

- Check current sources for claims that may have changed. Prefer Eurostat, EU institutions, national governments, central banks, and other primary authoritative sources.
- Record the source URL and access or review date when the content format supports them.
- Clearly distinguish official facts, estimates, modelled counters, forecasts, and original calculations.
- State uncertainty explicitly. Never invent, interpolate, or silently substitute a missing fact unless the page clearly labels an existing documented model that permits it.
- Change `dateModified` and `dateReviewed` only after a substantive update or genuine review.
- Follow `docs/article-discover-workflow.md` for article work and `docs/article-image-style.md` for editorial images.
- Preserve source attribution, meaningful alt text, localized internal links, and the large-image requirements enforced by the article audit.
- In article prose, prefer useful internal links. Put external source links in a clearly labeled sources section at the end, keeping source names and necessary attribution in the prose. Use an inline external link only when direct access is essential to the reader's understanding or action, and record the reason. Apply this preference to new articles and substantive revisions in every locale; do not mass-edit older articles without a separate request.

## Dependencies

- Prefer existing packages and platform capabilities. Do not add a dependency when a small, maintainable local solution is sufficient.
- Ask before adding any production dependency.
- A development dependency may be added when it is clearly required by the task and is a standard, low-risk choice; explain the reason and resulting maintenance impact.
- Discuss major or potentially breaking dependency upgrades before applying them.
- Keep `package-lock.json` synchronized with any approved dependency change.

## Verification and definition of done

Use the smallest verification set that provides credible evidence, then expand it in proportion to risk.

- Documentation-only change: inspect the diff and run a whitespace/error check; no full build is required.
- Non-trivial code change: run `npm run lint`, `npm test`, and `npm run build`.
- Article or content change: run `npm run audit:articles` and the relevant tests; for substantive or publication-ready changes, also run the production build.
- Data refresh: run the intended update command, inspect the generated diff and reference periods, then run `npm test` and `npm run build`.
- Visible UI change: inspect the result in a browser on desktop and mobile.
- Navigation or interaction change: exercise the flow and check the browser console.
- Larger UI change: capture or compare screenshots and check localized pages for overflow, wrapping, and layout regressions.
- If a required check cannot run, say exactly what remains unverified. Never claim that a check passed unless it was actually executed.
- Report unrelated pre-existing failures; do not expand the task to fix them without a direct connection to the requested work.

## Common commands

- `npm run dev` - start local development.
- `npm run lint` - run the Next.js Core Web Vitals ESLint rules.
- `npm test` - run the complete Node test suite.
- `npm run build` - validate data and articles, then create a production build.
- `npm run audit:articles` - run the article quality audit.
- `npm run new:article -- <lang> <year> <slug> <title>` - scaffold an article without overwriting existing content.
- `npm run update:data` - refresh official debt and debt-to-GDP data when explicitly required.

## Completion report

Keep the final report concise and include:

- The outcome.
- The important files changed.
- The checks that were actually run and their results.
- Any material assumptions, limitations, or remaining risks.

Avoid long technical explanations unless they help the user make a decision or the user asks for them.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
