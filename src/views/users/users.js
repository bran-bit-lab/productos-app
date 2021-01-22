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

		// modals
		this.modalUsers = new Modal( footer.querySelector('.modal-users'), {
			backdrop: 'static'
		});
		
		this.render = this.render.bind( this );
	}

	getModals() {

		try {

			let data = fs.readFileSync( __dirname + '/users-modal/users-modal-component.html', 'utf-8');
			document.querySelector('#modals').innerHTML = data;

		} catch ( error ) {
			
			console.error('no se puede extraer el archivo\n', error );
		}
	}

	editUser( id ) {
		
		let found = USERS.find(( user ) => user.id === id );

		if ( found ) {
			console.log( found );
		}
	}

	deleteUser() {	
		console.log('delete');
	}

	changeRole() {
		console.log('changeRole');
	}

	closeModal() {
		this.modalUsers.hide();
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
									onclick="usersComponent.editUser( ${ user.id } )" 
									class="btn btn-primary btn-sm"
									data-bs-target=".modal-users" 
									data-bs-whatever="@edit"
									data-bs-toggle="modal"
								>
									<i class="fas fa-edit"></i>
								</button>
								<button 
									type="button" 
									onclick="usersComponent.editUser( ${ user.id } )" 
									class="btn btn-secondary btn-sm"
									data-bs-target=".modal-users" 
									data-bs-whatever="@edit"
									data-bs-toggle="modal"
								>
									<i class="fas fa-user"></i>
								</button>
								<button 
									type="button" 
									onclick="usersComponent.deleteUser( ${ user.id } )" 
									class="btn btn-danger btn-sm"
									data-bs-target=".modal-users" 
									data-bs-whatever="@delete"
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

require('./users-modal/users-modal-component');

document.addEventListener('DOMContentLoaded', usersComponent.render );