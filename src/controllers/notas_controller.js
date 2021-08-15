const { Notification, dialog } = require('electron');
const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');
const TIME = require('../util_functions/time');
const { ProductosController } = require('./productos_controllers');

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

			// actualiza el valor de la cantidad del producto
			NotasController.restarCantidad.call( new Database(), notaProducto );
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
			ProductosController.editarCantidadProducto(productoActualizado);
			
		});
	}
	
	// en caso de que retire el producto de la nota
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

	static obtenerIdNota( ) {

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

	static mostrarAlerta( type = 'info', title, message ) {
		dialog.showMessageBox( null, {
			message,
			type,
			title
		});
	}

	static actualizarNota( nota ) {

		let notaActualizada = {
			userid: nota['userid'],
			status: nota['status'],
			descripcion_nota: nota['descripcion_nota'],
			id_cliente: nota['id_cliente'],
			fecha_entrega: nota['fecha_entrega']
		};

		let arrayProductos = nota['productos'];

		const validarCantidad = arrayProductos.every(( producto ) => producto['cantidad_seleccionada'] <= producto['cantidad']);

		if ( validarCantidad === false ) {

			dialog.showMessageBox (null, {
				type: 'warning',
				title: 'advertencia',
				message: 'la cantidad seleccionada no debe ser mayor a la cantidad disponible'
			});

			throw new Error("La cantidad seleccionada no debe ser mayor a la cantidad disponible");
			return;
		}

		//console.log({ nota, notaActualizada, arrayProductos });

		// actualizar nota ...

		// obtener las N_P asociadas al id

		let idNota = nota['id_nota'];

		this.database.consult( CRUD.listarNotasProductos, { id_nota : idNota }, ( error, results ) => {

				if ( error ) {

					console.log( error );

					reject( error );

					return;
				}

				const notaProductoDB = results;

				arrayProductos.forEach(( notaProducto ) => {
					
					let index = notaProductoDB.findIndex(( notaProductoDB ) => {
						return notaProducto['id_NP'] === notaProductoDB['id_NP'];
					});
					
					if ( index === -1 ){
						
						NotasController.insertarNotasProductos(notaProducto)	
					
					} else {
						
						let cantidadBD = notaProductoDB[index]['cantidad_seleccionada'];	
						let cantidadActualizada = notaProducto['cantidad_seleccionada'];

						let sumaAlgebraica = (cantidadBD - cantidadActualizada);


						NotasController.actualizarNotasProductos(notaProducto, sumaAlgebraica);

						//console.log( notaProducto );
					}

				//actualizar producto despues de la N_P



				});
		});

		// luego verificar el array de notas productos de la BD si esta en el array se actualiza la nota producto ...
		// sino se crea ...
	}
}

module.exports = { NotasController };
