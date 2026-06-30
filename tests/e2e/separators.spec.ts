import { test, expect } from '@playwright/test';

/**
 * Regression: WP core menu separators (li.wp-menu-separator + inner div.separator)
 * must collapse to zero height in edit mode. With submenus force-expanded, the
 * default ~11px separator gap reads as a stray dark band between groups (most
 * visibly above the Posts group), making the next item look enlarged. They are
 * not editable in v1, so they are collapsed while editing.
 */
test( 'menu separators collapse to zero height in edit mode', async ( { page } ) => {
	await page.goto( '/wp-admin/index.php?maestro_edit=1', { waitUntil: 'networkidle' } );
	await page.waitForSelector( '#adminmenu li.maestro-item' );

	const heights = await page.evaluate( () =>
		Array.from( document.querySelectorAll( '#adminmenu li.wp-menu-separator' ) ).map(
			( li ) => Math.round( ( li as HTMLElement ).getBoundingClientRect().height )
		)
	);

	expect( heights.length ).toBeGreaterThan( 0 ); // separators exist to test
	for ( const h of heights ) {
		expect( h ).toBe( 0 );
	}
} );
