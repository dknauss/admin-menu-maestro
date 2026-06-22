---
created: 2026-06-21T23:18:55.224Z
title: Pin GSD milestones to releases
area: tooling
files:
  - .planning/STATE.md (milestone metadata — currently the milestone↔release link is implicit prose)
---

## Problem

The link between a GSD milestone and the actual shipped release is implicit prose in STATE.md — e.g. Maestro's "cut 1.2.0 after Phase 12", wp-sudo's "tag v4.0.0 after Phase 14/15 verified". GSD milestones already shadow the semver lines (v1.0 → 1.0.0, v1.1 → 1.1.1, v1.2 → 1.2.0), but nothing makes the milestone the system of record for its release, and the tag/publish step depends on a human remembering it after milestone completion. The planning state ("milestone done/audited") and the shipped artifact ("version X tagged + on wp.org") can drift apart.

## Solution

Make the milestone the system of record for its release:
- Carry the target version tag (e.g. `release: 1.2.0`) and a release checklist in milestone metadata/frontmatter.
- Have `/gsd:complete-milestone` (and/or `/gsd:audit-milestone`) trigger the version tag and kick the release pipeline — for Maestro that's GitHub Actions → wp.org SVN via prep-release.sh (see memory project-maestro-release-pipeline). This closes the loop between "milestone done" and "version shipped."

Cross-project (applies to any GSD repo with releases — Maestro, wp-sudo), so it likely belongs as a GSD-tooling enhancement (milestone frontmatter + a complete-milestone hook) rather than per-repo. Minimum viable version: just record the target tag explicitly in milestone STATE so it's no longer buried in prose.

Source: Dan's FYI on 2026-06-21. See workspace memory `project-gsd-milestones-pin-releases`. Not yet scoped.

## Completion note

Minimum viable per-repo release pinning is now recorded in `.planning/STATE.md`
(`release_target`, `release_tag`, release status, cut condition, pipeline, and
checklist), with supporting notes in `.planning/ROADMAP.md` and
`.planning/MILESTONES.md`.

Cross-project GSD automation remains a future tooling enhancement.
