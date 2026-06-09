# FIXES — handoff brief

Four reported problems from first install/testing. Two are already fixed in this
tree; two need a live runtime (WP Studio) to fix and verify. Run the existing
harness (`TESTING.md`) as the red/green target — the E2E `editor.spec.ts` already
encodes the persistence repro.

---

## ✅ #1 — Incomplete zip / won't install  (FIXED)

**Cause:** two errors stacked. A filesystem I/O error dropped a file mid-build,
*and* the test harness was shipped inside the installable zip (wrong hygiene —
`tests/`, `composer.json`, `package.json`, `.wp-env.json`, Playwright config do
not belong in an installed plugin).

**Fix applied:**
- Install artifact (`amx-inline-menu-editor.zip`) now contains **runtime only**:
  main file, `includes/`, `assets/`, `readme.txt`. Integrity-verified with
  `unzip -t`.
- Dev repo is a **separate** archive (`amx-inline-menu-editor-dev.zip`).
- Build rule going forward: the install zip excludes everything dev-only.

## ✅ #2 — Slug collision with the real "Admin Menu Customizer"  (FIXED)

**Cause:** the folder slug `admin-menu-customizer` matches a plugin in the
WordPress.org directory, so core's update check overwrote the local code with
the .org plugin (the documented "plugin confusion" risk).

**Fix applied:**
- Renamed slug → `amx-inline-menu-editor`; display name → "Inline Admin Menu
  Editor (AMX)"; text domain updated to match across all PHP.
- Added `Update URI: false` to the plugin header. Per WP 5.8+, any Update URI
  value other than the canonical w.org URL for the slug makes core skip updates
  entirely — this is the real protection. **Keep this header set** if the slug
  is ever changed to something more generic.

---

## ⏳ #3 — Menu changes do not persist / no autosave  (FOR CLAUDE CODE)

**Likely root cause (hypothesis to verify first):** this may be the *same* bug
as #4. `amx-edit.js` `init()` assumes the expanded menu structure. If it throws
when the menu is folded (or against a real plugin-laden menu), the whole editor
fails to wire up — including the Save button — so nothing persists. **First
step: open the console in WP Studio in both expanded and folded states and check
for a thrown error in `init()`.** If `init()` aborts, #3 and #4 collapse into one
fix.

If `init()` is fine, verify the save path end to end:
1. Network tab — does clicking Save fire `POST /wp-json/amx/v1/config`?
2. Does it return `200` with `{ saved: true }`? (401/403 ⇒ nonce/cap;
   404 ⇒ route not registered; 400 ⇒ payload shape.)
3. Is `amx_config` actually written? (`wp option get amx_config --format=json`.)
4. After the post-save `window.location.reload()`, does the server replay show
   the change?

**Design — DECIDED (Dan signed off): debounced autosave, no Save button.** This
also lightens the toolbar for #4. Specifics:
- Persist silently on `sortstop` (reorder), on rename commit, on icon pick, and
  on visibility toggle, and on per-item reset. Debounce ~500ms; coalesce rapid
  changes into one POST.
- Payload is unchanged — still the full config (`POST /amx/v1/config`, full
  replace). Only the cadence changes.
- **Do not reload on autosave** — the live DOM preview already reflects the
  change. Reload only on **Exit edit mode**, to reconcile against server render.
- Replace the Save button with a subtle "Saving… / Saved ✓" status indicator.
- Keep "Reset all" as the escape hatch; surface per-item reset in the shared
  panel (see #4).

Acceptance: `editor.spec.ts` "rename persists across reload, then reset restores"
must pass against WP Studio. **Add an equivalent for icon:** pick a dashicon →
assert a `POST` fires carrying `items[<slug>].icon` → reload → assert the
`.wp-menu-image` keeps the chosen `dashicons-*` class. Icon was a confirmed miss:
the icon-pick handler must fire the same debounced autosave as rename/reorder/
visibility. (The preview helper `applyIconPreview` was also fixed — its old regex
stripped `dashicons-before`; it now splits on whitespace and re-adds the marker.)

## ⏳ #4 — Editing UI too heavy; breaks in folded (minimized) menu mode  (FOR CLAUDE CODE)

**Cause:** the current model injects a control cluster (icon + visibility + reset
buttons) into *every* item's `<a>`, plus force-expands all submenus. Against
WordPress's own menu CSS this is heavy, and in `body.folded` mode — where the
menu collapses to icons and submenus become hover flyouts — the injected controls
and the `display:block !important` submenu override break the layout.

**Design — DECIDED (Dan signed off):**
1. **Neutralize folded mode while editing.** On entering edit mode, add a body
   class that forces the menu to its expanded width and disables the
   fold/flyout behavior (override `.folded`, and guard against `common.js`
   re-collapsing — may need to also toggle the user setting or intercept the
   collapse handler). Editing always happens in a stable expanded state.
2. **Click-to-select with one shared panel.** Drop the always-visible per-item
   button clusters. Per item, keep only a **drag handle** (for sortable) and a
   **selection target**. Clicking an item (top-level or submenu) selects it —
   navigation is already suppressed in edit mode — and applies a selection
   highlight; exactly one item is selected at a time. A **single shared controls
   panel** reflects the selected item: rename field, icon picker (top-level only;
   absent/disabled for submenu items), per-role visibility toggles, and
   reset-this-item. One panel, not N clusters — minimal per-item DOM, no CSS
   fights. This also dissolves the double-bound rename-handler smell below, since
   rename becomes a single field bound once.
3. **Test both states:** expanded and folded, plus a menu with several
   third-party plugins registered (WooCommerce-class submenu depth).

Acceptance: editor renders and functions in both expanded and folded modes; no
layout break; toolbar/handles do not overflow the menu column. **No edit chrome
is visible until an item is selected** — on entering edit mode the menu shows
only a faint per-row affordance (drag handle revealed on row hover/focus); the
icon / visibility / reset tools live exclusively in the shared panel, which is
empty/hidden until a selection exists. Selecting an item reveals its panel;
deselecting (or selecting another) updates or clears it. This is a hard
requirement, not a nicety — the always-visible clusters were the reported
problem.

---

## Known code smell to clean up while in here

`amx-edit.js` binds the rename click handler in **two** places — `decorateTop`/
`decorateSub` add a listener, and `renderLabel` adds another `{ once: true }`
listener after each commit. This risks double-binding / stale handlers. The
selection-model redesign (#4) should consolidate rename into a single,
idempotent handler.

## Runtime + targets

- **Runtime:** WP Studio (local). Activate from the dev tree or the install zip.
- **Red/green:** `composer test:unit` (pure, fast), `npm run test:php`
  (integration, wp-env), `npm run test:e2e` (Playwright). See `TESTING.md`.
- The unit + integration suites are unaffected by the UI redesign; lean on them
  to confirm the replay/REST core stays correct while the editor is reworked.
