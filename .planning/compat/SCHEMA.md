# R1 Compatibility Classification Schema

This is the canonical R1 classification schema for Admin Menu Maestro third-party compatibility surveys.

Every survey **copies this pristine template** to `.planning/compat/SURV-NN-<plugin>.md` (for example, `.planning/compat/SURV-01-woocommerce.md`) and fills in the copy. Do not fill in this source template directly. This template is committed before any SURV-xx survey file is authored to satisfy SCHM-01 / Phase 13 success criterion 4.

## Survey Front Fields

- **Plugin:** TODO
- **Slug:** TODO
- **Pinned version:** TODO — copy from `tests/compat/VERSIONS.md`
- **Date surveyed:** TODO
- **Surveyor:** TODO

## Part 1 — Manipulation-Dimensions Checklist

Check each locked manipulation dimension the plugin exhibits and record concise evidence in `Notes:`.

- [ ] **Custom menu positions** — explicit `$position` in `add_menu_page`, unusually high positions, or fractional positions that affect where the top-level item lands.
  - **Notes:** TODO
- [ ] **Conditional / late injection** — menus added on later hooks, conditionally, or after the default `admin_menu` priority so Maestro may observe or replay them at a different time.
  - **Notes:** TODO
- [ ] **Re-registered menus** — menu removed then re-added, or slug re-registered, causing the same intended item to appear through more than one registration path. Note any **entity-encoded slugs** here: items whose rendered `$row[2]` slug contains `&amp;` (e.g. `edit-tags.php?taxonomy=...&amp;post_type=...`) — Maestro matches overrides by exact slug, so an override only lands if the stored slug matches the rendered (encoded) form. Flag these for a Part 3 **slug-resolution tweak**.
  - **Notes:** TODO
- [ ] **Count badges baked into titles** — an awaiting-mod / update bubble span or similar count badge is embedded inside the menu title string. Standard handling: a rename overwrites the title index wholesale, so any baked-in badge span is **lost on rename** → classify that cell **degraded** (cosmetic, recoverable) and cross-reference this dimension.
  - **Notes:** TODO
- [ ] **Custom separators** — custom `add_menu_page` separators or direct `$menu` separator rows that affect ordering or visible grouping.
  - **Notes:** TODO
- [ ] **Direct `$menu` / `$submenu` global surgery** — plugin writes to the `$menu` / `$submenu` globals rather than using the WordPress menu API.
  - **Notes:** TODO

## Part 2 — Classification Matrix

Use one row per affected menu item, including both top-level items and submenus. Add as many rows as needed. Each operation cell must contain one classification (`safe`, `degraded`, or `broken`) plus a short observable-evidence note.

### Classification Definitions

- **safe** — operation works as expected, persists, no side effects.
- **degraded** — operation partially works or works with caveats / cosmetic loss (e.g. count badge lost on rename).
- **broken** — operation fails, reverts, or breaks the plugin's menu/access.

### Per-cell evidence conventions

Each operation cell's evidence note follows these conventions so Phase 16 synthesis is mechanical:

- **Persistence:** state whether the result survives a reload. Shorthand `persists` = override survives a reload; note explicitly if it reverts.
- **Timing cause (degraded/broken only):** name whether the caveat comes from the plugin's late/conditional `admin_menu` injection or its own render-time `menu_order` filter, vs. Maestro's `PHP_INT_MAX` replay ordering. (Top-level Reorder is classified from the **effective rendered order** — the `custom_menu_order` + `menu_order` pipeline — not the raw post-replay `$menu` global.)
- **State-dependence marker `[state]`:** tag a cell `[state]` when the item or its behavior is setup-state, feature-flag, or role dependent (e.g. a badge present only before onboarding completes, a menu present only while a feature is off, an item present only for roles with a given cap). Record both behaviors where they diverge.
- **Hide is per-role + cosmetic-vs-access:** classify Hide per observed role and state **loads-vs-403** explicitly — whether the hidden page still **LOADS (200)** by direct URL (Maestro's hide is a cosmetic `unset()` that never strips a capability) or **403s** because the role lacks the page cap (that 403 is WordPress's own cap gate, not Maestro). Use the `admin / editor / shop_manager`-style per-role sub-cells in the Hide column.
- **Dumps are Maestro REPLAY STATE, not the rendered sidebar:** a `$menu`/`$submenu` dump taken at the replay priority (before `wp-admin/includes/menu.php` runs) captures the post-replay globals Maestro mutates, NOT what a given role actually sees — it still contains rows WP will cap-gate away at render. Per-role Hide evidence must therefore come from a **separate rendered / post-cap-filter check** (evaluate `current_user_can()` per row, or load the sidebar as that user), and each Hide sub-cell is the composition **{Maestro's cosmetic `unset()` on replay state} + {WP's independent render-time cap gate}**. Where WP already cap-gates a row away for a role, Maestro's hide is a **moot no-op** for that role — say so, rather than reading "row present in dump" as "visible to role".
- **N/A cells:** where an op genuinely does not apply (e.g. submenu re-icon — submenu rows have no icon index; separator rename/hide — separators are skipped by Maestro), mark **N/A** with the closest column classification and name the reason, so the matrix stays full-coverage and mechanical.

