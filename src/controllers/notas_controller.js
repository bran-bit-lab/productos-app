const { Notification, dialog } = require('electron');
const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');

class NotasController {

	databaseInstance = null;

	static get database() {
		return this.databaseInstance || ( this.databaseInstance = new Database() );
	}

	static crearNota( nota ) {

		// nota tiene todas las propiedades del nota de entrega + productos, nopuedes enviar todo eso
		// por que mostrarar un error si haces un log de nota te trae toda la informacion debes extraer
		// sus propiedades y crear el objeto para cada consulta

		let nuevaNota = {
			userid: nota['userid'],
			status: nota['status'],
			descripcion_nota: nota['descripcion_nota'],
			id_cliente: nota['id_cliente'],
			fecha_entrega: nota['fecha_entrega']
		};

		let arrayProductos = nota['productos'];

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


				arrayProductos = arrayProductos.map((producto) => {
					return {
						id_nota: ultimoRegistro['id_nota'],
						id_producto: producto['productoid'],
						cantidad_selecionada: producto['cantidad_seleccionada']
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

			if ( error ){

				console.log( error );
				throw error;
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
}

module.exports = { NotasController };
