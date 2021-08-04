const { Notification, dialog } = require('electron');
const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');
const TIME = require('../util_functions/time');

class NotasController {

	databaseInstance = null;

	static get database() {
		return this.databaseInstance || ( this.databaseInstance = new Database() );
	}

	static crearNota( nota ) {

		// nota tiene todas las propiedades del nota de entrega + productos, nopuedes enviar todo eso
		// por que mostrarar un error si haces un log de nota te trae toda la informacion debes extraer
		// sus propiedades y crear el objeto para cada consulta

		// console.log( nota );

		let nuevaNota = {
			userid: nota['userid'],
			status: nota['status'],
			descripcion_nota: nota['descripcion_nota'],
			id_cliente: nota['id_cliente'],
			fecha_entrega: nota['fecha_entrega']
		};

		let arrayProductos = nota['productos']; // aqui te trae toda la info de los producto aqui esta la cantidad

		const validarCantidad = arrayProductos.every(( producto ) => producto['cantidad_seleccionada'] <= producto['cantidad']);

		if ( validarCantidad === false ){

			dialog.showMessageBox (null, {
				type: 'warning',
				title: 'advertencia',
				message: 'la cantidad seleccionada no debe ser mayor a la cantidad disponible'
			});

			throw new Error("La cantidad seleccionada no debe ser mayor a la cantidad disponible");
		}

		this.database.insert( CRUD.crearNota, nuevaNota, async ( error ) => {

			const notificacion = new Notification({
				title: '',
				body: ''
			});

			if ( error ) {

				notificacion['title'] = 'Error!!';
				notificacion['body'] = 'Error al crear Nota';

				notificacion.show();

				console.log(error);

				throw error;
			}

			try {
				// recuerda que obtener id nota es un metodo estatico se invoca nombre_clase.metodo()
				let ultimoRegistro = await NotasController.obtenerIdNota();

				// aqui se filtro lo campos excluyendo la cantidad
				//console.log (arrayProductos);


				arrayProductos = arrayProductos.map((producto) => {
					return {
						id_nota: ultimoRegistro['id_nota'],
						id_producto: producto['productoid'],
						cantidad_seleccionada: producto['cantidad_seleccionada'],
						cantidad: producto['cantidad']
					}
				});

				arrayProductos.forEach( NotasController.insertarNotasProductos.bind( new Database() ));

				notificacion['title'] = 'Éxito';
				notificacion['body'] = 'Nota creada con éxito';

				notificacion.show();

			} catch ( error ) {
				console.error( error );

				throw error;
			}

		});
	}

	static insertarNotasProductos( notaProducto ) {

		//console.log( notaProducto );

		this.insert( CRUD.crearNotaProducto, notaProducto, ( error, resultado ) => {

			if ( error ) {

				console.log( error );
				throw error;
			}

			NotasController.actualizarCantidad.call( new Database(), notaProducto );
		});

	}

	static actualizarCantidad( notaProducto ) {

		let restarCantidad = notaProducto['cantidad'] - notaProducto['cantidad_seleccionada']

		let productoActualizado = {
			productoid: notaProducto['id_producto'],
			cantidad: restarCantidad
		};

		this.update( CRUD.cantidadProducto, productoActualizado, ( error ) => {

			if ( error ) {

				// throw error;  // mostrará el error en pantalla

				console.log( error );

				return;
			}
  	});
	}

	static obtenerIdNota() {

		return new Promise( ( resolve, reject ) => {

			this.database.consult( CRUD.ultimoRegistro, null, ( error, resultado ) => {

				const  notificacion = new Notification({
					title: 'Error en obtener los registros',
					body: 'No se pudo obtener el registro'
				});

				if ( error ) {

					notificacion.show();
					console.log( error );

					reject( error );

					return;
				}

				const ultimoRegistro = resultado[0];

				// el resolve es el valor de vuelta asignado
				resolve( ultimoRegistro );
			});
		});

	}

