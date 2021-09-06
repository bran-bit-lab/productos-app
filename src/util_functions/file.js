const fs = require('fs');
const path = require('path');
const { ENV } = require('../env');
const os = require('os');

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

function copyFile( url , dest ) {
	dest = path.join( ENV.PATH_PICTURES, dest );

	// console.log( dest );
	fs.copyFileSync( url , dest );

	return dest;
}

function writeFile( path, data, callback ) {
	fs.writeFile( path, data, callback );
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

function checkAsset( url, concat = true ) {

	// return bool

	if ( concat ) {
			return fs.existsSync( path.join( __dirname, url ) );
	}

	return fs.existsSync( url );
}

function formatUrl( root = __dirname, url ) {
	return path.join( root, url );
}

function deleteFileSync( url ) {

	try {
		fs.unlinkSync( url );

	} catch( error ) {
		console.log(error)
	}

}

function getHomePath( fileName = '' ) {

	/*
	*	@params fileName: string
	*	return string
	*/

	if ( fileName.length > 0 ) {
			return path.join( os.homedir(), '/' + fileName );
	}

	return path.join( os.homedir() );
}


// aqui vas a crear esa function porque aqui esta importado el modulo fs

module.exports = {
	readFile,
	readFileAssets,
	checkAsset,
	readFileImageAsync,
	copyFile,
	deleteFileSync,
	formatUrl,
	writeFile,
	getHomePath
};
