// ============================
// ModalUserFormComponent
// ============================
function setForm( data = {} ) {

	// busca todos los nodos del formularios y les asigna el valor
	const nodesInput = userForm.querySelectorAll('input');
	const nodesSelect = userForm.querySelectorAll('select');

	nodesInput.forEach(( node ) => node.value = data[ node.name ] || '' );
	nodesSelect.forEach(( node ) => node.value = data[ node.name ] || '' );
}

function getForm( $event, userComponent = this ) {

	$event.preventDefault();

	let formData = new FormData( userForm );

	const data = {
		nombre: formData.get('nombre').trim() || '',
		apellido: formData.get('apellido').trim() || '',
		correo: formData.get('correo').trim() || '',
		area: formData.get('area').trim() || '',
		password: formData.get('password').trim() || '',
		passwordConfirmation: formData.get('password-confirmation').trim() || ''
	}

	validateForm( data, ( error, data ) => {

		console.log( data );

		if ( error ) {
			return footer.querySelector('#name-user').focus();
		}

		if ( idUser ) {
			usersTableComponent.editUser( idUser, data );

		} else {
			usersTableComponent.newUser( data );

		}

		return closeModal();
	});
}

function openModal( method = 'new', id = null ) {

	resetFields(); // limpia los campos cuando entra al modal

	if ( method !== 'new' ) {

		footer.querySelector('.modal-title').innerText = `Editar usuario ${ id }`;
		footer.querySelectorAll('.only-new').forEach(( node ) => node.style.display = 'none');

		idUser = id;
		let found = UsersTableComponent.users.find(( user ) => user.id === id );

		setForm( found );

	} else {

		footer.querySelector('.modal-title').innerText = 'Nuevo usuario';
		footer.querySelectorAll('.only-new').forEach(( node ) => node.style.display = 'block');

		idUser = null;

		setForm();
	}

	return modalUsersForm.toggle();
}

function closeModal() {
	return modalUsersForm.toggle();
}

function validateForm( data, callback ) {
	resetFields();

	const { nombre, apellido, correo, area, password, passwordConfirmation } = data;

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
		area: new RegExp( /^Ventas|Almacen|Administracion$/ )
	});

	// contador de errores
	let errors = 0;

	// ========================================
	//	correo validaciones
	// ========================================

	if ( !PATTERNS.email.test( correo ) ) {
		errors = errors + 1;
		renderErrors( emailErrorsNode, ERROR_MESSAGES.pattern );
	}

	if ( correo.trim().length === 0 ) {
		errors = errors + 1;
		renderErrors( emailErrorsNode, ERROR_MESSAGES.required );
	}

	if ( correo.trim().length > 0 && correo.trim().length < 8 ) {
		errors = errors + 1;
		renderErrors( emailErrorsNode, ERROR_MESSAGES.min( 8 ) );
	}

	if ( correo.trim().length > 30 ) {
		errors = errors + 1;
		renderErrors( emailErrorsNode, ERROR_MESSAGES.max( 30 ) );
	}

	// =============================================
	// nombre validaciones
	// =============================================

	if ( !PATTERNS.onlyLetters.test( nombre ) ) {
		errors = errors + 1;
		renderErrors( nameErrorsNode, ERROR_MESSAGES.pattern );
	}

	if ( nombre.trim().length === 0 ) {
		errors = errors + 1;
		renderErrors( nameErrorsNode, ERROR_MESSAGES.required );
	}

	if ( nombre.trim().length > 0 && nombre.trim().length < 2 ) {
		errors = errors + 1;
		renderErrors( nameErrorsNode, ERROR_MESSAGES.min( 2 ) );
	}

	if ( nombre.trim().length > 30 ) {
		errors = errors + 1;
		renderErrors( nameErrorsNode, ERROR_MESSAGES.max( 30 ) );
	}

	// ==================================================
	// apellido validaciones
	// ==================================================

	if ( !PATTERNS.onlyLetters.test( apellido ) ) {
		errors = errors + 1;
		renderErrors( surnameErrorsNode, ERROR_MESSAGES.pattern );
	}

	if ( apellido.trim().length === 0 ) {
		errors = errors + 1;
		renderErrors( surnameErrorsNode, ERROR_MESSAGES.required );
	}

	if ( apellido.trim().length > 0 && apellido.trim().length < 2 ) {
		errors = errors + 1;
		renderErrors( surnameErrorsNode, ERROR_MESSAGES.min( 2 ) );
	}

	if ( apellido.trim().length > 30 ) {
		errors = errors + 1;
		renderErrors( surnameErrorsNode, ERROR_MESSAGES.max( 30 ) )
	}

	if ( !idUser ) {

		// ==================================================
		// rol validaciones
		// ==================================================

		if ( !PATTERNS.area.test( area ) ) {
			errors = errors + 1;
			renderErrors( areaErrorsNode, ERROR_MESSAGES.pattern );
		}

		if ( area.length === 0 ) {
			errors = errors + 1;
			renderErrors( areaErrorsNode, ERROR_MESSAGES.required );
		}


		// ===================================================
		// contraseña validaciones
		// ===================================================

		if ( password.length === 0 ) {
			errors = errors + 1;
			renderErrors( passwordErrorsNode, ERROR_MESSAGES.required );
		}

		if ( password.length < 8 && password.length > 0 ) {
			errors = errors + 1;
			renderErrors( passwordErrorsNode, ERROR_MESSAGES.min( 8 ) )
		}

		if ( passwordConfirmation.length === 0 ) {
			errors = errors + 1;
			renderErrors( passwordConfirmationNode, ERROR_MESSAGES.required )
		}

		if ( passwordConfirmation !== password ) {  // contraseñas diferentes
			errors = errors + 1;
			renderErrors( passwordConfirmationNode, ERROR_MESSAGES.notMatch );
		}
	}

	if ( errors > 0 ) {
		return callback( true );
	}

	return callback( false, data );
}

function resetFields( button = false ) {

	// se limpia los errores de validación
	hideElement( emailErrorsNode );
	hideElement( nameErrorsNode );
	hideElement( surnameErrorsNode );
	hideElement( areaErrorsNode );
	hideElement( passwordConfirmationNode );
	hideElement( passwordErrorsNode );

	if ( button ) {
		document.forms['formUsers'].reset();
	}

	return footer.querySelector('#name-user').focus();
}

const modalUsersForm = new Modal( footer.querySelector('.modal-users'), {
	backdrop: 'static'
});

const emailErrorsNode = footer.querySelector('#error-email');
const nameErrorsNode = footer.querySelector('#error-name');
const surnameErrorsNode = footer.querySelector('#error-surname');
const areaErrorsNode = footer.querySelector('#error-area');
const passwordErrorsNode = footer.querySelector('#error-password');
const passwordConfirmationNode = footer.querySelector('#error-password-confirmation');

let idUser = null;

module.exports = {
	openModal,
	closeModal,
	getForm,
	resetFields
};
