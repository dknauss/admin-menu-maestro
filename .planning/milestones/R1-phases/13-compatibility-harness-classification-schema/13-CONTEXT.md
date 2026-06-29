# Phase 13: Compatibility Harness + Classification Schema - Context

**Gathered:** 2026-06-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the R1 research infrastructure that must exist **before any survey is authored**:

1. **HARN-01** — a committed, reproducible wp-env variant that boots WordPress with all six locked survey plugins (WooCommerce, Jetpack, Yoast SEO, Elementor free, WPForms, LifterLMS free) alongside Maestro, at pinned + recorded versions, from a single documented command. The root `.wp-env.json` (`plugins: []`, Maestro alone) is left untouched.
2. **HARN-02** — the harness provisions an admin plus lower-privilege users so each plugin's menu can be observed and Maestro's per-role hide behavior checked.
3. **SCHM-01** — a committed classification-schema template (6 manipulation dimensions × rename/reorder/hide/re-icon × safe/degraded/broken) that every later survey fills in, committed before any SURV-xx file.

This is research/test scaffolding only — **no production menu-handling code** is committed (the R1 milestone boundary). Discussion below clarifies HOW; the survey set, priority order, and research-only track are fixed by ROADMAP.md / REQUIREMENTS.md / Phase 10 CONTEXT.

</domain>

<decisions>
## Implementation Decisions

### Version pinning (HARN-01)
- Pin each plugin via **versioned `downloads.wordpress.org` ZIP URLs** in the wp-env config (e.g. `https://downloads.wordpress.org/plugin/woocommerce.<ver>.zip`) — the version is literally in the config, exact and self-documenting.
- **Also** keep a committed `VERSIONS.md` record: a table of plugin, pinned version, pin date, and source URL — the human-readable, survey-friendly changelog. (Belt-and-suspenders: exact config + readable record.)
- Pin each plugin to its **latest stable release as of the harness build date** (recorded in VERSIONS.md) — surveys reflect what users actually run today, appropriate for a fresh research pass.
- **SEO plugin: Yoast SEO** (SURV-03 names "Yoast SEO / Rank Math"; only one is required — Yoast chosen for its higher install base and well-known submenu + count-badge behavior). Rank Math not loaded.

### Harness mechanism (HARN-01)
- wp-env always reads `.wp-env.json` from the current directory and has **no built-in "use a different file" flag**, so the compat harness is a **self-contained subdirectory variant**: a `.wp-env.json` under e.g. `tests/compat/` listing the six ZIP plugins, with Maestro mapped in via a relative path (`../..`). Invoked with a documented `cd tests/compat && npx wp-env start`. Root env stays pristine and the two can run side-by-side.
- **WordPress core: pin to `WordPress/WordPress#7.0`** to match the root env (consistent with where Maestro is tested).
- **Distinct ports** (e.g. 8890/8891) so the compat env can run alongside the root env (8888/8889) without collision.
- **Maestro loaded by source mapping** (relative `../..`), same as the root env — edits reflect immediately, no build step.

### User provisioning (HARN-02)
- Provision **Editor + Shop Manager** as the lower-privilege users (plus the default admin). Editor is the generic always-present baseline; Shop Manager is WooCommerce's own role and exercises Woo's role-specific menu items, directly useful to SURV-01.
- Create them via the compat env's **`lifecycleScripts.afterStart`** so a single `wp-env start` provisions everything (self-contained; confirmable by `wp user list`).
- **Ordering note for the planner:** the `shop_manager` role only exists once WooCommerce is active. `afterStart` runs after wp-env installs/activates plugins, so the role should exist by then — but the plan must confirm Woo is active before the `wp user create … --role=shop_manager` step (guard or ordering), or the role assignment will fail. The existing `tests/e2e/global-setup.ts` get-or-create idempotent pattern is a good reference.

