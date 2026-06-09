# Inline Admin Menu Editor (AMX)

In-place editing of the WordPress admin menu — rename items, reorder them, swap top-level dashicons, and hide items per role. Global configuration, no separate settings screen: the editor is toggled from the admin bar and operates on the menu itself.

## Status

v1 foundation. The server core (replay engine, REST API, sanitization) and the full test harness are complete and the plugin installs cleanly. The editor's interaction model is **mid-rework**: it is being moved to click-to-select with debounced autosave, specified in [`FIXES.md`](FIXES.md). The bundled `assets/amx-edit.js` is still the original always-visible per-item-control model (plus an icon-preview fix), so the following are **not yet implemented**:

- debounced autosave (current code relies on a manual Save button)
- click-to-select with a single shared controls panel (no chrome until selection)
- wiring the icon picker into autosave (icon persistence depends on this)
- forcing a stable expanded state while editing (folded-mode breakage)

See `FIXES.md` for the punchlist and acceptance criteria, and `SPEC.md` for the durable design.

## Important: visibility is cosmetic, not access control

Hiding a menu item only declutters the menu — the underlying page still loads for anyone who knows its URL, because a page's own registered capability is the real lock. For actual access control, pair this with a capability manager (User Role Editor, or PublishPress Capabilities). The `amx_capability` filter lets such a plugin hand editing rights to a custom capability instead of the default `manage_options`.

## Repository layout

- **Runtime plugin** — `amx-inline-menu-editor.php`, `includes/`, `assets/`, `readme.txt`. This is all that ships to a site.
- **Dev & tooling** — `tests/`, `composer.json`, `package.json`, `.wp-env.json`, `playwright.config.ts`, `phpunit-*.xml.dist`, `bin/build.sh`.
- **Docs** — `SPEC.md` (durable specification), `FIXES.md` (active punchlist), `TESTING.md` (how to run each test layer).

## Install (to a site)

Build a runtime-only zip and upload it under Plugins → Add New → Upload:

```bash
bin/build.sh        # writes build/amx-inline-menu-editor.zip (runtime files only)
```

Activate it; **Edit Menu** appears in the admin bar. Never ship the dev tooling inside the installed plugin.

## Develop & test

```bash
composer install && composer test:unit          # pure unit tests, no WordPress
npm install && npm run env:start                 # boot WordPress + MySQL (Docker)
npm run test:php                                 # PHP integration tests
npm run test:e2e                                 # Playwright end-to-end
```

See `TESTING.md` for details and the standalone (non-Docker) paths.

## License

GPL-2.0-or-later. See [`LICENSE`](LICENSE).
