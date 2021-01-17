const mysql = require('mysql');

const fs = require('fs');

let user = null;

/*
	Javascript se ejecuta en paralelo de forma sincrona y luego asincrona a diferencia de php 
	que lo hace en modo cascada. Por lo tanto en este caso se usa la funcion fs.readFileSync 
	para no arrojar un callback
*/

try {
	
	let data = fs.readFileSync("./users-productos-app.ini", {encoding: "utf-8"});
 	let arregloConexion = JSON.parse(data);

 	user = arregloConexion["root_brandon"];

} catch ( error ) {
	console.log(error);
}

const conectar = mysql.createConnection({
	host: user["host"],
	user: user["username"],
	password: user["password"],
	database: user["database"]
});

conectar.connect((err) => {
	if (err) {
		throw err;
	}else{
		console.log ("conectado!");
	}
	conectar.end();
});


	


//console.log("sincrono: ", arregloConexion["root_gabriel"]);


 


