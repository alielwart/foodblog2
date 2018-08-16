<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package recipe-card-blocks-by-wpzoom
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'WPZOOM_RCB_VERSION', '1.0.0' );

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 *
 * @since 1.0.0
 */
function recipe_card_blocks_by_wpzoom_rcb_block_assets() {
	// Scripts.
	wp_enqueue_script(
	    'recipe_card_blocks_by_wpzoom-rcb-script',
	    plugins_url( 'assets/js/script.js', __FILE__ ),
	    array('jquery'),
	    WPZOOM_RCB_VERSION
	);

	// Styles.
	wp_enqueue_style(
		'recipe_card_blocks_by_wpzoom-rcb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-blocks' ), // Dependency to include the CSS after it.
		WPZOOM_RCB_VERSION
	);

	wp_enqueue_style(
    	'recipe_card_blocks_by_wpzoom-rcb-google-font',
    	'https://fonts.googleapis.com/css?family=Roboto+Condensed:400,400i,700,700i',
    	false
    );
} // End function recipe_card_blocks_by_wpzoom_rcb_block_assets().

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'recipe_card_blocks_by_wpzoom_rcb_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function recipe_card_blocks_by_wpzoom_rcb_editor_assets() {
	// Scripts.
	wp_enqueue_script(
		'recipe_card_blocks_by_wpzoom-rcb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element' ), // Dependencies, defined above.
		WPZOOM_RCB_VERSION,
		true // Enqueue the script in the footer.
	);

	wp_localize_script(
		"recipe_card_blocks_by_wpzoom-rcb-block-js",
		"wpzoomRecipeCard",
		array( 'pluginURL' => plugins_url('recipe-card-blocks-by-wpzoom'))
	);

	// Styles.
	wp_enqueue_style(
		'recipe_card_blocks_by_wpzoom-rcb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
		WPZOOM_RCB_VERSION
	);
} // End function recipe_card_blocks_by_wpzoom_rcb_editor_assets().

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'recipe_card_blocks_by_wpzoom_rcb_editor_assets' );

