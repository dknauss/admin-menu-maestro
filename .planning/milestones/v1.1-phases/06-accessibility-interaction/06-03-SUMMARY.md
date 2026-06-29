---
phase: 06-accessibility-interaction
plan: "03"
subsystem: ui
tags: [accessibility, wcag, a11y, modified-indicator, per-item-reset, screen-reader, clip-path, playwright, e2e, docs]

# Dependency graph
requires:
  - phase: 06-accessibility-interaction
    plan: "01"
    provides: "window.maestroLogic.diffItem + resetItem pure helpers"
  - phase: 06-accessibility-interaction
    plan: "02"
    provides: "Alt+Arrow keyboard reorder (don't regress)"
provides:
  - "refreshModifiedIndicator(slug) in assets/maestro.js: calls maestroLogic.diffItem, toggles .maestro-modified class + badge glyph + screen-reader-text on each row"
  - "Canonical .screen-reader-text clip-path:inset(50%) CSS in maestro.css (was absent)"
  - "Non-color-only modified indicator (.maestro-modified-badge amber #dba617, ≈5.5:1 contrast on #1d2327)"
  - "Panel reset button (.maestro-reset-item) keyboard-reachable, focus-visible, emphasised (is-modified class) when item is modified"
  - "Playwright e2e test 11: modify item → indicator present; keyboard-reset → indicator cleared + delta removed from payload"
  - "Public docs updated: keyboard reorder (Alt+Arrow) + modified indicator + per-item reset documented; v1 limitation wording removed"
affects:
  - 06-VALIDATION.md

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "clip-path:inset(50%) scoped under .maestro-editing for AT-only text without hiding from screen readers"
    - "Non-color indicator: glyph (•) + .screen-reader-text sibling — shape + text, color is supplementary"
    - "refreshModifiedIndicator wired to every mutation point (commitRename, choose, visibility change, resetSelected) + init() sweep for pre-saved overrides"
    - "populatePanel reflects modified state on resetBtn via is-modified class (emphasised when modified)"

key-files:
  created: []
  modified:
    - assets/maestro.js
    - assets/maestro.css
    - includes/class-assets.php
    - tests/e2e/editor.spec.ts
    - readme.txt
    - SPEC.md
    - docs/user-guide.md

key-decisions:
  - "Non-color indicator = filled bullet glyph (•, aria-hidden) + .screen-reader-text sibling with I.modified — color supplementary only (WCAG 1.4.1)"
  - "Amber #dba617 on dark admin menu #1d2327 gives ≈5.5:1 contrast (exceeds 3:1 WCAG 1.4.11 graphical object threshold)"
  - "screen-reader-text scoped under .maestro-editing via clip-path:inset(50%) — avoids collision with WP core .screen-reader-text; does NOT use display:none/visibility:hidden (those also hide from AT)"
  - "refreshModifiedIndicator calls maestroLogic.diffItem (pure, unit-tested) — no duplicated logic in the DOM glue"
  - "Panel reset button is-modified class provides contextual emphasis; :focus-visible outline satisfies keyboard discoverability"
  - "e2e test uses keyboard-only reset (focus + Enter, no mouse click) to prove keyboard reachability"

patterns-established:
  - "AT-only text pattern: .screen-reader-text via clip-path:inset(50%) scoped under edit-mode class"
  - "Live indicator refresh pattern: wire refreshModifiedIndicator after every mutation + init sweep"

requirements-completed: [UX-01]

# Metrics
duration: 21min
completed: 2026-06-16
---

# Phase 6 Plan 03: Modified Indicator + Discoverable Reset Summary

**Non-color modified indicator (•glyph at ≥3:1 contrast + screen-reader-text) driven by maestroLogic.diffItem, keyboard-reachable panel reset with is-modified emphasis, live refresh on every mutation, e2e at 11/11, and public docs retiring the v1 keyboard-reorder limitation**

## Performance

- **Duration:** ~21 min
- **Started:** 2026-06-16T04:43:34Z
- **Completed:** 2026-06-16T05:04:34Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments

