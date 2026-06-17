---
phase: 07-visual-polish-icons
plan: "02"
subsystem: ui-polish
tags: [css, javascript, i18n, accessibility, ux]
dependency_graph:
  requires: []
  provides: [toolbar-zone-rhythm, non-color-status, scannable-icon-grid, first-run-cue]
  affects: [assets/maestro.css, assets/maestro.js, includes/class-assets.php]
tech_stack:
  added: []
  patterns: [::before-glyph-status, localStorage-gate, prefers-reduced-motion]
key_files:
  created: []
  modified:
    - assets/maestro.css
    - assets/maestro.js
    - includes/class-assets.php
decisions:
  - "Non-color status signal via ::before pseudo-element glyphs (○ ⏳ ✓ ⚠) rather than separate DOM nodes — CSS-only, no ARIA change needed"
  - "Pulsing animation on saving glyph, guarded by prefers-reduced-motion"
  - "Icon cell min-size 40px (from 36px): (40 - 20img - 2border) / 2 = 9px padding centers 20px glyph precisely; touch rule stays 44px"
  - "First-run cue as fixed bar above toolbar (bottom: 53px, z-index: 99998), not a modal — does not steal focus"
  - "phpcbf auto-fixed 24 pre-existing WPCS double-arrow alignment warnings triggered by the new longest key (firstRunDismiss)"
metrics:
  duration: "7 minutes"
  completed: "2026-06-16"
  tasks_completed: 2
  files_changed: 3
---

# Phase 7 Plan 2: Edit-Mode Visual Polish Summary

One-liner: Edit-mode toolbar split into three visual zones with ::before glyph status states, icon grid tuned to a consistent 40px/20px metric, and a localStorage-gated first-run cue with full i18n.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Toolbar hierarchy/spacing + non-color status states | 02950e6 | assets/maestro.css |
| 2 | Icon-grid scanability at ~20px + first-run cue | 5872afa | assets/maestro.css, assets/maestro.js, includes/class-assets.php |

## What Was Built

**Task 1 — Toolbar zone rhythm and non-color status (CSS only)**

The toolbar now reads as three deliberate zones:
- **Status zone** (left): `flex-shrink:0` prevents compression; each state carries a `::before` glyph (○ idle, ⏳ saving, ✓ saved, ⚠ error). The pulsing animation on `saving` is guarded by `prefers-reduced-motion`.
- **Panel zone** (center): left separator widened to 2px border; label `max-width` tightened to 200px to prevent overrun of the status zone.
- **Right-actions zone** (right): matching 2px left separator; `flex-shrink:0` keeps Reset all/Exit always reachable.

All Phase 6 modified-indicator rules (`maestro-modified`, `maestro-modified-badge`, `maestro-reset-item`, `is-modified`) are untouched.

**Task 2 — Icon grid + first-run cue (CSS + JS + i18n)**

Icon grid:
- Cell `min-size` changed from 36px to 40px; padding set to 9px so the 20px glyph is precisely centered in both the Bootstrap and Dashicons tabs.
- Gap tightened to 3px — both tabs now share the same visual density.
- The 44px touch-target in the `<=782px` media rule is preserved verbatim; padding in that context is 12px to maintain centering.

First-run cue:
- `buildFirstRunCue()` runs at init time, guarded by `localStorage.getItem('maestroFirstRunDone') === '1'`. All localStorage access is inside try/catch for private-browsing safety.
- Renders a fixed bar (`bottom: 53px`, `z-index: 99998`) above the toolbar — does not cover the menu it explains.
- Dismiss by click or Enter/Space on the "Got it" button; `localStorage.setItem('maestroFirstRunDone','1')` suppresses it permanently.
- Does not steal focus from the menu.

i18n:
- `firstRun` and `firstRunDismiss` keys added to the `i18n` array in `class-assets.php`.
- `phpcbf` auto-corrected 24 pre-existing WPCS double-arrow alignment warnings across the entire array (the new `firstRunDismiss` key became the longest, triggering re-alignment for all 24 entries).

## Verification

- `composer lint` — clean (0 errors, 0 warnings after phpcbf)
- `composer test:unit` — 44/44
- `npm run test:php` — 29/29 (81 assertions)
- `npm run test:js` — 35/35
- Phase 6 modified-indicator, reset-item, screen-reader-text, focus-visible rules: all present and unchanged in final CSS

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] phpcbf alignment auto-fix**
- **Found during:** Task 2 verification (`composer lint`)
- **Issue:** Adding `firstRunDismiss` (the new longest key at 16 chars) caused WPCS to report 24 double-arrow alignment warnings across the entire `i18n` array — including all pre-existing entries. These were flagged as auto-fixable.
- **Fix:** Ran `vendor/bin/phpcbf --standard=phpcs.xml.dist includes/class-assets.php` which fixed all 24 in one pass. The fix is cosmetic alignment only; no behavior change.
- **Files modified:** `includes/class-assets.php`
- **Commit:** included in `5872afa`

## Self-Check

Files exist:
- [x] `assets/maestro.css` — FOUND
- [x] `assets/maestro.js` — FOUND
- [x] `includes/class-assets.php` — FOUND

Commits exist:
- [x] `02950e6` — style(07-02): clarify toolbar hierarchy and non-color status states
- [x] `5872afa` — feat(07-02): scannable icon grid and dismissible first-run cue

## Self-Check: PASSED
