'use strict' 
const os = require('os');
const path = require('path');
const fs = require('fs');
const { spawn, exec } = require('child_process');

// console.log (os.arch(), os.platform());

let archivoFuente = path.join(__dirname , 'manifiesto_productos-app.iss');

//console.log(archivoFuente);

const parametros = Object.freeze({
	arch : os.arch(),
	platform : os.platform(),
	pathFuente : archivoFuente
});
//console.log(parametros);

function ejecutarComando( comando, flags ){

	console.log( comando );
	const child = spawn(comando, flags);

	child.stdout.on('data', (data) => {
		console.log(data.toString());
	});

	child.stderr.on('data', (data) => {
	  console.error(data.toString());
	});

	child.on('exit', (code) => {
		console.log(`Child exited with code ${code}`);
	});
}


try {

	if( parametros.platform.includes('linux') ){
		throw new Error('no se puede compilar para la plataforma linux')
	}

	const archivo = fs.readFileSync(archivoFuente, { encoding: 'utf8' });
	
	// Esto genera el path de la fuente 
	let directorioFuente = path.join( 
		__dirname, 
		'../out', 
		( 'productos-app-' + parametros.platform + '-' + parametros.arch ), 
		'*' 
	);

	let archivoModificado = archivo.replace(/:path/g, directorioFuente );

	fs.writeFileSync( archivoFuente, archivoModificado );

	// console.log( command )
	ejecutarComando('iscc', [ archivoFuente, "/Fproducts-app" ]);

	// console.log('Replaced!');

} catch ( err ) {

	console.error( err );
}

