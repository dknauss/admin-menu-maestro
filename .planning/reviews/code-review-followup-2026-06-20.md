# Code review follow-up handoff — 2026-06-20

## Context

A comprehensive code/process review identified seven priority follow-ups. This handoff documents the work done in this pass and the residual items Claude should assess for the current milestone plan.

## Completed in this pass

1. **Autosave/reset/exit race hardening**
   - Reused the existing single-flight save chain in `assets/maestro.js`.
   - Added `waitForSaveIdle()` so Exit waits for queued or in-flight saves, not just debounce timers.
   - Added `cancelQueuedAutosave()` and made Reset All wait for any in-flight save before issuing DELETE.
   - Reset All now checks `response.ok`, disables/re-enables its button, and only reloads after a successful DELETE.

2. **Uninstall cleanup**
   - Added `uninstall.php` guarded by `WP_UNINSTALL_PLUGIN`.
   - Deletes only `maestro_config` on uninstall; deactivation remains non-destructive.
   - Updated `bin/build.sh` so uninstall cleanup ships in the runtime ZIP.

3. **Dependency/tooling drift**
   - Regenerated local Composer lock state and added PHPStan dependencies/config.
   - Bumped private package metadata to `1.1.1` and updated `@wordpress/env` to `^11.8.1`.
   - Added `bin/audit-npm.mjs` plus `npm run audit:npm` to document/allowlist the current dev-only `@wordpress/env` → `js-yaml` advisory.

4. **Playwright setup robustness**
   - Changed E2E global setup to use `waitUntil: 'domcontentloaded'` and explicitly wait for `#user_login`.
   - Login submit now races click and URL wait through `Promise.all()`.

5. **CI/release QA gates**
   - Expanded `.github/workflows/ci.yml` with dependency validation/audits, PHP syntax matrix, PHPCS, PHPStan, JS unit/docs checks, integration/E2E, runtime ZIP artifact, and Plugin Check against the built runtime tree.
   - Added `.distignore` as a second packaging-policy guard.
   - Simplified release deployment flow to avoid duplicate WordPress.org deploys: tag push creates the GitHub release; the existing release-published event drives `wp-deploy.yml`.
   - Added release/deploy version checks and deploy concurrency.

6. **Repository health files**
   - Added repo-local `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`, `CODE_OF_CONDUCT.md`, `.github/PULL_REQUEST_TEMPLATE.md`, issue forms, `dependabot.yml`, and `CODEOWNERS`.

7. **Docs/version drift**
   - Updated README status from v1.1.0 to v1.1.1.
   - Corrected build ZIP name to `build/maestro-menu-editor.zip`.
   - Documented `uninstall.php` as a runtime file.
   - Updated TESTING guidance to include PHPStan, npm audit wrapper, Plugin Check, and current E2E scope without brittle exact E2E counts.

## Recommended backlog / planning candidates

### Runtime behavior

- **Add E2E coverage for save races**: slow REST response + Exit; pending rename + Reset All; in-flight save + Reset All. The implementation was hardened, but automated regression coverage should be explicit.
- **Bound config payload size**: add server-side limits for title length, number of items/order entries, role list length, and data-URI length. Current sanitization is strong but does not cap payload size.
- **Scope `custom_menu_order` enablement**: consider enabling `custom_menu_order` only when a stored top-level order exists, to avoid activating unrelated menu-order filters unnecessarily.
- **Duplicate submenu slug strategy**: document or improve handling for duplicate submenu slugs under one parent. Current slug-only identity is consistent with v1 but can collapse ambiguous duplicates.

### QA / tooling

- **Add JS/CSS linting**: CI now runs JS unit tests but not ESLint/Stylelint. Decide whether to add `@wordpress/scripts` or standalone ESLint/Stylelint rules for no-build runtime JS/CSS.
- **Add axe accessibility checks**: Playwright has strong UI coverage; automated axe checks would complement keyboard and sizing assertions.
- **Add multisite test path**: current integration tests are single-site in wp-env. Decide whether v1.2 requires multisite assertions or documentation that multisite is not yet a supported configuration.
- **Plugin Check output policy**: CI runs Plugin Check against the runtime tree. Consider parsing JSON and storing the report as an artifact for release audits.

### Release / repository operations

- ~~**Update GitHub About homepage**~~ — **Done (2026-06-20).** Repository metadata now points to the active `dknauss/Maestro` stable Playground blueprint URL.
- **Branch cleanup**: remote branch list is clean except `ci/deploy-dispatch`, but local stale branches remain. Prune/delete local-only branches after confirming no work is needed.
- **Decide Composer lock policy**: `.gitignore` says `composer.lock` is intentionally not committed. If CI keeps `composer validate --strict`, this is fine; if release reproducibility becomes more important than library-style dependency freshness, revisit the policy.
- **Remove npm audit allowlist when upstream fixes `@wordpress/env`**: the advisory is dev-only and documented in `bin/audit-npm.mjs`; Dependabot/npm updates should revisit it.

## Verification notes

Verification should be run after these edits with:

```bash
composer validate --strict
composer test:unit
composer lint
composer analyse:phpstan
npm run test:js
npm run audit:npm
npm run check:doc-links
bash bin/build.sh
npm run env:start
npm run test:php
npm run test:e2e
npx wp-env run cli wp plugin install plugin-check --activate
npx wp-env run cli wp plugin check /var/www/html/wp-content/plugins/maestro-menu-editor/build/maestro-menu-editor --format=json
npm run env:stop
```
