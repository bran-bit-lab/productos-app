/* Maker Script Author: bran-bit-lab && gabmart1995 */
'use strict' 

const os = require('os');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const parametros = Object.freeze({
	arch: process.argv.length === 3 ? process.argv[2] : os.arch(),
	platform: os.platform(),
	pathFuente: path.join( __dirname , 'manifiesto_productos-app.iss')
});


function ejecutarComando( comando, flags ) {

	const child = spawn( comando, flags );

	child.stdout.on('data', ( data ) => {
		console.log( data.toString() );
	});

	child.stderr.on('data', ( data ) => {
	  console.error( data.toString() );
	});

	child.on('exit', ( code ) => {
		console.log(`Child exited with code ${code}`);
	});
}

try {

	if ( parametros.platform.includes('linux') ) {
		throw new Error('no se puede compilar la aplicacion para la plataforma linux')
	}

	// Esto genera el path de la fuente 
	const directorioFuente = path.join( 
		__dirname, 
		'../out', 
		( 'productos-app-' + parametros.platform + '-' + parametros.arch ), 
		'*' 
	);

	// lee el archivo modelo y cambia los datos
	const archivo = fs.readFileSync( 
		path.join( __dirname, 'manifiesto_model_productos-app.iss' ), 
		{ encoding: 'utf8' }
	);	
	const archivoModificado = archivo.replace( /:path/g, directorioFuente );

	fs.writeFileSync( parametros.pathFuente, archivoModificado );

	ejecutarComando('iscc', [ 
		parametros.pathFuente,
		( '/Fproducts-app-' + parametros.platform + '-' + parametros.arch ) 
	]);

} catch ( err ) {
	console.error( err );
}

