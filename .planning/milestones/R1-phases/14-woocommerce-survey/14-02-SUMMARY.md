---
phase: 14-woocommerce-survey
plan: 02
subsystem: testing
tags: [woocommerce, compat-survey, wp-env, admin-menu, wp-cli, menu_order, custom_menu_order, classification]

# Dependency graph
requires:
  - phase: 14-woocommerce-survey (Plan 01)
    provides: SURV-01 Part 1 + Method header + natural-state baselines + affected-item inventory + dump-menu.php
provides:
  - "SURV-01-woocommerce.md Part 2: full classification matrix (34 rows — top-level + all submenus + injected items) with rename/reorder/hide/re-icon each classified safe/degraded/broken, observable evidence, persistence, and timing cause per cell"
  - "Per-role Hide classification (admin / compat_editor / compat_shop_manager) with cosmetic-vs-access (loads-200 vs WP-cap-403) grounded in runtime caps"
  - "Top-level Reorder classified from EFFECTIVE rendered order via new reorder-probe.php (custom_menu_order + menu_order pipeline)"
  - "Interaction Scenarios sub-section (3 op-combinations) + promote-to-SCHEMA recommendation"
  - "Surfaced-issue list (degraded patterns) seeding Plan 03's Part 3 classified-fix mapping"
  - "Two new schema-change candidates (entity-encoded slug matching; loads-vs-403 Hide convention)"
