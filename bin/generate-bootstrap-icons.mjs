#!/usr/bin/env node
/**
 * Generate includes/icons-bootstrap.php — a curated set of Bootstrap Icons
 * encoded as base64 SVG data-URIs for the editor's icon picker.
 *
 * Why curated: Bootstrap Icons ships ~2000 glyphs; localising them all into
 * every edit-mode page would be megabytes. We bundle an admin-relevant subset.
 * Add a name to CURATED and re-run to extend it.
 *
 * Why #a7aaad: a data-URI used as a CSS background-image cannot inherit text
 * colour, so `currentColor` would resolve to black and vanish on the dark admin
 * menu. We bake in WordPress's default menu-icon grey. (Trade-off: these icons
 * don't recolour on hover/active the way dashicons fonts do — documented.)
 *
 * Fill-resolution policy (ICON-01): prefer <name>-fill when it exists (58 of 87
 * names); else apply SYNONYM_FILL for names whose meaning survives a solid
 * substitute (7 names); else retain the outline <name> and record it (22 names).
 * Every CURATED name must resolve — no silent drops.
 *
 * Run: node bin/generate-bootstrap-icons.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
export const ICON_DIR = resolve( __dirname, '../node_modules/bootstrap-icons/icons' );
const OUT = resolve( __dirname, '../includes/icons-bootstrap.php' );
export const MENU_GREY = '#a7aaad';

// Admin-relevant subset. Grouped by intent for readability; flattened on output.
export const CURATED = [
	// Dashboard / pages / content
	'house', 'speedometer2', 'file-earmark-text', 'file-earmark', 'files',
	'journal-text', 'book', 'bookmark', 'pencil-square', 'card-text', 'layout-text-window',
	// Media
	'images', 'image', 'camera', 'film', 'music-note-beamed', 'mic', 'play-btn',
	// Taxonomy / organization
	'tag', 'tags', 'folder', 'folder2-open', 'archive', 'trash', 'grid', 'list-ul', 'kanban', 'table',
	// Commerce
	'cart3', 'bag', 'shop', 'credit-card', 'cash-stack', 'receipt', 'box-seam', 'truck',
	// Analytics
	'graph-up', 'bar-chart', 'pie-chart', 'clipboard-data',
	// Time / place
	'calendar3', 'calendar-event', 'clock', 'geo-alt',
	// People / comms
	'people', 'person', 'person-badge', 'person-circle', 'chat-dots', 'envelope', 'megaphone', 'bell',
	// Settings / tools
	'gear', 'gear-wide-connected', 'sliders', 'tools', 'wrench', 'plug', 'puzzle',
	// Security
	'shield', 'shield-lock', 'lock', 'key', 'person-lock',
	// Infra / dev
	'database', 'hdd-stack', 'cloud', 'server', 'globe', 'rss', 'link-45deg', 'code-slash', 'terminal',
	// Appearance
	'palette', 'brush',
	// Misc
	'star', 'heart', 'lightning', 'trophy', 'ticket-perforated', 'building', 'briefcase',
	'search', 'question-circle', 'info-circle', 'eye', 'eye-slash',
];

/**
 * Explicit solid synonyms for CURATED names that lack a direct <name>-fill variant.
 *
 * Rules:
 * - Every target MUST exist in node_modules/bootstrap-icons/icons; verified at
 *   module load time — a missing target throws rather than silently using an outline.
 * - Only map names where the solid substitute preserves the semantic meaning of the
 *   original outline icon (e.g. "files" reads correctly as "file-earmark-fill").
 * - Names with no sensible solid form are NOT in this map and stay outline — see
 *   the RETAINED_OUTLINE array printed at generator run time.
 *
 * Candidates evaluated from the plan decision (fill_resolution_decision):
 *   - files        -> file-earmark-fill  (solid document stack, ✓ exists)
 *   - journal-text -> journal-fill       (MISSING — journal-fill not in v1.13.1; stays outline)
 *   - pencil-square-> pencil-fill        (solid pencil, ✓ exists)
 *   - images       -> image-fill         (solid image/photo, ✓ exists)
 *   - folder2-open -> folder-fill        (solid folder, ✓ exists; "open" nuance acceptable)
 *   - cart3        -> cart-fill          (solid cart, ✓ exists)
 *   - person-circle-> person-fill        (solid person silhouette, ✓ exists)
 *   - person-lock  -> person-fill-lock   (solid person+lock, ✓ exists)
 *   - graph-up     -> graph-up-arrow     (only outline; graph-up-arrow-fill MISSING; stays outline)
 */
export const SYNONYM_FILL = {
	'files': 'file-earmark-fill',
	'pencil-square': 'pencil-fill',
	'images': 'image-fill',
	'folder2-open': 'folder-fill',
	'cart3': 'cart-fill',
	'person-circle': 'person-fill',
	'person-lock': 'person-fill-lock',
};

