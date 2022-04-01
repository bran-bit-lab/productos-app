/**
 * formulario de clientes
 * @module ModalClientFormComponent
 */
/**
 * despliuega el modal de clientes
 *
 * @param  {string} method metodo para utilizar en el controller
 * @param  {number|null} id  identificador de cliente
 */
function openModal( method = 'new', id = null  ) {

  const modalTitle = modalClientForm._element.querySelector('.modal-title');

  if ( method !== 'new' ) {
    idClient = id;

    modalTitle.innerText = (`Editar cliente ${ idClient }`);

    let client = clientsTableComponent.clients.find(( client ) => client.id_cliente === id );

    setForm( client );

  } else {
    modalTitle.innerText = 'Nuevo Cliente';

    idClient = null;

    setForm();
  }
}

/** Cierra el modal */
function closeModal() {
	modalClientForm.toggle();
}


/**
 * Establece el formulario de clientes
 * @param  {Client} client instancia del cliente
 */
function setForm( client ) {

  if ( client ) {

    for ( const input of clientForm.querySelectorAll('input') ) {

      switch ( input.name ) {
        case 'nombre_cliente': {
          input.value = client.nombre_cliente;
          break;
        }

        case 'direccion_entrega': {
          input.value = client.direccion_entrega;
          break;
        }

        case 'rif': {
          input.value = client.rif;
          break;
        }

        default: {
          input.value = client.telefono_contacto
          break;
        }
      }
    }
  }

  modalClientForm.toggle();
}

/**
* @callback callbackValidateForm
* @param {boolean} error indica si existe un error en el formulario
*/
/**
 * Funcion de validacion de datos
 *
 * @param  {Client} data     instancia del cliente
 * @param  {callbackValidateForm} callback  llamada de respuesta al realizar la validacion
 *
 * @example
 * validate( data, ( error ) => {
 * 
 *    if ( error ) {
 *      return;
 *    }
 *
 *    // rest of code ...
 * });
 */
function validate( data, callback ) {

  resetFields();

  // validar data
  const { nombre_cliente, direccion_entrega, rif, telefono_contacto } = data;

  const ERROR_MESSAGES = Object.freeze({
		required: 'campo requerido',
		email: 'correo inválido',
		min: ( min ) => 'minimo ' + min + ' caracteres',
		max: ( max ) => 'máximo ' + max + ' caracteres',
		pattern: 'Patrón de datos inválido',
		notMatch: 'La contraseña no coincide',
    	rif: 'El rif no es valido',
    	phone: 'El numero de telefono no es valido'
	});

  // console.log( data );

	const PATTERNS = Object.freeze({
		email: new RegExp( /^[a-z0-9]+@[a-z]{4,}\.[a-z]{3,}$/ ),
		onlyLetters: new RegExp( /^[a-zA-Z\u00f1\u00d1\u00E0-\u00FC\u00C0-\u017F\s]+$/ ),
		area: new RegExp( /^Ventas|Almacen|Administracion$/ ),
    	rif: new RegExp( /^(J|j)-[0-9]{1,8}-[0-9]{1}|(V|v)-[0-9]{1,8}-[0-9]{1}|(G|g)-[0-9]{1,8}-[0-9]{1}$/ ),
    	phone: new RegExp( /^[0-9]{4}-[0-9]{7}$/ )
  	});

	// contador de errores
	let errors = 0;

	// ========================================
	//	nombre cliente validaciones
	// ========================================

	if ( !PATTERNS.onlyLetters.test( nombre_cliente ) ) {
		errors = errors + 1;
		renderErrors( nameClientErrorsNode, ERROR_MESSAGES.pattern );
	}

	if ( nombre_cliente.trim().length === 0 ) {
		errors = errors + 1;
		renderErrors( nameClientErrorsNode, ERROR_MESSAGES.required );
	}

	if ( nombre_cliente.trim().length > 0 && nombre_cliente.trim().length < 8 ) {
		errors = errors + 1;
		renderErrors( nameClientErrorsNode, ERROR_MESSAGES.min( 8 ) );
	}

	if ( nombre_cliente.trim().length > 30 ) {
		errors = errors + 1;
		renderErrors( nameClientErrorsNode, ERROR_MESSAGES.max( 30 ) );
	}

	// =============================================
	// direccion validaciones
	// =============================================

	if ( !PATTERNS.onlyLetters.test( direccion_entrega ) ) {
		errors = errors + 1;
		renderErrors( directionErrorsNode, ERROR_MESSAGES.pattern );
	}

	if ( direccion_entrega.trim().length === 0 ) {
		errors = errors + 1;
		renderErrors( directionErrorsNode, ERROR_MESSAGES.required );
	}

	if ( direccion_entrega.trim().length > 0 && direccion_entrega.trim().length < 2 ) {
		errors = errors + 1;
		renderErrors( directionErrorsNode, ERROR_MESSAGES.min( 2 ) );
	}

	if ( direccion_entrega.trim().length > 255 ) {
		errors = errors + 1;
		renderErrors( directionErrorsNode, ERROR_MESSAGES.max( 255 ) );
	}

	// ==================================================
	// rif validaciones
	// ==================================================

	if ( !PATTERNS.rif.test( rif ) ) {
		errors = errors + 1;
		renderErrors( rifErrorsNode, ERROR_MESSAGES.rif );
	}

	if ( rif.trim().length === 0 ) {
		errors = errors + 1;
		renderErrors( rifErrorsNode, ERROR_MESSAGES.required );
	}

	if ( rif.trim().length > 0 && rif.trim().length < 2 ) {
		errors = errors + 1;
		renderErrors( rifErrorsNode, ERROR_MESSAGES.min( 2 ) );
	}

	if ( rif.trim().length > 30 ) {
		errors = errors + 1;
		renderErrors( rifErrorsNode, ERROR_MESSAGES.max( 30 ) )
	}

  // ==================================================
	// telefono_contacto  validaciones
	// ==================================================

  if ( !PATTERNS.phone.test( telefono_contacto ) ) {
    errors = errors + 1;
    renderErrors( phoneErrorsNode, ERROR_MESSAGES.phone );
  }

  if ( telefono_contacto.trim().length === 0 ) {
		errors = errors + 1;
		renderErrors( phoneErrorsNode, ERROR_MESSAGES.required );
	}

	if ( telefono_contacto.trim().length > 0 && telefono_contacto.trim().length < 2 ) {
		errors = errors + 1;
		renderErrors( phoneErrorsNode, ERROR_MESSAGES.min( 2 ) );
	}

	if ( telefono_contacto.trim().length > 30 ) {
		errors = errors + 1;
		renderErrors( phoneErrorsNode, ERROR_MESSAGES.max( 30 ) )
	}

	if ( errors > 0 ) {
		return callback( true );
	}

  callback( false );
}


