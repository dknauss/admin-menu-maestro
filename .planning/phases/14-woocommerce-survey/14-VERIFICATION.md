---
phase: 14-woocommerce-survey
verified: 2026-06-28T20:05:00Z
status: passed
score: 4/4 success criteria verified
re_verification:
  performed: false
  note: "Initial verification — no prior 14-VERIFICATION.md existed."
---

# Phase 14: WooCommerce Survey Verification Report

**Phase Goal:** WooCommerce's menu-manipulation behavior is fully characterized using the Phase 13 schema, and the schema is refined against the hardest test case before the remaining five surveys run.
**Verified:** 2026-06-28T20:05:00Z
**Status:** passed
**Re-verification:** No — initial verification.

> **Framing note.** This is a DOCUMENTATION/SURVEY phase under the R1 research-only milestone. The
> deliverable is the `SURV-01-woocommerce.md` survey + finalized `SCHEMA.md` — NOT code. Fixes are
> *classified*, never implemented. "No tests / no TDD / no VALIDATION.md / no production code" are the
> CORRECT state for this deliverable and are not gaps. Verification judges whether the GOAL is
> substantively achieved: is WooCommerce's menu behavior fully + credibly characterized, is every
> Maestro op classified with observable evidence, does every issue have a classified fix, and is the
> schema finalized before Phase 15?

## Goal Achievement

### Observable Truths (the 4 Phase 14 success criteria)

| # | Truth (success criterion) | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Survey covers HOW WooCommerce registers/manipulates the menu across all 6 manipulation dimensions | ✓ VERIFIED | Part 1 checks all six dimensions, each with a WooCommerce source citation AND a runtime baseline row. Spot-checked against `baseline-admin-fresh.txt`: `55.5 woocommerce` (custom position), `100 separator-woocommerce` (custom separator), Payments `wcpay-menu-badge awaiting-mod count-1` and Home `remaining-tasks-badge count-6` (count-badges-in-title), dual classic `WC_Admin_Menus` + React `wc-admin` paths (re-registered menus), priorities 9/20/50/60/70 (conditional/late injection), direct `$menu[] =` separator push + `unset($submenu['woocommerce'][0])` (direct global surgery). |
| 2 | Every Maestro op (rename/reorder/hide/re-icon) against WooCommerce items is classified safe/degraded/broken with observable evidence | ✓ VERIFIED | Part 2 matrix has exactly **34 data rows** (`grep -c "^\| \`"` = 34: 5 top-level + 29 submenu) — one per affected item. All four ops classified per row with persistence + timing cause. Per-role Hide (admin/editor/shop_manager) with loads-vs-403 distinction. Top-level Reorder classified from **effective rendered order** via `reorder-probe.php` (reproduces the `custom_menu_order` + `menu_order` pipeline), NOT the raw post-replay global — confirmed by reading the probe script. Both setup states (fresh + completed) surveyed. |
| 3 | Every identified issue has a classified fix (one of the 4 R1 categories) | ✓ VERIFIED | Part 3 maps I1–I6 to exactly one category each (5 documented-limitation + 1 slug-resolution-tweak); 0 broken cells. Interaction findings S2/S3 explicitly folded into I1/I2. No orphans: each degraded pattern (F1/F2/F3/F4 + slug-encoding + S1) traces to one fix row. |
| 4 | SCHM-01 template gaps surfaced by WooCommerce resolved; schema committed in final form before Phase 15 | ✓ VERIFIED | `SCHEMA.md` carries a "## Schema changes (Phase 14)" changelog with 6 additive refinements + promoted Interaction Scenarios section; each change tied to a WooCommerce-surfaced reason. SURV-01 reconciled to the final shape (scratch list consumed). ROADMAP marks Phase 14 complete; Phase 15 (`depends_on: Phase 14`) is still pending, so finalization precedes Phase 15. |

**Score:** 4/4 success criteria verified.

### Required Artifacts

| Artifact | Expected | Status | Details |
| --- | --- | --- | --- |
| `.planning/compat/SURV-01-woocommerce.md` | Filled survey: Parts 1/2/3 + Method + traceability + completion check | ✓ VERIFIED | All sections present; 34-row matrix; no TODO/PLACEHOLDER leftovers from template (clean grep). Completion check fully ticked with per-box justification. |
| `.planning/compat/SCHEMA.md` | Finalized template w/ Phase 14 changelog | ✓ VERIFIED | Carries "Schema changes (Phase 14)" changelog (6 additive changes), promoted Interaction Scenarios section, per-cell conventions, `[state]` marker, slug-encoding + loads-vs-403 notes. In final form for Phase 15. |
| `.planning/compat/SURV-01-assets/dump-menu.php` | Reproducible PHP_INT_MAX dump script | ✓ VERIFIED | Substantive (2.5KB). Hooks `admin_menu @ PHP_INT_MAX` (matches Maestro Replay priority — confirmed against `includes/class-replay.php:56`), documents the mandatory `WP_ADMIN` `--exec`, exits before priv-filter. |
| `.planning/compat/SURV-01-assets/reorder-probe.php` | Effective top-level-order classifier | ✓ VERIFIED | Substantive. Genuinely reproduces the render-time `custom_menu_order` + `menu_order` pipeline — substantiates the top-level-reorder methodology and F4. |
| `SURV-01-assets/baseline-{admin-fresh,admin-completed,editor-fresh,shop_manager-fresh}.txt` | Natural-state runtime baselines | ✓ VERIFIED | Real runtime dumps (20KB+ each). Setup-state dependence proven: `remaining-tasks-badge` present in fresh (1) / absent in completed (0). Per-role variance proven: `coupons-moved` present for admin (1) / absent for shop_manager (0). |