// Validate every synonym target at module load — fail fast rather than shipping broken output.
for ( const [ src, target ] of Object.entries( SYNONYM_FILL ) ) {
	const file = resolve( ICON_DIR, target + '.svg' );
	if ( ! existsSync( file ) ) {
		throw new Error(
			`SYNONYM_FILL["${ src }"] = "${ target }" — target SVG not found at ${ file }. ` +
			'Update SYNONYM_FILL to use an existing Bootstrap Icons file.'
		);
	}
}

/**
 * Resolve a CURATED icon name to its preferred source file.
 *
 * Priority:
 *   1. <name>-fill.svg   — direct fill variant (source: 'fill')
 *   2. SYNONYM_FILL[name] — validated solid synonym (source: 'synonym')
 *   3. <name>.svg         — retained outline (source: 'outline')
 *
 * Returns { file: absolutePath, source: 'fill'|'synonym'|'outline' }.
 * Never returns null; never throws for a CURATED name (all outlines exist).
 *
 * @param {string} name A CURATED icon name.
 * @returns {{ file: string, source: 'fill'|'synonym'|'outline' }}
 */
export function resolveIcon( name ) {
	// 1. Prefer <name>-fill
	const fillFile = resolve( ICON_DIR, name + '-fill.svg' );
	if ( existsSync( fillFile ) ) {
		return { file: fillFile, source: 'fill' };
	}

	// 2. Apply synonym map
	if ( SYNONYM_FILL[ name ] ) {
		const synFile = resolve( ICON_DIR, SYNONYM_FILL[ name ] + '.svg' );
		// Target existence is validated at module load, but guard defensively.
		if ( existsSync( synFile ) ) {
			return { file: synFile, source: 'synonym' };
		}
	}

	// 3. Retain outline
	const outlineFile = resolve( ICON_DIR, name + '.svg' );
	return { file: outlineFile, source: 'outline' };
}

/**
 * Read the resolved SVG for `name`, bake in menu-grey (#a7aaad), strip
 * width/height/class attributes, collapse whitespace, and return a
 * `data:image/svg+xml;base64,` data-URI.
 *
 * This is the same transform as the original generator; extracted so tests
 * can assert on the baked output without running the full file-write loop.
 *
 * @param {string} name A CURATED icon name.
 * @returns {string} Base64 data-URI.
 */
export function bakeDataUri( name ) {
	const { file } = resolveIcon( name );
	let svg = readFileSync( file, 'utf8' );
	// Drop fixed width/height and the bi-* class; keep viewBox so it scales.
	svg = svg
		.replace( /\s(width|height|class)="[^"]*"/g, '' )
		.replace( /fill="currentColor"/g, `fill="${ MENU_GREY }"` )
		.replace( />\s+</g, '><' )
		.trim();
	// Ensure a fill attribute is present (a few icons rely on the SVG root fill).
	if ( ! /fill="/.test( svg ) ) {
		svg = svg.replace( '<svg ', `<svg fill="${ MENU_GREY }" ` );
	}
	return 'data:image/svg+xml;base64,' + Buffer.from( svg, 'utf8' ).toString( 'base64' );
}

// ---------------------------------------------------------------------------
// CLI entry point — only runs when this file is executed directly.
// Importing this module (e.g. from tests) is side-effect-free.
// ---------------------------------------------------------------------------
function main() {
	const version = JSON.parse(
		readFileSync( resolve( __dirname, '../node_modules/bootstrap-icons/package.json' ), 'utf8' )
	).version;

	const entries = [];
	const retainedOutline = [];

	for ( const name of CURATED ) {
		const { source } = resolveIcon( name );
		if ( source === 'outline' ) {
			retainedOutline.push( name );
		}
		entries.push( [ 'bi-' + name, bakeDataUri( name ) ] );
	}

	const lines = entries.map(
		( [ id, uri ] ) => `\t'${ id }' => '${ uri }',`
	).join( '\n' );

	const php = `<?php
/**
 * Curated Bootstrap Icons as base64 SVG data-URIs for the icon picker.
 *
 * GENERATED — do not edit by hand. Run \`node bin/generate-bootstrap-icons.mjs\`
 * to regenerate. Source: Bootstrap Icons v${ version } (MIT). Icons are recoloured
 * to WordPress's menu grey (${ MENU_GREY }); see the generator for the rationale.
 *
 * Fill-resolution policy (ICON-01): *-fill variants preferred; 7 names use a
 * solid synonym; ${ retainedOutline.length } names retained as outline (no solid form available).
 *
 * @package Maestro
 */

defined( 'ABSPATH' ) || exit;

return array(
${ lines }
);
`;

	writeFileSync( OUT, php, 'utf8' );
	console.log( `Wrote ${ entries.length } icons to ${ OUT }` );
	if ( retainedOutline.length ) {
		console.log( `Retained as outline (${ retainedOutline.length }): ${ retainedOutline.join( ', ' ) }` );
	}
}

if ( process.argv[ 1 ] === fileURLToPath( import.meta.url ) ) {
	main();
}
