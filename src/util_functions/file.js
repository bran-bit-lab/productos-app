const fs = require('fs');
const path = require('path');

function readFile( url ){

	let data = fs.readFileSync( path.join(__dirname, url) , {encoding: "utf-8"});
	return data;
};

function checkAsset( url ) {
  return fs.existsSync( path.join( __dirname, url ) ) ? 'El archivo existe' : 'El archivo no existe';
}


module.exports= {
	readFile, 
	checkAsset
};