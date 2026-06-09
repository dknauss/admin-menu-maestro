<?php
/**
 * The edit-mode toggle.
 *
 * Deliberately hung off the admin bar, NOT the admin menu — it would be absurd
 * (and fragile) for the toggle to live inside the very menu it rearranges and
 * can hide. The toggle just flips a URL param; nothing is persisted.
 *
 * @package AdminMenuCustomizer
 */

namespace AMX;

defined( 'ABSPATH' ) || exit;

class Admin_Bar {

	public function __construct() {
		add_action( 'admin_bar_menu', array( $this, 'node' ), 100 );
	}

	/**
	 * Add the toggle node.
	 *
	 * @param \WP_Admin_Bar $bar Admin bar instance.
	 * @return void
	 */
	public function node( $bar ) {
		if ( ! is_admin() || ! current_user_can( capability() ) ) {
			return;
		}

		$editing = is_edit_mode();

		// Toggle target: current URL with amx_edit added or removed.
		$current = remove_query_arg( 'amx_edit' );
		$href    = $editing ? $current : add_query_arg( 'amx_edit', '1', $current );

		$bar->add_node(
			array(
				'id'    => 'amx-toggle',
				'title' => $editing
					? '<span class="ab-icon dashicons dashicons-yes" style="margin-top:2px;"></span>' . esc_html__( 'Exit Menu Editor', 'amx-inline-menu-editor' )
					: '<span class="ab-icon dashicons dashicons-admin-generic" style="margin-top:2px;"></span>' . esc_html__( 'Edit Menu', 'amx-inline-menu-editor' ),
				'href'  => esc_url( $href ),
				'meta'  => array(
					'title' => esc_attr__( 'Toggle in-place admin menu editing', 'amx-inline-menu-editor' ),
				),
			)
		);
	}
}
