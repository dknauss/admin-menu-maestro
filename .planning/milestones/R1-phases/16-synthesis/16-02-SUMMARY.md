---
phase: 16-synthesis
plan: "02"
subsystem: compatibility-research
tags: [compat, backlog, delv-02, slug-resolution, documented-limitation, traceability]
dependency_graph:
  requires: ["16-01"]
  provides: ["DELV-02"]
  affects: ["REQUIREMENTS.md FIX-xx"]
tech_stack:
  added: []
  patterns: ["COMPAT-xx forward-ID scheme", "traceability table (SURV-NN Ix → COMPAT-xx)"]
key_files:
  created:
    - .planning/compat/BACKLOG.md
  modified:
    - .planning/REQUIREMENTS.md
decisions:
  - "COMPAT-01 through COMPAT-04 are the four slug-resolution-family items; COMPAT-01/02/03 are actionable slug-resolution tweaks; COMPAT-04 (shared-slug CPT collision) is documented limitation with a forward-candidacy note"
  - "COMPAT-07 (badge/HTML-in-title loss on rename) classified as documented limitation with explicit forward candidacy for special-casing in a later milestone"
  - "COMPAT-10 (parent-hide non-cascading) similarly carries forward candidacy for optional subtree-hide special-casing"
  - "42 total survey issues (7+5+8+8+7+7) collapse to 13 deduplicated COMPAT-xx items"
  - "FIX-xx in REQUIREMENTS.md links BACKLOG.md (markdown link) and names COMPAT-01/02/03 as highest-priority FIX candidates"
metrics:
  duration_minutes: 39
  completed_date: "2026-06-29"
  tasks_completed: 2
  files_created: 1
  files_modified: 1
---

# Phase 16 Plan 02: DELV-02 Ranked COMPAT-xx Backlog Summary

**One-liner:** Ranked 13-item COMPAT-xx backlog deduplicating 42 survey issues from SURV-01..06, with 3 actionable slug-resolution tweaks (absolute-URL and entity-encoded slug normalization) and 10 documented limitations, plus FIX-xx linkage in REQUIREMENTS.md.

## What Was Built

**Task 1 — BACKLOG.md (DELV-02):**

Created `.planning/compat/BACKLOG.md`, the DELV-02 deliverable. It deduplicates 42 Part 3 issues
from six surveys into 13 ranked COMPAT-xx items:

| COMPAT-xx | Root Cause | Category | Frequency |
|---|---|---|---|
| COMPAT-01 | Absolute-URL slugs (env-specific hostname) | slug-resolution tweak | 2/6 |
| COMPAT-02 | Absolute-URL slug (external + exact UTM params) | slug-resolution tweak | 1/6 |
| COMPAT-03 | Entity-encoded `&amp;` taxonomy slugs | slug-resolution tweak | 3/6 |
| COMPAT-04 | Shared slug: CPT top-level + first submenu | documented limitation | 3/6 |
| COMPAT-05 | Separator re-clustering on reorder | documented limitation | 2/6 |
| COMPAT-06 | Submenu reorder overridden by render-time filter | documented limitation | 1/6 |
| COMPAT-07 | Badge/HTML-in-title loss on rename | documented limitation | 4/6 |
| COMPAT-08 | Submenu re-icon silent no-op | documented limitation | 6/6 |
| COMPAT-09 | Cosmetic hide; hidden pages load by URL | documented limitation | 6/6 |
| COMPAT-10 | Parent-hide non-cascading | documented limitation | 6/6 |
| COMPAT-11 | Hide moot for cap-gated non-admin roles | documented limitation | 3/6 |
| COMPAT-12 | Dual-slug role-conditional registration (Yoast) | documented limitation | 1/6 |
| COMPAT-13 | CSS-hidden tops observational mask (Elementor) | documented limitation | 1/6 |

**Task 2 — REQUIREMENTS.md FIX-xx linkage:**

Edited the FIX-xx forward requirement bullet to explicitly name COMPAT-xx as its seed:
- Added markdown link to `BACKLOG.md`
- Named COMPAT-01/02/03 as highest-priority FIX candidates (the only actionable items)
- No checkbox state changed; DELV-02 remains Pending until overall phase verification

## Traceability Coverage

- Total survey Part 3 issues: **42** (SURV-01: 7, SURV-02: 5, SURV-03: 8, SURV-04: 8, SURV-05: 7, SURV-06: 7)
- Mapped to COMPAT-xx items: **42**
- Orphaned issues: **0**
- COMPAT items with exactly one fix category: **13/13**
- COMPAT IDs sequential with no gaps: **COMPAT-01 through COMPAT-13**

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- FOUND: `.planning/compat/BACKLOG.md`
- FOUND: `.planning/REQUIREMENTS.md`
- FOUND: commit `5b21cce` (BACKLOG.md — feat(16-02))
- FOUND: commit `9b8db07` (REQUIREMENTS.md — feat(16-02))