	static obtenerNota( idNota ) {

		return new Promise(( resolve, reject ) => {

			this.database.consult( CRUD.obtenerNota, 	{ id_nota: idNota }, ( error, resultadoNota ) => {

				if ( error ) {
					console.log( error );

					reject( error );

					return;
				}

				let nota = resultadoNota[0];

				// newDate parsea la fecha para pasar a la funcion dateSpanish la cual la envia en formato español
				// si existe la fecha de entrega

				if ( nota['fecha_entrega'] ) {
					nota['fecha_entrega'] = TIME.dateToString( new Date( nota['fecha_entrega'] ) );
				}

				this.database.consult( CRUD.obtenerNotaProducto, 	{ id_nota: idNota }, ( error, resultadoNotaProducto ) => {

					if ( error ) {
						console.log( error );

						reject( error );

						return;
					}

					// console.log( ">>>>>>>", { nota, resultadoNotaProducto }, "<<<<<<<" );

					resolve({
						...nota,
						productos: resultadoNotaProducto,
						total_order: NotasController.calcularTotalNotas( resultadoNotaProducto )
					});

				});
			});
		});

	}

	static calcularTotalNotas( arrayNotaProducto ) {

		const reducer = ( accumulator, currentValue ) => {
			return accumulator = accumulator + ( currentValue['cantidad_seleccionada'] * currentValue['precio'] );
		}

		return Number.parseFloat( arrayNotaProducto.reduce(reducer, 0).toFixed(2) );
	}


	static obtenerTotalNotas() {

		return new Promise( ( resolve, reject ) => {

			this.database.getTotalRecords( CRUD.obtenerTotalNotas, ( error, resultado ) => {

				const notificacion = new Notification({
					title: 'Error en obtener los registros',
					body: 'No se pudo obtener el total de registros'
				});

				if ( error ) {

					notificacion.show();

					console.log( error );

					reject( error );

					return;
				}

				const totalRegistros = resultado[0]['COUNT(*)'];

				let totalPaginas = ( totalRegistros / 10 );

				resolve({
					totalPaginas: Math.ceil( totalPaginas ),
					totalRegistros: totalRegistros
				});

			});

		});
	}

	static listarNotas( pagination ) {

		return new Promise(( resolve, reject ) => {

			pagination = { start: pagination[0], limit: pagination[1] };

			this.database.consult( CRUD.listarNotas, pagination, ( error, results ) => {

				if ( error ) {

					console.log( error );

					reject( error );

					return;
				}

				resolve( results );
			});

		});
	}


	static editarProducto( producto, usuario ) {

		// console.log (producto, "<-- log del producto");

		this.database.update( CRUD.editarProducto, producto, ( error ) => {

			const notificacion = new Notification({
				title: '',
				body: ''
			});

			if ( error ) {

				// throw error;  // mostrará el error en pantalla

				notificacion['title'] = 'Error!!';
				notificacion['body'] = 'Error al actualizar producto';

				notificacion.show();

				console.log( error );

				return;
			}

				notificacion['title'] = 'Exito!!';
				notificacion['body'] = 'Producto Modificado';

				notificacion.show();
  		});
	}

	static activarProducto( producto ) {

		//console.log (producto, "<-- log del producto");

		this.database.update( CRUD.activarProducto, producto, ( error ) => {

			const notificacion = new Notification({
				title: '',
				body: ''
			});

			if ( error ) {

				// throw error;  // mostrará el error en pantalla

				notificacion['title'] = 'Error!!';
				notificacion['body'] = 'Error al actualizar nota';

				notificacion.show();

				console.log( error );

				return;
			}

				notificacion['title'] = 'Exito!!';
				notificacion['body'] = 'Producto Modificado';

				notificacion.show();
  		});
	}

	static buscarNota( search ) {

		return new Promise(( resolve, reject ) => {

				// console.log( CRUD.buscarNotas );

				this.database.find( CRUD.buscarNotas, search, ( error, results ) => {

					const notificacion = new Notification({
						title: '',
						body: ''
					});

					if ( error ) {

						// throw error;

						notificacion['title'] = 'Error!!';
						notificacion['body'] = 'Error al buscar Nota';

						notificacion.show();

						console.log( error );

						reject( error );

						return;
					}

					resolve( results );
				});
		});
	}

	static showAlert( type = 'info', title, message ) {
		dialog.showMessageBox( null, {
			message,
			type,
			title
		});
	}

	static actualizarNota( nota ) {
		// actualizar nota ...
		console.log( nota );
	}
}

module.exports = { NotasController };
