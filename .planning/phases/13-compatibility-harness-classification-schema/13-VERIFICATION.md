---
phase: 13-compatibility-harness-classification-schema
verified: 2026-06-26T15:28:26Z
status: human_needed
score: 2/4 must-haves verified; 2/4 require Docker/wp-env boot evidence
human_verification:
  - test: "Boot compatibility harness and inspect active plugins"
    expected: "`npm run compat:start` succeeds, then `cd tests/compat && npx wp-env run cli wp plugin list --status=active --field=name` shows maestro-menu-editor plus woocommerce, jetpack, wordpress-seo, elementor, wpforms-lite/wpforms, and lifterlms active; Rank Math absent."
    why_human: "Docker daemon is unavailable in this session, and the environment is not initialized, so running wp-env acceptance commands is blocked."
  - test: "Inspect provisioned compatibility users"
    expected: "`cd tests/compat && npx wp-env run cli wp user list --fields=user_login,roles` shows admin/administrator plus compat_editor/editor and compat_shop_manager/shop_manager."
    why_human: "User creation happens in wp-env lifecycleScripts.afterStart and requires a running Docker/wp-env environment."
---

# Phase 13: Compatibility Harness + Classification Schema Verification Report

**Phase Goal:** Compatibility Harness + Classification Schema for R1 third-party compatibility research — a committed, reproducible multi-plugin test environment and a consistent survey template exist before survey work begins.
**Verified:** 2026-06-26T15:28:26Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

Phase 13 is structurally implemented: the compatibility harness files, pinned version ledger, npm wrappers, and schema template all exist and are substantively wired. However, HARN-01 and HARN-02 explicitly require confirmation from a running wp-env environment (`wp plugin list` and `wp user list`). Docker is unavailable in this session, so those acceptance outputs cannot be verified from artifacts alone.

### Observable Truths

| # | Truth | Status | Evidence |
| --- | --- | --- | --- |
| 1 | A single documented command boots WordPress with all six survey plugins loaded at recorded pinned versions, confirmed by `wp plugin list`. | ? HUMAN NEEDED | `package.json` has `compat:start: cd tests/compat && npx wp-env start`; `tests/compat/.wp-env.json` lists six pinned plugin ZIPs and maps Maestro. Docker check failed: `failed to connect to the docker API...`; wp-env command failed: `Environment not initialized. Run wp-env start first.` |
| 2 | The harness provisions admin plus lower-privilege role users, confirmed by `wp user list`. | ? HUMAN NEEDED | `lifecycleScripts.afterStart` creates `compat_editor` and guarded `compat_shop_manager`; default wp-env admin is expected. Actual `wp user list` requires booted Docker/wp-env. |
| 3 | A committed schema document defines all six manipulation dimensions and rename/reorder/hide/re-icon × safe/degraded/broken matrix. | ✓ VERIFIED | `.planning/compat/SCHEMA.md` exists, is 79 lines, includes all six dimensions, all four operations, and safe/degraded/broken definitions/table cells. Plan automated Node schema check passed. |
| 4 | The schema template exists before any `SURV-xx` file is authored. | ✓ VERIFIED | `.planning/compat/SCHEMA.md` exists at the milestone path; `find .planning/compat -maxdepth 1 -name 'SURV-*'` returned no survey files. |

**Score:** 2/4 truths verified automatically; 2/4 require human/Docker verification.

### Required Artifacts

| Artifact | Expected | Status | Details |
| --- | --- | --- | --- |
| `tests/compat/.wp-env.json` | Self-contained compat wp-env variant with six versioned ZIP plugins, Maestro mapped via `../..`, ports `8890/8891`, and afterStart provisioning. | ✓ VERIFIED structurally | Contains core `WordPress/WordPress#7.0`, six `downloads.wordpress.org` plugin ZIPs, mapping to `../..`, distinct ports, debug config, and lifecycle script. Note: compact JSON is 23 lines vs plan's `min_lines: 25`, but content is substantive and passed semantic checks. |
| `tests/compat/VERSIONS.md` | Human-readable pin record for all six plugins with versions, pin date, and source URLs. | ✓ VERIFIED | Includes WooCommerce, Jetpack, Yoast SEO/`wordpress-seo`, Elementor, WPForms Lite, and LifterLMS with 2026-06-26 pins and exact ZIP URLs. Each URL returned HTTP 200. |
| `package.json` | `compat:start` / `compat:stop` convenience scripts. | ✓ VERIFIED | Scripts cd into `tests/compat` before invoking `npx wp-env start/stop`. Root `env:*` scripts remain present. |
| `.planning/compat/SCHEMA.md` | Canonical schema template with six-dimension checklist, operation matrix, classified-fix list, and SURV copy instruction. | ✓ VERIFIED | Exists at stable milestone path, passes plan automated schema check, and no `SURV-*` files exist. |
| Root `.wp-env.json` | Remains pristine with `plugins: []` and Maestro mapping `"."`. | ✓ VERIFIED | File still has `plugins: []`, mapping `wp-content/plugins/maestro-menu-editor: "."`, and no compat ports/plugins. |

