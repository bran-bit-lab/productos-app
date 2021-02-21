const { remote } = require('electron');

// remote
const { UsersController } = remote.require('./controllers/users_controller');
const { readFileAssets } = remote.require('./util_functions/file');

const Modal = require('bootstrap/js/dist/modal');

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
		this.deleteUser = this.deleteUser.bind( this );
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

		if ( !confirm ) {
			return;
		}

		// filtrado local retirar cuando se encuentre el SQL
		USERS = USERS.map(( user ) => {
			if ( user.id === id ) {
				return { ...user, activo: !user.activo };
			}

			return user;
		});

		return this.render();
	}

	newUser( form ) {
		UsersController.crearUsuario( form );
	}

	changeRole({ id, role }) {
		UsersController.cambiarRolUsuarios({ area: role, userid: id });
	}

	openModalConfirm( idUser = null ) {

		let found = USERS.find(( user ) => user.id === idUser );
		let title = `${ found.activo ? 'Remover' : 'Otorgar' } acceso al usuario ${ idUser }`;

		// description
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
				<td>${ user.userid }</td>
				<td>${ user.nombre }</td>
				<td>${ user.apellido }</td>
				<td>${ user.correo }</td>
				<td>${ user.area }</td>
				<td>${ user.estado ?
						('<i class="fas fa-check text-success"></i>') :
						('<i class="fas fa-times text-danger"></i>')
					}
				</td>
				<td>
					<button
						type="button"
						onclick="modalChangeRole.openModalRole( ${ user.userid } )"
						class="btn btn-primary btn-sm"
					>
						<i class="fas fa-user"></i>
					</button>
					<button
						type="button"
						onclick="usersComponent.openModalConfirm( ${ user.userid } )"
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

	async render() {

		let usuarios = await UsersController.listarUsuarios();

		this.totalUsers.innerText = usuarios.length;

		if ( usuarios.length > 0 ) {

			showElement( this.pagination );

			this.tbody.innerHTML = usuarios.map(( user ) => this.getRowTable( user ))
				.join('');

		} else {

			hideElement( this.pagination );

			this.tbody.innerHTML = (`
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
