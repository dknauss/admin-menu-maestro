# Milestone R1: Third-Party Compatibility Research

**Status:** ✅ COMPLETE 2026-06-29 (non-versioned research milestone — no release tag, no SVN deploy)
**Phases:** 13–16 (4 phases, 12 plans)
**Audit:** [R1-MILESTONE-AUDIT.md](R1-MILESTONE-AUDIT.md) — passed, 11/11 requirements satisfied

## Overview

Document how Maestro's sparse-delta replay behaves against the six highest-impact admin-menu-manipulating plugins. Produced a committed reproducible wp-env harness, a consistent classification schema, per-plugin survey findings, a consolidated compatibility note, and a prioritized fix/limitation backlog. **No plugin code was committed. No release tag. No SVN deploy.** The R1 boundary held: fixes were classified and ranked (COMPAT-01..13) but never implemented.

**Track:** Non-versioned research. Deliverables are committed planning artifacts and a harness/test scaffolding only.

## Phases

### Phase 13: Compatibility Harness + Classification Schema
**Goal**: A committed, reproducible multi-plugin test environment and a consistent survey template exist before any survey work begins
**Depends on**: Nothing (first R1 phase)
**Requirements**: HARN-01, HARN-02, SCHM-01
**Success Criteria**:
  1. A single documented command (`npm run compat:start`) boots WordPress with all six survey plugins at recorded pinned versions — confirmed by `wp plugin list`
  2. The harness provisions an admin + at least one lower-privilege role user — confirmed by `wp user list`
  3. A committed schema document defines all six manipulation dimensions + a rename/reorder/hide/re-icon × safe/degraded/broken matrix template
  4. The schema template is committed before any SURV-xx file is authored

Plans:
- [x] 13-01-PLAN.md — compat wp-env harness: six pinned ZIP plugins + Maestro via ../.. + ports 8890/8891 + afterStart admin/Editor/Shop Manager provisioning + VERSIONS.md + compat:* scripts [HARN-01, HARN-02]
- [x] 13-02-PLAN.md — classification-schema template at .planning/compat/SCHEMA.md (6 dimensions + rename/reorder/hide/re-icon × safe/degraded/broken matrix + classified-fix list) [SCHM-01]

**Completed:** 2026-06-26 (verified 4/4)

### Phase 14: WooCommerce Survey
**Goal**: WooCommerce's menu-manipulation behavior is fully characterized using the Phase 13 schema, and the schema is refined against the hardest test case before the remaining five surveys run
**Depends on**: Phase 13
**Requirements**: SURV-01
**Success Criteria**:
  1. A committed survey document covers how WooCommerce registers and manipulates the admin menu (all six dimensions)
  2. Every Maestro operation (rename / reorder / hide / re-icon) against WooCommerce menu items is classified safe/degraded/broken with observable evidence
  3. Every identified issue has a classified fix
  4. Any gaps in the SCHM-01 template surfaced by WooCommerce's complexity are resolved and the schema committed in final form before Phase 15

Plans:
- [x] 14-01-PLAN.md — boot harness, characterize HOW Woo manipulates the menu (Part 1 dimensions) + reproducible Method header + natural-state $menu/$submenu baseline [SURV-01]
- [x] 14-02-PLAN.md — full Part 2 classification matrix (rename/reorder/hide/re-icon × every affected item, per-role hide, persistence+timing) + interaction scenarios [SURV-01]
- [x] 14-03-PLAN.md — Part 3 classified-fix list + success-criterion traceability + batched SCHEMA.md refinement/changelog + reconcile SURV-01 [SURV-01]

**Completed:** 2026-06-28 (verified 4/4). SURV-01 = full 34-row matrix, 0 broken cells; SCHEMA.md finalized with a Phase 14 changelog + promoted Interaction Scenarios.

### Phase 15: Remaining Survey Set
**Goal**: All five remaining survey plugins (Jetpack, Yoast SEO, Elementor, WPForms, LifterLMS) are surveyed using the proven schema from Phases 13–14
**Depends on**: Phase 14
**Requirements**: SURV-02, SURV-03, SURV-04, SURV-05, SURV-06
**Success Criteria**:
  1. Five committed survey documents exist, each filling in the SCHM-01 template consistently
  2. Every Maestro operation against each plugin's menu items is classified safe/degraded/broken with observable evidence
  3. Every identified issue across all five surveys carries a classified fix
  4. All five surveys use identical schema structure, making mechanical synthesis in Phase 16 possible

