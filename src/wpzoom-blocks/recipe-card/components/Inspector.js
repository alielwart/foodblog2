/* External dependencies */
import _get from "lodash/get";
import _map from "lodash/map";
import _compact from "lodash/compact";
import _forEach from "lodash/forEach";
import _isEmpty from "lodash/isEmpty";
import _isNull from "lodash/isNull";
import _isUndefined from "lodash/isUndefined";

/* Internal dependencies */
import { stripHTML } from "../../../helpers/stringHelpers";
import { humanize } from "../../../helpers/stringHelpers";
import { pickRelevantMediaFiles } from "../../../helpers/pickRelevantMediaFiles";

/* WordPress dependencies */
const { __ } = wp.i18n;
const { _n } = wp.i18n;
const { Component, renderToString, Fragment } = wp.element;
const { RichText, InspectorControls, MediaUpload } = wp.editor;
const { 
	BaseControl,
	PanelBody,
	PanelRow,
	ToggleControl,
	TextControl,
	TextareaControl,
	Button,
	IconButton,
	FormTokenField,
	PanelColor,
	ColorIndicator,
	ColorPalette,
	SelectControl
} = wp.components;
const { withSelect } = wp.data;
const { compose } = wp.compose;

/* Module constants */
const ALLOWED_MEDIA_TYPES = [ 'image' ];

/**
 * Inspector controls
 */
class Inspector extends Component {

