import { defineConfig, devices } from '@playwright/test';

/**
 * E2E config for the in-place menu editor.
 *
 * Targets the wp-env *tests* instance (port 8889 by default), whose default admin login is
 * admin / password. global-setup logs in once and stores the session so specs
 * start authenticated.
 */
const testsPort = process.env.WP_ENV_TESTS_PORT || '8889';

export default defineConfig( {
	testDir: './tests/e2e',
	globalSetup: './tests/e2e/global-setup.ts',
	timeout: 30_000,
	expect: { timeout: 10_000 },
	fullyParallel: false,
	retries: 0,
	reporter: 'list',
	use: {
		baseURL: `http://localhost:${ testsPort }`,
		storageState: './tests/e2e/.auth/admin.json',
		trace: 'on-first-retry',
	},
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
	],
} );
