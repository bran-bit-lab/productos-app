/**
* Libreria de procesamiento de archivos
* @module file
*/

const fs = require('fs');
const path = require('path');
const { ENV } = require('../env');
const os = require('os');

/**
* 	Permite leer un archivo
* 	@param {string} url ruta para leer el archivo
*	@param {boolean} isPathComplete flag que indica que la ruta es completa
* 	@param {boolean} isBuffer flag que indica si la respuesta viene en datos buffer
*	@returns {string|Buffer} retorna el contenido del archivo
*/
function readFile( url, isPathComplete = false, isBuffer = false ) {
	
	if ( isPathComplete && isBuffer ) {
		return fs.readFileSync( url );
	}

	if ( isPathComplete ) {
		return fs.readFileSync( url, { encoding: "utf-8" });
	}

	if ( !isPathComplete && isBuffer ) {
		return fs.readFileSync( path.join( ENV.PATH_INI, url ));
	}
	
	return fs.readFileSync( path.join( ENV.PATH_INI, url ), { encoding: "utf-8" });
};

/**
* Permite leer un archivo dentro de las vistas del renderizado
* @param {string} url ruta para leer el archivo
*	@returns {string} retorna el contenido de los archivos del direcotrio view
*/
function readFileAssets( url ) {
	return fs.readFileSync( path.join( ENV.PATH_VIEWS, url ), { encoding: "utf-8" });
}

/**
* Permite copiar un archivo a un desitino especificado
* @param {string} url ruta del archivo a copiar
*	@param {string} dest ruta donde se va almacenar el nuevo archivo
* @returns {string} retorna la url del archivo copiado
*/
function copyFile( url , dest ) {

	dest = path.join( ENV.PATH_PICTURES, dest );

	// console.log( dest );
	fs.copyFileSync( url , dest );

	return dest;
}

/**
*	@callback callbackCreate
* @param {string|Error} [error] error durante la copia del archivo
*/
/**
* Permite crear un archivo nuevo a un desitino especificado
* @param {string} path la ruta donde se almacena el archivo
* @param {string|Uint8Array} data ruta donde se va almacenar el archivo
* @param {callbackCreate} callback devolucion de llamada cuando crea el archivo
* @example
*	writeFile('./path.txt', 'text', ( error ) => {
*
*   if ( error ) {
*     throw error
*   };
*
*   // rest of code ...
* });
*/
function writeFile( path, data, callback ) {
	fs.writeFile( path, data, callback );
}

/**
* Permite modificar un archivo existente a un desitino especificado si existe modifica el contenido
* @param {string} path la ruta donde se almacena el archivo
* @param {string|Uint8Array} data ruta donde se va almacenar el archivo
* @param {callbackCreate} callback devolucion de llamada cuando crea el archivo
* 
*
* @example
*	appendFile('./path.txt', 'text', ( error ) => {
*
*   if ( error ) {
*     throw error
*   };
*
*   // rest of code ...
* });
*/
function appendFile( path, data, callback ) {
	fs.appendFile( path, data, callback );
}

/**
*	@callback callbackReadImage
* @param {Object} data datos de respuesta de la lectura del archivo
* @param {string} data.path ruta del archivo
* @param {string} data.base64 resultado del archivo procesado base64
* @param {number} data.size tamano del archivo
* @param {string} data.typeFile extension del archivo
*/

/**
* Funcion que permite leer imagenes de forma asincrona
*	@param {string} path ruta para leer el archivo
*	@param {callbackReadImage} callback respuesta del procesamiento del archivo en base64
*/
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

/**
* Permite verificar si el archivo existe
* @param {string} url path del archivo
* @param {boolean} concat flag si debe concatenar el path al directorio global
* @returns {boolean} devuelve un flag con el valor encontrado
*
* @example
* let fileExists = checkAsset( './test.txt', false )  // path relativo
* let fileExists = checkAsset( 'test.txt' )  // path global
*/
function checkAsset( url, concat = true ) {

	// return bool

	if ( concat ) {
		return fs.existsSync( path.join( __dirname, url ) );
	}

	return fs.existsSync( url );
}



/**
* @param {string} root path relativa del proyecto
* @param {string} url path del archivo
* @returns {string} retorna el url concatenado
*/
function formatUrl( root = __dirname, url ) {
	return path.join( root, url );
}

/**
* permite borrar un archivo
* @param {string} url path al archivo a eliminar
*/
function deleteFileSync( url ) {

	try {
		fs.unlinkSync( url );

	} catch( error ) {
		console.log( error );
	}

}

/**
*	@param {string} [fileName] nombre del directorio donde el open winodw inicia la busqueda
*	@returns {string} retorna el path del home dependiendo del Sistema operativo
*
* @example
* // se ubica en el directorio home del S.O
* let homeDirectory = getHomePath();
*
* // su ubica en el directorio home y adicionalmente le agrega nombre al archivo
* let homeDirectory = getHomePath('test.pdf');
*/
function getHomePath( fileName = '' ) {

	if ( fileName.length > 0  ) {
			return path.join( os.homedir(), '/' + fileName );
	}

	return path.join( os.homedir() );
}

/**
 * Lee los archivos en forma de promesa
 * @param {string} url path del archivo
 * @param {boolean} isPathComplete flag que indica que la ruta es completa
 * @param {boolean} isBuffer flag que indica si la respuesta viene en datos buffer
 * @returns {Promise<string | Buffer>}
 */
function readFilePromise( url, isPathComplete = false, isBuffer = false ) {

	const manejador = function( resolve, reject ) {
		
		try {

			let data = readFile( url, isPathComplete, isBuffer );

			// console.log( data );

			resolve( data );
		
		} catch( error ) {

			reject( error );
		}
	};
	
	const promesa = new Promise( manejador );
   	
	return promesa;
}

module.exports = {
	readFile,
	readFileAssets,
	checkAsset,
	readFileImageAsync,
	copyFile,
	deleteFileSync,
	formatUrl,
	writeFile,
	getHomePath,
	appendFile,
	readFilePromise
};
