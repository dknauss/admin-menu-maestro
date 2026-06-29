---
phase: 06-accessibility-interaction
plan: "02"
subsystem: ui
tags: [accessibility, keyboard, a11y, javascript, playwright, e2e, wp-a11y, aria]

# Dependency graph
requires:
  - phase: 06-accessibility-interaction
    plan: "01"
    provides: "window.maestroLogic.reorderMove pure helper + node:test JS unit suite"
provides:
  - "Alt+ArrowUp/Down keyboard reorder handler in assets/maestro.js"
  - "Explicit focus restoration after DOM re-append (focus({ preventScroll: true }))"
  - "Polite/assertive announcements via wp.a11y.speak() for moves and boundary clamps"
  - "i18n strings: moved, moveAtTop, moveAtBottom, dirUp, dirDown"
  - "aria-keyshortcuts on selected rows for AT discovery"
  - "Playwright e2e test 10: keyboard-only reorder with two chained Alt+ArrowDown presses"
  - "CSS :focus-visible ring on .maestro-selected > a"
affects:
  - 06-03-PLAN

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Alt+modifier+arrow keyboard reorder: fires only when selectedSlug set and focus not in popover/input/button"
    - "DOM re-append focus restoration: liForSlug(slug).querySelector('a').focus({ preventScroll: true }) after appendChild"
    - "speak() politeness arg: pass 'assertive' for boundary/error feedback, omit (polite) for success — existing callers unchanged"
    - "waitForNavigation() before expect.poll() after reset-all click to avoid $$eval racing window.location.reload()"

key-files:
  created: []
  modified:
    - assets/maestro.js
    - assets/maestro.css
    - includes/class-assets.php
    - tests/e2e/editor.spec.ts

key-decisions:
  - "speak() extended with optional second arg for politeness level — existing single-arg callers unchanged (undefined treated as polite by wp.a11y.speak)"
  - "Boundary clamps (already first/last) announce assertively; successful moves announce politely with position ('X moved down, position 3 of 8')"
  - "Keyboard handler scoped to own list: top-level items move among top-level; submenu items move among siblings (no reparenting)"
  - "aria-keyshortcuts set on selected row in selectItem() and updated after each successful move"
  - "e2e cleanup uses page.waitForNavigation() before expect.poll(order) to prevent execution-context race against doResetAll's window.location.reload()"

patterns-established:
  - "Focus restoration after DOM re-append: always call focus({ preventScroll: true }) after appendChild to restore keyboard state"
  - "Chained keyboard interactions: test with two sequential keypresses (no re-focus between) to prove focus retention"

requirements-completed: [A11Y-06]

# Metrics
duration: 13min
completed: 2026-06-16
---

# Phase 6 Plan 02: Keyboard Reorder Handler Summary

**Alt+ArrowUp/Down keyboard reorder on the in-place editor: DOM re-append with explicit focus restoration, polite/assertive wp.a11y.speak announcements, reuses maestroLogic.reorderMove + scheduleAutosave; Playwright e2e at 10/10 including chained two-press focus-retention proof**

## Performance

- **Duration:** ~13 min
- **Started:** 2026-06-16T04:25:49Z
- **Completed:** 2026-06-16T04:38:49Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Implemented Alt+ArrowUp/Down keydown handler on `#adminmenu` that fires only when a maestro item is selected and focus is not in a popover or form control
- After each DOM re-append, explicitly restores focus to the moved row's anchor via `focus({ preventScroll: true })` so chained keypresses work without re-selection
- Extended `speak()` with an optional politeness arg: successful moves speak politely with position, boundary clamps speak assertively — existing callers unchanged
- Added keyboard-only e2e test (test 10) including a chained second Alt+ArrowDown that proves focus retention after the first move's re-append; all 10/10 e2e tests green

## Task Commits

Each task was committed atomically:

1. **Task 1: Keyboard reorder handler** - `1542c32` (feat)
2. **Task 2: Keyboard-only reorder e2e walkthrough** - `0678a89` (feat)

**Plan metadata:** (see final commit below)

## Files Created/Modified
- `assets/maestro.js` - Added Alt+Arrow keydown handler with reorderMove, DOM re-append, focus restoration, speak() announcements, aria-keyshortcuts; extended speak() politeness arg; aria-keyshortcuts in selectItem()
- `assets/maestro.css` - Added :focus-visible focus ring on .maestro-selected > a for keyboard-reorder affordance
- `includes/class-assets.php` - Added i18n strings: moved, moveAtTop, moveAtBottom, dirUp, dirDown
- `tests/e2e/editor.spec.ts` - Added test 10: keyboard-only reorder with chained two-press focus proof + waitForNavigation() cleanup guard

## Decisions Made
- `speak()` extended with optional politeness arg — passes it through to `wp.a11y.speak(message, politeness)`. Omitting the arg means `undefined` is passed, which wp.a11y.speak treats as polite. No behavior change for existing callers.
- Boundary clamps announced assertively: a "failed action" (item is already first/last) needs immediate acknowledgment; successful moves are polite to not interrupt the screen reader mid-sentence.
- The `aria-keyshortcuts` attribute is set on selection (in `selectItem`) so AT can discover the shortcut immediately after the user selects an item, not only after the first move.
- e2e cleanup uses `page.waitForNavigation()` before `expect.poll(order)` — without this, `$$eval` can race against `window.location.reload()` from `doResetAll` and throw "Execution context was destroyed". The drag test (test 9) uses the same cleanup pattern and passes because timing differs slightly; the explicit wait is more robust.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] e2e cleanup race: $$eval versus doResetAll's window.location.reload()**
- **Found during:** Task 2 (e2e test execution)
- **Issue:** First e2e run showed "Execution context was destroyed" at `expect.poll(order)` after `.maestro-reset-all` click. `doResetAll` sends DELETE then calls `window.location.reload()` on success; `expect.poll` retried `$$eval` during the navigation, destroying the context.
- **Fix:** Added `const resetNav = page.waitForNavigation()` before clicking reset-all, then `await resetNav` before `expect.poll(order)`. Ensures the reload completes before polling restarts.
- **Files modified:** tests/e2e/editor.spec.ts
- **Verification:** 10/10 e2e green on second run
- **Committed in:** `0678a89` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug in e2e cleanup timing)
**Impact on plan:** Robustness fix to the new test's cleanup step. No scope creep. Existing test 9 (drag) uses the same pattern and passes by timing luck; the explicit wait is strictly more correct.

## Issues Encountered
- First e2e run: test 8 (per-role visibility) timed out at `waitForURL(/wp-admin/)` — transient flaky failure from login redirect timing. Passed cleanly on second run.
- First e2e run: test 10 (keyboard reorder) failed with `$$eval` execution-context race — fixed by adding `waitForNavigation()` before cleanup poll.

## User Setup Required
None — no external service configuration required. All tooling is local.

## Next Phase Readiness
- A11Y-06 is fully closed: Alt+ArrowUp/Down reorder is keyboard-operable, focus chains, announcements are polite/assertive, autosave matches the drag path
- Plan 03 (modified-indicator + discoverable per-item reset affordance) can consume `maestroLogic.diffItem` and `maestroLogic.resetItem` (already in place from Plan 01)
- Zero regression: PHP unit 44/44, integration 29/29, JS unit 24/24, e2e 10/10, composer lint 7/7

## Self-Check: PASSED

All created/modified files verified present. Both task commits confirmed in git log.

---
*Phase: 06-accessibility-interaction*
*Completed: 2026-06-16*
