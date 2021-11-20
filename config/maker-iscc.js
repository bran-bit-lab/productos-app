const path = require('path');
const { spawn } = require('child_process');
const arch = process.argv.length === 3 ? process.argv[ process.argv.length - 1 ] : process.arch;

let manifestPath = "";
let setupName = "productos_app_setup_" + arch;

if ( arch === "ia32" ) {
	manifestPath = path.join( __dirname, 'manifiesto_productos-app.iss' );
	
} else {
	manifestPath = path.join( __dirname, 'manifiesto_productos-app_x64.iss' );
}

// options command
const options = [ 
		'/O+', 
		'/F ' + setupName, 
		'/V2', 
		manifestPath 
	];
	
//console.log( options )
	
const iscc = spawn('iscc', options );

iscc.stdout.on('data', ( data ) => {
	console.log( data.toString() );
});

iscc.stderr.on('data', ( data ) => {
	console.log( data.toString() );
});

// evento que se ejecuta al final
iscc.on('exit', ( code ) => {
	console.log(`process exit with code ${ code }`);
});