### Key Link Verification

| From | To | Via | Status | Details |
| --- | --- | --- | --- | --- |
| SURV-01 front fields | `tests/compat/VERSIONS.md` | Pinned version `10.9.1` | ✓ WIRED | `10.9.1` cited in front fields + Method header. |
| Matrix cells | Runtime `$menu`/`$submenu` evidence | Config-driven op via `maestro_config` + re-dump vs. baseline | ✓ WIRED | Evidence Notes section cites concrete observed phrases; baseline `.txt` rows match survey claims verbatim (badge spans, fractional positions, per-role gating). |
| Top-level Reorder cells | Effective rendered order | `reorder-probe.php` `custom_menu_order`+`menu_order` pipeline | ✓ WIRED | Probe script confirmed to apply the filter pipeline, not read the raw global — exactly per the critical framing. |
| Part 3 fix rows | Part 2 surfaced issues | Each issue → one R1 category, indexed by F1–F5/S1 | ✓ WIRED | I1–I6 + S2/S3-folded; no orphans. |
| SURV-01 | SCHEMA.md final shape | Reconciled after batched refinement | ✓ WIRED | Scratch list consumed; SURV-01 carries the final conventions (per-cell timing, `[state]`, per-role Hide, Interaction Scenarios). |
| F1/F2/F3/F4 claims | `includes/class-replay.php` | Cited source line behavior | ✓ WIRED | Verified against the engine: title overwrite `$menu[$pos][0]` (F1), icon `$menu[$pos][6]` top-level-only (F2), cosmetic `unset()` with "page still loads by direct URL" comment (F3), `custom_menu_order`+`menu_order` filters (F4). Citations are accurate, not invented. |

### Requirements Coverage

| Requirement | Source Plan(s) | Description | Status | Evidence |
| --- | --- | --- | --- | --- |
| SURV-01 | 14-01, 14-02, 14-03 | WooCommerce surveyed and documented (heaviest manipulator; own top-level + submenus) | ✓ SATISFIED | Entire SURV-01 file: HOW (Part 1) + classification (Part 2) + classified fixes (Part 3). REQUIREMENTS.md marks SURV-01 `[x]` Complete, mapped to Phase 14. No orphaned requirements — SURV-01 is the only ID for this phase and is declared in all three plans. |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| --- | --- | --- | --- | --- |
| — | — | None | — | No TODO/PLACEHOLDER/"coming soon" leftovers in SURV-01 or SCHEMA.md. The template's TODO scaffolding was fully replaced. |

### Substance Spot-Checks (per critical framing)

- **Classifications are evidence-grounded, not bare assertions.** ✓ Survey cites runtime dumps and rendered order; baseline `.txt` files independently confirm the cited rows (badge spans, `55.5`, per-role gating).
- **Top-level reorder classified from EFFECTIVE rendered order.** ✓ `reorder-probe.php` applies the `custom_menu_order`/`menu_order` pipeline; F4 and the Method header explicitly disclaim the raw post-replay global. Engine confirms `Replay::replay()` does not apply top-level order in the `admin_menu` pass.
- **Hide assessed per-role with loads-vs-403.** ✓ F3 + every Hide cell distinguish cosmetic `unset()` (page LOADS 200) from WP's own cap-403; grounded in actual caps (shop_manager Orders/Settings LOAD by URL while hidden).
- **Coverage is genuinely full.** ✓ 34 rows = one per affected item; both setup states; homogeneous siblings (11 Analytics, Products taxonomy) each get a row while noted as identical-behaving.
- **Interaction scenarios add real signal.** ✓ S1 (non-cascading parent-hide) is a finding the single-op matrix could not surface and was promoted to SCHEMA.md.

### Human Verification Required

None required for goal sign-off. The survey is internally consistent and externally corroborated by the committed baseline dumps and the actual replay-engine source. (Optional, non-blocking: a future surveyor re-running the harness could re-derive any cell via the documented Method header — the reproducibility contract is in place for Phase 15.)

### Gaps Summary

No gaps. All four Phase 14 success criteria are substantively TRUE, SURV-01 is fully covered and
marked complete in REQUIREMENTS.md, the schema is finalized with a documented changelog ahead of
Phase 15, and the R1 research-only boundary held (fixes classified, never implemented; no production
menu-handling code touched). Evidence is credible: the survey's claims are independently confirmed by
the committed runtime baselines and by the cited `includes/class-replay.php` behavior. The
top-level-reorder methodology correctly uses effective rendered order via `reorder-probe.php`, hide is
per-role with loads-vs-403, and coverage is exhaustive across both setup states.

Minor, non-blocking observations (not gaps): the Orders processing-count badge (F1) is documented from
source rather than a live non-zero count (the fresh harness has zero processing orders — correctly
disclosed); and the onboarding-profile toggle proved not cleanly reversible for the live Home badge (a
harness side effect, correctly noted, with the 14-01 fresh baseline retained as authoritative). Neither
affects any classification.

---

_Verified: 2026-06-28T20:05:00Z_
_Verifier: Claude (gsd-verifier)_
