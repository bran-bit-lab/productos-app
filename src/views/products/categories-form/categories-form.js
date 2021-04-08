// ============================
// CategoriesFormComponent
// ============================
function openModalNewCategory( title = 'Nueva categoría', edit = false ) {

	newCategory = !edit ? true : false;

	footer.querySelector('.modal-title').textContent = title;

	modalFormCategory.toggle();
}

function openImageDialog() {

	CategoriasController.openImageDialog( remote.getCurrentWindow(), ({ base64, size, path }) => {

		const maxSize = 1000000;  // 1MB de archivos

		hideElement( errorFile );

		if ( size > maxSize ) {

			errorFile.textContent = 'Máximo 1MB';

			return showElement( errorFile );
		}

		// se crea una nueva instancia de image
		const imgElement = (`<img src="data:image/png;base64,${ base64 }" alt="imagen" class="image-foto" />`);

		imageContainer.innerHTML = imgElement;
		footer.querySelector('#category-image').value = base64;

		hideElement( imageDefault );
		showElement( imageContainer );
	});
}

function handleSubmit( $event ) {

	$event.preventDefault();

	const formData = new FormData( categoryForm );

	const categoryData = {
		imagen: formData.get('category-image') || '',
		nombre: formData.get('category-name') || '',
		descripcion: formData.get('category-description') || ''
	};

	validateData( categoryData, ( error, data ) => {

		if ( error ) {
			return;
		}

		console.log( data );

		modalFormCategory.toggle();
	});
}

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
		email: new RegExp('^[a-z0-9]+@[a-z]{4,}\.[a-z]{3,}$'),
		onlyLetters: new RegExp('^[a-zA-Z\s]+$'),
		area: new RegExp('^Ventas|Almacen|Administracion$')
	});

	const { nombre, descripcion } = categoryData;

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
		return callback( true );
	}

	callback( false, data );
}

function setForm() {
}

function renderErrors( element, message ) {

	let html = (`<small class="text-danger">${ message }</small>`);

	element.innerHTML = html;

	showElement( element );
}

function cleanFormOnClose( $event ) {

	imageContainer.innerHTML = '';

	hideElement( imageContainer );
	showElement( imageDefault );

	resetForm( true );
}

function resetForm( button = false ) {

	hideElement( errorCategoryName );
	hideElement( errorCategoryDescription );

	if ( button ) {
		categoryForm.reset();
	}
}

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

let newCategory = true; // new | edit

hideElement( imageContainer );
hideElement( errorFile );

footer.querySelector('#category-form').addEventListener('hide.bs.modal', cleanFormOnClose );
categoryForm.addEventListener( 'submit', handleSubmit );

module.exports = {
	openModalNewCategory,
	openImageDialog,
	resetForm
};
