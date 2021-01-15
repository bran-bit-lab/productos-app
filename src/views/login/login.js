require('../global');

// remote actua como un objeto de conexion con el proceso principal
const { remote } = require('electron');
const { login, openUserWindow } = remote.require('./modules/login/login');

const form = document.forms['login-form'];
const errorCorreo = form.querySelector('#error-correo');
const errorPassword = form.querySelector('#error-password');

// =====================================
//	errores de validaciones
// =====================================
const ERROR_MESSAGES = Object.freeze({
	required: 'campo requerido',
	email: 'correo inválido',
	min: ( min ) => 'minimo ' + min + ' caracteres',
	max: ( max ) => 'máximo ' + max + ' caracteres',
});

function renderErrors( element, message ) {

	let html = (`<small class="text-danger">${ message }</small>`);
	
	element.innerHTML = html;
	element.style.display = 'block';
}

function validateForm( data ) {
	
	const { correo, password } = data;

	const emailExp = new RegExp('^[a-z0-9]+@[a-z]{4,}\.[a-z]{3,}$', 'g');

	let errors = 0;

	resetLoginForm();

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
		return false;
	}

	return data;	
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
	form.querySelector('#btn-submit').style.display = 'none';
	form.querySelector('#btn-submit-disabled').style.display = 'block';
}

form.addEventListener('submit', ( $event ) => {
	
	// previene el comportamiento por defecto
	$event.preventDefault();
	
	const formData = new FormData( form );

	let data = {
		correo: formData.get('correo').toLowerCase(),
		password: formData.get('password')
	};

	if ( !validateForm( data ) ) {
		return document.querySelector('#correo-login').focus();
	}

	loading();
	
	login( data );

	setTimeout(() => {
		
		window.close();  // cierra la ventana del navegador
		openUserWindow();

	}, 3000 );

});