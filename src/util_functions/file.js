const fs = require('fs');
const path = require('path');

function readFile( url ) {
	return fs.readFileSync( path.join( __dirname, url ), { encoding: "utf-8" });
};

function checkAsset( url ) {
  return fs.existsSync( path.join( __dirname, url ) ) ? 'El archivo existe' :
		'El archivo no existe';
}

module.exports= {
	readFile,
	checkAsset
};
