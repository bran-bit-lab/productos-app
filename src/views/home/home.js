const { remote } = require('electron');
const { 
	UsersController, 
	ClientesController, 
	ProductosController, 
	NotasController, 
	CategoriasController 
} = remote.require('./controllers');

const { ProfileModalComponent } = require('./profile-modal/profile-modal-component');
const Tooltip = require('bootstrap/js/dist/tooltip');

/** clase home */
class HomeComponent {

	constructor() {
		// inicializa los tooltips
		this.tooltips = Array.from( document.querySelectorAll('[data-bs-toggle="tooltip"]') );
		this.tooltips = this.tooltips.map(( element ) => new Tooltip( element ) );
		this.loadingComponent = document.querySelector('loading-component');

		this.initCards();
	}

	/** redirecciona a usuarios */
	openUsers() {
		return redirectTo('../users/users.html');
	}

	/** redirecciona a ordenes de entrega */
	openOrders() {
		return redirectTo('../orders/orders.html');
	}

	/** redirecciona a estadisticas */
	openEstadistics() {
		return redirectTo('../reports/reports.html');
	}

	/** redirecciona a productos */
	openProducts() {
		return redirectTo('../products/products.html');
	}

	/** cierra la sesion */
	logOut() {

		if ( sessionStorage.getItem('usersTable') ) {
			sessionStorage.removeItem('usersTable');
		}
		
		if ( sessionStorage.getItem('clientsTable') ) {
			sessionStorage.removeItem('clientsTable');
		}
		
		if ( sessionStorage.getItem('productsTable') ) {
			sessionStorage.removeItem('productsTable');
		}
		
		if ( sessionStorage.getItem('categoriesTable') ) {
			sessionStorage.removeItem('categoriesTable');
		}
		
		if ( sessionStorage.getItem('notesTable') ) {
			sessionStorage.removeItem('notesTable');
		}
		
		if ( sessionStorage.getItem('productsModalTable') ) {
			sessionStorage.removeItem('productsModalTable');
		}
		
		if ( sessionStorage.getItem('clientsModalTable') ) {
			sessionStorage.removeItem('clientsModalTable');
		}
		
		sessionStorage.removeItem('userLogged');
		
		return redirectTo('../login/login.html');
	}

	/** muestra las opciones segun el perfil del usuario logueado */
	showOptions() {

		// se consulta el area que pertenece el usuario
		// y oculta las opciones dependiendo del caso

		const userLogged = getUserLogged();

		if ( userLogged.area !== 'Administracion' ) {
			hideElement( document.querySelector('#users') );
			hideElement( document.querySelector('#estadistics') );
		}

		if ( userLogged.area === 'Almacen' ) {
			hideElement( document.querySelector('#orders') );
		}

		// this.loadingComponent._show = 'false';
	}


	/**
	 * reducer de los valores totales para obtener el valor total por seccion
	 *
	 * @param  {number} accum valor acumulado
	 * @param  {number} total total
	 * @return {number}
	 */
	reduceValues( accum, total ) {
		return accum += total.totalRegistros;
	}

	/** inicializa las tarjetas principales con los valores totales de cada seccion */
	async initCards() {

		try {
			
			const response = await Promise.all([
				// total usuarios y clientes
				Promise.all([
					UsersController.obtenerTotalUsuarios(),
					ClientesController.obtenerTotalClientes(),
				]),

				// se envia un string vacio
				{ totalRegistros: '' },

				// total notas
				NotasController.obtenerTotalNotas(),

				// total productos y categorias
				Promise.all([
					ProductosController.obtenerTotalProductos(),
					CategoriasController.obtenerTotalCategorias()
				])
			]);

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


		} catch (error) {
			console.error( error );
		}
	}
}

/** @type {HomeComponent} */
const homeComponent = new HomeComponent();

/** @type {ProfileModalComponent} */
const profileModalComponent = new ProfileModalComponent();
