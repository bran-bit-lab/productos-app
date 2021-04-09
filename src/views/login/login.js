// remote actua como un objeto de conexion con el proceso principal
require('@fortawesome/fontawesome-free/js/all');

const { remote } = require('electron');
const { UsersController } = remote.require('./controllers/users_controller');

class LoginComponent {

	constructor() {

		this.validateForm = this.validateForm.bind( this );
		this.handleSubmit = this.handleSubmit.bind( this );
	}

	renderErrors( element, message ) {

		let html = (`<small class="text-danger">${ message }</small>`);

		element.innerHTML = html;

		showElement( element );
	}

	validateForm( data, callback ) {

		const { correo, password } = data;

		const ERROR_MESSAGES = Object.freeze({
			required: 'campo requerido',
			email: 'correo inválido',
			min: ( min ) => 'minimo ' + min + ' caracteres',
			max: ( max ) => 'máximo ' + max + ' caracteres',
		});

		const emailExp = new RegExp( /^[a-z0-9]+@[a-z]{4,}\.[a-z]{3,}$/ );

		let errors = 0;

		// ========================================
		//	correo validaciones
		// ========================================

		if ( !emailExp.test( correo ) ) {
			this.renderErrors( errorCorreo, ERROR_MESSAGES.email );
			errors = errors + 1;
		}

		if ( correo.trim().length === 0 ) {
			this.renderErrors( errorCorreo,  ERROR_MESSAGES.required );
			errors = errors + 1;
		}

		if ( correo.trim().length > 0 && correo.trim().length < 8 ) {
			this.renderErrors( errorCorreo,  ERROR_MESSAGES.min( 8 ) );
			errors = errors + 1;
		}

		if ( correo.trim().length > 30 ) {
			this.renderErrors( errorCorreo,  ERROR_MESSAGES.max( 30 ) );
			errors = errors + 1;
		}

		// ===========================================
		// password validaciones
		// ===========================================

		if ( password.trim().length === 0 ) {
			this.renderErrors( errorPassword, ERROR_MESSAGES.required );
			errors = errors + 1;
		}

		if ( password.trim().length > 30 ) {
			this.renderErrors( errorPassword,  ERROR_MESSAGES.max( 30 ) );
			errors = errors + 1;
		}

		// =============================================
		// comprobacion final
		// =============================================
		if ( errors > 0 ) {
			return callback( true );
		}

		return callback( false, data );
	}

	resetLoginForm( cancelButton = false ) {

		hideElement( errorCorreo );
		hideElement( errorPassword );

		if ( cancelButton )  {
			form.reset();
			return document.querySelector('#correo-login').focus();
		}
	}

	loading() {

		let buttons = form.querySelectorAll('button');

		hideElement( buttons[0] );
		showElement( buttons[1] );
	}

	hideLoading() {

		let buttons = form.querySelectorAll('button');

		hideElement( buttons[1] );
		showElement( buttons[0] );
	}

	handleSubmit( $event ) {

		$event.preventDefault();

		this.resetLoginForm();

		const formData = new FormData( form );

		let data = {
			correo: formData.get('correo').toLowerCase(),
			password: formData.get('password')
		};


		this.validateForm( data, ( error, data ) => {

		 	if ( error ) {
				return document.querySelector('#correo-login').focus();
		 	}

		 	this.loading();

		 	setTimeout( () => this.login( data ), 2000 );
		});
	}

	async login( data ) {

		try {

	 		const userLogged = await UsersController.login( data );

	 		sessionStorage.setItem('userLogged', JSON.stringify( userLogged ));

	 		redirectTo('../home/home.html');

	 	} catch ( error ) {

	 		console.log( error );

	 	} finally {

	 		this.hideLoading();
	 	}
	}
}


const form = document.forms['login-form'];
const errorCorreo = form.querySelector('#error-correo');
const errorPassword = form.querySelector('#error-password');

const loginComponent = new LoginComponent();

form.addEventListener('submit', loginComponent.handleSubmit );
