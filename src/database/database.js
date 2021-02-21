const mysql = require('mysql');
const file = require('../util_functions/file');

let user = null; 

class Database {

	insert( sql, data, callback ) {
		
		// @params sql: string es una variable de consulta a la BD.
		// @params data: object es el arreglo del formulario
		// @params callback: function se ejecuta cuando la respuesta sea exitosa
		
		let datos = Object.values( data );
		
		mysqlAPI.query( sql, datos, callback );
	}

	consult( sql, paginacion = [0,10] ) {

		return new Promise( function( resolve, reject ) { 
			
		mysqlAPI.query( sql, paginacion, ( error, data ) => {
	          
	          if ( error ) {
	          	
	          	return reject(error);
	          
	          }
	         
	          resolve( data );          

			});
		});
	}

	update( sql, data, callback ) {

		let datos = Object.values( data );

		mysqlAPI.query( sql, datos, callback );

	}

	delete( data, id ){
		
		let datos = Object.values( data );

		mysqlAPI.query( sql, datos, callback );
		
	}
}

try {

	let data = file.readFile("/users-productos-app.ini");

 	let arregloConexion = JSON.parse( data );

 	user = arregloConexion["user_gabriel_ventas"];

 	// console.log( user );

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

mysqlAPI.connect(( error ) => {
	
	if ( error ) { 
		throw error
	};

	console.log('Base de datos en linea!!');
});


module.exports = {
	Database
};
