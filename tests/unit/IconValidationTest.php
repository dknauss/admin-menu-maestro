<?php
/**
 * Pure unit tests for the icon validator. Establishes the v1 contract:
 * well-formed lowercase dashicons-* classes only.
 *
 * @package AdminMenuCustomizer
 */

namespace AMX\Tests\Unit;

use AMX\Config;
use Yoast\PHPUnitPolyfills\TestCases\TestCase;

class IconValidationTest extends TestCase {

	/**
	 * @dataProvider valid_icons
	 */
	public function test_accepts_valid_dashicons( $icon ) {
		$this->assertTrue( Config::is_valid_icon( $icon ) );
	}

	/**
	 * @dataProvider invalid_icons
	 */
	public function test_rejects_invalid_icons( $icon ) {
		$this->assertFalse( Config::is_valid_icon( $icon ) );
	}

	public function valid_icons() {
		return array(
			array( 'dashicons-admin-home' ),
			array( 'dashicons-chart-pie' ),
			array( 'dashicons-a' ),
			array( 'dashicons-store' ),
		);
	}

	public function invalid_icons() {
		return array(
			'missing prefix'   => array( 'admin-home' ),
			'empty suffix'     => array( 'dashicons-' ),
			'uppercase'        => array( 'dashicons-Admin' ),
			'space'            => array( 'dashicons-admin home' ),
			'markup'           => array( '<script>alert(1)</script>' ),
			'url'              => array( 'https://evil.example/x.png' ),
			'empty'            => array( '' ),
			'underscore'       => array( 'dashicons_admin_home' ),
		);
	}
}
