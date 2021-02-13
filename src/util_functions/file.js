const fs = require('fs');
const path = require('path');
const { ENV } = require('../env');

function readFile( url ) {
	return fs.readFileSync( path.join( ENV.PATH_INI, url ), { encoding: "utf-8" });
};

function readFileAssets( url ) {
	return fs.readFileSync( path.join( ENV.PATH_VIEWS, url ), { encoding: "utf-8" });
}

function checkAsset( url ) {
  return fs.existsSync( path.join( __dirname, url ) ) ? 'El archivo existe' :
		'El archivo no existe';
}

module.exports = {
	readFile,
	readFileAssets,
	checkAsset
};
