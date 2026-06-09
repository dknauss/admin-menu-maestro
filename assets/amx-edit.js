/**
 * Admin Menu Customizer — in-place editor.
 *
 * Design: we do NOT scrape the DOM to discover the menu. PHP hands us a precise
 * model (amxData.menu) with the DOM <li> id for each top-level item and the
 * ordered submenu slugs. We locate nodes from that model, attach editing
 * affordances, and keep a working copy of state keyed by slug. On save we diff
 * against the pristine defaults so the stored config stays a sparse delta.
 *
 * jQuery is used only for the sortable drag layer; everything else is vanilla.
 */
( function ( $ ) {
	'use strict';

	if ( typeof window.amxData === 'undefined' ) {
		return;
	}

	var D = window.amxData;
	var I = D.i18n;

	// Flat working model: slug -> { title, icon, hiddenRoles, isSub }.
	var model = {};

	/* ---------- helpers ---------------------------------------------------- */

	function pristineTop( slug ) {
		return ( D.pristine.top && D.pristine.top[ slug ] ) || { title: '', icon: '' };
	}
	function pristineSub( slug ) {
		return ( D.pristine.sub && D.pristine.sub[ slug ] ) || { title: '' };
	}
	function el( tag, cls, html ) {
		var n = document.createElement( tag );
		if ( cls ) { n.className = cls; }
		if ( html != null ) { n.innerHTML = html; }
		return n;
	}
	function closePopovers() {
		document.querySelectorAll( '.amx-popover' ).forEach( function ( p ) { p.remove(); } );
	}

	/* ---------- build model + wire the DOM --------------------------------- */

	function init() {
		document.body.classList.add( 'amx-editing' );

		D.menu.forEach( function ( node ) {
			model[ node.slug ] = {
				title: node.title,
				icon: node.icon,
				hiddenRoles: node.hiddenRoles.slice(),
				isSub: false
			};

			var li = node.liId ? document.getElementById( node.liId ) : null;
			if ( ! li ) { return; }
			li.dataset.amxSlug = node.slug;
			li.classList.add( 'amx-item' );

			decorateTop( li, node );

			// Submenu children: skip the .wp-submenu-head, then zip by index.
			var subLis = li.querySelectorAll( '.wp-submenu > li:not(.wp-submenu-head)' );
			node.submenu.forEach( function ( child, idx ) {
				model[ child.slug ] = {
					title: child.title,
					icon: '',
					hiddenRoles: child.hiddenRoles.slice(),
					isSub: true
				};
				var sli = subLis[ idx ];
				if ( ! sli ) { return; }
				sli.dataset.amxSlug = child.slug;
				sli.classList.add( 'amx-subitem' );
				decorateSub( sli, child );
			} );
		} );

		initSortables();
		buildToolbar();
		blockNavigation();
	}

	/* ---------- top-level item -------------------------------------------- */

	function decorateTop( li, node ) {
		var anchor = li.querySelector( 'a.menu-top' ) || li.querySelector( 'a' );
		var name   = li.querySelector( '.wp-menu-name' );

		// Drag handle.
		var handle = el( 'span', 'amx-handle dashicons dashicons-move' );
		handle.title = 'Drag to reorder';
		li.insertBefore( handle, li.firstChild );

		// Click the label to rename.
		if ( name ) {
			name.classList.add( 'amx-editable' );
			name.addEventListener( 'click', function ( e ) {
				e.preventDefault();
				e.stopPropagation();
				startRename( name, node.slug, true );
			} );
		}

		// Controls row.
		var controls = el( 'span', 'amx-controls' );

		var iconBtn = el( 'button', 'amx-btn', '<span class="dashicons dashicons-art"></span>' );
		iconBtn.type = 'button';
		iconBtn.title = I.icon;
		iconBtn.addEventListener( 'click', function ( e ) {
			e.preventDefault(); e.stopPropagation();
			openIconPicker( iconBtn, node.slug, li );
		} );
		controls.appendChild( iconBtn );

		controls.appendChild( visibilityButton( node.slug, li ) );
		controls.appendChild( resetButton( node.slug, true, li ) );

		if ( anchor ) { anchor.appendChild( controls ); }
	}

	/* ---------- submenu item ---------------------------------------------- */

	function decorateSub( sli, child ) {
		var anchor = sli.querySelector( 'a' );

		var handle = el( 'span', 'amx-subhandle dashicons dashicons-move' );
		handle.title = 'Drag to reorder';
		sli.insertBefore( handle, sli.firstChild );

		if ( anchor ) {
			anchor.classList.add( 'amx-editable' );
			anchor.addEventListener( 'click', function ( e ) {
				e.preventDefault();
				e.stopPropagation();
				startRename( anchor, child.slug, false );
			} );

			var controls = el( 'span', 'amx-controls' );
			controls.appendChild( visibilityButton( child.slug, sli ) );
			controls.appendChild( resetButton( child.slug, false, sli ) );
			anchor.appendChild( controls );
		}
	}

	/* ---------- rename ----------------------------------------------------- */

	function startRename( target, slug, isTop ) {
		if ( target.querySelector( '.amx-rename-input' ) ) { return; }

		var current = model[ slug ].title;
		var input = el( 'input', 'amx-rename-input' );
		input.type = 'text';
		input.value = current;

		// Keep our injected controls; swap only the label text for the input.
		var controls = target.querySelector( '.amx-controls' );
		target.textContent = '';
		target.appendChild( input );
		if ( controls ) { target.appendChild( controls ); }
		input.focus();
		input.select();

		function commit() {
			var val = input.value.trim();
			model[ slug ].title = val || current;
			renderLabel( target, slug, isTop );
		}
		input.addEventListener( 'keydown', function ( e ) {
			if ( e.key === 'Enter' ) { e.preventDefault(); commit(); }
			if ( e.key === 'Escape' ) { renderLabel( target, slug, isTop ); }
		} );
		input.addEventListener( 'blur', commit );
	}

	function renderLabel( target, slug, isTop ) {
		var controls = target.querySelector( '.amx-controls' );
		target.textContent = model[ slug ].title;
		if ( controls ) { target.appendChild( controls ); }
		// Re-bind the rename click since we wiped children.
		target.addEventListener( 'click', function handler( e ) {
			e.preventDefault(); e.stopPropagation();
			target.removeEventListener( 'click', handler );
			startRename( target, slug, isTop );
		}, { once: true } );
	}

	/* ---------- icon picker (top-level only) ------------------------------- */

	function openIconPicker( anchorBtn, slug, li ) {
		closePopovers();
		var pop = el( 'div', 'amx-popover amx-icon-popover' );
		var grid = el( 'div', 'amx-icon-grid' );

		D.dashicons.forEach( function ( dc ) {
			var b = el( 'button', 'amx-icon-cell dashicons ' + dc );
			b.type = 'button';
			b.title = dc;
			if ( model[ slug ].icon === dc ) { b.classList.add( 'is-current' ); }
			b.addEventListener( 'click', function ( e ) {
				e.preventDefault();
				model[ slug ].icon = dc;
				applyIconPreview( li, dc );
				closePopovers();
			} );
			grid.appendChild( b );
		} );

		pop.appendChild( grid );
		placePopover( pop, anchorBtn );
	}

	function applyIconPreview( li, dc ) {
		var img = li.querySelector( '.wp-menu-image' );
		if ( ! img ) { return; }
		// Drop every dashicons-* token (including dashicons-before), then re-add
		// the marker class plus the chosen icon. Splitting on whitespace avoids
		// the earlier regex that also matched "dashicons-before".
		var keep = img.className.split( /\s+/ ).filter( function ( c ) {
			return c && c.indexOf( 'dashicons-' ) !== 0;
		} );
		keep.push( 'dashicons-before', dc );
		img.className = keep.join( ' ' );
		img.style.backgroundImage = ''; // clear any custom SVG/url icon.
	}

	/* ---------- visibility ------------------------------------------------- */

	function visibilityButton( slug, li ) {
		var btn = el( 'button', 'amx-btn', '<span class="dashicons dashicons-visibility"></span>' );
		btn.type = 'button';
		btn.title = I.visibility;
		btn.addEventListener( 'click', function ( e ) {
			e.preventDefault(); e.stopPropagation();
			openVisibility( btn, slug, li );
		} );
		return btn;
	}

	function openVisibility( anchorBtn, slug, li ) {
		closePopovers();
		var pop = el( 'div', 'amx-popover amx-vis-popover' );
		pop.appendChild( el( 'p', 'amx-vis-head', I.hideFrom ) );

		Object.keys( D.roles ).forEach( function ( roleKey ) {
			var row = el( 'label', 'amx-vis-row' );
			var cb = el( 'input' );
			cb.type = 'checkbox';
			cb.value = roleKey;
			cb.checked = model[ slug ].hiddenRoles.indexOf( roleKey ) !== -1;
			cb.addEventListener( 'change', function () {
				var set = model[ slug ].hiddenRoles;
				if ( cb.checked ) {
					if ( set.indexOf( roleKey ) === -1 ) { set.push( roleKey ); }
				} else {
					model[ slug ].hiddenRoles = set.filter( function ( r ) { return r !== roleKey; } );
				}
				li.classList.toggle( 'amx-has-hidden', model[ slug ].hiddenRoles.length > 0 );
			} );
			row.appendChild( cb );
			row.appendChild( document.createTextNode( ' ' + D.roles[ roleKey ] ) );
			pop.appendChild( row );
		} );

		placePopover( pop, anchorBtn );
	}

	/* ---------- per-item reset -------------------------------------------- */

	function resetButton( slug, isTop, li ) {
		var btn = el( 'button', 'amx-btn', '<span class="dashicons dashicons-image-rotate"></span>' );
		btn.type = 'button';
		btn.title = I.resetItem;
		btn.addEventListener( 'click', function ( e ) {
			e.preventDefault(); e.stopPropagation();
			var def = isTop ? pristineTop( slug ) : pristineSub( slug );
			model[ slug ].title = def.title;
			model[ slug ].hiddenRoles = [];
			li.classList.remove( 'amx-has-hidden' );

			if ( isTop ) {
				model[ slug ].icon = def.icon || '';
				if ( def.icon ) { applyIconPreview( li, def.icon ); }
				var name = li.querySelector( '.wp-menu-name' );
				if ( name ) { renderLabel( name, slug, true ); }
			} else {
				var a = li.querySelector( 'a' );
				if ( a ) { renderLabel( a, slug, false ); }
			}
		} );
		return btn;
	}

	/* ---------- popover placement ----------------------------------------- */

	function placePopover( pop, anchorBtn ) {
		document.body.appendChild( pop );
		var r = anchorBtn.getBoundingClientRect();
		pop.style.top = ( window.scrollY + r.bottom + 4 ) + 'px';
		pop.style.left = ( window.scrollX + r.left ) + 'px';

		setTimeout( function () {
			document.addEventListener( 'click', function handler( e ) {
				if ( ! pop.contains( e.target ) ) {
					pop.remove();
					document.removeEventListener( 'click', handler );
				}
			} );
		}, 0 );
	}

	/* ---------- sortable --------------------------------------------------- */

	function initSortables() {
		$( '#adminmenu' ).sortable( {
			items: '> li.menu-top.amx-item',
			handle: '.amx-handle',
			axis: 'y',
			tolerance: 'pointer',
			cursor: 'grabbing'
		} );

		$( '#adminmenu .wp-submenu' ).each( function () {
			$( this ).sortable( {
				items: '> li.amx-subitem',
				handle: '.amx-subhandle',
				axis: 'y',
				tolerance: 'pointer',
				cursor: 'grabbing'
			} );
		} );
	}

	/* ---------- block real navigation while editing ----------------------- */

	function blockNavigation() {
		document.getElementById( 'adminmenu' ).addEventListener( 'click', function ( e ) {
			var a = e.target.closest( 'a' );
			if ( a && ! e.target.closest( '.amx-controls' ) ) {
				e.preventDefault();
			}
		}, true );
	}

	/* ---------- toolbar + persistence ------------------------------------- */

	function buildToolbar() {
		var bar = el( 'div', 'amx-toolbar' );
		bar.appendChild( el( 'span', 'amx-toolbar-title', I.editorTitle ) );

		var save = el( 'button', 'button button-primary amx-save', I.save );
		save.type = 'button';
		save.addEventListener( 'click', doSave );

		var resetAll = el( 'button', 'button amx-reset-all', I.resetAll );
		resetAll.type = 'button';
		resetAll.addEventListener( 'click', doResetAll );

		var exit = el( 'a', 'button amx-exit', I.exit );
		exit.href = D.exitUrl;

		bar.appendChild( save );
		bar.appendChild( resetAll );
		bar.appendChild( exit );
		document.body.appendChild( bar );
	}

	function buildConfig() {
		var cfg = { items: {}, top_order: [], sub_order: {} };

		document.querySelectorAll( '#adminmenu > li.menu-top.amx-item[data-amx-slug]' ).forEach( function ( li ) {
			var slug = li.dataset.amxSlug;
			cfg.top_order.push( slug );

			var m = model[ slug ];
			var def = pristineTop( slug );
			var entry = {};
			if ( m.title && m.title !== def.title ) { entry.title = m.title; }
			if ( m.icon && m.icon !== def.icon ) { entry.icon = m.icon; }
			if ( m.hiddenRoles.length ) { entry.hidden_roles = m.hiddenRoles; }
			if ( Object.keys( entry ).length ) { cfg.items[ slug ] = entry; }

			var subLis = li.querySelectorAll( '.wp-submenu > li.amx-subitem[data-amx-slug]' );
			if ( subLis.length ) {
				cfg.sub_order[ slug ] = [];
				subLis.forEach( function ( sli ) {
					var sslug = sli.dataset.amxSlug;
					cfg.sub_order[ slug ].push( sslug );

					var sm = model[ sslug ];
					var sdef = pristineSub( sslug );
					var se = {};
					if ( sm.title && sm.title !== sdef.title ) { se.title = sm.title; }
					if ( sm.hiddenRoles.length ) { se.hidden_roles = sm.hiddenRoles; }
					if ( Object.keys( se ).length ) { cfg.items[ sslug ] = se; }
				} );
			}
		} );

		return cfg;
	}

	function doSave( e ) {
		var btn = e.currentTarget;
		btn.disabled = true;
		btn.textContent = I.saving;

		fetch( D.restUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': D.nonce
			},
			credentials: 'same-origin',
			body: JSON.stringify( { config: buildConfig() } )
		} )
			.then( function ( r ) { return r.json(); } )
			.then( function () {
				btn.textContent = I.saved;
				// Reload (staying in edit mode) so server render + model re-sync.
				window.location.reload();
			} )
			.catch( function () {
				btn.disabled = false;
				btn.textContent = I.save;
				window.alert( 'Save failed. Check the console / your network settings.' );
			} );
	}

	function doResetAll() {
		if ( ! window.confirm( I.confirmAll ) ) { return; }
		fetch( D.restUrl, {
			method: 'DELETE',
			headers: { 'X-WP-Nonce': D.nonce },
			credentials: 'same-origin'
		} )
			.then( function () { window.location.reload(); } )
			.catch( function () { window.alert( 'Reset failed.' ); } );
	}

	/* ---------- go --------------------------------------------------------- */

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}

} )( jQuery );
