import { chromium, FullConfig } from '@playwright/test';
import { execFileSync } from 'child_process';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

/**
 * Log in to the wp-env tests instance once and save the storage state so every
 * spec starts authenticated. wp-env's tests site default credentials are
 * admin / password.
 */
function ensureEditorUser() {
	try {
		execFileSync( 'npx', [ 'wp-env', 'run', 'tests-cli', 'wp', 'user', 'get', 'maestro_editor' ], { stdio: 'ignore' } );
	} catch ( e ) {
		execFileSync(
			'npx',
			[
				'wp-env',
				'run',
				'tests-cli',
				'wp',
				'user',
				'create',
				'maestro_editor',
				'maestro-editor@example.com',
				'--role=editor',
				'--user_pass=password',
			],
			{ stdio: 'inherit' }
		);
	}
	execFileSync( 'npx', [ 'wp-env', 'run', 'tests-cli', 'wp', 'user', 'update', 'maestro_editor', '--user_pass=password' ], { stdio: 'inherit' } );
}

function ensureAdminPassword() {
	execFileSync( 'npx', [ 'wp-env', 'run', 'tests-cli', 'wp', 'user', 'update', 'admin', '--user_pass=password' ], { stdio: 'inherit' } );
}

async function globalSetup( config: FullConfig ) {
	const statePath = './tests/e2e/.auth/admin.json';
	mkdirSync( dirname( statePath ), { recursive: true } );
	ensureAdminPassword();
	ensureEditorUser();

	const browser = await chromium.launch();
	const page = await browser.newPage();

	// Honor WP_ENV_TESTS_PORT so the login matches playwright.config.ts's baseURL
	// when the tests instance runs on a non-default port (e.g. to dodge a port
	// collision with another wp-env project).
	const testsPort = process.env.WP_ENV_TESTS_PORT || '8889';
	await page.goto( `http://localhost:${ testsPort }/wp-login.php`, { waitUntil: 'domcontentloaded' } );
	await page.waitForSelector( '#user_login', { state: 'visible' } );
	await page.fill( '#user_login', 'admin' );
	await page.fill( '#user_pass', 'password' );
	await Promise.all( [
		page.waitForURL( /wp-admin/, { waitUntil: 'domcontentloaded' } ),
		page.click( '#wp-submit' ),
	] );

	await page.context().storageState( { path: statePath } );
	await browser.close();
}

export default globalSetup;
