---
phase: 6
slug: accessibility-interaction
status: planned
nyquist_compliant: true
wave_0_complete: false
created: 2026-06-15
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> TDD-first: every pure-logic task ships its failing test before implementation.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | phpunit (existing PHP unit/integration) · Playwright (e2e) · **`node:test`** (JS unit, dev-only, zero new dependency — built into Node 24.16) |
| **Config file** | `phpunit-unit.xml.dist`, `phpunit-integration.xml.dist`, `playwright.config.ts` · JS unit needs no config file (`node --test tests/js/`) |
| **Quick run command** | `composer test:unit` · `npm run test:js` |
| **Full suite command** | `npm run test:js && composer test:unit && composer test:integration && npm run test:e2e` |
| **Estimated runtime** | JS unit <2s · unit <10s · integration ~30–60s (wp-env) · e2e ~30–90s |

**TDD seam decision (planner):** Frontend pure-logic path chosen. `node:test` runs
the unit suite; pure helpers live in `assets/maestro-logic.js` (ships in the build,
imported by `maestro.js` with no build step) and tests live in `tests/js/` (never
copied by `bin/build.sh`, so test tooling stays out of the runtime zip). No new
devDependency — Node 24.16 ships `node:test`/`node:assert` natively.

---

## Sampling Rate

- **After every task commit:** Run the quick command for the layer touched
  (`npm run test:js` and/or `composer test:unit`).
- **After every plan wave:** Run the full suite.
- **Before `/gsd:verify-work`:** Full suite green — JS unit all green, PHP unit
  **44/44** (+ new), integration **29/29** (+ new), e2e **9/9 + additive** (new
  keyboard-reorder and modified-indicator specs raise the count, never lower the
  passing set), Plugin Check **0 errors**, `composer lint` clean.
- **Max feedback latency:** < 2s for JS unit-level TDD loops; < 10s for PHP unit.

---

## Per-Task Verification Map

> Populated by gsd-planner. Each pure-logic task ships its failing unit test first
> (TDD red), committed before the implementation.

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01 · Task 0 (runner) | 06-01 | 1 (W0) | A11Y-06, UX-01 | infra | `npm run test:js` | tests/js/, package.json | ⬜ pending |
| 06-01 · Task 1 (reorderMove TDD) | 06-01 | 1 | A11Y-06 | unit (node:test) | `node --test tests/js/reorder-move.test.mjs` | tests/js/reorder-move.test.mjs · assets/maestro-logic.js | ⬜ pending |
| 06-01 · Task 2 (diffItem + resetItem TDD) | 06-01 | 1 | UX-01 | unit (node:test) | `node --test tests/js/modified-diff.test.mjs tests/js/reset-item.test.mjs` | tests/js/modified-diff.test.mjs · tests/js/reset-item.test.mjs | ⬜ pending |
| 06-01 · Task 3 (enqueue wiring) | 06-01 | 1 | A11Y-06, UX-01 | glue | `composer test:unit` + grep maestro-logic | includes/class-assets.php | ⬜ pending |
| 06-02 · Task 1 (Alt+Arrow handler) | 06-02 | 2 | A11Y-06 | glue (e2e-covered) | `composer lint` + grep reorderMove/altKey | assets/maestro.js | ⬜ pending |
| 06-02 · Task 2 (keyboard reorder e2e) | 06-02 | 2 | A11Y-06 | e2e (Playwright) | `npm run test:e2e` | tests/e2e/editor.spec.ts | ⬜ pending |
| 06-03 · Task 1 (modified indicator + reset) | 06-03 | 3 | UX-01 | glue (e2e-covered) | `composer lint` + grep diffItem/maestro-modified | assets/maestro.js · assets/maestro.css | ⬜ pending |
| 06-03 · Task 2 (indicator + reset e2e) | 06-03 | 3 | UX-01 | e2e (Playwright) | `npm run test:e2e` | tests/e2e/editor.spec.ts | ⬜ pending |
| 06-03 · Task 3 (docs) | 06-03 | 3 | A11Y-06, UX-01 | doc grep | grep keyboard/Alt in readme.txt, SPEC.md, docs/user-guide.md | readme.txt · SPEC.md · docs/user-guide.md | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

**Pure-logic coverage:** All three pure functions (reorderMove → A11Y-06; diffItem +
resetItem → UX-01) have a dedicated failing-test-first unit task with an
`<automated>` `node --test` command. No pure-logic task lacks an automated verify.
DOM glue (handlers, indicator rendering) is intentionally e2e-covered, not
unit-covered, per the LOCKED decision that glue/UI is not unit-TDD.

---

## Wave 0 Requirements

- [x] **TDD seam decision realized** (planner): JS pure-logic path chosen →
      `node:test` runner via `npm run test:js`, zero new devDependency, tests in
      `tests/js/` excluded from `bin/build.sh` (it never copies `tests/`).
      Realized in **06-01 Task 0** (Wave 0 step within the Wave 1 plan).
- [ ] Failing unit-test stubs for the **reorder-move** pure function (A11Y-06) →
      06-01 Task 1 (RED commit precedes GREEN).
- [ ] Failing unit-test stubs for the **modified-state diff** pure function (UX-01) →
      06-01 Task 2 (RED commit precedes GREEN).
- [ ] Failing unit-test stub for **per-item reset** state recomputation (UX-01) →
      06-01 Task 2 (RED commit precedes GREEN).
- [ ] e2e stub(s) in `tests/e2e/editor.spec.ts` for the keyboard-only reorder
      walkthrough (06-02 Task 2) and the modified-indicator / discoverable-reset
      assertions (06-03 Task 2).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Screen-reader announcement quality of each reorder move | A11Y-06 | AT phrasing/UX judgment isn't meaningfully automatable | With VoiceOver/NVDA, select an item, press Alt+ArrowUp/Down, confirm a sensible position announcement via `wp.a11y.speak()` |
| "Modified" indicator is perceivable & not color-only | UX-01 | Visual/contrast judgment | In edit mode, modify an item; confirm a non-color cue (glyph/badge + screen-reader text) at AA contrast; confirm the per-item reset is reachable by keyboard without prior knowledge |

*Automated coverage still asserts the wiring (a move occurs and persists, indicator
class/screen-reader-text present, reset removes the delta and clears the indicator);
manual rows cover perceptual quality only.*

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (node:test runner + RED stubs in 06-01)
- [x] No watch-mode flags
- [x] Feedback latency < 10s for unit loops (JS unit <2s)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** ready for execution
