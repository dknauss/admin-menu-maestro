---
phase: 14-woocommerce-survey
plan: 03
subsystem: testing
tags: [woocommerce, compat-survey, schema, classified-fixes, traceability, slug-resolution, documented-limitation]

# Dependency graph
requires:
  - phase: 14-woocommerce-survey (Plan 01)
    provides: SURV-01 Part 1 + Method header + natural-state baselines + schema-change scratch list
  - phase: 14-woocommerce-survey (Plan 02)
    provides: SURV-01 Part 2 full 34-row classification matrix + Interaction Scenarios + surfaced-issue list (4 degraded patterns, 0 broken) + promote recommendation
provides:
  - "SURV-01-woocommerce.md Part 3: classified-fix list (I1-I6) mapping every degraded matrix cell + interaction finding to exactly one of the four R1 fix categories, with rationale; no orphans"
  - "SURV-01 Success-Criterion Traceability section mapping survey sections to the 4 Phase 14 success criteria + SURV-01"
  - "SURV-01 Survey Completion Check fully ticked with per-box justification"
  - "SCHEMA.md finalized: 6 batched refinements applied (per-cell timing/persistence convention, [state] marker, badge-loss note, entity-encoded-slug note, Hide per-role loads-vs-403 convention) + Interaction Scenarios section promoted into the template"
  - "SCHEMA.md '## Schema changes (Phase 14)' changelog documenting every change with reason"
  - "SURV-01 reconciled to the final schema shape; scratch list consumed"
