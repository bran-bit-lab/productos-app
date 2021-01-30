// ============================
// 	ModalUserFormComponent
// ============================
function setForm( data = null ) {
	
	// busca todos los nodos del formularios y les asigna el valor

	const nodesInput = userForm.querySelectorAll('input');
	const nodesSelect = userForm.querySelectorAll('select');

	nodesInput.forEach(( node ) => node.value = data ? data[ node.name ] : '' );
	nodesSelect.forEach(( node ) => node.value = data ? data[ node.name ] : '' );
}

function getForm( $event, userComponent = this ) {

	$event.preventDefault();
	
	let formData = new FormData( userForm );

	const data = {
		nombre: formData.get('nombre').trim(),
		apellido: formData.get('apellido').trim(),
		correo: formData.get('correo').trim(),
		area: formData.get('area').trim()
	}

	validateForm( data, ( error, data ) => {

		if ( error ) { 
			return footer.querySelector('#name-user').focus(); 
		}

		if ( idUser ) {
			userComponent.editUser( idUser, data );

		} else {
			userComponent.newUser( data );

		}

		return closeModal();
	});
}

function openModal( method = 'new', id = null ) {

	resetFields(); // limpia los campos cuando entra al modal

	if ( method === 'edit' ) {
		
		let found = USERS.find(( user ) => user.id === id );
		
		footer.querySelector('.modal-title').innerText = `Editar usuario ${ id }`;
		idUser = id;
		setForm( found );

	} else {

		footer.querySelector('.modal-title').innerText = 'Nuevo usuario';
		idUser = null;
		setForm();
	}
	
	return modalUsersForm.show();
}

function closeModal() {
	return modalUsersForm.hide();
}

function validateForm( data, callback ) {

	const { nombre, apellido, correo, area } = data;

	resetFields();
	
	const ERROR_MESSAGES = Object.freeze({
		required: 'campo requerido',
		email: 'correo inválido',
		min: ( min ) => 'minimo ' + min + ' caracteres',
		max: ( max ) => 'máximo ' + max + ' caracteres',
		pattern: 'Patrón de datos inválido'
	});

	const emailExp = new RegExp('^[a-z0-9]+@[a-z]{4,}\.[a-z]{3,}$');
	const stringExp = new RegExp('^[a-zA-Z\s]+$');

	let errors = 0;

	// ========================================
	//	correo validaciones
	// ========================================

	if ( !emailExp.test( correo ) ) {
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
	
	if ( !stringExp.test( nombre ) ) {
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

	if ( !stringExp.test( apellido ) ) {
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

	// ==================================================
	// role validaciones
	// ==================================================
	if ( area.length === 0 ) {
		errors = errors + 1;
		renderErrors( areaErrorsNode, ERROR_MESSAGES.required );
	}

	if ( errors > 0 ) {
		return callback( true );
	}

	return callback( false, data );
} 

function renderErrors( element, message ) {

	let html = (`<small class="text-danger">${ message }</small>`);
	
	element.innerHTML = html;
	element.style.display = 'block';
}

function resetFields( button = false ) {
	
	// se limpia los errores de validación
	emailErrorsNode.style.display = 'none';
	nameErrorsNode.style.display = 'none';
	surnameErrorsNode.style.display = 'none';
	areaErrorsNode.style.display = 'none';

	if ( button ) {
		document.forms['formUsers'].reset();
	}
}


const modalUsersForm = new Modal( footer.querySelector('.modal-users'), {
	backdrop: 'static'
});

let idUser = null;

const emailErrorsNode = footer.querySelector('#error-email');
const nameErrorsNode = footer.querySelector('#error-name');
const surnameErrorsNode = footer.querySelector('#error-surname');
const areaErrorsNode = footer.querySelector('#error-area');

module.exports = {
	openModal,
	closeModal,
	getForm,
	resetFields
};