const { dialog } = require('electron');
const mysql = require('mysql');
const file = require('../util-functions/file');

/**
* API de mysql
*@type {mysql.Connection|null}
*/
let mysqlAPI = null;

/** Clase de conexion a la base de datos */
class Database {

	/**
	 * Retorna una instancia del objeto de conexion MYSQL
	 */
	get _mysqlAPI() {
		return mysqlAPI;
	}

	/**
	* @callback callbackInsert
	* @param {string|Error|null} error error al insertar en la BD.
	*/
	/**
	* Inserta elemento en la base de datos
	* @param {string} sql string SQL.
	* @param {Object} data Objeto de consulta
	* @param {callbackInsert} callback respuesta al insertar en la bd
	*/
	insert( sql, data, callback ) {
		mysqlAPI.query( sql, data, callback );
	}

	/**
	* Obtiene el total de registros en la BD.
	* @param {string} sql string SQL.
	* @param {Object} data Objeto de consulta
	* @param {callbackConsult} callback respuesta al consultar en la bd
	*/
	getTotalRecords( sql, callback ) {
		mysqlAPI.query( sql, callback );
	}

	/**
	* @callback callbackConsult
	* @param {string|Error|null} error error al insertar en la BD.
	* @param {Array<Object>} results arreglo de objetos producto de la consulta
	*/
	/**
	* Inserta elemento en la base de datos
	* @param {string} sql string SQL.
	* @param {Object|null} pagination paginacion de la tabla
	* @param {number} pagination.start inicio de la paginacion
	* @param {number} pagination.limit final de la paginacion
	* @param {callbackConsult} callback respuesta al consultar en la bd
	*/
	consult( sql, paginacion, callback ) {
		mysqlAPI.query( sql, paginacion, callback );
	}

	/**
	* Busca registros en la BD.
	* @param {string} sql string SQL.
	* @param {Object} data Objeto de consulta
	* @param {callbackConsult} callback respuesta al consultar en la bd
	*/
	find( sql, data, callback ) {
		mysqlAPI.query( sql, data, callback );
	}

	/**
	* @callback callbackUpdate
	* @param {string|Error|null} error error al insertar en la BD.
	*/
	/**
	* Busca registros en la BD.
	* @param {string} sql string SQL.
	* @param {Object} data Objeto de consulta
	* @param {callbackUpdate} callback respuesta al momento de actualizar
	*/
	update( sql, data, callback ) {
		mysqlAPI.query( sql, data, callback );
	}

	/**
	* @callback callbackDelete
	* @param {string|Error|null} error error al insertar en la BD.
	*/
	/**
	* Busca registros en la BD.
	* @param {string} sql string SQL.
	* @param {Object} data Objeto de consulta
	* @param {callbackDelete} callback respuesta al momento de eliminar registro
	*/
	delete( sql, data, callback ) {
		mysqlAPI.query( sql, data, callback );
	}

	/** * Cierra la conexion a la BD */
	static closeConnection() {

		if ( !mysqlAPI ) {
			return;
		}

		mysqlAPI.end(( error ) => {

			if ( error ) {
				throw error;
			}

			console.log('Conexion cerrada exitosamente');
		});
	}

	/**
	* Pasea el formato string a un SQL valido para la base de datos
	* @param {string} query consulta SQL
	* @param {Object} values objeto de consulta
	* @returns {string}  retorna la consulta valida.
	*/
	static sqlParse( query, values ) {

		if ( !values ) {
   			return query;
		}

		return query.replace( /\:(\w+)/g, ( function( text, result ) {

			/*
				El devuelve el sql transformado
			 	recibe 2 parametros
			 	1.- texto, que es la cadena a transformar
			 	2.- es el resultado de la búsqueda
			 	según la documentación de replace debe devolver un string
			*/

			if ( values.hasOwnProperty( result ) ){
				return this.escape( values[result] );
			}

			return text;

		}).bind( this ));
	}

	/** Se conecta a la base de datos */
	static connect() {

		let user = null

		try {
			let data = file.readFile('/users-productos-app.json');

			let arregloConexion = JSON.parse( data );
			let key = 'root_2';

			if ( !arregloConexion.hasOwnProperty( key ) ) {
				throw { 
					title: 'Error !!', 
					message: 'Verificar si el usuario de conexión existe en el servicio de Base de Datos' 
				};
			}

			user = arregloConexion[ key ];

		} catch ( error ) {

			dialog.showErrorBox( error.title, error.message );

			console.log( error );

			return;
		}

		mysqlAPI = mysql.createConnection({
			host: user['host'],
			user: user['username'],
			password: user['password'],
			database: user['database'],
			port: user['port'],
			multipleStatements: true  // permite la ejecucion de multiples query en una sola instruccion SQL
		});

		mysqlAPI.config.queryFormat = Database.sqlParse;

		mysqlAPI.connect(( error ) => {

			if ( error ) {

				dialog.showErrorBox('Conexion Base de Datos', 'Error al conectar, verificar si los parametros de conexión son correctos');

				console.log( error );

				return;
			};

			console.log('Base de datos en linea!!');
		});
	}
}

module.exports = {
	Database
};
