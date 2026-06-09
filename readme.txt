=== Inline Admin Menu Editor (AMX) ===
Contributors: danknauss
Tags: admin, menu, dashicons, roles, customize
Requires at least: 6.4
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

In-place editing of the WordPress admin menu: rename, reorder, swap top-level
dashicons, and hide items per role. Global config, no separate settings screen.

== Description ==

Toggle "Edit Menu" from the admin bar and the admin menu becomes editable in
place:

* **Rename** any top-level or submenu item (click the label).
* **Reorder** items by dragging (top-level and within each submenu).
* **Swap dashicons** on top-level items (submenus carry no icon).
* **Hide** items from chosen roles.
* **Reset** a single item to its default, or reset everything at once.

Changes are **global** — one configuration applies to everyone — and are stored
as a sparse delta layered over the menu WordPress builds each load.

= Important: visibility is cosmetic, not access control =

Hiding a menu item only declutters the menu. The underlying admin page still
loads for anyone who knows or types its URL, because a page's own registered
**capability** is the true lock. This plugin operates on the menu (presentation),
which is a different plane from authorization.

If you need to actually *prevent* access, pair this with a capability manager:

* **User Role Editor** — simplest way to edit what a role can do.
* **PublishPress Capabilities** — menu-aware; its Pro tier can block admin pages
  by URL.

The `amx_capability` filter lets such a plugin hand editing rights to a custom
capability instead of the default `manage_options`.

== Architecture (for developers) ==

* `Config` — reads/writes/sanitizes a single option (`amx_config`) holding only
  the deltas. Reset = delete the option; the natural menu returns automatically.
* `Replay` — on a late `admin_menu` pass, applies rename/icon/visibility to the
  `$menu`/`$submenu` globals and reorders submenus. Top-level order uses the
  core `custom_menu_order` + `menu_order` filters. Resilient to missing slugs
  (orphans are skipped) and new items (appended at the end).
* `Rest` — `amx/v1/config` (GET/POST/DELETE), capability-gated, `X-WP-Nonce`.
* The editor JS is driven by a localized model (with DOM ids), not DOM scraping,
  and diffs against captured pristine defaults so the stored config stays sparse.

== Known limits / deferred to v2 ==

* **Reparenting** (moving an item between top-level and submenu) is not included.
  It requires hand-splicing the globals plus `parent_file`/`submenu_file`
  highlighting fixes — a known minefield, parked deliberately.
* **Separators** are preserved in place but not yet add/move/delete-able; their
  generated slugs (`separator1`…) have no stable identity to key against.
* **Renaming** an item drops any core-appended count badge (e.g. pending
  comments) from that label, since the badge lives inside the title string.
* Submenu sort relies on items registering by the late `admin_menu` pass; a
  plugin that registers submenus on an unusually late hook may not be captured.

== Changelog ==

= 1.0.0 =
* Initial release: rename, reorder, dashicon swap, per-role visibility, reset.
