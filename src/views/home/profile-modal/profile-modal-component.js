/** Clase componente de perfil */
class ProfileModalComponent {
  constructor() {
    this.footer = document.querySelector('footer');

    this.setHtml(() => {
      this.modal = document.querySelector('#modal-profile');
      this.modalInstance = new Modal( this.modal,  {
        backdrop: 'static'
      });

      this.modal.addEventListener('show.bs.modal', () => this.resetForm( true ));

      this.formProfile = document.forms['profile-form'];
      this.formProfile.addEventListener('submit', this.handleSubmit.bind( this ));

      // errors
      this.errorName = this.formProfile.querySelector('#profile-error-name');
      this.errorSurname = this.formProfile.querySelector('#profile-error-surname');
      this.errorEmail = this.formProfile.querySelector('#profile-error-email');
      this.errorPassword = this.formProfile.querySelector('#profile-error-password');
      this.errorConfirmation = this.formProfile.querySelector('#profile-error-confirm');
    });
  }

  /** abre el modal de perfil */
  openModalProfile() {
    this.modalInstance.show();
  }

  /** establece el formulario del perfil */
  setForm() {

    const userLogged = getUserLogged();

    for ( const input of this.formProfile.querySelectorAll('input') ) {

      switch ( input.name ) {
        case 'nombre': {
          input.value = userLogged.nombre;
          break;
        }

        case 'apellido': {
          input.value = userLogged.apellido;
          break;
        }

        case 'correo': {
          input.value = userLogged.correo;
          break;
        }

        case 'userid': {
          input.value = userLogged.userid;
          break;
        }

        default:
          input.value = '';
          break;
      }
    }
  }


  /** @callback setEvent */

  /**
   * establece el html y eventos de la pagina
   * @param  {setEvent} callback establece los eventos
   */
  setHtml( callback ) {

    try {
      this.footer.innerHTML += readFileAssets('/home/profile-modal/profile-modal-component.html');
      callback();

    } catch ( error ) {
      console.error( error );
    }
  }


  /**
   * obtiene los valores del formulario
   * @param  {*} $event evento de formulario
   */
  handleSubmit( $event ) {
    $event.preventDefault();

    let formData = new FormData( this.formProfile );

    const data = {
      userid: Number.parseInt( formData.get('userid') )  || null,
      nombre: formData.get('nombre') || '',
      apellido: formData.get('apellido') || '',
      correo: formData.get('correo') || '',
      password: formData.get('password') || '',
      passwordConfirmation: formData.get('password-confirmation') || ''
    };

    this.validate( data, async ( error ) => {

      if ( error ) {
        return;
      };

      try {
        let userLogged = await UsersController.actualizarPerfil( data );
        setUserLogged( userLogged );
        console.log( userLogged );

      } catch ( err ) {
        console.error( err );

      } finally {
        this.modalInstance.hide();

      }
    });
  }


  /**
   * valida el formulario
   * @param  {User} data instancia del usuario
   * @param  {callbackValidateForm} callback respuesta de la validacion
   */
  validate( data, callback ) {
    const { nombre, apellido, correo, password, passwordConfirmation } = data;

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

    let errors = 0;

    // =============================================
    // nombre validaciones
    // =============================================

    if ( !PATTERNS.onlyLetters.test( nombre ) ) {
      errors = errors + 1;
      renderErrors( this.errorName, ERROR_MESSAGES.pattern );
    }

    if ( nombre.trim().length === 0 ) {
      errors = errors + 1;
      renderErrors( this.errorName, ERROR_MESSAGES.required );
    }

    if ( nombre.trim().length > 0 && nombre.trim().length < 2 ) {
      errors = errors + 1;
      renderErrors( this.errorName, ERROR_MESSAGES.min( 2 ) );
    }

    if ( nombre.trim().length > 30 ) {
      errors = errors + 1;
      renderErrors( this.errorName, ERROR_MESSAGES.max( 30 ) );
    }

    // ==================================================
  	// apellido validaciones
  	// ==================================================

  	if ( !PATTERNS.onlyLetters.test( apellido ) ) {
  		errors = errors + 1;
  		renderErrors( this.errorSurname, ERROR_MESSAGES.pattern );
  	}

  	if ( apellido.trim().length === 0 ) {
  		errors = errors + 1;
  		renderErrors( this.errorSurname, ERROR_MESSAGES.required );
  	}

  	if ( apellido.trim().length > 0 && apellido.trim().length < 2 ) {
  		errors = errors + 1;
  		renderErrors( this.errorSurname, ERROR_MESSAGES.min( 2 ) );
  	}

  	if ( apellido.trim().length > 30 ) {
  		errors = errors + 1;
  		renderErrors( this.errorSurname, ERROR_MESSAGES.max( 30 ) )
  	}

    // ========================================
  	//	correo validaciones
  	// ========================================

  	if ( !PATTERNS.email.test( correo ) ) {
  		errors = errors + 1;
  		renderErrors( this.errorEmail, ERROR_MESSAGES.pattern );
  	}

  	if ( correo.trim().length === 0 ) {
  		errors = errors + 1;
  		renderErrors( this.errorEmail, ERROR_MESSAGES.required );
  	}

  	if ( correo.trim().length > 0 && correo.trim().length < 8 ) {
  		errors = errors + 1;
  		renderErrors( this.errorEmail, ERROR_MESSAGES.min( 8 ) );
  	}

  	if ( correo.trim().length > 30 ) {
  		errors = errors + 1;
  		renderErrors( this.errorEmail, ERROR_MESSAGES.max( 30 ) );
  	}

		// ===================================================
		// contraseña validaciones
		// ===================================================

		if ( password.length === 0 ) {
			errors = errors + 1;
			renderErrors( this.errorPassword, ERROR_MESSAGES.required );
		}

		if ( password.length < 8 && password.length > 0 ) {
			errors = errors + 1;
			renderErrors( this.errorPassword, ERROR_MESSAGES.min( 8 ) )
		}

		if ( passwordConfirmation.length === 0 ) {
			errors = errors + 1;
			renderErrors( this.errorConfirmation, ERROR_MESSAGES.required )
		}

		if ( passwordConfirmation !== password ) {  // contraseñas diferentes
			errors = errors + 1;
			renderErrors( this.errorConfirmation, ERROR_MESSAGES.notMatch );
		}

    // ====================================================
    // contador de errores
    // ====================================================
    if ( errors > 0 ) {
      callback( true );
      return;
    }

    callback();
  }

  /**
   * Limpia los campos del formulario
   * @param  {boolean} button indica si la funcion es llamado desde el boton del formulario
  */
  resetForm( button = false ) {

    hideElement( this.errorEmail );
    hideElement( this.errorName );
    hideElement( this.errorSurname );
    hideElement( this.errorPassword );
    hideElement( this.errorConfirmation );

    if ( button ) {
      this.formProfile.reset();
      this.setForm();
    }

    this.formProfile.querySelector('#profile-name').focus();
  }
}

module.exports = {
  ProfileModalComponent
}