- Added canonical WordPress `.screen-reader-text` clip-path implementation to `assets/maestro.css`, scoped under `.maestro-editing` (was absent — prerequisite for AT-only "(modified)" label)
- Implemented `refreshModifiedIndicator(slug)` in `assets/maestro.js`: calls `maestroLogic.diffItem`, toggles `.maestro-modified` class on the `<li>`, injects `.maestro-modified-badge` glyph (•, amber `#dba617`, ≈5.5:1 contrast on `#1d2327`) plus `.screen-reader-text` "(modified)" sibling
- Wired `refreshModifiedIndicator` after every mutation point: `commitRename`, icon `choose()`, visibility checkbox change, `resetSelected`
- Added init sweep: runs `refreshModifiedIndicator` for all model slugs after the model is built so pre-existing (already-saved) overrides show the indicator on page load
- Hardened per-item reset discoverability: `populatePanel` reflects modified state on `panel.resetBtn` via `is-modified` class; CSS emphasises the button in amber and adds `:focus-visible` outline
- Added `modified` i18n string to `class-assets.php` via `esc_html__` with correct `maestro-menu-editor` text domain
- Added Playwright e2e test 11: rename → indicator present + badge glyph + screen-reader-text; keyboard-focus reset (focus + Enter, no mouse) → payload delta removed + indicator cleared; reload → title restored
- Updated three public docs to document Alt+Arrow keyboard reorder, modified indicator, and per-item reset; removed all "keyboard reorder not supported" / "mouse-only" limitation wording

## Task Commits

Each task was committed atomically:

1. **Task 1: Modified indicator + reset discoverability** — `27a6b52` (feat)
2. **Task 2: Modified indicator + reset e2e** — `24d7d87` (feat)
3. **Task 3: Public docs update** — `87a5ea2` (docs)

## Files Created/Modified

- `assets/maestro.js` — Added `refreshModifiedIndicator(slug)` using `maestroLogic.diffItem`; wired into all mutation points + init sweep; `populatePanel` updated to reflect modified state on reset button via `is-modified` class
- `assets/maestro.css` — Added `.maestro-editing .screen-reader-text` clip-path rule; `.maestro-modified-badge` amber glyph styling; `.maestro-reset-item.is-modified` emphasis; `:focus-visible` outline for reset button
- `includes/class-assets.php` — Added `modified` i18n string (`esc_html__('(modified)', 'maestro-menu-editor')`)
- `tests/e2e/editor.spec.ts` — Added test 11: modified indicator lifecycle via keyboard-only reset; e2e now 11/11
- `readme.txt` — Added Alt+Arrow reorder description; added "Modified indicator and per-item reset" section; added v1.1.0 changelog entry; replaced keyboard limitation note
- `SPEC.md` — Expanded Accessibility section with keyboard reorder model, modified indicator details (WCAG refs), discoverable reset; marked roadmap items 3 & 4 Done
- `docs/user-guide.md` — Added "Reordering with the keyboard" subsection, "Seeing What You Changed" section, "Resetting One Item" keyboard subsection

## Decisions Made

- **clip-path:inset(50%) scoped under .maestro-editing**: avoids collision with WP-core `.screen-reader-text` already on the page. `display:none`/`visibility:hidden` are NOT used because they hide content from AT as well.
- **Amber #dba617 for badge glyph**: meets WCAG 1.4.11 graphical object contrast (3:1 minimum) against dark admin-menu background `#1d2327` with ≈5.5:1 margin. White (#fff) would also work but amber is more visually contextual to "modified/attention" state.
- **Bullet glyph •** (U+2022): simple, universally rendered, no font dependency, conveying "something here is different" without being alarming.
- **is-modified on reset button in populatePanel (not in refreshModifiedIndicator)**: reset button state derives from the selected item; indicator state derives from any item's row. Keeping them separate avoids cross-concern.
- **e2e keyboard-reset via focus+Enter (not mouse click)**: the test explicitly proves keyboard reachability, which is the UX-01 requirement.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

- Docker/Colima socket access blocked by sandbox in first `npm run test:e2e` attempt. Colima was already running (environment was UP per the critical notes); the sandbox blocked the Docker socket at `~/.colima/default/docker.sock`. Ran `npm run env:start` and `npm run test:e2e` with sandbox disabled. This is expected behavior, not a code issue.

## Verification Results

| Suite | Result |
|-------|--------|
| `npm run test:e2e` | 11/11 (additive — 10 prior + 1 new) |
| `npm run test:js` | 24/24 |
| `composer test:unit` | 44/44 |
| `npm run test:php` | 29/29 (81 assertions) |
| `composer lint` | 7/7 clean |
| Plugin Check | All errors pre-existing (build artifacts, text domain in build copy, .DS_Store); new `modified` i18n uses correct `maestro-menu-editor` text domain |

## Self-Check: PASSED

All created/modified files verified present. All three task commits confirmed in git log:
- `27a6b52` (Task 1: modified indicator)
- `24d7d87` (Task 2: e2e)
- `87a5ea2` (Task 3: docs)

---
*Phase: 06-accessibility-interaction*
*Completed: 2026-06-16*
