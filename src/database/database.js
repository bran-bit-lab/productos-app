const mysql = require('mysql');
const file = require('../util_functions/file');

let user = null; 

class Database {

	insertar( sql, data, callback ) {
		
		// @params sql: string es una variable de consulta a la BD.
		// @params data: object es el arreglo del formulario
		// @params callback: function se ejecuta cuando la respuesta sea exitosa
		
		const datos = Object.values( data );
		
		conectar.connect();

		conectar.query( sql, datos, ( error ) => {

			if ( error ) {
				throw error;
			}

			// Exito. se cierra la conexion con la BD.
			conectar.end(); 
			
			callback();
		});
	}

	actualizar( data, id ) {

	}

	eliminar( data, id ){
		console.log("error en la consulta");
	}
}

try {

	let data = file.readFile("/users-productos-app.ini");

 	let arregloConexion = JSON.parse(data);

 	user = arregloConexion["user_gabriel_ventas"];

 	// console.log( user );

} catch ( error ) {
	
	console.log( error );
}

const conectar = mysql.createConnection({
	host: user["host"],
	user: user["username"],
	password: user["password"],
	database: user["database"],
	port: user["port"]
});


module.exports = {
	Database
};
