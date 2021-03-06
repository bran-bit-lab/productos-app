// =========================
// Carga de modulos JS
// =========================

const { remote } = require('electron');
const { UsersController } = remote.require('./controllers/users_controller');
const { ClientesController } = remote.require('./controllers/clientes_controller');
const { readFileAssets } = remote.require('./util_functions/file');
const { sliceString } = remote.require('./util_functions/string');
const Modal = require('bootstrap/js/dist/modal');
const Tab = require('bootstrap/js/dist/tab');

// users
const footer = document.querySelector('#modals');
const info = document.querySelector('#info');

// components html
footer.innerHTML += readFileAssets( '/users/users-modal-form/users-modal-form-component.html' );
footer.innerHTML += readFileAssets( '/shared/modal-confirm/modal-confirm-component.html' );
footer.innerHTML += readFileAssets( '/users/users-modal-role/users-modal-role-component.html' );
footer.innerHTML += readFileAssets( '/users/clients-modal-form/client-modal-form-component.html' );

const UsersTableComponent = require('./users-table/users-table-component');

const ModalUserComponent = require('./users-modal-form/users-modal-form-component');
const ModalConfirmComponent = require('../shared/modal-confirm/modal-confirm-component');
const ModalChangeRole = require('./users-modal-role/users-modal-role-component');

const ClientsTableComponent = require('./clients-table/clients-table-component');

const ModalClientComponent = require('./clients-modal-form/client-modal-form-component');
// ==========================================
// Users component
// ==========================================
class UsersComponent {

	constructor() {
		this.usersContent = document.querySelector('#users');
		this.clientsContent = document.querySelector('#clients');

		this.usersContent.innerHTML = readFileAssets( '/users/users-table/users-table-component.html' );
		this.clientsContent.innerHTML = readFileAssets( '/users/clients-table/clients-table-component.html' );
		this.setHtml = this.setHtml.bind( this );
	}

	setHtml() {

		const tabList = Array.from( document.querySelectorAll('#users-list button') );

		tabList.forEach( this.setOptionsTabs.bind( this ) );

		this.changeView();
	}

	setOptionsTabs( elementTab ) {

		let tabTrigger = new Tab( elementTab );

		elementTab.addEventListener('click', ( $event ) => {

			let nameTab = elementTab.getAttribute('aria-name');

			tabTrigger.show();

			this.changeView( nameTab );

			$event.preventDefault();
		});
	}

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

const usersComponent = new UsersComponent();
const usersTableComponent = new UsersTableComponent();
const clientsTableComponent = new ClientsTableComponent();

const userForm = document.forms['formUsers'];
const changeRoleForm = document.forms['user-change-role-form'];

// ============================
// Binding
// ============================
let closeModalConfirm =  null;

// =============================
// Events
// =============================

userForm.addEventListener('submit', ModalUserComponent.getForm.bind(
	usersComponent
));

changeRoleForm.addEventListener('submit', ModalChangeRole.getForm.bind(
	usersComponent
));

document.addEventListener('DOMContentLoaded', usersComponent.setHtml );

// custom Events search-bar
for ( const element of document.querySelectorAll('search-bar-component') ) {

	element.addEventListener('search', ( $event ) => {
		if ( $event.detail.from === 'clients' ) {
			// code here...

		} else {
			console.log( $event );
			usersTableComponent.getUser.call( usersTableComponent, $event.detail.value )

		}
	});
}
