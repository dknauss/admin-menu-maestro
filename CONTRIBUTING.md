# Contributing to Maestro

Thanks for helping improve Maestro. This project is a WordPress plugin with a plain PHP/JS/CSS runtime and dev tooling for PHPUnit, Playwright, wp-env, WordPress Coding Standards, and WordPress.org packaging.

## Development setup

```bash
composer install
npm ci
npm run env:start
```

The plugin is mounted into the wp-env site as `maestro-menu-editor`.

## Quality gates

Run the smallest useful checks first, then the full suite before opening a PR:

```bash
composer test:unit
composer lint
composer analyse:phpstan
npm run test:js
npm run check:doc-links
npm run audit:npm
bash bin/build.sh
npm run test:php
npm run test:e2e
```

`npm run test:php` and `npm run test:e2e` require Docker through `@wordpress/env`.

## Coding standards

- Target WordPress 6.4+ and PHP 7.4+ unless the plugin headers/readme change deliberately.
- Keep runtime files limited to `maestro-menu-editor.php`, `includes/`, `assets/`, `languages/`, `uninstall.php`, and `readme.txt`.
- Use capability checks with nonces for state-changing behavior.
- Sanitize on input and escape on output.
- Treat menu visibility as cosmetic only; do not describe it as access control.
- Keep user-facing strings translatable with the `maestro-menu-editor` text domain.

## Pull requests

- Use a focused branch and a concise title.
- Explain the user-facing change and the verification you ran.
- Include screenshots or video for UI changes when practical.
- Update `README.md`, `readme.txt`, `SPEC.md`, or `TESTING.md` when behavior, requirements, or QA expectations change.

## Security

Do not report vulnerabilities in public issues or pull requests. See `SECURITY.md`.
