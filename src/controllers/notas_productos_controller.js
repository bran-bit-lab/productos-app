const { Notification, dialog } = require('electron');
const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');
const TIME = require('../util_functions/time');
const { ProductosController } = require('./productos_controllers');

class NotasProductosController {

	databaseInstance = null;

	static get database() {
		return this.databaseInstance || ( this.databaseInstance = new Database() );
	}

	static insertarNotasProductos( notaProducto ) {

		//console.log( notaProducto );

		this.insert( CRUD.crearNotaProducto, notaProducto, ( error, resultado ) => {

			if ( error ) {

				console.log( error );
				throw error;
			}

			// actualiza el valor de la cantidad del producto
			NotasProductosController.restarCantidad.call( new Database(), notaProducto );
		});

	}

	static restarCantidad( notaProducto ) {

		let restarCantidad = notaProducto['cantidad'] - notaProducto['cantidad_seleccionada']

		let productoActualizado = {
			productoid: notaProducto['id_producto'],
			cantidad: restarCantidad
		};

		this.update( CRUD.cantidadProducto, productoActualizado, ( error ) => {

			if ( error ) {

				console.log( error );

				throw error;  // mostrará el error en pantalla

				return;
			}
  		});
	}

	static sumarCantidad( notaProducto, callback ) {

		let sumarCantidad = notaProducto['cantidad'] + notaProducto['cantidad_seleccionada']

		// console.log( notaProducto );

		let productoActualizado = {
			productoid: notaProducto['productoid'],
			cantidad: sumarCantidad
		};

		this.database.update( CRUD.cantidadProducto, productoActualizado, ( error ) => {

			if ( error ) {

				throw error;  // mostrará el error en pantalla

				console.log( error );

				return;
			}

			callback();
  		});
	}

	static actualizarNotasProductos( notaProducto, sumaAlgebraica ) {

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

			// importarproductosController y llamar a su metodo
			//console.log (ProductosController);
			ProductosController.editarCantidadProducto( productoActualizado );
			
		});
	}

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

			NotasController.sumarCantidad( notaProducto, () => {
				notificacion['title'] = 'Exito!!';
				notificacion['body'] = 'Producto retirado de la nota de entrega'
				notificacion.show();
			});

		});
	}

	

}