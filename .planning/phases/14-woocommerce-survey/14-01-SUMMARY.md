---
phase: 14-woocommerce-survey
plan: 01
subsystem: testing
tags: [woocommerce, compat-survey, wp-env, admin-menu, wp-cli, schema]

# Dependency graph
requires:
  - phase: 13-compatibility-harness-classification-schema
    provides: compat wp-env harness (WooCommerce 10.9.1 + Maestro), SCHEMA.md template, VERSIONS.md
provides:
  - "SURV-01-woocommerce.md with front fields, reproducible Method header, and complete Part 1 (all six manipulation dimensions classified)"
  - "Reusable $menu/$submenu dump script (dump-menu.php) that observes the menu at PHP_INT_MAX exactly as Maestro's Replay sees it"
  - "Natural-state (pre-override) baselines for admin (fresh + completed-setup), editor, and shop_manager"
  - "Affected-item inventory seeding the Plan 02 classification matrix"
  - "Schema-change candidates scratch list for Plan 03's batched SCHEMA.md refinement"
affects: [14-02 (Part 2 matrix), 14-03 (classified fixes + SCHEMA.md finalization), 15 (SURV-02..06 reuse the Method procedure)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "PHP_INT_MAX admin_menu dump (mirrors Replay priority) + exit before includes/menu.php priv-filtering wp_die"
    - "WP_ADMIN forced via --exec so WooCommerce classic WC_Admin_Menus instantiates under WP-CLI"
    - "Config-driven op application via maestro_config sparse-diff option; natural baseline via option delete"

key-files:
  created:
    - .planning/compat/SURV-01-woocommerce.md
    - .planning/compat/SURV-01-assets/dump-menu.php
    - .planning/compat/SURV-01-assets/baseline-admin-fresh.txt
    - .planning/compat/SURV-01-assets/baseline-admin-completed.txt
    - .planning/compat/SURV-01-assets/baseline-editor-fresh.txt
    - .planning/compat/SURV-01-assets/baseline-shop_manager-fresh.txt
  modified: []

key-decisions:
  - "Dump method hooks admin_menu @ PHP_INT_MAX and exits before WP priv-filtering, matching exactly what Maestro's Replay observes"
  - "WP_ADMIN must be force-defined via --exec or WC_Admin_Menus never loads and the dump is silently incomplete (no top-level WooCommerce item)"
  - "Reuse the harness's three provisioned roles for per-role dumps because Maestro Hide is per-role"
  - "Both setup states captured by toggling woocommerce_onboarding_profile; difference is the Home remaining-tasks badge"

patterns-established:
  - "Per-plugin survey assets live in a sibling SURV-NN-assets/ folder; survey doc embeds only revealing slices"
  - "Method header doubles as the cross-survey reproducibility contract for Phase 15"

requirements-completed: [SURV-01]

# Metrics
duration: 50min
completed: 2026-06-28
---

# Phase 14 Plan 01: WooCommerce Survey — HOW + Natural Baseline Summary

**Source-grounded + runtime-confirmed Part 1 of the WooCommerce survey: all six menu-manipulation dimensions characterized (fractional positions 55.5/56/57/58, dual classic+React registration paths, three count-badges-in-title, a custom separator, and direct `$menu`/`$submenu` surgery), with a reproducible WP-CLI dump method and natural-state baselines for three roles across two setup states.**

## Performance

- **Duration:** ~50 min
- **Started:** 2026-06-28T18:31:18Z
- **Completed:** 2026-06-28T19:21:00Z (approx)
- **Tasks:** 2/2
- **Files modified:** 6 created (survey + dump script + 4 baselines)

## Accomplishments
- Booted the Phase 13 compat harness and confirmed readiness (WooCommerce 10.9.1 + Maestro active; admin/editor/shop_manager present).
- Created `SURV-01-woocommerce.md` from the pristine `SCHEMA.md`, filled front fields (10.9.1) and a fully reproducible Method header (boot, dump command, config-driven op path, three-role + two-setup-state procedure, verbatim rubric, success-criterion traceability).
- Built a reusable `dump-menu.php` that observes `$menu`/`$submenu` at `PHP_INT_MAX` — the same priority as Maestro's `Replay::replay()` — and captured natural-state baselines for admin (fresh + completed-setup), editor, and shop_manager.
- Filled Part 1: every one of the six locked dimensions checked with observable-evidence Notes citing both WooCommerce source and the runtime baseline, plus embedded revealing slices and an affected-item inventory for Plan 02.

## Task Commits

1. **Task 1: Boot harness, survey skeleton, Method header** - `b67392e` (docs)
2. **Task 2: Characterize HOW (Part 1) + natural-state baseline** - `714f527` (docs)

**Plan metadata:** (see final docs commit)

## Files Created/Modified
- `.planning/compat/SURV-01-woocommerce.md` - Survey copy: front fields, Method header, complete Part 1, inventory, schema-change scratch list.
- `.planning/compat/SURV-01-assets/dump-menu.php` - Reproducible PHP_INT_MAX dump script (documents the mandatory WP_ADMIN `--exec`).
- `.planning/compat/SURV-01-assets/baseline-admin-fresh.txt` - Natural-state full dump, admin, fresh-activated (32 top-level items).
- `.planning/compat/SURV-01-assets/baseline-admin-completed.txt` - Same, completed-setup (Home badge absent).
- `.planning/compat/SURV-01-assets/baseline-editor-fresh.txt` - editor role (woocommerce submenu cap-gated empty).
- `.planning/compat/SURV-01-assets/baseline-shop_manager-fresh.txt` - shop_manager role (no `coupons-moved`).

## Decisions Made
- **PHP_INT_MAX dump + early exit:** observing the globals at Maestro's own replay priority and exiting before `wp-admin/includes/menu.php` privilege-filtering (which `wp_die()`s under WP-CLI) yields exactly the state Maestro mutates — the most faithful baseline.
- **Force `WP_ADMIN` via `--exec`:** without it `is_admin()` is false and WooCommerce's classic `WC_Admin_Menus` never instantiates, so the top-level `woocommerce` item, separator, and several submenus are silently missing. Documented prominently in both the dump script and Method header so Phase 15 cannot repeat the mistake.
- **Setup-state toggle via `woocommerce_onboarding_profile`:** the modern `task_list_complete`/`task_list_hidden` options are managed by the OnboardingTasks data store and reject direct `option update`; setting the onboarding profile completed is the reliable, reversible lever. The observable difference is the Home submenu's `remaining-tasks-badge`.

## Deviations from Plan
None - plan executed exactly as written. (No deviation rules triggered; this is a documentation/survey plan with no production code. The two investigative findings below were within the planned "discover HOW" scope, not unplanned fixes.)

## Issues Encountered
- **Incomplete first dumps (resolved).** Initial `wp eval`/`do_action('admin_menu')` dumps showed only ~4 plugin items, then 24 with a `global` scope fix, but the top-level `woocommerce` item, separator, and key submenus were still missing. Root-caused to `is_admin()` being false in WP-CLI, which prevents `WC_Admin_Menus` from instantiating. Resolved by force-defining `WP_ADMIN` via `--exec="define('WP_ADMIN', true);"`, yielding the full, render-faithful 32-item menu. This is now a documented requirement of the dump method — a useful finding in its own right for cross-survey reliability.
- **`do_action('admin_menu')` alone is insufficient.** Core menus come from `wp-admin/menu.php`; the script `require`s it (after binding `global $menu, $submenu`) and dumps inside a `PHP_INT_MAX` hook, then exits before the priv-filter fatal.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- **Harness state:** left **running** (`http://localhost:8890`) so Plan 14-02 avoids a second cold boot. `maestro_config` deleted and `woocommerce_onboarding_profile` reset to fresh-activated default, so Plan 02 starts from the documented natural baseline. Stop with `npm run compat:stop` if the session ends before Plan 02.
- **Plan 02 (Part 2 matrix):** has the affected-item inventory, the dump command, and the config-driven op-application path ready; classification becomes "after Maestro replay vs. these baselines." Remember the top-level Reorder exception (classify from effective rendered order / `menu_order` filter, not the raw post-replay global).
- **Plan 03 (SCHEMA finalize):** four schema-change candidates collected in the survey's scratch list.

## Self-Check: PASSED

All 7 created files verified present on disk; both task commits (`b67392e`, `714f527`) verified in git history.

---
*Phase: 14-woocommerce-survey*
*Completed: 2026-06-28*
