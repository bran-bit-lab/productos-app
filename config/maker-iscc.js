const path = require('path');
const { spawn } = require('child_process');

// directions
// const userDesktop = path.join( os.homedir(), '/Desktop' ); 
const manifestPath = path.join( __dirname, 'manifiesto_productos-app.iss' );

// options command
const options = [ 
		'/O+', 
		'/F products_app_setup', 
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
