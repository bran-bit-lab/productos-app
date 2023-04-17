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
		console.log(`Process executed with code ${ code }`);
	});
}


try {

	if ( !(/^(arm64|ia32|x64)$/).test( parametros.arch ) ) {
		throw new Error('arquitectura no soportada: ' + parametros.arch );
	}

	if ( !(/^win32$/).test( parametros.platform ) ) {
		throw new Error('no se puede compilar la plataforma seleccionada: ' + parametros.platform );
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

	let archivoModificado = archivo.replace( /:path/g, directorioFuente );
	archivoModificado = archivoModificado.replace(
		/:messagesFile/g, 
		path.join( __dirname, 'Languages', 'Spanish.isl')
	);

	fs.writeFileSync( parametros.pathFuente, archivoModificado );

	ejecutarComando('iscc', [ 
		parametros.pathFuente,
		( '/Fproducts-app-' + parametros.platform + '-' + parametros.arch ) 
	]);

} catch ( err ) {
	
	console.error( err );
}

