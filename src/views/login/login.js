require('../global');

// remote actua como un objeto de conexion con el proceso principal
// const { remote } = require('electron');

// const { login, openHomeWindow } = remote.require('./modules/login');

function renderErrors( element, message ) {

	let html = (`<small class="text-danger">${ message }</small>`);
	
	element.innerHTML = html;
	element.style.display = 'block';
}

function validateForm( data, callback ) {
	
	const { correo, password } = data;
	
	const ERROR_MESSAGES = Object.freeze({
		required: 'campo requerido',
		email: 'correo inválido',
		min: ( min ) => 'minimo ' + min + ' caracteres',
		max: ( max ) => 'máximo ' + max + ' caracteres',
	});

	const emailExp = new RegExp('^[a-z0-9]+@[a-z]{4,}\.[a-z]{3,}$');

	let errors = 0;

	// ========================================
	//	correo validaciones
	// ========================================

	if ( !emailExp.test( correo ) ) {
		renderErrors( errorCorreo, ERROR_MESSAGES.email );
		errors = errors + 1;
	}

	if ( correo.trim().length === 0 ) {
		renderErrors( errorCorreo,  ERROR_MESSAGES.required );
		errors = errors + 1; 
	}

	if ( correo.trim().length > 0 && correo.trim().length < 8 ) {
		renderErrors( errorCorreo,  ERROR_MESSAGES.min( 8 ) );
		errors = errors + 1;
	}

	if ( correo.trim().length > 30 ) {
		renderErrors( errorCorreo,  ERROR_MESSAGES.max( 30 ) );
		errors = errors + 1;
	}

	// ===========================================
	// password validaciones
	// ===========================================

	if ( password.trim().length === 0 ) {
		renderErrors( errorPassword, ERROR_MESSAGES.required );
		errors = errors + 1; 
	} 

	if ( password.trim().length > 30 ) {
		renderErrors( errorPassword,  ERROR_MESSAGES.max( 30 ) );
		errors = errors + 1;
	}

	// =============================================
	// comprobacion final
	// =============================================
	if ( errors > 0 ) {
		return callback( true );
	}

	return callback( null, data );	
}
	
function resetLoginForm( cancelButton = false ) {
	
	errorCorreo.style.display = 'none';
	errorPassword.style.display = 'none';

	if ( cancelButton )  {
		form.reset();
		return document.querySelector('#correo-login').focus();
	}
}

function loading() {
	
	let buttons = form.querySelectorAll('button');
	
	buttons[0].style.display = 'none';
	buttons[1].style.display = 'block';
}

function handleSubmit( $event ) {

	// previene el comportamiento por defecto
	$event.preventDefault();

	resetLoginForm();
	
	const formData = new FormData( form );

	let data = {
		correo: formData.get('correo').toLowerCase(),
		password: formData.get('password')
	};
	
	validateForm( data, ( error, data ) => {

	 	if ( error ) {
			return document.querySelector('#correo-login').focus();
	 	}

	 	console.log( data );

	 	loading();
	});
}

const form = document.forms['login-form'];
const errorCorreo = form.querySelector('#error-correo');
const errorPassword = form.querySelector('#error-password');


form.addEventListener('submit', handleSubmit );