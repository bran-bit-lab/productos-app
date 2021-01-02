const form = document.forms['login-form'];
const errorCorreo = document.getElementById('error-correo');
const errorPassword = document.getElementById('error-password');

const ERROR_MESSAGES = Object.freeze({
	required: 'campo requerido',
	email: 'correo invalido',
	min: ( min ) => 'minimo ' + min + ' caracteres',
	max: ( max ) => 'maximo ' + max + ' caracteres'
});

function render( element, message ) {

	let html = (`<small class="text-danger">${ message }</small>`);
	
	element.innerHTML = html;
	element.style.display = 'block';
}

function validateForm( data ) {
	
	const correo = data['correo'];
	const password = data['password'];

	resetForm();
	
	let errors = 0;

	// ========================================
	//	correo validaciones
	// ========================================

	if ( correo.length === 0 ) {
		render( errorCorreo,  ERROR_MESSAGES.required );
		errors = errors + 1; 
	}

	if ( correo.length > 0 && correo.length < 8 ) {
		render( errorCorreo,  ERROR_MESSAGES.min( 8 ) );
		errors = errors + 1;
	}

	if ( correo.length > 30 ) {
		render( errorCorreo,  ERROR_MESSAGES.max( 30 ) );
		errors = errors + 1;
	}

	// ===========================================
	// password validaciones
	// ===========================================

	if ( password.length === 0 ) {
		render( errorPassword, ERROR_MESSAGES.required );
		errors = errors + 1; 
	} 

	if ( password.length > 30 ) {
		render( errorPassword,  ERROR_MESSAGES.max( 30 ) );
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
	
function resetForm( cancelButton = false ) {
	
	errorCorreo.style.display = 'none';
	errorPassword.style.display = 'none';

	if ( cancelButton )  {
		return document.getElementById('correo-login').focus();
	}
}

// envio de formulario
form.addEventListener('submit', ( $event ) => {
	
	$event.preventDefault();
	
	const formData = new FormData( form );

	let data = {
		correo: formData.get('correo'),
		password: formData.get('password')
	};

	if ( !validateForm( data ) ) {
		return document.getElementById('correo-login').focus();
	}
});