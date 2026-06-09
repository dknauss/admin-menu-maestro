import { test, expect } from '@playwright/test';

/**
 * End-to-end coverage of the in-place editor against a live WordPress.
 * Run with: `npm run env:start` then `npm run test:e2e`.
 */

test.describe( 'Admin Menu Customizer — editor', () => {

	test( 'edit mode is off by default and the admin-bar toggle is present', async ( { page } ) => {
		await page.goto( '/wp-admin/index.php' );

		// No toolbar without the flag.
		await expect( page.locator( '.amx-toolbar' ) ).toHaveCount( 0 );

		// The toggle lives on the admin bar, not the menu it edits.
		await expect( page.locator( '#wp-admin-bar-amx-toggle' ) ).toBeVisible();
	} );

	test( 'entering edit mode decorates the menu and shows the toolbar', async ( { page } ) => {
		await page.goto( '/wp-admin/index.php?amx_edit=1' );

		await expect( page.locator( '.amx-toolbar' ) ).toBeVisible();
		await expect( page.locator( '#adminmenu li.amx-item' ).first() ).toBeVisible();
		// Posts should have been located by its DOM id and decorated.
		await expect( page.locator( '#menu-posts.amx-item' ) ).toBeVisible();
	} );

	test( 'rename persists across reload, then reset restores the default', async ( { page } ) => {
		await page.goto( '/wp-admin/index.php?amx_edit=1' );

		// --- rename Posts -> Articles ---
		const name = page.locator( '#menu-posts .wp-menu-name' );
		await name.click();
		const input = page.locator( '#menu-posts .amx-rename-input' );
		await expect( input ).toBeVisible();
		await input.fill( 'Articles' );
		await input.press( 'Enter' );

		// Save triggers a reload; the web-first assertion retries through it.
		await page.locator( '.amx-save' ).click();
		await expect( page.locator( '#menu-posts .wp-menu-name' ) ).toContainText( 'Articles' );

		// --- reset everything ---
		page.once( 'dialog', ( dialog ) => dialog.accept() );
		await page.locator( '.amx-reset-all' ).click();
		await expect( page.locator( '#menu-posts .wp-menu-name' ) ).toContainText( 'Posts' );
		await expect( page.locator( '#menu-posts .wp-menu-name' ) ).not.toContainText( 'Articles' );
	} );

	test( 'changing a top-level icon updates the preview', async ( { page } ) => {
		await page.goto( '/wp-admin/index.php?amx_edit=1' );

		const posts = page.locator( '#menu-posts' );
		await posts.locator( '.amx-controls .amx-btn' ).first().click(); // icon button
		const picker = page.locator( '.amx-icon-popover' );
		await expect( picker ).toBeVisible();

		await picker.locator( '.amx-icon-cell.dashicons-book' ).click();
		await expect( posts.locator( '.wp-menu-image' ) ).toHaveClass( /dashicons-book/ );
	} );

} );
