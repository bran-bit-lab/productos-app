const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');
const { Notification } = require('electron');

/** Controlador de clientes */
class ClientesController {

		/** @type {Database|null} */
		databaseInstance = null;

		/** Propiedad get database retorna una nueva instancia de la clase Database */
		static get database() {
			return this.databaseInstance || ( this.databaseInstance = new Database() );
		}

		/**
		 * crea un nuevo cliente
		 * @param  {Client} cliente instancia del cliente
		 */
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

	/**
	* Obtiene el total de los clientes
	* @returns {Promise<{ totalPaginas: number, totalRegistros: number }>}
	*/
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

	/**
	 * Lista los clientes en forma paginada
	 * @param  {Array<number>} pagination array de numeros de la paginacion
	 * @returns {Promise<Array<Client>>} Retorna una promesa con el arreglo de clientes
	 */
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

	/**
	 * Permite buscar usuarios en la BD
	 * @param  {Object} cliente cliente a buscar
	 * @param {string} cliente.search cadena de busqueda del cliente
	 * @return {Promise<Array<Client>>}  devuelve una promesa con los resultados encontrados
	 * @example
	 * this.clients = await ClientesController.buscarCliente({ search: '%' + search + '%' });
	 */
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


	/**
	 * Edita los datos del cliente
	 * @param  {Client} cliente instancia del cliente
	 */
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

				notificacion['title'] = 'Actualizacion exitosa!!';
				notificacion['body'] = 'Cliente actualzado con exito';

				notificacion.show();

	  	});
	}
}

/**
 * Client
 * @typedef {Object} Client
 * @property {number} [id_cliente] identificador de cliente
 * @property {string} nombre_cliente nombre del cliente
 * @property {string} direccion_entrega direccion de entrega
 * @property {string} rif identificador de registro fiscal de cliente
 * @property {string} telefono_contacto telefono contacto del cliente
 */

module.exports = {
	ClientesController
};
