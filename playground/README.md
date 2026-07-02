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

### [`blueprint-stable.json`](blueprint-stable.json) — hosted, latest release

Playground URL:
`https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/dknauss/Maestro/main/playground/blueprint-stable.json`

Installs the plugin from the latest GitHub **release ZIP** —
`https://github.com/dknauss/Maestro/releases/latest/download/maestro-menu-editor.zip`,
fetched through the Playground CORS proxy (direct GitHub asset URLs fail CORS in
the browser runtime). The `/releases/latest/download/` path always resolves to
the newest release's asset, so this is byte-identical to what users install and
always tracks the current release. This is the primary "Try it live" demo linked
from the README. The release asset is built and attached by the release workflow
(`bin/build.sh` + `.github/workflows/release.yml`).

## Release rule

Nothing to do for the demos. The stable demo installs from
`/releases/latest/download/`, which the release workflow refreshes automatically;
the main demo tracks the `main` branch. Neither blueprint needs a per-release
edit. (`bin/prep-release.sh` bumps the version strings in the plugin header and
`readme.txt`; it no longer touches any blueprint.)
