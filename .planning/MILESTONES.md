# Milestones: Maestro

A historical record of shipped versions. Full details for each milestone live in
`.planning/milestones/v[X.Y]-ROADMAP.md` and `…-REQUIREMENTS.md`.

---

## v1.0 — WordPress.org Release Readiness

**Status:** ✅ Shipped 2026-06-14 (submitted to WordPress.org; awaiting .org review)
**Phases:** 1–5 (5 phases, 10 plans, 20 requirements)
**Tag:** `v1.0.0` (+ GitHub Release "Admin Menu Maestro 1.0.0", anchored at `c5f31b8`)

**Delivered:** Took a feature-complete inline admin-menu editor from green-at-intake to a
responsibly publishable WordPress.org plugin — security-confirmed, accessibility-audited,
test-covered, with full .org listing assets, and submitted to the review queue.

**Key accomplishments:**
1. **Security confirmed & hardened** — Codex scan; one low-severity editor DOM XSS fixed (`innerHTML` → `textContent`); REST nonce gate verified by integration tests, not just asserted.
2. **Accessibility audit closed (A11Y-01–05)** — keyboard selection (`Enter`/`Space`), popover focus restoration, and `wp.a11y.speak()` save announcements; v1 keyboard-reorder gap documented.
3. **Test coverage extended** — unit 44/44, integration 29/29 (81 assertions), Playwright E2E 9/9, including per-role visibility, reset edge cases, icon sanitization, and performance contracts.
4. **WordPress.org listing assets produced** — icon, banners, screenshots under `.wordpress-org/`; matching readme.txt captions; `docs/user-guide.md` walkthrough; translation-ready with POT + 6 starter catalogs.
5. **Submitted** — clean `bin/build.sh` zip, WPCS 7/7, Plugin Check 2.0.0 no errors, `npm audit` 0 vulnerabilities; submitted to WordPress.org review queue.

**External follow-up (pending):** On .org approval — SVN commit to `trunk`, tag `1.0.0`, upload `.wordpress-org/` to SVN `assets/`.

**Archives:** [v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md) · [v1.0-REQUIREMENTS.md](milestones/v1.0-REQUIREMENTS.md)

---

## v1.1 — Polish & Accessibility

**Status:** ✅ Shipped 2026-06-17
**Phases:** 6–8
**Release line:** `1.1.x`
**Latest shipped tag:** `v1.1.1`

**Delivered:** Polish and accessibility improvements on top of the v1.0 WordPress.org release: keyboard reordering, modified indicators, per-item reset affordances, solid bundled icons, edit-mode visual polish, documentation/listing updates, and the v1.1.1 compact-control refinements.

**Archives:** v1.1 lives in the active roadmap history for Phases 6–8; v1.0 remains archived under `.planning/milestones/`.

---

## v1.2 — Editor UX Polish

**Status:** 🚧 In progress
**Phases:** 9–12, plus inserted Phase 11.1 hardening
**Target release:** `1.2.0`
**Target tag:** `v1.2.0`
**Cut condition:** Phases 9, 11, 11.1, and 12 complete and audited; Phase 10 is non-blocking research.
**Pipeline:** GitHub release/tag workflow → WordPress.org SVN deploy via `wp-deploy.yml` / `prep-release.sh`.

**Release checklist source:** Active release metadata and checklist live in `.planning/STATE.md` while the milestone is in progress. Move final shipped details here when `$gsd-complete-milestone` archives v1.2.

---
