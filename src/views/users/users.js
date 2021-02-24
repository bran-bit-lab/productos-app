// remote
const { remote } = require('electron');
const { UsersController } = remote.require('./controllers/users_controller');
const { readFileAssets } = remote.require('./util_functions/file');

const footer = document.querySelector('#modals');

// components html
footer.innerHTML += readFileAssets( '/users/users-modal-form/users-modal-form-component.html' );
footer.innerHTML += readFileAssets( '/shared/modal-confirm/modal-confirm-component.html' );
footer.innerHTML += readFileAssets( '/users/users-modal-role/users-modal-role-component.html' );

const Modal = require('bootstrap/js/dist/modal');
const info = document.querySelector('#info');

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

		this.pagNavigation = 1;

		this.renderUsers = this.renderUsers.bind( this );
		this.deleteUser = this.deleteUser.bind( this );
		this.changeRole = this.changeRole.bind( this );
	}

	async getAllUsers( pagination = [ 0, 10 ] ) {
		return await UsersController.listarUsuarios( pagination );
	}

	getUser( search ) {

		const rexp = /^[a-zA-Z\s]+$/;

		if ( !rexp.test( search ) ) {
			console.log('no concuerda con expresion regular');
			return;
		}

		console.log('valido');
	}

	changePagination( element, index ) {
		this.renderPagination( element, index );
	}

	deleteUser({ id, confirm }) {

		if ( !confirm ) {
			return;
		}

		let found = USERS.find(( user ) => user.userid === id );

		UsersController.cambiarEstadoUsuarios({
			estado: !found.estado,
			userid: id
		});

		return this.render();
	}

	newUser( form ) {

		UsersController.crearUsuario( form );

		return this.render();
	}

	changeRole( user ) {

		UsersController.cambiarRolUsuarios({
			area: user.role,
			userid: user.id
		});

		return this.render();
	}

	openModalConfirm( idUser = null ) {

		let found = USERS.find(( user ) => user.userid === idUser );
		let title = `${ found.estado ? 'Remover' : 'Otorgar' } acceso al usuario ${ idUser }`;

		// description
		let element = (`
			<p class="text-center">
				¿¿Esta seguro de ${ found.estado ? 'remover' : 'otorgar' } acceso al usuario a
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

	async renderUsers() {

		USERS = await this.getAllUsers();

		if ( USERS.length > 0 ) {

			showElement( this.pagination );

			this.tbody.innerHTML = USERS.map(( user ) => this.getRowTable( user ))
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

	renderPagination( element, index ) {

		const items = [
			...document.querySelector('.pagination').querySelectorAll('li')
		];

		items.forEach(( item ) => {
			if ( item.classList.contains('active') ) {
				item.classList.toggle('active');
			}
		});

		element.classList.toggle('active');
	}
}

const usersComponent = new UsersComponent();
const userForm = document.forms['formUsers'];
const changeRoleForm = document.forms['user-change-role-form'];

// esta variable es usada en el html para confirmar la eliminacion
const closeModalConfirm =  modalConfirmComponent.closeModalConfirm.bind(
	usersComponent.deleteUser
);

userForm.addEventListener('submit', modalUserComponent.getForm.bind(
	usersComponent
));

changeRoleForm.addEventListener('submit', modalChangeRole.getForm.bind(
	usersComponent
));

document.addEventListener('DOMContentLoaded', usersComponent.renderUsers );
