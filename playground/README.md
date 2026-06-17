# Playground blueprints

This directory contains three WordPress Playground blueprints for Maestro. They
share the same setup (User Switching, four test users, edit mode landing page)
but differ in how the plugin is installed.

## Blueprints

### [`blueprint.json`](blueprint.json) — local dev (working tree)

Used by `npm run playground`. Mounts the local working tree into Playground via
a `wp-env`-style volume, so you always run the code that is checked out on disk.
Not suited for hosted demos — it requires a local build.

### [`blueprint-hosted.json`](blueprint-hosted.json) — hosted, tracks `main` (bleeding edge)

Playground URL:
`https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/dknauss/Maestro/main/playground/blueprint-hosted.json`

Installs the plugin via a `git:directory` resource pointing at the `main`
branch. Every time this demo loads it pulls the latest commit on `main`, so it
reflects unreleased changes. Use this to preview work in progress.

### [`blueprint-stable.json`](blueprint-stable.json) — hosted, pinned to release tag

Playground URL:
`https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/dknauss/Maestro/main/playground/blueprint-stable.json`

Installs the plugin via a `git:directory` resource pinned to the latest release
tag (e.g. `v1.1.0`). This matches the version users install from WordPress.org
and is the primary "Try it live" demo linked from the README.

Note: the blueprint *file itself* is always served from `main` (stable URL),
but the install step's `"ref"` inside the file is pinned to the release tag.

## Release rule

**`blueprint-stable.json`'s `"ref"` is bumped to the new tag during release
prep by running `bin/prep-release.sh <version>`** (e.g. `bin/prep-release.sh
1.2.0`). This script is run in the version-bump PR — the human-reviewed PR that
updates version strings before the tag is created.

### Why not a post-tag automation?

Branch protection blocks the release workflow's `GITHUB_TOKEN` from pushing
commits directly to the protected `main` branch. A post-tag CI job that bumped
the blueprint ref would fail at push time. By including the bump in the
release-prep PR instead, the change goes through normal review and lands on
`main` before the tag is created, keeping the stable demo URL correct from the
moment the release publishes.