	/**
	 * Constructs a Inspector editor component.
	 *
	 * @param {Object} props This component's properties.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( ...arguments );
		this.onSelectImage = this.onSelectImage.bind( this );
		this.updateURL = this.updateURL.bind( this );
	}

	onSelectImage( media ) {
		const relevantMedia = pickRelevantMediaFiles( media );

		this.props.setAttributes( {
			hasImage: true,
			image: {
				id: relevantMedia.id,
				url: relevantMedia.url,
				alt: relevantMedia.alt,
				sizes: media.sizes
			}
		} );
	}

	updateURL( url ) {
		const { id, alt, sizes } = this.props.attributes.image;
		
		this.props.setAttributes( {
			hasImage: true,
			image: {
				id: id,
				url: url,
				alt: alt,
				sizes: sizes
			}
		} );
	}

	getImageSizeOptions() {
		const { imageSizes, image } = this.props;
		return _compact( _map( imageSizes, ( { name, slug } ) => {
			const sizeUrl = _get( image, [ 'media_details', 'sizes', slug, 'source_url' ] );
			if ( ! sizeUrl ) {
				return null;
			}
			return {
				value: sizeUrl,
				label: name,
			};
		} ) );
	}

	/**
	 * Renders this component.
	 *
	 * @returns {Component} The Ingredient items block settings.
	 */
	render() {

		const {
			clientId,
			attributes,
			setAttributes
		} = this.props;

		const {
			id,
			style,
			hasImage,
			image,
			hasVideo,
			video,
			recipeTitle,
			summary,
			jsonSummary,
			course,
			cuisine,
			difficulty,
			keywords,
			ingredients,
			steps,
			details,
			settings,
		} = attributes;

		const imageSizeOptions = this.getImageSizeOptions();

		const coursesToken = [
			__( "Appetizers", "wpzoom-recipe-card" ),
            __( "Snacks", "wpzoom-recipe-card" ),
            __( "Breakfast", "wpzoom-recipe-card" ),
            __( "Brunch", "wpzoom-recipe-card" ),
            __( "Dessert", "wpzoom-recipe-card" ),
            __( "Drinks", "wpzoom-recipe-card" ),
            __( "Dinner", "wpzoom-recipe-card" ),
            __( "Main", "wpzoom-recipe-card" ),
            __( "Lunch", "wpzoom-recipe-card" ),
            __( "Salads", "wpzoom-recipe-card" ),
            __( "Sides", "wpzoom-recipe-card" ),
            __( "Soups", "wpzoom-recipe-card" ),
		];

		const cuisinesToken = [
			__( "American", "wpzoom-recipe-card" ),
			__( "Chinese", "wpzoom-recipe-card" ),
			__( "French", "wpzoom-recipe-card" ),
			__( "Indian", "wpzoom-recipe-card" ),
			__( "Italian", "wpzoom-recipe-card" ),
			__( "Japanese", "wpzoom-recipe-card" ),
			__( "Mediterranean", "wpzoom-recipe-card" ),
			__( "Mexican", "wpzoom-recipe-card" ),
			__( "Southern", "wpzoom-recipe-card" ),
			__( "Thai", "wpzoom-recipe-card" ),
			__( "Other world cuisine", "wpzoom-recipe-card" ),
		];

		const difficultyToken = [
			__( "Easy", "wpzoom-recipe-card" ),
			__( "Medium", "wpzoom-recipe-card" ),
			__( "Difficult", "wpzoom-recipe-card" ),
		];

		const keywordsToken = [];

		const onChangeSettings = ( newValue, index, param ) => {
			const settings = this.props.attributes.settings ? this.props.attributes.settings.slice() : [];

			settings[ index ][ param ] = newValue;

			setAttributes( { settings } );
		}

		const onChangeDetail = ( newValue, index ) => {
			const details = this.props.attributes.details ? this.props.attributes.details.slice() : [];

			details[ index ][ 'value' ] = newValue;
			details[ index ][ 'jsonValue' ] = stripHTML( renderToString( newValue ) );
			details[ index ][ 'jsonUnit' ] = stripHTML( renderToString( details[ index ][ 'unit' ] ) );

			setAttributes( { details } );
		}

		const removeRecipeImage = () => {
			setAttributes( { hasImage: false, image: null } )
		}

		function structuredDataTestingTool() {
			let dataTable = {
				ingredients: [],
				steps: [],
			};

			let check = {
				warnings: [],
				errors: []
			}

			for (var i = 0; i < ingredients.length; i++) {
				if ( ingredients[i].name.length !== 0 ) {
					dataTable.ingredients.push(<PanelRow><strong>recipeIngredient</strong><span>{ ingredients[i].name }</span></PanelRow>);
				}
			}

			for (var i = 0; i < steps.length; i++) {
				if ( steps[i].text.length !== 0 ) {
					dataTable.steps.push(<PanelRow><strong>recipeInstructions</strong><span>{ steps[i].text }</span></PanelRow>);
				}
			}

			RichText.isEmpty( summary ) ? check.warnings.push("summary") : '';
			! hasImage ? check.errors.push("image") : '';
			// ! hasVideo ? check.warnings.push("video") : '';
			! dataTable.ingredients.length ? check.errors.push("ingredients") : '';
			! dataTable.steps.length ? check.errors.push("steps") : '';
			! _get( details, [ 1 ,'value' ] ) ? check.warnings.push("prepTime") : '';
			! _get( details, [ 2 ,'value' ] ) ? check.warnings.push("cookTime") : '';
			! _get( details, [ 3 ,'value' ] ) ? check.warnings.push("calories") : '';

			return (
		    	<BaseControl
					id={ `${ id }-counters` }
					help={ __( "Automatically check Structured Data errors and warnings.", "wpzoom-recipe-card" ) }
				>
					<PanelRow>
						<span>{ __( "Legend:", "wpzoom-recipe-card" ) }</span>
					</PanelRow>
					<PanelRow className="text-color-red">
						<ColorIndicator aria-label={ __( "Required fields", "wpzoom-recipe-card" ) } colorValue="#ff2725" />
						<strong>{ `${ check.errors.length } ` + _n( "error", "errors", `${ check.errors.length }`, "wpzoom-recipe-card" ) }</strong>
					</PanelRow>
					<PanelRow className="text-color-orange">
						<ColorIndicator aria-label={ __( "Recommended fields", "wpzoom-recipe-card" ) } colorValue="#ef6c00" />
						<strong>{ `${ check.warnings.length } ` + _n( "warning", "warnings", `${ check.warnings.length }`, "wpzoom-recipe-card" ) }</strong>
					</PanelRow>
					<PanelRow>
						<span>{ __( "Recipe:", "wpzoom-recipe-card" ) }</span>
					</PanelRow>
            		<PanelRow>
            			<span>recipeTitle</span>
            			<strong>{ ! RichText.isEmpty( recipeTitle ) ? recipeTitle : wpzoomRecipeCard.post_title }</strong>
            		</PanelRow>
            		<PanelRow className={ RichText.isEmpty( summary ) ? "text-color-orange": "" }>
            			<span>description</span>
            			<strong>{ stripHTML( jsonSummary ) }</strong>
            		</PanelRow>
            		<PanelRow className={ ! hasImage ? "text-color-red": "" }>
            			<span>image</span>
            			<strong>{ hasImage ? image.url : '' }</strong>
            		</PanelRow>
            		<PanelRow>
            			<span>recipeYield</span>
            			<strong>{ _get( details, [ 0, 'value' ] ) ? _get( details, [ 0, 'value' ] ) + ' ' + _get( details, [ 0, 'unit' ] ) : '0 ' + _get( details, [ 0, 'unit' ] ) }</strong>
            		</PanelRow>
            		<PanelRow className={ ! _get( details, [ 1, 'value' ] ) ? "text-color-orange": "" }>
            			<span>prepTime</span>
            			<strong><strong>{ _get( details, [ 1, 'value' ] ) ? _get( details, [ 1, 'value' ] ) + ' ' + _get( details, [ 1, 'unit' ] ) : '0 ' + _get( details, [ 1, 'unit' ] ) }</strong></strong>
            		</PanelRow>
            		<PanelRow className={ ! _get( details, [ 2, 'value' ] ) ? "text-color-orange": "" }>
            			<span>cookTime</span>
            			<strong>{ _get( details, [ 2, 'value' ] ) ? _get( details, [ 2, 'value' ] ) + ' ' + _get( details, [ 2, 'unit' ] ) : '0 ' + _get( details, [ 2, 'unit' ] ) }</strong>
            		</PanelRow>
            		<PanelRow className={ ! _get( details, [ 3, 'value' ] ) ? "text-color-orange": "" }>
            			<span>calories</span>
            			<strong>{ _get( details, [ 3, 'value' ] ) ? _get( details, [ 3, 'value' ] ) + ' ' + _get( details, [ 3, 'unit' ] ) : '0 ' + _get( details, [ 3, 'unit' ] ) }</strong>
            		</PanelRow>
            		<PanelRow className={ ! dataTable.ingredients.length ? "text-color-red": "" }>
            			<span>{ __( "Ingredients", "wpzoom-recipe-card" ) }</span>
            			<strong>{ dataTable.ingredients.length }</strong>
            		</PanelRow>
            		<PanelRow className={ ! dataTable.steps.length ? "text-color-red" : "" }>
            			<span>{ __( "Steps", "wpzoom-recipe-card" ) }</span>
            			<strong>{ dataTable.steps.length }</strong>
            		</PanelRow>
            	</BaseControl>
			);
		}

		return (
			<InspectorControls>
                <PanelBody className="wpzoom-recipe-card-settings" initialOpen={ true } title={ __( "Recipe Card Settings", "wpzoom-recipe-card" ) }>
	            	<BaseControl
	        			id={ `${ id }-image` }
	        			label={ __( "Recipe Card Image (required)", "wpzoom-recipe-card" ) }
	        			help={ __( "Upload image for Recipe Card.", "wpzoom-recipe-card" ) }
	        		>
	                	<MediaUpload
	                		onSelect={ this.onSelectImage }
	                		allowedTypes={ ALLOWED_MEDIA_TYPES }
	                		value={ hasImage ? image.id : '' }
	                		render={ ( { open } ) => (
	                			<Button
	                				className={ hasImage ? "editor-post-featured-image__preview" : "editor-post-featured-image__toggle" }
	                				onClick={ open }
	                			>
	                				{ hasImage ?
	                					<img
	                                        className={ `${ id }-image` }
	                                        src={ image.sizes ? image.sizes.full.url : image.url }
	                                        alt={ image.alt ? image.alt : recipeTitle }
	                                    />
	                					: __( "Add recipe image", "wpzoom-recipe-card" )
	                                }
	                			</Button>
	                		) }
	                	/>
	                	{ hasImage ? <Button isLink="true" isDestructive="true" onClick={ removeRecipeImage }>{ __( "Remove Image", "wpzoom-recipe-card" ) }</Button> : '' }
	        		</BaseControl>
	        		{
	        			! _isEmpty( imageSizeOptions ) &&
		                <SelectControl
	                		label={ __( "Image Size", "wpzoom-recipe-card" ) }
	                		value={ image.url }
	                		options={ imageSizeOptions }
	                		onChange={ this.updateURL }
	                	/>
	        		}
			    	<BaseControl
						id={ `${ id }-print-btn` }
						label={ __( "Print Button", "wpzoom-recipe-card" ) }
					>
		                <ToggleControl
		                    label={ __( "Display Print Button", "wpzoom-recipe-card" ) }
		                    checked={ settings[0]['print_btn'] }
		                    onChange={ display => onChangeSettings( display, 0, 'print_btn' ) }
		                />
	        		</BaseControl>
			    	<BaseControl
						id={ `${ id }-pinit-btn` }
						label={ __( "Pinterest Button", "wpzoom-recipe-card" ) }
					>
		                <ToggleControl
		                    label={ __( "Display Pinterest Button", "wpzoom-recipe-card" ) }
		                    checked={ settings[0]['pin_btn'] }
		                    onChange={ display => onChangeSettings( display, 0, 'pin_btn' ) }
		                />
	        		</BaseControl>
			    	<BaseControl
						id={ `${ id }-heading-align` }
						label={ __( "Header Content Align", "wpzoom-recipe-card" ) }
					>
		                <SelectControl
	                		label={ __( "Select Alignment", "wpzoom-recipe-card" ) }
	                		value={ settings[0]['headerAlign'] }
	                		options={ [
	                			{ label: __( "Left" ), value: "left" },
	                			{ label: __( "Center" ), value: "center" },
	                			{ label: __( "Right" ), value: "right" },
	                		] }
	                		onChange={ alignment => onChangeSettings( alignment, 0, 'headerAlign' ) }
	                	/>
	        		</BaseControl>
    		    	<BaseControl
    					id={ `${ id }-author` }
    					label={ __( "Author", "wpzoom-recipe-card" ) }
    				>
		                <ToggleControl
		                    label={ __( "Display Author", "wpzoom-recipe-card" ) }
		                    checked={ settings[0]['displayAuthor'] }
		                    onChange={ display => onChangeSettings( display, 0, 'displayAuthor' ) }
		                />
		                {
		                	settings[0]['displayAuthor'] &&
			                <TextControl
			                	id={ `${ id }-custom-author-name` }
			                	instanceId={ `${ id }-custom-author-name` }
			                	type="text"
			                	label={ __( "Custom author name", "wpzoom-recipe-card" ) }
			                	help={ __( "Default: Post author name", "wpzoom-recipe-card" ) }
			                	value={ settings[0]['custom_author_name'] }
			                	onChange={ authorName => onChangeSettings( authorName, 0, 'custom_author_name' ) }
			                />
			            }
		           	</BaseControl>
   	        		{
   	        			style === 'newdesign' &&
   					    	<BaseControl
   								id={ `${ id }-ingredients-layout` }
   								label={ __( "Ingredients Layout", "wpzoom-recipe-card" ) }
   							>
   				                <SelectControl
   			                		label={ __( "Select Layout", "wpzoom-recipe-card" ) }
   			                		help={ __( "This setting is visible only on Front-End. In Editor still appears in one column to prevent floating elements on editing.", "wpzoom-recipe-card" ) }
   			                		value={ settings[0]['ingredientsLayout'] }
   			                		options={ [
   			                			{ label: __( "1 column" ), value: "1-column" },
   			                			{ label: __( "2 columns" ), value: "2-columns" },
   			                		] }
   			                		onChange={ size => onChangeSettings( size, 0, 'ingredientsLayout' ) }
   			                	/>
   			        		</BaseControl>
   	        		}
	            </PanelBody>
                <PanelBody className="wpzoom-recipe-card-seo-settings" initialOpen={ true } title={ __( "Recipe Card SEO Settings", "wpzoom-recipe-card" ) }>
			    	<BaseControl
						id={ `${ id }-course` }
						label={ __( "Course (required)", "wpzoom-recipe-card" ) }
					>
						<ToggleControl
						    label={ __( "Display Course", "wpzoom-recipe-card" ) }
						    checked={ settings[0]['displayCourse'] }
						    onChange={ display => onChangeSettings( display, 0, 'displayCourse' ) }
						/>
						{
							settings[0]['displayCourse'] &&
		            		<FormTokenField 
		            			label={ __( "Add course", "wpzoom-recipe-card" ) }
		        				value={ course } 
		        				suggestions={ coursesToken } 
		        				onChange={ newCourse => setAttributes( { course: newCourse } ) }
		        				placeholder={ __( "Type course and press Enter", "wpzoom-recipe-card" ) }
		        			/>
						}
	        		</BaseControl>
			    	<BaseControl
						id={ `${ id }-cuisine` }
						label={ __( "Cuisine (required)", "wpzoom-recipe-card" ) }
					>
						<ToggleControl
						    label={ __( "Display Cuisine", "wpzoom-recipe-card" ) }
						    checked={ settings[0]['displayCuisine'] }
						    onChange={ display => onChangeSettings( display, 0, 'displayCuisine' ) }
						/>
						{
							settings[0]['displayCuisine'] &&
		            		<FormTokenField 
		            			label={ __( "Add cuisine", "wpzoom-recipe-card" ) }
		        				value={ cuisine } 
		        				suggestions={ cuisinesToken } 
		        				onChange={ newCuisine => setAttributes( { cuisine: newCuisine } ) }
		        				placeholder={ __( "Type cuisine and press Enter", "wpzoom-recipe-card" ) }
		        			/>
						}
	        		</BaseControl>
			    	<BaseControl
						id={ `${ id }-difficulty` }
						label={ __( "Difficulty", "wpzoom-recipe-card" ) }
					>
						<ToggleControl
						    label={ __( "Display Difficulty", "wpzoom-recipe-card" ) }
						    checked={ settings[0]['displayDifficulty'] }
						    onChange={ display => onChangeSettings( display, 0, 'displayDifficulty' ) }
						/>
						{
							settings[0]['displayDifficulty'] &&
		            		<FormTokenField 
		            			label={ __( "Add difficulty level", "wpzoom-recipe-card" ) }
		        				value={ difficulty } 
		        				suggestions={ difficultyToken } 
		        				onChange={ newDifficulty => setAttributes( { difficulty: newDifficulty } ) }
		        				placeholder={ __( "Type difficulty level and press Enter", "wpzoom-recipe-card" ) }
		        			/>
						}
	        		</BaseControl>
			    	<BaseControl
						id={ `${ id }-keywords` }
						label={ __( "Keywords (recommended)", "wpzoom-recipe-card" ) }
						help={ __( "For multiple keywords add `,` after each keyword (ex: keyword, keyword, keyword).", "wpzoom-recipe-card" ) }
					>
	            		<FormTokenField
	            			label={ __( "Add keywords", "wpzoom-recipe-card" ) } 
	        				value={ keywords } 
	        				suggestions={ keywordsToken } 
	        				onChange={ newKeyword => setAttributes( { keywords: newKeyword } ) }
	        				placeholder={ __( "Type recipe keywords", "wpzoom-recipe-card" ) }
	        			/>
	        		</BaseControl>
	            </PanelBody>
	            <PanelBody className="wpzoom-recipe-card-details" initialOpen={ true } title={ __( "Recipe Card Details", "wpzoom-recipe-card" ) }>
    				<ToggleControl
    				    label={ __( "Display Servings", "wpzoom-recipe-card" ) }
    				    checked={ settings[0]['displayServings'] }
    				    onChange={ display => onChangeSettings( display, 0, 'displayServings' ) }
    				/>
        			<PanelRow>
        				{
        					settings[0]['displayServings'] &&
        					<Fragment>
		        	    		<TextControl
		        	    			id={ `${ id }-yield` }
		        	    			instanceId={ `${ id }-yield` }
		        	    			type="number"
		        	    			label={ __( "Servings", "wpzoom-recipe-card" ) }
		        	    			value={ _get( details, [ 0, 'value' ] ) }
		        	    			onChange={ newYield => onChangeDetail(newYield, 0) }
		        	    		/>
		        				<span>{ _get( details, [ 0, 'unit' ] ) }</span>
		        			</Fragment>
        				}
        			</PanelRow>
    				<ToggleControl
    				    label={ __( "Display Preparation Time", "wpzoom-recipe-card" ) }
    				    checked={ settings[0]['displayPrepTime'] }
    				    onChange={ display => onChangeSettings( display, 0, 'displayPrepTime' ) }
    				/>
        			<PanelRow>
        				{
        					settings[0]['displayPrepTime'] &&
        					<Fragment>
		        	    		<TextControl
		        	    			id={ `${ id }-preptime` }
		        	    			instanceId={ `${ id }-preptime` }
		        	    			type="number"
		        	    			label={ __( "Preparation time", "wpzoom-recipe-card" ) }
		        	    			value={ _get( details, [ 1, 'value' ] ) }
		        	    			onChange={ newPrepTime => onChangeDetail(newPrepTime, 1) }
		        	    		/>
		        				<span>{ _get( details, [ 1, 'unit' ] ) }</span>
		        			</Fragment>
        				}
        			</PanelRow>
    				<ToggleControl
    				    label={ __( "Display Cooking Time", "wpzoom-recipe-card" ) }
    				    checked={ settings[0]['displayCookingTime'] }
    				    onChange={ display => onChangeSettings( display, 0, 'displayCookingTime' ) }
    				/>
        			<PanelRow>
        				{
        					settings[0]['displayCookingTime'] &&
        					<Fragment>
		        	    		<TextControl
		        	    			id={ `${ id }-cookingtime` }
		        	    			instanceId={ `${ id }-cookingtime` }
		        	    			type="number"
		        	    			label={ __( "Cooking time", "wpzoom-recipe-card" ) }
		        	    			value={ _get( details, [ 2, 'value' ] ) }
		        	    			onChange={ newCookingTime => onChangeDetail(newCookingTime, 2) }
		        	    		/>
		        				<span>{ _get( details, [ 2, 'unit' ] ) }</span>
		        			</Fragment>
        				}
        			</PanelRow>
    				<ToggleControl
    				    label={ __( "Display Calories", "wpzoom-recipe-card" ) }
    				    checked={ settings[0]['displayCalories'] }
    				    onChange={ display => onChangeSettings( display, 0, 'displayCalories' ) }
    				/>
        			<PanelRow>
        				{
        					settings[0]['displayCalories'] &&
        					<Fragment>
		        	    		<TextControl
		        	    			id={ `${ id }-calories` }
		        	    			instanceId={ `${ id }-calories` }
		        	    			type="number"
		        	    			label={ __( "Calories", "wpzoom-recipe-card" ) }
		        	    			value={ _get( details, [ 3, 'value' ] ) }
		        	    			onChange={ newCalories => onChangeDetail(newCalories, 3) }
		        	    		/>
		        				<span>{ _get( details, [ 3, 'unit' ] ) }</span>
		        			</Fragment>
        				}
        			</PanelRow>
	            </PanelBody>
	            <PanelBody className="wpzoom-recipe-card-structured-data-testing" initialOpen={ false } title={ __( "Structured Data Testing", "wpzoom-recipe-card" ) }>
	            	{ structuredDataTestingTool() }
	            </PanelBody>
            </InspectorControls>
		);
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { getEditorSettings } = select( 'core/editor' );
		const { maxWidth, isRTL, imageSizes } = getEditorSettings();

		let id = null;

		if ( ! _isUndefined( props.attributes.image ) ) {
			id = props.attributes.image.id;
		}

		return {
			image: id ? getMedia( id ) : null,
			maxWidth,
			isRTL,
			imageSizes,
		};
	} )
] )( Inspector );
