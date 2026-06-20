#!/usr/bin/env node
/**
 * npm audit wrapper with a narrow, documented dev-tooling exception.
 *
 * @wordpress/env currently depends on js-yaml 3.x and npm reports
 * GHSA-h67p-54hq-rp68. This repository uses @wordpress/env only in local/CI
 * development to start disposable WordPress test containers; it is never shipped
 * in the runtime plugin zip. Keep this allowlist small and remove it as soon as
 * upstream publishes a non-vulnerable dependency path.
 */
import { spawnSync } from 'node:child_process';

const allowed = new Set( [ 'GHSA-h67p-54hq-rp68' ] );
const result = spawnSync( 'npm', [ 'audit', '--json' ], { encoding: 'utf8' } );
const stdout = result.stdout || '{}';
let report;
try {
	report = JSON.parse( stdout );
} catch ( error ) {
	process.stdout.write( stdout );
	process.stderr.write( result.stderr || '' );
	process.exit( result.status || 1 );
}

const findings = [];
for ( const vulnerability of Object.values( report.vulnerabilities || {} ) ) {
	for ( const via of vulnerability.via || [] ) {
		if ( typeof via === 'string' ) {
			continue;
		}
		const url = via.url || '';
		const id = url.split( '/' ).pop();
		if ( ! allowed.has( id ) ) {
			findings.push( { name: vulnerability.name, title: via.title, severity: via.severity, url } );
		}
	}
}

if ( findings.length ) {
	console.error( JSON.stringify( findings, null, 2 ) );
	process.exit( 1 );
}

if ( ( report.metadata?.vulnerabilities?.total || 0 ) > 0 ) {
	console.log( 'npm audit: only allowlisted dev-tooling advisories found.' );
} else {
	console.log( 'npm audit: no vulnerabilities found.' );
}
