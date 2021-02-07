const mysql = require('mysql');
const file = require('../util_functions/file'); 

let user = null; 

class Database {

	conectar( callback ) {

		try {
			conectar.connect( this.prueba );
			
			console.log("conexion a BD exitosa");
		    
		} catch ( error ) {
		    console.log(error);
		}
	}

	insertar( data ){
					
			
	}

	actualizar( data, id ){
			
		
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
	Javascript se ejecuta en paralelo de forma sincrona y luego asincrona a diferencia de php 
	que lo hace en modo cascada. Por lo tanto en este caso se usa la funcion fs.readFileSync 
	para no arrojar un callback
*/






try {
	
	let data = file.readFile("../users-productos-app.ini");
	
 	let arregloConexion = JSON.parse(data);
 	
 	user = arregloConexion["root_brandon"];

 	console.log(user);

} catch ( error ) {
	console.log( error );
}

const conectar = mysql.createConnection({
	host: user["host"],
	user: user["username"],
	password: user["password"],
	database: user["database"]
});

//console.log(conectar);



module.exports= {
	Database
};

//console.log("sincrono: ", arregloConexion["root_gabriel"]);


 


