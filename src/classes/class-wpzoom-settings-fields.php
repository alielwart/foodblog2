<?php
/**
 * Class Settings Fields
 *
 * @since   1.1.0
 * @package WPZOOM Recipe Card Block
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class for settings page.
 */
class WPZOOM_Settings_Fields {
	private $fiels_type = array( 'checkbox', 'select', 'multiselect', 'input', 'textarea', 'button' );

	/**
	 * The Constructor.
	 */
	public function __construct() {
	    // add_action( 'admin_enqueue_scripts', array( $this, 'scripts' ) );
	}

	public function get_fields_type() {
		return $this->fiels_type;
	}

	public function input( $args ) {
		// get the value of the setting we've registered with register_setting()
		$options = get_option( 'wpzoom-recipe-card-settings' );

		$value = isset( $options[ $args['label_for'] ] ) ? $options[ $args['label_for'] ] : $args['default'];
		$type = isset( $args['type'] ) ? $args['type'] : 'text';
	?>
		<div class="wpzoom-rcb-field-input">
			<?php $is_premium = isset( $args['is_premium'] ) && $args['is_premium']; ?>
				
			<?php if ( $is_premium ): ?>
				<span class="wpzoom-rcb-field-is_premium"><?php esc_html_e( 'Premium', 'wpzoom-recipe-card' ); ?></span>
			<?php endif ?>

			<input type="<?php echo esc_attr( $type ) ?>" name="<?php echo esc_attr( @$args['label_for'] ); ?>" value="<?php echo $value ?>"/>

			<?php if ( isset( $args['description'] ) ): ?>
				<p class="description">
					<?php echo $args['description']; ?>
				</p>
			<?php endif ?>
		</div>
	<?php
	}
	 
	public function checkbox( $args ) {
		// get the value of the setting we've registered with register_setting()
		$options = get_option( 'wpzoom-recipe-card-settings' );

		$checked = isset( $options[ $args['label_for'] ] ) ? $options[ $args['label_for'] ] : $args['default'];
	?>
		<div class="wpzoom-rcb-field-checkbox">
			<?php $is_premium = isset( $args['is_premium'] ) && $args['is_premium']; ?>
				
			<?php if ( $is_premium ): ?>
				<span class="wpzoom-rcb-field-is_premium"><?php esc_html_e( 'Premium', 'wpzoom-recipe-card' ); ?></span>
			<?php endif ?>

			<input type="checkbox" name="<?php echo esc_attr( @$args['label_for'] ); ?>" <?php checked( $checked, true, true ); ?> <?php echo ( $is_premium ? 'disabled' : '' ); ?>/>

			<?php if ( isset( $args['description'] ) ): ?>
				<p class="description">
					<?php echo $args['description']; ?>
				</p>
			<?php endif ?>
		</div>
	<?php
	}
	 
	public function select( $args ) {
		// get the value of the setting we've registered with register_setting()
		$options = get_option( 'wpzoom-recipe-card-settings' );
	?>
		<div class="wpzoom-rcb-field-select">
			<select id="<?php echo esc_attr( $args['label_for'] ); ?>"
				name="wpzoom_options[<?php echo esc_attr( $args['label_for'] ); ?>]"
		 	>
		 		<?php foreach ( $args['options'] as $value => $text ): ?>
		 			<option value="<?php echo esc_attr( $value ) ?>" <?php echo isset( $options[ $args['label_for'] ] ) ? ( selected( $options[ $args['label_for'] ], $value, false ) ) : ( '' ); ?>>
		 				<?php echo $text; ?>
		 			</option>
		 		<?php endforeach ?>
		 	</select>

		 	<?php if ( isset( $args['description'] ) ): ?>
		 		<p class="description">
		 			<?php echo $args['description']; ?>
		 		</p>
		 	<?php endif ?>
		</div>
	<?php
	}
	 
	public function subsection( $args ) {
		echo '';
	}

	public function scripts( $hook ) {
	    if ( $hook != 'settings_page_wpzoom-recipe-card-settings' ) {
	        return;
	    }

	    wp_enqueue_style(
	    	'wpzoom-rcb-admin-style',
	    	untrailingslashit( WPZOOM_RCB_PLUGIN_URL ) . '/dist/assets/admin/css/style.css',
	    	array(),
	    	WPZOOM_RCB_VERSION
	    );

	    wp_enqueue_script(
	    	'wpzoom-rcb-admin-script',
	    	untrailingslashit( WPZOOM_RCB_PLUGIN_URL ) . '/dist/assets/admin/js/script.js',
	    	array( 'jquery' ),
	    	WPZOOM_RCB_VERSION
	    );
	}
}