### Maestro Operation Matrix

Legend: classification is **safe** / **degraded** / **broken** per the rubric; **[state]** = behavior is setup/feature/role-dependent (see conventions above); Hide cells are per-role with loads-vs-403 noted. All cells should state persistence; degraded/broken cells should name the timing cause.

| Menu item | Level | Slug / parent slug | Rename | Reorder | Hide (per role) | Re-icon |
| --- | --- | --- | --- | --- | --- | --- |
| `TODO: affected item label` | `top-level` or `submenu` | `TODO` | `safe/degraded/broken` — TODO observable evidence + persists? | `safe/degraded/broken` — TODO (effective rendered order) + persists? | `safe/degraded/broken` per role — TODO + loads-vs-403 | `safe/degraded/broken` — TODO (N/A on submenu) |
| **Illustrative example only:** `Example Plugin` | `top-level` | `example-plugin` | `safe` — rename persists across reload and the menu link still opens | `degraded` — reorder persists initially but shifts below a custom separator after plugin reinjection (render-time `menu_order`) | `safe` — hidden for editor; page still LOADS (200) by URL; admin keeps seeing it | `broken` — custom icon is replaced by plugin on next `admin_menu` pass |

### Evidence Notes

- Prefer observable evidence over inferred intent, such as: "rename persists across reload", "reorder reverts on next `admin_menu` pass", "count badge lost on rename", "page LOADS (200) by URL while hidden", or "custom icon restored after reload".
- If a cell is not applicable, still choose the closest classification and explain why in the evidence note so Phase 16 synthesis remains mechanical.
- For exhaustive matrices, state recurring **cross-cutting findings** once (e.g. as numbered `F1…Fn`) and reference them per cell, so a large matrix stays readable without repeating the same evidence in every row.

## Interaction Scenarios (optional)

Beyond the per-op matrix, apply a few deliberate **op-combinations** in a single Maestro config payload and classify each the same way (safe / degraded / broken + observable evidence + persistence + timing cause). This probes whether degraded patterns *compound* — the question the single-op matrix cannot answer. Reset config after each scenario. This section is **optional** but recommended for any plugin with a parent/child menu or a custom separator; it was promoted from SURV-01 (Phase 14) after the hide-parent probe surfaced a finding the single-op matrix could not.

Three canonical, plugin-agnostic probes:

| # | Scenario | What it probes |
| --- | --- | --- |
| S1 | **Hide-parent-with-visible-children** — hide a top-level item from a role that still holds the child page caps | Whether parent-hide cascades to children (does the subtree get orphaned cosmetically, or does access break?). |
| S2 | **Rename + reorder the same item together** | Whether a title-mutation degradation (e.g. badge loss) and a reorder caveat compound or stay independent. |
| S3 | **Re-icon + reorder across a custom separator** | Whether moving a re-iconed item across the plugin's own separator introduces a new failure mode beyond the single-op separator caveat. |

| # | Scenario | Payload (shape) | Observed result | Classification |
| --- | --- | --- | --- | --- |
| S1 | Hide-parent-with-visible-children | `{"items":{"<parent>":{"hidden_roles":["<role>"]}}}` | TODO | `safe/degraded/broken` |
| S2 | Rename + reorder together | `{"items":{"<slug>":{"title":"..."}},"top_order":["<slug>", ...]}` | TODO | `safe/degraded/broken` |
| S3 | Re-icon + reorder across separator | `{"items":{"<slug>":{"icon":"dashicons-..."}},"top_order":["<slug>", ...]}` | TODO | `safe/degraded/broken` |

## Part 3 — Classified-Fix List

Every surfaced issue from the matrix gets one classified fix using exactly one R1 category. These entries feed DELV-02's prioritized backlog in Phase 16.

Allowed R1 fix categories:

1. **slug-resolution tweak**
2. **later `admin_menu` re-hook** (later admin_menu re-hook)
3. **special-casing**
4. **documented limitation**

| Issue summary | Affected operation(s) | Chosen classification | One-line rationale |
| --- | --- | --- | --- |
| TODO: summarize the surfaced issue | Rename / Reorder / Hide / Re-icon | slug-resolution tweak / later `admin_menu` re-hook (later admin_menu re-hook) / special-casing / documented limitation | TODO: explain why this category is the right R1 classification |

## Survey Completion Check

