import { defineConfig, devices } from '@playwright/test';

/**
 * E2E config for the in-place menu editor.
 *
 * Targets the wp-env *tests* instance (port 8889), whose default admin login is
 * admin / password. global-setup logs in once and stores the session so specs
 * start authenticated.
 */
export default defineConfig( {
	testDir: './tests/e2e',
	globalSetup: './tests/e2e/global-setup.ts',
	timeout: 30_000,
	expect: { timeout: 10_000 },
	fullyParallel: false,
	retries: 0,
	reporter: 'list',
	use: {
		baseURL: 'http://localhost:8889',
		storageState: './tests/e2e/.auth/admin.json',
		trace: 'on-first-retry',
	},
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
	],
} );
