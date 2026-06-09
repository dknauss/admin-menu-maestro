<?php
/**
 * Storage layer for the menu overrides.
 *
 * The config is a *sparse diff* layered on top of whatever WordPress naturally
 * builds each request. We never store the full menu — only the deltas. That is
 * what makes "reset" trivial: delete the option and the natural menu shines
 * through. No snapshot of defaults to capture or keep in sync.
 *
 * Shape:
 * [
 *   'items'     => [
 *       '<slug>' => [
 *           'title'        => 'Custom Title',          // optional
 *           'icon'         => 'dashicons-foo',          // optional, top-level only
 *           'hidden_roles' => [ 'author', 'editor' ],   // optional, roles that DON'T see it
 *       ],
 *   ],
 *   'top_order' => [ '<slug>', '<slug>', ... ],          // desired top-level order
 *   'sub_order' => [ '<parent_slug>' => [ '<slug>', ... ] ],
 * ]
 *
 * @package AdminMenuCustomizer
 */

namespace AMX;

defined( 'ABSPATH' ) || exit;

class Config {

	/**
	 * In-request cache of the option.
	 *
	 * @var array|null
	 */
	private $cache = null;

	/**
	 * Read the full config.
	 *
	 * @return array
	 */
	public function get() {
		if ( null === $this->cache ) {
			$stored      = get_option( AMX_OPTION, array() );
			$this->cache = is_array( $stored ) ? $stored : array();
		}
		return $this->cache;
	}

	/**
	 * Overwrite the config wholesale with a sanitized payload.
	 *
	 * Save semantics are "full replace": the editor sends the complete desired
	 * config and we store exactly that (after sanitizing). Predictable — what you
	 * saved is what you get.
	 *
	 * @param array $raw Unsanitized incoming config.
	 * @return array The sanitized config that was stored.
	 */
	public function save( array $raw ) {
		$clean = $this->sanitize( $raw );
		update_option( AMX_OPTION, $clean, false );
		$this->cache = $clean;
		return $clean;
	}

	/**
	 * Wipe all customizations. The natural menu returns on the next load.
	 *
	 * @return void
	 */
	public function reset() {
		delete_option( AMX_OPTION );
		$this->cache = array();
	}

	/**
	 * Per-item override, or null if untouched.
	 *
	 * @param string $slug Menu slug.
	 * @return array|null
	 */
	public function item( $slug ) {
		$cfg = $this->get();
		return isset( $cfg['items'][ $slug ] ) ? $cfg['items'][ $slug ] : null;
	}

	/**
	 * Validate and normalize an incoming config payload.
	 *
	 * Note: we do NOT verify that slugs still correspond to live menu items.
	 * The replay engine applies only what it finds and ignores orphans, so a
	 * stale slug degrades silently rather than erroring.
	 *
	 * @param array $raw Raw payload.
	 * @return array
	 */
	public function sanitize( array $raw ) {
		$out = array(
			'items'     => array(),
			'top_order' => array(),
			'sub_order' => array(),
		);

		$valid_roles = array_keys( wp_roles()->get_names() );

		if ( ! empty( $raw['items'] ) && is_array( $raw['items'] ) ) {
			foreach ( $raw['items'] as $slug => $item ) {
				$slug  = $this->clean_slug( $slug );
				$entry = array();

				if ( isset( $item['title'] ) && '' !== trim( (string) $item['title'] ) ) {
					$entry['title'] = sanitize_text_field( $item['title'] );
				}

				if ( ! empty( $item['icon'] ) && self::is_valid_icon( $item['icon'] ) ) {
					$entry['icon'] = sanitize_html_class( $item['icon'] );
				}

				if ( ! empty( $item['hidden_roles'] ) && is_array( $item['hidden_roles'] ) ) {
					$roles = array_values(
						array_intersect( array_map( 'sanitize_key', $item['hidden_roles'] ), $valid_roles )
					);
					if ( $roles ) {
						$entry['hidden_roles'] = $roles;
					}
				}

				if ( $entry ) {
					$out['items'][ $slug ] = $entry;
				}
			}
		}

		if ( ! empty( $raw['top_order'] ) && is_array( $raw['top_order'] ) ) {
			$out['top_order'] = array_values( array_map( array( $this, 'clean_slug' ), $raw['top_order'] ) );
		}

		if ( ! empty( $raw['sub_order'] ) && is_array( $raw['sub_order'] ) ) {
			foreach ( $raw['sub_order'] as $parent => $children ) {
				if ( is_array( $children ) ) {
					$out['sub_order'][ $this->clean_slug( $parent ) ] =
						array_values( array_map( array( $this, 'clean_slug' ), $children ) );
				}
			}
		}

		return $out;
	}

	/**
	 * Slugs can be query-arg URLs ("edit.php?post_type=page"), so we can't run
	 * them through sanitize_key. We strip tags/encode-nasties but preserve the
	 * ? = . / characters that legitimately appear in core slugs.
	 *
	 * @param string $slug Raw slug.
	 * @return string
	 */
	private function clean_slug( $slug ) {
		$slug = wp_strip_all_tags( (string) $slug );
		return trim( $slug );
	}

	/**
	 * v1 accepts dashicons only. The picker offers a curated set, but any
	 * well-formed dashicons-* class is allowed for forward-compatibility.
	 *
	 * Public + static so it is unit-testable in isolation (it is pure).
	 *
	 * @param string $icon Candidate icon class.
	 * @return bool
	 */
	public static function is_valid_icon( $icon ) {
		return (bool) preg_match( '/^dashicons-[a-z0-9\-]+$/', (string) $icon );
	}
}
