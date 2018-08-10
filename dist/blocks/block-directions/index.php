<?php
/**
 * Server-side rendering for the directions block
 *
 * @since   1.0.0
 * @package WPZOOM Recipe Card
 */

/**
 * Registers the `wpzoom-recipe-card/block-directions` block on server.
 */
function wpzoom_recipe_card_boilerplate_block_directions() {
    // check if register function exists
    if ( ! function_exists('register_block_type') ) {
    	return;
    }

    wp_register_script(
        "wpzoom-recipe-card-block-directions",
        plugins_url( 'block.js', __FILE__ ),
        array( 'wp-blocks', 'wp-i18n', 'wp-element' ), // Dependencies.
        filemtime( plugin_dir_path( __FILE__ ) . 'block.js' ) // filemtime Gets file modification time.
    );
    // wp_register_style(
    //     "wpzoom-recipe-card-block-directions-editor",
    //     plugins_url( 'editor.css', __FILE__ ),
    //     array( 'wp-edit-blocks' ),
    //     filemtime( plugin_dir_path( __FILE__ ) . "editor.css" )
    // );

    wp_register_style(
        'wpzoom-recipe-card-block-directions-style',
        plugins_url( 'style.css', __FILE__ ),
        array(),
        filemtime( plugin_dir_path( __FILE__ ) . "style.css" )
    );

    register_block_type( "wpzoom-recipe-card/block-directions", array(
        'editor_script' => "wpzoom-recipe-card-block-directions", // Editor script
        'style'         => "wpzoom-recipe-card-block-directions-style", // Styles
    ) );

    wp_localize_script( "wpzoom-recipe-card-block-directions", "wpzoomRecipeCard", array( 'plugin_url' => plugins_url('wpzoom-recipe-card') ) );
}

add_action( 'init', 'wpzoom_recipe_card_boilerplate_block_directions' );

?>