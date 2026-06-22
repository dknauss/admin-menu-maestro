import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * MAESTRO_CAPTURE-gated capture spec for the four WordPress.org directory screenshots.
 *
 * Captures the v1.2 editor UI in four distinct states — unified toolbar, icon picker,
 * per-role visibility control, and a renamed item in "Saved" state — against the final
 * post-Phase-11.2 icon-only toolbar. Modelled on capture-screenshots.spec.ts.
 *
 * GUARD: skipped unless MAESTRO_CAPTURE is set (via `npm run screenshots`), so the normal
 * `test:e2e` / CI run never regenerates or overwrites the committed PNGs. Gate is at the
 * describe level (Pitfall 5 fix) so the skip fires before beforeAll/afterAll.
 *
 * Auth: inherits the shared storageState admin session from playwright.config.ts
 * (global-setup logs in once). No bespoke login.
 *
 * Each screenshot is written to two destinations:
 *   .planning/phases/12-release-assets-refresh/screenshots/screenshot-N.png  (review artifact)
 *   .wordpress-org/screenshot-N.png                                          (wp.org publish target)
 */

const CAPTURE = Boolean( process.env.MAESTRO_CAPTURE );

const SCREENSHOTS_DIR = path.join(
	process.cwd(),
	'.planning',
	'phases',
	'12-release-assets-refresh',
	'screenshots'
);

const WP_ORG_DIR = path.join( process.cwd(), '.wordpress-org' );

/**
 * Write a screenshot to both the planning review dir and the wp.org publish target.
 */
async function dualShot(
	page: import( '@playwright/test' ).Page,
	n: number,
	opts?: import( '@playwright/test' ).PageScreenshotOptions
) {
	const filename = `screenshot-${ n }.png`;
	await page.screenshot( {
		...opts,
		path: path.join( SCREENSHOTS_DIR, filename ),
	} );
	await page.screenshot( {
		...opts,
		path: path.join( WP_ORG_DIR, filename ),
	} );
}

test.describe( 'Directory screenshots — v1.2 editor UI (MAESTRO_CAPTURE-gated)', () => {
	test.skip(
		! CAPTURE,
		'Set MAESTRO_CAPTURE=1 (npm run screenshots) to regenerate the directory screenshots.'
	);

	test.beforeAll( () => {
		fs.mkdirSync( SCREENSHOTS_DIR, { recursive: true } );
	} );

	/**
	 * Screenshot 1: Editor active, top-level item selected.
	 *
	 * Shows the Phase 11.2 icon-only unified toolbar (gray square buttons, semantic colour,
	 * flat indicator glyphs) plus the Phase 9 "Edit Mode" indicator and the controls panel
	 * with the rename input populated for the selected item.
	 */
	test( 'screenshot 1 — editor toolbar + selected item controls', async ( { page } ) => {
		await page.setViewportSize( { width: 1440, height: 980 } );
		await page.goto( '/wp-admin/index.php?maestro_edit=1' );

		// Wait for the Maestro toolbar to confirm the editor initialised.
		await expect( page.locator( '.maestro-toolbar' ) ).toBeVisible();

		// Select the first top-level menu item so the controls panel becomes visible.
		const firstItem = page.locator( 'li.maestro-item' ).first();
		await expect( firstItem ).toBeVisible();
		await firstItem.click();

		// Wait for the controls panel to become visible (populated on selection).
		await expect( page.locator( '.maestro-panel' ) ).toBeVisible();

		// Confirm the rename input is populated (panel fully populated, not just shown).
		await expect( page.locator( '.maestro-rename-input' ) ).toBeVisible();

		await dualShot( page, 1 );
	} );

	/**
	 * Screenshot 2: Icon picker open.
	 *
	 * Shows the Dashicons + bundled Bootstrap Icons tabs inside the icon-picker popover,
	 * with the palette (art) button active. Requires a top-level item to be selected first
	 * (the icon button is hidden for submenu items).
	 */
	test( 'screenshot 2 — icon picker open', async ( { page } ) => {
		await page.setViewportSize( { width: 1440, height: 980 } );
		await page.goto( '/wp-admin/index.php?maestro_edit=1' );

		await expect( page.locator( '.maestro-toolbar' ) ).toBeVisible();

		// Select the first top-level item to enable the icon button.
		const firstItem = page.locator( 'li.maestro-item' ).first();
		await expect( firstItem ).toBeVisible();
		await firstItem.click();

		await expect( page.locator( '.maestro-panel' ) ).toBeVisible();
		await expect( page.locator( '.maestro-icon-btn' ) ).toBeVisible();

		// Open the icon picker.
		await page.locator( '.maestro-icon-btn' ).click();

		// Wait for the icon-picker popover to appear.
		await expect( page.locator( '.maestro-icon-popover' ) ).toBeVisible();

		await dualShot( page, 2 );
	} );

	/**
	 * Screenshot 3: Per-role visibility control open.
	 *
	 * Shows the visibility popover with the list of roles and their checkboxes,
	 * demonstrating the ability to hide a menu item from selected roles.
	 */
	test( 'screenshot 3 — visibility popover open', async ( { page } ) => {
		await page.setViewportSize( { width: 1440, height: 980 } );
		await page.goto( '/wp-admin/index.php?maestro_edit=1' );

		await expect( page.locator( '.maestro-toolbar' ) ).toBeVisible();

		// Select the first top-level item.
		const firstItem = page.locator( 'li.maestro-item' ).first();
		await expect( firstItem ).toBeVisible();
		await firstItem.click();

		await expect( page.locator( '.maestro-panel' ) ).toBeVisible();
		await expect( page.locator( '.maestro-vis-btn' ) ).toBeVisible();

		// Open the visibility popover.
		await page.locator( '.maestro-vis-btn' ).click();

		// Wait for the visibility popover to appear.
		await expect( page.locator( '.maestro-vis-popover' ) ).toBeVisible();

		await dualShot( page, 3 );
	} );

	/**
	 * Screenshot 4: Renamed item in "Saved" state.
	 *
	 * Types a rename, blurs the input to commit it, then waits for the transient
	 * "Saved" status indicator to appear (autosave POSTs on blur + debounce). The
	 * "Saved" glyph auto-clears after ~2 s so the screenshot is taken promptly.
	 */
	test( 'screenshot 4 — renamed item, "Saved" indicator', async ( { page } ) => {
		await page.setViewportSize( { width: 1440, height: 980 } );
		await page.goto( '/wp-admin/index.php?maestro_edit=1' );

		await expect( page.locator( '.maestro-toolbar' ) ).toBeVisible();

		// Select the first top-level item.
		const firstItem = page.locator( 'li.maestro-item' ).first();
		await expect( firstItem ).toBeVisible();
		await firstItem.click();

		await expect( page.locator( '.maestro-panel' ) ).toBeVisible();

		const renameInput = page.locator( '.maestro-rename-input' );
		await expect( renameInput ).toBeVisible();

		// Clear the field and type a new name to trigger a rename.
		await renameInput.fill( 'My Renamed Item' );

		// Blur to commit the rename (triggers scheduleAutosave via the blur handler).
		await renameInput.blur();

		// Wait for the transient "Saved" indicator (class set by setStatus('saved')
		// after the autosave POST resolves). The indicator auto-clears after ~2 s.
		await expect(
			page.locator( '.maestro-status.maestro-status-saved' )
		).toBeVisible( { timeout: 10000 } );

		// Capture promptly — the "Saved" tile auto-clears after ~2 s.
		await dualShot( page, 4 );
	} );
} );