### Schema document (SCHM-01)
- Lives in a **shared, milestone-level location: `.planning/compat/SCHEMA.md`** (not inside any one phase dir) so all six survey phases (14–15) and the Phase 16 synthesis point at one stable path.
- **Template + per-plugin copies:** `SCHEMA.md` defines the canonical format; each survey copies it into its own filled-in file (e.g. `.planning/compat/SURV-01-woocommerce.md`). Keeps the template pristine and makes Phase 16 synthesis mechanical across uniform files.
- **Per-survey structure (three parts, matching REQUIREMENTS verbatim):**
  1. A **checklist of the 6 manipulation dimensions** — custom positions, conditional/late injection, re-registered menus, count badges baked into titles, custom separators, direct `$menu`/`$submenu` surgery — each with a notes field.
  2. A **Markdown matrix table** — rows = affected menu items, columns = rename / reorder / hide / re-icon, cells = safe / degraded / broken + observable evidence.
  3. A **classified-fix list** — each issue classified as slug-resolution tweak / later `admin_menu` re-hook / special-casing / documented limitation.
- The template must be committed **before any SURV-xx file is authored** (success criterion 4).

### Claude's Discretion
- Exact subdirectory name/path for the harness (`tests/compat/` is the working assumption) and exact port numbers.
- Exact filename/heading conventions inside `SCHEMA.md` and the per-plugin copies, as long as the three-part structure and the dimensions/ops/classifications above are present.
- Whether `VERSIONS.md` lives next to the harness config (`tests/compat/`) or in `.planning/compat/` — planner's call.
- How to verify the harness boots (e.g. an `npm run` convenience script vs. documented raw commands) and whether to add a documented `wp plugin list` / `wp user list` confirmation step.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`tests/e2e/global-setup.ts`** — get-or-create idempotent user provisioning via `wp-env run tests-cli wp user create … --role=editor`. Direct model for the compat env's `afterStart` user provisioning (and the Shop-Manager ordering guard).
- **`playground/blueprint.json`** — provisions editor/author/contributor/subscriber via `wp-cli` steps and activates Maestro; a working reference for multi-role provisioning syntax.
- **Root `.wp-env.json`** — `core: WordPress/WordPress#7.0`, `mappings: { "wp-content/plugins/maestro-menu-editor": "." }`, `config: { WP_DEBUG, SCRIPT_DEBUG }`. The compat variant mirrors this shape with `../..` mappings, a populated `plugins` array, distinct ports, and `lifecycleScripts`.
- **`package.json` scripts** — existing `env:start`/`env:stop`/`env:clean` and the `WP_ENV_TESTS_PORT` override precedent (Key Decisions: screenshots run on port 8899 to dodge collisions). A `compat:*` script family can follow the same naming.

### Established Patterns
- wp-env `^11.8.1` (supports `lifecycleScripts`). WP pinned to `#7.0`.
- Port-collision avoidance is already an accepted project pattern (`WP_ENV_TESTS_PORT`, screenshots on 8899) — distinct compat ports are consistent with it.
- Research/planning artifacts live under `.planning/`; `.planning/compat/` is a new sibling to `.planning/phases/`.

### Integration Points
- New: `tests/compat/.wp-env.json` (+ optional `VERSIONS.md`) — the committed harness.
- New: `.planning/compat/SCHEMA.md` — the committed schema template consumed by Phases 14–16.
- Optional new `package.json` scripts for starting/stopping the compat env.

</code_context>

<specifics>
## Specific Ideas

- The ROADMAP's example command `WP_ENV_JSON=.wp-env.compat.json npx wp-env start` is illustrative only — wp-env has no such flag. The agreed mechanism is the `tests/compat/` subdirectory variant invoked via `cd`; the documented command in deliverables should reflect that reality, not the literal example.
- Surveys must be "mechanical" to synthesize (DELV-01) — that is the reason for the pristine-template + uniform per-plugin-copy structure.

</specifics>

<deferred>
## Deferred Ideas

- **Rank Math survey** — only Yoast is loaded; a Rank Math pass could be added in a later research round if SURV-03 findings warrant it (REQUIREMENTS already scopes SURV-03 to one).
- **LifterLMS-specific role user** (e.g. `lms_manager`) — not provisioned in Phase 13; can be added when SURV-06 (Phase 15) runs if its menu items are role-gated.
- Actual production compatibility fixes (FIX-xx) — out of scope for all of R1 by milestone boundary.

</deferred>

---

*Phase: 13-compatibility-harness-classification-schema*
*Context gathered: 2026-06-23*
