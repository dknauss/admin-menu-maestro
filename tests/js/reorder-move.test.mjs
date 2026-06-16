/**
 * Unit tests for reorderMove — pure function that shifts a slug
 * one position in a menu order array, clamped at the ends.
 *
 * Imports via createRequire so the CJS dual-export guard in
 * assets/maestro-logic.js works without a build step.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire( import.meta.url );
const { reorderMove } = require( '../../assets/maestro-logic.js' );

// Basic moves
test( 'move b up in [a,b,c] -> [b,a,c]', () => {
	assert.deepEqual( reorderMove( [ 'a', 'b', 'c' ], 'b', 'up' ), [ 'b', 'a', 'c' ] );
} );

test( 'move b down in [a,b,c] -> [a,c,b]', () => {
	assert.deepEqual( reorderMove( [ 'a', 'b', 'c' ], 'b', 'down' ), [ 'a', 'c', 'b' ] );
} );

// Clamped at boundaries
test( 'move a up (already first) -> unchanged [a,b,c]', () => {
	assert.deepEqual( reorderMove( [ 'a', 'b', 'c' ], 'a', 'up' ), [ 'a', 'b', 'c' ] );
} );

test( 'move c down (already last) -> unchanged [a,b,c]', () => {
	assert.deepEqual( reorderMove( [ 'a', 'b', 'c' ], 'c', 'down' ), [ 'a', 'b', 'c' ] );
} );

// Missing slug
test( 'slug not present -> returns copy of original order', () => {
	const order = [ 'a', 'b', 'c' ];
	const result = reorderMove( order, 'z', 'up' );
	assert.deepEqual( result, [ 'a', 'b', 'c' ] );
} );

// Immutability — input array must NOT be mutated
test( 'input array is not mutated', () => {
	const order = [ 'a', 'b', 'c' ];
	const copy = order.slice();
	reorderMove( order, 'b', 'up' );
	assert.deepEqual( order, copy );
} );

test( 'result is a new array reference', () => {
	const order = [ 'a', 'b', 'c' ];
	const result = reorderMove( order, 'b', 'up' );
	assert.notStrictEqual( result, order );
} );

// Edge cases
test( 'single-element array returns safely', () => {
	assert.deepEqual( reorderMove( [ 'only' ], 'only', 'up' ), [ 'only' ] );
	assert.deepEqual( reorderMove( [ 'only' ], 'only', 'down' ), [ 'only' ] );
} );

test( 'empty array returns safely', () => {
	assert.deepEqual( reorderMove( [], 'a', 'up' ), [] );
} );
