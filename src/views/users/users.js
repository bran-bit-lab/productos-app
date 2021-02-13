const { remote } = require('electron');
const Modal = require('bootstrap/js/dist/modal');

// remote
const { UsersController } = remote.require('./controllers/users_controller');
const { readFileAssets } = remote.require('./util_functions/file');

// selectors
const info = document.querySelector('#info');
const footer = document.querySelector('#modals');

// components html
footer.innerHTML += readFileAssets( '/users/users-modal-form/users-modal-form-component.html' );
footer.innerHTML += readFileAssets( '/shared/modal-confirm/modal-confirm-component.html' );
footer.innerHTML += readFileAssets( '/users/users-modal-role/users-modal-role-component.html' );

// modules
const modalUserComponent = require('./users-modal-form/users-modal-form-component');
const modalConfirmComponent = require('../shared/modal-confirm/modal-confirm-component');
const modalChangeRole = require('./users-modal-role/users-modal-role-component');

// ==========================================
// Users component
// ==========================================
class UsersComponent {

	constructor() {
		this.tbody = document.querySelector('#tbody-user');
		this.totalUsers = document.querySelector('#totalUsers');
		this.pagination = document.querySelector('#pagination');
		this.render = this.render.bind( this );
		this.editUser = this.editUser.bind( this );
		this.deleteUser = this.deleteUser.bind( this );
		this.newUser = this.newUser.bind( this );
		this.changeRole = this.changeRole.bind( this );
	}

	selectUsers() {
	}

	selectUser( id ) {
	}

	editUser( id, form ) {
		console.log( id, form );
	}

	deleteUser({ id, confirm }) {
		console.log( id, confirm );
	}

	newUser( form ) {
		UsersController.crearUsuario( form );
	}

	changeRole({ id, role }) {
		console.log( id, role );
	}

	openModalConfirm( idUser = null ) {

		let found = USERS.find(( user ) => user.id === idUser );
		let title = `${ found.activo ? 'Remover' : 'Otorgar' } acceso al usuario ${ idUser }`;

		let element = (`
			<p class="text-center">
				¿¿Esta seguro de ${ found.activo ? 'remover' : 'otorgar' } acceso al usuario a
				${ found.nombre + ' ' + found.apellido }??
			</p>`
		);

		return modalConfirmComponent.openModalConfirm( title, element, idUser );
	}

	getRowTable( user ) {
		return (`
			<tr class="text-center">
				<td>${ user.id }</td>
				<td>${ user.nombre }</td>
				<td>${ user.apellido }</td>
				<td>${ user.correo }</td>
				<td>${ user.area }</td>
				<td>${ user.activo ?
						('<i class="fas fa-check text-success"></i>') :
						('<i class="fas fa-times text-danger"></i>')
					}
				</td>
				<td>
					<button
						type="button"
						onclick="modalChangeRole.openModalRole( ${ user.id } )"
						class="btn btn-primary btn-sm"
					>
						<i class="fas fa-user"></i>
					</button>
					<button
						type="button"
						onclick="usersComponent.openModalConfirm( ${ user.id } )"
						class="btn btn-danger btn-sm"
						data-bs-target=".modal-users"
						data-bs-whatever="delete"
					>
						<i class="fas fa-trash"></i>
					</button>
				</td>
			</tr>
		`);
	}

	render() {

		this.tbody.innerHTML = '';
		this.totalUsers.innerText = USERS.length;

		if ( USERS.length > 0 ) {

			this.pagination.style.display = 'block';
			USERS.forEach(( user ) => this.tbody.innerHTML += this.getRowTable( user ));

		} else {

			this.pagination.style.display = 'none';

			this.tbody.innerHTML += (`
				<tr class="text-center">
					<td colspan="7" class="text-danger">
						No existen registros de usuarios disponibles
					</td>
				</tr>
			`);
		}
	}
}

const usersComponent = new UsersComponent();
const userForm = document.forms['formUsers'];
const changeRoleForm = document.forms['user-change-role-form'];

// esta variable es usada en el html para confirmar la eliminacion
const closeModalConfirm =  modalConfirmComponent.closeModalConfirm.bind( usersComponent.deleteUser );

// listeners de eventos
userForm.addEventListener(
	'submit',
	modalUserComponent.getForm.bind( usersComponent )
);

changeRoleForm.addEventListener(
	'submit',
	modalChangeRole.getForm.bind( usersComponent )
);

document.addEventListener('DOMContentLoaded', usersComponent.render );
