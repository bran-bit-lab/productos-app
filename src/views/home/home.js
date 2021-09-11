
require('bootstrap/js/dist/dropdown');  // dropdown boostrap

const { remote } = require('electron');
const { UsersController } = remote.require('./controllers/users_controller');
const { ClientesController } = remote.require('./controllers/clientes_controller');
const { ProductosController } = remote.require('./controllers/productos_controllers');
const { NotasController } = remote.require('./controllers/notas_controller');
const { CategoriasController } = remote.require('./controllers/categorias_controller');
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
		return redirectTo('../reports/reports.html');
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

	reduceValues( accum, total ) {
		return accum += total.totalRegistros;
	}

	initCards() {

		Promise.all([
			// total usuarios y clientes
			Promise.all([
				UsersController.obtenerTotalUsuarios(),
				ClientesController.obtenerTotalClientes(),
			]),

			// total estadisticas
			ClientesController.obtenerTotalClientes(),

			// total notas
			NotasController.obtenerTotalNotas(),

			// total productos y categorias
			Promise.all([
				ProductosController.obtenerTotalProductos(),
				CategoriasController.obtenerTotalCategorias()
			])
		])
			.then( response => {

				// console.log( response );

				const elementsDOM = document.querySelectorAll('span');
				let values = response.map(( value ) => {

					if ( Array.isArray( value ) ) {
						return value.reduce( this.reduceValues, 0 );
					}

					return value.totalRegistros;
				});

				// console.log( values );

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
