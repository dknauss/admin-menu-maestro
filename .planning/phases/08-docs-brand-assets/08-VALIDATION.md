---
phase: 8
slug: docs-brand-assets
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-15
---

# Phase 8 — Validation Strategy

> DOC-01 has a testable contract (grep returns no offending bare-path refs) → built
> test-first. REL-06 is verify + reconcile of an already-shipped pipeline.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `node:test` / a repeatable doc-link checker script (`node`) · phpunit (regression) · Playwright (regression) |
| **Config file** | none for JS (`node --test tests/js/`) · `phpunit-*.xml.dist` · `playwright.config.ts` |
| **Quick run command** | `node --test tests/js/doc-links.test.mjs` (or `node bin/check-doc-links.mjs`) |
| **Full suite command** | `npm run test:js && composer test:unit && npm run test:php && npm run test:e2e && composer lint` |
| **Estimated runtime** | doc-link check <2s · banner regen <30s · full regression suite ~2–3 min |

---

## Sampling Rate

- **After every task commit:** the doc-link checker for DOC-01 work.
- **After the phase:** full regression suite (doc/asset-only changes must not move it).
- **Before `/gsd:verify-work`:** doc-link checker returns 0 offenders; banner regen
  reproduces committed PNGs; PHP unit 44/44, integration 29/29, e2e green, Plugin
  Check 0 errors, `composer lint` clean.
- **Max feedback latency:** < 2s for the doc-link check.

---

## Per-Task Verification Map

> Populated by gsd-planner. DOC-01 checker is test-first (RED = N offenders → GREEN = 0).

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| _TBD_ (TDD: doc-link checker — flags inline-code refs that resolve to real repo files and aren't links, in in-scope docs; excludes core files + readme.txt) | — | — | DOC-01 | unit/script (node) | `node --test tests/js/doc-links.test.mjs` | ⬜ pending |
| _TBD_ (convert flagged refs to markdown links; fix stale paths) | — | — | DOC-01 | script | `node bin/check-doc-links.mjs` (0 offenders) | ⬜ pending |
| _TBD_ (verify `npm run assets:banners` regenerates both banners deterministically) | — | — | REL-06 | regen check | `npm run assets:banners && git diff --quiet -- .wordpress-org/banner-*.png` | ⬜ pending |
| _TBD_ (reconcile REL-06 criterion wording: Python/Pillow pipeline replaces SVG/Inkscape) | — | — | REL-06 | doc grep | `grep -iq "build_final.py\|Pillow" .planning/REQUIREMENTS.md .planning/ROADMAP.md` | ⬜ pending |
| _TBD_ (zero-regression full suite) | — | — | DOC-01, REL-06 | full suite | `composer test:unit && npm run test:php && npm run test:e2e && composer lint` | ⬜ pending |

---

## Wave 0 Requirements

- [ ] Failing doc-link checker (RED) listing the inline-code refs that resolve to
      real project files but are not yet markdown links, scoped to the in-scope docs
      (README, SPEC, TESTING, user-guide, planning) and EXCLUDING WP-core refs
      (`common.js`, `menu-header.php`, `wp-admin/*`) and `readme.txt` relative paths.
- *No new framework — reuse the Phase 6 `node:test` seam, or a standalone
  `bin/check-doc-links.mjs` invoked by an npm script.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| "Where relative links make sense" / readme.txt policy | DOC-01 | Editorial judgment about which refs benefit from a link | Review flagged refs; confirm core/external files stay code and readme.txt relative paths stay code |
| REL-06 criterion reconciliation reads accurately | REL-06 | Judgment that the wording faithfully records the mechanism substitution | Confirm REQUIREMENTS/ROADMAP note the Python/Pillow pipeline and that the banners regenerate from committed source |

*The doc-link checker and banner-regen diff give automated coverage of the wiring; manual rows cover the two editorial judgments only.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s for unit loops
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
