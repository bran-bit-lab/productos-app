// =========================
// Carga de modulos JS
// =========================

const { remote } = require('electron');
const { UsersController, ClientesController } = remote.require('./controllers');
const { readFileAssets } = remote.require('./util_functions/file');
const { sliceString } = remote.require('./util_functions/string');
const Modal = require('bootstrap/js/dist/modal');
const Tab = require('bootstrap/js/dist/tab');
const Tooltip = require('bootstrap/js/dist/tooltip');

const UsersTableComponent = require('./users-table/users-table-component');

const footer = document.querySelector('#modals');
const info = document.querySelector('#info');

/** componente de la vista de Usuarios */
class UsersComponent {

	constructor() {
		this.setHtml = this.setHtml.bind( this );
		
		this.loading = document.querySelector('app-loading');
		this.usersContent = document.querySelector('#users');
		this.clientsContent = document.querySelector('#clients');

		// this.loading._show = 'true';

		this.setHtml(() => {

			// requerimos e instanciamos los nuevos componentes js una vez cargado el html
			const UsersTableComponent = require('./users-table/users-table-component')
			
			ModalUserComponent = require('./users-modal-form/users-modal-form-component');
			ModalChangeRole = require('./users-modal-role/users-modal-role-component');
			ModalConfirmComponent = require('../shared/modal-confirm/modal-confirm-component');
			ModalChangeRole = require('./users-modal-role/users-modal-role-component');
			
			usersTableComponent = new UsersTableComponent();
			
			const ClientsTableComponent = require('./clients-table/clients-table-component');
			
			ModalClientComponent = require('./clients-modal-form/client-modal-form-component');
			
			clientsTableComponent = new ClientsTableComponent();

			this.setTabs();
		});
	}

	setTabs() {

		// inicializamos los tabs
		const tabList = Array.from( document.querySelectorAll('#users-list button') );

		tabList.forEach( this.setOptionsTabs.bind( this ) );

		this.changeView();
	}


	/** carga el html de los modales y los eventos */
	setHtml( callback ) {

		Promise.all([
			fetch('users/users-modal-form/users-modal-form-component.html').then( resp => resp.text() ),
			fetch('shared/modal-confirm/modal-confirm-component.html').then( resp => resp.text() ),
			fetch('users/users-modal-role/users-modal-role-component.html').then( resp => resp.text() ),
			fetch('users/clients-modal-form/client-modal-form-component.html').then( resp => resp.text() )
		]).then( async htmlArray => {

			footer.innerHTML = htmlArray.join('');

			this.usersContent.innerHTML = await fetch('users/users-table/users-table-component.html').then( resp => resp.text() );
			this.clientsContent.innerHTML = await fetch('users/clients-table/clients-table-component.html').then( resp => resp.text() )

			callback();
		})
		.catch( error => console.error( error ) )
		.finally(() =>  setTimeout( () => this.loading._show = 'false', 1000 ) );
	}


	/**
	 * Setea las opciones de las pestañas
	 * @param  {HTMLElement} elementTab elemento html de botones de las pestañas
	 */
	setOptionsTabs( elementTab ) {

		let tabTrigger = new Tab( elementTab );

		elementTab.addEventListener('click', ( $event ) => {

			let nameTab = elementTab.getAttribute('aria-name');

			tabTrigger.show();

			this.changeView( nameTab );

			$event.preventDefault();
		});
	}


	/**
	 * cambia la vista entre usuarios y clientes
	 * @param  {string} tabName Nombre de la pestaña
	 */
	changeView( tabName = 'users' ) {

		const usersElements = Array.from( document.querySelectorAll('.users') );
		const clientsElements = Array.from( document.querySelectorAll('.clients') );

		switch ( tabName ) {
			case 'clients': {

				usersElements.forEach(( element ) => hideElement( element ));
				clientsElements.forEach(( element ) => showElement( element ));

				clientsTableComponent.getAll( null, getPaginationStorage('clientsTable') );

				break;
			}

			default: {

				usersElements.forEach(( element ) => showElement( element ));
				clientsElements.forEach(( element ) => hideElement( element ));

				usersTableComponent.getAll( null, getPaginationStorage('usersTable') );

				break;
			}
		}
	}
}

/** @type {UsersComponent} */
const usersComponent = new UsersComponent();

/** @type {UsersTableComponent} */
let usersTableComponent;

let ModalUserComponent;
let ModalChangeRole;
let ModalConfirmComponent;

/** @type {ClientsTableComponent} */
let clientsTableComponent;
let ModalClientComponent;

// ============================
// Binding
// ============================
/* es usado en la tabla de usuarios para actualizar el valor this ( no borrar ) */
let closeModalConfirm;