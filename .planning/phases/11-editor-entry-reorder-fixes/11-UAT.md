---
status: complete
phase: 11-editor-entry-reorder-fixes
source: [11-01-SUMMARY.md, 11-02-SUMMARY.md, 11-03-SUMMARY.md, 11-04-SUMMARY.md]
started: 2026-06-21T22:25:00Z
updated: 2026-06-21T22:55:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Mobile editor entry stays visible (UX-08a)
expected: At ≤782px width in wp-admin, the Maestro edit toggle stays visible in the admin bar as an icon-only button (pencil dashicon), not hidden and not showing a full text label.
result: issue
reported: "the maestro edit toggle disappears in mobile-responsive view, but if the user is already in edit mode, the exit icon does remain in view in small viewports. the rest of the edit interface needs work to accommodate all the buttons when a menu item is selected. see screenshot attached"
severity: major

### 2. Compact label with full accessible name (UX-08b)
expected: At normal desktop width, the admin-bar toggle shows a COMPACT visible label — "Edit Menu" (and "Exit" once editing). Hovering it (tooltip) / a screen reader announces the LONG form — "Edit Admin Menu" (and "Exit Editor"). Short text is visible; long text is the accessible name.
result: pass

### 3. Keyboard reorder preserves separators (BUG-06)
expected: Enter edit mode, select a top-level menu item, and use Alt+Arrow (Up/Down) to move it past one of the gray separator lines. The item moves one position, and the separator lines STAY in their original places — the menu is not distorted and separators don't get pushed to the bottom.
result: issue
reported: "option + arrow does not work on mac; the active field is the rename box, and this key combo moves the cursor to the front and end of the menu item name in the form field"
severity: major

### 4. Modified badge sits on the changed row (BUG-07)
expected: In edit mode, change a top-level item that HAS a submenu (e.g. rename "Posts"). The "modified" badge (a bullet •) appears INLINE next to that item's label, in the same row as the item — NOT below or after its expanded submenu list.
result: pass
note: "Badge position correct (on the row). Cosmetic: user reports the bullet is too small / barely visible — logged as a cosmetic gap."

## Summary

total: 4
passed: 2
issues: 2
pending: 0
skipped: 0

## Gaps

- truth: "At ≤782px the Maestro edit ENTRY toggle ('Edit Menu') stays visible and reachable in the admin bar — not only the EXIT toggle in edit mode"
  status: failed
  reason: "User reported: the maestro edit toggle disappears in mobile-responsive view; only the exit icon (edit mode) remains visible at small viewports. The entry point — the actual purpose of UX-08 — is still hidden on mobile. NOTE: the UX-08a e2e guard and the committed ux-08a-{782,600}.png both navigated with maestro_edit=1 (edit mode = exit state), so they only ever exercised the exit toggle; the non-edit enter state at mobile width was never asserted. The CSS override (#wpadminbar li#wp-admin-bar-maestro-toggle{display:block} @≤782px) shows the exit node but evidently does not win for the enter node — likely a state-specific node class/position or specificity gap. Fix must also extend the e2e guard + capture to the non-edit (enter) state."
  severity: major
  test: 1
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
- truth: "At narrow widths the edit toolbar accommodates all action buttons (Add menu item, Visibility, Reset All, Exit, Reset Item) without crowding/overflow when an item is selected"
  status: failed
  reason: "User reported: the rest of the edit interface needs work to accommodate all the buttons when a menu item is selected — at mobile width the toolbar buttons wrap and crowd (see screenshot: Add menu item / Visibility / Reset All / Exit / Reset Item spill across rows). Distinct from the admin-bar toggle issue; concerns the bottom edit toolbar layout at small viewports."
  severity: minor
  test: 1
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
- truth: "Keyboard reorder (Alt/Option+Arrow) moves the selected top-level menu item and is usable on macOS"
  status: failed
  reason: "User reported (macOS): Option+Arrow (= Alt on Mac) does not reorder. When an item is selected the focused field is the rename text box, and Option+Arrow performs macOS caret navigation (jump to start/end of the item name) inside that input instead of triggering the reorder handler — the keyboard reorder is effectively unreachable on Mac. NOTE: the L355 'keyboard-only reorder' e2e passes only because it focuses the menu item and dispatches Alt+Arrow programmatically in headless Linux Chromium — it never exercises the real focus context (rename input focused) or macOS Option+Arrow caret-nav interception. Fix needs a reorder affordance reachable when the rename input has focus and/or a key combo not swallowed by text-field caret navigation, plus an e2e guard reflecting the real focus context. Second instance (with the Test 1 enter-toggle gap) of an automated guard passing on an idealized scenario that masks real-world unreachability."
  severity: major
  test: 3
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
- truth: "The modified-state badge (bullet •) on a changed row is large/visible enough to read at a glance"
  status: failed
  reason: "User reported (Test 4 passed for position): the bullet is too small, barely visible. Badge lands in the correct place (.wp-menu-name) but its glyph size/contrast is too low to notice. Cosmetic CSS-only polish — likely font-size/weight or swap the bullet for a clearer indicator."
  severity: cosmetic
  test: 4
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
