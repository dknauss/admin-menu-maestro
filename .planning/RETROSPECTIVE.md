# Retrospective: Maestro

A living retrospective, one section per milestone, plus cross-milestone trends.

---

## Milestone: v1.0 — WordPress.org Release Readiness

**Shipped:** 2026-06-14
**Phases:** 5 | **Plans:** 10

### What Was Built
A feature-complete inline admin-menu editor was made publishable on WordPress.org:
security confirmed and hardened, accessibility audited to A11Y-01–05, test coverage
extended (unit 44/44, integration 29/29, e2e 9/9), full .org listing assets produced,
and the build submitted to the review queue. Tagged `v1.0.0` with a GitHub Release.

### What Worked
- **Brownfield-green at intake** — entering with passing tests and clean phpcs meant the
  milestone was about *confirming* and *publishing*, not firefighting. Coarse 5-phase
  granularity fit cleanly.
- **Verify, don't assert** — the REST nonce gate was proven with integration tests rather
  than assumed; the Codex security scan turned up a real (if low-severity) DOM XSS that an
  assertion-only pass would have missed.
- **Combining TEST + PERF into one Verification phase** kept the phase count honest without
  losing coverage.

### What Was Inefficient
- **Plan/summary tracking was informal** — this project never adopted the GSD
  phase-directory + SUMMARY.md structure, so milestone stats had to be reconstructed from
  ROADMAP.md and STATE.md decisions at close time rather than read from summary files.
- **External gate at the finish line** — the milestone's true "done" (live on .org) depends
  on an external review that can't be driven from here; the dev milestone and the .org
  publication had to be decoupled.

### Patterns Established
- **Multi-milestone REQUIREMENTS.md** — v1.0/v1.1/v2 coexist in one file; on milestone
  close, archive only the completed slice and retain the rest (do **not** delete the file).
- **Semver tag is the release anchor** — `v1.0.0` + GitHub Release stand in for a separate
  GSD `v1.0` milestone tag; no duplicate tag created.
- **Promote-from-backlog** — v1's documented gaps (keyboard reorder, modified indicator)
  were promoted into the v1.1 requirement set with origin IDs preserved for lineage.

### Key Lessons
- Decouple "development milestone complete" from "published" when publication is external;
  archive the dev work and keep the external follow-up as an explicit pending todo.
- When a project doesn't use phase directories, the roadmap + STATE decisions log become the
  authoritative source for the milestone archive — keep them current during execution.

### Cost Observations
- Model mix: predominantly Opus (planning/security/judgment); not separately metered.
- Notable: most effort was verification and asset production, not new feature code.

---

## Milestone: v1.2 — Editor UX Polish

**Shipped:** 2026-06-22
**Phases:** 9, 10 (research spike, not shipped), 11, 11.1, 11.2, 12

### What Was Built

The edit-mode surface was redesigned from the ground up for clarity, compactness, and mobile reach:
1. **Icon-only unified toolbar** with semantic colour (green/amber/red/grey) and ▲/▼ move controls — flat non-clickable status indicators, fully accessible (aria-label + title + aria-live). (UX-10, Phase 11.2)
2. **Mobile-reachable editing** — admin-bar "Edit Menu" toggle stays visible at ≤782px; touch-sized controls. (UX-08, UX-07, Phase 11)
3. **Editor UX polish** — persistent "Edit Mode" indicator + first-run attention pulse, rename placeholder, auto-clearing "Saved" state. (UX-03, UX-04, Phase 9)
4. **Separator-safe reorder + badge fix** — ▲/▼ and keyboard reorder leaves menu separators in place; modified badge sits on the changed row. (BUG-06, BUG-07, Phase 11)
5. **Internal hardening** — `custom_menu_order` gated on stored `top_order`, bounded config payload, race-safe save/reset/exit with e2e coverage. (HARD-01/02/03, Phase 11.1)
6. **Refreshed wp.org listing** — balanced banner + 6 recaptured directory screenshots against the new UI. (REL-07, REL-08, Phase 12)

### What Worked

- **Interactive visual iteration** for the Phase 11.2 toolbar redesign — live wp-env with Playwright screenshots let the design converge rapidly without up-front spec rigidity. The final icon-only system was better than anything planned in advance.
- **Gap-closure discipline** — UAT after the Phase 11 merge caught 4 real defects that automated tests missed (the toolbar was too idealized). Treating them as explicit gap-closure plans (not hotfixes) kept the record honest.
- **Decimal phases for out-of-band work** — Phase 11.1 (backend hardening) and Phase 11.2 (toolbar redesign) slotted into the cut path without disrupting the main phase sequence or forcing retroactive plan numbering.
- **Human-verify checkpoints** for visual assets (banner, screenshots) ensured REL-07/08 were not merged blind.

### What Was Inefficient

- **STATE.md drift** — frontmatter status diverged from the body Status line repeatedly between executor runs, requiring manual fixes. The body Status line is the source of truth but the CLI kept regenerating from frontmatter.
- **wp-env login flakiness** — repeated auth failures in Playwright e2e added setup friction across Phase 11 waves; a stable pre-authenticated session fixture would eliminate this.
- **Phase 11.2 scope creep** — the toolbar redesign grew well beyond the planned Phase 11 mobile-touch work and needed a retroactive record phase (11.2). The interactive-design approach was the right call, but an earlier signal that UX-10 was its own scope would have made the cut path cleaner.
- **Port collisions** — screenshot capture required an alternate wp-env tests port (8899) to dodge a conflict with the running main instance; this needed documentation and an env var to be reliable.

### Patterns Established

- **Record-only decimal phase** (`11.2-SUMMARY.md`) for work built outside the standard plan/execute flow — captures the 8-commit history without inventing a post-hoc plan.
- **Alternate-port wp-env capture** — `WP_ENV_TESTS_PORT=8899` as a named override for screenshot capture runs.
- **Human-verify checkpoints for visual assets** — image work gates on an explicit human sign-off before overwriting the live `.wordpress-org/` files.

---

## Cross-Milestone Trends

| Milestone | Phases | Plans | Shipped | Test posture at close |
|-----------|--------|-------|---------|------------------------|
| v1.0 | 5 | 10 | 2026-06-14 | unit 44/44 · integration 29/29 · e2e 9/9 · Plugin Check clean |
| v1.1 | 3 | 11 | 2026-06-17 | unit 44/44 · integration 29/29 · e2e 9/9 · Plugin Check clean |
| v1.2 | 6 (+2 inserted) | 31 | 2026-06-22 | PHP unit 61/61 · PHP integration 37/37 · e2e 32/32 · phpcs + PHPStan + Plugin Check clean |

*Trends accumulate as milestones complete.*
