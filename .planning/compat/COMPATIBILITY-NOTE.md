# Admin Menu Maestro — R1 Compatibility Note (DELV-01)

**Purpose:** Consolidates the six completed per-plugin compatibility surveys (SURV-01 through SURV-06)
into a single authoritative note under the [SCHM-01 schema vocabulary](SCHEMA.md) (`safe` /
`degraded` / `broken`; the four R1 fix categories). This is a research-only, documentation-only
artifact (R1 boundary held — no production code committed, no fixes implemented).

**Date:** 2026-06-29

**Surveys consolidated:** [WooCommerce](SURV-01-woocommerce.md) · [Jetpack](SURV-02-jetpack.md) ·
[Yoast SEO](SURV-03-yoast-seo.md) · [Elementor](SURV-04-elementor.md) ·
[WPForms](SURV-05-wpforms.md) · [LifterLMS](SURV-06-lifterlms.md)

**Schema reference:** [SCHEMA.md](SCHEMA.md) defines the classification vocabulary
(`safe` / `degraded` / `broken`) and the four R1 fix categories (slug-resolution tweak,
later `admin_menu` re-hook, special-casing, documented limitation).

**Ranked backlog:** A ranked backlog of COMPAT-xx items (DELV-02) follows this note in Plan 16-02.

---

## Headline Finding

> **Across all six surveys and every survey's classification matrix, zero broken cells were
> observed.** Maestro's sparse-delta replay never broke any plugin's menu structure or
> user access. Every surfaced issue is `degraded` (cosmetic/recoverable) or a
> `documented limitation` / `slug-resolution tweak`.

Maestro's hide is a cosmetic per-role `unset()` that never strips a capability: a hidden page
still **LOADS (200)** by direct URL for any role that holds the page cap. Any 403 a user encounters
is WordPress's own render-time capability gate, not Maestro. This means "hide" is never an
access-control break — confirmed across all six plugins.

---

## Summary Matrix

Worst-case classification per plugin per Maestro operation. Each cell carries the worst
classification across all affected items for that plugin × operation, with a 3–6 word
evidence tag. All cells are populated; no plugin row is missing.

| Plugin (version) | Survey | Rename | Reorder | Hide | Re-icon |
|---|---|---|---|---|---|
| [WooCommerce](SURV-01-woocommerce.md) (10.9.1) | SURV-01 | **degraded** — badge-in-title lost | **degraded** — separator re-cluster | **degraded** — cosmetic per-role unset | safe (top-level) / N/A (submenu) |
| [Jetpack](SURV-02-jetpack.md) (15.9.1) | SURV-02 | **safe** — no badge in title | **safe** — no filter conflict | **degraded** — cosmetic, admin-only | safe (top-level) / N/A (submenu) |
| [Yoast SEO](SURV-03-yoast-seo.md) (27.9) | SURV-03 | **degraded** — badge + upsell HTML lost | **safe** — no reorder filter | **degraded** — cosmetic per-role unset | safe (top-level) / N/A (submenu) |
| [Elementor](SURV-04-elementor.md) (4.1.4) | SURV-04 | **degraded** — dynamic upsell HTML lost | **safe** — no active separator | **degraded** — cosmetic per-role unset | safe (top-level) / N/A (submenu) |
| [WPForms Lite](SURV-05-wpforms.md) (1.10.2.1) | SURV-05 | **degraded** — NEW! badge + color-span lost | **safe** — no filter conflict | **degraded** — cosmetic, admin-only | safe (top-level) / N/A (submenu) |
| [LifterLMS](SURV-06-lifterlms.md) (10.0.8) | SURV-06 | **safe** — no baked-in badges | **degraded** — separator de-group + submenu_order() override | **degraded** — cosmetic per-role unset | safe (top-level) / N/A (submenu) |

**Legend:**
- **safe** — operation works as expected, persists, no side effects.
- **degraded** — operation partially works or works with caveats / cosmetic loss (recoverable).
- **broken** — operation fails, reverts, or breaks the plugin's menu or user access. **(0 broken cells observed across all six surveys.)**
- Re-icon on submenu rows is always **N/A** (WordPress submenu rows have no icon index slot); the
  cell carries "N/A (submenu)" so no cell is left ambiguous.

---

## Per-Plugin Findings

### [WooCommerce](SURV-01-woocommerce.md) — version 10.9.1

**Manipulation dimensions exhibited (all six):** custom positions, conditional/late injection,
re-registered menus, count badges baked into titles, custom separator, direct `$menu`/`$submenu`
global surgery.

