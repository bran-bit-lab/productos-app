/*
	Primera parte la funcion
*/
let error = false; //aqui

function readFile() {
	//1 debes retornar una instancia de la promesa
	//2  pasas por parametro una funcion
	const promesa = new Promise( manejador );

	return promesa;
}

// en la  doc lo  maneja con funciones flecha esto tambien sirve 
function manejador( resolve, reject ) {
	// aqui colocas el cuerpo de tu funcion readfile

	if ( error === true ) {
		// rechazas la promesa asi
		reject('promesa rechazada');
		return;
	}

	// voy a imprimir un mensaje y cumplir la promesa
	console.log('promesa ejecutada');
	resolve('promesa cumplida');
}


//  asi se consume
readFile()
	.then( mensaje => {
		console.log(mensaje);
	})
	.catch( error => {
		console.log( error );
	})