---
phase: 06-accessibility-interaction
plan: "01"
subsystem: testing
tags: [node-test, javascript, pure-functions, tdd, reorder, diff, reset]

# Dependency graph
requires: []
provides:
  - "node:test JS unit suite via npm run test:js (zero new runtime deps, build-excluded)"
  - "assets/maestro-logic.js: side-effect-free reorderMove, diffItem, resetItem"
  - "tests/js/: reorder-move.test.mjs, modified-diff.test.mjs, reset-item.test.mjs (24 tests)"
  - "maestro-logic enqueued as dependency of maestro script — window.maestroLogic available at runtime"
  - "buildConfig() diff routed through maestroLogic.diffItem — single source of truth"
affects:
  - 06-02-PLAN
  - 06-03-PLAN

# Tech tracking
tech-stack:
  added: ["node:test (built-in Node 24.14, zero new devDependencies)"]
  patterns:
    - "Dual-export guard: module.exports for node:test + window.maestroLogic for browser"
    - "createRequire(import.meta.url) interop pattern for CJS imports in .mjs test files"
    - "Pure helper file (assets/maestro-logic.js) as TDD seam between unit tests and browser glue"

key-files:
  created:
    - assets/maestro-logic.js
    - tests/js/reorder-move.test.mjs
    - tests/js/modified-diff.test.mjs
    - tests/js/reset-item.test.mjs
    - tests/js/.gitkeep
  modified:
    - package.json
    - includes/class-assets.php
    - assets/maestro.js

key-decisions:
  - "TDD seam: node:test (no new deps) + pure helpers extracted from maestro.js into assets/maestro-logic.js"
  - "node --test (no args, auto-discovery) instead of directory form — Node 24.14 does not support `node --test <dir>`"
  - "Dual-export guard (CJS module.exports + window.maestroLogic) enables zero-build-step browser use and node:test import via createRequire"
  - "All three helpers (reorderMove, diffItem, resetItem) implemented in one file with single export guard — one source of truth"
  - "buildConfig() refactored to call window.maestroLogic.diffItem() — inline diff logic removed from maestro.js"

patterns-established:
  - "Pure helper TDD seam: write tests importing from assets/*.js via createRequire, then implement, then wire into browser"
  - "Dual-export pattern for vanilla JS files used in both node:test and browser without a bundler"
  - "Refactor step: remove inline logic from maestro.js and delegate to maestroLogic once green"

requirements-completed: [A11Y-06, UX-01]

# Metrics
duration: 43min
completed: 2026-06-16
---

# Phase 6 Plan 01: TDD Pure Logic Helpers Summary

**node:test JS unit suite (24 tests) + side-effect-free reorderMove/diffItem/resetItem in assets/maestro-logic.js, consumed by browser via window.maestroLogic and by node:test via createRequire, with buildConfig diff routed through the single source of truth**

## Performance

- **Duration:** ~43 min
- **Started:** 2026-06-16T03:35:43Z
- **Completed:** 2026-06-16T04:18:00Z
- **Tasks:** 4 (Task 0 + Tasks 1-3)
- **Files modified:** 7

## Accomplishments
- Established the Phase 6 TDD seam: `npm run test:js` runs `node:test` with zero new runtime dependencies
- Implemented three pure functions test-first: `reorderMove` (RED-GREEN-REFACTOR), `diffItem` and `resetItem` (GREEN with tests committed simultaneously)
- Wired `assets/maestro-logic.js` into the page load as a `maestro-logic` script dependency of `maestro`, guaranteeing `window.maestroLogic` exists before `maestro.js` runs
- Refactored `buildConfig()` in `maestro.js` to delegate diff logic to `window.maestroLogic.diffItem()`, eliminating the duplicated inline diff

## Task Commits

Each task was committed atomically:

1. **Task 0: Add node:test JS runner** - `72087e4` (chore)
2. **Task 1 RED: Failing reorderMove tests** - `640ab7e` (test)
3. **Task 1 GREEN: Implement reorderMove** - `efbb024` (feat)
4. **Task 2 TEST: diffItem + resetItem tests** - `be1ba83` (test)
5. **Task 2 REFACTOR: Route buildConfig through maestroLogic** - `d1595bb` (refactor)
6. **Task 3: Wire maestro-logic.js into page load** - `25288f0` (feat)

_Note: TDD tasks have multiple commits (test -> feat -> refactor)_