affects: [14-03 (Part 3 classified fixes + SCHEMA.md finalization), 15 (SURV-02..06 reuse the matrix template + reorder-probe), 16 (DELV-02 prioritized backlog)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Effective-order probe (reorder-probe.php): reproduce render-time custom_menu_order+menu_order pipeline at admin_menu, exit before priv-filter — the canonical way to classify top-level reorder"
    - "Config-driven op application + re-dump + reset-between-cases to avoid cross-case contamination"
    - "Cross-cutting findings (F1-F5) stated once, referenced per-cell, to keep a 34-row matrix mechanical"

key-files:
  created:
    - .planning/compat/SURV-01-assets/reorder-probe.php
  modified:
    - .planning/compat/SURV-01-woocommerce.md

key-decisions:
  - "Top-level Reorder is degraded (not broken): item order is honored and persists, but WC's own menu_order filter (prio 10, runs after Maestro at same prio) re-clusters separator-woocommerce against the woocommerce item — cosmetic separator override only"
  - "Hide is always degraded (never broken): cosmetic per-role unset() that never strips a capability; the page LOADS by direct URL. Any 403 is WP's own cap gate, not Maestro"
  - "Submenu re-icon is N/A (no-op): replay only writes icon to top-level $menu[pos][6]; classified N/A leaning degraded for matrix mechanicality"
  - "Hide-parent does NOT cascade to children: parent $menu row is unset() but $submenu children remain fully populated — subtree is cosmetically orphaned, pages still reachable by URL (S1 finding)"
  - "Recommend promoting the 3-probe Interaction Scenarios template into SCHEMA.md (Plan 14-03) — plugin-agnostic, S1 surfaced what the single-op matrix could not"

patterns-established:
  - "reorder-probe.php is the reusable top-level-reorder classifier for SURV-02..06"
  - "F-numbered cross-cutting findings referenced by matrix cells keep exhaustive matrices readable"

requirements-completed: [SURV-01]

# Metrics
duration: 40min
completed: 2026-06-28
---

# Phase 14 Plan 02: WooCommerce Classification Matrix Summary

**Full Part 2 matrix — 34 affected-item rows, each of rename/reorder/hide/re-icon classified safe/degraded/broken from runtime $menu/$submenu dumps, with per-role Hide (cosmetic vs loads-200/cap-403), top-level reorder read from the effective render-time menu_order pipeline, and a 3-scenario interaction sub-section. No broken cells surfaced; the recurring degraded patterns are badge-loss-on-rename and WooCommerce's separator re-clustering.**

## Performance

- **Duration:** ~40 min
- **Started:** 2026-06-28T18:52:00Z (approx)
- **Completed:** 2026-06-28T19:30:00Z (approx)
- **Tasks:** 2/2
- **Files modified:** 2 (SURV-01 survey edited; reorder-probe.php created)

## Accomplishments
- Filled Part 2 with one matrix row per affected WooCommerce item (top-level WooCommerce + separator + Payments + Analytics + Marketing; all 9 WooCommerce submenus; 11 Analytics reports; 2 Marketing submenus; 9 Products-injected submenus) — 34 data rows total.
- Classified all four Maestro ops per row with observable runtime evidence, per-cell persistence, and timing cause for every degraded cell (Woo late injection / Woo render-time `menu_order` filter vs. Maestro `PHP_INT_MAX` replay).
- Established and committed `reorder-probe.php` to classify top-level Reorder from the EFFECTIVE rendered order — resolving the top-level-reorder exception correctly rather than from the raw post-replay global.
- Characterized the key collision: `Maestro\Replay::reorder_top` and `WC_Admin_Menus::menu_order` both hook `menu_order` at priority 10; Maestro runs first, WC re-clusters its separator after — item order honored, separator slot overridden (degraded, cosmetic).
- Observed Hide per-role across admin/editor/shop_manager with the cosmetic-vs-access distinction grounded in actual caps (shop_manager Orders/Settings LOAD by URL while hidden).
- Added a 3-scenario Interaction Scenarios sub-section, including the non-obvious finding that hide-parent does not cascade-remove children.

## Task Commits

1. **Task 1: Classify rename/reorder/re-icon for every affected item** - `972cdfb` (docs)
2. **Task 2: Classify Hide per-role + Interaction Scenarios sub-section** - `2ae175e` (docs)

**Plan metadata:** (final docs commit — this SUMMARY + STATE + ROADMAP)

## Files Created/Modified
- `.planning/compat/SURV-01-woocommerce.md` - Part 2 matrix (34 rows, 4 ops each), cross-cutting findings F1-F5, Interaction Scenarios sub-section, updated schema-change scratch list.
- `.planning/compat/SURV-01-assets/reorder-probe.php` - Effective top-level-order probe (custom_menu_order + menu_order pipeline at admin_menu, exits before priv-filter). Reusable for SURV-02..06.

## Surfaced Issues (for Plan 03 Part 3 classified-fix mapping)
All **degraded**; no **broken** cell surfaced.

1. **Badge-in-title loss on rename (F1)** — affected ops: Rename. Items: Payments (`wcpay-menu-badge`), Extensions (`update-plugins count`), Home in fresh state (`remaining-tasks-badge`), Orders (processing-count when >0). Cause: `Replay::replay()` overwrites `$menu/$submenu[..][0]` wholesale. → likely **documented limitation** or **special-casing**.
2. **`separator-woocommerce` re-clustering on top-level reorder (F4)** — affected ops: Reorder. WC's `menu_order` filter re-anchors its separator to the `woocommerce` item after Maestro reorders. Item order itself is preserved. → likely **documented limitation** (cosmetic) or **later admin_menu re-hook** consideration.
3. **Entity-encoded Products-taxonomy slugs** — affected ops: Rename, Hide, Reorder. Slugs render as `...&amp;post_type=product`; overrides only land if the stored slug matches the encoded form. → likely **slug-resolution tweak**.
4. **Submenu re-icon N/A (F2)** — affected ops: Re-icon. Icon write is top-level only. → **documented limitation**.

## Decisions Made
- See frontmatter `key-decisions`. The central judgment calls: top-level Reorder = degraded (item order honored, separator overridden); Hide = always degraded (cosmetic, never strips a cap); submenu re-icon = N/A; hide-parent does not cascade to children.
- Recommend promoting the Interaction Scenarios 3-probe template into SCHEMA.md in Plan 14-03.

## Deviations from Plan
None - plan executed exactly as written. No deviation rules triggered (documentation/survey plan, no production code). One small reusable asset (`reorder-probe.php`) was authored to execute the plan's own top-level-reorder-exception instruction correctly — within the planned "classify from effective rendered order" scope, not unplanned work.

## Issues Encountered
- **`wp eval` with `require wp-admin/menu.php` fatals under CLI.** The full menu.php runs core's per-user privilege filtering at the bottom, which `wp_die()`s in CLI (the same reason dump-menu.php exits early). Resolved by hooking the order-pipeline inside an `admin_menu` callback and `exit`ing before the filter section — codified as `reorder-probe.php`.
- **Onboarding-profile toggle is not cleanly reversible for the Home badge.** Marking `woocommerce_onboarding_profile` completed advanced the OnboardingTasks data-store state; after deleting the option the live Home `remaining-tasks-badge` did not return (now naturally absent, matching completed-setup). This is a harness side effect, not a Maestro behavior, and does not affect any classification (rename-Home is degraded-when-badge-present / safe-when-absent, both documented). The 14-01 baseline files remain the authoritative fresh-state reference.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- **Harness state:** left **RUNNING** (`http://localhost:8890`); `maestro_config` and `woocommerce_onboarding_profile` both deleted (clean natural state). Stop with `npm run compat:stop` if the session ends before Plan 14-03. Note: docker socket access in this environment requires running commands sandbox-disabled (Unix-socket permission); the `/sandbox` command can adjust this.
- **Plan 03 (Part 3 + SCHEMA finalize):** has the surfaced-issue list above (4 degraded patterns, 0 broken) ready to map to the four R1 fix categories, plus six schema-change candidates in the scratch list — including the recommendation to promote the Interaction Scenarios template and add the slug-encoding / loads-vs-403 conventions. SCHEMA.md remains pristine.
- **Phase 15:** `reorder-probe.php` joins `dump-menu.php` as the reusable cross-survey toolset; the F1-F5 + matrix shape is the proven template.

## Self-Check: PASSED

All 3 files verified present on disk (SURV-01-woocommerce.md, reorder-probe.php, 14-02-SUMMARY.md); both task commits (`972cdfb`, `2ae175e`) verified in git history.

---
*Phase: 14-woocommerce-survey*
*Completed: 2026-06-28*
