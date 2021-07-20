
require('bootstrap/js/dist/dropdown');  // dropdown boostrap

const { remote } = require('electron');
const { UsersController } = remote.require('./controllers/users_controller');
const { readFileAssets } = remote.require('./util_functions/file');

const { ProfileModalComponent } = require('./profile-modal/profile-modal-component');

const Tooltip = require('bootstrap/js/dist/tooltip');
const Modal = require('bootstrap/js/dist/modal');

class HomeComponent {

	constructor() {
		// inicializa los tooltips
		this.tooltips = Array.from( document.querySelectorAll('[data-bs-toggle="tooltip"]') );
		this.tooltips = this.tooltips.map(( element ) => new Tooltip( element ) );

		this.initCards();
	}

	openUsers() {
		return redirectTo('../users/users.html');
	}

	openOrders() {
		return redirectTo('../orders/orders.html');
	}

	openEstadistics() {
		console.log('abrir estadisticas');
	}

	openProducts() {
		return redirectTo('../products/products.html');
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

	initCards() {

		const values = [ 50, 100, 80, 25 ];

		const elementsDOM = document.querySelectorAll('span');

		for ( let i = 0; i < elementsDOM.length; i++ ) {
			elementsDOM[i].innerText = values[i];
		}

		this.showOptions();
	}
}

const homeComponent = new HomeComponent();
const profileModalComponent = new ProfileModalComponent();
