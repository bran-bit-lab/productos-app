const mysql = require('mysql');
const file = require('../util_functions/file');

let user = null;

class Database {

	conectar( callback ) {

		try{
			conectar.connect();
			console.log("respueta existosa");
			callback();

		} catch ( error ) {
			console.log(error)
		}
	}

	insertar( sql, data, callback ) {
		// @params sql: string es una variable generada para hacer la consulta
		// @params data: object || array es el arreglo del formulario
		
		this.conectar(() => {

			// insertar 
			let datos = Object.values(data);
			conectar.query(sql, datos, callback );
		});
	}

	actualizar( data, id ) {

	}

	eliminar( data, id ){
		console.log("error en la consulta");
	}

	prueba( err, data ) {

		if ( err ) {
			console.log( err );
		}

		console.log('conexion exitosa');
	}

}

/*
	Javascript se ejecuta en paralelo de forma sincrona y luego asincrona a
	diferencia de php que lo hace en modo seceuncial. Por lo tanto en este caso
	se usa la funcion fs.readFileSync para no arrojar un callback
*/

try {

	let data = file.readFile("/users-productos-app.ini");

 	let arregloConexion = JSON.parse(data);

 	user = arregloConexion["root_brandon"];

 	console.log( user );

} catch ( error ) {
	console.log( error );

}

const conectar = mysql.createConnection({
	host: user["host"],
	user: user["username"],
	password: user["password"],
	database: user["database"]
});

module.exports = {
	Database
};
