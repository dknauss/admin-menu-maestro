<?php
/**
 * Uninstall cleanup for Maestro.
 *
 * @package Maestro
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

delete_option( 'maestro_config' );
