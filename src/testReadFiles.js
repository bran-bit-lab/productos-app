const fs = require('fs');

var userConnection = null;

try {

	// obtiene la informacion del archivo .ini y la parsea a un JSON (array asociativo)
	userConnection = fs.readFileSync('./users-productos-app.ini', 'utf-8' );
	userConnection = JSON.parse( userConnection );

} catch ( error ) {

	console.log('No se pudo leer el archivo, verifica el path');
	console.log( error.path );
}

console.log( userConnection );
console.log('continua con la ejecucion del codigo');


