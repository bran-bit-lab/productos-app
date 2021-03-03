// =========================
// Carga de modulos JS
// =========================

const { remote } = require('electron');
const { UsersController } = remote.require('./controllers/users_controller');
const { readFileAssets } = remote.require('./util_functions/file');
const Modal = require('bootstrap/js/dist/modal');

// users
let USERS = [];
const footer = document.querySelector('#modals');
const info = document.querySelector('#info');
const pagination = document.querySelector('#pagination');

// components html

footer.innerHTML += readFileAssets( '/users/users-modal-form/users-modal-form-component.html' );
footer.innerHTML += readFileAssets( '/shared/modal-confirm/modal-confirm-component.html' );
footer.innerHTML += readFileAssets( '/users/users-modal-role/users-modal-role-component.html' );

pagination.innerHTML = readFileAssets( '/shared/pagination/pagination.html' );

const ModalUserComponent = require('./users-modal-form/users-modal-form-component');
const ModalConfirmComponent = require('../shared/modal-confirm/modal-confirm-component');
const ModalChangeRole = require('./users-modal-role/users-modal-role-component');
const PaginationComponent = require('../shared/pagination/pagination-component');

// ==========================================
// Users component
// ==========================================
class UsersComponent {

	constructor() {
		
		this.tbody = document.querySelector('#tbody-user');
		this.totalUsers = document.querySelector('#totalUsers');

		this.renderUsers = this.renderUsers.bind( this );
		this.deleteUser = this.deleteUser.bind( this );
		this.changeRole = this.changeRole.bind( this );
		this.getAllUsers = this.getAllUsers.bind( this );
	}

	async getAllUsers( $event, pagination = [ 0, 10 ] ) {
		
		try {
			
			USERS = await UsersController.listarUsuarios( pagination );

			let totalUsers = await UsersController.obtenerTotalUsuarios();

			sessionStorage.setItem('usersTable', JSON.stringify({ pagination }));

			this.renderUsers( 
				totalUsers['totalPaginas'], 
				totalUsers['totalRegistros'] 
			);
		
		} catch ( error ) {

			console.log('error en consulta');
		}

	}

	getUser( search ) {

		const rexp = /^[a-zA-Z\s]+$/;

		if ( !rexp.test( search ) ) {
			console.log('no concuerda con expresion regular');
			return;
		}

		console.log('valido');
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

		return this.getAllUsers( null, PaginationComponent.getPaginationStorage('usersTable') );
	}

	newUser( form ) {

		UsersController.crearUsuario( form );

		return this.getAllUsers( null, PaginationComponent.getPaginationStorage('usersTable') );
	}

	changeRole( user ) {

		UsersController.cambiarRolUsuarios({
			area: user.role,
			userid: user.id
		});

		return this.getAllUsers( null, PaginationComponent.getPaginationStorage('usersTable') );
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

		return ModalConfirmComponent.openModalConfirm( title, element, idUser );
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
						onclick="ModalChangeRole.openModalRole( ${ user.userid } )"
						class="btn btn-primary btn-sm"
					>
						<i class="fas fa-user"></i>
					</button>
					<button
						type="button"
						onclick="usersComponent.openModalConfirm( ${ user.userid } )"
						class="btn btn-danger btn-sm"
					>
						<i class="fas fa-trash"></i>
					</button>
				</td>
			</tr>
		`);
	}

	renderUsers( totalRegisters, totalPages ) {

		this.totalUsers.textContent = totalPages;
			
		PaginationComponent.setButtonsPagination( totalRegisters );
		
		if ( USERS.length > 0 ) {

			showElement( pagination );

			this.tbody.innerHTML = USERS.map(( user ) => this.getRowTable( user ))
				.join('');

		} else {

			hideElement( pagination );

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

// ============================
// Binding
// ============================
const closeModalConfirm =  ModalConfirmComponent.closeModalConfirm.bind(
	usersComponent.deleteUser
);

const renderPagination = PaginationComponent.renderPagination.bind(
	usersComponent.getAllUsers
)

// =============================
// Events
// =============================

userForm.addEventListener('submit', ModalUserComponent.getForm.bind(
	usersComponent
));

changeRoleForm.addEventListener('submit', ModalChangeRole.getForm.bind(
	usersComponent
));

document.addEventListener('DOMContentLoaded', usersComponent.getAllUsers );
