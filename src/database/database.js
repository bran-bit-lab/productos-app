const mysql = require('mysql');
const file = require('../util_functions/file');

let user = null;

class Database {

	insert( sql, data, callback ) {

		// @params sql: string es una variable de consulta a la BD.
		// @params data: object es el arreglo del formulario
		// @params callback: function se ejecuta cuando la respuesta sea exitosas

		mysqlAPI.query( sql, data, callback );
	}

	getTotalRecords( sql, callback ) {
		mysqlAPI.query( sql, callback );
	}


	consult( sql, paginacion, callback ) {
		
		// @params paginacion: number[] es la paginacion de la tabla

		mysqlAPI.query( sql, paginacion, callback );
	}

	find( sql, data, callback ) {
		mysqlAPI.query( sql, data, callback );
	}

	update( sql, data, callback ) {
		mysqlAPI.query( sql, data, callback );
	}

	delete( sql, data, callback ) {
		mysqlAPI.query( sql, data, callback );
	}

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
}

try {

	let data = file.readFile("/users-productos-app.ini");

 	let arregloConexion = JSON.parse( data );

 	user = arregloConexion["root_brandon"];

} catch ( error ) {

	console.log( error );
}

const mysqlAPI = mysql.createConnection({
	host: user["host"],
	user: user["username"],
	password: user["password"],
	database: user["database"],
	port: user["port"]
});

mysqlAPI.config.queryFormat = Database.sqlParse; 

mysqlAPI.connect(( error ) => {

	if ( error ) {
		throw error
	};

	console.log('Base de datos en linea!!');
});


module.exports = {
	Database
};