**Distinguishing behavior:** The heaviest admin-menu manipulator in the set. WooCommerce's own
`menu_order` filter (priority 10, runs after Maestro's `reorder_top` at the same priority)
re-clusters `separator-woocommerce` against the `woocommerce` item after every top-level reorder.
Maestro's requested item order is honored; only the separator slot is overridden.

**Operation summary (matrix row):**
- Rename: **degraded** — badge-in-title loss (Payments `wcpay-menu-badge`, Home `remaining-tasks-badge`, Orders `processing-count`); wholesale title overwrite drops embedded badge span (F1 in SURV-01).
- Reorder: **degraded** — item order honored and persists; WC's `menu_order` filter re-clusters `separator-woocommerce` adjacent to `woocommerce` after replay (F4 in SURV-01).
- Hide: **degraded** — cosmetic per-role `unset()`; hidden pages still LOAD (200) by direct URL; never strips a capability (F3 in SURV-01).
- Re-icon: **safe** (top-level) — dashicon swap persists; **N/A** (submenu) — no icon index slot.

---

### [Jetpack](SURV-02-jetpack.md) — version 15.9.1

**Manipulation dimensions exhibited (three):** custom menu positions, direct `$menu`/`$submenu`
surgery (hidden empty-parent pages), and WP_ADMIN-gated registration (required for dump).

**Distinguishing behavior:** The Settings submenu slug is an **absolute URL** containing the
installation's hostname (`http://localhost:8890/wp-admin/admin.php?page=jetpack#/settings`).
This slug is environment-specific — a config generated on one host will not resolve on another.
Classified as a slug-resolution tweak (SURV-02 I2). In disconnected state, Jetpack is
admin-only (`jetpack_admin_page` cap not granted to editor or shop_manager), so Hide is a moot
no-op for non-admin roles.

**Operation summary (matrix row):**
- Rename: **safe** — no badge in title; rename persists cleanly.
- Reorder: **safe** — Jetpack hooks neither `custom_menu_order` nor `menu_order`; no separator re-clustering caveat.
- Hide: **degraded** — cosmetic for admin (page LOADS); moot for editor/shop_manager (WP cap-gates away entirely in disconnected state).
- Re-icon: **safe** (top-level) — SVG → dashicon swap persists; **N/A** (submenu).

---

### [Yoast SEO](SURV-03-yoast-seo.md) — version 27.9

**Manipulation dimensions exhibited (four):** custom menu positions, re-registered menus (dual-slug
role-conditional registration), count badges baked into titles, direct `$menu`/`$submenu` surgery
(hidden-parent Search Console page).

**Distinguishing behavior:** Yoast registers **two different top-level slugs** depending on whether
the current user holds `wpseo_manage_options`: `wpseo_dashboard` (admin) and `wpseo_page_academy`
(editor/shop_manager). These are independent registrations with different slugs. An override keyed
on `wpseo_dashboard` does not apply to the editor's `wpseo_page_academy` view and vice versa —
consistent cross-role customization requires two separate Maestro overrides.

**Operation summary (matrix row):**
- Rename: **degraded** — both top-level items embed a notification badge span (`update-plugins count-0`) that is lost on rename; upsell submenus (Workouts, Redirects, Upgrade, AI Brand Insights) carry additional HTML decoration also lost on rename.
- Reorder: **safe** — Yoast hooks neither `custom_menu_order` nor `menu_order`; no separator conflict.
- Hide: **degraded** — cosmetic per-role; hidden pages still LOAD (200) by URL.
- Re-icon: **safe** (top-level) — SVG → dashicon swap persists; **N/A** (submenu).

---

### [Elementor](SURV-04-elementor.md) — version 4.1.4

**Manipulation dimensions exhibited (all six):** custom menu positions, conditional/late injection
(multiple `admin_menu` priorities including 10003–10005), re-registered menus (dual-path `elementor`
slug, absolute-URL slug, entity-encoded `&amp;` slugs), dynamic HTML in titles, custom separator
(removed before `PHP_INT_MAX` replay), direct `$menu`/`$submenu` global surgery.

**Distinguishing behavior:** Elementor registers **three top-level menus** but hides two via
`admin_head` CSS (`#toplevel_page_elementor`, `#menu-posts-elementor_library`) — only `elementor-home`
is visible in the sidebar. The "Website Templates" submenu slug is a full absolute URL with hostname,
plugin version (`ver=4.1.4`), and fragment — environment- and version-specific (slug-resolution tweak,
SURV-04 I1). The "Categories" slug is entity-encoded with `&amp;` (SURV-04 I2). Maestro operations
land correctly in replay state for all three tops; the CSS hide by Elementor is a separate,
independent visual layer.

**Operation summary (matrix row):**
- Rename: **degraded** — the "Upgrade" upsell submenu under `elementor-home` has a dynamically injected "Sale!" HTML title that is lost on rename; all other items rename safely.
- Reorder: **safe** — top-level reorder works for all three Elementor tops; no active separator at `PHP_INT_MAX` (separator-elementor is removed before replay); no `custom_menu_order` / `menu_order` conflict from Elementor itself.
- Hide: **degraded** — cosmetic per-role; hidden pages still LOAD (200) by URL.
- Re-icon: **safe** (top-level) — dashicon swap persists on all three tops; **N/A** (submenu).

---

### [WPForms Lite](SURV-05-wpforms.md) — version 1.10.2.1

**Manipulation dimensions exhibited (three):** custom menu positions (pos 58.9), count badges baked
into titles, absolute-URL submenu slug.

**Distinguishing behavior:** WPForms uses `manage_options` for every item — editor and shop_manager
see no WPForms surface at all (WP cap-gates it away entirely), and WPForms conditionally skips
submenu registration for non-`manage_options` users. The "Upgrade to Pro" submenu slug is an
**absolute external URL** (`https://wpforms.com/lite-upgrade/?utm_campaign=...`) — stable across
installations but exact UTM parameter matching is required (slug-resolution tweak, SURV-05 I4).

**Operation summary (matrix row):**
- Rename: **degraded** — "Payments" title embeds a `NEW!` badge span (`wpforms-menu-new`) lost on rename; "Addons" title is an orange color-span wrapper (`color:#f18500`) also lost on rename.
- Reorder: **safe** — WPForms hooks neither `custom_menu_order` nor `menu_order`; top-level and submenu reorder work cleanly.
- Hide: **degraded** — cosmetic for admin (pages LOAD); moot for editor/shop_manager (WP cap-gates away entirely; `manage_options` unmet for both non-admin roles).
- Re-icon: **safe** (top-level) — SVG → dashicon swap persists; **N/A** (submenu).

---

### [LifterLMS](SURV-06-lifterlms.md) — version 10.0.8

**Manipulation dimensions exhibited (five):** custom menu positions (pos 51), conditional/late
injection (submenu at priority 7777, `submenu_order()` via `custom_menu_order`), re-registered menus
(entity-encoded `&amp;` taxonomy slugs), custom separator (`llms-separator`), direct `$menu`/`$submenu`
surgery (separator injection + `submenu_order()` rewrite). No count badges baked into titles.

**Distinguishing behavior:** LifterLMS's `submenu_order()` method hooks `custom_menu_order` and
rewrites `$submenu['lifterlms']` at render time, after Maestro's `admin_menu @ PHP_INT_MAX` replay.
This means Maestro's `sub_order` for the `lifterlms` parent applies in replay state but is
overridden at render — the rendered sidebar shows LifterLMS's priority order, not Maestro's. Unlike
WooCommerce's `separator-woocommerce`, the `llms-separator` does **not** re-cluster when `lifterlms`
is moved: LifterLMS has no `menu_order` filter, so the separator stays at its fixed absolute position
(`$menu[51]`) while `lifterlms` moves. Courses and Memberships taxonomy submenus use entity-encoded
`&amp;` slugs requiring exact encoding match for overrides to land.

**Operation summary (matrix row):**
- Rename: **safe** — LifterLMS bakes no count badges into titles; all items rename cleanly (taxonomy slugs require `&amp;`-encoded key to land, per slug-resolution convention; the rename itself succeeds when the key is correct).
- Reorder: **degraded** — top-level: separator de-grouping (`llms-separator` stays at pos 51 when `lifterlms` is moved); submenu: LifterLMS's `submenu_order()` overrides Maestro's `sub_order` at render for the `lifterlms` parent.
- Hide: **degraded** — cosmetic per-role; `lifterlms` top-level visible to editor/shop_manager (cap `read` held); all lifterlms submenus are WP cap-gated away for those roles (no `manage_lifterlms`).
- Re-icon: **safe** (top-level) — dashicon swap persists on all CPT tops; **N/A** (submenu).

---

## Cross-Plugin Root-Cause Analysis

This section inverts the matrix — for each Maestro operation, which plugins show degraded behavior
and what recurring root causes span them. This is the conceptual bridge to the DELV-02 ranked
backlog: the cross-plugin patterns that will become COMPAT-xx backlog items.

### Rename → Badge / HTML-in-Title Loss

**Affected plugins:** WooCommerce, Yoast SEO, Elementor, WPForms Lite

**Root cause:** Maestro's `Replay::replay()` sets `$menu[pos][0]` (or `$submenu[parent][pos][0]`)
to the override `title` string wholesale (`class-replay.php:98,131`). Any HTML embedded in the
original title — count badges, upsell badges, color spans, notification counts — is overwritten
and lost. This is inherent to the title overwrite mechanism.

| Plugin | Title markup lost | Recoverable? |
|---|---|---|
| WooCommerce | `wcpay-menu-badge`, `remaining-tasks-badge`, `processing-count` spans | Yes — remove override to restore |
| Yoast SEO | `update-plugins count-0` notification span + upsell badge/HTML spans | Yes |
| Elementor | "Sale!" HTML injection in `elementor-one-upgrade` title (conditional, sale events) | Yes |
| WPForms Lite | `wpforms-menu-new` NEW! badge span; `color:#f18500` Addons span | Yes |

**Fix category:** documented limitation — wholesale title overwrite is the correct, safe behavior
for a menu rename; badge preservation would require per-plugin special-casing.

---

### Rename / Reorder / Hide → Slug-Resolution Issues

**Affected plugins:** Jetpack, Elementor, WPForms Lite, WooCommerce, LifterLMS, Yoast SEO

Several patterns require exact slug matching that is not straightforward:

| Pattern | Plugins | Items | Fix category |
|---|---|---|---|
| **Absolute URL — environment-specific** (hostname changes per install) | Jetpack | Settings submenu | slug-resolution tweak |
| **Absolute URL — version-specific** (hostname + `ver=` param) | Elementor | Website Templates submenu | slug-resolution tweak |
| **Absolute URL — external UTM params** (stable hostname, exact UTM required) | WPForms Lite | Upgrade to Pro submenu | slug-resolution tweak |
| **Entity-encoded `&amp;` slugs** (exact encoding required for match to land) | WooCommerce, Elementor, LifterLMS | Taxonomy submenus (Products, Categories, Course taxonomies) | slug-resolution tweak |
| **Dual-slug role-conditional registration** (different slug per role tier) | Yoast SEO | `wpseo_dashboard` (admin) / `wpseo_page_academy` (editor/shop_manager) | documented limitation |
| **Shared slug (parent + first submenu)** (override lands on both simultaneously) | WooCommerce, Yoast SEO, LifterLMS | CPT anchor submenus | documented limitation |

---

### Reorder → Render-Time Filter Override

**Affected plugins:** WooCommerce, LifterLMS (top-level reorder); LifterLMS (submenu reorder)

| Plugin | Filter / mechanism | Effect | Fix category |
|---|---|---|---|
| WooCommerce | `menu_order` filter (priority 10, re-runs after Maestro's `reorder_top`) | `separator-woocommerce` re-clustered adjacent to `woocommerce` after every reorder; requested item order honored | documented limitation |
| LifterLMS | No `menu_order` filter — `llms-separator` uses absolute `$menu[51]` position | Separator stays at pos 51 when `lifterlms` moves; visual de-grouping (cosmetic) | documented limitation |
| LifterLMS | `submenu_order()` hooks `custom_menu_order`; rewrites `$submenu['lifterlms']` at render | Maestro's `sub_order` for `lifterlms` parent applies in replay state but rendered order reflects LifterLMS's priority order | documented limitation (or later admin_menu re-hook if targeted) |

---

### Hide → Cosmetic-Only / Non-Cascading / Moot-For-Capped-Roles

**Affected plugins:** All six

Hide is `degraded` across all six plugins in the same way — never broken:

1. **Cosmetic unset:** Maestro's `is_hidden_for_current_user()` only removes the row from the
   replay state (`$menu`/`$submenu` `unset()`); the page cap is untouched.
2. **Page still LOADS:** Any role that holds the page cap can still reach the hidden page by
   direct URL — the page loads with a 200 response.
3. **Non-cascading parent-hide:** Hiding a parent top-level item leaves `$submenu[parent]`
   fully populated; child pages remain reachable by direct URL.
4. **Moot for cap-gated roles:** Where WordPress's own render-time cap gate already removes an
   item for a role, Maestro's hide is a no-op — the item was never in that role's sidebar.
   Examples: Jetpack (admin-only in disconnected state); WPForms (manage_options, editor/shop_manager
   never see it); WooCommerce submenu items requiring `manage_woocommerce` for editor.

---

### Re-icon → Submenu No-Op

**Affected plugins:** All six

`Replay::replay()` writes the icon only to `$menu[pos][6]` (`class-replay.php:101`). Submenu rows
have no icon index. Applying `{"icon":...}` to a submenu slug is a silent no-op across all six
plugins. All top-level re-icon operations are **safe** — the dashicon class string replaces the SVG
at the icon slot and persists.

**Fix category:** documented limitation — submenu rows carry no icon slot in WordPress's menu model;
this is a design boundary, not a bug.

---

## DELV-01 Traceability

| Requirement / success criterion | Where satisfied in this note |
|---|---|
| **DELV-01** — Compatibility note presents all six findings under one SCHM-01 schema | This entire file: summary matrix + per-plugin sections + cross-cut analysis |
| ROADMAP Phase 16 SC-1: six findings under one schema | Summary Matrix (all six plugins × four operations, all cells populated) |
| ROADMAP Phase 16 SC-1: 0 broken cells | Headline Finding + "Net for Part 3" coverages in each SURV-NN (all confirmed) |
| ROADMAP Phase 16 SC-1: summary matrix per operation per plugin | Summary Matrix table above |
| SURV-01 → SURV-06 source traceability | Per-plugin sections each link to their source survey file |
| SCHM-01 schema vocabulary used throughout | safe/degraded/broken + four R1 fix categories used in matrix, per-plugin sections, and cross-cut |
| No SURV-NN or SCHEMA.md modified | Confirmed — only COMPATIBILITY-NOTE.md was created |
| Seed for DELV-02 ranked backlog | Cross-Plugin Root-Cause Analysis section identifies recurring patterns without assigning COMPAT-xx IDs |

---

## Self-Consistency Verification

This note was checked against each source survey's Part 2 matrix and "Net for Part 3" summary.
Findings:

**WooCommerce (SURV-01):** Summary matrix row matches SURV-01 Part 2 cross-cutting findings:
rename = degraded (F1 badge loss); reorder = degraded (F4 separator re-cluster); hide = degraded
(F3 cosmetic); re-icon = safe/N/A (F2). **Consistent.**

**Jetpack (SURV-02):** Summary matrix row matches SURV-02 Part 2: rename = safe (no badge);
reorder = safe (no filter conflict — effective order honors Maestro's placement); hide = degraded
(F3 cosmetic, F1 moot for non-admin in disconnected state); re-icon = safe/N/A (F2). **Consistent.**

**Yoast SEO (SURV-03):** Summary matrix row matches SURV-03 Part 2: rename = degraded (F1 badge +
F2 upsell HTML); reorder = safe (no Yoast `custom_menu_order`/`menu_order` filter); hide = degraded
(F4 cosmetic); re-icon = safe/N/A (F3). **Consistent.**

**Elementor (SURV-04):** Summary matrix row matches SURV-04 Part 2: rename = degraded (Upgrade
submenu I3 — dynamic HTML injection lost; only that row is degraded; worst-case = degraded);
reorder = safe (no active separator at PHP_INT_MAX; all three tops reorder correctly); hide = degraded
(F2 cosmetic); re-icon = safe/N/A (F1). **Consistent.**

**WPForms (SURV-05):** Summary matrix row matches SURV-05 Part 2: rename = degraded (F4a NEW!
badge on Payments; F4b color-span on Addons); reorder = safe (WPForms hooks no `custom_menu_order`
/ `menu_order`); hide = degraded (F3 cosmetic, F1 moot for editor/shop_manager); re-icon = safe/N/A
(F2). **Consistent.**

**LifterLMS (SURV-06):** Summary matrix row matches SURV-06 Part 2: rename = safe (no baked-in
badges; taxonomy slug-resolution is a documented limitation not a degraded classification when the
correct slug form is used; the source survey classifies all rename cells as `safe` with F5 noted);
reorder = degraded (F4 separator de-grouping + F6 `submenu_order()` override); hide = degraded (F2
cosmetic); re-icon = safe/N/A (F1). **Consistent.** Note: the plan's `synthesis_inputs` listed
rename = degraded for LifterLMS (citing entity-encoded taxonomy slugs), but the source survey
classifies taxonomy rename cells as `safe` when the `&amp;`-encoded slug form is used — the
slug-resolution issue is a documented limitation (I3), not a classification of the rename operation
itself. The source survey governs; this note follows the survey.

**0-broken verification:** Each survey's "Net for Part 3" summary explicitly states "No broken cells
across [N] matrix rows." This note's 0-broken headline claim is confirmed by all six sources.
