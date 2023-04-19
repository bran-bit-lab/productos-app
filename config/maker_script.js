/* Maker Script Author: bran-bit-lab && gabmart1995 */
'use strict' 

const os = require('os');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const parametros = Object.freeze({
	arch: process.argv.length === 3 ? process.argv[2] : os.arch(),
	platform: os.platform(),
	pathFuente: path.join( __dirname , 'manifiesto_on_note.iss')
});

/**
 * Ejecuta el comando
 * @param {string} comando comando CMD
 * @param {Array<string>} flags parametros del comando
 */
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

	const nombre = ('on-note-' + parametros.platform + '-' + parametros.arch); 
	const directorioFuente = path.join(__dirname, '..', 'out', nombre, '*' );
	
	// borra las carpetas config, docs, bd_productosapp_dev.sql, jsdoc.json  solo se despliuegan en desarrollo
	fs.rmdirSync(path.join(directorioFuente, '..', 'resources', 'app', 'config'), { recursive: true });
	fs.rmdirSync(path.join(directorioFuente, '..', 'resources', 'app', 'docs'), { recursive: true });
	fs.unlinkSync(path.join(directorioFuente, '..', 'resources', 'app', 'bd_productosapp_dev.sql'));
	fs.unlinkSync(path.join(directorioFuente, '..', 'resources', 'app', 'jsdoc.json'));

	// lee el archivo modelo y cambia los datos
	const contenido = fs.readFileSync( path.join( __dirname, 'manifiesto_model_on_note.iss' ), { encoding: 'utf8' });	
	
	// elementos a reemplazar en el archivo
	const replaces = {
		wizardPath: path.join(__dirname, 'icons', 'on-note410x798.bmp'),
		iconDesktop: path.join(
			'{app}', 'resources', 'app', 'src', 'icons', 'on-note65x65.ico'),
		path: directorioFuente 
	};

	// reemplazamos los valores
	const contenidoModificado = contenido.replace(/\:(\w+)/g, (texto, resultado) => {

		// console.log({ text, result });

		if ( replaces.hasOwnProperty(resultado) ) {
			return replaces[resultado];
		}

		return texto;
	});

	fs.writeFileSync( parametros.pathFuente, contenidoModificado );
	
	ejecutarComando('iscc', [ parametros.pathFuente, ('/F' + nombre) ]);

} catch ( err ) {
	
	console.error( err );
}

