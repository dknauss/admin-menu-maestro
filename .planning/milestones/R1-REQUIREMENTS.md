# Requirements: Maestro — Milestone R1 (Third-Party Compatibility Research) — ARCHIVED

**Defined:** 2026-06-22
**Completed:** 2026-06-29 (all 11 requirements satisfied — see [R1-MILESTONE-AUDIT.md](R1-MILESTONE-AUDIT.md))
**Core Value:** Editing the admin menu happens directly on the menu, with zero ceremony and zero risk to access.
**Track:** Research only — non-versioned. No plugin code, no release tag, no SVN deploy. Deliverables are planning artifacts plus a committed test harness.

> R1 documents how Maestro's sparse-delta replay behaves against the six
> highest-impact admin-menu-manipulating plugins and produces a prioritized
> fix/limitation backlog. The fixes it surfaces are **out of scope for R1** and
> ship under a later versioned milestone.

## R1 Requirements — all Complete

### Test Harness

- [x] **HARN-01**: A committed, reproducible wp-env configuration loads all six survey plugins alongside Maestro from a single documented command. Plugin versions pinned and recorded. — **Complete** (`tests/compat/`, `compat:*` scripts, `VERSIONS.md`; verified via wp-env boot 2026-06-26)
- [x] **HARN-02**: The harness provisions admin + at least one lower-privilege role/user so per-role hide behavior can be checked. — **Complete** (admin + `compat_editor` + `compat_shop_manager`; verified via `wp user list`)

### Classification Schema

- [x] **SCHM-01**: A consistent classification schema defined and committed before any survey — six manipulation dimensions + safe/degraded/broken matrix for each Maestro operation. — **Complete** (`.planning/compat/SCHEMA.md`; finalized after Phase 14 stress test)

### Per-Plugin Survey

- [x] **SURV-01**: WooCommerce surveyed and documented (heaviest manipulator). — **Complete** (`SURV-01-woocommerce.md`, 34-row matrix, 0 broken)
- [x] **SURV-02**: Jetpack surveyed and documented. — **Complete** (`SURV-02-jetpack.md`)
- [x] **SURV-03**: Yoast SEO surveyed and documented. — **Complete** (`SURV-03-yoast-seo.md`). **Outcome adjusted:** Rank Math scoped out / deferred during Phase 15 (Yoast is the locked SEO choice); requirement label corrected from "Yoast SEO / Rank Math" to reflect delivered scope.
- [x] **SURV-04**: Elementor (free; own Elementor + Templates menus) surveyed and documented. — **Complete** (`SURV-04-elementor.md`)
- [x] **SURV-05**: WPForms surveyed and documented. — **Complete** (`SURV-05-wpforms.md`)
- [x] **SURV-06**: LifterLMS (free LMS) surveyed and documented. — **Complete** (`SURV-06-lifterlms.md`)

### Synthesized Deliverables

- [x] **DELV-01**: Consolidated compatibility note presenting all six findings under one schema with a per-plugin safe/degraded/broken summary. — **Complete** (`COMPATIBILITY-NOTE.md`, 6×4 matrix, 0 broken cells)
- [x] **DELV-02**: Prioritized fix/limitation backlog ranking every surfaced issue, classified, with forward IDs. — **Complete** (`BACKLOG.md`, 42 issues → 13 COMPAT-xx items, 0 orphans, ID-stability contract; REQUIREMENTS.md FIX-xx seed link)

## Future Requirements (carried forward, not R1)

- **FIX-xx**: The actual production menu-handling fixes surfaced and ranked by DELV-02. Scoped from the `COMPAT-xx` backlog (`.planning/compat/BACKLOG.md`) citing COMPAT IDs without renumbering. COMPAT-01/02/03 (slug-resolution tweaks) are the highest-priority FIX candidates — the only actionable items; all others are documented limitations. Ships under a later versioned milestone.

## Out of Scope (R1)

| Feature | Reason |
|---------|--------|
| Production compatibility fixes / menu-handling code | R1 is research only; fixes ship under a later versioned milestone (DELV-02 output). |
| Release tag / wp.org SVN deploy / version bump | R1 produces no shippable plugin artifact; `vX.Y` numbering stays reserved for releases. |
| Plugins outside the locked set of six | Survey scope fixed by V2-16's locked priority order. |
| Performance benchmarking of the surveyed plugins | Only menu-registration/manipulation behavior in scope. |
| Carry-forward cosmetics (UX-09, BUG-08) | Code changes; contradict R1's research-only boundary. Remain in PROJECT.md backlog. |

## Traceability — final

| Requirement | Phase | Status |
|-------------|-------|--------|
| HARN-01 | Phase 13 | Complete |
| HARN-02 | Phase 13 | Complete |
| SCHM-01 | Phase 13 | Complete |
| SURV-01 | Phase 14 | Complete |
| SURV-02 | Phase 15 | Complete |
| SURV-03 | Phase 15 | Complete (Rank Math deferred) |
| SURV-04 | Phase 15 | Complete |
| SURV-05 | Phase 15 | Complete |
| SURV-06 | Phase 15 | Complete |
| DELV-01 | Phase 16 | Complete |
| DELV-02 | Phase 16 | Complete |

**Coverage:** 11/11 requirements satisfied, 0 unmapped, 0 orphaned. ✓

---
*Requirements defined: 2026-06-22*
*Archived: 2026-06-29 on R1 milestone completion*
