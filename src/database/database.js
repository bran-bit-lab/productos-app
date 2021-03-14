const mysql = require('mysql');
const file = require('../util_functions/file');

let user = null;

class Database {

	insert( sql, data, callback ) {

		// @params sql: string es una variable de consulta a la BD.
		// @params data: object es el arreglo del formulario
		// @params callback: function se ejecuta cuando la respuesta sea exitosa

		mysqlAPI.query( sql, data, callback );
	}

	getTotalRecords( sql, callback ) {
		mysqlAPI.query( sql, callback );
	}


	consult( sql, paginacion, callback ) {
		
		// @params paginacion: number[] es la paginacion de la tabla
		
		mysqlAPI.query( sql, paginacion, callback );

		// let sentence = mysqlAPI.query( sql, paginacion, callback );
		// console.log( sentence.sql );

	}

	find( sql, data, callback ) {

		let datos = Object.values( data );

		mysqlAPI.query( sql, data, callback );
	}

	update( sql, data, callback ) {

		mysqlAPI.query( sql, data, callback );
	}

	delete( sql, data, callback ) {

		mysqlAPI.query( sql, data, callback );
	}
}

try {

	let data = file.readFile("/users-productos-app.ini");

 	let arregloConexion = JSON.parse( data );

 	user = arregloConexion["user_gabriel_ventas"];

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

	// aqui se transforma el strin
function transform ( texto, resultado ){

	// el devuelve el sql transformado
	// recibe 2 parametros
	// 1.- texto, que es la cadena a transoformar
	// 2.- es el resultado de la busqueda
	// segun la docuntacion de replace debe devolver
	// un string
	const values = this 

	if ( values.hasOwnProperty( resultado ) ){
		
		return values[resultado];  // aqui devuelve la propiedad de los objetos

	} else {
		
		return texto;   // aqui devuelve :start o la clave si no lo consigue
	}
};

function test ( query, values ) {

	if (values === undefined) {
   		
   		return query;

	} else {

		const sqlParse = query.replace ( /\:(\w+)/g , transform.bind( values ));
		return sqlParse;
	
	}

};

mysqlAPI.config.queryFormat = test; 

mysqlAPI.connect(( error ) => {

	if ( error ) {
		throw error
	};

	console.log('Base de datos en linea!!');
});

//console.log( mysqlAPI );


module.exports = {
	Database
};
