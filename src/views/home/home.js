
require('bootstrap/js/dist/dropdown');  // dropdown boostrap

const { remote } = require('electron');
const { UsersController } = remote.require('./controllers/users_controller');
const { ClientesController } = remote.require('./controllers/clientes_controller');
const { ProductosController } = remote.require('./controllers/productos_controllers');
const { NotasController } = remote.require('./controllers/notas_controller');
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

	reduceValues( accum, totals, index ) {

		// se agrupan los valores usuarios y clientes y se suman
		if ( index < 2 ) {

			if ( index === 0 ) {  // usuarios
				return accum.concat([ totals.totalRegistros ]);

			} else { // clientes
				accum[0] += totals.totalRegistros;

				return accum;
			}
		}

		return accum.concat([ totals.totalRegistros ]);
	}

	initCards() {

		Promise.all([

			// total usuarios
			UsersController.obtenerTotalUsuarios(),
			ClientesController.obtenerTotalClientes(),

			// total estadisticas
			ClientesController.obtenerTotalClientes(),

			// total notas
			NotasController.obtenerTotalNotas(),

			// total productos
			ProductosController.obtenerTotalProductos()
		])
			.then( response => {

				console.log( response );

				let values = response.reduce( this.reduceValues, [] );
				console.log( values );

				const elementsDOM = document.querySelectorAll('span');

				for ( let i = 0; i < elementsDOM.length; i++ ) {
					elementsDOM[i].innerText = values[i];
				}

				this.showOptions();
			})
			.catch( error => {
				console.error( error );
			});
	}
}

const homeComponent = new HomeComponent();
const profileModalComponent = new ProfileModalComponent();
