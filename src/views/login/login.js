const form = document.forms['login-form'];
const errorCorreo = document.querySelector('#error-correo');
const errorPassword = document.querySelector('#error-password');

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

function validateForm({ correo, password }) {
	
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

	console.log( data );
});