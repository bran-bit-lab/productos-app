
/**
 * Formulario de categorias
 * @module ModalCategoryFormComponent
 */


/**
 * abre el modal nuevo de categorias
 *
 * @param  {string} title titulo del modal
 * @param  {boolean} edit flag que indica si esta editando una categoria
 */
function openModalNewCategory( title = 'Nueva categoría', edit = false ) {

	newCategory = true;

	footer.querySelector('.modal-title').textContent = title;

	modalFormCategory.toggle();
}

/**
 * abre el modal nuevo de categorias
 * @param  {Category} category instancia de la categoria
 */
function openModalEditCategory( category ) {

	newCategory = false;
	categorySelected = category;

	footer.querySelector('.modal-title').textContent = 'Editar categoría';

	setForm( categorySelected );

	modalFormCategory.toggle();
}


function handleSubmit( $event ) {

	$event.preventDefault();

	const formData = new FormData( categoryForm );

	const categoryData = {
		imagen: formData.get('category-image') || '',
		nombre: formData.get('category-name') || '',
		descripcion: formData.get('category-description') || '',
		categoriaid: categorySelected ? categorySelected.categoriaid : null
	};

	validateData( categoryData, ( error ) => {

		if ( error ) {
			return;
		}

		if ( newCategory ) {
			categoryTableComponent.createCategory( categoryData );

		} else {
			categoryTableComponent.editCategory( categoryData );

		}

		modalFormCategory.toggle();
	});
}

/**
* @callback callbackValidateForm
* @param {boolean} error indica si existe un error en el formulario
*/
/**
 * Funcion de validacion de datos
 *
 * @param  {User} data     instancia del usuario
 * @param  {callbackValidateForm} callback  llamada de respuesta al realizar la validacion
 */
function validateData( categoryData, callback ) {

	resetForm();

	const ERROR_MESSAGES = Object.freeze({
		required: 'campo requerido',
		email: 'correo inválido',
		min: ( min ) => 'minimo ' + min + ' caracteres',
		max: ( max ) => 'máximo ' + max + ' caracteres',
		pattern: 'Patrón de datos inválido',
		notMatch: 'La contraseña no coincide'
	});

	const PATTERNS = Object.freeze({
		email: new RegExp( /^[a-z0-9]+@[a-z]{4,}\.[a-z]{3,}$/ ),
		onlyLetters: new RegExp( /^[a-zA-Z\s]+$/ ),
	});

	const { nombre, descripcion } = categoryData;

	// console.log( descripcion );

	// contador de errores
	let errors = 0;

	// ========================================
	//  validaciones
	// ========================================

	if ( !PATTERNS.onlyLetters.test( nombre ) ) {
		errors = errors + 1;
		renderErrors( errorCategoryName, ERROR_MESSAGES.pattern );
	}

	if ( nombre.trim().length === 0 ) {
		errors = errors + 1;
		renderErrors( errorCategoryName, ERROR_MESSAGES.required );
	}


	if ( nombre.trim().length > 0 && nombre.trim().length < 2 ) {
		errors = errors + 1;
		renderErrors( errorCategoryName, ERROR_MESSAGES.min( 2 ) );
	}

	if ( nombre.trim().length > 30 ) {
		errors = errors + 1;
		renderErrors( errorCategoryName, ERROR_MESSAGES.max( 30 ) )
	}

	if ( !PATTERNS.onlyLetters.test( descripcion ) ) {
		errors = errors + 1;
		renderErrors( errorCategoryDescription, ERROR_MESSAGES.pattern );
	}

	if ( descripcion.trim().length === 0 ) {
		errors = errors + 1;
		renderErrors( errorCategoryDescription, ERROR_MESSAGES.required );
	}

	if ( descripcion.trim().length > 0 && descripcion.trim().length < 2 ) {
		errors = errors + 1;
		renderErrors( surnameErrorsNode, ERROR_MESSAGES.min( 2 ) );
	}

	if ( descripcion.trim().length > 255 ) {
		errors = errors + 1;
		renderErrors( surnameErrorsNode, ERROR_MESSAGES.max( 255 ) )
	}

	if ( errors > 0 ) {
		callback( true );

		return;
	}

	callback( false );
}

/**
 * establece el formulario de clientes
 * @param  {Category} category instancia de categoría
 */
function setForm( category ) {

	const keys = ['nombre', 'descripcion'];

	const inputsElement = [...footer.querySelectorAll('input')]
		.filter( element => element.id !== 'category-image' );

	inputsElement.forEach(( element, index ) => {
		element.value = category[ keys[index] ] || '';
	});
}

/** evento de cierre de modal */
function cleanFormOnClose() {

	/*
		Documentacion de procesamiento de imagen:

		// imageContainer.innerHTML = '';
		// hideElement( imageContainer );
		// showElement( imageDefault );

	*/

	resetForm( true );
}

/**
 * Limpia los campos del formulario
 * @param  {boolean} button indica si la funcion es llamado desde el boton del formulario
 */
function resetForm( button = false ) {

	hideElement( errorCategoryName );
	hideElement( errorCategoryDescription );

	if ( button ) {
		categoryForm.reset();
	}
}

/** @type {Modal} */
const modalFormCategory = new Modal( footer.querySelector('#category-form'), {
	backdrop: 'static'
});

const categoryForm = document.forms[0];
const imageContainer = footer.querySelector('#image-container');
const imageDefault = footer.querySelector('#image-default');
const errorFile = footer.querySelector('#error-file');

// error fields
const errorCategoryName = categoryForm.querySelector('#error-category-name');
const errorCategoryDescription = categoryForm.querySelector('#error-category-description');

/** @type {boolean} */
let newCategory = true; // new | edit

/** @type {null|Category} */
let categorySelected = null;

/*
	hideElement( imageContainer );
	hideElement( errorFile );
*/

footer.querySelector('#category-form').addEventListener('hidden.bs.modal', cleanFormOnClose );

categoryForm.addEventListener( 'submit', handleSubmit );

module.exports = {
	openModalNewCategory,
	openImageDialog,
	resetForm,
	openModalEditCategory
};