### Key Link Verification

| From | To | Via | Status | Details |
| --- | --- | --- | --- | --- |
| `tests/compat/.wp-env.json` | WordPress.org plugin ZIPs | Versioned `downloads.wordpress.org/plugin/SLUG.VERSION.zip` URLs in `plugins` array | ✓ WIRED | Six URLs present; HEAD checks returned HTTP 200 for all six. |
| `tests/compat/.wp-env.json` | Maestro source | Mapping `wp-content/plugins/maestro-menu-editor` to `../..` | ✓ WIRED | Mapping is exactly `../..`, relative to `tests/compat`. |
| `lifecycleScripts.afterStart` | Editor and Shop Manager users | `wp user get`/`wp user create`; `wp role exists shop_manager` guard | ✓ WIRED structurally / ? runtime | Script is idempotent and guarded; runtime user creation still requires boot verification. |
| `package.json` | Compat harness | `compat:start` and `compat:stop` cd into `tests/compat` | ✓ WIRED | Scripts invoke `npx wp-env start/stop` from the compat directory. |
| `.planning/compat/SCHEMA.md` | Future Phase 14-16 surveys | Copy-to-`.planning/compat/SURV-NN-<plugin>.md` instruction | ✓ WIRED | Template explicitly instructs copying to SURV files and remaining pristine. |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| --- | --- | --- | --- | --- |
| HARN-01 | `13-01-PLAN.md` | A committed, reproducible wp-env configuration loads all six survey plugins alongside Maestro from a single documented command; versions are pinned and recorded. | ? NEEDS HUMAN | Configuration, pinned ledger, scripts, and valid ZIP URLs are present. Actual `wp plugin list` in a running environment is not available because Docker is unavailable. |
| HARN-02 | `13-01-PLAN.md` | Harness provisions admin plus at least one lower-privilege role/user for menu observation and per-role hide checks. | ? NEEDS HUMAN | `afterStart` provisions Editor and Shop Manager with role guard; actual `wp user list` output requires booted wp-env. |
| SCHM-01 | `13-02-PLAN.md` | Classification schema is committed before any survey, with six dimensions and safe/degraded/broken matrix for rename/reorder/hide/re-icon. | ✓ SATISFIED | `.planning/compat/SCHEMA.md` contains required dimensions, operations, classifications, and fix categories; no `SURV-*` files exist. |

No orphaned Phase 13 requirements were found beyond HARN-01, HARN-02, and SCHM-01.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| --- | --- | --- | --- | --- |
| `.planning/compat/SCHEMA.md` | 9-13, 20-30, 46, 67 | `TODO` placeholders | ℹ️ Info | Expected for a pristine survey template; not a blocker. |

No blocker anti-patterns were found in the harness config, version ledger, package scripts, or schema.

### Human Verification Required

### 1. Boot compatibility harness and inspect active plugins

**Test:** Start Docker Desktop, then run `npm run compat:start`; after boot, run `cd tests/compat && npx wp-env run cli wp plugin list --status=active --field=name`.
**Expected:** Output includes `maestro-menu-editor`, `woocommerce`, `jetpack`, `wordpress-seo`, `elementor`, `wpforms-lite` or `wpforms`, and `lifterlms`; Rank Math is absent.
**Why human:** Docker daemon is unavailable here, and wp-env is not initialized.

### 2. Inspect provisioned users

**Test:** In the booted compat env, run `cd tests/compat && npx wp-env run cli wp user list --fields=user_login,roles`.
**Expected:** Output includes `admin` with administrator role, `compat_editor` with editor role, and `compat_shop_manager` with shop_manager role.
**Why human:** User provisioning occurs in `lifecycleScripts.afterStart`, which only runs during wp-env startup in Docker.

### Gaps Summary

No code/artifact gaps were found. The remaining blocker to a fully passed verification is runtime evidence from Docker/wp-env acceptance commands for HARN-01 and HARN-02. Per the phase prompt, verification is therefore `human_needed`, not `passed`.

---

_Verified: 2026-06-26T15:28:26Z_
_Verifier: Claude (gsd-verifier)_
