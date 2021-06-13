const { Notification } = require('electron');
const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');

class NotasController {

	databaseInstance = null;

	static get database() {
		return this.databaseInstance || ( this.databaseInstance = new Database() );
	}

	static crearNota( nota, usuario ) {

		let nuevaNota = {
			...nota,
			userid: usuario['userid']
		};

		// console.log( nuevaNota );

		this.database.insert( CRUD.crearNota, nuevaNota, ( error ) => {

			const notificacion = new Notification({
				title: '',
				body: ''
			});

			if ( error ) {

				notificacion['title'] = 'Error!!';
				notificacion['body'] = 'Error al crear Nota';

				notificacion.show();

				return;
			}

			notificacion['title'] = 'Éxito';
			notificacion['body'] = 'Nota creada con éxito';

			notificacion.show();

		});
	}

	static obtenerTotalNotas() {

		return new Promise( ( resolve, reject ) => {

			this.database.getTotalRecords( CRUD.obtenerTotalProductos, ( error, resultado ) => {

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

	static listarProductos( pagination ) {

		return new Promise(( resolve, reject ) => {

			pagination = { start: pagination[0], limit: pagination[1] };

			this.database.consult( CRUD.listarProductos, pagination, ( error, results ) => {

				if ( error ) {

					console.log( error );

					reject( error );

					return;
				}

				// console.log( results );
				resolve( results );
			});

		});
	}

	static listarCategorias() { // este es el metodo que no estaba incluido lo que fue agregarlo

		return new Promise(( resolve, reject ) => {

			this.database.consult( CRUD.listadoCategoriasProductos, ( error, results ) => {

				if ( error ) {
					console.log( error );

					reject( error );
				}

				resolve( results );
			})
		})
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

	static buscarProducto( search ) {

		return new Promise(( resolve, reject ) => {

				this.database.find( CRUD.buscarProducto, search, ( error, results ) => {

					const notificacion = new Notification({
						title: '',
						body: ''
					});

					if ( error ) {

						// throw error;  // mostrará el error en pantalla

						notificacion['title'] = 'Error!!';
						notificacion['body'] = 'Error al buscar Producto';

						notificacion.show();

						console.log( error );

						reject( error );

						return;
					}

					resolve( results );
				});
		});
	}

}

module.exports = { ProductosController };
