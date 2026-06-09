<?php
/**
 * Plugin Name:       Inline Admin Menu Editor (AMX)
 * Plugin URI:        https://newlocal.media/amx-inline-menu-editor
 * Description:        In-place editing of the WordPress admin menu — rename items, reorder them, swap top-level dashicons, and hide items per role. Global config, no separate settings screen. Cosmetic only: hiding declutters, it does not lock access.
 * Version:           1.0.0
 * Requires at least: 6.4
 * Requires PHP:      7.4
 * Author:            Dan Knauss
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       amx-inline-menu-editor
 * Update URI:        false
 *
 * The unique slug + "Update URI: false" together prevent a similarly-named
 * plugin in the WordPress.org directory from silently overwriting this local
 * code on update (the "plugin confusion" risk). Do not change the slug to a
 * generic term without keeping Update URI set.
 *
 * @package AdminMenuCustomizer
 */

namespace AMX;

defined( 'ABSPATH' ) || exit;

define( 'AMX_VERSION', '1.0.0' );
define( 'AMX_FILE', __FILE__ );
define( 'AMX_DIR', plugin_dir_path( __FILE__ ) );
define( 'AMX_URL', plugin_dir_url( __FILE__ ) );
define( 'AMX_OPTION', 'amx_config' );

require_once AMX_DIR . 'includes/class-amx-config.php';
require_once AMX_DIR . 'includes/class-amx-ordering.php';
require_once AMX_DIR . 'includes/class-amx-replay.php';
require_once AMX_DIR . 'includes/class-amx-rest.php';
require_once AMX_DIR . 'includes/class-amx-adminbar.php';
require_once AMX_DIR . 'includes/class-amx-assets.php';

/**
 * The capability required to edit the menu. Filterable so a role/cap manager
 * can hand this to a custom cap (e.g. 'amx_edit_menu') instead of the default.
 *
 * @return string
 */
function capability() {
	return (string) apply_filters( 'amx_capability', 'manage_options' );
}

/**
 * Are we currently in edit mode? Gated on capability so the flag alone is inert
 * for anyone who can't edit. Edit mode is driven by a URL param — stateless,
 * nothing persisted, nothing to clean up.
 *
 * @return bool
 */
function is_edit_mode() {
	return isset( $_GET['amx_edit'] ) && current_user_can( capability() ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
}

/**
 * Boot the plugin. One Config instance is shared by everyone so the pristine
 * snapshot captured during the replay pass is reachable at asset-enqueue time.
 */
function boot() {
	$config = new Config();
	$replay = new Replay( $config );

	new Rest( $config );
	new Admin_Bar();
	new Assets( $config, $replay );
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\\boot' );