Plans:
- [x] 15-01-PLAN.md — Survey Jetpack (SURV-02): disconnected-state menu, classify ops, classified fixes
- [x] 15-02-PLAN.md — Survey Yoast SEO (SURV-03): SEO menu, classify ops, classified fixes (Rank Math out-of-scope / deferred)
- [x] 15-03-PLAN.md — Survey Elementor (SURV-04): own Elementor + Templates top-levels, classify ops, classified fixes
- [x] 15-04-PLAN.md — Survey WPForms Lite (SURV-05): WPForms menu, classify ops, classified fixes
- [x] 15-05-PLAN.md — Survey LifterLMS (SURV-06): own top-level + submenus + llms-separator, classify ops, classified fixes

**Completed:** 2026-06-29 (verified 4/4). All five surveys 0 broken cells; identical schema structure confirmed.

### Phase 16: Synthesis
**Goal**: All six per-plugin findings are merged into a single authoritative compatibility note and a ranked, classified fix/limitation backlog ready to seed a future versioned milestone
**Depends on**: Phase 14, Phase 15
**Requirements**: DELV-01, DELV-02
**Success Criteria**:
  1. A committed compatibility note presents all six findings under the single SCHM-01 schema with a summary safe/degraded/broken matrix per plugin
  2. A committed prioritized backlog ranks every surfaced issue, each classified into one of the four fix categories
  3. Every backlog item carries a forward ID (COMPAT-xx) ready to be referenced without renaming
  4. The backlog contains no orphaned issues

Plans:
- [x] 16-01-PLAN.md — consolidated compatibility note (DELV-01): six per-plugin findings under one schema + summary safe/degraded/broken matrix (plugin × operation)
- [x] 16-02-PLAN.md — ranked, classified COMPAT-xx fix/limitation backlog (DELV-02) with full SURV-NN traceability + FIX-xx seed link

**Completed:** 2026-06-29 (verified 9/9). DELV-01 = COMPATIBILITY-NOTE.md (6×4 matrix, 0 broken); DELV-02 = BACKLOG.md (42 issues → 13 COMPAT-xx items, 0 orphans, ID-stability contract).

---

## Milestone Summary

**Deliverables (all committed under `.planning/compat/` + `tests/compat/`):**
- Reproducible six-plugin wp-env harness (`tests/compat/`, `compat:*` scripts, pinned `VERSIONS.md`)
- Classification schema (`SCHEMA.md`)
- Six per-plugin surveys (`SURV-01..06`)
- Consolidated compatibility note (`COMPATIBILITY-NOTE.md`)
- Prioritized fix/limitation backlog (`BACKLOG.md`, COMPAT-01..13)

**Headline finding:** 0 broken cells across all six plugins × four Maestro operations. Worst case is "degraded" (cosmetic loss — badge-in-title on rename, separator re-clustering on reorder, cosmetic per-role hide).

**Key Decisions:**
- SCHEMA.md kept pristine through Phase 13; surveys copy it to SURV-NN files and fill the copies. Finalized (no longer pristine) after Phase 14 stress-tested it against the hardest case.
- Fix-category labels carry both the requirement wording and an automated-verification plain-text alias.
- Phase 16 synthesis: source survey governs over pre-extraction inputs on classification disputes (LifterLMS rename = safe).
- COMPAT-01..03 are the only actionable items (slug-resolution tweaks); COMPAT-04..13 are documented limitations. 42 survey issues collapse to 13 COMPAT items with 0 orphans.

**Issues Resolved:** Phase 13 Docker boot checkpoint (cold boot ~15 min; transient Elementor ZIP CRC self-heals on retry; partial `WordPress-PHPUnit/` from interrupted runs can block the shallow clone).

**Technical Debt Incurred:** None for the research artifacts. The forward fix work (COMPAT-01..13) is intentionally deferred to a later versioned milestone (FIX-xx).

---

_For current project status, see .planning/ROADMAP.md_
