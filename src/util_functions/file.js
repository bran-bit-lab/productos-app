const fs = require('fs');
const path = require('path');
const { ENV } = require('../env');

/*
	Javascript se ejecuta en paralelo de forma sincrona y luego asincrona a
	diferencia de php que lo hace en modo secuencial. Por lo tanto en este caso
	se usa la funcion fs.readFileSync para no arrojar un callback
*/

function readFile( url ) {
	return fs.readFileSync( path.join( ENV.PATH_INI, url ), { encoding: "utf-8" });
};

function readFileAssets( url ) {
	return fs.readFileSync( path.join( ENV.PATH_VIEWS, url ), { encoding: "utf-8" });
}

function copyFile( url , dest) {
	return fs.copyFileSync (url , dest);
}

function readFileImageAsync( path, callback ) {

	fs.stat( path, ( error, infoFile ) => {

		if ( error ) {
			throw error;
		}

		fs.readFile( path, { encoding: 'base64' }, ( error, data ) => {

			if ( error ) {
				throw error;
			}

			callback({
				path,
				base64: data,
				size: infoFile.size,
				typeFile: path.split('.')[1]
			});

		});
	});
}

function checkAsset( url ) {
  return fs.existsSync( path.join( __dirname, url ) ) ? 'El archivo existe' :
		'El archivo no existe';
}

module.exports = {
	readFile,
	readFileAssets,
	checkAsset,
	readFileImageAsync,
	copyFile
};
