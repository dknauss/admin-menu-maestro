<?php
/**
 * PHPStan bootstrap constants for standalone analysis.
 *
 * @package Maestro
 */

if ( ! defined( 'MAESTRO_VERSION' ) ) {
	define( 'MAESTRO_VERSION', '1.1.1' );
}
if ( ! defined( 'MAESTRO_FILE' ) ) {
	define( 'MAESTRO_FILE', __DIR__ . '/../maestro-menu-editor.php' );
}
if ( ! defined( 'MAESTRO_DIR' ) ) {
	define( 'MAESTRO_DIR', dirname( __DIR__ ) . '/' );
}
if ( ! defined( 'MAESTRO_URL' ) ) {
	define( 'MAESTRO_URL', 'https://example.test/wp-content/plugins/maestro-menu-editor/' );
}
if ( ! defined( 'MAESTRO_OPTION' ) ) {
	define( 'MAESTRO_OPTION', 'maestro_config' );
}