affects: [15 (SURV-02..06 inherit the finalized SCHEMA.md template + promoted Interaction Scenarios), 16 (DELV-01 synthesis + DELV-02 backlog consume Part 3 I1-I6)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Classified-fix mapping: every surfaced degraded cell + interaction finding → exactly one R1 category (slug-resolution tweak / later admin_menu re-hook / special-casing / documented limitation), indexed by cross-cutting finding ID, no orphans"
    - "Batched end-of-phase SCHEMA.md refinement + changelog: schema is pristine mid-survey, refined once at phase end, then the (single) survey copy reconciled — restructuring permitted but here all changes were additive"
    - "Optional promoted Interaction Scenarios block (three canonical probes) so Phase 15 surveys inherit interaction coverage"

key-files:
  created:
    - .planning/phases/14-woocommerce-survey/14-03-SUMMARY.md
  modified:
    - .planning/compat/SURV-01-woocommerce.md
    - .planning/compat/SCHEMA.md

key-decisions:
  - "All 6 scratch-list candidates accepted as real plugin-agnostic schema improvements (not WooCommerce-specific noise); none rejected"
  - "All schema changes were additive/clarifying — no dimension/column/rubric value removed or repurposed, so SURV-01 stays a faithful instance and Phase 16 synthesis stays mechanical (no restructuring needed)"
  - "Interaction Scenarios section PROMOTED into SCHEMA.md as optional-but-recommended (per Plan 02 recommendation; S1's non-cascading parent-hide is plugin-agnostic)"
  - "Every surfaced issue classified as 'documented limitation' EXCEPT entity-encoded Products-taxonomy slugs (I3 = slug-resolution tweak); zero broken cells means no later-admin_menu-re-hook or mandatory special-casing fix is warranted in R1"
  - "I1 (badge loss) and I6 (non-cascading parent-hide) flagged to DELV-02 as potential later-milestone special-casing options, but classified documented-limitation for R1 (cosmetic/safe-by-design)"

patterns-established:
  - "Part 3 classified-fix table indexes each issue to its matrix cross-cutting finding (F1-F5) / interaction scenario (S1-S3) so DELV-02 traceability is mechanical"
  - "Schema changelog records the accept/reject decision per scratch-list candidate, not just the applied changes"

requirements-completed: [SURV-01]

# Metrics
duration: 12min
completed: 2026-06-28
---

# Phase 14 Plan 03: WooCommerce Part 3 Classified Fixes + SCHEMA.md Finalization Summary

**Closed out SURV-01: every degraded matrix cell + interaction finding mapped to exactly one R1 fix category (I1-I6, 5 documented-limitation + 1 slug-resolution tweak, no orphans, no broken cells), a success-criterion traceability section added, the completion check fully ticked, and SCHEMA.md hardened in final form with 6 batched additive refinements + a promoted Interaction Scenarios section under a "Schema changes (Phase 14)" changelog.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-06-28T19:19:43Z
- **Completed:** 2026-06-28T19:31:36Z
- **Tasks:** 2/2
- **Files modified:** 2 (SURV-01 + SCHEMA.md); 1 created (this SUMMARY)

## Accomplishments
- **Part 3 classified-fix list (I1-I6):** enumerated every surfaced issue from the Part 2 matrix and Interaction Scenarios and assigned each exactly one of the four R1 categories with a one-line rationale grounded in the observed evidence. No orphans; interaction scenarios S2/S3 explicitly folded into I1/I2 (clean sums, no new failure mode).
- **Success-Criterion Traceability section:** consolidated table mapping survey sections to the 4 Phase 14 success criteria + the SURV-01 requirement, all marked Met.
- **Survey Completion Check:** all 9 boxes ticked, each with a one-line justification confirming genuine satisfaction (34 rows, 4 ops classified, per-role Hide, etc.).
- **SCHEMA.md finalized:** applied 6 batched additive refinements and promoted the Interaction Scenarios section into the template; added a "## Schema changes (Phase 14)" changelog documenting each change + the accept/reject decision per candidate.
- **SURV-01 reconciled** to the final schema shape; the consumed scratch list replaced with a pointer to the SCHEMA.md changelog; stale forward-pointers (status note, intro, traceability row, promote recommendation) updated to completion state.

## Fix-classification counts (Part 3)

| R1 category | Count | Issues |
| --- | --- | --- |
| documented limitation | 5 | I1 (badge loss on rename), I2 (separator re-cluster), I4 (submenu re-icon no-op), I5 (cosmetic per-role Hide / loads-by-URL), I6 (non-cascading parent-hide) |
| slug-resolution tweak | 1 | I3 (entity-encoded Products-taxonomy slugs) |
| later `admin_menu` re-hook | 0 | — (no broken cell; the one timing collision is render-time `menu_order`, not `admin_menu`) |
| special-casing | 0 | — (I1/I6 flagged as *potential* later-milestone special-casing in DELV-02, but R1-classified documented-limitation) |
| **Total surfaced issues** | **6** | all mapped; **0 broken cells** across 34 matrix rows + 3 interaction scenarios |

## Schema changes (Phase 14) — counts

6 changes applied, all additive (no removal/restructure):
1. Per-cell evidence conventions (persistence shorthand + degraded/broken timing-cause) — Part 2
2. `[state]` state-dependence marker convention — Part 2
3. Count-badge-loss-on-rename handling note — Part 1 (Count badges dimension)
4. **Promoted** Interaction Scenarios section (3 canonical probes) — new optional section after Part 2
5. Entity-encoded slug note (slug-normalized matching → slug-resolution tweak) — Part 1 (Re-registered menus)
6. Hide per-role + cosmetic-vs-access (loads-vs-403) convention + column rename — Part 2

## Task Commits

Each task was committed atomically:

1. **Task 1: Classified-fix list (Part 3) + success-criterion traceability + completion check** - `a2f2fd4` (docs)
2. **Task 2: Batched SCHEMA.md refinement + changelog, then reconcile SURV-01** - `c049050` (docs)

**Plan metadata:** (final docs commit — this SUMMARY + STATE + ROADMAP + REQUIREMENTS)

## Files Created/Modified
- `.planning/compat/SURV-01-woocommerce.md` - Added Part 3 (I1-I6), Success-Criterion Traceability section, ticked Completion Check; reconciled to final schema; consumed scratch list; updated forward-pointers.
- `.planning/compat/SCHEMA.md` - Applied 6 batched additive refinements + promoted Interaction Scenarios section + "## Schema changes (Phase 14)" changelog. No longer pristine **by design** (the one allowed edit point).
- `.planning/phases/14-woocommerce-survey/14-03-SUMMARY.md` - This file.

## Decisions Made
See frontmatter `key-decisions`. Central calls: all 6 scratch candidates accepted as additive (no restructuring needed); Interaction Scenarios promoted; the only non-documented-limitation fix is I3 (slug-resolution tweak); zero broken cells means no later-admin_menu-re-hook fix is warranted; I1/I6 flagged to DELV-02 as potential later-milestone special-casing while R1-classified documented-limitation.

## Deviations from Plan
None - plan executed exactly as written. No deviation rules triggered (documentation/survey plan, R1 research-only, no production code). R1 boundary held: fixes are classified, never implemented; no production menu-handling code touched. (The compat harness was not queried — all evidence was already collected in Plans 01-02, so this plan was pure authoring from existing data.)

## Issues Encountered
- **zsh history expansion mangled `!` in compound verify/awk/heredoc commands.** The `! grep` negation and `!=` in inline scripts were corrupted by interactive history expansion. Resolved by running checks via `set +H` and a written Python script in the scratchpad rather than inline heredocs. Did not affect any artifact — only the verification harness.
- **Verify-block constraint `! grep -qi "Schema-change candidates"` in SURV-01.** The reconciliation initially kept the phrase "Schema-change candidates" in the consumed-scratch-list heading, which would have failed the Task 2 automated check. Renamed the heading to "Schema refinements — consumed into SCHEMA.md (Phase 14)" so the phrase no longer appears in SURV-01 (it lives in the SCHEMA.md changelog instead).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- **SURV-01 is COMPLETE** — Parts 1/2/3 filled, traceability + completion check satisfied, reconciled to the final schema. SURV-01 requirement is done. This was the last plan of Phase 14.
- **SCHEMA.md is in FINAL FORM for Phase 15** — battle-tested against the heaviest manipulator, carrying the Phase 14 changelog and the promoted Interaction Scenarios section. SURV-02..06 inherit it unchanged. It is intentionally no longer pristine.
- **Phase 16 (DELV-01/DELV-02):** Part 3 I1-I6 are the WooCommerce slice of the prioritized backlog — already classified with forward-pointers (I1/I6 noted as potential later-milestone special-casing).
- **Compat harness:** left RUNNING at http://localhost:8890 from Plan 02. This plan needed no harness access. Per the plan's output spec it can be stopped with `npm run compat:stop` if no further work is queued (docker socket access in this env requires sandbox-disabled). Left to the orchestrator's phase-complete handling — not stopped here since the harness boot/teardown needs Docker which is out of this plan's authoring scope.
- **Phase status:** This is the final plan; STATE.md status left as `executing` per plan instructions — the execute-phase orchestrator handles phase-complete marking + verification.

## Self-Check: PASSED

All 3 files verified present on disk (SURV-01-woocommerce.md, SCHEMA.md, 14-03-SUMMARY.md); both task commits (`a2f2fd4`, `c049050`) verified in git history. Both automated verify blocks passed; both files validated as well-formed markdown (heading structure + table column-count consistency checked).

---
*Phase: 14-woocommerce-survey*
*Completed: 2026-06-28*