/**
 * Envia los datos del formulario
 * @param  {*} $event evento de envio
 */
function handleSubmit( $event ) {

  $event.preventDefault();

  const formData = new FormData( clientForm );

  let data = {
    nombre_cliente: formData.get('nombre_cliente') || '',
    direccion_entrega: formData.get('direccion_entrega') || '',
    telefono_contacto: formData.get('telefono_contacto') || '',
    rif: formData.get('rif') || ''
  };

  validate( data, ( error ) => {

    if ( error ) {
      return;
    }

    if ( idClient ) {
      clientsTableComponent.editClient({ ...data, id_cliente: idClient });

    } else {
      clientsTableComponent.addClient( data );

    }

    closeModal();
  });
}


/**
 * Limpia los campos del formulario
 * @param  {boolean} button flag para indicar que se limpia desde el boton
 */
function resetFields( button = false ) {

	// se limpia los errores de validación
	hideElement( nameClientErrorsNode );
	hideElement( directionErrorsNode );
	hideElement( rifErrorsNode );
	hideElement( phoneErrorsNode );

	if ( button ) {
		clientForm.reset();
	}

	return footer.querySelector('#name-client').focus();
}

/** @type {null|number} */
let idClient = null;

const clientForm = document.forms['formClients'];

clientForm.addEventListener( 'submit',  handleSubmit );

/**
* instancia del modal
* @type {Modal}
*/
const modalClientForm = new Modal( footer.querySelector('.modal-clients'), {
  backdrop: 'static'
});

const nameClientErrorsNode = clientForm.querySelector('#error-name');
const directionErrorsNode = clientForm.querySelector('#error-direction');
const rifErrorsNode = clientForm.querySelector('#error-rif');
const phoneErrorsNode = clientForm.querySelector('#error-phone');

footer.querySelector('.modal-clients').addEventListener('hidden.bs.modal', () => resetFields( true )  );

module.exports = {
  openModal,
  closeModal,
  resetFields
};
