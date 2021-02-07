require('bootstrap/js/dist/dropdown');  // dropdown boostrap

class HomeComponent {
	
	static openUsers() {
		console.log('abrir usuarios');
	}

	static openOrders() {
		console.log('abrir ordenes');
	}

	static openEstadistics() {
		console.log('abrir estadisticas');
	}

	static openProducts() {
		console.log('abrir productos');
	}
}

document.addEventListener('DOMContentLoaded', () => {
	
	const values = [ 50, 100, 80, 25 ];

	const elementsDOM = document.querySelectorAll('span');

	for ( let i = 0; i < elementsDOM.length; i++ ) {
		elementsDOM[i].innerText = values[i];
	}
});