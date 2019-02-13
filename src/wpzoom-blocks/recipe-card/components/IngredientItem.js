/* WordPress dependencies */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { RichText } = wp.editor;
const { IconButton } = wp.components;

/**
 * A Ingredient item within a Ingredient block.
 */
export default class IngredientItem extends Component {

	/**
	 * Constructs a IngredientItem editor component.
	 *
	 * @param {Object} props This component's properties.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );
	}

	/**
	 * The insert and remove item buttons.
	 *
	 * @returns {Component} The buttons.
	 */
	getButtons() {
		const {
			item,
			removeItem,
			insertItem,
		} = this.props;

		return <div className="ingredient-item-button-container">
			<IconButton
				className="ingredient-item-button ingredient-item-button-delete editor-inserter__toggle"
				icon="trash"
				label={ __( "Delete ingredient", "wpzoom-recipe-card" ) }
				onClick={ removeItem }
			/>
			<IconButton
				className="ingredient-item-button ingredient-item-button-add editor-inserter__toggle"
				icon="editor-break"
				label={ __( "Insert ingredient", "wpzoom-recipe-card" ) }
				onClick={ insertItem }
			/>
		</div>;
	}

	/**
	 * The mover buttons.
	 *
	 * @returns {Component} the buttons.
	 */
	getMover() {
		return <div className="ingredient-item-mover">
			<IconButton
				className="editor-block-mover__control"
				onClick={ this.props.isFirst ? null : this.props.onMoveUp }
				icon="arrow-up-alt2"
				label={ __( "Move item up", "wpzoom-recipe-card" ) }
				aria-disabled={ this.props.isFirst }
			/>
			<IconButton
				className="editor-block-mover__control"
				onClick={ this.props.isLast ? null : this.props.onMoveDown }
				icon="arrow-down-alt2"
				label={ __( "Move item down", "wpzoom-recipe-card" ) }
				aria-disabled={ this.props.isLast }
			/>
		</div>;
	}

	/**
	 * Renders this component.
	 *
	 * @returns {Component} The ingredient item editor.
	 */
	render() {
		const { attributes, className } = this.props;
		const {
			index,
			item,
			onChange,
			onFocus,
			isSelected,
			subElement,
			editorRef,
		} = this.props;
		const { settings } = attributes;

		const { id, name } = item;

		const isSelectedName = isSelected && subElement === "name";

		return (
			<li className="ingredient-item" key={ id }>
				<span className="tick-circle"></span>
				<RichText
					className="ingredient-item-name"
					tagName="p"
					onSetup={ ( ref ) => editorRef( "name", ref ) }
					key={ `${ id }-name` }
					value={ name }
					onChange={ ( value ) => onChange( value, name ) }
					placeholder={ __( "Enter ingredient name", "wpzoom-recipe-card" ) }
					unstableOnFocus={ () => onFocus( "name" ) }
					keepPlaceholderOnFocus={ true }
				/>
				{ isSelectedName &&
					<div className="ingredient-item-controls-container">
						{ this.getMover() }
						{ this.getButtons() }
					</div>
				}
			</li>
		);
	}
}