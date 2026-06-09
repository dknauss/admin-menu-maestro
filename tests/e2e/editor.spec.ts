import { test, expect } from '@playwright/test';

/**
 * End-to-end coverage of the in-place editor against a live WordPress.
 * Run with: `npm run env:start` then `npm run test:e2e`.
 *
 * The editor uses a click-to-select model with debounced autosave: there is
 * no manual Save button. Every spec that mutates server state ends with a
 * Reset all so the next spec starts from a stable baseline.
 */

const POST_SAVE = ( url: string ) =>
	url.includes( '/amx/v1/config' );

test.describe( 'Inline Admin Menu Editor — editor', () => {

	test( 'edit mode is off by default and the admin-bar toggle is present', async ( { page } ) => {
		await page.goto( '/wp-admin/index.php' );

		// No toolbar without the flag.
		await expect( page.locator( '.amx-toolbar' ) ).toHaveCount( 0 );

		// The toggle lives on the admin bar, not the menu it edits.
		await expect( page.locator( '#wp-admin-bar-amx-toggle' ) ).toBeVisible();
	} );

	test( 'entering edit mode shows the toolbar and decorates the menu', async ( { page } ) => {
		await page.goto( '/wp-admin/index.php?amx_edit=1' );

		await expect( page.locator( '.amx-toolbar' ) ).toBeVisible();
		await expect( page.locator( '#adminmenu li.amx-item' ).first() ).toBeVisible();
		await expect( page.locator( '#menu-posts.amx-item' ) ).toBeVisible();

		// No edit chrome until selection — the shared panel is hidden, and no
		// per-item button clusters exist on the menu.
		await expect( page.locator( '.amx-toolbar .amx-panel' ) ).toBeHidden();
		await expect( page.locator( '#adminmenu .amx-controls' ) ).toHaveCount( 0 );
	} );

	test( 'rename persists across reload, then reset restores the default', async ( { page } ) => {
		await page.goto( '/wp-admin/index.php?amx_edit=1' );

		// Click Posts to select it; the shared panel opens.
		await page.locator( '#menu-posts' ).click();
		const panel = page.locator( '.amx-toolbar .amx-panel' );
		await expect( panel ).toBeVisible();

		const rename = panel.locator( '.amx-rename-input' );
		await expect( rename ).toBeVisible();
		await rename.fill( 'Articles' );

		// Pressing Enter blurs the input, which commits and schedules autosave.
		const savePosted = page.waitForResponse(
			r => POST_SAVE( r.url() ) && r.request().method() === 'POST' && r.ok()
		);
		await rename.press( 'Enter' );
		await savePosted;

		// Hard reload: the change is only authoritative if the server stored it.
		await page.goto( '/wp-admin/index.php?amx_edit=1' );
		await expect( page.locator( '#menu-posts .wp-menu-name' ) ).toContainText( 'Articles' );

		// Reset everything so the next test starts clean.
		page.once( 'dialog', d => d.accept() );
		await page.locator( '.amx-reset-all' ).click();
		await expect( page.locator( '#menu-posts .wp-menu-name' ) ).toContainText( 'Posts' );
		await expect( page.locator( '#menu-posts .wp-menu-name' ) ).not.toContainText( 'Articles' );
	} );

	test( 'icon pick persists across reload and the autosave carries it', async ( { page } ) => {
		await page.goto( '/wp-admin/index.php?amx_edit=1' );

		// Select Posts, open the icon picker from the shared panel.
		await page.locator( '#menu-posts' ).click();
		const panel = page.locator( '.amx-toolbar .amx-panel' );
		await expect( panel ).toBeVisible();
		await panel.locator( '.amx-icon-btn' ).click();

		const picker = page.locator( '.amx-icon-popover' );
		await expect( picker ).toBeVisible();

		// Capture the POST so we can assert the icon is in the payload — the
		// confirmed miss before this work was the icon not being persisted.
		const saveReq = page.waitForRequest(
			r => POST_SAVE( r.url() ) && r.method() === 'POST'
		);
		await picker.locator( '.amx-icon-cell.dashicons-book' ).click();
		const req = await saveReq;
		const payload = req.postDataJSON();
		expect( payload?.config?.items?.[ 'edit.php' ]?.icon ).toBe( 'dashicons-book' );

		// Preview updated synchronously.
		await expect( page.locator( '#menu-posts .wp-menu-image' ) ).toHaveClass( /dashicons-book/ );

		// Persistence across reload — server-rendered class survives.
		await page.goto( '/wp-admin/index.php?amx_edit=1' );
		await expect( page.locator( '#menu-posts .wp-menu-image' ) ).toHaveClass( /dashicons-book/ );

		// Clean up.
		page.once( 'dialog', d => d.accept() );
		await page.locator( '.amx-reset-all' ).click();
		await expect( page.locator( '#menu-posts .wp-menu-image' ) ).not.toHaveClass( /dashicons-book/ );
	} );

} );