- [ ] All six manipulation dimensions above are checked or left unchecked with `Notes:` evidence.
- [ ] Every affected top-level menu item has a matrix row.
- [ ] Every affected submenu has a matrix row.
- [ ] Every Rename cell is classified `safe`, `degraded`, or `broken` with evidence.
- [ ] Every Reorder cell is classified `safe`, `degraded`, or `broken` with evidence.
- [ ] Every Hide cell is classified `safe`, `degraded`, or `broken` with evidence.
- [ ] Every Re-icon cell is classified `safe`, `degraded`, or `broken` with evidence.
- [ ] Every issue has exactly one classified fix: slug-resolution tweak, later `admin_menu` re-hook (later admin_menu re-hook), special-casing, or documented limitation.
- [ ] The filled survey copy remains under `.planning/compat/SURV-NN-<plugin>.md`; this `SCHEMA.md` template remains pristine **until the Phase 14 batched refinement** (see changelog below — after Phase 14 the template carries the refinements made and is in final form for Phase 15).

## Schema changes (Phase 14)

This template was intentionally refined **once**, at the end of Phase 14, after the WooCommerce survey (SURV-01) stress-tested it as the heaviest admin-menu manipulator in the locked set. Per `14-CONTEXT.md`, schema changes were collected while surveying and applied **batched** here, then the SURV-01 copy was reconciled to the resulting shape. WooCommerce is the only survey to reconcile, so restructuring was low-cost. After this point the template is in **final form for Phase 15** (SURV-02..06 inherit it unchanged).

All changes were **additive / clarifying** — no existing dimension, column, or rubric value was removed or repurposed, so SURV-01's structure remains a faithful instance and Phase 16 synthesis stays mechanical.

| # | Change | Section | Reason (what WooCommerce surfaced) |
| --- | --- | --- | --- |
| 1 | Added a **"Per-cell evidence conventions"** block (persistence shorthand + degraded/broken timing-cause requirement). | Part 2 | `14-CONTEXT` requires per-cell persistence + timing-cause notes; WooCommerce's late-injection-vs-`PHP_INT_MAX`-replay timing was the core risk, so a standard convention makes it mechanical across SURV-02..06. |
| 2 | Added the **`[state]` state-dependence marker** convention (setup/feature/role-dependent cells). | Part 2 | WooCommerce items appear only in certain states (Home badge before onboarding completes; Marketing only while `navigation` off; `coupons-moved` only for roles with `manage_options`); a marker makes the matrix self-documenting. |
| 3 | Added a **count-badge handling note** (badge-in-title lost on rename → degraded, cross-reference the dimension). | Part 1 (Count badges dimension) | WooCommerce bakes three count badges into titles (Payments, Home, Orders) that Maestro's wholesale title overwrite drops; a standard phrase makes every survey classify it identically. |
| 4 | **Promoted** the **"## Interaction Scenarios"** section into the template as an optional-but-recommended three-probe block (hide-parent-with-visible-children, rename+reorder, re-icon+reorder-across-separator). | New section after Part 2 | Plan 14-02 recommended promotion: S1's non-cascading parent-hide is a finding the single-op matrix could not surface, and the probes are plugin-agnostic — any Phase 15 plugin with parent/child menus or a custom separator benefits. |
| 5 | Added an **entity-encoded slug** note (rendered `&amp;`-encoded slugs require slug-normalized matching; flag for a slug-resolution tweak). | Part 1 (Re-registered menus dimension) | WooCommerce's Products-taxonomy submenus render with `&amp;`-encoded slugs; Maestro's exact-slug match only lands if the stored slug matches the encoded form — a recurring slug-resolution pattern surveys should flag consistently. |
| 6 | Added the **Hide per-role + cosmetic-vs-access (loads-vs-403)** convention and renamed the Hide column header to "Hide (per role)". | Part 2 | `14-CONTEXT` requires the cosmetic-vs-access-break distinction per Hide cell; Maestro's hide is a cosmetic per-role `unset()` that never strips a cap (page LOADS by URL), so a standard loads-vs-403 sub-note prevents misreading hide as access control. |
| 7 | Added the **"dumps are replay state, not rendered sidebar"** convention (per-role Hide must use a separate post-cap-filter render check; Hide cell = Maestro cosmetic `unset()` + WP's independent cap gate, with "moot no-op" where WP already gates a role away). | Part 2 (Per-cell evidence conventions) | Post-Phase-14 review (Codex): the `$menu`/`$submenu` dumps are taken before WP's render-time capability filtering, so for non-admin roles they contain rows the role never sees; per-role Hide evidence read off the raw dump would overstate visibility. A standard convention forces the rendered/post-filter check so "visible to role" claims are rigorous across SURV-02..06. |

**Decision on each scratch-list candidate:** all six candidates accumulated in SURV-01's scratch list (Plans 01–02) were judged **real, plugin-agnostic schema improvements** (not WooCommerce-specific noise) and accepted. The interaction-scenarios section was **promoted** (candidate 4) rather than left WooCommerce-specific. No candidate was rejected; no dimension/column was restructured or removed — only additive conventions and one promoted optional section.

**Change 7 (post-completion review).** Change 7 was added during a post-Phase-14 review pass (Codex findings on PR #61), after the batched refinement above. It is likewise purely additive/clarifying (a methodology convention, no dimension/column change), so SURV-01 remains a faithful instance and the template is still in final form for Phase 15.
