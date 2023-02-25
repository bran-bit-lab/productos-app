const { Notification } = require('electron');
const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');
const { ProductosController } = require('./productos-controllers');

/** clase que gestiona los productos con las notas de entregas */
class NotasProductosController {

	/** @type {?Database} */
	databaseInstance = null;

	/** Propiedad get database retorna una nueva instancia de la clase Database */
	static get database() {
		return this.databaseInstance || ( this.databaseInstance = new Database() );
	}

	/**
	 * @callback callbackResponse
	 * @returns {void}
	*/
	/**
	 * inserta nueva relacion de notas productos en la BD.
	 *
	 * @param  {NotaProducto} notaProducto  instancia de nota producto
	 * @param  {?callbackResponse} callback callback de respuesta al final la insercion
	 */
	static insertarNotasProductos( notaProducto, callback = null ) {

		//console.log( notaProducto );

		this.insert( CRUD.crearNotaProducto, notaProducto, ( error, resultado ) => {

			if ( error ) {

				console.log( error );
				throw error;
			}

			// actualiza el valor de la cantidad del producto
			NotasProductosController.restarCantidad.call( NotasProductosController.database, notaProducto, callback );
		});
	}


	/**
	 * resta la cantidad almecenada en el registro del producto
	 *
	 * @param  {NotaProducto} notaProducto
	 * @param  {?callbackResponse} callback devolucion de llamada al final del proceso de actualizacion
	 */
	static restarCantidad( notaProducto, callback ) {

		let restarCantidad = notaProducto['cantidad'] - notaProducto['cantidad_seleccionada']

		let productoActualizado = {
			productoid: notaProducto['id_producto'],
			cantidad: restarCantidad
		};

		this.update( CRUD.cantidadProducto, productoActualizado, ( error ) => {

			if ( error ) {

				console.log( error );

				throw error;  // mostrará el error en pantalla
			}

			if ( callback ) {
				callback();
			}
  		});
	}

	/**
	 * suma la cantidad almecenada en el registro del producto
	 *
	 * @param  {NotaProducto} notaProducto
	 * @param  {?callbackResponse} callback devolucion de llamada al final del proceso de actualizacion
	 */
	static sumarCantidad( notaProducto, callback ) {

		let sumarCantidad = notaProducto['cantidad'] + notaProducto['cantidad_seleccionada']

		// console.log( notaProducto );

		let productoActualizado = {
			productoid: notaProducto['productoid'],
			cantidad: sumarCantidad
		};

		this.database.update( CRUD.cantidadProducto, productoActualizado, ( error ) => {

			if ( error ) {
				console.log( error );

				throw error;  // mostrará el error en pantalla
			}

			callback();
  		});
	}


	/**
	 * Actualiza la relacion de notas producto en la BD.
	 *
	 * @param  {NotaProducto} notaProducto instancia de nota producto
	 * @param  {number} sumaAlgebraica  resultado de la operacion de la cantidad seleccionada desde la BD y el modelo actualizado
	 * @param  {callbackResponse} callback callback de respuesta de la operacion
	 */
	static actualizarNotasProductos( notaProducto, sumaAlgebraica, callback = null ) {

		let objetoNP = {
			id_NP: notaProducto['id_NP'],
		 	cantidad_seleccionada : notaProducto['cantidad_seleccionada']
		 };

		this.database.update( CRUD.actualizarNotaProducto, objetoNP, ( error, resultado ) => {

			if ( error ) {
				console.log( error );

				throw error;
			}

			let productoActualizado = {
				productoid: notaProducto['productoid'],
				suma_algebraica: sumaAlgebraica
			}

			
			ProductosController.editarCantidadProducto( productoActualizado, callback );
		});
	}


	/**
	 * retira el producto almacenado en la orden desde la BD.
	 * @param  {NotaProducto} notaProducto instancia de nota producto
	 */
	static retirarProductoNota( notaProducto ) {

		this.database.delete( CRUD.eliminarNotaProducto, { id_NP: notaProducto['id_NP'] }, ( error ) => {

			const notificacion = new Notification({
				title: '',
				body: ''
			});

			if ( error ) {
				notificacion['title'] = 'Error!!';
				notificacion['body'] = 'Error al retirar el producto de la orden'

				notificacion.show();

				console.log( error );

				throw error;
			}

			// console.log('aqui se elimino');

			NotasProductosController.sumarCantidad( notaProducto, () => {
				notificacion['title'] = 'Exito!!';
				notificacion['body'] = 'Producto retirado de la nota de entrega'
				notificacion.show();
			});
		});
	}
}

/**
 * NotaProducto
 * @typedef {Object} NotaProducto
 * @property {number} id_NP identificador de notas_producto
 * @property {number} id_nota identificador de nota a que pertenece la relacion
 * @property {number} id_producto identificador de producto seleccionado
 * @property {number} cantidad_seleccionada cantidad seleccionada en la orden
 */

module.exports = { NotasProductosController };
