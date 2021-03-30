require('bootstrap/js/dist/dropdown');  // dropdown boostrap

class HomeComponent {
	
	openUsers() {
		return redirectTo('../users/users.html');
	}

	openOrders() {
		console.log('abrir ordenes');
	}

	openEstadistics() {
		console.log('abrir estadisticas');
	}

	openProducts() {
		console.log('abrir productos');
	}

	logOut() {
		
		sessionStorage.removeItem('userLogged');
		
		return redirectTo('../login/login.html');
	}

	showOptions() {

		// se consulta el area que pertenece el usuario 
		// y oculta las opciones dependiendo del caso

		const userLogged = getUserLogged();

		if ( userLogged.area !== 'Administracion' ) {
			hideElement( document.querySelector('#users') );
			hideElement( document.querySelector('#estadistics') );
		}
	}
}

const homeComponent = new HomeComponent();

document.addEventListener('DOMContentLoaded', () => {
	
	const values = [ 50, 100, 80, 25 ];

	const elementsDOM = document.querySelectorAll('span');

	for ( let i = 0; i < elementsDOM.length; i++ ) {
		elementsDOM[i].innerText = values[i];
	}

	homeComponent.showOptions();
});