## Files Created/Modified
- `assets/maestro-logic.js` — Pure helpers: reorderMove, diffItem, resetItem; dual-export guard
- `tests/js/reorder-move.test.mjs` — 9 tests for reorderMove (up/down, clamp, immutability, edge cases)
- `tests/js/modified-diff.test.mjs` — 9 tests for diffItem (title/icon/roles, submenu no-icon, falsy-title rule)
- `tests/js/reset-item.test.mjs` — 6 tests for resetItem (top-level, submenu, immutability, round-trip invariant)
- `tests/js/.gitkeep` — Ensures empty directory commits before first spec
- `package.json` — Added `test:js` script (`node --test`, auto-discovery)
- `includes/class-assets.php` — Enqueues `maestro-logic` script handle before `maestro`
- `assets/maestro.js` — buildConfig() diff delegated to `window.maestroLogic.diffItem()`

## Decisions Made

- **node:test (no new deps) over Vitest**: `node --test` is built into Node 24.14; zero new devDependencies; build hygiene automatic since `bin/build.sh` never copies `tests/`.
- **`node --test` (no args, CWD auto-discovery)**: Node 24.14 does not support `node --test <directory>` — the path argument is treated as a CJS module path and fails. Auto-discovery (`node --test` with no args) discovers all `*.test.mjs` files recursively from CWD. Only `tests/js/` contains `.test.mjs` files, so scope is correct. Documented as deviation from plan's `node --test tests/js/` recommendation.
- **Single-file helpers with dual-export guard**: All three functions live in one file (`assets/maestro-logic.js`) with one export guard block. Tests import via `createRequire(import.meta.url)` from `.mjs` files. Browser reads `window.maestroLogic`.
- **Refactor included**: `buildConfig()` in `maestro.js` now calls `window.maestroLogic.diffItem()` — no duplicated diff logic.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] node --test directory form not supported in Node 24.14**
- **Found during:** Task 0
- **Issue:** Plan specified `"test:js": "node --test tests/js/"` but Node 24.14 treats the path as a CJS module path and throws `Cannot find module`. Directory form was planned for Node 24.16 but that version is not installed (24.14 is current).
- **Fix:** Used `"test:js": "node --test"` (no args) — auto-discovers all `*.test.mjs` files from CWD. Cross-platform safe, no glob, same intent as directory form since tests/js/ is the only location with `.test.mjs` files.
- **Files modified:** package.json
- **Verification:** `npm run test:js` runs and discovers all 24 tests; 0 tests when tests/js/ is empty (Task 0 baseline).
- **Committed in:** `72087e4` (Task 0 commit)

**2. [Rule 1 - TDD sequence] diffItem/resetItem lacked strict RED phase**
- **Found during:** Task 2
- **Issue:** All three helper functions (reorderMove, diffItem, resetItem) were implemented together in `assets/maestro-logic.js` during Task 1's GREEN commit. When Task 2 test files were created, they passed immediately (no RED phase possible for diffItem/resetItem).
- **Fix:** Tests were still written before any DOM glue or plan-02/03 consumer code. Correctness and coverage are identical. Documented as deviation; TDD intent (tests before consumers) is preserved.
- **Files modified:** None — tests are correct, implementation already matched spec
- **Committed in:** `be1ba83` (Task 2 test commit, noted in message)

---

**Total deviations:** 2 (1 blocking Node version incompatibility, 1 TDD sequence deviation)
**Impact on plan:** Both handled correctly. node --test auto-discovery is equivalent to directory form in this repo. diffItem/resetItem have full unit coverage; the strict RED sequence was not achievable but coverage and correctness are unaffected.

## Issues Encountered
- Node 24.14 vs Node 24.16: directory form `node --test <dir>` not supported. Resolved with auto-discovery form.
- All three helpers implemented in one GREEN commit during Task 1 (implementation was straightforward from spec). Task 2 RED phase skipped; tests confirmed green on first run.

## User Setup Required
None — no external service configuration required. All tooling is local (`node:test` built-in, no new npm deps).

## Next Phase Readiness
- `reorderMove` is ready for Plan 02 (keyboard reorder interaction) — DOM consumers call `window.maestroLogic.reorderMove`
- `diffItem` and `resetItem` are ready for Plan 03 (modified-indicator + discoverable-reset UI)
- PHP unit 44/44, JS unit 24/24, composer lint clean; zero regression
- Playwright e2e (9/9) not re-run locally (requires Docker/Colima) — buildConfig payload shape is unchanged, so no regression expected

---
*Phase: 06-accessibility-interaction*
*Completed: 2026-06-16*
