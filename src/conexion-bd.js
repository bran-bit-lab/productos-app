const mysql = require('mysql');

const fs = require('fs');

let arregloConexion = null;

fs.readFile("./users-productos-app.ini", {encoding: "utf-8"}, (err, data) => {
 if (err) {
 	throw err;
 }
 else {
 	arregloConexion = JSON.parse(data);
 	console.log(arregloConexion);
  }
}) 
