const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');
const { Notification } = require('electron');

class ClientesController {

	databaseInstance = null;

		static get database() {
			return this.databaseInstance || ( this.databaseInstance = new Database() );
		}

		static crearCliente( cliente ) {

			this.database.insert( CRUD.crearCliente, cliente, ( error ) => {

				const notificacion = new Notification({
					title: '',
					body: ''
				});

				if ( error ) {

					console.log( error );
					// throw error;  // mostrará el error en pantalla

					notificacion['title'] = 'Error!!';
					notificacion['body'] = 'Error al crear cliente';

					notificacion.show();

					return;
				}

				notificacion['title'] = 'Registro exitoso!!';
				notificacion['body'] = 'Cliente creado con exito';

				notificacion.show();

	  		});
		}

	static obtenerTotalClientes() {

		return new Promise( ( resolve, reject ) => {

			this.database.getTotalRecords( CRUD.obtenerTotalClientes, ( error, resultado ) => {

				const notificacion = new Notification({
					title: 'Error en obtener los registros',
					body: 'No se pudo obtener el total de registros'
				});

				if ( error ) {

					notificacion.show();

					console.log( error );
					return reject( error );
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


	static listarClientes( pagination ) {

		return new Promise(( resolve, reject ) => {

			pagination = { start: pagination[0], limit: pagination[1] };

			this.database.consult( CRUD.listarClientes, pagination, ( error, results ) => {

				if ( error ) {

					console.log( error );
					return reject( error );
				}

				resolve( results );
			});

		});
	}

	static buscarCliente( cliente ) {

		return new Promise(( resolve, reject ) => {

			this.database.find( CRUD.buscarCliente, cliente, ( error, results ) => {

				const notificacion = new Notification({
					title: '',
					body: ''
				});

				if ( error ) {

					notificacion['title'] = 'Error!!';
					notificacion['body'] = 'No se encontro el cliente';

					notificacion.show();

					console.log( error );
					return reject( error );
				}

				resolve( results );
			});

		});
	}

	static editarCliente( cliente ) {

			this.database.update( CRUD.editarCliente, cliente, ( error ) => {

				const notificacion = new Notification({
					title: '',
					body: ''
				});

				if ( error ) {

					// throw error;  // mostrará el error en pantalla

					notificacion['title'] = 'Error!!';
					notificacion['body'] = 'Error al actualizar cliente';

					notificacion.show();

					console.log( error );

					return;
				}

	  		});
	}
}

module.exports = {
	ClientesController
};
