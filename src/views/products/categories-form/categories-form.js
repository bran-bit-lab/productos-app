// ============================
// CategoriesFormComponent
// ============================
function openModalNewCategory( title = 'Nueva categoría', edit = false ) {

	newCategory = true;

	footer.querySelector('.modal-title').textContent = title;

	modalFormCategory.toggle();
}

function openModalEditCategory( category ) {

	newCategory = false;
	categorySelected = category;

	/*
		DOCUMENTACION (retirar si se solicita de procesamiento de imagenes):
		si existe una imagen en el registro realiza la lectura retirar si incluye el
		modulo para el cliente

		if ( categorySelected.imagen && categorySelected.imagen.length > 0 ) {

			readFileImageAsync( categorySelected.imagen, ({ base64, path, typeFile }) =>  {

				// console.log( typeFile );

				const imgElement = (`<img src="data:image/${ typeFile };base64,${ base64 }"
					alt="imagen" class="image-foto" />`);

				imageContainer.innerHTML = imgElement;
				footer.querySelector('#category-image').value = path;

				hideElement( imageDefault );
				showElement( imageContainer );

				footer.querySelector('.modal-title').textContent = 'Editar categoría';
				setForm( categorySelected );

				modalFormCategory.toggle();
			});

		} else {

			footer.querySelector('.modal-title').textContent = 'Editar categoría';
			setForm( categorySelected );

			modalFormCategory.toggle();
		}
	*/

	footer.querySelector('.modal-title').textContent = 'Editar categoría';

	setForm( categorySelected );

	modalFormCategory.toggle();
}

function openImageDialog() {

	CategoriasController.openImageDialog( remote.getCurrentWindow(), ({ base64, size, path, typeFile }) => {

		const maxSize = 1000000;  // 1MB de archivos

		// console.log( typeFile );

		hideElement( errorFile );

		if ( size > maxSize ) {

			errorFile.textContent = 'Máximo 1MB';

			return showElement( errorFile );
		}

		// se crea una nueva instancia de image
		const imgElement = (`<img src="data:image/${ typeFile };base64,${ base64 }" alt="imagen" class="image-foto" />`);

		imageContainer.innerHTML = imgElement;
		footer.querySelector('#category-image').value = path;

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
		descripcion: formData.get('category-description') || '',
		categoriaid: categorySelected ? categorySelected.categoriaid : null
	};

	validateData( categoryData, ( error, data ) => {

		if ( error ) {
			return;
		}

		if ( newCategory ) {
			categoryTableComponent.createCategory( data );

		} else {
			categoryTableComponent.editCategory( data );

		}

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
		return callback( true );
	}

	callback( false, categoryData );
}

function setForm( category ) {

	const keys = ['nombre', 'descripcion'];

	const inputsElement = [...footer.querySelectorAll('input')]
		.filter( element => element.id !== 'category-image' );

	inputsElement.forEach(( element, index ) => {
		element.value = category[ keys[index] ] || '';
	});
}

function cleanFormOnClose( $event ) {

	/*
		Documentacion de procesamiento de imagen:

		// imageContainer.innerHTML = '';
		// hideElement( imageContainer );
		// showElement( imageDefault );

	*/

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
