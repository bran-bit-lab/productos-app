const Modal = require('bootstrap/js/dist/modal'); // modal-boostrap
const fs = require('fs');

const info = document.querySelector('#info');
const footer = document.querySelector('#modals');

// ==========================================
// Users component
// ==========================================
class UsersComponent {

	constructor() {
		
		this.getModals();

		this.tbody = document.querySelector('#tbody-user');
		this.totalUsers = document.querySelector('#totalUsers');
		this.pagination = document.querySelector('#pagination');

		this.render = this.render.bind( this );
	}

	getModals() {

		try {

			let data = fs.readFileSync( 
				__dirname + '/users-modal/users-modal-component.html', 
				'utf-8'
			);

			footer.innerHTML = data;

		} catch ( error ) {
			
			console.error('no se puede extraer el archivo\n', error );
		}
	}

	editUser( id ) {
		console.log('edit');
	}

	deleteUser() {	
		console.log('delete');
	}

	changeRole() {
		console.log('changeRole');
	}

	render() {

		this.tbody.innerHTML = '';
		this.totalUsers.innerText = USERS.length;

		if ( USERS.length > 0 ) {

			this.pagination.style.display = 'block';

			USERS.forEach(( user ) => {

					this.tbody.innerHTML += (`
						<tr class="text-center">
							<td>${ user.id }</td>
							<td>${ user.nombre }</td>
							<td>${ user.apellido }</td>
							<td>${ user.correo }</td>
							<td>${ user.area }</td>
							<td>${ user.activo ? 
									'<i class="fas fa-check text-success"></i>' : '<i class="fas fa-times text-danger"></i>' 
								}
							</td>
							<td>
								<button 
									type="button" 
									onclick="modalUserComponent.openModal( 'edit', ${ user.id } )" 
									class="btn btn-primary btn-sm"
								>
									<i class="fas fa-edit"></i>
								</button>
								<button 
									type="button" 
									onclick="usersComponent.editUser( 'edit', ${ user.id } )" 
									class="btn btn-secondary btn-sm"
								>
									<i class="fas fa-user"></i>
								</button>
								<button 
									type="button" 
									onclick="usersComponent.deleteUser( 'delete', ${ user.id } )" 
									class="btn btn-danger btn-sm"
									data-bs-target=".modal-users" 
									data-bs-whatever="delete"
								>
									<i class="fas fa-trash"></i>
								</button>
							</td>
						</tr>
					`)
				} 
			);
		
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

const modalUserComponent = require('./users-modal/users-modal-component');

const userForm = document.forms['formUsers'];

document.addEventListener('DOMContentLoaded', usersComponent.render );

userForm.addEventListener('submit', modalUserComponent.getForm );