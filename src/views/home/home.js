function openUsers() {
	console.log('abrir usuarios');
}

function openOrders() {
	console.log('abrir ordenes');
}

function openEstadistics() {
	console.log('abrir estadisticas');
}

function openProducts() {
	console.log('abrir productos');
}

document.addEventListener('DOMContentLoaded', () => {
	
	const values = [ 50, 100, 80, 25 ];

	const elementsDOM = document.querySelectorAll('span');

	for ( let i = 0; i < elementsDOM.length; i++ ) {
		elementsDOM[i].innerText = values[i];
	}
});