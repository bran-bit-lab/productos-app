// remote actua como un objeto de conexion con el proceso principal

const { remote } = require('electron');
const { UsersController } = remote.require('./controllers/users_controller');

/** clase que authentica al usuario */
class LoginPage {

	constructor() {

		/** @type {HTMLFormElement} */
		this.form = document.forms['login-form'];

		/** @type {HTMLDivElement} */
		this.errorCorreo = this.form.querySelector('#error-correo');

		/** @type {HTMLDivElement} */
		this.errorPassword = this.form.querySelector('#error-password');

		/** @type {HTMLElement} */
		this.loadingComponent = document.querySelector('app-loading');

		this.validateForm = this.validateForm.bind( this );
		this.handleSubmit = this.handleSubmit.bind( this );

		this.form.addEventListener('submit', this.handleSubmit );

		const year = document.querySelector('#year');
		year.innerHTML = new Date().getFullYear();
	}


	/**
	 * muestra los errores al usuario
	 *
	 * @param  {HTMLElement} element elemento HTML
	 * @param  {string} message mensaje descriptivo
	 */
	renderErrors( element, message ) {

		let html = (`<small class="text-danger">${ message }</small>`);

		element.innerHTML = html;

		showElement( element );
	}

	/**
	 * @callback callbackValidateForm
	 * @param {boolean} error flag que indica si existe un error en el formulario
 	*/
	/**
	 * valida los datos del formulario
	 *
	 * @param  {Object} data  objeto de incio de sesion
	 * @param {string} data.correo correo del usuario
	 * @param {string} data.password contrasena del usuario
	 * @param  {callbackValidateForm} callback respuesta de la validacion del formulario
	 */
	validateForm( data, callback ) {

		const { correo, password } = data;

		const ERROR_MESSAGES = Object.freeze({
			required: 'campo requerido',
			email: 'correo inválido',
			min: ( min ) => 'minimo ' + min + ' caracteres',
			max: ( max ) => 'máximo ' + max + ' caracteres',
			patternPass: 'Patron de contrasena invalida'
		});

		const emailExp = new RegExp( /^[a-z0-9]+@[a-z]{4,}\.[a-z]{3,}$/ );

		let errors = 0;

		// ========================================
		//	correo validaciones
		// ========================================

		if ( !emailExp.test( correo ) ) {
			this.renderErrors( this.errorCorreo, ERROR_MESSAGES.email );
			errors = errors + 1;
		}

		if ( correo.trim().length === 0 ) {
			this.renderErrors( this.errorCorreo,  ERROR_MESSAGES.required );
			errors = errors + 1;
		}

		if ( correo.trim().length > 0 && correo.trim().length < 8 ) {
			this.renderErrors( this.errorCorreo,  ERROR_MESSAGES.min( 8 ) );
			errors = errors + 1;
		}

		if ( correo.trim().length > 30 ) {
			this.renderErrors( this.errorCorreo,  ERROR_MESSAGES.max( 30 ) );
			errors = errors + 1;
		}

		// ===========================================
		// password validaciones
		// ===========================================

		

		if ( password.trim().length === 0 ) {
			this.renderErrors( this.errorPassword, ERROR_MESSAGES.required );
			errors = errors + 1;
		}

		if ( password.trim().length > 30 ) {
			this.renderErrors( this.errorPassword,  ERROR_MESSAGES.max( 30 ) );
			errors = errors + 1;
		}
		

		// =============================================
		// comprobacion final
		// =============================================
		if ( errors > 0 ) {
			return callback( true );
		}

		return callback( false );
	}

	/**
	 * limpia el formulario de acceso
	 * @param  {boolean} cancelButton flag que indica que limpio el formualrio desde el boton
	 */
	resetLoginForm( cancelButton = false ) {

		hideElement( this.errorCorreo );
		hideElement( this.errorPassword );

		if ( cancelButton )  {
			this.form.reset();
			document.querySelector('#correo-login').focus();
		}
	}

	/**
	 * maneja el envio del formulario
	 * @param  {Event} $event evento de envio
	 */
	handleSubmit( $event ) {

		$event.preventDefault();
		
		this.resetLoginForm();
		
		const formData = new FormData( this.form );
		
		let data = {
			correo: formData.get('correo').toLowerCase(),
			password: formData.get('password')
		};
		
		this.validateForm( data, ( error ) => {
			
			if ( error ) {
					
				return document.querySelector('#correo-login').focus();
			}
			
			this.loadingComponent._show = 'true';
		 	
			setTimeout( () => this.login( data ), 2000 );
		});
	}


	/**
	 * Inicio de sesion de la aplicacion
	 *
	 * @param  {Object} data objeto de inicio de sesion
	 * @param {string} data.correo correo del usuario
	 * @param {string} data.password contrasena del usuario
	 */
	async login( data ) {

		try {

	 		const userLogged = await UsersController.login( data );

	 		sessionStorage.setItem('userLogged', JSON.stringify( userLogged ));

	 		redirectTo('home/home.html');

	 	} catch ( error ) {

	 		console.log( error );

	 	} finally {

	 		this.loadingComponent._show = 'false';
	 	}
	}
}

const loginComponent = new LoginPage();
